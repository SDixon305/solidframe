// Admin API for managing tenant subscriptions
// Requires super_admin role

import { createClient } from '@/utils/supabase/server'
import { requireRole } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import {
    isStripeConfigured,
    createStripeCustomer,
    createSubscription,
    cancelSubscription,
    resumeSubscription,
    getSubscription,
    createBillingPortalSession,
} from '@/lib/stripe'
import type { ApiResponse } from '@/types/tools'

interface RouteParams {
    params: Promise<{ id: string }>
}

// Subscription data from database
interface DbSubscription {
    id: string
    tenant_id: string
    stripe_subscription_id: string | null
    stripe_price_id: string | null
    status: string
    current_period_start: string | null
    current_period_end: string | null
    cancel_at_period_end: boolean
    canceled_at: string | null
    trial_end: string | null
    created_at: string
    updated_at: string
}

// GET /api/admin/tenants/[id]/subscription - Get subscription status
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await requireRole('super_admin')

        const { id: tenantId } = await params
        const supabase = await createClient()

        // Get tenant with subscription
        const { data: tenant, error: tenantError } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', tenantId)
            .single()

        if (tenantError || !tenant) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Tenant not found' },
                { status: 404 }
            )
        }

        // Get subscription from database
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        // Get live Stripe data if configured and subscription exists
        let stripeData = null
        if (isStripeConfigured() && subscription?.stripe_subscription_id) {
            stripeData = await getSubscription(subscription.stripe_subscription_id)
        }

        return NextResponse.json<ApiResponse<{
            tenant: typeof tenant
            subscription: DbSubscription | null
            stripe: typeof stripeData
        }>>({
            success: true,
            data: {
                tenant,
                subscription,
                stripe: stripeData,
            },
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        const status = message.includes('required') ? 403 : 500
        return NextResponse.json<ApiResponse>(
            { success: false, error: message },
            { status }
        )
    }
}

