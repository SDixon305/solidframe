# Tasks: Build Client Portal

## CRITICAL: Build On Existing Work

The toolbox already has a well-developed design system and a client-demo that serves as the template. **All sub-agents MUST:**

1. **Use existing shared components** from `src/components/shared/`:
   - `Sidebar` - Already supports branding customization, hideNav, footerContent
   - `Header` - Light header pattern
   - `ToolCard` - Card with icon, status badge, action button
   - `ToolGrid` - Responsive grid with link overrides
   - `DashboardLayout` - Full layout wrapper

2. **Study and adapt the client-demo** at `src/app/client-demo/`:
   - `layout.tsx` - DemoProvider pattern for context
   - `page.tsx` - Personalized header, tool grid usage
   - Tool pages: `voice-agent/`, `reviews/`, `training/`, `scheduler/`, `roi/`
   - `src/lib/demo-context.tsx` - Context pattern for tenant data
   - `src/lib/demo-tools.ts` - Tool definitions and routes

3. **Follow the existing theme** from `src/lib/theme.ts` and `src/app/globals.css`:
   - Primary accent: `#5f3bff` (purple)
   - App background: `#f4f5f7`
   - Sidebar: `slate-900` to `slate-950` gradient
   - Highlight: `amber-400/500`
   - Status badges: Use existing `statusColors`

4. **Convert /client-demo pattern to /[tenant]** - the client-demo is essentially a preview of what each tenant portal should look like, adapt it for dynamic tenants

## Execution Strategy

Task 3A (shell) must complete first. Then 3B-3E can run **in parallel**. Task 3F (Acme seed) runs last.

```
3A (Shell) ──┬──> 3B (Onboarding) ─────────────┐
             ├──> 3C (Tools 1-4) ──────────────┤
             ├──> 3D (Tools 5-8) ──────────────┼──> 3F (Acme Seed)
             └──> 3E (Feedback) ───────────────┘
```

**Maximum parallelism: 4 sub-agents** (3B, 3C, 3D, 3E simultaneously)

---

## 3A. Client Dashboard Shell & Navigation

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read all of these files to understand the full context:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/client-demo/layout.tsx`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/client-demo/page.tsx`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/demo-context.tsx`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/demo-tools.ts`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/components/shared/` (all components)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/theme.ts`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/globals.css`

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Platform foundation (auth, DB) is complete
- This is the client-facing portal at /[tenant-slug]/

## Your Task
Create the client layout shell with navigation and dashboard home.

## Files to Create
1. `src/app/[tenant]/layout.tsx` - Client layout wrapper
2. `src/app/[tenant]/page.tsx` - Dashboard home with tool grid
3. `src/components/client/ClientSidebar.tsx` - Navigation sidebar
4. `src/components/client/ClientHeader.tsx` - Header with logo and user menu
5. `src/components/client/ToolCard.tsx` - Tool grid item
6. `src/components/client/MetricBadge.tsx` - Small metric display
7. `src/lib/tenant-context.tsx` - React context for current tenant
8. `src/lib/fake-data.ts` - Fake data generation utilities

## Design Requirements
- Clean, professional design (not dark like admin)
- White/light gray background, accent color from brand
- Sidebar with: Dashboard, Tools (expandable), Settings, Feedback, Help
- Header shows tenant logo (if uploaded) and tenant name
- Tool grid shows 8 tool cards in 2x4 or responsive grid

## Route Structure
- /[tenant-slug]/ → Dashboard
- /[tenant-slug]/tools/[tool-slug] → Tool page
- /[tenant-slug]/settings → Settings
- /[tenant-slug]/feedback → Feedback
- /[tenant-slug]/onboarding → Onboarding wizard

## Tool Card Content
Each card shows:
- Tool icon (use Lucide icons)
- Tool name
- Status badge (Active/Inactive)
- Key metric (e.g., "127 leads saved")
- Click to navigate to tool

## 8 Tools (slugs and names)
1. after-hours-agent - "After Hours AI Agent"
2. missed-call-textback - "Missed Call Text-Back"
3. review-request - "Review Request Bot"
4. appointment-reminders - "Appointment Reminders"
5. quote-reviver - "Quote Reviver"
6. seasonal-campaigns - "Seasonal Campaigns"
7. maintenance-renewal - "Maintenance Renewal"
8. tech-training - "Tech Training"

## Fake Data Utility
Create functions to generate time-based fake metrics:
- Input: tenant created date, tool slug
- Output: realistic metrics that grow over time
- Should feel alive, not static

## Requirements
- Layout validates tenant slug exists, 404 if not
- Layout checks user belongs to tenant
- Tenant context provides: tenant object, tools, configs
- Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)

## Checklist (complete ALL items)
- [x] 3A.1 Create client layout with tenant validation
- [x] 3A.2 Create ClientSidebar component
- [x] 3A.3 Create ClientHeader component
- [x] 3A.4 Create tenant context provider
- [x] 3A.5 Create ToolCard component
- [x] 3A.6 Create dashboard with tool grid
- [x] 3A.7 Create fake data utilities
- [x] 3A.8 Add mobile responsive behavior

## Do Not
- Build the actual tool pages (that's 3C and 3D)
- Build onboarding wizard (that's 3B)
- Build feedback system (that's 3E)

## When Complete
Report back with:
- List of all files created/modified
- Screenshot or description of the dashboard UI
- Any issues encountered or decisions made
- Confirmation that all checklist items are done
- Note any areas that need follow-up or refinement
```

