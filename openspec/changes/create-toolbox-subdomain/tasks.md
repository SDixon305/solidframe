## 1. Foundation & Auth
- [ ] 1.1 Create `site/toolbox` directory structure (Next.js App Router).
- [ ] 1.2 Implement Supabase Auth Gate (Middleware) for `site/toolbox`.
- [ ] 1.3 Create `jobs` and `tools` tables in Supabase (SQL migration).
- [ ] 1.4 Implement "Toolbox Home" showing list of tools from DB.

## 2. Job Engine (The "Worker")
- [ ] 2.1 Create `toolbox_worker/` directory (Python).
- [ ] 2.2 Implement `worker.py` that polls/listens to Supabase `jobs` table.
- [ ] 2.3 Implement "Heartbeat" to let UI know worker is online.

## 3. Tool: Lead Scraper
- [ ] 3.1 Refactor `scraper/lead_harvester.py` to be callable as a module/function.
- [ ] 3.2 Register "Lead Scraper" in `tools` table with input schema (City, Industry).
- [ ] 3.3 Create UI form in Toolbox to submit a Scraper job.
- [ ] 3.4 Wire up `worker.py` to execute Scraper logic when job is picked up.
- [ ] 3.5 Implement Result Viewer (link to CSV/Table view) in UI.

## 4. Notifications
- [ ] 4.1 Implement simple email/slack notification in `worker.py` on job complete.
