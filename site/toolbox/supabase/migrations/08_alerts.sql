-- Alerts table: System and tool notifications for tenants
-- Used for billing alerts, tool errors, important updates, etc.

CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type TEXT NOT NULL                            -- Alert category
        CHECK (type IN ('info', 'warning', 'error', 'success', 'billing', 'system')),
    title TEXT NOT NULL,                          -- Short alert title
    message TEXT,                                 -- Detailed alert message
    action_url TEXT,                              -- Optional link for alert action
    is_read BOOLEAN NOT NULL DEFAULT false,       -- Whether alert has been seen
    dismissed BOOLEAN NOT NULL DEFAULT false,     -- Whether alert has been dismissed
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    read_at TIMESTAMPTZ,                          -- When alert was marked as read
    dismissed_at TIMESTAMPTZ                      -- When alert was dismissed
);

-- Comment on table
COMMENT ON TABLE alerts IS 'System and tool notifications for tenant dashboard';
COMMENT ON COLUMN alerts.type IS 'Alert category: info, warning, error, success, billing, system';
COMMENT ON COLUMN alerts.is_read IS 'Whether the alert has been viewed by the user';

-- Indexes
CREATE INDEX idx_alerts_tenant_id ON alerts(tenant_id);
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_read ON alerts(is_read);
CREATE INDEX idx_alerts_tenant_unread ON alerts(tenant_id, is_read) WHERE is_read = false;
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);

-- Enable RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Placeholder policies
CREATE POLICY "Allow authenticated read" ON alerts
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON alerts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON alerts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON alerts
    FOR DELETE
    TO authenticated
    USING (true);
