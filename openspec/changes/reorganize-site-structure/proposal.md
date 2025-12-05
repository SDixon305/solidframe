# Change: Reorganize Site Structure for Multi-Page Landing Architecture

## Why
The current project structure is confusing with numbered landing folders (`landing-01`, `landing-02`, etc.) and unclear separation between the main site, HVAC landing page, and demo application. This makes it hard to add new landing pages (like `/plumbing`) and understand what's deployed where.

## What Changes
- Consolidate to a single `site/` folder that represents solidframe.ai
- Organize pages by route: `site/home/`, `site/hvac/`, `site/plumbing/` (future)
- Create a page registry (`site/pages.json`) so the site knows all available pages
- Move the HVAC demo app into `site/hvac/app/` so dashboard lives at `/hvac/dashboard`
- Keep old landing folders intact (as requested) but clearly mark as archived experiments

## Impact
- Affected specs: site-structure (new)
- Affected code:
  - `landing-04-solidframe-main/` → `site/`
  - `app-hvac-demo-nextjs/` → `site/hvac/app/`
  - Vercel configuration needs updating
- **BREAKING**: Deployment paths will change; Vercel project needs reconfiguration

## Target Structure
```
solidframe/
├── site/                           # The solidframe.ai website
│   ├── pages.json                  # Registry of all pages/routes
│   ├── vercel.json                 # Unified Vercel config
│   ├── home/                       # solidframe.ai/ (root)
│   │   ├── index.html
│   │   └── style.css
│   ├── hvac/                       # solidframe.ai/hvac
│   │   ├── index.html              # Landing page
│   │   ├── style.css
│   │   ├── assets/
│   │   └── app/                    # The Next.js demo application
│   │       ├── frontend/           # Next.js app (dashboard at /hvac/dashboard)
│   │       └── backend/            # FastAPI backend
│   └── [plumbing]/                 # Future: solidframe.ai/plumbing
│       ├── index.html
│       └── style.css
├── archive/                        # Old experiments (read-only reference)
│   ├── landing-01-simple-html/
│   ├── landing-02-rugged-vite/
│   └── landing-03-discovery-vite/
├── openspec/                       # Specs (unchanged)
├── outreach/                       # Business files (unchanged)
└── scraper/                        # Tools (unchanged)
```

## Migration Strategy
1. Create new `site/` structure
2. Move files (not copy) to preserve git history
3. Update Vercel configuration for new paths
4. Test deployment before removing old structure
