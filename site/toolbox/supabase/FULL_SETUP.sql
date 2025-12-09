-- ============================================
-- SOLIDFRAME TOOLBOX - COMPLETE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 01: Demo Links
-- ============================================
CREATE TABLE IF NOT EXISTS demo_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_name TEXT,
    business_name TEXT,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_demo_links_created_at ON demo_links(created_at DESC);
ALTER TABLE demo_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can create demo links" ON demo_links;
CREATE POLICY "Admins can create demo links" ON demo_links FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view demo links" ON demo_links;
CREATE POLICY "Admins can view demo links" ON demo_links FOR SELECT TO authenticated USING (true);

-- ============================================
-- 02: Tenants
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'churned')),
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_stripe_customer ON tenants(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON tenants;
CREATE POLICY "Allow authenticated read" ON tenants FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON tenants;
CREATE POLICY "Allow authenticated insert" ON tenants FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON tenants;
CREATE POLICY "Allow authenticated update" ON tenants FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON tenants;
CREATE POLICY "Allow authenticated delete" ON tenants FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 03: Users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'user')),
    auth_id UUID,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id) WHERE auth_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_tenant_email ON users(tenant_id, email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON users;
CREATE POLICY "Allow authenticated read" ON users FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON users;
CREATE POLICY "Allow authenticated insert" ON users FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON users;
CREATE POLICY "Allow authenticated update" ON users FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON users;
CREATE POLICY "Allow authenticated delete" ON users FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 04: Tools
-- ============================================
CREATE TABLE IF NOT EXISTS tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT NOT NULL DEFAULT 'automation' CHECK (category IN ('voice', 'messaging', 'scheduling', 'marketing', 'automation')),
    is_real BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_is_real ON tools(is_real);
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON tools;
CREATE POLICY "Allow authenticated read" ON tools FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON tools;
CREATE POLICY "Allow authenticated insert" ON tools FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON tools;
CREATE POLICY "Allow authenticated update" ON tools FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON tools;
CREATE POLICY "Allow authenticated delete" ON tools FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS tool_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    config_schema JSONB,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'deprecated')),
    rollout_pct INTEGER DEFAULT 100 CHECK (rollout_pct >= 0 AND rollout_pct <= 100),
    changelog TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tool_id, version)
);
CREATE INDEX IF NOT EXISTS idx_tool_versions_tool_id ON tool_versions(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_versions_status ON tool_versions(status);
CREATE INDEX IF NOT EXISTS idx_tool_versions_tool_status ON tool_versions(tool_id, status);
ALTER TABLE tool_versions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON tool_versions;
CREATE POLICY "Allow authenticated read" ON tool_versions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON tool_versions;
CREATE POLICY "Allow authenticated insert" ON tool_versions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON tool_versions;
CREATE POLICY "Allow authenticated update" ON tool_versions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON tool_versions;
CREATE POLICY "Allow authenticated delete" ON tool_versions FOR DELETE TO authenticated USING (true);

-- ============================================
-- 05: Tenant Tools
-- ============================================
CREATE TABLE IF NOT EXISTS tenant_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    version_id UUID REFERENCES tool_versions(id) ON DELETE SET NULL,
    activated_at TIMESTAMPTZ DEFAULT NOW(),
    deactivated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, tool_id)
);
CREATE INDEX IF NOT EXISTS idx_tenant_tools_tenant_id ON tenant_tools(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_tools_tool_id ON tenant_tools(tool_id);
CREATE INDEX IF NOT EXISTS idx_tenant_tools_is_active ON tenant_tools(is_active);
CREATE INDEX IF NOT EXISTS idx_tenant_tools_tenant_active ON tenant_tools(tenant_id, is_active);
ALTER TABLE tenant_tools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON tenant_tools;
CREATE POLICY "Allow authenticated read" ON tenant_tools FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON tenant_tools;
CREATE POLICY "Allow authenticated insert" ON tenant_tools FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON tenant_tools;
CREATE POLICY "Allow authenticated update" ON tenant_tools FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON tenant_tools;
CREATE POLICY "Allow authenticated delete" ON tenant_tools FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_tenant_tools_updated_at ON tenant_tools;
CREATE TRIGGER update_tenant_tools_updated_at BEFORE UPDATE ON tenant_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS tenant_tool_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, tool_id)
);
CREATE INDEX IF NOT EXISTS idx_tenant_tool_configs_tenant_id ON tenant_tool_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_tool_configs_tool_id ON tenant_tool_configs(tool_id);
CREATE INDEX IF NOT EXISTS idx_tenant_tool_configs_tenant_tool ON tenant_tool_configs(tenant_id, tool_id);
ALTER TABLE tenant_tool_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON tenant_tool_configs;
CREATE POLICY "Allow authenticated read" ON tenant_tool_configs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON tenant_tool_configs;
CREATE POLICY "Allow authenticated insert" ON tenant_tool_configs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON tenant_tool_configs;
CREATE POLICY "Allow authenticated update" ON tenant_tool_configs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON tenant_tool_configs;
CREATE POLICY "Allow authenticated delete" ON tenant_tool_configs FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_tenant_tool_configs_updated_at ON tenant_tool_configs;
CREATE TRIGGER update_tenant_tool_configs_updated_at BEFORE UPDATE ON tenant_tool_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 06: Subscriptions
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON subscriptions;
CREATE POLICY "Allow authenticated read" ON subscriptions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON subscriptions;
CREATE POLICY "Allow authenticated insert" ON subscriptions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON subscriptions;
CREATE POLICY "Allow authenticated update" ON subscriptions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON subscriptions;
CREATE POLICY "Allow authenticated delete" ON subscriptions FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 07: Usage Logs
-- ============================================
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_usage_logs_tenant_id ON usage_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_tool_id ON usage_logs(tool_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_event_type ON usage_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_tenant_created ON usage_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_tenant_tool_created ON usage_logs(tenant_id, tool_id, created_at DESC);
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON usage_logs;
CREATE POLICY "Allow authenticated read" ON usage_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON usage_logs;
CREATE POLICY "Allow authenticated insert" ON usage_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- 08: Alerts
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success', 'billing', 'system')),
    title TEXT NOT NULL,
    message TEXT,
    action_url TEXT,
    read BOOLEAN NOT NULL DEFAULT false,
    dismissed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    read_at TIMESTAMPTZ,
    dismissed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_alerts_tenant_id ON alerts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read);
