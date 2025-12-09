# Design: Platform Foundation

## Context

SolidFrame is transitioning from a demo-focused single-tenant application to a multi-tenant SaaS platform. The platform will serve multiple HVAC/trades businesses, each with their own toolbox portal containing AI-powered automation tools.

### Stakeholders
- **SolidFrame Admins**: Manage clients, configure tools, view analytics
- **Client Users**: Access their toolbox, use tools, provide feedback
- **System**: Automated billing, alerts, tool deployments

### Constraints
- Must extend existing Supabase project (not create new)
- Path-based routing initially (`toolbox.solidframe.ai/{tenant}`)
- Single codebase serving multiple tenants
- Budget-conscious infrastructure choices

## Goals / Non-Goals

### Goals
- Secure multi-tenant data isolation via RLS
- Flexible tool versioning for safe deployments
- Stripe integration for subscription billing
- Foundation that supports 100+ tenants without architectural changes

### Non-Goals
- Per-tenant database schemas (overkill for current scale)
- Custom domains per tenant (future enhancement)
- Real-time collaboration features
- Mobile apps

## Decisions

### Decision 1: Single Supabase Project with RLS

**Choice**: All tenants share one Supabase project with Row-Level Security policies.

**Alternatives considered**:
1. Separate Supabase project per tenant - More isolation but 10x cost and complexity
2. Schema-per-tenant in single project - PostgreSQL supports this but Supabase doesn't expose it well
3. Application-level filtering only - Insecure, one bug exposes all data

**Rationale**: RLS is the industry standard for multi-tenant SaaS. It's enforced at the database level, so even buggy application code can't leak data. Supabase makes RLS easy with auth integration.

### Decision 2: Supabase Auth with Magic Links

**Choice**: Use Supabase Auth with email magic links for passwordless authentication.

**Alternatives considered**:
1. Username/password - More friction, password reset flows needed
2. OAuth only (Google, etc.) - Not all HVAC business owners have Google accounts
3. Custom auth system - Reinventing the wheel, security risks

**Rationale**: Magic links are frictionless, secure, and Supabase handles all the complexity. Business owners just click a link in their email.

### Decision 3: Tool Versioning in Database

**Choice**: Store tool configurations in database with version numbers. Deployments update version pointers, not code.

**Alternatives considered**:
1. Git-based versioning - Requires code deployment for config changes
2. Feature flags service (LaunchDarkly) - Additional cost and complexity
3. No versioning - Can't roll back bad configs

**Rationale**: Database-driven versioning allows instant rollbacks, canary rollouts, and per-tenant version pinning without code deployments.

### Decision 4: Hybrid Backend (Next.js + FastAPI)

**Choice**: Keep FastAPI for voice/Vapi webhooks. Use Next.js API routes for everything else.

**Alternatives considered**:
1. All Next.js - Would need to rewrite working voice code
2. All FastAPI - Adds deployment complexity for simple CRUD
3. Separate microservices - Overkill for current scale

**Rationale**: FastAPI already handles voice processing well. Next.js API routes are simpler for auth, CRUD, and Stripe webhooks. Clean separation of concerns.

## Database Schema

