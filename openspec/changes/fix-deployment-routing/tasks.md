# Tasks: Fix Deployment Routing

## Phase 1: Configuration Updates

### Task 1: Update site vercel.json with hvac-owners route
- [ ] Open `site/vercel.json`
- [ ] Add rewrite rule: `{ "source": "/hvac-owners", "destination": "/hvac/index.html" }`
- [ ] Verify JSON syntax is valid
- [ ] Commit changes with message "feat: Add /hvac-owners route to site config"

**Validation**: File contains the new rewrite rule in the rewrites array

**Dependencies**: None

### Task 2: Verify middleware routing logic
- [ ] Open `site/toolbox/src/middleware.ts`
- [ ] Confirm line 98 has `hostname === 'client-toolbox.solidframe.ai'` check
- [ ] Confirm it rewrites to `/afterhours-agent` route
- [ ] Confirm wildcard tenant routing logic exists for `*.toolbox.solidframe.ai`

**Validation**: Middleware contains correct hostname checks for both client-toolbox and tenant routing

**Dependencies**: None

---

## Phase 2: Vercel Configuration

### Task 3: Add client-toolbox.solidframe.ai domain alias
- [ ] Navigate to Vercel dashboard → toolbox project → Settings → Domains
- [ ] Add domain: `client-toolbox.solidframe.ai`
- [ ] Verify DNS configuration is correct
- [ ] Wait for SSL certificate to provision

**Validation**: Domain appears in Vercel domains list with "Ready" status and valid SSL

**Dependencies**: None (can be done in parallel with Task 4)

### Task 4: Remove hvac-demo.solidframe.ai domain alias
- [ ] Navigate to Vercel dashboard → hvac-demo project (if exists) → Settings → Domains
- [ ] Remove domain: `hvac-demo.solidframe.ai`
- [ ] Confirm deletion
- [ ] Verify domain no longer appears in alias list

**Validation**: `npx vercel alias ls` does not show hvac-demo.solidframe.ai

**Dependencies**: None (can be done in parallel with Task 3)

---

## Phase 3: Deployment

### Task 5: Redeploy site project
- [ ] Run: `npx vercel --prod --cwd site/`
- [ ] Wait for deployment to complete
- [ ] Note deployment URL
- [ ] Verify deployment status shows "Ready"

**Validation**: Deployment completes successfully and new config is live

**Dependencies**: Task 1 (vercel.json must be updated first)

### Task 6: Redeploy toolbox project with fresh code
- [ ] Run: `cd site/toolbox && npx vercel --prod`
- [ ] Wait for deployment to complete (~1-2 minutes)
- [ ] Note deployment URL
- [ ] Verify deployment status shows "Ready"

**Validation**: New deployment timestamp is today, deployment hash matches latest git commit

**Dependencies**: Task 3 (client-toolbox alias should be configured first)

---

## Phase 4: Verification & Testing

### Task 7: Test all domain routes
- [ ] Visit `https://solidframe.ai` → Should show home page
- [ ] Visit `https://solidframe.ai/hvac-owners` → Should show HVAC landing page (not 404)
- [ ] Visit `https://toolbox.solidframe.ai` → Should show light-mode admin portal (bg-[#f4f5f7])
- [ ] Visit `https://client-toolbox.solidframe.ai` → Should show afterhours-agent demo
- [ ] Visit `https://acme-hvac.toolbox.solidframe.ai` → Should show Acme tenant portal
- [ ] Visit `https://hvac-demo.solidframe.ai` → Should return 404 or fail to resolve

**Validation**: All URLs load correctly with expected content

**Dependencies**: Tasks 5, 6 (deployments must be complete)

### Task 8: Verify UI styling is correct
- [ ] Open browser dev tools on `toolbox.solidframe.ai`
- [ ] Inspect body element
- [ ] Confirm background color is `#f4f5f7` (light gray), NOT `#000000` (black)
- [ ] Confirm text color is dark gray/black, NOT white

**Validation**: Visual inspection confirms light mode styling

**Dependencies**: Task 6 (toolbox must be redeployed)

### Task 9: Test tenant portal authentication flow
- [ ] Navigate to `https://acme-hvac.toolbox.solidframe.ai`
- [ ] Click login or authenticate
- [ ] Use credentials: `john@acmehvac.com`
- [ ] Verify dashboard loads with Acme HVAC branding

**Validation**: Acme tenant portal is accessible and shows correct tenant data

**Dependencies**: Task 6 (toolbox must be redeployed)

### Task 10: Verify auto-deployment works
- [ ] Make a trivial change (e.g., update a comment in toolbox code)
- [ ] Commit and push to main branch
- [ ] Wait 2-3 minutes
- [ ] Check Vercel dashboard for new deployment
- [ ] Verify deployment was triggered automatically

**Validation**: New deployment appears in Vercel without manual trigger

**Dependencies**: All previous tasks (ensures system is in good state)

---

## Phase 5: Documentation

### Task 11: Update ARCHITECTURE.md
- [ ] Open `site/toolbox/docs/ARCHITECTURE.md`
- [ ] Update domain routing section to reflect current state
- [ ] Remove references to hvac-demo.solidframe.ai
- [ ] Add explanation of client-toolbox vs acme-hvac distinction
- [ ] Commit changes

**Validation**: Documentation accurately describes production domain structure

**Dependencies**: Task 7 (all routes must be tested first)

### Task 12: Update DEMO_CREDENTIALS.md
- [ ] Open `site/toolbox/docs/DEMO_CREDENTIALS.md`
- [ ] Add section for client-toolbox.solidframe.ai
- [ ] Verify Acme HVAC URLs are correct
- [ ] Verify all credentials are up to date
- [ ] Commit changes

**Validation**: Demo credentials document includes all live URLs

**Dependencies**: Task 7 (all routes must be tested first)

---

## Summary

**Total Tasks**: 12
**Estimated Time**: 1-2 hours
**Parallelizable**: Tasks 3 & 4 (Vercel config)
**Critical Path**: 1 → 5 → 6 → 7 → 10

**Success Criteria Met When**:
- ✅ All domains load with correct content
- ✅ Toolbox shows light mode UI
- ✅ Client sandbox and Acme tenant are both accessible
- ✅ Auto-deployment is verified working
- ✅ Documentation is updated