---

## 3B. Onboarding Wizard

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read all of these files to understand the full context:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/[tenant]/layout.tsx` (created in 3A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/tenant-context.tsx` (created in 3A)

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Client shell from 3A is complete
- onboarding_progress table exists in database

## Your Task
Build the complete 10-step onboarding wizard.

## Files to Create
1. `src/app/[tenant]/onboarding/page.tsx` - Wizard container
2. `src/app/[tenant]/onboarding/[step]/page.tsx` - Dynamic step page
3. `src/components/onboarding/WizardProgress.tsx` - Progress bar
4. `src/components/onboarding/WizardNav.tsx` - Back/Skip/Next buttons
5. `src/components/onboarding/steps/WelcomeStep.tsx`
6. `src/components/onboarding/steps/BusinessTypeStep.tsx`
7. `src/components/onboarding/steps/ServiceAreaStep.tsx`
8. `src/components/onboarding/steps/BusinessHoursStep.tsx`
9. `src/components/onboarding/steps/EmergencyProtocolsStep.tsx`
10. `src/components/onboarding/steps/TeamSetupStep.tsx`
11. `src/components/onboarding/steps/AIPersonalityStep.tsx`
12. `src/components/onboarding/steps/PricingStep.tsx`
13. `src/components/onboarding/steps/PhoneNumberStep.tsx`
14. `src/components/onboarding/steps/TestCallStep.tsx`
15. `src/lib/onboarding.ts` - Onboarding state management
16. `src/hooks/useOnboarding.ts` - Hook for wizard state

## 10 Steps Detail

### Step 1: Welcome
- Display company name (editable)
- Logo upload (optional)
- Welcome message explaining what's next

### Step 2: Business Type
- Radio buttons: HVAC, Plumbing, Electrical, General Contractor, Other
- Optional: brief business description

### Step 3: Service Area
- Option A: Enter zip codes (comma separated)
- Option B: Radius from address (10/25/50 miles)
- Map preview (optional, can be placeholder)

### Step 4: Business Hours
- Day-by-day hours selector
- Timezone dropdown
- "After hours" preview showing when AI takes over

### Step 5: Emergency Protocols
- Checkbox list of emergency types:
  - Gas leak / gas smell
  - No heat (winter emergency)
  - No AC (summer emergency)
  - Water leak / flooding
  - Electrical hazard
  - Carbon monoxide detector alarm
  - Custom emergency (text input)

