## Context
The toolbox needs a client-facing demo portal accessible during sales calls. This is distinct from the internal admin toolbox and future production client toolboxes. The demo must be completely sandboxed with no persistence or real integrations.

**Stakeholders:** Sales team (primary users), prospects (demo viewers)

**Constraints:**
- Must work within existing toolbox Next.js app (not a separate app)
- Zero connection to production databases or APIs
- Resets completely on reload
- Must be visually impressive for sales demos

## Goals / Non-Goals

**Goals:**
- Prospects can interact with 8 demo tools during sales calls
- Personalized demo links with owner/business name
- All data is mock/sandboxed - nothing breaks
- Architecture reusable for future production client toolboxes

**Non-Goals:**
- Real data integrations (that's for production client toolbox)
- Persistent demo sessions across page loads
- Dynamic branding beyond header personalization
- Multi-tenant demo environments

## Decisions

### Route Structure
**Decision:** `/client-demo/*` routes within existing toolbox app
**Rationale:** Shares UI components, avoids new deployment, enables future role-based access

```
/client-demo                    → Demo dashboard (tool grid)
/client-demo/roi                → ROI Calculator
/client-demo/voice-agent        → Voice Agent Demo
/client-demo/lead-scraper       → Lead Scraper
/client-demo/reviews            → Review Request Generator
/client-demo/competitors        → Competitive Analysis
/client-demo/calls              → Call Dashboard
/client-demo/training           → Technician Training
/client-demo/scheduler          → Appointment Scheduler
```

### Magic Link Encoding
**Decision:** Base64-encoded JSON in URL query param + server-side logging for analytics
**Rationale:** Simple to generate, trackable for sales insights

```typescript
// Generate (includes expiration)
const payload = {
  owner: "John",
  business: "ABC HVAC",
  exp: Date.now() + (14 * 24 * 60 * 60 * 1000) // 14 days
}
const token = btoa(JSON.stringify(payload))
// URL: /client-demo?token=eyJvd25lciI6...

// Also log to Supabase demo_links table for analytics

// Decode in demo
const data = JSON.parse(atob(searchParams.get('token') || 'e30='))
if (data.exp && Date.now() > data.exp) {
  // Show "Link expired" message
}
const owner = data.owner || 'valued customer'
const business = data.business || 'Trinity Cooling'
```

### Mock Data Architecture
**Decision:** Static mock data files + deterministic generators (seeded by business name)
**Rationale:** Consistent demo experience, no randomness confusion during calls

```
src/lib/mock-data/
├── calls.ts          → Mock call transcripts, emergency detection
├── leads.ts          → Mock scraped leads by region
├── competitors.ts    → Mock competitor profiles
├── reviews.ts        → Mock review request templates
├── training.ts       → Mock training scenarios
└── scheduler.ts      → Mock appointment slots
```

### Shared Component Architecture
**Decision:** Single shared component library used by all toolbox variants (admin, client-demo, future client toolboxes)
**Rationale:** Design changes propagate automatically, consistent UX, less code duplication

```
src/components/
├── shared/                    # Shared across ALL toolbox variants
│   ├── ToolGrid.tsx           # Tool card grid layout
│   ├── ToolCard.tsx           # Individual tool card
│   ├── DashboardLayout.tsx    # Page layout wrapper
│   ├── Header.tsx             # Top bar with personalization slot
│   ├── Sidebar.tsx            # Navigation sidebar
│   └── tools/                 # Tool-specific shared components
│       ├── ROICalculator/
│       ├── CallDashboard/
│       ├── LeadScraper/
│       └── ...
├── admin/                     # Admin-only components (billing, etc.)
└── demo/                      # Demo-specific wrappers (mock data injection)
```

**Data injection pattern:**
```typescript
// Shared component accepts data via props
<CallDashboard calls={calls} onAction={handleAction} />

// Admin toolbox: passes real data
<CallDashboard calls={realCalls} onAction={realAction} />

// Client demo: passes mock data, no-op actions
<CallDashboard calls={mockCalls} onAction={() => {}} />

// Future client toolbox: passes their real data
<CallDashboard calls={clientCalls} onAction={clientAction} />
```

**Benefits:**
- Fix a bug in `ToolCard.tsx` → fixed everywhere
- Add animation to `Header.tsx` → appears in all variants
- Consistent design language across admin, demo, and client experiences

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Demo looks "fake" to prospects | High-fidelity mock data, realistic timestamps, plausible business names |
| URL token can be decoded | Acceptable - contains only name/business, no secrets |
| Demo diverges from future production UI | Share base components, document differences |

## Resolved Questions
- **Demo link expiration:** Yes, 14 days. Token includes `exp` timestamp, checked on load.
- **Analytics tracking:** Yes. Log link generation to Supabase table (`demo_links`) with owner, business, created_at, token.
