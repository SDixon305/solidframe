-- Create tools table
CREATE TABLE IF NOT EXISTS public.tools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('planned', 'building', 'priority', 'live')),
    icon TEXT,
    category TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on tools
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public tools)
CREATE POLICY "Allow public read access" ON public.tools FOR SELECT USING (true);


-- Create tool_specs table
CREATE TABLE IF NOT EXISTS public.tool_specs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id TEXT REFERENCES public.tools(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on tool_specs
ALTER TABLE public.tool_specs ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON public.tool_specs FOR SELECT USING (true);


-- Create tool_activity_logs table
CREATE TABLE IF NOT EXISTS public.tool_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id TEXT REFERENCES public.tools(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    category TEXT, -- e.g., 'deploy', 'fix', etc., maps to color in frontend
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on tool_activity_logs
ALTER TABLE public.tool_activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON public.tool_activity_logs FOR SELECT USING (true);


-- Create jobs table (or update if exists)
-- Checking existence first to avoid errors if it was manually created before
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id TEXT REFERENCES public.tools(id), -- Nullable if a job isn't specific to a tool? But usually it is.
    status TEXT CHECK (status IN ('queued', 'running', 'completed', 'failed')) DEFAULT 'queued',
    input_payload JSONB DEFAULT '{}'::jsonb,
    result_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (for status board)
CREATE POLICY "Allow public read access" ON public.jobs FOR SELECT USING (true);

-- Allow insert/update for service role (implicit, but explicit policy for anon might be needed if we want public dispatch)
-- For now, let's assume jobs are dispatched by authenticated users or service role. 
-- But if the frontend is public, we might need to allow INSERT for anon? 
-- Let's restrict INSERT to service role or authenticated for now to be safe, 
-- but actually the worker needs to update it. The worker likely uses service role.

-- To allow the "worker" (which might be just a script) to pick up jobs, it needs access.
-- If the worker updates via service role key, it bypasses RLS.