### Step 6: Team Setup
- Add technician form: Name, Phone, On-call schedule
- List of added technicians
- Can add multiple, minimum 1

### Step 7: AI Personality
- Voice selection with audio preview buttons
- Greeting message customization
- Brand tone: Professional, Friendly, Warm
- Preview: "Here's how your AI will sound..."

### Step 8: After Hours Pricing
- Emergency service rate input
- Minimum service charge input
- "This will be disclosed to callers"

### Step 9: Phone Number
- Display assigned Vapi number
- Instructions for forwarding
- Copy number button

### Step 10: Test Call
- Big "Test Your AI" button
- Embedded call interface (reuse from After Hours Agent tool)
- Success celebration when call completes
- "You're all set!" message

## State Management
- Save progress after each step to onboarding_progress table
- data column stores JSON of all collected data
- current_step tracks where user left off
- completed_steps[] array for skip tracking
- Can resume from any step

## Navigation
- Back: Go to previous step
- Skip: Mark step skipped, go to next (not all steps skippable)
- Next: Validate step, save, go to next
- Finish (step 10): Save all configs to tenant_tool_configs

## Requirements
- Progress bar shows all 10 steps
- Current step highlighted
- Completed steps show checkmark
- Skipped steps show dash
- Validation on required fields
- Can navigate directly to any completed step

## Checklist (complete ALL items)
- [x] 3B.1 Create wizard container and routing
- [x] 3B.2 Create WizardProgress component
- [x] 3B.3 Create WizardNav component
- [x] 3B.4 Create Steps 1-3 (Welcome, Business Type, Service Area)
- [x] 3B.5 Create Steps 4-6 (Hours, Emergency, Team)
- [x] 3B.6 Create Steps 7-8 (AI Personality, Pricing)
- [x] 3B.7 Create Steps 9-10 (Phone Number, Test Call)
- [x] 3B.8 Implement state persistence
- [x] 3B.9 Handle wizard completion

## Do Not
- Block dashboard access if onboarding incomplete
- Require all steps (allow partial completion)
- Implement actual Vapi phone provisioning (display placeholder)

