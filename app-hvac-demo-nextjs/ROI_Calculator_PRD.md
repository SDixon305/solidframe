# ROI Calculator Master Spec

## Overview
A 3-column ROI calculator that compares the "Current State" of missed calls vs an "AI Triage Scenario".

## Visual Reference
Based on the "After-Hours Revenue ROI Calculator" screenshot.

## Layout
- **Header**: Dark blue background. Title: "After-Hours Revenue ROI Calculator". Subtitle explaining the value. "Export PDF" button.
- **Main Content**: 3 Columns.
    1.  **Current State** (Inputs)
    2.  **AI Triage Scenario** (Inputs/Defaults)
    3.  **Comparison** (Results - Dark Card)

## Inputs & Logic

### Column 1: Current State
*User inputs their current situation.*

1.  **Missed after-hours calls per week**
    -   Type: Slider + Number Input
    -   Range: 1 - 100
    -   Default: 5
    -   *Variable*: `weeklyMissedCalls`

2.  **% of after-hours calls that are emergencies**
    -   Type: Number Input (Percentage)
    -   Default: 40%
    -   *Variable*: `emergencyRate`

3.  **Average emergency revenue**
    -   Type: Currency Input
    -   Default: $350
    -   *Variable*: `avgEmergencyRev`

4.  **Average next-day revenue**
    -   Type: Currency Input
    -   Default: $250
    -   *Variable*: `avgNextDayRev`

5.  **% successfully booked next morning** (Current callback booking %)
    -   Type: Number Input (Percentage)
    -   Default: 15% (Estimated, as it's not filled in screenshot but implied)
    -   *Variable*: `callbackBookingRate`

6.  **Current after-hours provider**
    -   Type: Dropdown
    -   Options: "None (Voicemail)", "Answering Service", "Call Center"
    -   Default: "None (Voicemail)"
    -   *Variable*: `currentProvider`

**Bottom Metrics (Column 1)**:
-   "Avg tech dispatch saved per month": Calculated based on AI filtering bad leads? Or just a static estimate?
    -   *Logic*: Maybe 20% of calls are "nuisance" or "unnecessary"? Let's assume `monthlyCalls * 0.2`.
-   "Estimated fewer unnecessary dispatches": Similar to above.

### Column 2: AI Triage Scenario
*Assumptions about AI performance.*

1.  **AI pick-up (capture) rate**
    -   Type: Slider
    -   Default: 95%
    -   *Variable*: `aiCaptureRate`

2.  **AI booking rate for emergencies**
    -   Type: Slider
    -   Default: 95%
    -   *Variable*: `aiEmergencyBookingRate`

3.  **AI booking rate for next-day (non-emergency)**
    -   Type: Slider
    -   Default: 80%
    -   *Variable*: `aiNextDayBookingRate`

4.  **Call-forwarding enabled**
    -   Type: Toggle
    -   Default: True

**Buttons**: "Show transcript sample", "Export PDF"

### Column 3: Comparison (Results)
*Dark Blue Card*

1.  **Monthly revenue currently lost**
    -   *Logic*:
        -   `monthlyCalls` = `weeklyMissedCalls` * 4.33
        -   `emergencies` = `monthlyCalls` * `emergencyRate`
        -   `nonEmergencies` = `monthlyCalls` * (1 - `emergencyRate`)
        -   `currentRevenue` = (`nonEmergencies` * `callbackBookingRate` * `avgNextDayRev`) + (`emergencies` * 0) (Assuming missed emergencies are lost)
        -   `potentialRevenue` = (`emergencies` * `avgEmergencyRev`) + (`nonEmergencies` * `avgNextDayRev`)
        -   `lostRevenue` = `potentialRevenue` - `currentRevenue`

2.  **Monthly revenue recovered by AI**
    -   *Logic*:
        -   `aiRevenue` = (`emergencies` * `aiCaptureRate` * `aiEmergencyBookingRate` * `avgEmergencyRev`) + (`nonEmergencies` * `aiCaptureRate` * `aiNextDayBookingRate` * `avgNextDayRev`)
        -   `recoveredRevenue` = `aiRevenue` - `currentRevenue` (This is the "Net Gain" really, but the screenshot labels might be using different semantics. Let's use `aiRevenue` - `currentRevenue` as the primary "Gain" metric).
        -   *Correction based on screenshot*: Screenshot shows "Recovered" ($1415) > "Lost" ($1225). This implies "Recovered" might just be `aiRevenue` (Total generated), OR the "Lost" calculation is conservative.
        -   Let's stick to: `Recovered` = `aiRevenue` - `currentRevenue`.

3.  **Monthly operational savings**
    -   *Logic*: If `currentProvider` == "Answering Service" ($300/mo) - AI Cost ($100/mo).
    -   Default to $0 if "None".

4.  **Monthly net gain**
    -   `recoveredRevenue` + `operationalSavings`.

5.  **Annual net gain**
    -   `monthlyNetGain` * 12.

6.  **Annual ROI**
    -   (`AnnualNetGain` / `AnnualCostOfAI`) * 100.
    -   Need an assumption for AI Cost. Let's assume $299/mo or similar? Or just leave as a high percentage.

## Styling
-   Use `bg-slate-900` for the header and comparison card.
-   Use `text-emerald-400` for positive money numbers.
-   Use `text-white` for text on dark backgrounds.
-   Clean, modern sliders.
