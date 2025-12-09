-- RLS Policies: Multi-tenant data isolation
-- Replaces placeholder "allow all" policies with proper tenant-isolation policies
-- Run after all table migrations are complete

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get the tenant_id for the currently authenticated user
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION get_user_tenant_id() IS 'Returns tenant_id for current authenticated user';

-- Check if the current user is a super_admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND role = 'super_admin'
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_super_admin() IS 'Returns true if current user is a super_admin';

-- ============================================================================
-- DROP EXISTING PLACEHOLDER POLICIES
-- ============================================================================

-- tenants table
DROP POLICY IF EXISTS "Allow authenticated read" ON tenants;
DROP POLICY IF EXISTS "Allow authenticated insert" ON tenants;
DROP POLICY IF EXISTS "Allow authenticated update" ON tenants;
DROP POLICY IF EXISTS "Allow authenticated delete" ON tenants;

-- users table
DROP POLICY IF EXISTS "Allow authenticated read" ON users;
DROP POLICY IF EXISTS "Allow authenticated insert" ON users;
DROP POLICY IF EXISTS "Allow authenticated update" ON users;
DROP POLICY IF EXISTS "Allow authenticated delete" ON users;

-- tools table
DROP POLICY IF EXISTS "Allow authenticated read" ON tools;
DROP POLICY IF EXISTS "Allow authenticated insert" ON tools;
DROP POLICY IF EXISTS "Allow authenticated update" ON tools;
DROP POLICY IF EXISTS "Allow authenticated delete" ON tools;

-- tool_versions table
DROP POLICY IF EXISTS "Allow authenticated read" ON tool_versions;
DROP POLICY IF EXISTS "Allow authenticated insert" ON tool_versions;
DROP POLICY IF EXISTS "Allow authenticated update" ON tool_versions;
DROP POLICY IF EXISTS "Allow authenticated delete" ON tool_versions;

-- tenant_tools table
DROP POLICY IF EXISTS "Allow authenticated read" ON tenant_tools;
DROP POLICY IF EXISTS "Allow authenticated insert" ON tenant_tools;
DROP POLICY IF EXISTS "Allow authenticated update" ON tenant_tools;
DROP POLICY IF EXISTS "Allow authenticated delete" ON tenant_tools;

-- tenant_tool_configs table
DROP POLICY IF EXISTS "Allow authenticated read" ON tenant_tool_configs;
DROP POLICY IF EXISTS "Allow authenticated insert" ON tenant_tool_configs;
DROP POLICY IF EXISTS "Allow authenticated update" ON tenant_tool_configs;
DROP POLICY IF EXISTS "Allow authenticated delete" ON tenant_tool_configs;

-- subscriptions table
DROP POLICY IF EXISTS "Allow authenticated read" ON subscriptions;
DROP POLICY IF EXISTS "Allow authenticated insert" ON subscriptions;
DROP POLICY IF EXISTS "Allow authenticated update" ON subscriptions;
DROP POLICY IF EXISTS "Allow authenticated delete" ON subscriptions;

-- usage_logs table
DROP POLICY IF EXISTS "Allow authenticated read" ON usage_logs;
DROP POLICY IF EXISTS "Allow authenticated insert" ON usage_logs;

-- alerts table
DROP POLICY IF EXISTS "Allow authenticated read" ON alerts;
DROP POLICY IF EXISTS "Allow authenticated insert" ON alerts;
DROP POLICY IF EXISTS "Allow authenticated update" ON alerts;
DROP POLICY IF EXISTS "Allow authenticated delete" ON alerts;

-- feedback table
DROP POLICY IF EXISTS "Allow authenticated read" ON feedback;
DROP POLICY IF EXISTS "Allow authenticated insert" ON feedback;
DROP POLICY IF EXISTS "Allow authenticated update" ON feedback;
DROP POLICY IF EXISTS "Allow authenticated delete" ON feedback;