## When Complete
Report back with:
- List of all files created/modified
- Screenshot or description of key wizard steps
- Explanation of state management approach
- Any issues encountered or decisions made
- Confirmation that all checklist items are done
- Notes on testing the flow end-to-end
```

---

## 3C. Tool Interfaces (Tools 1-4)

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read all of these files to understand the full context:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/[tenant]/layout.tsx` (created in 3A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/tenant-context.tsx` (created in 3A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/fake-data.ts` (created in 3A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/client-demo/voice-agent/` (for reference)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/client-demo/reviews/` (for reference)

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Client shell from 3A is complete
- These are the first 4 of 8 tools

## Your Task
Build tool interfaces for:
1. After Hours AI Agent (REAL - Vapi integration)
2. Missed Call Text-Back (MOCKUP)
3. Review Request Bot (MOCKUP)
4. Appointment Reminders (MOCKUP)

## Shared Components to Create First
1. `src/components/tools/ToolLayout.tsx` - Shared layout for all tools
2. `src/components/tools/ToolHeader.tsx` - Tool name, icon, key metric
3. `src/components/tools/ToolTabs.tsx` - Tab navigation
4. `src/components/tools/ActivityLog.tsx` - Reusable activity list
5. `src/components/tools/MetricCard.tsx` - Big number metric display
6. `src/components/tools/MessageTemplateEditor.tsx` - Editable message template

## Tool 1: After Hours AI Agent (REAL)

Location: `src/app/[tenant]/tools/after-hours-agent/page.tsx`

This is the ONLY real tool. It integrates with Vapi.

Components:
- `src/components/tools/agent/CallInterface.tsx` - Click to call, waveform
- `src/components/tools/agent/CallHistory.tsx` - Real call list with transcripts
- `src/components/tools/agent/AgentSettings.tsx` - Voice, greeting config
- `src/components/tools/agent/PerformanceMetrics.tsx` - Calls handled, etc.

Tabs:
1. Overview - Call interface + recent calls
2. History - Full call history with search
3. Settings - Agent configuration
4. Performance - Metrics charts

Features:
- Live call using Vapi Web SDK
- Real-time transcript display
- Call recording playback
- Settings save to tenant_tool_configs

## Tool 2: Missed Call Text-Back (MOCKUP)

Location: `src/app/[tenant]/tools/missed-call-textback/page.tsx`

Components:
- `src/components/tools/textback/EnableToggle.tsx` - Big on/off
- `src/components/tools/textback/LeadsSavedCounter.tsx` - Big metric

Tabs:
1. Overview - Toggle + counter + recent activity
2. Settings - Message template
3. Activity - Log of "texts sent"

Fake data:
- Generate 20-50 fake text-back events
- Names, phone numbers, timestamps
- "127 leads saved this month"

## Tool 3: Review Request Bot (MOCKUP)

Location: `src/app/[tenant]/tools/review-request/page.tsx`

Components:
- `src/components/tools/reviews/StarRatingDisplay.tsx` - Average + distribution
- `src/components/tools/reviews/FunnelChart.tsx` - Sent → Clicked → Reviewed
- `src/components/tools/reviews/TriggerConfig.tsx` - "Send X hours after job"

Tabs:
1. Overview - Rating + funnel + recent reviews
2. Settings - Trigger timing, message template
3. Activity - Review request log

Fake data:
- Average rating: 4.7 stars
- Generate fake reviews with names and text
- Funnel: 150 sent → 89 clicked → 42 reviews

## Tool 4: Appointment Reminders (MOCKUP)

Location: `src/app/[tenant]/tools/appointment-reminders/page.tsx`

Components:
- `src/components/tools/reminders/ReminderConfig.tsx` - Day-before, 2-hour toggles
- `src/components/tools/reminders/ConfirmationRate.tsx` - "94% confirm" metric
- `src/components/tools/reminders/UpcomingReminders.tsx` - Calendar preview

Tabs:
1. Overview - Config + rate + upcoming
2. Settings - Message templates
3. Activity - Reminder sent log

Fake data:
- 94% confirmation rate
- 15 upcoming appointments
- 100+ sent reminders log

## Requirements
- All tools use ToolLayout wrapper
- Consistent tab pattern
- Fake data generated from tenant created date
- Settings actually save (even if tool is mockup)
- Mobile responsive

## Checklist (complete ALL items)
- [x] 3C.1 Create shared ToolLayout and components
- [x] 3C.2 Build After Hours AI Agent (real Vapi integration)
- [x] 3C.3 Build Missed Call Text-Back (mockup)
- [x] 3C.4 Build Review Request Bot (mockup)
- [x] 3C.5 Build Appointment Reminders (mockup)
- [x] 3C.6 Generate fake data for mockup tools

## Do Not
- Make mockup tools actually functional
- Skip the shared components (reuse them)
- Implement actual SMS/review integrations

## When Complete
Report back with:
- List of all files created/modified
- Screenshot or description of each tool interface
- Explanation of how fake data generation works
- Any issues encountered or decisions made
- Confirmation that all checklist items are done
- Notes on Vapi integration for Tool 1
```

---

## 3D. Tool Interfaces (Tools 5-8)

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read all of these files to understand the full context:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/[tenant]/layout.tsx` (created in 3A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/tenant-context.tsx` (created in 3A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/fake-data.ts` (created in 3A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/components/tools/ToolLayout.tsx` (created in 3C)
- All shared components from 3C

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Client shell from 3A is complete
- Shared tool components from 3C are available
- These are the last 4 of 8 tools (all MOCKUPS)

## Your Task
Build tool interfaces for:
5. Quote Reviver (MOCKUP)
6. Seasonal Campaigns (MOCKUP)
7. Maintenance Renewal (MOCKUP)
8. Tech Training (MOCKUP)

## Shared Components (already created in 3C)
- ToolLayout, ToolHeader, ToolTabs, ActivityLog, MetricCard, MessageTemplateEditor

## Tool 5: Quote Reviver (MOCKUP)

Location: `src/app/[tenant]/tools/quote-reviver/page.tsx`

Components:
- `src/components/tools/quotes/SequenceBuilder.tsx` - Visual 3-step editor
- `src/components/tools/quotes/PipelineView.tsx` - Quotes → Followed Up → Won
- `src/components/tools/quotes/RecoveryMetrics.tsx` - "$8,200 recovered"
- `src/components/tools/quotes/QuoteList.tsx` - Outstanding quotes table

Tabs:
1. Overview - Pipeline + metrics + recent activity
2. Sequence - Follow-up sequence builder
3. Quotes - Full quote list
4. Activity - Follow-up sent log

Fake data:
- 25 outstanding quotes totaling $42,000
- 3-message sequence: Day 1, Day 3, Day 7
- $8,200 recovered this month (19% conversion)

## Tool 6: Seasonal Campaigns (MOCKUP)

Location: `src/app/[tenant]/tools/seasonal-campaigns/page.tsx`

Components:
- `src/components/tools/campaigns/CampaignTemplates.tsx` - Pre-built templates
- `src/components/tools/campaigns/AudienceSelector.tsx` - Segment picker
- `src/components/tools/campaigns/ScheduleSend.tsx` - Date/time picker
- `src/components/tools/campaigns/CampaignHistory.tsx` - Past campaigns

Tabs:
1. Overview - Next campaign suggestion + recent results
2. Create - Template selection + customization
3. History - Past campaigns with stats
4. Audience - Customer segments

Fake data:
- 4 template campaigns: Spring AC Tune-up, Summer AC Check, Fall Heating Prep, Winter Heating Special
- 3 past campaigns with open/click rates
- 1,247 customers in audience

## Tool 7: Maintenance Renewal (MOCKUP)

Location: `src/app/[tenant]/tools/maintenance-renewal/page.tsx`

Components:
- `src/components/tools/maintenance/ContractList.tsx` - Maintenance contracts
- `src/components/tools/maintenance/RenewalTimeline.tsx` - Visual timeline
- `src/components/tools/maintenance/RenewalRateCard.tsx` - "87% renewal rate"
- `src/components/tools/maintenance/RenewalSettings.tsx` - Reminder timing

Tabs:
1. Overview - Timeline + rate + upcoming renewals
2. Contracts - Full contract list
3. Settings - Reminder timing, message template
4. Activity - Renewal reminder log

Fake data:
- 45 active maintenance contracts
- 8 renewals due in next 30 days
- 87% renewal rate
- Contract values $199-$599/year

## Tool 8: Tech Training (MOCKUP)

Location: `src/app/[tenant]/tools/tech-training/page.tsx`

Components:
- `src/components/tools/training/ModuleList.tsx` - Training modules
- `src/components/tools/training/ProgressTracker.tsx` - Completion progress
- `src/components/tools/training/QuizInterface.tsx` - Multiple choice quiz
- `src/components/tools/training/CertificationBadges.tsx` - Earned badges

Tabs:
1. Overview - Progress + recent activity + badges
2. Modules - Full module list with progress
3. Certifications - Earned badges
4. Team - (placeholder) Team progress view

Training Modules:
1. Safety Fundamentals (8 lessons)
2. Customer Service Excellence (6 lessons)
3. HVAC Basics Refresher (10 lessons)
4. Electrical Safety (5 lessons)
5. First Call Resolution (4 lessons)

Fake data:
- 3/5 modules started
- 1 module complete (Safety badge earned)
- Quiz questions with answers
- Team member progress (fake names)

## Requirements
- All tools use ToolLayout wrapper from 3C
- Consistent tab pattern
- Fake data feels realistic and time-based
- Visual components (charts, timelines) look polished
- Settings persist when saved

## Checklist (complete ALL items)
- [x] 3D.1 Build Quote Reviver (mockup)
- [x] 3D.2 Build Seasonal Campaigns (mockup)
- [x] 3D.3 Build Maintenance Renewal (mockup)
- [x] 3D.4 Build Tech Training (mockup)
- [x] 3D.5 Create unique components for each tool
- [x] 3D.6 Generate fake data for all tools

## Do Not
- Make tools actually functional
- Duplicate shared components (import from 3C)
- Skip the visual polish (these sell the platform)

## When Complete
Report back with:
- List of all files created/modified
- Screenshot or description of each tool interface
- Explanation of unique visual elements (sequence builder, timeline, etc.)
- Any issues encountered or decisions made
- Confirmation that all checklist items are done
- Notes on the quality/polish of the mockups
```

---

## 3E. Feedback System

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read all of these files to understand the full context:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/[tenant]/layout.tsx` (created in 3A)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/tenant-context.tsx` (created in 3A)

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- Client shell from 3A is complete
- feedback table exists in database

## Your Task
Build the feedback submission and viewing system.

## Files to Create
1. `src/app/[tenant]/feedback/page.tsx` - Feedback page
2. `src/components/feedback/FeedbackForm.tsx` - Submission form
3. `src/components/feedback/FeedbackHistory.tsx` - Past submissions
4. `src/components/feedback/IssueReporter.tsx` - Bug report with context
5. `src/app/api/tenant/feedback/route.ts` - Feedback API

## Feedback Types
1. **General Feedback** - Suggestions, comments
2. **Bug Report** - Something isn't working
3. **Feature Request** - "I wish it could..."
4. **AI Error Report** - The agent said something wrong

## Feedback Form Fields
- Type (dropdown)
- Tool (dropdown - which tool is this about, or "General")
- Subject (text)
- Description (textarea)
- Priority (low/medium/high) - only for bug reports
- Screenshot upload (optional)

## AI Error Report (Special)
When type is "AI Error Report":
- Auto-capture recent call transcript (if available)
- "What did the AI say wrong?" textarea
- "What should it have said?" textarea
- This helps improve AI training

## Feedback History
- List of past submissions
- Status badge: Submitted, In Review, Resolved
- Click to view details
- Filter by type

## API Endpoint
POST /api/tenant/feedback
- Creates feedback record
- Links to tenant
- Optionally links to tool
- Creates alert for admin

GET /api/tenant/feedback
- Returns tenant's feedback history

## Requirements
- Form validation
- Success message after submission
- Feedback creates admin alert
- Capture browser/device info for bug reports
- Optimistic UI for submission

## Checklist (complete ALL items)
- [x] 3E.1 Create feedback page
- [x] 3E.2 Create FeedbackForm component
- [x] 3E.3 Create IssueReporter with context capture
- [x] 3E.4 Create FeedbackHistory component
- [x] 3E.5 Create feedback API routes
- [x] 3E.6 Wire up admin alert creation

## Do Not
- Build admin feedback management (that's in admin portal)
- Allow editing submitted feedback
- Implement screenshot upload (placeholder OK)

## When Complete
Report back with:
- List of all files created/modified
- Screenshot or description of the feedback form
- Explanation of how admin alerts are triggered
- Any issues encountered or decisions made
- Confirmation that all checklist items are done
- Notes on testing feedback submission flow
```

---

## 3F. Acme HVAC Seed Data

**Sub-agent prompt:**

```
## FIRST: Read These Files for Full Context

Before starting, read all of these files to understand the full context:
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/proposal.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/changes/build-client-portal/design.md`
- `/Users/sethdixon/AI SLOP/solidframe/openspec/project.md`
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/app/[tenant]/` (all components from 3A-3E)
- `/Users/sethdixon/AI SLOP/solidframe/site/toolbox/src/lib/fake-data.ts` (created in 3A)

## Context
- Project: SolidFrame toolbox platform
- Location: /Users/sethdixon/AI SLOP/solidframe/site/toolbox/
- All client portal features from 3A-3E are complete
- Database schema is in place

## Your Task
Create comprehensive seed data for Acme HVAC, the first demo client.

## Files to Create
1. `supabase/seed/acme-hvac.sql` - SQL seed file
2. `scripts/seed-acme.ts` - TypeScript seed script (alternative)
3. `src/lib/mock-data/acme-data.ts` - Exportable fake data

## Acme HVAC Profile
- Company Name: Acme HVAC Services
- Slug: acme-hvac
- Owner: John Smith
- Email: john@acmehvac.com
- Address: 123 Main Street, Phoenix, AZ 85001
- Business Type: HVAC
- Service Area: Phoenix metro (85001-85099)
- Business Hours: Mon-Fri 7am-6pm, Sat 8am-2pm
- Emergency Rate: $150/hour
- Minimum Charge: $89

## Team (Technicians)
1. Trevor Martinez - (602) 555-0101 - Primary on-call
2. Mike Johnson - (602) 555-0102 - Backup
3. Sarah Chen - (602) 555-0103 - Weekends
4. Dave Wilson - (602) 555-0104 - Commercial specialist

## Call History (50 records)
Generate 50 fake call records over last 90 days:
- Mix of emergency (30%) and non-emergency (70%)
- Realistic timestamps (more calls during business hours)
- Varied call durations (2-15 minutes)
- Sample transcripts for a few
- Caller names and phone numbers

## Customer Database (100 records)
Generate 100 fake customers:
- Names, addresses in Phoenix area
- Equipment types (AC units, furnaces)
- Service history (1-5 past services)
- Contract status (20% have maintenance contracts)

## Tool-Specific Data

### Missed Call Text-Back
- 47 texts sent this month
- 127 total leads saved
- Sample activity log entries

### Review Request Bot
- 4.7 average rating
- 42 reviews received
- 150 requests sent
- Sample reviews with text

### Appointment Reminders
- 94% confirmation rate
- 15 upcoming appointments
- 200+ reminders sent

### Quote Reviver
- 25 outstanding quotes ($42,000)
- $8,200 recovered this month
- 3-message sequence configured

### Seasonal Campaigns
- 3 past campaigns:
  - "Spring AC Tune-up" - 23% response
  - "Summer Heat Check" - 18% response
  - "Fall Heating Prep" - 27% response

### Maintenance Renewal
- 45 active contracts
- 8 renewals due in 30 days
- 87% renewal rate

### Tech Training
- Module progress:
  - Safety: 100% (Trevor, Mike, Sarah)
  - Customer Service: 60% (Trevor, Mike)
  - HVAC Basics: 30% (Trevor)

## Onboarding
- Mark onboarding as 100% complete
- All data populated from wizard steps

## Requirements
- Data should feel realistic and lived-in
- Timestamps should be distributed naturally
- Names should be diverse and realistic
- Metrics should be impressive but believable
- All 8 tools activated for Acme

## Checklist (complete ALL items)
- [x] 3F.1 Create Acme tenant record
- [x] 3F.2 Create Acme user account
- [x] 3F.3 Seed technician team
- [x] 3F.4 Generate 50 call records
- [x] 3F.5 Generate 100 customer records
- [x] 3F.6 Populate all tool metrics
- [x] 3F.7 Mark onboarding complete
- [x] 3F.8 Activate all 8 tools

## Do Not
- Use obviously fake data ("Test User 1")
- Make metrics unrealistically high
- Skip any of the 8 tools

## When Complete
Report back with:
- List of all files created/modified
- Summary of data seeded (counts, key metrics)
- Instructions for how to login as Acme
- Any issues encountered or decisions made
- Confirmation that all checklist items are done
- Notes on testing the Acme portal end-to-end
```

---

## Completion Checklist

After all sub-agents complete:

- [x] Client portal fully functional
- [x] Onboarding wizard works end-to-end
- [x] All 8 tools render with appropriate content
- [x] After Hours Agent has real Vapi integration
- [x] Mockup tools have convincing fake data
- [x] Feedback system captures and alerts
- [x] Acme HVAC is fully populated demo client
- [x] Can login as Acme and explore entire platform
