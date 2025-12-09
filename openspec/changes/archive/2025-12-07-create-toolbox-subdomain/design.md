## Context
The user wants a scalable "Toolbox" to manage an undefined future number of tools (scrapers, generators, etc.). Some are simple, some are long-running (scraping), some require LLMs (Python/Complex logic). The user needs visualization, security, and notifications.

Constraints:
- Frontend is Next.js (Vercel). Vercel has strict timeouts (functions die after ~10-60s), so it CANNOT run long scrapers directly.
- Existing tools are Python (`scraper/`).
- User wants to "build dozens of tools" with vary schedules.

## Goals
- **Unified UI**: ONE place to see all tools.
- **Async Execution**: Fire-and-forget long jobs without browser timeouts.
- **Observability**: See what's running, what failed, and see results.
- **Security**: Prevent unauthorized access.

## Architecture Decisions

### 1. Job Queue Pattern (Supabase-mediated)
Instead of the UI calling the script directly (synchronous), we will use an **asynchronous Job Queue** pattern using Supabase.

*   **Database**: A `jobs` table in Supabase.
*   **Flow**:
    1.  User fills form in Toolbox UI -> Clicks "Run".
    2.  UI inserts a row into `jobs` table (status: `queued`).
    3.  **The Worker**: A Python service (running locally or on Railway/Render) polls (or subscribes via Realtime) to the `jobs` table.
    4.  Worker picks up the job, marks status `running`.
    5.  Worker executes the script (e.g., `lead_harvester.py`).
    6.  Worker updates `jobs` table with `complete` and saves results (JSON/CSV) to Supabase Storage or Database.
    7.  UI realizes job is done (via Realtime) and shows "Complete".

**Why?**
- Decouples UI from execution. UI never hangs.
- Allows "Local Dev" mode: User keeps the UI open, runs the `worker.py` in their terminal, and it processes jobs. Later, deploy `worker.py` to a cheap VPS/Railway for 24/7 scheduling.
- "Dozens of tools" just become new "Job Types" handled by the worker.

### 2. Authentication
- Use **Supabase Auth**.
- Wrap the entire `site/toolbox` app in a Middleware that checks for an authenticated session.
- Allows simple "Log in with Email" (or Magic Link) execution.

### 3. Notification System
- The Python Worker will handle notifications.
- When `job.status` -> `complete`, the Worker sends an email (via SendGrid/Resend) or Slack webhook.

## Data Model (Draft)
Table: `tools` (Registry of available tools)
- `key` (string, e.g., 'lead-scraper')
- `name` (string)
- `config_schema` (JSON, defines what inputs the UI shows)

Table: `jobs`
- `id` (uuid)
- `tool_key` (fk)
- `input_params` (JSON)
- `status` (queued, running, completed, failed)
- `result_summary` (JSON)
- `created_at`
- `started_at`
- `completed_at`

## Risks / Trade-offs
- **Running the Worker**: The user MUST run the backend worker for things to happen. If they just open the site and click "Run", nothing happens unless the worker is up.
    - *Mitigation*: Add a prominent "Worker Status" indicator in the UI (heartbeat).
