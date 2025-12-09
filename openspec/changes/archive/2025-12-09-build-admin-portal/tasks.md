# Tasks: Build Admin Portal

## CRITICAL: Build On Existing Work

The toolbox already has a well-developed design system. **All sub-agents MUST:**

1. **Use existing shared components** from `src/components/shared/`:
   - `Sidebar` - Can be adapted for admin navigation
   - `ToolCard` - Card pattern with icon, status, action
   - `DashboardLayout` - Layout wrapper pattern

2. **Extend existing admin code**:
   - `src/app/admin/layout.tsx` - Already exists, enhance it
   - `src/components/admin/AdminHeader.tsx` - Already exists with nav
   - `src/app/admin/clients/page.tsx` - Client list page exists
   - `src/app/admin/agents/page.tsx` - Agents page exists

3. **Follow the existing theme** from `src/lib/theme.ts` and `src/app/globals.css`:
   - Primary accent: `#5f3bff` (purple)
   - App background: `#f4f5f7`
   - Sidebar: `slate-900` dark or light header style
   - Status badges: Use existing `statusColors` from theme

4. **Study existing patterns** before coding - read the files first!

## Execution Strategy

Task 2A (shell) must complete first. Then 2B-2E can run **in parallel**.

```
2A (Shell) ──┬──> 2B (Client CRUD) ────────────┐
             ├──> 2C (Tool Config UI) ─────────┤
             ├──> 2D (Analytics) ──────────────┼──> Done
             └──> 2E (Alerts) ─────────────────┘
```

---

## 2A. Admin Dashboard Shell & Navigation

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read these files to understand the project structure and requirements:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/admin/layout.tsx` (already exists)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/components/admin/AdminHeader.tsx` (already exists)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/theme.ts`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/globals.css`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/components/shared/` (existing shared components)

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Platform foundation (auth, DB) is complete
- This is the internal admin portal for super_admin users only

## Your Task
Create the admin layout shell with navigation, not the page content.

## Files to Create
1. `src/app/admin/layout.tsx` - Admin layout wrapper (ENHANCE existing)
2. `src/app/admin/page.tsx` - Dashboard home (placeholder metrics)
3. `src/components/admin/AdminSidebar.tsx` - Navigation sidebar
4. `src/components/admin/AdminHeader.tsx` - Top header with user menu (ENHANCE existing)
5. `src/components/admin/MetricCard.tsx` - Reusable metric display
6. `src/components/admin/AlertBadge.tsx` - Unread alert count badge

## Design Requirements
- Dark sidebar (slate-900) with light content area
- Navigation items: Dashboard, Clients, Tools, Analytics, Alerts
- Alerts nav item shows unread count badge
- User menu in header with logout option
- Mobile responsive (sidebar collapses to hamburger)
- Active nav item highlighted

## Navigation Structure
- /admin → Dashboard
- /admin/clients → Client list
- /admin/tools → Tool list
- /admin/analytics → Analytics
- /admin/alerts → Alert inbox

## Dashboard Home Content (Placeholder)
- 4 MetricCards: Total Clients, Active Tools, Calls This Month, Alerts
- Use hardcoded placeholder values for now
- "Recent Alerts" section (empty state)

## Requirements
- Layout checks for super_admin role, redirects if not
- Use existing design patterns from toolbox (Tailwind, slate colors)
- Include loading states
- Server component for layout, client components for interactive parts

## Checklist (complete ALL items)
- [x] 2A.1 Create admin layout with auth check
- [x] 2A.2 Create AdminSidebar component
- [x] 2A.3 Create AdminHeader component
- [x] 2A.4 Create MetricCard component
- [x] 2A.5 Create dashboard home page with placeholders
- [x] 2A.6 Add mobile responsive behavior

## Acceptance Criteria
- Admin layout renders with sidebar and header
- Navigation works between placeholder pages
- Non-super_admin users redirected to /login
- Mobile responsive
- Alert badge shows (hardcoded count for now)

## Do Not
- Implement actual data fetching (that's 2B-2E)
- Create client CRUD UI
- Create tool management UI
- Style extensively beyond functional

## When Complete
Report back with:
- List of all files created or modified (with full paths)
- Any design decisions made or deviations from the spec
- Confirmation that all checklist items are completed
- Any issues encountered or blockers
- Screenshots or descriptions of the UI if possible
```

---

## 2B. Client Management UI

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read these files to understand the project structure and requirements:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/admin/layout.tsx` (from 2A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/admin/clients/page.tsx` (already exists, enhance)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/theme.ts`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/components/shared/` (existing shared components)

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Admin shell from 2A is complete
- API routes from foundation are available

