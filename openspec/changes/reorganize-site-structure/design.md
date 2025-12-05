# Design: Reorganize Site Structure

## Context
SolidFrame.ai is a multi-page marketing site with:
- A simple home page at the root
- Vertical-specific landing pages (HVAC now, plumbing/electrical later)
- A demo application for HVAC with dashboard and backend API

Currently these are scattered across confusingly-named folders. We need a structure that:
1. Makes it obvious what page lives where
2. Makes adding new landing pages trivial
3. Deploys as a unified site on Vercel

## Goals
- Clear 1:1 mapping between URL routes and folder structure
- Simple HTML/CSS landing pages (easy to edit, fast to load)
- Next.js app embedded under `/hvac/app/` for the dashboard functionality
- Single Vercel deployment for the entire site

## Non-Goals
- Converting landing pages to React/Next.js
- Building a CMS or dynamic page generation
- Changing the HVAC demo app's internal architecture

## Decisions

### Decision: Route-based folder structure
Each URL path maps directly to a folder:
- `/` → `site/home/`
- `/hvac` → `site/hvac/`
- `/hvac/dashboard` → `site/hvac/app/frontend/` (Next.js handles this)
- `/plumbing` → `site/plumbing/` (future)

**Why**: Makes it dead simple to find and edit any page. No confusion about what folder serves what URL.

### Decision: pages.json registry
A simple JSON file lists all pages:
```json
{
  "pages": [
    { "route": "/", "folder": "home", "title": "SolidFrame.ai" },
    { "route": "/hvac", "folder": "hvac", "title": "HVAC AI Dispatcher" }
  ]
}
```

**Why**: Provides a single source of truth for what pages exist. Can be used by:
- Developers to understand site structure
- Future tooling (sitemap generation, navigation components)
- CI/CD to validate all pages exist

**Alternatives considered**:
- No registry (just folders) - harder to track what's intentional vs leftover
- Database/CMS - overkill for a handful of static pages

### Decision: Next.js app nested under HVAC
The demo app lives at `site/hvac/app/` rather than as a separate deployment.

**Why**:
- Keeps everything at solidframe.ai domain
- Dashboard logically belongs under HVAC section
- Single Vercel project to manage

**Trade-off**: More complex Vercel config with rewrites, but worth it for unified deployment.

### Decision: Keep old landing folders in archive/
Rather than delete, move to `archive/` directory.

**Why**: User wants to preserve for reference. Clear separation from active code.

## Vercel Configuration Strategy

```json
{
  "rewrites": [
    { "source": "/", "destination": "/home/index.html" },
    { "source": "/hvac", "destination": "/hvac/index.html" },
    { "source": "/hvac/dashboard/:path*", "destination": "/hvac/app/frontend/:path*" }
  ],
  "builds": [
    { "src": "home/**", "use": "@vercel/static" },
    { "src": "hvac/index.html", "use": "@vercel/static" },
    { "src": "hvac/app/frontend/package.json", "use": "@vercel/next" }
  ]
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Breaking existing URLs | Test thoroughly in Vercel preview before promoting |
| Git history loss | Use `git mv` to preserve history |
| Next.js basePath complexity | Configure basePath: '/hvac' in next.config.js |
| Mixed static + Next.js deployment | Vercel handles this natively with proper config |

## Migration Plan

1. **Create structure first** - Don't delete anything until new structure works
2. **Use git mv** - Preserves history, makes rollback easier
3. **Deploy to preview** - Verify all routes before going live
4. **Atomic switchover** - Once preview is verified, promote to production
5. **Keep archive** - Old folders stay accessible if needed

## Open Questions
- Should the backend API also move under `site/hvac/app/backend/` or stay separate? (Current plan: move it)
- Do we need a shared assets folder for cross-page resources (logo, fonts)?