-- onboarding_progress table
DROP POLICY IF EXISTS "Allow authenticated read" ON onboarding_progress;
DROP POLICY IF EXISTS "Allow authenticated insert" ON onboarding_progress;
DROP POLICY IF EXISTS "Allow authenticated update" ON onboarding_progress;
DROP POLICY IF EXISTS "Allow authenticated delete" ON onboarding_progress;

-- ============================================================================
-- TENANTS TABLE POLICIES
-- ============================================================================

-- super_admin: Full access to all tenants
CREATE POLICY "super_admin_tenants_select"
ON tenants FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "super_admin_tenants_insert"
ON tenants FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tenants_update"
ON tenants FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tenants_delete"
ON tenants FOR DELETE
TO authenticated
USING (is_super_admin());

-- client_user: Can only see their own tenant
CREATE POLICY "client_tenants_select"
ON tenants FOR SELECT
TO authenticated
USING (id = get_user_tenant_id());

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- super_admin: Full access to all users
CREATE POLICY "super_admin_users_select"
ON users FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "super_admin_users_insert"
ON users FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_users_update"
ON users FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_users_delete"
ON users FOR DELETE
TO authenticated
USING (is_super_admin());

-- client_user: Can only see users in their tenant
CREATE POLICY "client_users_select"
ON users FOR SELECT
TO authenticated
USING (tenant_id = get_user_tenant_id());

-- ============================================================================
-- TOOLS TABLE POLICIES
-- ============================================================================

-- Everyone authenticated: Can read all tools (tools are global)
CREATE POLICY "authenticated_tools_select"
ON tools FOR SELECT
TO authenticated
USING (true);

-- super_admin only: Can manage tools
CREATE POLICY "super_admin_tools_insert"
ON tools FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tools_update"
ON tools FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tools_delete"
ON tools FOR DELETE
TO authenticated
USING (is_super_admin());

-- ============================================================================
-- TOOL_VERSIONS TABLE POLICIES
-- ============================================================================

-- Everyone authenticated: Can read all tool versions
CREATE POLICY "authenticated_tool_versions_select"
ON tool_versions FOR SELECT
TO authenticated
USING (true);

-- super_admin only: Can manage tool versions
CREATE POLICY "super_admin_tool_versions_insert"
ON tool_versions FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tool_versions_update"
ON tool_versions FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tool_versions_delete"
ON tool_versions FOR DELETE
TO authenticated
USING (is_super_admin());

-- ============================================================================
-- TENANT_TOOLS TABLE POLICIES
-- ============================================================================

-- super_admin: Full access to all tenant_tools
CREATE POLICY "super_admin_tenant_tools_select"
ON tenant_tools FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "super_admin_tenant_tools_insert"
ON tenant_tools FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tenant_tools_update"
ON tenant_tools FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tenant_tools_delete"
ON tenant_tools FOR DELETE
TO authenticated
USING (is_super_admin());

-- client_user: Can only see their tenant's tools
CREATE POLICY "client_tenant_tools_select"
ON tenant_tools FOR SELECT
TO authenticated
USING (tenant_id = get_user_tenant_id());

-- ============================================================================
-- TENANT_TOOL_CONFIGS TABLE POLICIES
-- ============================================================================

-- super_admin: Full access to all tenant_tool_configs
CREATE POLICY "super_admin_tenant_tool_configs_select"
ON tenant_tool_configs FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "super_admin_tenant_tool_configs_insert"
ON tenant_tool_configs FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tenant_tool_configs_update"
ON tenant_tool_configs FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_tenant_tool_configs_delete"
ON tenant_tool_configs FOR DELETE
TO authenticated
USING (is_super_admin());

-- client_user: Can see and update their tenant's configs
CREATE POLICY "client_tenant_tool_configs_select"
ON tenant_tool_configs FOR SELECT
TO authenticated
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "client_tenant_tool_configs_update"
ON tenant_tool_configs FOR UPDATE
TO authenticated
USING (tenant_id = get_user_tenant_id())
WITH CHECK (tenant_id = get_user_tenant_id());

