-- Seed Tools
INSERT INTO public.tools (id, name, description, status, icon, category, image_url) VALUES
-- Sales & Demos
('roi-projector', 'ROI Projector', 'Real-time "Lost Revenue" calculator to show them exactly what they are losing daily.', 'priority', 'calculator', 'sales_demos', '/images/tools/roi-projector.png'),
('instant-demo', 'Instant Agent Demo', 'Spin up a configured voice agent in 30 seconds grounded on their website data.', 'priority', 'lightning', 'sales_demos', '/images/tools/instant-agent.png'),
('scenario-deck', 'Live Scenario Deck', 'Trigger specific audio calls: "The Angry Tenant", "The Price Shopper", "The Emergency".', 'planned', 'theater', 'sales_demos', NULL),
('competitor-recon', 'Competitor Recon', 'Pull their top competitor''s reviews and pricing to show them what they are up against.', 'priority', 'search', 'sales_demos', NULL),

-- Agent Config
('prompt-engineer', 'Prompt Engineer', 'Advanced system prompt editor with version control and diffing.', 'planned', 'code', 'agent_config', NULL),
('voice-lab', 'Voice Lab', 'Test VAPI voice latency, tone, and filler words in a sandbox.', 'planned', 'mic', 'agent_config', NULL),
('knowledge-base', 'Knowledge Base', 'Upload PDFs, price books, and manuals for the agent to reference (RAG).', 'planned', 'database', 'agent_config', NULL),
('training-clips', 'Training Clips', 'Save the best/worst calls to fine-tune the model.', 'planned', 'star', 'agent_config', NULL),

-- Client Management
('client-list', 'Client Command', 'Master list of all active clients. Click to "Impersonate" and view their dashboard.', 'planned', 'building', 'client_mgmt', NULL),
('feature-toggles', 'Feature Toggles', 'Turn on/off specific modules (e.g. "Review Request") for specific clients.', 'planned', 'toggle', 'client_mgmt', NULL),
('billing-usage', 'Billing & Usage', 'Live view of VAPI minutes used vs. their plan limits.', 'planned', 'credit-card', 'client_mgmt', NULL),
('contracts', 'Paperwork', 'Generate and track status of service agreements.', 'planned', 'file', 'client_mgmt', NULL),

-- Data Ops
('lead-harvester', 'Lead Harvester', 'Mass scrape leads from Google Maps/Yelp/Angi per zip code.', 'planned', 'scraper', 'data_ops', NULL),
('enrichment-queue', 'Enrichment Queue', 'Waterfall lookups for emails/phones on scraped leads.', 'planned', 'sparkles', 'data_ops', NULL),
('outreach-blaster', 'Outreach Blaster', 'Execute cold email/SMS sequences to the harvested lists.', 'planned', 'send', 'data_ops', NULL),
('system-status', 'System Health', 'Monitor worker node uptime, API latency, and error rates.', 'planned', 'chart', 'data_ops', NULL)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    image_url = EXCLUDED.image_url;

-- Seed Tool Specs for ROI Projector
INSERT INTO public.tool_specs (tool_id, label, completed, "order") VALUES
('roi-projector', 'Dynamic input validation logic', true, 1),
('roi-projector', 'Revenue loss projection algorithm', true, 2),
('roi-projector', 'PDF export generation', false, 3),
('roi-projector', 'Client-side state persistence', true, 4),
('roi-projector', 'Mobile responsive layout', false, 5);

-- Seed Tool Specs for Instant Demo
INSERT INTO public.tool_specs (tool_id, label, completed, "order") VALUES
('instant-demo', 'VAPI voice synthesis integration', true, 1),
('instant-demo', 'Website scraping module', true, 2),
('instant-demo', 'LLM context injection', false, 3),
('instant-demo', 'Real-time audio visualization', true, 4);

-- Seed Activity Logs for ROI Projector
INSERT INTO public.tool_activity_logs (tool_id, message, category, created_at) VALUES
('roi-projector', 'Updated projection formula vars', 'text-emerald-500', timezone('utc', now() - interval '20 minutes')),
('roi-projector', 'Fixed layout shift on mobile', 'text-amber-400', timezone('utc', now() - interval '2 hours')),
('roi-projector', 'Deploying build v0.4.2', 'text-zinc-400', timezone('utc', now() - interval '4 hours'));

-- Seed Activity Logs for Instant Demo
INSERT INTO public.tool_activity_logs (tool_id, message, category, created_at) VALUES
('instant-demo', 'VAPI latency reduced to <500ms', 'text-emerald-500', timezone('utc', now() - interval '1 hour')),
('instant-demo', 'Scraper hit rate improvements', 'text-indigo-400', timezone('utc', now() - interval '3 hours'));
