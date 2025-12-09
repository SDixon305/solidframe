-- Users table: People who can access a tenant's toolbox portal
-- Links to Supabase Auth via auth_id for authentication

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'             -- 'super_admin', 'admin', 'user'
        CHECK (role IN ('super_admin', 'admin', 'user')),
    auth_id UUID,                                 -- Links to auth.users.id (Supabase Auth)
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment on table
COMMENT ON TABLE users IS 'Users with access to tenant toolbox portals. Linked to Supabase Auth.';
COMMENT ON COLUMN users.role IS 'super_admin: SolidFrame staff, admin: tenant owner, user: tenant employee';
COMMENT ON COLUMN users.auth_id IS 'Foreign key to auth.users.id for Supabase Auth integration';

-- Indexes
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id) WHERE auth_id IS NOT NULL;
CREATE UNIQUE INDEX idx_users_tenant_email ON users(tenant_id, email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Placeholder policies (will tighten in task 3)
CREATE POLICY "Allow authenticated read" ON users
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON users
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON users
    FOR DELETE
    TO authenticated
    USING (true);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
