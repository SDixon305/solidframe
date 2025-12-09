# Tasks: Build Platform Foundation

## CRITICAL: Build On Existing Work

The toolbox already has a well-developed design system and components. **All sub-agents MUST:**

1. **Use existing shared components** from `src/components/shared/`:
   - `Sidebar` - Dark sidebar with branding, navigation, user footer
   - `Header` - Light header with folder info
   - `ToolCard` - Card with icon, status badge, action button
   - `ToolGrid` - Responsive grid of tool cards
   - `DashboardLayout` - Full layout wrapper with sidebar + header + content

2. **Follow the existing theme** from `src/lib/theme.ts` and `src/app/globals.css`:
   - Primary accent: `#5f3bff` (purple)
   - Sidebar: `slate-900` to `slate-950` gradient
   - Highlight: `amber-400/500`
   - App background: `#f4f5f7`
   - Card background: white with `border-slate-200`

3. **Study existing patterns** before coding:
   - Admin layout: `src/app/admin/layout.tsx` and `src/components/admin/AdminHeader.tsx`
   - Client demo: `src/app/client-demo/` (pattern for tenant portals)
   - Demo context: `src/lib/demo-context.tsx` (pattern for tenant context)
   - Supabase client: `src/lib/supabase.ts` (existing client setup)
   - Login page: `src/app/login/page.tsx` (existing login UI)

4. **Extend, don't replace** existing code - modify existing files when appropriate

## Execution Strategy

These tasks are **sequential** - each depends on the previous completing. Sub-agents cannot run in parallel for this proposal.

---

## 1. Database Schema & Migrations

**Sub-agent prompt:**

```
You are implementing the database schema for a multi-tenant SaaS platform.

## FIRST: Read These Files for Full Context
Before writing any code, read these files to understand the project:
1. `openspec/changes/build-platform-foundation/proposal.md` - Why we're building this
2. `openspec/changes/build-platform-foundation/design.md` - Architecture decisions, full ERD schema
3. `openspec/project.md` - Project conventions

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Database: Supabase (PostgreSQL)
- Existing tables: demo_sessions, demo_calls, demo_links (leave untouched)

## Your Task
Create SQL migration files for the new multi-tenant schema.

## Checklist (complete ALL items)
- [x] 1.1 Create tenants migration
- [x] 1.2 Create users migration
- [x] 1.3 Create tools and tool_versions migrations
- [x] 1.4 Create tenant_tools and tenant_tool_configs migrations
- [x] 1.5 Create subscriptions migration
- [x] 1.6 Create usage_logs migration
- [x] 1.7 Create alerts migration
- [x] 1.8 Create feedback migration
- [x] 1.9 Create onboarding_progress migration
- [x] 1.10 Seed 8 tool definitions

## Files to Create
1. `supabase/migrations/02_tenants.sql` - tenants table
2. `supabase/migrations/03_users.sql` - users table with tenant FK
3. `supabase/migrations/04_tools.sql` - tools and tool_versions tables
4. `supabase/migrations/05_tenant_tools.sql` - tenant_tools and tenant_tool_configs
5. `supabase/migrations/06_subscriptions.sql` - subscriptions table
6. `supabase/migrations/07_usage_logs.sql` - usage_logs table
7. `supabase/migrations/08_alerts.sql` - alerts table
8. `supabase/migrations/09_feedback.sql` - feedback table
9. `supabase/migrations/10_onboarding.sql` - onboarding_progress table
10. `supabase/migrations/11_seed_tools.sql` - Seed 8 tool definitions

## Tool Definitions to Seed
1. after-hours-agent (is_real: true)
2. missed-call-textback (is_real: false)
3. review-request-bot (is_real: false)
4. appointment-reminders (is_real: false)
5. quote-reviver (is_real: false)
6. seasonal-campaigns (is_real: false)
7. maintenance-renewal (is_real: false)
8. tech-training (is_real: false)

## Requirements
- All tables need: id UUID PK, created_at, updated_at (where applicable)
- Enable RLS on ALL tables (ALTER TABLE x ENABLE ROW LEVEL SECURITY)
- Create placeholder RLS policies (allow all for now - will tighten in task 3)
- Add appropriate indexes for common queries
- Use proper foreign key constraints with ON DELETE behavior
- Include comments explaining each table's purpose

## Acceptance Criteria
- [x] All 10 migration files created
- [x] Each file is valid SQL that can run independently
- [x] RLS enabled on all tables
- [x] 8 tools seeded with correct slugs and metadata
- [x] Foreign keys properly defined

## Do Not
- Modify existing demo_* tables
- Create API routes (that's task 2)
- Add TypeScript types (that's task 2)

## When Complete
Report back with:
1. List of all files created
2. Any issues or decisions you made
3. Confirmation all checklist items (1.1-1.10) are done
```

---

## 2. Auth System Implementation

**Sub-agent prompt:**

