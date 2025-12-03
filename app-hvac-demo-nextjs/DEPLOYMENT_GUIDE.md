# Deployment Guide: solidframe.ai/hvac-owners

This guide will walk you through deploying your HVAC demo to **solidframe.ai/hvac-owners**.

## Overview

- **Frontend**: Next.js app deployed to Vercel (at `/hvac-owners` path)
- **Backend**: Python FastAPI deployed to Railway
- **Domain**: solidframe.ai (via GoDaddy DNS)

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub (recommended) or email

### Step 2: Deploy Backend
1. Click "New Project" → "Deploy from GitHub repo"
2. Connect your GitHub account and select this repository
3. Choose the `backend` folder as the root directory
4. Railway will automatically detect it's a Python app

### Step 3: Set Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```
SUPABASE_URL=https://igitbonjrlksxeamqwjj.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnaXRib25qcmxrc3hlYW1xd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTc4OTAsImV4cCI6MjA3OTQ5Mzg5MH0.0MEwVkz_eXXfR61VRnKrQtTKbTmyW0h5l76L_EjUzU8
TWILIO_ACCOUNT_SID=[your_twilio_account_sid]
TWILIO_AUTH_TOKEN=[your_twilio_auth_token]
TWILIO_PHONE_NUMBER=[your_twilio_phone]
OPENAI_API_KEY=[your_openai_api_key]
FRONTEND_URL=https://solidframe.ai
```

**Note**: Copy these from your `backend/.env` file. You'll need to get them from:
- Supabase: Already in the config
- Twilio: [twilio.com/console](https://www.twilio.com/console)
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Step 4: Get Your Backend URL
1. Once deployed, Railway will give you a URL like: `https://your-app-name.up.railway.app`
2. **Copy this URL** - you'll need it for the frontend!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import this repository
3. Vercel will auto-detect it's a Next.js app
4. **Important**: Set the Root Directory to `frontend`

### Step 3: Configure Build Settings
Vercel should auto-detect these, but verify:
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Step 4: Set Environment Variables
Before deploying, click "Environment Variables" and add:

```
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://igitbonjrlksxeamqwjj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnaXRib25qcmxrc3hlYW1xd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTc4OTAsImV4cCI6MjA3OTQ5Mzg5MH0.0MEwVkz_eXXfR61VRnKrQtTKbTmyW0h5l76L_EjUzU8
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-webhook-url.com
```

**Replace** `https://your-railway-app.up.railway.app` with your actual Railway URL from Part 1!

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. You'll get a URL like: `https://your-project.vercel.app`

---

## Part 3: Connect Your Domain (solidframe.ai)

### Step 1: Add Domain in Vercel
1. In Vercel dashboard, go to your project → Settings → Domains
2. Add domain: `solidframe.ai`
3. Also add: `www.solidframe.ai`
4. Vercel will show you DNS records to add

### Step 2: Configure GoDaddy DNS
1. Log in to [godaddy.com](https://www.godaddy.com)
2. Go to "My Products" → Find "solidframe.ai" → Click "DNS"
3. **Add these records** (Vercel will show you the exact values):

**For root domain (solidframe.ai):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)
- TTL: 600 seconds

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: 600 seconds

### Step 3: Configure Path Rewrite (if needed)
Since your app is configured for `/hvac-owners`:

**Option A: Root Domain Deployment** (Recommended)
If you want it at the root (`solidframe.ai` instead of `solidframe.ai/hvac-owners`):
1. Remove `basePath` and `assetPrefix` from `frontend/next.config.js`
2. Redeploy

**Option B: Keep Subpath**
Your app is already configured to run at `solidframe.ai/hvac-owners`. Just ensure:
1. In Vercel, the domain points to the project root
2. When users visit `solidframe.ai/hvac-owners`, they'll see your app
3. You can create a landing page at `solidframe.ai` later

### Step 4: Verify SSL
- Vercel automatically provisions SSL certificates
- Wait 5-10 minutes after DNS changes
- Visit `https://solidframe.ai/hvac-owners`
- Should show a valid SSL certificate

---

## Part 4: Update Backend CORS

Once your frontend is live, update Railway backend environment variables:

```
FRONTEND_URL=https://solidframe.ai
```

This ensures the backend accepts requests from your production domain.

---

## Testing Your Deployment

1. Visit: `https://solidframe.ai/hvac-owners`
2. Test the business setup form
3. Verify calls work with Vapi integration
4. Check that data saves to Supabase

---

## Troubleshooting

### Frontend shows 404
- Verify DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
- Check Vercel domain settings
- Ensure basePath in next.config.js matches URL path

### API calls failing
- Check Railway backend is running
- Verify CORS settings (FRONTEND_URL)
- Check browser console for errors

### Build fails
- Check environment variables in Vercel
- Verify all required env vars are set
- Review build logs in Vercel dashboard

---

## Cost Breakdown

- **Vercel**: Free tier (sufficient for this demo)
- **Railway**: Free tier ($5/month credit, then $0.000463/GB-hr)
- **Supabase**: Free tier (sufficient for demos)
- **Domain**: Already purchased on GoDaddy

**Total estimated monthly cost**: $0-5 (mostly free!)

---

## Next Steps

1. Test the deployment thoroughly
2. Consider adding a landing page at `solidframe.ai` root
3. Set up monitoring (Vercel Analytics, Railway logs)
4. Add your own branding/content

---

## Support

If you run into issues:
1. Check Vercel deployment logs
2. Check Railway application logs
3. Verify all environment variables are set correctly
4. Ensure GoDaddy DNS records are correct
