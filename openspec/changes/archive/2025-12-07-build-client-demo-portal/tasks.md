## 1. Shared Component Refactor
- [x] 1.1 Create `src/components/shared/` directory structure
- [x] 1.2 Extract `ToolGrid` from existing toolbox into shared component
- [x] 1.3 Extract `ToolCard` from existing toolbox into shared component
- [x] 1.4 Extract `DashboardLayout` wrapper into shared component
- [x] 1.5 Extract `Header` into shared component with personalization slot
- [x] 1.6 Extract `Sidebar` into shared component
- [x] 1.7 Update existing admin toolbox to use shared components

## 2. Demo Foundation
- [x] 2.1 Create `/client-demo` route with layout and demo context provider
- [x] 2.2 Implement magic link token parsing (decode owner/business from URL)
- [x] 2.3 Implement 14-day link expiration check with "Link Expired" UI
- [x] 2.4 Create demo dashboard page using shared ToolGrid/ToolCard
- [x] 2.5 Add personalized header ("Welcome, {owner} from {business}" or "Trinity Cooling")

## 3. Mock Data Layer
- [x] 3.1 Create `src/lib/mock-data/` directory structure
- [x] 3.2 Implement mock calls data (transcripts, timestamps, emergency flags)
- [x] 3.3 Implement mock leads data (names, phones, addresses by region)
- [x] 3.4 Implement mock competitors data (ratings, review counts, snippets)
- [x] 3.5 Implement mock training scenarios (questions, correct answers)
- [x] 3.6 Implement mock scheduler data (available slots, booking confirmations)

## 4. Demo Tools (using shared components + mock data)
- [x] 4.1 ROI Calculator - wrap existing component, reset state on mount
- [x] 4.2 Voice Agent Demo - mock call interface with scripted AI responses
- [x] 4.3 Lead Scraper - display mock leads with fake "scraping" animation
- [x] 4.4 Review Request Generator - SMS template preview with mock send
- [x] 4.5 Competitive Analysis - mock competitor cards with ratings/reviews
- [x] 4.6 Call Dashboard - mock live call feed with transcripts
- [x] 4.7 Technician Training Module - mock quiz/training flow
- [x] 4.8 Appointment Scheduler - mock calendar with booking flow

## 5. Admin: Magic Link Generator
- [x] 5.1 Create Supabase `demo_links` table (owner, business, token, created_at)
- [x] 5.2 Create `/admin/demo-links` page
- [x] 5.3 Build form for owner name + business name input
- [x] 5.4 Generate token with 14-day expiration timestamp
- [x] 5.5 Log link to Supabase on generation (analytics)
- [x] 5.6 Display shareable demo URL with "Copy Link" button

## 6. Polish
- [x] 6.1 Add demo mode indicator badge (so internal team knows it's demo)
- [x] 6.2 Ensure all demo pages reset state on reload (no localStorage)
- [x] 6.3 Test all 8 demo tools end-to-end (type check passed)
- [x] 6.4 Mobile responsive check for demo dashboard
- [x] 6.5 Verify shared components render correctly in both admin and demo

## Dependencies
- Section 1 (Shared Component Refactor) should be done first
- Section 2 depends on Section 1 (uses shared components)
- Section 3 can run in parallel with Section 2
- Section 4 depends on Sections 1, 2, 3
- Section 5 can run in parallel with Sections 3, 4
- Section 6 depends on all above
