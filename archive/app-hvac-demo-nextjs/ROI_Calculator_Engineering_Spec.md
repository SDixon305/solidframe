Here is the **full, developer-ready specification** for the ROI Calculator app — written so your engineering team can build it with zero ambiguity. This is *the* document you hand to your frontend engineer + backend engineer + designer. Every field, formula, state, and interaction is spelled out.

I’ll keep it clean, organized, and production authoritative — no fluff, no sales tone.

---

# **AFTER-HOURS ROI CALCULATOR — ENGINEERING SPEC (v1.0)**

**Platform:** Web (React / Next.js recommended)
**Rendering:** Client-side calculation (instant), optional server-side PDF generation
**Grid:** 2-column layout (Left = inputs, Right = outputs)

---

# 1. **GLOBAL STRUCTURE**

### **Components**

* `<Header />`
* `<InputPanel />` (Current State + Provider Inputs)
* `<AIScenarioPanel />` (AI Assumptions)
* `<OperationalMetricsPanel />` (Badges)
* `<ComparisonPanel />` (Outputs)
* `<TranscriptModal />`
* `<AssumptionsDrawer />`
* `<ExportPDFButton />`

### **State Layers**

Everything stored in a single top-level state object:

```
{
  missedCallsPerWeek,
  emergencyPercent,
  avgEmergencyRevenue,
  avgNextDayRevenue,
  currentCallbackRatePercent,
  providerType,
  providerCosts: { onCallMonthly, flatMonthly, minutesPerWeek, ratePerMinute },
  aiAssumptions: {
    captureRate,
    emergencyBookingRate,
    nextDayBookingRate,
    callForwardingEnabled,
    ringStrategy,
  },
  aiMonthlyCost,
  conservativeModeEnabled
}
```

All calculations derive **only** from this object.

---

# 2. **INPUT DEFINITIONS (USER-EDITABLE)**

## **2.1. Missed Calls**

`missedCallsPerWeek`: integer
**Range:** 0–500
**Default:** 5
UI: Slider + numeric input.

## **2.2. Emergency Percent**

`emergencyPercent`: integer percent
**Range:** 0–100
**Default:** 40

## **2.3. Avg Emergency Revenue**

`avgEmergencyRevenue`: currency
**Range:** 50–5000
**Default:** 350

## **2.4. Avg Next-Day Revenue**

`avgNextDayRevenue`: currency
**Range:** 50–5000
**Default:** 250

## **2.5. Current Callback Booking Rate**

`currentCallbackRatePercent`: integer percent
**Range:** 0–90
**Default:** 30

---

# 3. **CURRENT PROVIDER FIELDS**

## **3.1. Provider Type**

`providerType`: enum
Options:

* `"voicemail"`
* `"in_house_on_call"`
* `"third_party_flat"`
* `"call_center_per_min"`

Default: `"voicemail"`

## **3.2. Provider Costs (conditional)**

### A) In-house on-call:

```
providerCosts.onCallMonthly   (default: 600)
```

### B) Third-party flat:

```
providerCosts.flatMonthly     (default: 450)
```

### C) Call center per minute:

```
providerCosts.minutesPerWeek  (default: 120)
providerCosts.ratePerMinute   (default: 0.90)
```

### D) Voicemail:

Cost = 0

---

# 4. **AI ASSUMPTIONS (EDITABLE DEFAULTS)**

All percentages stored as decimals internally (UI shows %).

```
aiAssumptions.captureRate            (default 0.95)
aiAssumptions.emergencyBookingRate   (default 0.95)
aiAssumptions.nextDayBookingRate     (default 0.80)
aiAssumptions.callForwardingEnabled  (boolean)
aiAssumptions.ringStrategy           ("ring_until_answered" | "ring_then_sms" | "fallback_secondary")
```

**Conservative mode:**
If conservativeModeEnabled = true:
Subtract **0.10** absolute from each AI booking rate (min 0.10).

---

# 5. **AI SUBSCRIPTION COST**

`aiMonthlyCost`: currency
Default: 1500

---

# 6. **DERIVED METRICS (CALCULATIONS)**

**NOTE: Always convert % → decimal.**
Ex: `emergencyPercent = 40%` → `0.40`.

Define local shorthand:

```
MCW = missedCallsPerWeek
E  = emergencyPercent
NE = (1 - E)

ER = avgEmergencyRevenue
NR = avgNextDayRevenue

CB  = currentCallbackRatePercent
AIc = aiAssumptions.captureRate
AIe = aiAssumptions.emergencyBookingRate
AIn = aiAssumptions.nextDayBookingRate

W2M = 4.33     // weeks per month
```

---

## **6.1. Weekly Missed Calls Split**

```
missedEmergenciesWeekly    = MCW * E
missedNonEmergenciesWeekly = MCW * (1 - E)
```

---

## **6.2. Current Weekly Recovered Revenue**

```
currentRecoveredWeekly =
    (missedEmergenciesWeekly * ER * CB)
  + (missedNonEmergenciesWeekly * NR * CB)
```

---

## **6.3. Current Weekly Potential Revenue (if everything converted)**

```
currentPotentialWeekly =
    (missedEmergenciesWeekly * ER)
  + (missedNonEmergenciesWeekly * NR)
```

---

## **6.4. Current Weekly Leakage**

```
currentLeakageWeekly =
    currentPotentialWeekly - currentRecoveredWeekly
```

