# Quick Start Guide

## Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (for database and auth)
- Vapi account (for voice AI - optional for mockups)
- Stripe account (for billing - optional for development)

---

## 1. Clone and Install

```bash
cd /Users/sethdixon/AI\ SLOP/solidframe/site/toolbox
npm install
```

---

## 2. Environment Variables

Create `.env.local` in the toolbox directory:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Vapi (Required for After Hours Agent)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
VAPI_SECRET_KEY=your-vapi-secret-key

# Stripe (Required for billing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## 3. Database Setup

Run all migrations in order:

```bash
# In Supabase SQL Editor, run each file in supabase/migrations/
01_demo_links.sql
02_tenants.sql
03_users.sql
04_tools.sql
05_tenant_tools.sql
06_subscriptions.sql
07_usage_logs.sql
08_alerts.sql
09_feedback.sql
10_onboarding.sql
11_seed_tools.sql      # Seeds the 8 tools
12_seed_acme_hvac.sql  # Seeds demo client
20_rls_policies.sql    # Row Level Security
```

Or use Supabase CLI:
```bash
supabase db push
```

---

## 4. Run Development Server

```bash
npm run dev
```

Open:
- **Admin Portal**: http://localhost:3000/admin
- **Client Demo**: http://localhost:3000/client-demo
- **Acme HVAC Portal**: http://localhost:3000/acme-hvac

---

## 5. Create Admin Account

1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user (e.g., admin@solidframe.ai)
3. Run this SQL with the user's auth ID:

```sql
INSERT INTO users (auth_id, email, role, first_name, last_name)
VALUES (
    'paste-auth-id-here',
    'admin@solidframe.ai',
    'super_admin',
    'Admin',
    'User'
);
```

---

## 6. Seed a New Demo Tenant

To create another demo tenant like Acme HVAC, use the mock data generators:

```typescript
import { generateAcmeData } from '@/lib/mock-data/acme-data'

const data = generateAcmeData('new-tenant-slug')
// Insert into database
```

Or copy and modify `12_seed_acme_hvac.sql`.

---

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

The app is configured for Vercel:

```bash
git push origin main  # Auto-deploys to Vercel
```

Production URLs:
- Admin: `https://toolbox.solidframe.ai`
- Client Demo: `https://client-toolbox.solidframe.ai`
- Client Portals: `https://[tenant-slug].toolbox.solidframe.ai`

---

## Troubleshooting

### "Access denied. Super admin role required."
- Your user doesn't have `role = 'super_admin'` in the `users` table
- Check that `auth_id` matches your Supabase auth user ID

### Migrations fail
- Run in order (01 before 02, etc.)
- Check for existing tables that might conflict

### Vapi calls not working
- Verify VAPI keys in `.env.local`
- Check Vapi dashboard for agent configuration
- Ensure After Hours Agent tool is activated for the tenant
