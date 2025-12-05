# Change: Configure Vercel Deployment and Naming Cleanup

## Why
The project naming is confusing: the GitHub repo is named `hvac-demo` when it should be `solidframe`, and Vercel project configurations need to be set up properly for both the static site (solidframe.ai) and the Next.js demo app (hvac-demo.solidframe.ai).

## What Changes
- **BREAKING**: Rename GitHub repository from `SDixon305/hvac-demo` to `SDixon305/solidframe`
- Configure two Vercel deployments:
  1. `solidframe` project: deploys static site from `site/` root (serves solidframe.ai)
  2. `hvac-demo-app` project: deploys Next.js app from `site/hvac/app/frontend/` (serves hvac-demo.solidframe.ai)
- Add custom domain `hvac-demo.solidframe.ai` to the hvac-demo-app Vercel project
- Update git remote URLs after repo rename

## Impact
- Affected specs: site-structure (deployment configuration)
- Affected code:
  - GitHub repository settings (rename)
  - Vercel project configurations
  - DNS records (CNAME for hvac-demo subdomain)
- External dependencies:
  - GitHub API (repo rename)
  - Vercel API (domain configuration)
  - GoDaddy DNS (CNAME record)

## Deployment Architecture

### Current State
```
GitHub: SDixon305/hvac-demo
Vercel: hvac-demo (project exists, unclear configuration)
Vercel: hvac-demo-app (project exists, needs configuration)
```

### Target State
```
GitHub: SDixon305/solidframe

Vercel Project: solidframe
├── Root directory: site/
├── Framework: Other (static)
├── Domains: solidframe.ai, www.solidframe.ai
└── Serves: /, /hvac (landing pages)

Vercel Project: hvac-demo-app
├── Root directory: site/hvac/app/frontend/
├── Framework: Next.js
├── Domains: hvac-demo.solidframe.ai
└── Serves: Next.js dashboard app
```

### DNS Configuration
| Record Type | Name | Value |
|-------------|------|-------|
| A | @ | (existing Vercel) |
| CNAME | www | cname.vercel-dns.com |
| CNAME | hvac-demo | cname.vercel-dns.com |

## Risk Assessment
- **Medium Risk**: GitHub rename may break existing links, but redirects are automatic
- **Low Risk**: Vercel re-linking after rename should work automatically
- **Low Risk**: DNS propagation for new subdomain (typically minutes)
