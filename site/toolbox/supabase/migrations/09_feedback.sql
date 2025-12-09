-- Feedback table: User feedback and feature requests from tenants
-- Helps prioritize development and track user sentiment

CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- Who submitted (if known)
    tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,  -- Related tool (if applicable)
    type TEXT NOT NULL DEFAULT 'feedback'         -- Feedback category
        CHECK (type IN ('feedback', 'bug', 'feature_request', 'question', 'praise', 'complaint')),
    message TEXT NOT NULL,                        -- Feedback content
    rating INTEGER                                -- Optional 1-5 star rating
        CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
    status TEXT NOT NULL DEFAULT 'new'            -- Processing status
        CHECK (status IN ('new', 'reviewed', 'in_progress', 'resolved', 'wont_fix')),
    admin_notes TEXT,                             -- Internal notes from SolidFrame team
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ                       -- When feedback was resolved
);

-- Comment on table
COMMENT ON TABLE feedback IS 'User feedback, bug reports, and feature requests from tenants';
COMMENT ON COLUMN feedback.type IS 'Category: feedback, bug, feature_request, question, praise, complaint';
COMMENT ON COLUMN feedback.status IS 'Processing status: new, reviewed, in_progress, resolved, wont_fix';

-- Indexes
CREATE INDEX idx_feedback_tenant_id ON feedback(tenant_id);
CREATE INDEX idx_feedback_tool_id ON feedback(tool_id);
CREATE INDEX idx_feedback_type ON feedback(type);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_feedback_new ON feedback(status) WHERE status = 'new';

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Placeholder policies
CREATE POLICY "Allow authenticated read" ON feedback
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON feedback
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON feedback
    FOR DELETE
    TO authenticated
    USING (true);
