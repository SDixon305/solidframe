-- Onboarding Progress table: Tracks tenant setup wizard completion
-- Stores progress through multi-step onboarding flow

CREATE TABLE IF NOT EXISTS onboarding_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
    current_step TEXT NOT NULL DEFAULT 'welcome', -- Current wizard step identifier
    completed_steps TEXT[] NOT NULL DEFAULT '{}', -- Array of completed step identifiers
    data JSONB NOT NULL DEFAULT '{}',             -- Collected onboarding data (business info, preferences)
    is_complete BOOLEAN NOT NULL DEFAULT false,   -- Whether onboarding is finished
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,                     -- When onboarding was completed
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment on table
COMMENT ON TABLE onboarding_progress IS 'Tracks tenant setup wizard completion and collected data';
COMMENT ON COLUMN onboarding_progress.current_step IS 'Current wizard step: welcome, business_info, tool_selection, configuration, complete';
COMMENT ON COLUMN onboarding_progress.completed_steps IS 'Array of step identifiers that have been completed';
COMMENT ON COLUMN onboarding_progress.data IS 'Collected onboarding data: business info, preferences, initial configs';

-- Indexes
CREATE INDEX idx_onboarding_tenant_id ON onboarding_progress(tenant_id);
CREATE INDEX idx_onboarding_is_complete ON onboarding_progress(is_complete);
CREATE INDEX idx_onboarding_incomplete ON onboarding_progress(tenant_id) WHERE is_complete = false;

-- Enable RLS
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Placeholder policies
CREATE POLICY "Allow authenticated read" ON onboarding_progress
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON onboarding_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON onboarding_progress
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON onboarding_progress
    FOR DELETE
    TO authenticated
    USING (true);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_onboarding_progress_updated_at
    BEFORE UPDATE ON onboarding_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
