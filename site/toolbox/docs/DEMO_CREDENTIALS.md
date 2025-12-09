# Demo Credentials

## Acme HVAC (Demo Client)

| Field | Value |
|-------|-------|
| **Company** | Acme HVAC Services |
| **Portal URL** | `https://acme-hvac.toolbox.solidframe.ai` or `http://localhost:3000/acme-hvac` |
| **Email** | john@acmehvac.com |
| **Password** | Set via Supabase Auth (magic link or password reset) |
| **Role** | admin (tenant admin) |

### Team Members

| Name | Email | Role |
|------|-------|------|
| John Smith | john@acmehvac.com | Owner/Admin |
| Trevor Martinez | trevor@acmehvac.com | Technician |
| Mike Johnson | mike@acmehvac.com | Technician |
| Sarah Chen | sarah@acmehvac.com | Technician |
| Dave Wilson | dave@acmehvac.com | Technician |

---

## Admin Portal

| Field | Value |
|-------|-------|
| **URL** | `https://toolbox.solidframe.ai` or `http://localhost:3000/admin` |
| **Required Role** | `super_admin` |

To create an admin account:
1. Create a user in Supabase Auth
2. Insert a record in the `users` table with `role = 'super_admin'`

```sql
INSERT INTO users (auth_id, email, role, first_name, last_name)
VALUES (
    '<supabase-auth-user-id>',
    'admin@solidframe.ai',
    'super_admin',
    'Admin',
    'User'
);
```

---

## API Keys

### Supabase
- **Project URL**: `https://igitbonjrlksxeamqwjj.supabase.co`
- **Dashboard**: Access via Supabase dashboard

### Vapi (Voice AI)
- Used for After Hours AI Agent (Tool 1)
- Configure in Vapi dashboard, add keys to `.env.local`

### Stripe (Billing)
- Test mode keys for development
- Configure in Stripe dashboard, add keys to `.env.local`

---

## Quick Login Test

1. Run `npm run dev`
2. Go to `http://localhost:3000/login`
3. Use magic link with `john@acmehvac.com`
4. Check Supabase logs or email for the link
5. You'll land on the Acme HVAC client portal
