-- Migration: Create demo_calls table for real-time call monitoring
-- Run this in your Supabase SQL Editor

-- Create the demo_calls table
CREATE TABLE IF NOT EXISTS demo_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES demo_sessions(id) ON DELETE CASCADE,
  vapi_call_id TEXT,
  status TEXT DEFAULT 'connecting' CHECK (status IN ('connecting', 'connected', 'listening', 'processing', 'completed')),
  transcript TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by session
CREATE INDEX IF NOT EXISTS idx_demo_calls_session_id ON demo_calls(session_id);

-- Index for fast lookup by vapi_call_id
CREATE INDEX IF NOT EXISTS idx_demo_calls_vapi_id ON demo_calls(vapi_call_id);

-- Enable Row Level Security (required for Supabase)
ALTER TABLE demo_calls ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (for demo purposes)
CREATE POLICY "Allow all operations on demo_calls"
ON demo_calls
FOR ALL
USING (true)
WITH CHECK (true);

-- Grant access to anon and authenticated users
GRANT ALL ON demo_calls TO anon;
GRANT ALL ON demo_calls TO authenticated;

-- Enable real-time for this table
-- This allows frontend to subscribe to changes
ALTER PUBLICATION supabase_realtime ADD TABLE demo_calls;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_demo_calls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update
DROP TRIGGER IF EXISTS trigger_demo_calls_updated_at ON demo_calls;
CREATE TRIGGER trigger_demo_calls_updated_at
  BEFORE UPDATE ON demo_calls
  FOR EACH ROW
  EXECUTE FUNCTION update_demo_calls_updated_at();
