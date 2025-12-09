# Change: Build Admin Portal

## Why

SolidFrame admins need a central dashboard to manage the multi-tenant platform. Currently there's no way to:
- Create and manage client accounts
- Configure and deploy tool versions
- View usage analytics across all clients
- Receive alerts about system health and client issues

This portal is the command center for operating the SolidFrame business.

## What Changes

### Admin Dashboard
- **NEW**: Admin layout with navigation sidebar
- **NEW**: Dashboard home with key metrics (total clients, active tools, alerts)
- **NEW**: Real-time alert feed

### Client Management
- **NEW**: Client list view with search/filter
- **NEW**: Client detail view with all settings
- **NEW**: Create client wizard
- **NEW**: Activate/deactivate tools per client
- **NEW**: View client's tool configurations
- **NEW**: Impersonate client view ("see as client")

### Tool Configuration Engine UI
- **NEW**: Tool list showing all 8 tools
- **NEW**: Tool version management interface
- **NEW**: Version editor with config schema
- **NEW**: Deploy to staging/production buttons
- **NEW**: Rollout percentage slider
- **NEW**: Rollback button with confirmation

### Analytics Dashboard
- **NEW**: Platform-wide metrics (total calls, SMS sent, etc.)
- **NEW**: Per-client usage breakdown
- **NEW**: Revenue tracking (from Stripe)
- **NEW**: Usage trends over time

### Alert System
- **NEW**: Alert inbox with read/unread state
- **NEW**: Alert categories (client, system, billing)
- **NEW**: Alert creation triggers (webhooks, cron jobs)
- **NEW**: Email digest (daily summary)

## Impact

- **Affected specs**: Creates new specs (admin-dashboard, client-management, analytics)
- **Affected code**: `site/toolbox/src/app/admin/`
- **Dependencies**: Requires `build-platform-foundation` to complete first
- **Prerequisites**: Database schema, auth system, tool engine APIs must exist

## Sequencing

This proposal:
- **Depends on**: `build-platform-foundation` (all 4 tasks)
- **Can parallel with**: `build-client-portal` (after foundation completes)

Estimated sub-agent tasks: 5 (can parallelize 2A+2B after 2A shell exists)
