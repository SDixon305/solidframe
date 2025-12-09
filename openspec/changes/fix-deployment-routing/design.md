# Design: Fix Deployment Routing

## Architecture Overview

The SolidFrame platform uses a multi-project Vercel architecture with distinct purposes:

```
┌─────────────────────────────────────────────────────────────────┐
│                     solidframe.ai Domain                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Main Site (Vercel project: "site")                            │
│  - solidframe.ai/                → Home landing page            │
│  - solidframe.ai/hvac-owners     → HVAC landing page            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  toolbox.solidframe.ai Domain                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SaaS Platform (Vercel project: "toolbox")                     │
│  - toolbox.solidframe.ai         → Super Admin Portal          │
│  - client-toolbox.solidframe.ai  → Public Demo (sandbox)       │
│  - *.toolbox.solidframe.ai       → Multi-tenant portals        │
│    └─ acme-hvac.toolbox.solidframe.ai → Acme HVAC tenant      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Current State Problems

### 1. Outdated Deployment
**Problem**: The toolbox Vercel project hasn't deployed the latest code
**Root Cause**: Auto-deployment may not be configured, or the monorepo structure requires manual triggers
**Evidence**:
- Latest deployment: 2 days ago (`toolbox-2tkpwc0lg`)
- Latest code commit: Today (`6d74132d`)
- Current source uses `bg-[#f4f5f7]` (light mode)
- Live site shows `bg-black` (dark mode)

### 2. Incorrect Domain Mapping
**Problem**: HVAC content is at wrong domain
**Current**: `hvac-demo.solidframe.ai` (separate subdomain)
**Should be**: `solidframe.ai/hvac-owners` (path on main site)
**Reasoning**: Keeps all marketing content under one domain for SEO and simplicity

### 3. Missing Domain Alias
**Problem**: `client-toolbox.solidframe.ai` not configured
**Evidence**:
- Middleware has routing logic (line 98 of middleware.ts)
- Documentation references it (QUICK_START.md, ARCHITECTURE.md)
- Vercel alias list doesn't show it
**Purpose**: Provides a sandbox environment for demos without affecting the polished Acme tenant

## Design Decisions

### Decision 1: Separate Sandbox vs. Polished Tenant
**Approach**: Two distinct tenant instances
- **client-toolbox** = Throwaway sandbox for experimentation
- **acme-hvac** = Polished reference implementation

**Rationale**:
- Sales calls need a safe environment to demo features without breaking the reference
- Prevents accidental data corruption in the "clean" demo
- Allows testing edge cases without cleanup burden

### Decision 2: Path-Based vs. Subdomain for HVAC Landing
**Chosen**: Path-based (`solidframe.ai/hvac-owners`)
**Rejected**: Subdomain (`hvac-demo.solidframe.ai`)

**Rationale**:
- Consolidates marketing presence under single domain
- Simpler SSL/DNS management
- Better for SEO (link juice flows to main domain)
- Allows easy addition of other industry landings (e.g., `/plumbing-owners`)

### Decision 3: Wildcard Subdomain for Tenants
**Approach**: `*.toolbox.solidframe.ai` points to toolbox project
**Routing**: Next.js middleware extracts tenant slug from subdomain

**Rationale**:
- Clean, professional URLs for each client
- Easy to add new tenants without Vercel config changes
- Standard SaaS multi-tenancy pattern
- Middleware provides centralized routing logic

## Implementation Strategy

### Phase 1: Fix Vercel Configuration
1. Update `site/vercel.json` with hvac-owners route
2. Add `client-toolbox.solidframe.ai` alias to toolbox project
3. Remove `hvac-demo.solidframe.ai` alias

### Phase 2: Redeploy Applications
1. Trigger fresh toolbox deployment (gets latest code)
2. Verify site project has correct rewrites
3. Test all routes after deployment

### Phase 3: Verification
1. Check each domain loads correctly
2. Test tenant routing (acme-hvac, client-toolbox)
3. Verify middleware routing logic works
4. Confirm auto-deploy triggers on next push

## Testing Plan

Manual verification of each route:
- [ ] `solidframe.ai` → Home page loads
- [ ] `solidframe.ai/hvac-owners` → HVAC landing loads
- [ ] `toolbox.solidframe.ai` → Admin portal (light mode)
- [ ] `client-toolbox.solidframe.ai` → Afterhours demo
- [ ] `acme-hvac.toolbox.solidframe.ai` → Acme tenant portal
- [ ] `hvac-demo.solidframe.ai` → Returns 404 or redirects

## Future Considerations

1. **Auto-deployment**: Investigate why toolbox didn't auto-deploy and fix
2. **Monitoring**: Set up uptime monitoring for all domains
3. **Documentation**: Update ARCHITECTURE.md with final domain structure
4. **CI/CD**: Consider adding deployment checks to prevent similar issues
