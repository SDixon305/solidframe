## ADDED Requirements

### Requirement: Trade Selection with Business Personalization
The demo landing page SHALL allow users to select their trade (HVAC, Plumbing, Electrical, Roofing) and optionally enter their business name before starting the demo.

#### Scenario: User selects trade and enters business name
- **WHEN** user clicks on a trade card
- **THEN** a modal or inline input appears asking for their business name
- **AND** user can enter a name or skip with a default ("Your Business")
- **AND** clicking "Start Demo" navigates to the demo with the name preserved

#### Scenario: User skips business name
- **WHEN** user dismisses the name input without entering text
- **THEN** the demo proceeds with "Your Business" as the default name
- **AND** the agent greeting uses this default

---

### Requirement: Three-Act Call Flow Structure
The demo call experience SHALL follow a three-act structure: Incoming Call, Active Conversation, and Call Summary.

#### Scenario: Incoming call screen displays
- **WHEN** user arrives at `/afterhours-agent/[trade]` with business name
- **THEN** an incoming call screen displays showing:
  - Business name
  - Late-night timestamp (e.g., "11:47 PM")
  - "Answer" button
  - Optional: auto-answer countdown (3 seconds)

#### Scenario: Active call visualization
- **WHEN** user answers the call (or countdown completes)
- **THEN** the orb visualizer activates
- **AND** real-time status shows ("Listening...", "Responding...")
- **AND** transcript populates with mock conversation
- **AND** emergency badge appears if scenario is an emergency

#### Scenario: Call summary displays after conversation
- **WHEN** the mock transcript completes
- **THEN** a call summary card appears showing:
  - Call classification (Emergency/Routine/Sales Inquiry)
  - Customer name and issue captured
  - Action taken
  - Estimated call value
  - CTAs to ROI calculator and booking

---

### Requirement: Emergency Detection Visualization
The demo SHALL visually indicate when an emergency is detected during the call.

#### Scenario: Emergency detected mid-call
- **WHEN** the mock transcript includes emergency keywords
- **THEN** an emergency badge transitions from gray/hidden to red/visible
- **AND** the badge animates to draw attention
- **AND** the call summary reflects "EMERGENCY" classification

#### Scenario: Non-emergency call
- **WHEN** the mock transcript contains no emergency keywords
- **THEN** no emergency badge appears
- **AND** the call summary shows "ROUTINE" or "SALES INQUIRY" classification

---

### Requirement: Trades-Friendly Copy
All user-facing copy SHALL use language that resonates with trades business owners, avoiding technical jargon.

#### Scenario: Page headings use problem-focused language
- **WHEN** user views the demo landing page
- **THEN** headings focus on problems ("Stop Missing Calls") not technology ("Voice Engine 2.0")

#### Scenario: CTAs are action-oriented and clear
- **WHEN** user views buttons and links
- **THEN** labels are clear and non-technical (e.g., "Try It Now" not "Deploy Agent")

---

### Requirement: Call Value Display
The demo SHALL show the estimated dollar value of each simulated call to reinforce ROI.

#### Scenario: Call summary shows dollar value
- **WHEN** the call summary displays
- **THEN** it includes an estimated value (e.g., "This call is worth $450")
- **AND** the value corresponds to the scenario type (emergency = higher value)

#### Scenario: ROI calculator link passes context
- **WHEN** user clicks "See Your Yearly Savings" from call summary
- **THEN** they navigate to the ROI calculator
- **AND** the calculator pre-fills or references the demo call value

---

### Requirement: Mobile-Responsive Demo Experience
The demo SHALL be fully functional and visually appropriate on mobile devices.

#### Scenario: Mobile layout adjusts
- **WHEN** user views demo on a mobile device
- **THEN** the orb and transcript stack vertically
- **AND** the transcript is collapsible or in a bottom drawer
- **AND** touch targets meet minimum size requirements (44px)

#### Scenario: Call summary on mobile
- **WHEN** call summary displays on mobile
- **THEN** it renders as a full-screen modal
- **AND** CTAs are prominently displayed and tappable

---

### Requirement: Social Proof & Trust
The demo experience SHALL include social proof elements to build credibility with skeptical business owners.

#### Scenario: Trade selection page shows usage stats
- **WHEN** user views the trade selection page
- **THEN** a "Used by [Number] [Trade] companies" badge displays
- **AND** testimonial snippets are visible near the "Try It Now" call-to-actions

#### Scenario: Performance metrics displayed
- **WHEN** user views the demo entry point
- **THEN** key performance metrics like "Average response time: 0.8s" are visible
- **AND** these metrics reinforce the speed/reliability of the AI
