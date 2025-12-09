# Architecture Overview

## Multi-Tenant SaaS Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel (Hosting)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  toolbox.solidframe.ai          → /admin (Super Admin Portal)   │
│  client-toolbox.solidframe.ai   → /client-demo (Public Demo)    │
│  [slug].toolbox.solidframe.ai   → /[tenant] (Client Portals)    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                      Next.js App Router                          │
│                                                                  │
│  /admin/*           Admin portal (super_admin only)              │
│  /[tenant]/*        Client portal (tenant users)                 │
│  /client-demo/*     Public demo (no auth)                        │
│  /login             Supabase Auth                                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                         Supabase                                 │
│                                                                  │
│  PostgreSQL    → All data with RLS policies                     │
│  Auth          → Magic link + password authentication            │
│  Storage       → Logo uploads, call recordings                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `tenants` | Client companies (Acme HVAC, etc.) |
| `users` | Users belonging to tenants + super_admins |
| `tools` | The 8 automation tools |
| `tenant_tools` | Which tools are active per tenant |
| `tenant_tool_configs` | Tool configuration per tenant |
| `subscriptions` | Stripe subscription status |
| `usage_logs` | Tool usage tracking |
| `alerts` | System alerts for admin |
| `feedback` | Client feedback submissions |
| `onboarding_progress` | Wizard completion state |

### Key Relationships

```
tenants (1) ─────< (many) users
tenants (1) ─────< (many) tenant_tools ────> (1) tools
tenants (1) ─────< (many) tenant_tool_configs
tenants (1) ─────< (many) subscriptions
tenants (1) ─────< (many) usage_logs
tenants (1) ─────< (many) alerts
tenants (1) ─────< (many) feedback
tenants (1) ─────< (1) onboarding_progress
```

---

## Row Level Security (RLS)

All tables have RLS policies ensuring tenant isolation:

```sql
-- Example: Users can only see their own tenant's data
CREATE POLICY "Users see own tenant data"
ON users FOR SELECT
USING (tenant_id = (
    SELECT tenant_id FROM users
    WHERE auth_id = auth.uid()
));

-- Super admins can see all data
CREATE POLICY "Super admins see all"
ON tenants FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE auth_id = auth.uid()
        AND role = 'super_admin'
    )
);
```

---

## The 8 Tools

| # | Slug | Name | Status |
|---|------|------|--------|
| 1 | `after-hours-agent` | After Hours AI Agent | **REAL** (Vapi) |
| 2 | `missed-call-textback` | Missed Call Text-Back | Mockup |
| 3 | `review-request-bot` | Review Request Bot | Mockup |
| 4 | `appointment-reminders` | Appointment Reminders | Mockup |
| 5 | `quote-reviver` | Quote Reviver | Mockup |
| 6 | `seasonal-campaigns` | Seasonal Campaigns | Mockup |
| 7 | `maintenance-renewal` | Maintenance Renewal | Mockup |
| 8 | `tech-training` | Tech Training | Mockup |

### Real vs Mockup

- **Tool 1 (After Hours Agent)**: Fully functional with Vapi integration. Makes real AI phone calls.
- **Tools 2-8**: UI mockups with fake data. Settings save to database but don't trigger real actions.

The mockups are designed to sell the platform. They show realistic metrics and interactions that would occur if the integrations were built.

---

## Directory Structure

```
site/toolbox/
├── src/
│   ├── app/
│   │   ├── admin/              # Super admin portal
│   │   │   ├── clients/        # Client management
│   │   │   ├── tools/          # Tool versioning
│   │   │   ├── analytics/      # Usage dashboard
│   │   │   └── alerts/         # System alerts
│   │   ├── [tenant]/           # Client portals (dynamic)
│   │   │   ├── tools/          # Tool interfaces
│   │   │   ├── onboarding/     # Setup wizard
│   │   │   ├── feedback/       # Feedback system
│   │   │   └── settings/       # Tenant settings
│   │   ├── client-demo/        # Public demo (no auth)
│   │   ├── login/              # Authentication
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   ├── client/             # Client portal components
│   │   ├── tools/              # Tool UI components
│   │   ├── onboarding/         # Wizard steps
│   │   ├── feedback/           # Feedback forms
│   │   └── shared/             # Reusable components
│   ├── lib/
│   │   ├── mock-data/          # Fake data generators
│   │   ├── supabase.ts         # Client-side Supabase
│   │   ├── supabase-server.ts  # Server-side Supabase
│   │   ├── tenant-context.tsx  # Tenant React context
│   │   ├── tool-engine.ts      # Tool execution logic
│   │   └── theme.ts            # Design tokens
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   └── middleware.ts           # Auth + routing
├── supabase/
│   └── migrations/             # SQL migrations
├── docs/                       # This documentation
└── public/                     # Static assets
```

---

## Authentication Flow

1. User visits `/login`
2. Enters email, receives magic link
3. Clicks link, Supabase sets session cookie
4. Middleware checks:
   - Is route public? → Allow
   - Is route `/admin`? → Require `super_admin` role
   - Is route `/[tenant]`? → Require user belongs to tenant
5. User sees appropriate portal

---

## Data Flow for Tools

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Tool UI      │───>│ Tool Engine  │───>│ Supabase     │
│ (React)      │    │ (lib/)       │    │ (DB)         │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ External API │
                    │ (Vapi, etc.) │
                    └──────────────┘
```

- Tool UI reads config from `tenant_tool_configs`
- Tool Engine handles business logic
- Real tools (Agent) call external APIs
- Mockup tools display fake data from `mock-data/`

---

## Fake Data Strategy

Mockup tools generate realistic data using:

1. **Seeded randomization**: Same tenant always gets same "random" data
2. **Time-based growth**: Metrics increase based on tenant age
3. **Realistic names/addresses**: Phoenix-area data for Acme HVAC

```typescript
// From src/lib/mock-data/acme-data.ts
function seededRandom(seed: number) {
    return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }
}
```

This ensures the demo feels "alive" without real integrations.