## Your Task
Build the complete client management UI with CRUD operations.

## Files to Create
1. `src/app/admin/clients/page.tsx` - Client list (ENHANCE existing)
2. `src/app/admin/clients/new/page.tsx` - Create client form
3. `src/app/admin/clients/[id]/page.tsx` - Client detail (overview tab)
4. `src/app/admin/clients/[id]/tools/page.tsx` - Tool activation tab
5. `src/app/admin/clients/[id]/usage/page.tsx` - Usage stats tab
6. `src/app/admin/clients/[id]/config/page.tsx` - Tool configs tab
7. `src/app/admin/clients/[id]/view-as/page.tsx` - Impersonate view
8. `src/components/admin/ClientCard.tsx` - Client list item
9. `src/components/admin/ClientForm.tsx` - Create/edit form
10. `src/components/admin/ToolActivationGrid.tsx` - Tool toggle grid
11. `src/components/admin/ClientTabs.tsx` - Tab navigation

## API Routes to Use
- GET /api/admin/tenants - List clients
- POST /api/admin/tenants - Create client
- GET /api/admin/tenants/[id] - Get client detail
- PUT /api/admin/tenants/[id] - Update client
- DELETE /api/admin/tenants/[id] - Delete client
- PUT /api/admin/tenants/[id]/tools - Activate/deactivate tools

## Client List Features
- Search by name
- Filter by status (active, suspended, cancelled)
- Sort by created date, name
- Show: name, logo, status badge, tool count, created date
- Click to go to detail

## Create Client Form
- Company name (required)
- Owner name
- Owner email (required, for login)
- Business address
- Business type (HVAC, Plumbing, Electrical, Other)
- Logo upload (optional)
- Auto-generate slug from company name

## Client Detail Tabs
1. **Overview**: Basic info, status, subscription status, quick stats
2. **Tools**: Grid of all 8 tools with activate/deactivate toggles
3. **Usage**: Charts showing calls, SMS, etc. (placeholder data OK)
4. **Config**: View/edit tool configurations (JSON editor)
5. **View As**: Iframe or link to client portal in read-only mode

## Requirements
- All forms have validation and error handling
- Optimistic UI updates where appropriate
- Confirmation dialogs for destructive actions
- Loading skeletons while data fetches

## Checklist (complete ALL items)
- [x] 2B.1 Create client list page with search/filter
- [x] 2B.2 Create client form component
- [x] 2B.3 Create new client page
- [x] 2B.4 Create client detail overview tab
- [x] 2B.5 Create tool activation tab with toggle grid
- [x] 2B.6 Create usage tab (placeholder charts)
- [x] 2B.7 Create config tab with JSON viewer
- [x] 2B.8 Create view-as tab

## Acceptance Criteria
- Can list all clients with search/filter
- Can create new client
- Can view client details across all tabs
- Can activate/deactivate tools per client
- Can view tool configurations
- View-as shows client portal perspective

