// Stripe webhook handler for SolidFrame
// Handles subscription lifecycle events

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { verifyWebhookSignature, mapStripeStatus, isStripeConfigured } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

// Disable body parsing - we need the raw body for signature verification
export const dynamic = 'force-dynamic'

// POST /api/webhooks/stripe - Handle Stripe webhook events
export async function POST(request: Request) {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
        console.warn('Stripe webhook received but Stripe is not configured')
        return NextResponse.json(
            { received: true, processed: false, reason: 'Stripe not configured' },
            { status: 200 }
        )
    }

    // Get the raw body and signature
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
        console.error('Missing stripe-signature header')
        return NextResponse.json(
            { error: 'Missing signature' },
            { status: 400 }
        )
    }

    // Verify the webhook signature
    const event = verifyWebhookSignature(body, signature)
    if (!event) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        )
    }

    console.log(`[Stripe Webhook] Received event: ${event.type}`)

    const supabase = await createClient()

    try {
        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(supabase, event.data.object as Stripe.Subscription)
                break

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(supabase, event.data.object as Stripe.Subscription)
                break

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription)
                break

            case 'invoice.paid':
                await handleInvoicePaid(supabase, event.data.object as Stripe.Invoice)
                break

            case 'invoice.payment_failed':
                await handlePaymentFailed(supabase, event.data.object as Stripe.Invoice)
                break

            default:
                console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true, processed: true })
    } catch (error) {
        console.error(`[Stripe Webhook] Error processing ${event.type}:`, error)
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        )
    }
}

// Handle subscription.created - New subscription activated
async function handleSubscriptionCreated(
    supabase: Awaited<ReturnType<typeof createClient>>,
    subscription: Stripe.Subscription
) {
    console.log(`[Stripe] Subscription created: ${subscription.id}`)

    const customerId = subscription.customer as string

    // Find the tenant by stripe_customer_id
    const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

    if (!tenant) {
        console.error(`[Stripe] No tenant found for customer: ${customerId}`)
        return
    }

    // Get the price ID from the subscription
    const priceId = subscription.items.data[0]?.price?.id || null

    // Create or update subscription record
    const { error } = await supabase
        .from('subscriptions')
        .upsert({
            tenant_id: tenant.id,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            status: mapStripeStatus(subscription.status),
            current_period_start: subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000).toISOString()
                : null,
            current_period_end: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
            trial_end: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
        }, {
            onConflict: 'stripe_subscription_id',
        })

    if (error) {
        console.error('[Stripe] Error creating subscription record:', error)
        throw error
    }

    // Ensure tenant is active
    await supabase
        .from('tenants')
        .update({ status: 'active' })
        .eq('id', tenant.id)

    console.log(`[Stripe] Subscription record created for tenant: ${tenant.id}`)
}

// Handle subscription.updated - Subscription status changed
async function handleSubscriptionUpdated(
    supabase: Awaited<ReturnType<typeof createClient>>,
    subscription: Stripe.Subscription
) {
    console.log(`[Stripe] Subscription updated: ${subscription.id}, status: ${subscription.status}`)

    const { error } = await supabase
        .from('subscriptions')
        .update({
            status: mapStripeStatus(subscription.status),
            current_period_start: subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000).toISOString()
                : null,
            current_period_end: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000).toISOString()
                : null,
        })
        .eq('stripe_subscription_id', subscription.id)

    if (error) {
        console.error('[Stripe] Error updating subscription:', error)
        throw error
    }

    console.log(`[Stripe] Subscription updated successfully`)
}

// Handle subscription.deleted - Subscription cancelled
async function handleSubscriptionDeleted(
    supabase: Awaited<ReturnType<typeof createClient>>,
    subscription: Stripe.Subscription
) {
    console.log(`[Stripe] Subscription deleted: ${subscription.id}`)

    // Update subscription status
    const { data: subRecord, error: subError } = await supabase
        .from('subscriptions')
        .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)
        .select('tenant_id')
        .single()

    if (subError) {
        console.error('[Stripe] Error updating subscription:', subError)
        throw subError
    }

    // Suspend the tenant
    if (subRecord?.tenant_id) {
        await supabase
            .from('tenants')
            .update({ status: 'suspended' })
            .eq('id', subRecord.tenant_id)

        // Create an alert for the admin
        await supabase
            .from('alerts')
            .insert({
                tenant_id: subRecord.tenant_id,
                type: 'subscription_canceled',
                title: 'Subscription Canceled',
                message: `Subscription ${subscription.id} has been canceled. Tenant has been suspended.`,
                read: false,
            })

        console.log(`[Stripe] Tenant ${subRecord.tenant_id} suspended due to subscription cancellation`)
    }
}

// Handle invoice.paid - Payment successful
async function handleInvoicePaid(
    supabase: Awaited<ReturnType<typeof createClient>>,
    invoice: Stripe.Invoice
) {
    console.log(`[Stripe] Invoice paid: ${invoice.id}`)

    if (!invoice.subscription) {
        console.log('[Stripe] Invoice has no subscription, skipping')
        return
    }

    // Ensure subscription is marked as active
    const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('stripe_subscription_id', invoice.subscription as string)

    if (error) {
        console.error('[Stripe] Error updating subscription status:', error)
    }

    // Log the payment in usage_logs for audit trail
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('tenant_id')
        .eq('stripe_subscription_id', invoice.subscription as string)
        .single()

    if (sub?.tenant_id) {
        await supabase
            .from('usage_logs')
            .insert({
                tenant_id: sub.tenant_id,
                tool_id: null,  // Not tool-specific
                event_type: 'payment_received',
                metadata: {
                    invoice_id: invoice.id,
                    amount: invoice.amount_paid,
                    currency: invoice.currency,
                },
            })
    }
}

// Handle invoice.payment_failed - Payment failed
async function handlePaymentFailed(
    supabase: Awaited<ReturnType<typeof createClient>>,
    invoice: Stripe.Invoice
) {
    console.log(`[Stripe] Invoice payment failed: ${invoice.id}`)

    if (!invoice.subscription) {
        console.log('[Stripe] Invoice has no subscription, skipping')
        return
    }

    // Update subscription to past_due
    const { data: subRecord, error } = await supabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_subscription_id', invoice.subscription as string)
        .select('tenant_id')
        .single()

    if (error) {
        console.error('[Stripe] Error updating subscription status:', error)
        throw error
    }

    // Create an alert for the admin
    if (subRecord?.tenant_id) {
        await supabase
            .from('alerts')
            .insert({
                tenant_id: subRecord.tenant_id,
                type: 'payment_failed',
                title: 'Payment Failed',
                message: `Payment failed for invoice ${invoice.id}. Amount: ${invoice.amount_due / 100} ${invoice.currency?.toUpperCase()}`,
                read: false,
            })

        console.log(`[Stripe] Alert created for failed payment on tenant ${subRecord.tenant_id}`)
    }
}
