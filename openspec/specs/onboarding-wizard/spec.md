# onboarding-wizard Specification

## Purpose
TBD - created by archiving change build-client-portal. Update Purpose after archive.
## Requirements
### Requirement: Multi-Step Onboarding Wizard
The system SHALL provide a 10-step onboarding wizard that collects client configuration data progressively.

#### Scenario: Start onboarding
- **WHEN** client navigates to /[tenant]/onboarding
- **THEN** they see the wizard at their current step (or step 1 if new)
- **AND** a progress bar shows all 10 steps

#### Scenario: Navigate between steps
- **WHEN** client completes a step and clicks Next
- **THEN** data is saved and they advance to the next step

### Requirement: Onboarding Progress Persistence
The system SHALL persist onboarding progress so clients can resume from where they left off.

#### Scenario: Resume onboarding
- **WHEN** client returns to onboarding after leaving mid-wizard
- **THEN** they resume at their last completed step
- **AND** all previously entered data is restored

#### Scenario: Edit previous step
- **WHEN** client clicks a completed step in the progress bar
- **THEN** they can view and edit that step's data

### Requirement: Step Skipping
The system SHALL allow clients to skip optional steps while requiring completion of mandatory steps.

#### Scenario: Skip optional step
- **WHEN** client clicks Skip on an optional step
- **THEN** the step is marked as skipped
- **AND** they advance to the next step

#### Scenario: Required step cannot skip
- **WHEN** client attempts to skip a required step
- **THEN** the Skip button is disabled or hidden
- **AND** a message indicates the step is required

### Requirement: Business Configuration Steps
The system SHALL collect business configuration through dedicated wizard steps: Welcome, Business Type, Service Area, Business Hours, and Emergency Protocols.

#### Scenario: Configure business hours
- **WHEN** client sets Monday hours to 7am-6pm
- **THEN** the system stores this configuration
- **AND** the "after hours" time is calculated and displayed

#### Scenario: Configure emergency types
- **WHEN** client selects "Gas leak" and "No heat" as emergencies
- **THEN** these are saved to their tool configuration
- **AND** the AI agent will treat these as emergencies

### Requirement: Team Setup Step
The system SHALL allow clients to add technician team members with contact information during onboarding.

#### Scenario: Add technician
- **WHEN** client enters technician name "Trevor" and phone "555-1234"
- **THEN** the technician is added to their team list
- **AND** can be selected for on-call dispatch

#### Scenario: Multiple technicians
- **WHEN** client has added 3 technicians
- **THEN** all 3 are displayed in the team list
- **AND** any can be removed or edited

### Requirement: AI Personality Configuration
The system SHALL allow clients to customize their AI agent's voice and personality during onboarding.

#### Scenario: Select voice
- **WHEN** client selects a voice option
- **THEN** an audio preview plays
- **AND** the selection is saved to their configuration

#### Scenario: Customize greeting
- **WHEN** client edits the greeting message
- **THEN** the AI will use their custom greeting for calls

### Requirement: Test Call Capability
The system SHALL allow clients to make a test call to their AI agent as the final onboarding step.

#### Scenario: Make test call
- **WHEN** client clicks "Test Your AI" on step 10
- **THEN** a call interface appears
- **AND** they can have a conversation with their configured AI

#### Scenario: Complete onboarding
- **WHEN** client finishes the test call
- **THEN** onboarding is marked complete
- **AND** they see a success celebration message
- **AND** are redirected to their dashboard

### Requirement: Onboarding Completion
The system SHALL save all onboarding data to appropriate database tables upon wizard completion.

#### Scenario: Save configuration
- **WHEN** onboarding completes
- **THEN** business config is saved to tenant record
- **THEN** tool config is saved to tenant_tool_configs
- **THEN** technicians are saved to team storage
- **THEN** onboarding_progress is marked complete