```
┌─────────────────┐       ┌─────────────────┐
│     tenants     │       │      users      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ name            │   │   │ tenant_id (FK)──│───┐
│ slug            │   │   │ email           │   │
│ logo_url        │   │   │ role            │   │
│ status          │   │   │ auth_id         │   │
│ stripe_customer │   │   │ created_at      │   │
│ created_at      │   │   └─────────────────┘   │
└─────────────────┘   │                         │
         │            │   ┌─────────────────┐   │
         │            └───│  tenant_tools   │   │
         │                ├─────────────────┤   │
         │                │ tenant_id (FK)──│───┘
         │                │ tool_id (FK)────│───┐
         │                │ is_active       │   │
         │                │ version_id (FK) │   │
         │                │ activated_at    │   │
         │                └─────────────────┘   │
         │                                      │
         │            ┌─────────────────┐       │
         │            │      tools      │───────┘
         │            ├─────────────────┤
         │            │ id (PK)         │
         │            │ slug            │
         │            │ name            │
         │            │ description     │
         │            │ icon            │
         │            │ category        │
         │            │ is_real         │
         │            │ created_at      │
         │            └─────────────────┘
         │                    │
         │            ┌───────┴───────┐
         │            │               │
         │    ┌───────▼───────┐ ┌─────▼─────────┐
         │    │ tool_versions │ │tenant_tool_   │
         │    ├───────────────┤ │   configs     │
         │    │ id (PK)       │ ├───────────────┤
         │    │ tool_id (FK)  │ │ tenant_id(FK) │
         │    │ version       │ │ tool_id (FK)  │
         │    │ config_schema │ │ config (JSON) │
         │    │ status        │ │ updated_at    │
         │    │ rollout_pct   │ └───────────────┘
         │    │ created_at    │
         │    └───────────────┘
         │
         │    ┌─────────────────┐    ┌─────────────────┐
         └────│  subscriptions  │    │   usage_logs    │
              ├─────────────────┤    ├─────────────────┤
              │ id (PK)         │    │ id (PK)         │
              │ tenant_id (FK)  │    │ tenant_id (FK)  │
              │ stripe_sub_id   │    │ tool_id (FK)    │
              │ status          │    │ event_type      │
              │ current_period  │    │ metadata        │
              │ created_at      │    │ created_at      │
              └─────────────────┘    └─────────────────┘

         ┌─────────────────┐    ┌─────────────────┐
         │     alerts      │    │    feedback     │
         ├─────────────────┤    ├─────────────────┤
         │ id (PK)         │    │ id (PK)         │
         │ tenant_id (FK)  │    │ tenant_id (FK)  │
         │ type            │    │ tool_id (FK)    │
         │ title           │    │ message         │
         │ message         │    │ status          │
         │ read            │    │ created_at      │
         │ created_at      │    └─────────────────┘
         └─────────────────┘

         ┌─────────────────────┐
         │ onboarding_progress │
         ├─────────────────────┤
         │ id (PK)             │
         │ tenant_id (FK)      │
         │ current_step        │
         │ completed_steps[]   │
         │ data (JSON)         │
         │ updated_at          │
         └─────────────────────┘
```

## RLS Policy Strategy

```sql
-- Example: tenants table
CREATE POLICY "Users can only see their own tenant"
ON tenants FOR SELECT
USING (
  id = (SELECT tenant_id FROM users WHERE auth_id = auth.uid())
  OR
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'super_admin')
);

-- Super admins can see all, regular users see only their tenant
```

## API Route Structure

```
/api/
├── auth/
│   ├── login          POST - Send magic link
│   ├── callback       GET  - Handle magic link click
│   └── logout         POST - End session
├── admin/
│   ├── tenants        CRUD - Manage clients
│   ├── tools          CRUD - Manage tool definitions
│   ├── versions       CRUD - Manage tool versions
│   ├── alerts         GET  - View alerts
│   └── analytics      GET  - Usage stats
├── tenant/
│   ├── profile        GET/PUT - Tenant settings
│   ├── tools          GET  - Available tools
│   ├── configs        GET/PUT - Tool configurations
│   ├── feedback       POST - Submit feedback
│   └── onboarding     GET/PUT - Wizard progress
└── webhooks/
    ├── stripe         POST - Payment events
    └── vapi           POST - Call events (FastAPI)
```

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| RLS policy bugs leak data | High | Comprehensive policy testing, audit logging |
| Stripe webhook failures | Medium | Webhook retry handling, manual reconciliation tools |
| Magic link email deliverability | Medium | Multiple email providers, fallback to code entry |
| Tool version rollback breaks tenant | Medium | Per-tenant version pinning, gradual rollouts |

## Migration Plan

1. Create new tables alongside existing `demo_*` tables
2. Seed `tools` table with 8 tool definitions
3. Create Acme HVAC as first tenant with all tools
4. Migrate relevant `demo_sessions` data to tenant configs
5. Deprecate `demo_*` tables after client portal works

## Open Questions

1. **Vapi phone number provisioning**: Manual or API-automated?
   - Decision deferred to implementation - start manual, automate later

2. **Stripe pricing model**: Per-tool or bundle pricing?
   - Decision deferred - start with simple "all tools" subscription

3. **Alert delivery**: In-app only or also email/SMS?
   - Start in-app, add email digest later