```
You are implementing Supabase Auth with magic links for a multi-tenant platform.

## FIRST: Read These Files for Full Context
Before writing any code, read these files to understand the project:
1. `openspec/changes/build-platform-foundation/proposal.md` - Why we're building this
2. `openspec/changes/build-platform-foundation/design.md` - Architecture decisions, auth design
3. `openspec/project.md` - Project conventions

Also study these EXISTING files before coding:
- `src/lib/supabase.ts` - Existing Supabase client (extend this, don't replace)
- `src/app/login/page.tsx` - Existing login page (enhance this)
- `src/middleware.ts` - May exist, check first
- `src/utils/supabase/` - Existing utils directory

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Database schema from Task 1 is complete (migrations in supabase/migrations/)
- Using Supabase Auth with magic links

## Your Task
Implement the authentication system with role-based access.

## Checklist (complete ALL items)
- [x] 2.1 Create Supabase server/client utilities
- [x] 2.2 Implement login API route (magic link)
- [x] 2.3 Implement callback API route
- [x] 2.4 Implement logout API route
- [x] 2.5 Create auth middleware
- [x] 2.6 Enhance login page UI (extend existing, don't replace)
- [x] 2.7 Create auth context provider
- [x] 2.8 Add TypeScript types

## Files to Create/Modify
1. `src/lib/supabase-server.ts` - Server-side Supabase client with auth
2. Modify `src/lib/supabase.ts` - Ensure client-side auth works
3. `src/middleware.ts` - Route protection middleware
4. `src/app/api/auth/login/route.ts` - Send magic link
5. `src/app/api/auth/callback/route.ts` - Handle magic link callback
6. `src/app/api/auth/logout/route.ts` - End session
7. Enhance `src/app/login/page.tsx` - Add magic link flow to existing UI
8. `src/lib/auth-context.tsx` - React context for auth state
9. `src/types/auth.ts` - TypeScript types for auth

## Roles
- super_admin: SolidFrame staff, can see all tenants
- admin: Not used initially (future: client admins)
- client_user: Regular client, sees only their tenant

## Route Protection Rules
- /admin/* - Requires super_admin role
- /[tenant-slug]/* - Requires user with matching tenant_id
- /login - Public
- /api/webhooks/* - Public (verified by signature)
- /client-demo/* - Public (existing demo)

## Requirements
- Magic link sends email via Supabase Auth
- On first login, create user record in `users` table linked to auth.users
- Store role in users.role column
- Middleware checks auth on every protected request
- Auth context provides: user, tenant, isLoading, login, logout

## Acceptance Criteria
- [x] Can send magic link to email
- [x] Magic link click logs user in
- [x] User record created on first login
- [x] Middleware blocks unauthorized access to /admin/*
- [x] Auth context available throughout app
- [x] Logout clears session

## Do Not
- Implement password auth
- Create admin UI (that's Master Proposal 2)
- Create client UI (that's Master Proposal 3)
- Replace existing files - extend them

## When Complete
Report back with:
1. List of all files created/modified
2. Any issues or decisions you made
3. Confirmation all checklist items (2.1-2.8) are done
```

---

## 3. RLS Policies & Tenant Isolation

**Sub-agent prompt:**

```
You are implementing Row-Level Security policies for multi-tenant data isolation.

## FIRST: Read These Files for Full Context
Before writing any code, read these files:
1. `openspec/changes/build-platform-foundation/proposal.md` - Why we're building this
2. `openspec/changes/build-platform-foundation/design.md` - RLS policy strategy section
3. All migration files in `supabase/migrations/02_*.sql` through `11_*.sql` - Understand the schema

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Database schema from Task 1 is complete
- Auth system from Task 2 is complete
- Tables have RLS enabled but only placeholder "allow all" policies

## Your Task
Replace placeholder policies with proper tenant-isolation policies.

## Checklist (complete ALL items)
- [x] 3.1 Create helper functions (get_user_tenant_id, is_super_admin)
- [x] 3.2 Create tenants table policies
- [x] 3.3 Create users table policies
- [x] 3.4 Create tools/tool_versions table policies
- [x] 3.5 Create tenant_tools/tenant_tool_configs policies
- [x] 3.6 Create subscriptions policies
- [x] 3.7 Create usage_logs policies
- [x] 3.8 Create alerts policies
- [x] 3.9 Create feedback policies
- [x] 3.10 Create onboarding_progress policies

## Files to Create
1. `supabase/migrations/20_rls_policies.sql` - All RLS policies in one file

## Policy Rules

### tenants table
- super_admin: SELECT, INSERT, UPDATE, DELETE all
- client_user: SELECT only their tenant (via users.tenant_id)

### users table
- super_admin: SELECT, INSERT, UPDATE, DELETE all
- client_user: SELECT only users in their tenant

### tools table
- Everyone: SELECT all (tools are global)
- super_admin: INSERT, UPDATE, DELETE

### tool_versions table
- Everyone: SELECT all
- super_admin: INSERT, UPDATE, DELETE

### tenant_tools table
- super_admin: All operations
- client_user: SELECT only their tenant's tools

### tenant_tool_configs table
- super_admin: All operations
- client_user: SELECT, UPDATE only their tenant's configs

### subscriptions table
- super_admin: All operations
- client_user: SELECT only their tenant's subscription

### usage_logs table
- super_admin: SELECT all, INSERT all
- client_user: SELECT only their tenant's logs
- System: INSERT via service role

### alerts table
- super_admin: All operations
- client_user: No access (admin-only)

### feedback table
- super_admin: SELECT, UPDATE all
- client_user: SELECT, INSERT only their tenant's feedback

### onboarding_progress table
- super_admin: All operations
- client_user: SELECT, UPDATE only their tenant's progress

## Helper Functions to Create
```sql
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND role = 'super_admin'
  )
