-- Tools table: Master catalog of all SolidFrame automation tools
-- Tool definitions are global; tenant access is controlled via tenant_tools

CREATE TABLE IF NOT EXISTS tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,                    -- URL-safe identifier (e.g., "after-hours-agent")
    name TEXT NOT NULL,                           -- Display name (e.g., "After Hours Agent")
    description TEXT,                             -- Tool description for UI
    icon TEXT,                                    -- Icon identifier (e.g., "phone", "message")
    category TEXT NOT NULL DEFAULT 'automation'   -- 'voice', 'messaging', 'scheduling', 'marketing', 'automation'
        CHECK (category IN ('voice', 'messaging', 'scheduling', 'marketing', 'automation')),
    is_real BOOLEAN NOT NULL DEFAULT false,       -- true = actually implemented, false = coming soon
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment on table
COMMENT ON TABLE tools IS 'Master catalog of SolidFrame automation tools available to tenants';
COMMENT ON COLUMN tools.is_real IS 'Whether the tool is actually implemented or just a placeholder';

-- Indexes
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_is_real ON tools(is_real);

-- Enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Placeholder policies (tools are globally readable)
CREATE POLICY "Allow authenticated read" ON tools
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON tools
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON tools
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON tools
    FOR DELETE
    TO authenticated
    USING (true);

-- Tool Versions table: Version history for tool configurations
-- Allows rollbacks, canary rollouts, and per-tenant version pinning

CREATE TABLE IF NOT EXISTS tool_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    version TEXT NOT NULL,                        -- Semantic version (e.g., "1.0.0")
    config_schema JSONB,                          -- JSON Schema for tool configuration
    status TEXT NOT NULL DEFAULT 'draft'          -- 'draft', 'active', 'deprecated'
        CHECK (status IN ('draft', 'active', 'deprecated')),
    rollout_pct INTEGER DEFAULT 100               -- Percentage of tenants receiving this version (0-100)
        CHECK (rollout_pct >= 0 AND rollout_pct <= 100),
    changelog TEXT,                               -- Description of changes in this version
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tool_id, version)
);

-- Comment on table
COMMENT ON TABLE tool_versions IS 'Version history for tool configurations enabling safe deployments';
COMMENT ON COLUMN tool_versions.rollout_pct IS 'Canary rollout: percentage of tenants receiving this version';

-- Indexes
CREATE INDEX idx_tool_versions_tool_id ON tool_versions(tool_id);
CREATE INDEX idx_tool_versions_status ON tool_versions(status);
CREATE INDEX idx_tool_versions_tool_status ON tool_versions(tool_id, status);

-- Enable RLS
ALTER TABLE tool_versions ENABLE ROW LEVEL SECURITY;

-- Placeholder policies
CREATE POLICY "Allow authenticated read" ON tool_versions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON tool_versions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON tool_versions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON tool_versions
    FOR DELETE
    TO authenticated
    USING (true);
