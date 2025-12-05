# Dashboard

## Purpose
Real-time call monitoring dashboard and interactive ROI calculator for demonstrating value to HVAC business prospects.

## Requirements

### Requirement: Real-Time Call Display
The system SHALL display incoming calls in real-time with live status updates via Supabase subscriptions.

#### Scenario: New call appears
- **WHEN** new call received by system
- **THEN** call card appears on dashboard immediately

#### Scenario: Call status updates
- **WHEN** call status changes (in-progress, completed, emergency flagged)
- **THEN** dashboard updates without page refresh

### Requirement: Call Card Display
The system SHALL display call information in card format with priority indicators, transcript preview, and duration.

#### Scenario: Emergency call card
- **WHEN** displaying emergency call
- **THEN** card shows emergency indicator styling and priority badge

#### Scenario: Standard call card
- **WHEN** displaying standard call
- **THEN** card shows standard styling with caller info and summary

#### Scenario: Transcript scrolling
- **WHEN** call transcript exceeds card height
- **THEN** transcript section scrollable within card

### Requirement: ROI Calculator
The system SHALL provide an interactive ROI calculator demonstrating value proposition with customizable call metrics.

#### Scenario: Default calculation
- **WHEN** user loads ROI calculator
- **THEN** display calculation with sample industry averages

#### Scenario: Custom inputs
- **WHEN** user adjusts call volume, conversion rate, or average job value
- **THEN** ROI calculation updates in real-time

#### Scenario: Pricing tier display
- **WHEN** call volume ≤25 calls/week
- **THEN** show $299/month pricing tier

#### Scenario: Higher volume pricing
- **WHEN** call volume >25 calls/week
- **THEN** show $500/month pricing tier

### Requirement: Responsive Design
The system SHALL display properly across desktop, tablet, and mobile devices using Tailwind responsive breakpoints.

#### Scenario: Mobile view
- **WHEN** viewport width <640px
- **THEN** single-column layout with stacked cards

#### Scenario: Desktop view
- **WHEN** viewport width ≥1024px
- **THEN** multi-column layout with side-by-side components