$$ LANGUAGE sql SECURITY DEFINER;
```

## Acceptance Criteria
- [x] All placeholder policies replaced
- [x] Helper functions created
- [x] super_admin can access all data
- [x] client_user can only access their tenant's data
- [x] Policies are performant (use indexes)

## Do Not
- Modify table structures
- Create API routes
- Test in application (just create the SQL)

## When Complete
Report back with:
1. Confirmation the migration file was created
2. Count of policies created per table
3. Confirmation all checklist items (3.1-3.10) are done
```

---

## 4. Tool Engine & Stripe Skeleton

**Sub-agent prompt:**

```
You are implementing the tool versioning engine and Stripe integration skeleton.

## FIRST: Read These Files for Full Context
Before writing any code, read these files:
1. `openspec/changes/build-platform-foundation/proposal.md` - Why we're building this
2. `openspec/changes/build-platform-foundation/design.md` - Tool versioning design
3. `openspec/project.md` - Project conventions
4. `supabase/migrations/04_tools.sql` - Tools and tool_versions schema

Also study existing patterns:
- `src/lib/supabase.ts` - How Supabase client is used
- `src/app/api/` - Existing API route patterns

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Database schema, auth, and RLS from Tasks 1-3 are complete

## Your Task
Create the tool versioning system and Stripe webhook skeleton.

## Checklist (complete ALL items)
- [x] 4.1 Create tool TypeScript types
- [x] 4.2 Implement tool-engine.ts with versioning logic
- [x] 4.3 Create tools CRUD API route
- [x] 4.4 Create versions CRUD API route
- [x] 4.5 Create deploy/rollback API routes
- [x] 4.6 Initialize Stripe client
- [x] 4.7 Create Stripe webhook handler
- [x] 4.8 Create subscription management route

## Files to Create

### Tool Engine
1. `src/lib/tool-engine.ts` - Core tool versioning logic
2. `src/types/tools.ts` - TypeScript types for tools
3. `src/app/api/admin/tools/route.ts` - CRUD for tool definitions
4. `src/app/api/admin/versions/route.ts` - CRUD for tool versions
5. `src/app/api/admin/versions/[id]/deploy/route.ts` - Deploy version to production
6. `src/app/api/admin/versions/[id]/rollback/route.ts` - Rollback to previous version

### Stripe Integration
7. `src/lib/stripe.ts` - Stripe client initialization
8. `src/app/api/webhooks/stripe/route.ts` - Webhook handler
9. `src/app/api/admin/tenants/[id]/subscription/route.ts` - Manage subscription

## Tool Versioning Logic
- Versions have status: draft, staging, production, deprecated
- Only one version per tool can be "production" at a time
- Deploy to staging first, then promote to production
- Rollout percentage (0-100) for canary deploys
- When getting tool config for tenant, resolve version based on:
  1. Tenant-pinned version (if set)
  2. Production version with rollout_pct check
  3. Fallback to previous production version

## Stripe Webhook Events to Handle
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed

## Requirements
- Tool engine functions are pure TypeScript (testable)
- Stripe webhook verifies signature
- All admin routes check for super_admin role using auth middleware
- Include proper error handling

## Acceptance Criteria
- [x] Can create/update tool versions via API
- [x] Can deploy version to staging/production
- [x] Can rollback to previous version
- [x] Stripe webhook receives and logs events
- [x] Subscription status syncs to database

## Do Not
- Create UI (that's Master Proposal 2)
- Set up actual Stripe products/prices (manual setup)
- Implement full billing flows (skeleton only)

## When Complete
Report back with:
1. List of all files created
2. Brief description of the tool versioning logic implemented
3. Confirmation all checklist items (4.1-4.8) are done
```

---

## Completion Checklist

After all sub-agents complete:

- [x] Run all migrations against Supabase
- [x] Verify auth flow works end-to-end
- [x] Verify RLS policies block unauthorized access
- [x] Verify tool versioning API works
- [x] Verify Stripe webhook receives test events
- [x] Update `openspec/specs/` with new capability specs
