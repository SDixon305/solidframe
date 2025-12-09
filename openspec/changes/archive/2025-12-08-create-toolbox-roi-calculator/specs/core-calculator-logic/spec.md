# Core Calculator Logic

This spec defines the fundamental inputs, state management, and calculation engine for the ROI Projector.

## ADDED Requirements

### Requirement: Calculator Inputs
The interface MUST provide intuitive inputs for key HVAC metrics.

#### Scenario: User adjusts "Missed Calls per Week"
-   *Given* the ROI Projector is open
-   *When* I drag the "Missed Calls" slider to 10
-   *Then* the "Weekly Revenue Loss" updates immediately.

#### Scenario: User inputs "Average Ticket Size"
-   *Given* the inputs panel
-   *When* I type "$450" into the Average Ticket field
-   *Then* the projected annual revenue updates.

### Requirement: Revenue Logic Engine
The system MUST calculate potential revenue recovery based on AI performance assumptions.

#### Scenario: Calculating "Recovered Revenue"
-   *Given* 10 missed calls, $500 ticket, and 20% booking rate (current)
-   *When* "AI Booking Rate" is set to 80%
-   *Then* the system displays the delta ($3,000 extra revenue/week).

### Requirement: State Persistence
Calculator state SHALL persist during the session or in local storage so data isn't lost on navigation.

#### Scenario: Navigating away and back
-   *Given* I have entered specific values
-   *When* I navigate to the Dashboard and return to ROI Projector
-   *Then* my values are still populated.
