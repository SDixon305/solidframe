# Design: Client Portal

## Context

The client portal is the primary product SolidFrame sells to HVAC and trades businesses. Each client gets their own portal at `toolbox.solidframe.ai/{tenant-slug}` where they access automation tools, complete onboarding, and manage their settings.

### Stakeholders
- **Client Business Owners**: Primary users, non-technical
- **Client Office Staff**: May use tools day-to-day
- **SolidFrame Admins**: Need to support and view as client

### Constraints
- Must be simple enough for non-technical HVAC business owners
- Path-based tenant routing (`/acme-hvac/dashboard`)
- Mobile-responsive (owners check on phone)
- 8 tools, only 1 real (After Hours Agent), 7 are UI mockups

## Goals / Non-Goals

### Goals
- Impressive, polished UI that justifies premium pricing
- Simple onboarding that captures necessary configuration
- Tools that look real even when they're mockups
- Clear value demonstration through metrics and dashboards

### Non-Goals
- Complex configuration options (keep it simple)
- Real functionality for mockup tools (fake data is fine)
- Multi-user per tenant (one login for now)
- White-labeling beyond logo

## Decisions

### Decision 1: Tool Card Grid Layout

**Choice**: Dashboard shows tools as a grid of cards, each clickable to enter that tool.

**Rationale**: Visual, scannable, feels like a product suite. Each card shows tool status (active/inactive) and a key metric.

### Decision 2: Consistent Tool UI Pattern

**Choice**: All 8 tools follow the same UI pattern:
- Header with tool name and key metric
- Tab navigation (Overview, Settings, Activity)
- Action button area

**Rationale**: Consistency makes mockup tools feel real and reduces design work.

### Decision 3: Fake Data Strategy

**Choice**: Generate realistic fake data seeded from tenant creation date. Metrics grow over time.

**Rationale**: Static fake data looks fake. Time-based fake data feels alive and real.

### Decision 4: Onboarding as Progressive Disclosure

**Choice**: 10-step wizard that can be skipped and returned to. Tools work with defaults if onboarding incomplete.

**Rationale**: Don't block the "wow" moment. Let them explore, then complete setup.

## URL Structure

```
/[tenant-slug]
├── /                    → Dashboard (tool grid)
├── /onboarding          → Onboarding wizard
├── /onboarding/[step]   → Specific step
├── /tools
│   ├── /after-hours-agent    → Real tool
│   ├── /missed-call-textback → Mockup
│   ├── /review-request       → Mockup
│   ├── /appointment-reminder → Mockup
│   ├── /quote-reviver        → Mockup
│   ├── /seasonal-campaigns   → Mockup
│   ├── /maintenance-renewal  → Mockup
│   └── /tech-training        → Mockup
├── /settings            → Client settings (logo, basic info)
└── /feedback            → Feedback submission
```

## Component Architecture

```
ClientLayout
├── ClientHeader
│   ├── TenantLogo
│   ├── TenantName
│   └── UserMenu
├── ClientSidebar
│   ├── NavItem (Dashboard)
│   ├── NavItem (Tools - expandable)
│   │   └── ToolNavItem x 8
│   ├── NavItem (Settings)
│   └── NavItem (Feedback)
└── MainContent

ToolLayout (shared by all 8 tools)
├── ToolHeader
│   ├── ToolIcon
│   ├── ToolName
│   └── KeyMetric
├── ToolTabs
│   ├── Overview
│   ├── Settings (if applicable)
│   └── Activity
└── ToolContent

OnboardingWizard
├── ProgressBar (10 steps)
├── StepContent
│   └── [Varies by step]
└── NavigationButtons
    ├── Back
    ├── Skip
    └── Next/Finish
```

## Onboarding Steps

| Step | Name | Fields | Purpose |
|------|------|--------|---------|
| 1 | Welcome | Company name (confirm), logo upload | First impression |
| 2 | Business Type | HVAC, Plumbing, Electrical, Other | Contextualize tools |
| 3 | Service Area | Zip codes or radius | Geographic scope |
| 4 | Business Hours | Hours per day, timezone | Define "after hours" |
| 5 | Emergency Protocols | Checkbox list of emergencies | Customize triage |
| 6 | Team Setup | Add technicians (name, phone) | Dispatch targets |
| 7 | AI Personality | Voice selection, greeting preview | Personalization |
| 8 | After Hours Pricing | Emergency rate, minimum charge | Disclosure |
| 9 | Phone Number | Display assigned Vapi number | Activation prep |
| 10 | Test Call | Button to call and test AI | Confidence builder |