## Do Not
- Implement analytics (that's 2D)
- Implement alerts (that's 2E)
- Build the client portal itself (that's Master 3)

## When Complete
Report back with:
- List of all files created or modified (with full paths)
- Any design decisions made or deviations from the spec
- Confirmation that all checklist items are completed
- Any issues encountered or blockers
- Description of how the client management flow works
```

---

## 2C. Tool Configuration Engine UI

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read these files to understand the project structure and requirements:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/admin/layout.tsx` (from 2A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/theme.ts`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/components/shared/` (existing shared components)

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Admin shell from 2A is complete
- Tool engine APIs from foundation are available

## Your Task
Build the tool management and version deployment UI.

## Files to Create
1. `src/app/admin/tools/page.tsx` - Tool list
2. `src/app/admin/tools/[slug]/page.tsx` - Tool detail
3. `src/app/admin/tools/[slug]/versions/page.tsx` - Version management
4. `src/components/admin/ToolCard.tsx` - Tool list item
5. `src/components/admin/VersionCard.tsx` - Version list item
6. `src/components/admin/VersionEditor.tsx` - Config schema editor
7. `src/components/admin/DeployControls.tsx` - Deploy/rollback UI
8. `src/components/admin/RolloutSlider.tsx` - Canary percentage slider

## API Routes to Use
- GET /api/admin/tools - List tools
- GET /api/admin/tools/[slug]/versions - List versions
- POST /api/admin/tools/[slug]/versions - Create version
- PUT /api/admin/versions/[id] - Update version
- POST /api/admin/versions/[id]/deploy - Deploy to stage
- POST /api/admin/versions/[id]/rollback - Rollback

## Tool List Features
- Grid of 8 tools with icon, name, description
- Badge showing "Real" vs "Mockup"
- Current production version number
- Active tenant count using this tool

## Tool Detail
- Tool metadata (name, description, category)
- Quick stats (tenants using, total calls/actions)
- Link to version management

## Version Management
- List of all versions with status badges (draft, staging, production, deprecated)
- Create new version button (copies from latest)
- Version card shows:
  - Version number (e.g., v1.2.3)
  - Status badge
  - Created date
  - Rollout percentage (if production)
  - Actions: Edit, Deploy, Rollback

## Deploy Flow
1. Select draft version → "Deploy to Staging" button
2. Test in staging
3. "Deploy to Production" with rollout slider (0-100%)
4. Monitor, then increase to 100%

## Rollback Flow
1. Click "Rollback" on current production version
2. Confirmation dialog: "This will restore v1.2.2 for all tenants"
3. Instant rollback, no percentage

## Version Editor
- JSON editor for config_schema
- Preview of default configuration
- Validate JSON before save

## Requirements
- Status badge colors: draft=gray, staging=yellow, production=green, deprecated=red
- Rollout slider shows exact percentage
- Deploy/rollback require confirmation
- Show which tenants are affected by deploy

## Checklist (complete ALL items)
- [x] 2C.1 Create tool list page
- [x] 2C.2 Create tool detail page
- [x] 2C.3 Create version list with status badges
- [x] 2C.4 Create version editor component
- [x] 2C.5 Create deploy controls with rollout slider
- [x] 2C.6 Implement deploy to staging flow
- [x] 2C.7 Implement deploy to production flow
- [x] 2C.8 Implement rollback flow

## Acceptance Criteria
- Can view all 8 tools in grid
- Can view tool detail and versions
- Can create new version
- Can edit version config schema
- Can deploy draft → staging → production
- Can adjust rollout percentage
- Can rollback to previous version

## Do Not
- Modify actual tool behavior (just config management)
- Build the tool UIs themselves (that's Master 3)

## When Complete
Report back with:
- List of all files created or modified (with full paths)
- Any design decisions made or deviations from the spec
- Confirmation that all checklist items are completed
- Any issues encountered or blockers
- Description of the deploy/rollback flow
```

---

## 2D. Analytics Dashboard

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read these files to understand the project structure and requirements:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/admin/layout.tsx` (from 2A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/theme.ts`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/components/shared/` (existing shared components)

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Admin shell from 2A is complete

## Your Task
Build the platform-wide analytics dashboard.

## Files to Create
1. `src/app/admin/analytics/page.tsx` - Analytics dashboard
2. `src/components/admin/UsageChart.tsx` - Time series chart
3. `src/components/admin/ClientBreakdown.tsx` - Per-client usage table
4. `src/components/admin/RevenueCard.tsx` - Revenue metrics
5. `src/components/admin/ToolUsageChart.tsx` - Tool popularity chart
6. `src/lib/analytics.ts` - Analytics data fetching

## API Routes
- GET /api/admin/analytics - Aggregated metrics
- GET /api/admin/analytics/usage - Usage time series
- GET /api/admin/analytics/revenue - Revenue from Stripe
- GET /api/admin/analytics/clients - Per-client breakdown

## Dashboard Sections

### Overview Metrics (top row)
- Total Clients (with trend arrow)
- Monthly Recurring Revenue (MRR)
- Total Actions This Month (calls, SMS, etc.)
- Active Tools (tools with >0 usage)

### Usage Over Time (line chart)
- Last 30 days
- Lines for: Calls Handled, SMS Sent, Appointments Booked
- Toggleable series

### Client Breakdown (table)
- Columns: Client Name, Calls, SMS, Last Active, Status
- Sortable columns
- Link to client detail

### Tool Popularity (bar chart)
- Horizontal bars showing usage per tool
- After Hours Agent likely highest

### Revenue (if Stripe connected)
- MRR trend
- Recent payments list

## Requirements
- Use a charting library (recharts recommended, already common in React)
- Loading skeletons while data fetches
- Empty states for new platforms with no data
- Date range selector (7d, 30d, 90d)

## Checklist (complete ALL items)
- [x] 2D.1 Create analytics page layout
- [x] 2D.2 Create UsageChart component
- [x] 2D.3 Create ClientBreakdown table
- [x] 2D.4 Create ToolUsageChart
- [x] 2D.5 Create RevenueCard (placeholder if no Stripe)
- [x] 2D.6 Add date range filter
- [x] 2D.7 Create analytics API routes

## Acceptance Criteria
- Dashboard loads with overview metrics
- Usage chart shows time series data
- Client breakdown table is sortable
- Tool usage chart displays correctly
- Date range filter works
- Handles empty data gracefully

## Do Not
- Build real-time updates (poll on page load is fine)
- Implement complex filtering (keep it simple)

## Note
For initial build, use realistic fake data if usage_logs table is empty.
Create a seed script or use placeholder data structure.

## When Complete
Report back with:
- List of all files created or modified (with full paths)
- Any design decisions made or deviations from the spec
- Confirmation that all checklist items are completed
- Any issues encountered or blockers
- Description of the analytics data structure used
```

---

## 2E. Alert System

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read these files to understand the project structure and requirements:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-admin-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/admin/layout.tsx` (from 2A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/theme.ts`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/components/shared/` (existing shared components)

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Admin shell from 2A is complete
- alerts table exists in database

## Your Task
Build the alert inbox and notification system.

## Files to Create
1. `src/app/admin/alerts/page.tsx` - Alert inbox
2. `src/components/admin/AlertList.tsx` - Alert list component
3. `src/components/admin/AlertItem.tsx` - Individual alert
4. `src/components/admin/AlertFilters.tsx` - Filter by type/severity
5. `src/lib/alerts.ts` - Alert CRUD operations
6. `src/hooks/useAlerts.ts` - Hook with real-time subscription
7. `src/app/api/admin/alerts/route.ts` - List alerts API
8. `src/app/api/admin/alerts/[id]/route.ts` - Update alert (mark read)
9. `src/lib/alert-triggers.ts` - Functions to create alerts

## Alert Types
- client.created (info)
- client.onboarded (info)
- client.first_call (success)
- billing.payment_received (success)
- billing.payment_failed (error)
- billing.subscription_cancelled (warning)
- tool.error (error)
- tool.deployed (info)
- usage.threshold (warning)
- system.error (error)

## Alert Inbox Features
- List all alerts, newest first
- Filter by: type (client, billing, tool, system), severity, read/unread
- Mark individual as read
- Mark all as read
- Click alert to navigate to related item (e.g., client detail)

## Real-time Updates
- Use Supabase real-time subscription on alerts table
- New alerts appear at top without refresh
- Badge in sidebar updates in real-time

## Alert Item Display
- Icon based on type
- Color based on severity (info=blue, success=green, warning=yellow, error=red)
- Title, message, timestamp
- Unread indicator (dot or bold)
- Link to related resource

## Alert Triggers
Create functions that insert alerts. These will be called from:
- Stripe webhook (billing events)
- Client creation flow
- Tool deployment
- Error handlers

Example:
```typescript
export async function createAlert(
  type: AlertType,
  title: string,
  message: string,
  tenantId?: string,
  metadata?: Record<string, any>
)
```

## Requirements
- Alerts persist in database (not just in-memory)
- Real-time subscription for live updates
- Efficient query with pagination (100 alerts per page)
- Severity-based styling

## Checklist (complete ALL items)
- [x] 2E.1 Create alerts API routes
- [x] 2E.2 Create AlertList component
- [x] 2E.3 Create AlertItem with severity styling
- [x] 2E.4 Create AlertFilters component
- [x] 2E.5 Create alerts page
- [x] 2E.6 Implement real-time subscription
- [x] 2E.7 Create alert trigger functions
- [x] 2E.8 Wire up sidebar badge to real-time count

## Acceptance Criteria
- Alert inbox displays all alerts
- Can filter by type and severity
- Can mark alerts as read
- New alerts appear in real-time
- Sidebar badge updates in real-time
- Alert triggers can be called from anywhere

## Do Not
- Implement email notifications (future enhancement)
- Create alerts automatically (just build the system)

## When Complete
Report back with:
- List of all files created or modified (with full paths)
- Any design decisions made or deviations from the spec
- Confirmation that all checklist items are completed
- Any issues encountered or blockers
- Description of how the real-time subscription works
```

---

## Completion Checklist

After all sub-agents complete:

- [x] Admin dashboard fully functional
- [x] Can create and manage clients end-to-end
- [x] Can deploy tool versions with canary rollout
- [x] Analytics show meaningful data (or placeholders)
- [x] Alerts system receives and displays notifications
- [x] Update home dashboard metrics to use real data
