# Quick Start Guide

Get your HVAC demo live at **solidframe.ai/hvac-owners** in under 2 hours!

## What You Need

Before starting, gather these:

1. **API Keys** (from your `backend/.env` file):
   - Supabase URL & Key (already configured)
   - Twilio credentials
   - OpenAI API key

2. **Accounts to Create** (all free):
   - GitHub account (to store code)
   - Railway account (for backend)
   - Vercel account (for frontend)

3. **GoDaddy Access**:
   - Login credentials for your solidframe.ai domain

---

## 3-Step Deployment

### Step 1: Push to GitHub (5 minutes)

```bash
cd "/Users/sethdixon/AI SLOP/HVAC Agent Demo"
git init
git add .
git commit -m "Initial commit - HVAC demo"
```

Then:
1. Go to [github.com](https://github.com) and create a new repository
2. Follow GitHub's instructions to push your code

### Step 2: Deploy Backend (20 minutes)

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository → Choose `backend` folder
4. Add environment variables (copy from `backend/.env`)
5. Copy your Railway URL (looks like: `https://xxx.up.railway.app`)

### Step 3: Deploy Frontend (20 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. "Add New Project" → Import your repository
3. Set Root Directory: `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = Your Railway URL
   - Copy others from `frontend/.env.local`
5. Deploy!

### Step 4: Connect Domain (15 minutes)

**In Vercel:**
1. Project Settings → Domains → Add `solidframe.ai`

**In GoDaddy:**
1. My Products → solidframe.ai → DNS
2. Add A record: `@` → `76.76.21.21`
3. Add CNAME: `www` → `cname.vercel-dns.com`

**Wait 10-30 minutes for DNS propagation**

---

## You're Done!

Visit: **https://solidframe.ai/hvac-owners**

---

## Need Help?

- **Detailed instructions**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Step-by-step checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Issue tracking**: Check deployment logs in Railway/Vercel

---

## Pro Tips

- Railway and Vercel have free tiers - this costs $0/month for demos
- DNS changes take 10-60 minutes to propagate worldwide
- Test on Vercel's temporary URL first before connecting your domain
- Save your Railway and Vercel URLs for future reference
