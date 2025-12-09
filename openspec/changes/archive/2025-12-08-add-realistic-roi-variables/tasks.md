# Tasks

## 1. Update Data Model and Hook
- [x] 1.1 Extend `ROIInputs` interface with new fields:
  - `totalCallsPerWeek` (replaces missedCallsPerWeek as base)
  - `missedCallPercent` (0-100)
  - `emergencyPercent` (default 25%)
  - `solutionType` (Voicemail | AnsweringService | InHouseStaff)
  - `currentMonthlyCost`
  - `currentEmergencyBookingRate`
  - `currentServiceBookingRate`
  - `emergencyTicketValue`
  - `serviceTicketValue`
- [x] 1.2 Add `SolutionType` type and default booking rates map
- [x] 1.3 Extend `ROIResults` interface with split calculations:
  - `emergencyLostToCompetitor` (annual)
  - `serviceLostSlippingAway` (annual)
  - `emergencyRecovered` (annual)
  - `serviceRecovered` (annual)
  - `solidFrameCost` (annual, inferred from volume)
  - `netAnnualGain`
- [x] 1.4 Update `useROICalculator` hook with new calculation logic
- [x] 1.5 Add pricing tier logic (≤25 calls = $299, >25 = $499)

## 2. Build Questionnaire UI
- [x] 2.1 Create `ROIQuestionnaire` component with step-by-step flow
- [x] 2.2 Implement question 1: "How many calls per week?" (slider 10-100+)
- [x] 2.3 Implement question 2: "What % go unanswered?" (slider 0-100%)
- [x] 2.4 Implement question 3: "How do you handle missed calls?" (select with icons)
- [x] 2.5 Implement question 4: "Average emergency job worth?" (slider $200-$1,500)
- [x] 2.6 Implement question 5: "Routine service call?" (slider $100-$800)
- [x] 2.7 Add smooth transitions between questions (framer-motion)
- [x] 2.8 Show previous answers collapsed/secondary as user progresses
- [x] 2.9 Allow clicking previous answers to go back and adjust

## 3. Implement Auto-Fill Logic
- [x] 3.1 When solution type changes, auto-fill booking rates:
  - Voicemail: 30% emergency, 40% service, $0 cost
  - Answering Service: 50% emergency, 60% service, $200 cost
  - In-house Staff: 70% emergency, 75% service, prompt for cost
- [x] 3.2 Add optional "Adjust assumptions" expandable section
- [x] 3.3 Include emergency % default (25%) in assumptions section

## 4. Update Results Visualization
- [x] 4.1 Create side-by-side comparison layout (Current vs. SolidFrame)
- [x] 4.2 Emergency section with "Lost to Competitor" label (red styling)
- [x] 4.3 Service section with "Slipping Away" label (orange styling)
- [x] 4.4 Recovered amounts in green
- [x] 4.5 Bottom line: Net annual gain prominently displayed
- [x] 4.6 Monthly equivalent shown below annual

## 5. Update PDF Report
- [x] 5.1 Update PDF template with all new inputs
- [x] 5.2 Add "Lost to Competitor" and "Slipping Away" sections
- [x] 5.3 Include side-by-side comparison in PDF
- [x] 5.4 Add assumptions summary (solution type, emergency %, etc.)

## 6. Testing and Polish
- [x] 6.1 Test calculation accuracy with edge cases
- [x] 6.2 Verify localStorage persistence with new fields
- [x] 6.3 Test mobile responsiveness of questionnaire flow
- [x] 6.4 Ensure PDF generates correctly with all new data

## 7. UI Refinements (2025-12-07)
- [x] 7.1 Update default ticket values: emergency $550, service $295
- [x] 7.2 Make AI booking rates adjustable via sliders (50-100% range)
- [x] 7.3 Add `aiEmergencyBookingRate` and `aiServiceBookingRate` to ROIInputs interface
- [x] 7.4 Restructure visualization to 2x2 grid layout:
  - Row 1: Current Solution selector (left) | SolidFrame AI with sliders (right)
  - Row 2: "You're Losing" result (left) | "AI Captures More" result (right)
- [x] 7.5 Move solution selector buttons into ROIVisualization component
- [x] 7.6 Update localStorage key to v4 to force fresh defaults with new fields
- [x] 7.7 Merge localStorage with defaults to handle missing fields gracefully