---

## **6.5. AI Weekly Recovered Revenue**

```
aiRecoveredWeekly =
    (missedEmergenciesWeekly * ER * AIe)
  + (missedNonEmergenciesWeekly * NR * AIn)
```

---

## **6.6. Incremental Weekly Benefit**

```
incrementalWeeklyRecovered =
    aiRecoveredWeekly - currentRecoveredWeekly
```

---

## **6.7. Monthly Conversions**

```
currentRecoveredMonthly      = currentRecoveredWeekly * W2M
aiRecoveredMonthly           = aiRecoveredWeekly * W2M
incrementalRecoveredMonthly  = incrementalWeeklyRecovered * W2M
```

---

## **6.8. Provider Monthly Cost Calculation**

```
switch (providerType):

  case "voicemail":
    providerMonthlyCost = 0

  case "in_house_on_call":
    providerMonthlyCost = providerCosts.onCallMonthly

  case "third_party_flat":
    providerMonthlyCost = providerCosts.flatMonthly

  case "call_center_per_min":
    providerMonthlyCost = providerCosts.minutesPerWeek * providerCosts.ratePerMinute * W2M
```

---

## **6.9. Operational Savings**

```
operationalSavingsMonthly =
    providerMonthlyCost - aiMonthlyCost
```

(negative = extra expense)

---

## **6.10. Monthly Net Gain**

```
monthlyNetGain =
    incrementalRecoveredMonthly + operationalSavingsMonthly
```

---

## **6.11. Annual Net Gain**

```
annualNetGain = monthlyNetGain * 12
```

---

## **6.12. Annual ROI**

```
annualROI = (annualNetGain / (aiMonthlyCost * 12)) * 100
```

If aiMonthlyCost = 0 → ROI = "N/A".

---

## **6.13. Payback Period**

If you have setup fee `setupCost` (optional):

```
paybackMonths = setupCost / monthlyNetGain
paybackDays   = paybackMonths * 30
```

If no setupCost:

* If monthlyNetGain > 0: show “Immediate”.
* If < 0: show “No payback”.

---

# 7. **SECONDARY METRICS (OPERATIONS)**

## 7.1. Estimated Unnecessary Dispatch Reduction

Simplified version (no CRM integration):

```
unnecessaryDispatchesPerMonth =
    missedEmergenciesWeekly * W2M * (1 - AIe)
```

## 7.2. Estimated Tech Dispatches Saved

```
techDispatchesSavedMonthly =
    missedEmergenciesWeekly * W2M * (CB - AIe)
```

## 7.3. Data Availability

Always boolean:

```
dataLogsAvailable = true
```

---

# 8. **UI REQUIREMENTS**

## 8.1. Input Side (Left Column)

* Current State card
* Provider card (conditional field rendering)
* AI Scenario card
* Operational badges row
* Assumptions Drawer toggle

Spacing: 24px vertical, 48px padding around.

## 8.2. Output Side (Right Column)

**Comparison Panel (Sticky)**
Values must display in this exact order:

```
Monthly revenue currently lost
Monthly revenue recovered by AI
Monthly operational savings
Monthly net gain (largest font)
Annual net gain
Annual ROI %
Payback period
```

## 8.3. CTA buttons

Bottom of output card:

* **Show transcript sample**
* **Export PDF**

---

# 9. **CONSERVATIVE MODE**

If `conservativeModeEnabled == true`:

```
AIe = max(0.10, AIe - 0.10)
AIn = max(0.10, AIn - 0.10)
```

Reload calculations automatically.

---

# 10. **PDF EXPORT SPEC**

The export should include:

### Inputs block

All entered values with labels.

### Derived block

* currentRecoveredMonthly
* aiRecoveredMonthly
* incrementalRecoveredMonthly
* operationalSavingsMonthly
* monthlyNetGain
* annualNetGain
* annualROI
* paybackPeriod

### Storyline block

Add this exact text:

> "AI picks up instantly, detects emergencies in real time, calls your on-call tech in the background, collects the customer’s name/address, and connects both parties seamlessly. This ensures nearly 100% capture of true emergency revenue."

### Timestamp

UTC + local timezone.

---

# 11. **ERROR HANDLING**

* Negative revenues → floor at 0, show tooltip.
* Missing provider cost → red border + “required for this provider type”.
* ROI division by zero → show “N/A”.
* If monthlyNetGain < 0 → color red + text “Net monthly loss”.

---

# 12. **PERFORMANCE REQUIREMENT**

* Each slider/input update must re-render outputs in under **16ms** (60fps constraint).
* All calculations client-side.
* PDF generation server-side or client-side via `html2pdf`.

---

# 13. **TEST CASES**

### Test Case A – Defaults

Input:

```
5 missed calls
40% emergencies
$350 ER
$250 NR
30% callback
Provider: voicemail
AI rates 95/95/80
AI cost: $1500
```

Expected:

* Monthly net gain ≈ $2,541
* Annual ROI ≈ 169%
* Payback = Immediate

### Test Case B – No emergencies (0%)

Verify emergency math collapses to next-day scenario only.

### Test Case C – 0 callback rate

Everything should flow to leakage.

### Test Case D – Provider more expensive than AI

OperationalSavingsMonthly should be positive.

### Test Case E – Conservative mode

AI booking rates reduce by 10%, everything recalculates.

---

# **End of v1.0 Spec**

