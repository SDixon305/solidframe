# Tasks

1.  [ ] **Initialize Supabase Project & Schema**
    *   Create migrations for `tools`, `tool_specs`, `tool_activity_logs`.
    *   Update `jobs` table migration if needed.
    *   Apply migrations.

2.  [ ] **Seed Database**
    *   Write a script (or SQL) to populate `tools` and related tables with the data currently in `toolbox-data.ts`.

3.  [ ] **Connect Frontend**
    *   Install `@supabase/supabase-js` in `site/toolbox` (if not already there).
    *   Create `src/lib/supabase.ts` client.
    *   Create `src/hooks/use-toolbox.ts` to fetch data.
    *   Refactor `dashboard/page.tsx`, `status/page.tsx` and `ToolDetailModal.tsx` to use the new hooks instead of static constants.

4.  [ ] **Update Worker**
    *   Update `worker.py` `process_job` to respect any new schema changes (ensure it writes back to `jobs` correctly).

5.  [ ] **Verify End-to-End**
    *   Start the worker.
    *   Load the frontend.
    *   Confirm data appears.
    *   (Future) Dispatch a job.
