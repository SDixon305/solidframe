-- Tenants table: Core entity representing each HVAC/trades business customer
-- Each tenant gets their own isolated toolbox portal with data separation via RLS

CREATE TABLE IF NOT EXISTS tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,                           -- Business display name (e.g., "Acme HVAC")
    slug TEXT NOT NULL UNIQUE,                    -- URL-safe identifier (e.g., "acme-hvac")
    logo_url TEXT,                                -- Optional business logo for branding
    status TEXT NOT NULL DEFAULT 'active'         -- 'active', 'suspended', 'churned'
        CHECK (status IN ('active', 'suspended', 'churned')),
    stripe_customer_id TEXT,                      -- Stripe customer ID for billing
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment on table
COMMENT ON TABLE tenants IS 'Multi-tenant businesses using the SolidFrame toolbox platform';

-- Indexes
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_stripe_customer ON tenants(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Placeholder policies (will tighten in task 3)
-- Allow all authenticated users to read tenants for now
CREATE POLICY "Allow authenticated read" ON tenants
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON tenants
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON tenants
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON tenants
    FOR DELETE
    TO authenticated
    USING (true);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
