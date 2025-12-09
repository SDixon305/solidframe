-- Tenant Tools table: Junction table linking tenants to their enabled tools
-- Controls which tools each tenant has access to and their active version

CREATE TABLE IF NOT EXISTS tenant_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,      -- Whether tenant currently has tool enabled
    version_id UUID REFERENCES tool_versions(id) ON DELETE SET NULL,  -- Pinned version (null = latest)
    activated_at TIMESTAMPTZ DEFAULT NOW(),       -- When tool was first activated for tenant
    deactivated_at TIMESTAMPTZ,                   -- When tool was deactivated (null = active)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, tool_id)
);

-- Comment on table
COMMENT ON TABLE tenant_tools IS 'Links tenants to their enabled tools with version pinning';
COMMENT ON COLUMN tenant_tools.version_id IS 'Pin to specific version; null means use latest active version';

-- Indexes
CREATE INDEX idx_tenant_tools_tenant_id ON tenant_tools(tenant_id);
CREATE INDEX idx_tenant_tools_tool_id ON tenant_tools(tool_id);
CREATE INDEX idx_tenant_tools_is_active ON tenant_tools(is_active);
CREATE INDEX idx_tenant_tools_tenant_active ON tenant_tools(tenant_id, is_active);

-- Enable RLS
ALTER TABLE tenant_tools ENABLE ROW LEVEL SECURITY;

-- Placeholder policies
CREATE POLICY "Allow authenticated read" ON tenant_tools
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON tenant_tools
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON tenant_tools
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON tenant_tools
    FOR DELETE
    TO authenticated
    USING (true);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_tenant_tools_updated_at
    BEFORE UPDATE ON tenant_tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tenant Tool Configs table: Per-tenant configuration for each tool
-- Stores tool-specific settings (phone numbers, prompts, schedules, etc.)

CREATE TABLE IF NOT EXISTS tenant_tool_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    config JSONB NOT NULL DEFAULT '{}',           -- Tool-specific configuration JSON
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, tool_id)
);

-- Comment on table
COMMENT ON TABLE tenant_tool_configs IS 'Per-tenant configuration for each tool (phone numbers, prompts, etc.)';
COMMENT ON COLUMN tenant_tool_configs.config IS 'JSON containing tool-specific settings validated against tool_versions.config_schema';

-- Indexes
CREATE INDEX idx_tenant_tool_configs_tenant_id ON tenant_tool_configs(tenant_id);
CREATE INDEX idx_tenant_tool_configs_tool_id ON tenant_tool_configs(tool_id);
CREATE INDEX idx_tenant_tool_configs_tenant_tool ON tenant_tool_configs(tenant_id, tool_id);

-- Enable RLS
ALTER TABLE tenant_tool_configs ENABLE ROW LEVEL SECURITY;

-- Placeholder policies
CREATE POLICY "Allow authenticated read" ON tenant_tool_configs
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON tenant_tool_configs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON tenant_tool_configs
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON tenant_tool_configs
    FOR DELETE
    TO authenticated
    USING (true);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_tenant_tool_configs_updated_at
    BEFORE UPDATE ON tenant_tool_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
