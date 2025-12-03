# Deployment Checklist for solidframe.ai/hvac-owners

Use this checklist to track your deployment progress.

## Pre-Deployment Setup

- [ ] GitHub account created
- [ ] Repository pushed to GitHub (if not already)
- [ ] All API keys available:
  - [ ] Supabase URL and Key (already configured)
  - [ ] Twilio Account SID, Auth Token, Phone Number
  - [ ] OpenAI API Key
  - [ ] Vapi configuration (if needed)

---

## Backend Deployment (Railway)

- [ ] Railway account created at [railway.app](https://railway.app)
- [ ] New project created
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Environment variables added:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_KEY`
  - [ ] `TWILIO_ACCOUNT_SID`
  - [ ] `TWILIO_AUTH_TOKEN`
  - [ ] `TWILIO_PHONE_NUMBER`
  - [ ] `OPENAI_API_KEY`
  - [ ] `FRONTEND_URL`
- [ ] Deployment successful
- [ ] Backend URL copied (e.g., `https://xxx.up.railway.app`)
- [ ] Backend tested (visit `https://xxx.up.railway.app/docs`)

---

## Frontend Deployment (Vercel)

- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] New project created
- [ ] Repository imported
- [ ] Root directory set to `frontend`
- [ ] Environment variables added:
  - [ ] `NEXT_PUBLIC_API_URL` (Railway backend URL)
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- [ ] Build settings verified (Next.js, auto-detected)
- [ ] Deployment successful
- [ ] Vercel URL working (e.g., `https://xxx.vercel.app/hvac-owners`)

---

## Domain Configuration (GoDaddy)

- [ ] Logged into GoDaddy account
- [ ] Found solidframe.ai domain
- [ ] Opened DNS settings
- [ ] Added A record:
  - Type: `A`
  - Name: `@`
  - Value: `76.76.21.21`
  - TTL: `600`
- [ ] Added CNAME record:
  - Type: `CNAME`
  - Name: `www`
  - Value: `cname.vercel-dns.com`
  - TTL: `600`
- [ ] Saved DNS changes

---

## Vercel Domain Connection

- [ ] In Vercel project, went to Settings → Domains
- [ ] Added `solidframe.ai`
- [ ] Added `www.solidframe.ai`
- [ ] Verified DNS configuration in Vercel
- [ ] Waited for SSL certificate provisioning (5-10 min)
- [ ] Verified HTTPS working

---

## Post-Deployment

- [ ] Backend CORS updated with `FRONTEND_URL=https://solidframe.ai`
- [ ] Tested: `https://solidframe.ai/hvac-owners` loads
- [ ] Tested: Business setup form works
- [ ] Tested: API calls reach backend
- [ ] Tested: Data saves to Supabase
- [ ] Tested: Phone integration works (if applicable)
- [ ] Verified: SSL certificate is valid
- [ ] Verified: Mobile responsive design

---

## Optional Enhancements

- [ ] Add custom landing page at `solidframe.ai` root
- [ ] Set up Vercel Analytics
- [ ] Configure Railway alerts/monitoring
- [ ] Add Google Analytics (if desired)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Create backup/staging environment

---

## Contact Information

**Railway Support**: [railway.app/help](https://railway.app/help)
**Vercel Support**: [vercel.com/support](https://vercel.com/support)
**GoDaddy Support**: [godaddy.com/help](https://www.godaddy.com/help)

---

## Estimated Timeline

- Backend deployment: 15-20 minutes
- Frontend deployment: 15-20 minutes
- DNS configuration: 5-10 minutes
- DNS propagation: 10-60 minutes
- Testing: 10-15 minutes

**Total: 1-2 hours** (mostly waiting for DNS)

---

## Emergency Rollback

If something goes wrong:

1. **Frontend**: In Vercel, click "Deployments" → Previous deployment → "Promote to Production"
2. **Backend**: In Railway, click "Deployments" → Previous deployment → "Redeploy"
3. **DNS**: Revert changes in GoDaddy DNS settings

---

## Success Criteria

Your deployment is successful when:

✅ `https://solidframe.ai/hvac-owners` loads without errors
✅ SSL certificate shows as valid (green lock icon)
✅ Business setup form submits successfully
✅ Backend API responds to requests
✅ No console errors in browser developer tools
✅ Mobile view works correctly