// POST /api/admin/tenants/[id]/subscription - Create or manage subscription
export async function POST(request: Request, { params }: RouteParams) {
    try {
        await requireRole('super_admin')

        const { id: tenantId } = await params
        const body = await request.json()
        const { action, priceId, trialDays } = body

        if (!isStripeConfigured()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Stripe is not configured' },
                { status: 503 }
            )
        }

        const supabase = await createClient()

        // Get tenant
        const { data: tenant, error: tenantError } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', tenantId)
            .single()

        if (tenantError || !tenant) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Tenant not found' },
                { status: 404 }
            )
        }

        switch (action) {
            case 'create_customer': {
                // Create a Stripe customer for the tenant
                if (tenant.stripe_customer_id) {
                    return NextResponse.json<ApiResponse>(
                        { success: false, error: 'Tenant already has a Stripe customer' },
                        { status: 400 }
                    )
                }

                // Get primary user email for the tenant
                const { data: primaryUser } = await supabase
                    .from('users')
                    .select('email')
                    .eq('tenant_id', tenantId)
                    .limit(1)
                    .single()

                const customer = await createStripeCustomer(
                    primaryUser?.email || `${tenant.slug}@solidframe.ai`,
                    tenant.name,
                    { tenant_id: tenantId }
                )

                // Update tenant with customer ID
                await supabase
                    .from('tenants')
                    .update({ stripe_customer_id: customer.id })
                    .eq('id', tenantId)

                return NextResponse.json<ApiResponse>({
                    success: true,
                    data: { customer_id: customer.id },
                    message: 'Stripe customer created',
                })
            }

            case 'create_subscription': {
                // Create a new subscription
                if (!tenant.stripe_customer_id) {
                    return NextResponse.json<ApiResponse>(
                        { success: false, error: 'Tenant must have a Stripe customer first' },
                        { status: 400 }
                    )
                }

                if (!priceId) {
                    return NextResponse.json<ApiResponse>(
                        { success: false, error: 'priceId is required' },
                        { status: 400 }
                    )
                }

                const subscription = await createSubscription(
                    tenant.stripe_customer_id,
                    priceId,
                    {
                        trialDays,
                        metadata: { tenant_id: tenantId },
                    }
                )

                return NextResponse.json<ApiResponse>({
                    success: true,
                    data: { subscription_id: subscription.id, status: subscription.status },
                    message: 'Subscription created (webhook will sync full data)',
                })
            }

            case 'cancel': {
                // Cancel subscription
                const { data: sub } = await supabase
                    .from('subscriptions')
                    .select('stripe_subscription_id')
                    .eq('tenant_id', tenantId)
                    .single()

                if (!sub?.stripe_subscription_id) {
                    return NextResponse.json<ApiResponse>(
                        { success: false, error: 'No active subscription found' },
                        { status: 400 }
                    )
                }

                const immediately = body.immediately === true
                const canceled = await cancelSubscription(sub.stripe_subscription_id, { immediately })

                return NextResponse.json<ApiResponse>({
                    success: true,
                    data: { status: canceled.status, cancel_at_period_end: canceled.cancel_at_period_end },
                    message: immediately ? 'Subscription canceled immediately' : 'Subscription will cancel at period end',
                })
            }

            case 'resume': {
                // Resume a subscription that was set to cancel
                const { data: sub } = await supabase
                    .from('subscriptions')
                    .select('stripe_subscription_id')
                    .eq('tenant_id', tenantId)
                    .single()

                if (!sub?.stripe_subscription_id) {
                    return NextResponse.json<ApiResponse>(
                        { success: false, error: 'No subscription found' },
                        { status: 400 }
                    )
                }

                const resumed = await resumeSubscription(sub.stripe_subscription_id)

                return NextResponse.json<ApiResponse>({
                    success: true,
                    data: { status: resumed.status },
                    message: 'Subscription resumed',
                })
            }

            case 'billing_portal': {
                // Create a billing portal session
                if (!tenant.stripe_customer_id) {
                    return NextResponse.json<ApiResponse>(
                        { success: false, error: 'Tenant has no Stripe customer' },
                        { status: 400 }
                    )
                }

                const returnUrl = body.returnUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
                const session = await createBillingPortalSession(tenant.stripe_customer_id, returnUrl)

                return NextResponse.json<ApiResponse>({
                    success: true,
                    data: { url: session.url },
                })
            }

            default:
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'Invalid action. Use: create_customer, create_subscription, cancel, resume, billing_portal' },
                    { status: 400 }
                )
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        const status = message.includes('required') ? 403 : 500
        return NextResponse.json<ApiResponse>(
            { success: false, error: message },
            { status }
        )
    }
}

// PATCH /api/admin/tenants/[id]/subscription - Update subscription (sync from Stripe)
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        await requireRole('super_admin')

        const { id: tenantId } = await params
        const supabase = await createClient()

        // Get subscription
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('stripe_subscription_id')
            .eq('tenant_id', tenantId)
            .single()

        if (!subscription?.stripe_subscription_id) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No subscription found' },
                { status: 404 }
            )
        }

        if (!isStripeConfigured()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Stripe is not configured' },
                { status: 503 }
            )
        }

        // Fetch fresh data from Stripe
        const stripeSubscription = await getSubscription(subscription.stripe_subscription_id)

        if (!stripeSubscription) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Subscription not found in Stripe' },
                { status: 404 }
            )
        }

        // Update local database
        const { data: updated, error } = await supabase
            .from('subscriptions')
            .update({
                status: stripeSubscription.status,
                current_period_start: stripeSubscription.current_period_start
                    ? new Date(stripeSubscription.current_period_start * 1000).toISOString()
                    : null,
                current_period_end: stripeSubscription.current_period_end
                    ? new Date(stripeSubscription.current_period_end * 1000).toISOString()
                    : null,
                cancel_at_period_end: stripeSubscription.cancel_at_period_end,
                canceled_at: stripeSubscription.canceled_at
                    ? new Date(stripeSubscription.canceled_at * 1000).toISOString()
                    : null,
            })
            .eq('tenant_id', tenantId)
            .select()
            .single()

        if (error) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            data: updated,
            message: 'Subscription synced from Stripe',
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        const status = message.includes('required') ? 403 : 500
        return NextResponse.json<ApiResponse>(
            { success: false, error: message },
            { status }
        )
    }
}
