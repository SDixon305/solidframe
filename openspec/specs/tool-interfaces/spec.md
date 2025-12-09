# tool-interfaces Specification

## Purpose
TBD - created by archiving change build-client-portal. Update Purpose after archive.
## Requirements
### Requirement: Consistent Tool Interface Pattern
The system SHALL provide a consistent UI pattern for all 8 tools: header with name and key metric, tab navigation, and content area.

#### Scenario: Tool page layout
- **WHEN** client navigates to any tool
- **THEN** they see a header with tool icon, name, and primary metric
- **AND** tab navigation for tool sections
- **AND** content area that changes per tab

#### Scenario: Tool tabs
- **WHEN** client clicks a tab
- **THEN** the content area updates to show that tab's content
- **AND** the URL updates to reflect the active tab

### Requirement: After Hours AI Agent Interface
The system SHALL provide a fully functional After Hours AI Agent tool with live calling capability, call history, settings, and performance metrics.

#### Scenario: Make test call
- **WHEN** client clicks the call button
- **THEN** a live call connects via Vapi
- **AND** real-time transcript displays during the call

#### Scenario: View call history
- **WHEN** client views the History tab
- **THEN** they see a list of all calls with date, duration, and outcome
- **AND** clicking a call shows the full transcript

#### Scenario: Configure agent
- **WHEN** client changes the greeting message in Settings
- **THEN** the change is saved to their configuration
- **AND** future calls use the new greeting

### Requirement: Missed Call Text-Back Interface
The system SHALL provide a Missed Call Text-Back tool interface with enable toggle, message template, and activity metrics.

#### Scenario: Enable text-back
- **WHEN** client toggles the tool to enabled
- **THEN** the status changes to "Active"
- **AND** the "leads saved" metric displays

#### Scenario: View activity
- **WHEN** client views the Activity tab
- **THEN** they see a log of text-back events (mockup data)

### Requirement: Review Request Bot Interface
The system SHALL provide a Review Request Bot tool interface with rating display, request funnel, and message configuration.

#### Scenario: View review metrics
- **WHEN** client views the tool overview
- **THEN** they see average star rating and review count
- **AND** a funnel showing sent → clicked → reviewed

#### Scenario: Configure trigger
- **WHEN** client sets "Send 2 hours after job completion"
- **THEN** the setting is saved to their configuration

### Requirement: Appointment Reminders Interface
The system SHALL provide an Appointment Reminders tool interface with reminder configuration, confirmation rate, and calendar preview.

#### Scenario: Configure reminders
- **WHEN** client enables "Day before" and "2 hours before" reminders
- **THEN** both options are saved
- **AND** the confirmation rate metric displays

#### Scenario: View upcoming
- **WHEN** client views the Overview tab
- **THEN** they see upcoming appointments that will receive reminders (mockup data)

### Requirement: Quote Reviver Interface
The system SHALL provide a Quote Reviver tool interface with follow-up sequence builder, pipeline view, and recovery metrics.

#### Scenario: View pipeline
- **WHEN** client views the tool overview
- **THEN** they see outstanding quotes and recovered revenue metrics
- **AND** a pipeline visualization

#### Scenario: Configure sequence
- **WHEN** client edits the follow-up sequence
- **THEN** they can set message content and timing for each step

### Requirement: Seasonal Campaigns Interface
The system SHALL provide a Seasonal Campaigns tool interface with campaign templates, audience selection, and scheduling.

#### Scenario: View templates
- **WHEN** client views the Create tab
- **THEN** they see pre-built campaign templates
- **AND** can select and customize one

#### Scenario: Schedule campaign
- **WHEN** client schedules a campaign for a future date
- **THEN** the campaign appears in their history with "Scheduled" status

### Requirement: Maintenance Renewal Interface
The system SHALL provide a Maintenance Renewal tool interface with contract list, renewal timeline, and renewal rate metrics.

#### Scenario: View contracts
- **WHEN** client views the Contracts tab
- **THEN** they see a list of maintenance contracts with renewal dates

#### Scenario: View timeline
- **WHEN** client views the Overview tab
- **THEN** they see a visual timeline of upcoming renewals

### Requirement: Tech Training Interface
The system SHALL provide a Tech Training tool interface with training modules, progress tracking, and certification badges.

#### Scenario: View modules
- **WHEN** client views the Modules tab
- **THEN** they see available training modules with progress indicators

#### Scenario: Take quiz
- **WHEN** client completes a training module quiz
- **THEN** their progress is updated
- **AND** if passed, they earn a certification badge

### Requirement: Fake Data for Mockup Tools
The system SHALL generate realistic fake data for mockup tools based on tenant creation date, making metrics grow over time.

#### Scenario: Time-based metrics
- **WHEN** a tenant was created 30 days ago
- **THEN** their mockup tools show 30 days worth of accumulated metrics
- **AND** activity logs have realistic timestamps within that period

#### Scenario: Consistent fake data
- **WHEN** client refreshes the page
- **THEN** the same fake data displays (seeded by tenant ID, not random)

### Requirement: Tool Settings Persistence
The system SHALL persist tool settings configured by clients, even for mockup tools.

#### Scenario: Save mockup settings
- **WHEN** client changes a message template in a mockup tool
- **THEN** the change is saved to tenant_tool_configs
- **AND** persists across sessions

### Requirement: Feedback Submission
The system SHALL allow clients to submit feedback, bug reports, and AI error reports from the feedback page.

#### Scenario: Submit feedback
- **WHEN** client fills out the feedback form and submits
- **THEN** the feedback is saved to the database
- **AND** an alert is created for admins
- **AND** client sees a success confirmation

#### Scenario: Report AI error
- **WHEN** client reports an AI error
- **THEN** the form captures what the AI said wrong and what it should have said
- **AND** recent call transcript is attached if available

#### Scenario: View feedback history
- **WHEN** client views their past feedback
- **THEN** they see a list of submissions with status (Submitted, In Review, Resolved)