CREATE INDEX IF NOT EXISTS idx_alerts_tenant_unread ON alerts(tenant_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON alerts;
CREATE POLICY "Allow authenticated read" ON alerts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON alerts;
CREATE POLICY "Allow authenticated insert" ON alerts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON alerts;
CREATE POLICY "Allow authenticated update" ON alerts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON alerts;
CREATE POLICY "Allow authenticated delete" ON alerts FOR DELETE TO authenticated USING (true);

-- ============================================
-- 09: Feedback
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
    type TEXT NOT NULL DEFAULT 'feedback' CHECK (type IN ('feedback', 'bug', 'feature_request', 'question', 'praise', 'complaint')),
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'resolved', 'wont_fix')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_feedback_tenant_id ON feedback(tenant_id);
CREATE INDEX IF NOT EXISTS idx_feedback_tool_id ON feedback(tool_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_new ON feedback(status) WHERE status = 'new';
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON feedback;
CREATE POLICY "Allow authenticated read" ON feedback FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON feedback;
CREATE POLICY "Allow authenticated insert" ON feedback FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON feedback;
CREATE POLICY "Allow authenticated update" ON feedback FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON feedback;
CREATE POLICY "Allow authenticated delete" ON feedback FOR DELETE TO authenticated USING (true);

-- ============================================
-- 10: Onboarding Progress
-- ============================================
CREATE TABLE IF NOT EXISTS onboarding_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
    current_step TEXT NOT NULL DEFAULT 'welcome',
    completed_steps TEXT[] NOT NULL DEFAULT '{}',
    data JSONB NOT NULL DEFAULT '{}',
    is_complete BOOLEAN NOT NULL DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_onboarding_tenant_id ON onboarding_progress(tenant_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_is_complete ON onboarding_progress(is_complete);
CREATE INDEX IF NOT EXISTS idx_onboarding_incomplete ON onboarding_progress(tenant_id) WHERE is_complete = false;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read" ON onboarding_progress;
CREATE POLICY "Allow authenticated read" ON onboarding_progress FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated insert" ON onboarding_progress;
CREATE POLICY "Allow authenticated insert" ON onboarding_progress FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated update" ON onboarding_progress;
CREATE POLICY "Allow authenticated update" ON onboarding_progress FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated delete" ON onboarding_progress;
CREATE POLICY "Allow authenticated delete" ON onboarding_progress FOR DELETE TO authenticated USING (true);
DROP TRIGGER IF EXISTS update_onboarding_progress_updated_at ON onboarding_progress;
CREATE TRIGGER update_onboarding_progress_updated_at BEFORE UPDATE ON onboarding_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11: Seed Tools
-- ============================================
INSERT INTO tools (slug, name, description, icon, category, is_real) VALUES
('after-hours-agent', 'After Hours Agent', 'AI-powered voice agent that answers calls 24/7, handles common questions, and books appointments when your office is closed.', 'phone', 'voice', true),
('missed-call-textback', 'Missed Call Text-Back', 'Automatically sends a personalized text message to callers you miss, keeping leads warm until you can call back.', 'message-circle', 'messaging', false),
('review-request-bot', 'Review Request Bot', 'Automatically requests reviews from satisfied customers after completed jobs, boosting your online reputation.', 'star', 'marketing', false),
('appointment-reminders', 'Appointment Reminders', 'Sends automated SMS and email reminders to reduce no-shows and keep your schedule running smoothly.', 'calendar', 'scheduling', false),
('quote-reviver', 'Quote Reviver', 'Follows up on unsold quotes with personalized messages, helping convert more estimates into booked jobs.', 'refresh-cw', 'marketing', false),
('seasonal-campaigns', 'Seasonal Campaigns', 'Pre-built marketing campaigns for slow seasons, maintenance reminders, and holiday promotions.', 'calendar-days', 'marketing', false),
('maintenance-renewal', 'Maintenance Renewal', 'Automatically reminds customers when their maintenance agreements are due for renewal.', 'repeat', 'automation', false),
('tech-training', 'Tech Training Hub', 'On-demand training videos and resources to help your technicians improve their skills.', 'graduation-cap', 'automation', false)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    is_real = EXCLUDED.is_real;

INSERT INTO tool_versions (tool_id, version, status, config_schema, changelog)
SELECT id as tool_id, '1.0.0' as version, 'active' as status, '{}' as config_schema, 'Initial release' as changelog
FROM tools
ON CONFLICT (tool_id, version) DO NOTHING;

-- ============================================
-- 12: Seed Acme HVAC
-- ============================================
DO $$
DECLARE
    acme_tenant_id UUID;
    acme_created_at TIMESTAMPTZ := NOW() - INTERVAL '90 days';
    tool_after_hours UUID;
    tool_textback UUID;
    tool_review UUID;
    tool_appt UUID;
    tool_quote UUID;
    tool_campaign UUID;
    tool_renewal UUID;
    tool_training UUID;
BEGIN
    INSERT INTO tenants (id, name, slug, status, created_at, updated_at)
    VALUES (gen_random_uuid(), 'Acme HVAC Services', 'acme-hvac', 'active', acme_created_at, acme_created_at)
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO acme_tenant_id;

    IF acme_tenant_id IS NULL THEN
        SELECT id INTO acme_tenant_id FROM tenants WHERE slug = 'acme-hvac';
    END IF;

    INSERT INTO users (tenant_id, email, role, first_name, last_name, created_at)
    VALUES (acme_tenant_id, 'john@acmehvac.com', 'admin', 'John', 'Smith', acme_created_at)
    ON CONFLICT (tenant_id, email) DO NOTHING;

    INSERT INTO users (tenant_id, email, role, first_name, last_name, created_at)
    VALUES
        (acme_tenant_id, 'trevor@acmehvac.com', 'user', 'Trevor', 'Martinez', acme_created_at),
        (acme_tenant_id, 'mike@acmehvac.com', 'user', 'Mike', 'Johnson', acme_created_at),
        (acme_tenant_id, 'sarah@acmehvac.com', 'user', 'Sarah', 'Chen', acme_created_at),
        (acme_tenant_id, 'dave@acmehvac.com', 'user', 'Dave', 'Wilson', acme_created_at)
    ON CONFLICT (tenant_id, email) DO NOTHING;

    SELECT id INTO tool_after_hours FROM tools WHERE slug = 'after-hours-agent';
    SELECT id INTO tool_textback FROM tools WHERE slug = 'missed-call-textback';
    SELECT id INTO tool_review FROM tools WHERE slug = 'review-request-bot';
    SELECT id INTO tool_appt FROM tools WHERE slug = 'appointment-reminders';
    SELECT id INTO tool_quote FROM tools WHERE slug = 'quote-reviver';
    SELECT id INTO tool_campaign FROM tools WHERE slug = 'seasonal-campaigns';
    SELECT id INTO tool_renewal FROM tools WHERE slug = 'maintenance-renewal';
    SELECT id INTO tool_training FROM tools WHERE slug = 'tech-training';

    INSERT INTO tenant_tools (tenant_id, tool_id, is_active, activated_at, created_at)
    VALUES
        (acme_tenant_id, tool_after_hours, true, acme_created_at + INTERVAL '1 hour', acme_created_at),
        (acme_tenant_id, tool_textback, true, acme_created_at + INTERVAL '2 hours', acme_created_at),
        (acme_tenant_id, tool_review, true, acme_created_at + INTERVAL '2 hours', acme_created_at),
        (acme_tenant_id, tool_appt, true, acme_created_at + INTERVAL '3 hours', acme_created_at),
        (acme_tenant_id, tool_quote, true, acme_created_at + INTERVAL '3 hours', acme_created_at),
        (acme_tenant_id, tool_campaign, true, acme_created_at + INTERVAL '4 hours', acme_created_at),
        (acme_tenant_id, tool_renewal, true, acme_created_at + INTERVAL '4 hours', acme_created_at),
        (acme_tenant_id, tool_training, true, acme_created_at + INTERVAL '5 hours', acme_created_at)
    ON CONFLICT (tenant_id, tool_id) DO NOTHING;

    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (acme_tenant_id, tool_after_hours, jsonb_build_object(
        'businessName', 'Acme HVAC Services',
        'businessHours', jsonb_build_object('start', '07:00', 'end', '18:00', 'timezone', 'America/Phoenix', 'daysOfWeek', array['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
        'emergencyPhone', '(602) 555-0101',
        'emergencyRate', 150,
        'emergencyMinimum', 89,
        'address', '123 Main Street, Phoenix, AZ 85001',
        'serviceArea', 'Phoenix metro area (85001-85099)',
        'voiceId', 'nova',
        'greeting', 'Thanks for calling Acme HVAC Services!'
    ), acme_created_at)
    ON CONFLICT (tenant_id, tool_id) DO NOTHING;

    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (acme_tenant_id, tool_textback, jsonb_build_object('enabled', true, 'messageTemplate', 'Hi! Sorry we missed your call at Acme HVAC.'), acme_created_at)
    ON CONFLICT (tenant_id, tool_id) DO NOTHING;

    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (acme_tenant_id, tool_review, jsonb_build_object('messageTemplate', 'Thanks for choosing Acme HVAC!', 'hoursDelayBeforeSending', 4), acme_created_at)
    ON CONFLICT (tenant_id, tool_id) DO NOTHING;

    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (acme_tenant_id, tool_appt, jsonb_build_object('dayBefore', true, 'twoHoursBefore', true), acme_created_at)
    ON CONFLICT (tenant_id, tool_id) DO NOTHING;

    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (acme_tenant_id, tool_quote, jsonb_build_object('sequenceSteps', '[]'::jsonb), acme_created_at)
    ON CONFLICT (tenant_id, tool_id) DO NOTHING;

    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (acme_tenant_id, tool_campaign, jsonb_build_object('availableVariables', array['customer_name']), acme_created_at)
    ON CONFLICT (tenant_id, tool_id) DO NOTHING;

    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (acme_tenant_id, tool_renewal, jsonb_build_object('sendReminderBefore', 30), acme_created_at)
    ON CONFLICT (tenant_id, tool_id) DO NOTHING;

    INSERT INTO tenant_tool_configs (tenant_id, tool_id, config, created_at)
    VALUES (acme_tenant_id, tool_training, '{}'::jsonb, acme_created_at)
    ON CONFLICT (tenant_id, tool_id) DO NOTHING;

    INSERT INTO onboarding_progress (tenant_id, current_step, completed_steps, is_complete, started_at, completed_at, data, updated_at)
    VALUES (acme_tenant_id, 'complete', ARRAY['welcome', 'business_info', 'team_setup', 'complete'], true, acme_created_at, acme_created_at + INTERVAL '2 hours', jsonb_build_object('businessName', 'Acme HVAC Services'), acme_created_at)
    ON CONFLICT (tenant_id) DO NOTHING;

    INSERT INTO subscriptions (tenant_id, status, current_period_start, current_period_end, trial_end, created_at, updated_at)
    VALUES (acme_tenant_id, 'active', acme_created_at + INTERVAL '14 days', NOW() + INTERVAL '30 days', acme_created_at + INTERVAL '14 days', acme_created_at, acme_created_at)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Acme HVAC Services seeded successfully!';
END $$;

-- ============================================
-- 13: System Tenant + Super Admin + Acme Auth
-- ============================================

-- Create system tenant for super_admins
INSERT INTO tenants (name, slug, status)
VALUES ('SolidFrame System', 'system', 'active')
ON CONFLICT (slug) DO NOTHING;

-- Create super_admin user (admin@solidframe.ai)
INSERT INTO users (tenant_id, email, role, auth_id, first_name, last_name)
SELECT
    t.id,
    'admin@solidframe.ai',
    'super_admin',
    'ad8a1eea-9e25-4753-b7b7-9c814817f006'::uuid,
    'Admin',
    'User'
FROM tenants t
WHERE t.slug = 'system'
ON CONFLICT (tenant_id, email) DO UPDATE SET auth_id = 'ad8a1eea-9e25-4753-b7b7-9c814817f006'::uuid;

-- Link Acme HVAC user to auth (john@acmehvac.com)
UPDATE users
SET auth_id = 'ac450ee2-7df0-4dc4-8b2c-5c432fd804a2'::uuid
WHERE email = 'john@acmehvac.com';

-- ============================================
-- DONE! Test these URLs:
-- Admin: http://localhost:3000/admin (admin@solidframe.ai)
-- Acme:  http://localhost:3000/acme-hvac (john@acmehvac.com / acmehvac123)
-- ============================================
