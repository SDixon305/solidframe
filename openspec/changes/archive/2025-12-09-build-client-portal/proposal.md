# Change: Build Client Portal

## Why

Client businesses need their own portal to access and manage their SolidFrame automation tools. Currently there's no authenticated client-facing experience - just public demos. This portal is what clients log into to:
- Complete onboarding and configure their tools
- Access their 8 automation tools (1 real + 7 mockups)
- View their usage and analytics
- Submit feedback and report issues
- Customize basic settings (logo)

This is the customer-facing product that SolidFrame sells.

## What Changes

### Client Dashboard
- **NEW**: Client layout with tool navigation
- **NEW**: Dashboard home with tool grid and usage summary
- **NEW**: Tenant branding (logo display)

### Onboarding Wizard
- **NEW**: 10-step onboarding flow
- **NEW**: Progress tracking and resume capability
- **NEW**: Configuration persistence per step
- **NEW**: Test call feature before going live

### Tool Interfaces (8 Tools)
All tools share a common UI pattern but have unique content.

1. **After Hours AI Agent** (REAL)
   - Live call interface with Vapi integration
   - Call history with transcripts
   - Agent configuration (voice, greeting, hours)
   - Performance metrics

2. **Missed Call Text-Back** (MOCKUP)
   - Enable/disable toggle
   - Message template editor
   - "Leads saved" counter
   - Activity log (fake data)

3. **Review Request Bot** (MOCKUP)
   - Trigger configuration (after job completion)
   - Message template
   - Star rating dashboard
   - Sent/clicked/reviewed funnel

4. **Appointment Reminders** (MOCKUP)
   - Reminder timing settings
   - Message templates (day-before, 2-hour)
   - Confirmation rate metric
   - Calendar preview

5. **Quote Reviver** (MOCKUP)
   - Follow-up sequence builder
   - Pipeline view (quotes → recovered)
   - Recovery rate metric
   - Message templates

6. **Seasonal Campaign Blaster** (MOCKUP)
   - Campaign templates (Spring AC, Fall Heating)
   - Audience selector
   - Schedule/send interface
   - Campaign performance stats

7. **Maintenance Renewal Alerts** (MOCKUP)
   - Contract list view
   - Renewal timeline
   - Message templates
   - Renewal rate metric

8. **Tech Training** (MOCKUP)
   - Training module list
   - Progress tracking
   - Quiz/assessment interface
   - Certification badges

### Feedback System
- **NEW**: Feedback submission form
- **NEW**: Issue reporting with context capture
- **NEW**: Feedback history view

### Acme HVAC Demo Client
- **NEW**: Seed Acme as first client
- **NEW**: Populate with realistic fake data
- **NEW**: All 8 tools activated

## Impact

- **Affected specs**: Creates new specs (client-dashboard, onboarding-wizard, tool-interfaces)
- **Affected code**: `site/toolbox/src/app/[tenant]/`
- **Dependencies**: Requires `build-platform-foundation` to complete first
- **Can parallel with**: `build-admin-portal` (both need foundation)

## Sequencing

This proposal:
- **Depends on**: `build-platform-foundation` (all 4 tasks)
- **Can parallel with**: `build-admin-portal`

Estimated sub-agent tasks: 6 (can heavily parallelize after shell exists)

```
3A (Shell) ──┬──> 3B (Onboarding) ─────────────┐
             ├──> 3C (Tools 1-4) ──────────────┤
             ├──> 3D (Tools 5-8) ──────────────┼──> 3F (Acme) ──> Done
             └──> 3E (Feedback) ───────────────┘
```