-- ============================================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- ============================================================================

-- super_admin: Full access to all subscriptions
CREATE POLICY "super_admin_subscriptions_select"
ON subscriptions FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "super_admin_subscriptions_insert"
ON subscriptions FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_subscriptions_update"
ON subscriptions FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_subscriptions_delete"
ON subscriptions FOR DELETE
TO authenticated
USING (is_super_admin());

-- client_user: Can only see their tenant's subscription
CREATE POLICY "client_subscriptions_select"
ON subscriptions FOR SELECT
TO authenticated
USING (tenant_id = get_user_tenant_id());

-- ============================================================================
-- USAGE_LOGS TABLE POLICIES
-- ============================================================================

-- super_admin: Can read and insert all usage logs
CREATE POLICY "super_admin_usage_logs_select"
ON usage_logs FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "super_admin_usage_logs_insert"
ON usage_logs FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

-- client_user: Can only see their tenant's usage logs
CREATE POLICY "client_usage_logs_select"
ON usage_logs FOR SELECT
TO authenticated
USING (tenant_id = get_user_tenant_id());

-- Service role (used by backend) can insert via service key (bypasses RLS)
-- No explicit policy needed - service role bypasses RLS by default

-- ============================================================================
-- ALERTS TABLE POLICIES
-- ============================================================================

-- super_admin only: Full access (alerts are admin-only)
CREATE POLICY "super_admin_alerts_select"
ON alerts FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "super_admin_alerts_insert"
ON alerts FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_alerts_update"
ON alerts FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_alerts_delete"
ON alerts FOR DELETE
TO authenticated
USING (is_super_admin());

-- client_user: No access to alerts (admin-only feature)
-- (No policies created for client access)

-- ============================================================================
-- FEEDBACK TABLE POLICIES
-- ============================================================================

-- super_admin: Can read and update all feedback
CREATE POLICY "super_admin_feedback_select"
ON feedback FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "super_admin_feedback_update"
ON feedback FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- super_admin: Can also insert (for internal testing/notes)
CREATE POLICY "super_admin_feedback_insert"
ON feedback FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

-- super_admin: Can delete feedback
CREATE POLICY "super_admin_feedback_delete"
ON feedback FOR DELETE
TO authenticated
USING (is_super_admin());

-- client_user: Can see and insert their tenant's feedback
CREATE POLICY "client_feedback_select"
ON feedback FOR SELECT
TO authenticated
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "client_feedback_insert"
ON feedback FOR INSERT
TO authenticated
WITH CHECK (tenant_id = get_user_tenant_id());

-- ============================================================================
-- ONBOARDING_PROGRESS TABLE POLICIES
-- ============================================================================

-- super_admin: Full access to all onboarding progress
CREATE POLICY "super_admin_onboarding_select"
ON onboarding_progress FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "super_admin_onboarding_insert"
ON onboarding_progress FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_onboarding_update"
ON onboarding_progress FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "super_admin_onboarding_delete"
ON onboarding_progress FOR DELETE
TO authenticated
USING (is_super_admin());

-- client_user: Can see and update their tenant's onboarding progress
CREATE POLICY "client_onboarding_select"
ON onboarding_progress FOR SELECT
TO authenticated
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "client_onboarding_update"
ON onboarding_progress FOR UPDATE
TO authenticated
USING (tenant_id = get_user_tenant_id())
WITH CHECK (tenant_id = get_user_tenant_id());

-- ============================================================================
-- GRANT SERVICE ROLE BYPASS (for backend operations)
-- ============================================================================
-- Note: The service role automatically bypasses RLS in Supabase.
-- This is used by backend API routes that need full access (webhooks, etc.)
-- No explicit grants needed - this is the default behavior.
