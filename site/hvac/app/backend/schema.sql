-- HVAC Demo System Database Schema
-- Supabase Migration

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('north', 'south')),
  hours_start TIME,
  hours_end TIME,
  owner_name TEXT,
  owner_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  is_on_call BOOLEAN DEFAULT false,
  priority_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calls table
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  vapi_call_id TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  issue_description TEXT,
  transcript TEXT,
  priority_level TEXT CHECK (priority_level IN ('emergency', 'standard')),
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'in_progress', 'analyzing', 'dispatched', 'accepted', 'completed', 'escalated', 'missed')),
  assigned_tech_id UUID REFERENCES technicians(id),
  recording_url TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  dispatched_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('technician', 'owner')),
  recipient_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'responded', 'timeout')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  response_text TEXT
);

-- Daily reports table
CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  emergency_calls INTEGER DEFAULT 0,
  standard_calls INTEGER DEFAULT 0,
  missed_calls INTEGER DEFAULT 0,
  avg_response_time_seconds INTEGER,
  report_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, report_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_calls_business_id ON calls(business_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_vapi_id ON calls(vapi_call_id);
CREATE INDEX IF NOT EXISTS idx_technicians_business_id ON technicians(business_id);
CREATE INDEX IF NOT EXISTS idx_technicians_on_call ON technicians(is_on_call) WHERE is_on_call = true;
CREATE INDEX IF NOT EXISTS idx_notifications_call_id ON notifications(call_id);
CREATE INDEX IF NOT EXISTS idx_daily_reports_business_date ON daily_reports(business_id, report_date);

-- NOTE: No hardcoded demo business data
-- Business names are entered dynamically by users through the demo interface
-- The demo_sessions table (see migrations/create_demo_sessions.sql) stores user-configured businesses