Data saved to `onboarding_progress.data` JSON and `tenant_tool_configs` on completion.

## Tool Mockup Strategy

### Fake Data Generation

```typescript
// Generate fake metrics based on tenant creation date
function generateFakeMetrics(tenantCreatedAt: Date, toolSlug: string): ToolMetrics {
  const daysSinceCreation = daysSince(tenantCreatedAt);
  const baseValue = Math.floor(daysSinceCreation * 1.5); // Grows over time

  return {
    'missed-call-textback': {
      leadsSaved: baseValue + randomVariance(10),
      responseRate: 94 + randomVariance(3),
    },
    'review-request': {
      reviewsRequested: baseValue * 2,
      reviewsReceived: Math.floor(baseValue * 0.4),
      averageRating: 4.7 + randomVariance(0.2),
    },
    // ... etc
  }[toolSlug];
}
```

### Activity Log Generation

Each mockup tool shows an "Activity" tab with recent events. Generate 10-20 fake events:
- Timestamps within last 30 days
- Realistic names (use faker library)
- Appropriate event types per tool

## Tool Details

### 1. After Hours AI Agent (REAL)

**Actually functional** via Vapi integration.

Components:
- `CallInterface` - Click to test, live waveform
- `CallHistory` - List of real calls with transcripts
- `AgentSettings` - Voice, greeting, emergency keywords
- `PerformanceMetrics` - Calls handled, emergency rate, avg duration

### 2. Missed Call Text-Back (MOCKUP)

Components:
- `EnableToggle` - Big on/off switch
- `MessageTemplate` - Editable template with variables
- `LeadsSavedCounter` - Big number metric
- `ActivityLog` - Fake "Texted John at 555-1234" entries

### 3. Review Request Bot (MOCKUP)

Components:
- `TriggerConfig` - "Send X hours after job completion"
- `MessageTemplate` - Review request message
- `FunnelChart` - Sent → Clicked → Reviewed
- `StarRatingDisplay` - Average rating and distribution

### 4. Appointment Reminders (MOCKUP)

Components:
- `ReminderTimingConfig` - Day before, 2 hours before toggles
- `MessageTemplates` - Two editable templates
- `ConfirmationRateCard` - "94% confirmation rate"
- `UpcomingReminders` - Calendar-style preview

### 5. Quote Reviver (MOCKUP)

Components:
- `SequenceBuilder` - Visual 3-step sequence editor
- `PipelineView` - Quotes → Followed Up → Recovered
- `RecoveryMetrics` - Amount recovered, conversion rate
- `QuoteList` - Fake outstanding quotes

### 6. Seasonal Campaign Blaster (MOCKUP)

Components:
- `CampaignTemplates` - Spring AC, Fall Heating, etc.
- `AudienceSelector` - All customers, segment
- `ScheduleSend` - Date/time picker
- `CampaignHistory` - Past campaigns with stats

### 7. Maintenance Renewal Alerts (MOCKUP)

Components:
- `ContractList` - Fake maintenance contracts
- `RenewalTimeline` - Visual timeline of upcoming renewals
- `RenewalRateCard` - "87% renewal rate"
- `MessageTemplate` - Renewal reminder message

### 8. Tech Training (MOCKUP)

Components:
- `ModuleList` - Training modules (Safety, Customer Service, etc.)
- `ProgressTracker` - Per-module completion
- `QuizInterface` - Simple multiple choice
- `CertificationBadges` - Earned badges display

## Acme HVAC Seed Data

Create comprehensive fake data for Acme:
- 50+ fake call records (for After Hours Agent)
- 100+ fake customers
- 20+ fake technicians
- Realistic metrics for all tools
- Completed onboarding

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Mockups look too fake | Time-based data, realistic activity logs |
| Onboarding too long | Allow skip, show progress clearly |
| Tool overload | Clean navigation, focus on 2-3 key tools initially |

## Open Questions

1. **Tool ordering**: Which tools appear first in the grid?
   - After Hours Agent first (hero), then by category

2. **Incomplete onboarding UX**: Banner or modal reminder?
   - Subtle banner on dashboard, not blocking
