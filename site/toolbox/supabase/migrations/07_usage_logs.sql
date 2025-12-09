-- Usage Logs table: Event log for tool usage analytics
-- Tracks all tool interactions for billing, analytics, and debugging

CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,  -- Nullable for general events
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- Who triggered the event (if known)
    event_type TEXT NOT NULL,                     -- Event identifier (e.g., "call_completed", "message_sent")
    metadata JSONB DEFAULT '{}',                  -- Event-specific data (duration, cost, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment on table
COMMENT ON TABLE usage_logs IS 'Event log for tool usage analytics, billing, and debugging';
COMMENT ON COLUMN usage_logs.event_type IS 'Event identifier: call_started, call_completed, message_sent, etc.';
COMMENT ON COLUMN usage_logs.metadata IS 'Event-specific data like call duration, cost, recipient, etc.';

-- Indexes for common query patterns
CREATE INDEX idx_usage_logs_tenant_id ON usage_logs(tenant_id);
CREATE INDEX idx_usage_logs_tool_id ON usage_logs(tool_id);
CREATE INDEX idx_usage_logs_event_type ON usage_logs(event_type);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX idx_usage_logs_tenant_created ON usage_logs(tenant_id, created_at DESC);
CREATE INDEX idx_usage_logs_tenant_tool_created ON usage_logs(tenant_id, tool_id, created_at DESC);

-- Enable RLS
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Placeholder policies
CREATE POLICY "Allow authenticated read" ON usage_logs
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON usage_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- No update/delete policies - usage logs are append-only
-- Updates and deletes should be done by service role only
