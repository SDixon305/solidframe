# Proposal: Fix Deployment Routing

## Problem Statement

The current production deployment has multiple critical misconfigurations:

1. **Outdated Toolbox Deployment**: `toolbox.solidframe.ai` is serving an old dark-mode version from 2 days ago, while the repository contains the updated light-mode version
2. **Wrong HVAC Demo Location**: Content at `hvac-demo.solidframe.ai` should be at `solidframe.ai/hvac-owners` instead
3. **Missing Client Sandbox**: `client-toolbox.solidframe.ai` domain alias is not configured in Vercel (middleware routing exists but domain not set up)
4. **Broken Tenant Routing**: `acme-hvac.toolbox.solidframe.ai` returns "site can't be reached" (likely due to outdated deployment)
5. **Auto-Deploy Issues**: Git pushes are not triggering automatic deployments for the toolbox project

## Proposed Solution

Fix all domain routing and deployment configurations to match the intended architecture:

### Domain Structure (Corrected)
- `solidframe.ai` → Main marketing site with `/hvac-owners` route
- `toolbox.solidframe.ai` → Super Admin Portal
- `client-toolbox.solidframe.ai` → Public demo/sandbox (afterhours-agent)
- `*.toolbox.solidframe.ai` → Multi-tenant client portals (e.g., `acme-hvac.toolbox.solidframe.ai`)
- REMOVE: `hvac-demo.solidframe.ai` (obsolete)

### Changes Required
1. Update `site/vercel.json` to include `/hvac-owners` rewrite rule
2. Redeploy toolbox with fresh code from repository
3. Configure `client-toolbox.solidframe.ai` domain alias in Vercel
4. Remove `hvac-demo.solidframe.ai` domain alias from Vercel
5. Verify auto-deployment is working for all projects
6. Test all tenant routing after redeployment

## Success Criteria

- [ ] `toolbox.solidframe.ai` shows updated light-mode interface
- [ ] `client-toolbox.solidframe.ai` loads the afterhours-agent demo
- [ ] `acme-hvac.toolbox.solidframe.ai` loads the Acme HVAC tenant portal
- [ ] `solidframe.ai/hvac-owners` serves the HVAC landing page
- [ ] `hvac-demo.solidframe.ai` no longer exists
- [ ] Future git pushes trigger automatic deployments

## Impact

- **User-facing**: Demo environments will work correctly for sales calls
- **Developer**: Deployment process will be reliable and predictable
- **Business**: Can confidently show both sandbox and polished demos

## Dependencies

- Access to Vercel dashboard to configure domain aliases
- Supabase database already has correct tenant data (acme-hvac exists)

## Risks

- Brief downtime during redeployment (~1-2 minutes)
- Existing demo links may break if they reference `hvac-demo.solidframe.ai`
