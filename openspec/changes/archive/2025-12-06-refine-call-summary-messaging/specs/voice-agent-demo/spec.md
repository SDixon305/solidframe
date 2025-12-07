## ADDED Requirements

### Requirement: Business Value Messaging
The call summary UI SHALL prioritize business value messaging over technical details to clearly communicate ROI to trades business owners.

#### Scenario: Call value prominence
- **WHEN** the call summary is displayed
- **THEN** the dollar value SHALL be the most visually dominant element
- **AND** the subtitle SHALL read "Booked revenue that would have gone to voicemail."

#### Scenario: Status reflects business outcome
- **WHEN** a call is completed
- **THEN** the status text SHALL display "Emergency Job Booked" instead of "Call Handled"

### Requirement: Response Time Display
The call summary SHALL display response time as a static value emphasizing speed over showing an active timer.

#### Scenario: Static response time
- **WHEN** the call summary classification badge is displayed
- **THEN** it SHALL show "Handled in 47 seconds — no waiting." instead of an active timer

### Requirement: Structured Issue Display
The caller issue details SHALL be formatted for scanability with clear success indicators.

#### Scenario: Bullet-formatted issue
- **WHEN** caller issue details are displayed
- **THEN** the issue SHALL be formatted as bullet points (e.g., "No heat", "Elderly homeowner", "28°F outside")
- **AND** a green checkmark with "Job successfully converted" SHALL be shown

### Requirement: AI Message Preview
The call summary SHALL include a preview of the AI's customer-facing response.

#### Scenario: Message bubble display
- **WHEN** the call summary is displayed
- **THEN** a message bubble SHALL appear below the caller details
- **AND** it SHALL contain a sample of what the AI told the customer (e.g., "I'm sorry you're without heat — especially in this weather. I've dispatched our on-call technician. They'll text you shortly with an ETA.")

### Requirement: Value Comparison Messaging
The call summary SHALL include clear "with AI vs without AI" comparison text.

#### Scenario: Comparison text display
- **WHEN** the call summary is displayed
- **THEN** it SHALL show comparison text:
  - "Without AI: Missed call → voicemail → customer calls a competitor"
  - "With AI: Job booked + technician dispatched"

### Requirement: Monthly ROI Metric
The call summary SHALL display a cumulative month-to-date revenue metric.

#### Scenario: Month-to-date display
- **WHEN** the call summary is displayed
- **THEN** text SHALL appear near the CTA button reading "Month-to-date recovered revenue: $8,760"
