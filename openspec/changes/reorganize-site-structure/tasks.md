# Tasks: Reorganize Site Structure

## 1. Prepare New Structure
- [x] 1.1 Create `site/` directory with subdirectories (`home/`, `hvac/`, `hvac/app/`)
- [x] 1.2 Create `archive/` directory for old experiments
- [x] 1.3 Create `site/pages.json` registry file

## 2. Migrate Home Page
- [x] 2.1 Move `landing-01-simple-html/` contents to `site/home/` (this is the current solidframe.ai root)
- [x] 2.2 Verify home page assets and paths are correct

## 3. Migrate HVAC Landing Page
- [x] 3.1 Move `landing-04-solidframe-main/hvac/` contents to `site/hvac/` (landing page files)
- [x] 3.2 Move `landing-04-solidframe-main/index.html` and `style.css` to appropriate location or remove if duplicate
- [x] 3.3 Verify HVAC landing page assets (audio, images) are moved correctly

## 4. Migrate HVAC Demo App
- [x] 4.1 Move `app-hvac-demo-nextjs/frontend/` to `site/hvac/app/frontend/`
- [x] 4.2 Move `app-hvac-demo-nextjs/backend/` to `site/hvac/app/backend/`
- [x] 4.3 Update any hardcoded paths in the Next.js app
- [x] 4.4 Update `next.config.js` basePath if needed for `/hvac/dashboard` routing

## 5. Archive Old Experiments
- [x] 5.1 Move `landing-01-simple-html/` to `archive/` (after copying contents to site/home)
- [x] 5.2 Move `landing-02-rugged-vite/` to `archive/`
- [x] 5.3 Move `landing-03-discovery-vite/` to `archive/`
- [x] 5.4 Move `landing-04-solidframe-main/` to `archive/` (after extracting needed files)

## 6. Configure Vercel
- [x] 6.1 Create unified `site/vercel.json` with rewrites for all routes
- [ ] 6.2 Update Vercel project settings to deploy from `site/` directory
- [ ] 6.3 Configure build settings for Next.js app at `/hvac/app/frontend`

## 7. Update Registry and Documentation
- [x] 7.1 Populate `site/pages.json` with home and hvac entries
- [x] 7.2 Update `openspec/project.md` with new file organization
- [x] 7.3 Update root `README.md` to reflect new structure

## 8. Validation
- [ ] 8.1 Test local preview of home page
- [ ] 8.2 Test local preview of HVAC landing page
- [ ] 8.3 Test Next.js dev server for dashboard
- [ ] 8.4 Deploy to Vercel preview and verify all routes work
- [ ] 8.5 Remove old directories only after successful deployment

## Dependencies
- Task 2 depends on Task 1 completion
- Task 5 depends on Tasks 2, 3, 4 completion (files must be migrated first)
- Task 6 depends on Task 1 completion
- Task 8 depends on all other tasks

## Parallelizable Work
- Tasks 2, 3, 4 can run in parallel after Task 1
- Task 5 subtasks can run in parallel
- Task 7 can run in parallel with Task 6
