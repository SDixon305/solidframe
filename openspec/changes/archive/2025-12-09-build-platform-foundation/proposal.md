# Change: Build Platform Foundation

## Why

SolidFrame needs to evolve from a single-demo site into a multi-tenant SaaS platform where:
- Multiple clients can have their own toolbox portals
- Tools are configured centrally and deployed to all clients
- Usage is tracked per-client for billing
- Admins can manage clients, tools, and subscriptions

Currently, the system has demo-focused tables (`demo_sessions`, `demo_calls`, `demo_links`) with no tenant isolation, no authentication, and no tool versioning. This proposal establishes the foundational infrastructure that Master Proposals 2 (Admin Portal) and 3 (Client Portal) will build upon.

## What Changes

### Database Schema
- **NEW**: `tenants` table - Client companies (Acme HVAC, etc.)
- **NEW**: `users` table - User accounts with tenant association and roles
- **NEW**: `tools` table - Global tool definitions (After Hours Agent, Review Bot, etc.)
- **NEW**: `tool_versions` table - Version history for canary rollouts
- **NEW**: `tenant_tools` table - Which tools are activated per tenant
- **NEW**: `tenant_tool_configs` table - Per-tenant tool settings
- **NEW**: `subscriptions` table - Stripe subscription tracking
- **NEW**: `usage_logs` table - Per-tenant usage metrics
- **NEW**: `alerts` table - Notification queue for admins
- **MODIFIED**: RLS policies on all tables for tenant isolation

### Authentication System
- **NEW**: Supabase Auth integration with magic link flow
- **NEW**: Role-based access (super_admin, admin, client_user)
- **NEW**: Middleware for route protection
- **NEW**: Session management

### Tool Engine
- **NEW**: Tool versioning system (draft → staging → production)
- **NEW**: Canary rollout capability (% of tenants)
- **NEW**: Tool configuration schema validation
- **NEW**: Default configuration templates

### Stripe Integration
- **NEW**: Customer creation on tenant signup
- **NEW**: Subscription management (create, update, cancel)
- **NEW**: Webhook handling for payment events
- **NEW**: Usage-based billing hooks

## Impact

- **Affected specs**: Creates new specs (multi-tenancy, auth-system, tool-engine)
- **Affected code**:
  - `site/toolbox/` - New API routes, middleware, database client
  - `site/toolbox/supabase/migrations/` - New migration files
- **Dependencies**: Master Proposals 2 and 3 depend on this completing first
- **Breaking**: Existing demo tables remain but will be deprecated

## Sequencing

This proposal MUST complete before:
- `build-admin-portal` (needs auth, tenant management APIs)
- `build-client-portal` (needs auth, tool configs, tenant isolation)

Estimated sub-agent tasks: 4 (sequential due to dependencies)
