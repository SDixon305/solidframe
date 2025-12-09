-- Rename 'read' column to 'is_read' to match TypeScript types
-- This fixes the mismatch between database schema and application code

-- Drop old indexes that reference 'read' column
DROP INDEX IF EXISTS idx_alerts_read;
DROP INDEX IF EXISTS idx_alerts_tenant_unread;

-- Rename the column
ALTER TABLE alerts RENAME COLUMN read TO is_read;

-- Recreate indexes with new column name
CREATE INDEX idx_alerts_read ON alerts(is_read);
CREATE INDEX idx_alerts_tenant_unread ON alerts(tenant_id, is_read) WHERE is_read = false;

-- Update column comment
COMMENT ON COLUMN alerts.is_read IS 'Whether the alert has been viewed by the user';
