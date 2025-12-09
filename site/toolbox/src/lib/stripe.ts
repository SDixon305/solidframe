// Stripe client initialization for SolidFrame
// Used for subscription management and billing

import Stripe from 'stripe'

// Lazy-initialized Stripe client
// Only created when actually used (requires STRIPE_SECRET_KEY)
let _stripe: Stripe | null = null

function getStripeClient(): Stripe {
    if (!_stripe) {
        const apiKey = process.env.STRIPE_SECRET_KEY
        if (!apiKey) {
            throw new Error('STRIPE_SECRET_KEY environment variable is not set')
        }
        _stripe = new Stripe(apiKey, {
            apiVersion: '2025-02-24.acacia',
            typescript: true,
        })
    }
    return _stripe
}

// Export a getter instead of direct client to allow lazy initialization
export const stripe = {
    get client(): Stripe {
        return getStripeClient()
    },
}

// Stripe webhook secret for verifying signatures
// Requires STRIPE_WEBHOOK_SECRET environment variable
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

// Subscription status type matching Stripe's statuses
export type StripeSubscriptionStatus =
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid'
    | 'incomplete'
    | 'incomplete_expired'
    | 'paused'

// Map Stripe status to our database status
export function mapStripeStatus(status: Stripe.Subscription.Status): StripeSubscriptionStatus {
    return status as StripeSubscriptionStatus
}

// Webhook event types we handle
export type StripeWebhookEvent =
    | 'customer.subscription.created'
    | 'customer.subscription.updated'
    | 'customer.subscription.deleted'
    | 'invoice.paid'
    | 'invoice.payment_failed'

// Create a Stripe customer for a new tenant
export async function createStripeCustomer(
    email: string,
    name: string,
    metadata?: Record<string, string>
): Promise<Stripe.Customer> {
    return stripe.client.customers.create({
        email,
        name,
        metadata: {
            source: 'solidframe_toolbox',
            ...metadata,
        },
    })
}

// Get a Stripe customer by ID
export async function getStripeCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
        const customer = await stripe.client.customers.retrieve(customerId)
        if (customer.deleted) return null
        return customer
    } catch {
        return null
    }
}

// Create a subscription for a customer
export async function createSubscription(
    customerId: string,
    priceId: string,
    options?: {
        trialDays?: number
        metadata?: Record<string, string>
    }
): Promise<Stripe.Subscription> {
    return stripe.client.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: options?.trialDays,
        metadata: options?.metadata,
    })
}

// Cancel a subscription
export async function cancelSubscription(
    subscriptionId: string,
    options?: {
        immediately?: boolean
    }
): Promise<Stripe.Subscription> {
    if (options?.immediately) {
        return stripe.client.subscriptions.cancel(subscriptionId)
    }
    return stripe.client.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
    })
}

// Resume a canceled subscription (if cancel_at_period_end was true)
export async function resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return stripe.client.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
    })
}

// Get subscription by ID
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
        return await stripe.client.subscriptions.retrieve(subscriptionId)
    } catch {
        return null
    }
}

// List all subscriptions for a customer
export async function listCustomerSubscriptions(
    customerId: string
): Promise<Stripe.Subscription[]> {
    const subscriptions = await stripe.client.subscriptions.list({
        customer: customerId,
        limit: 100,
    })
    return subscriptions.data
}

// Verify webhook signature
export function verifyWebhookSignature(
    payload: string | Buffer,
    signature: string
): Stripe.Event | null {
    if (!stripeWebhookSecret) {
        console.error('Stripe webhook secret not configured')
        return null
    }

    try {
        return stripe.client.webhooks.constructEvent(payload, signature, stripeWebhookSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return null
    }
}

// Create a billing portal session for customer self-service
export async function createBillingPortalSession(
    customerId: string,
    returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
    return stripe.client.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    })
}

// Check if Stripe is properly configured
export function isStripeConfigured(): boolean {
    return Boolean(process.env.STRIPE_SECRET_KEY)
}
