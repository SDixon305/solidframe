## ADDED Requirements

### Requirement: One-at-a-Time Questionnaire Flow
The ROI calculator SHALL present inputs as a guided questionnaire where each question appears one at a time with a slider for ballpark answers.

#### Scenario: Questions appear sequentially
- **WHEN** the user starts the ROI calculator
- **THEN** the first question appears with its slider
- **AND** after answering, the next question animates in
- **AND** previous answers remain visible but secondary

#### Scenario: Slider-based answers feel approximate
- **WHEN** answering a question
- **THEN** a slider allows ballpark selection (not precise number entry)
- **AND** the current value displays prominently as the slider moves

#### Scenario: User can go back and adjust
- **WHEN** viewing later questions or results
- **THEN** the user can tap/click previous answers to adjust them
- **AND** results update immediately when values change

### Requirement: Call Volume and Mix Inputs
The ROI calculator SHALL capture call volume, missed call percentage, and emergency vs. service split with sensible defaults.

#### Scenario: User enters total weekly calls
- **WHEN** asked "How many calls does your business get per week?"
- **THEN** a slider ranges from 10 to 100+ calls
- **AND** default starts at a reasonable midpoint (e.g., 40)

#### Scenario: User enters missed call percentage
- **WHEN** asked "What percentage of those calls go unanswered or to voicemail?"
- **THEN** a slider ranges from 0% to 100%
- **AND** default suggests a typical rate (e.g., 30%)

#### Scenario: Emergency split uses industry default
- **WHEN** calculating results
- **THEN** the system assumes ~25% of calls are emergencies by default
- **AND** this default is visible and adjustable via an "Adjust assumptions" option

### Requirement: Current Solution Type with Auto-Fill
The ROI calculator SHALL ask about the current call-handling solution and auto-fill typical booking rates based on selection.

#### Scenario: User selects Voicemail
- **WHEN** the user selects "Voicemail" as their current solution
- **THEN** emergency booking rate auto-fills to ~30%
- **AND** service booking rate auto-fills to ~40%
- **AND** current monthly cost defaults to $0

#### Scenario: User selects Answering Service
- **WHEN** the user selects "Answering Service" as their current solution
- **THEN** emergency booking rate auto-fills to ~50%
- **AND** service booking rate auto-fills to ~60%
- **AND** a follow-up asks for monthly cost (default ~$200)

#### Scenario: User selects In-house Staff
- **WHEN** the user selects "In-house Staff" as their current solution
- **THEN** emergency booking rate auto-fills to ~70%
- **AND** service booking rate auto-fills to ~75%
- **AND** a follow-up asks for monthly cost

#### Scenario: User can adjust auto-filled rates
- **WHEN** booking rates are auto-filled
- **THEN** sliders allow adjustment if the user disagrees
- **AND** the UI indicates these are "typical" values they can customize

### Requirement: Split Ticket Value Inputs
The ROI calculator SHALL capture separate average ticket values for emergency jobs and routine service calls.

#### Scenario: User enters emergency ticket value
- **WHEN** asked "What's your average emergency job worth?"
- **THEN** a slider ranges from $200 to $1,500
- **AND** default starts at ~$550

#### Scenario: User enters service ticket value
- **WHEN** asked "What about a routine service call?"
- **THEN** a slider ranges from $100 to $800
- **AND** default starts at ~$295

### Requirement: AI Performance Display
The ROI calculator SHALL display AI booking rates as adjustable sliders with defaults and infer SolidFrame pricing from call volume.

#### Scenario: AI booking rates shown with adjustable sliders
- **WHEN** displaying the AI solution
- **THEN** emergency booking rate defaults to 95% with a slider (range 50-100%)
- **AND** service booking rate defaults to 85% with a slider (range 50-100%)
- **AND** users can adjust these to test conservative scenarios

#### Scenario: SolidFrame pricing inferred from volume
- **WHEN** total weekly calls are entered
- **THEN** the system uses $299/month if ≤25 calls/week
- **AND** uses $499/month if >25 calls/week
- **AND** pricing is factored into net ROI but not prominently displayed

### Requirement: Lost to Competitor Calculation
The ROI calculator SHALL calculate and prominently display emergency revenue lost to competitors due to unanswered calls.

#### Scenario: Emergency revenue labeled as lost to competitor
- **WHEN** displaying current state losses
- **THEN** emergency revenue loss is labeled "Lost to Competitor"
- **AND** styled in red to emphasize urgency
- **AND** the messaging implies: "When you don't answer, they call the next company"

#### Scenario: Service revenue labeled differently
- **WHEN** displaying current state losses for service calls
- **THEN** service revenue loss is labeled "Slipping Away"
- **AND** styled in orange (less urgent than emergencies)

### Requirement: Comprehensive ROI Calculation
The ROI calculator SHALL compute revenue impact separately for emergency and service calls, with net cost comparison.

#### Scenario: Split calculations performed
- **WHEN** all inputs are complete
- **THEN** the system calculates emergency revenue: missed_calls * emergency_pct * emergency_ticket * (1 - current_emergency_rate)
- **AND** calculates service revenue: missed_calls * service_pct * service_ticket * (1 - current_service_rate)

#### Scenario: AI recovery calculated
- **WHEN** calculating AI performance
- **THEN** emergency recovery uses the user-adjustable AI emergency booking rate (default 95%)
- **AND** service recovery uses the user-adjustable AI service booking rate (default 85%)
- **AND** the delta between current and AI is the "recovered" amount

#### Scenario: Net ROI includes cost comparison
- **WHEN** calculating final ROI
- **THEN** the system computes: (Annual Recovered Revenue) - (SolidFrame Annual Cost - Current Solution Annual Cost)
- **AND** displays monthly and annual net gain

### Requirement: Side-by-Side Results Display
The ROI calculator SHALL display results as a clear comparison between current state and AI state.

#### Scenario: Comparison table format
- **WHEN** viewing final results
- **THEN** a side-by-side view shows "Current State" vs. "With SolidFrame"
- **AND** emergency section shows: "Lost to Competitor" → "Recovered"
- **AND** service section shows: "Slipping Away" → "Recovered"

#### Scenario: Bottom line prominently displayed
- **WHEN** viewing final results
- **THEN** the net annual gain is prominently displayed
- **AND** monthly equivalent is also shown
- **AND** the calculation accounts for the cost difference between solutions
