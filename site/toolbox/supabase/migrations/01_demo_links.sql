-- Demo Links table for tracking generated demo links
-- Used by /admin/demo-links to generate personalized demo URLs

CREATE TABLE IF NOT EXISTS demo_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_name TEXT,
    business_name TEXT,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT -- email of admin who created the link
);

-- Index for analytics queries
CREATE INDEX idx_demo_links_created_at ON demo_links(created_at DESC);

-- RLS policies
ALTER TABLE demo_links ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert (admins creating links)
CREATE POLICY "Admins can create demo links" ON demo_links
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to read all links (for analytics)
CREATE POLICY "Admins can view demo links" ON demo_links
    FOR SELECT
    TO authenticated
    USING (true);
