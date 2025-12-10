-- Add 'in_progress' to allowed status values for calls table

-- Drop the existing constraint
ALTER TABLE calls DROP CONSTRAINT IF EXISTS calls_status_check;

-- Add new constraint with 'in_progress' included
ALTER TABLE calls ADD CONSTRAINT calls_status_check
  CHECK (status IN ('received', 'in_progress', 'analyzing', 'dispatched', 'accepted', 'completed', 'escalated', 'missed'));
