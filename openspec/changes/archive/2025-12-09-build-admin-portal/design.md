# Design: Admin Portal

## Context

The admin portal is the internal tool for SolidFrame staff to manage the multi-tenant platform. It needs to be functional, fast, and provide full visibility into all clients and system health.

### Stakeholders
- **Seth (Founder)**: Primary user, needs full platform visibility
- **Future Staff**: Will need role-based access within admin

### Constraints
- Must work with path-based routing (`toolbox.solidframe.ai/admin`)
- Reuse existing toolbox design system where possible
- Must be super_admin role only (strict access)

## Goals / Non-Goals

### Goals
- Complete visibility into all tenants and their usage
- Easy client onboarding (create → activate tools → done)
- Safe tool deployment with staging and rollback
- Proactive alerting for issues

### Non-Goals
- Public-facing pages
- Client self-service (that's client portal)
- Complex role hierarchy within admin (just super_admin for now)

## Decisions

### Decision 1: Single Page Application Feel

**Choice**: Use Next.js App Router with client-side navigation for instant page transitions.

**Rationale**: Admin users will navigate frequently between clients and tools. SPA-like navigation feels faster and more professional.

### Decision 2: Real-time Updates via Supabase

**Choice**: Use Supabase real-time subscriptions for alerts and usage updates.

**Alternatives considered**:
1. Polling every 30 seconds - Wastes resources, not instant
2. WebSocket server - Additional infrastructure

**Rationale**: Supabase real-time is already available and perfect for this use case.

### Decision 3: Impersonation via Read-Only View

**Choice**: "See as client" shows the client portal in read-only mode, not actual auth impersonation.

**Alternatives considered**:
1. Actual auth impersonation - Security risk, audit complexity
2. Screenshot/recording - Stale, not interactive

**Rationale**: Read-only view lets admin see exactly what client sees without security concerns.

## UI Structure

```
/admin
├── /                    → Dashboard (metrics, alerts, quick actions)
├── /clients             → Client list
│   ├── /new            → Create client wizard
│   └── /[id]           → Client detail
│       ├── /           → Overview
│       ├── /tools      → Tool activation
│       ├── /usage      → Usage stats
│       ├── /config     → Tool configs
│       └── /view-as    → Impersonate view
├── /tools               → Tool management
│   └── /[slug]         → Tool detail
│       ├── /           → Overview
│       └── /versions   → Version management
├── /analytics           → Platform analytics
├── /alerts              → Alert inbox
└── /settings            → Admin settings
```

## Component Architecture

```
AdminLayout
├── AdminSidebar
│   ├── Logo
│   ├── NavItem (Dashboard)
│   ├── NavItem (Clients)
│   ├── NavItem (Tools)
│   ├── NavItem (Analytics)
│   ├── NavItem (Alerts) + Badge
│   └── UserMenu
└── MainContent
    └── [Page Content]

ClientDetail
├── ClientHeader (name, logo, status badge)
├── TabNav (Overview | Tools | Usage | Config | View As)
└── TabContent
    └── [Selected Tab Panel]

ToolVersionManager
├── VersionList
│   └── VersionCard (status badge, config preview, actions)
├── DeployControls
│   ├── RolloutSlider
│   └── DeployButton / RollbackButton
└── VersionEditor (JSON schema editor)
```

## API Routes Used

All routes require super_admin authentication.

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/tenants` | GET | List all tenants |
| `/api/admin/tenants` | POST | Create tenant |
| `/api/admin/tenants/[id]` | GET | Get tenant detail |
| `/api/admin/tenants/[id]` | PUT | Update tenant |
| `/api/admin/tenants/[id]` | DELETE | Delete tenant |
| `/api/admin/tenants/[id]/tools` | GET | Get tenant's tools |
| `/api/admin/tenants/[id]/tools` | PUT | Activate/deactivate tools |
| `/api/admin/tools` | GET | List all tools |
| `/api/admin/tools/[slug]/versions` | GET | List versions |
| `/api/admin/tools/[slug]/versions` | POST | Create version |
| `/api/admin/versions/[id]` | PUT | Update version |
| `/api/admin/versions/[id]/deploy` | POST | Deploy to stage |
| `/api/admin/versions/[id]/rollback` | POST | Rollback |
| `/api/admin/analytics` | GET | Platform metrics |
| `/api/admin/alerts` | GET | List alerts |
| `/api/admin/alerts/[id]` | PUT | Mark read |

## Alert Types

| Type | Trigger | Severity |
|------|---------|----------|
| `client.created` | New tenant created | info |
| `client.onboarded` | Client completed wizard | info |
| `client.first_call` | First real call handled | success |
| `billing.payment_received` | Stripe payment success | success |
| `billing.payment_failed` | Stripe payment failed | error |
| `billing.subscription_cancelled` | Sub cancelled | warning |
| `tool.error` | Tool API error | error |
| `tool.deployed` | Version deployed | info |
| `usage.threshold` | Client hit usage limit | warning |
| `system.error` | System-level error | error |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Alert spam | Rate limiting, severity filtering |
| Slow client list with 100+ tenants | Pagination, search indexing |
| Version deploy breaks all clients | Canary rollout, instant rollback |

## Open Questions

1. **Email notifications**: In-app only for MVP, or also email?
   - Start in-app only, add email digest later

2. **Audit logging**: Log all admin actions?
   - Yes, but implement in Phase 2
