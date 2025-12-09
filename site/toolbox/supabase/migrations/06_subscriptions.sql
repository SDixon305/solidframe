-- Subscriptions table: Tracks Stripe subscription status for each tenant
-- Synced via Stripe webhooks to keep billing state current

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,           -- Stripe subscription ID (sub_xxx)
    stripe_price_id TEXT,                         -- Stripe price ID for the subscription
    status TEXT NOT NULL DEFAULT 'trialing'       -- Stripe subscription status
        CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused')),
    current_period_start TIMESTAMPTZ,             -- Start of current billing period
    current_period_end TIMESTAMPTZ,               -- End of current billing period
    cancel_at_period_end BOOLEAN DEFAULT false,   -- If true, subscription ends at period end
    canceled_at TIMESTAMPTZ,                      -- When subscription was canceled
    trial_end TIMESTAMPTZ,                        -- When trial period ends
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment on table
COMMENT ON TABLE subscriptions IS 'Stripe subscription tracking for tenant billing';
COMMENT ON COLUMN subscriptions.status IS 'Synced from Stripe webhook events';

-- Indexes
CREATE INDEX idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Placeholder policies
CREATE POLICY "Allow authenticated read" ON subscriptions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON subscriptions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON subscriptions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON subscriptions
    FOR DELETE
    TO authenticated
    USING (true);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
