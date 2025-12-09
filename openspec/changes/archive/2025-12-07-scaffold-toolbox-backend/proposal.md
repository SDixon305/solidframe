# Proposal: Scaffold Toolbox Backend

**Change ID**: `scaffold-toolbox-backend`

## Goal
Transition the "SolidFrame Toolbox" from a static, mock-data frontend to a dynamic, database-driven application. This will enable real-time status updates, job dispatching, and persistent tool configurations.

## Impact
- **Real-time Status**: Status board will reflect actual database state.
- **Job Execution**: The Python worker will process real jobs queued by the frontend.
- **Scalability**: New tools can be added via database inserts without code changes.

## Proposed Changes

### 1. Database Schema (Supabase)
We will create the following tables to mirror the structure in `toolbox-data.ts` but normalized for a relational DB.

- **`tools`**:
  - `id` (text, primary key) - e.g., 'roi-projector'
  - `name` (text)
  - `description` (text)
  - `status` (enum: 'planned', 'building', 'priority', 'live')
  - `icon` (text) - references Lucide icon name
  - `category` (text) - e.g., 'sales_demos'
  - `image_url` (text)

- **`tool_specs`**:
  - `id` (uuid)
  - `tool_id` (text, references tools.id)
  - `label` (text)
  - `completed` (boolean)
  - `order` (integer)

- **`tool_activity_logs`**:
  - `id` (uuid)
  - `tool_id` (text, references tools.id)
  - `message` (text)
  - `category` (text/enum) - for color coding (e.g., 'deploy', 'fix', 'update')
  - `created_at` (timestamp, default now())

- **`jobs`** (Enhanced from existing):
  - `id` (uuid)
  - `tool_id` (text, references tools.id)
  - `status` (enum: 'queued', 'running', 'completed', 'failed')
  - `input_payload` (jsonb)
  - `result_payload` (jsonb)
  - `created_at` (timestamp)
  - `started_at` (timestamp)
  - `completed_at` (timestamp)

### 2. Frontend Integration (`site/toolbox`)
- Create a Supabase client for the frontend.
- Replace `toolbox-data.ts` with a data fetching hook (e.g., `useTools()`) that queries Supabase.
- Update `ToolDetailModal` to fetch `specs` and `activityLog` from the DB.
- Update `StatusBoard` to act as a real-time subscriber to changes (optional for V1, start with polling/SWR).

### 3. Worker Integration (`toolbox_worker`)
- Update `worker.py` to poll the `jobs` table with the new schema.
- Ensure efficient updating of job status and results.

## Verification Plan

### Automated
- **Schema Validation**: Verify tables exist and have correct constraints via SQL query tool.

### Manual
- **Data Migration**: Insert the existing mock data from `toolbox-data.ts` into the new Supabase tables.
- **Frontend Check**: Verify the Dashboard and Status Board load data correctly from Supabase.
- **End-to-End Test**: Trigger a "Job" (even a dummy one) from the frontend (or manually via SQL) and watch the Python worker pick it up and complete it.
