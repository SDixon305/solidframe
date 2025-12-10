-- Migration: Create demo_sessions table for dynamic business name support
-- Run this in your Supabase SQL Editor

-- Create the demo_sessions table
CREATE TABLE IF NOT EXISTS demo_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT,
  owner_phone TEXT,
  region TEXT DEFAULT 'south' CHECK (region IN ('north', 'south')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup of active session
CREATE INDEX IF NOT EXISTS idx_demo_sessions_active
ON demo_sessions(is_active, created_at DESC);

-- Enable Row Level Security (required for Supabase)
ALTER TABLE demo_sessions ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (for demo purposes)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations on demo_sessions"
ON demo_sessions
FOR ALL
USING (true)
WITH CHECK (true);

-- Grant access to anon and authenticated users
GRANT ALL ON demo_sessions TO anon;
GRANT ALL ON demo_sessions TO authenticated;
