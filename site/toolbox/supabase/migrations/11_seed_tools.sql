-- Seed tool definitions for the SolidFrame toolbox
-- These are the 8 core tools available to tenants

INSERT INTO tools (slug, name, description, icon, category, is_real) VALUES

-- Real (implemented) tools
('after-hours-agent', 'After Hours Agent',
 'AI-powered voice agent that answers calls 24/7, handles common questions, and books appointments when your office is closed.',
 'phone', 'voice', true),

-- Coming soon tools (is_real = false)
('missed-call-textback', 'Missed Call Text-Back',
 'Automatically sends a personalized text message to callers you miss, keeping leads warm until you can call back.',
 'message-circle', 'messaging', false),

('review-request-bot', 'Review Request Bot',
 'Automatically requests reviews from satisfied customers after completed jobs, boosting your online reputation.',
 'star', 'marketing', false),

('appointment-reminders', 'Appointment Reminders',
 'Sends automated SMS and email reminders to reduce no-shows and keep your schedule running smoothly.',
 'calendar', 'scheduling', false),

('quote-reviver', 'Quote Reviver',
 'Follows up on unsold quotes with personalized messages, helping convert more estimates into booked jobs.',
 'refresh-cw', 'marketing', false),

('seasonal-campaigns', 'Seasonal Campaigns',
 'Pre-built marketing campaigns for slow seasons, maintenance reminders, and holiday promotions.',
 'calendar-days', 'marketing', false),

('maintenance-renewal', 'Maintenance Renewal',
 'Automatically reminds customers when their maintenance agreements are due for renewal.',
 'repeat', 'automation', false),

('tech-training', 'Tech Training Hub',
 'On-demand training videos and resources to help your technicians improve their skills.',
 'graduation-cap', 'automation', false)

ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    is_real = EXCLUDED.is_real;

-- Create initial versions for each tool
INSERT INTO tool_versions (tool_id, version, status, config_schema, changelog)
SELECT
    id as tool_id,
    '1.0.0' as version,
    'active' as status,
    '{}' as config_schema,
    'Initial release' as changelog
FROM tools
ON CONFLICT (tool_id, version) DO NOTHING;
