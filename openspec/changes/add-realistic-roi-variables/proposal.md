# Change: Add Realistic ROI Calculator Variables

## Why
The current ROI calculator uses only 4 simplified inputs (missed calls, single ticket value, manual booking rate, AI booking rate). This creates a "black box" that prospects can easily dismiss as marketing fluff.

**The Problem:** When an HVAC owner sees "$50K in recovered revenue," they think "that's made up." There's no way to walk them through the logic or have them validate each assumption.

**The Opportunity:** A consultative ROI tool that breaks down their actual business reality:
- "How many calls do you get per week?"
- "Are you using voicemail or an answering service?"
- "What's an emergency job worth to you? And a routine service call?"

When the owner validates each assumption themselves, they can't dispute the final number. And when they see "Lost to Competitor: $47,000/year" for emergencies specifically, it hits different.

## What Changes

### New Input Variables

**Call Volume & Mix**
- Total inbound calls per week (not just "missed")
- % of calls that are emergencies vs. routine service (pre-filled with industry default ~25%, adjustable)
- % of calls currently missed (go to voicemail/unanswered)

**Ticket Economics (Split by Type)**
- Average emergency ticket value (default ~$650)
- Average routine service ticket value (default ~$350)

**Current Solution Performance**
- Current solution type (Voicemail, Answering Service, In-house Staff)
- Auto-fills typical booking rates based on selection:
  - Voicemail: ~30% emergency, ~40% service
  - Answering Service: ~50% emergency, ~60% service
  - In-house Staff: ~70% emergency, ~75% service
- Sliders available to adjust if they disagree with defaults
- Current monthly cost of solution (for net ROI comparison)

**AI Solution Performance**
- AI booking rates displayed (95% emergency, 85% service) - not adjustable, this is our claim
- SolidFrame cost inferred from call volume (binary: $299 or $499 based on 25 call threshold)

### New Calculations

- **Lost to Competitor (Emergencies):** Time-sensitive calls that go unanswered = lost to the next company that picks up. Labeled explicitly.
- **Slipping Away (Service):** Revenue lost from service calls that don't convert
- **Recovered by AI:** What SolidFrame captures that they're currently losing
- **Net Annual Gain:** (Recovered Revenue) - (SolidFrame Cost - Current Solution Cost)

### UX Flow (One Question at a Time)

A **guided questionnaire** where each question appears one at a time with a slider for ballpark answers:

1. **"How many calls does your business get per week?"** → Slider (10-100+)
2. **"What percentage of those calls go unanswered or to voicemail?"** → Slider (0-100%)
3. **"How do you currently handle missed calls?"** → Select (Voicemail / Answering Service / Staff)
4. **"What's your average emergency job worth?"** → Slider ($200-$1,500)
5. **"What about a routine service call?"** → Slider ($100-$800)
6. **Results reveal** with full breakdown

Each step feels conversational, not like filling out a form. Sliders make it feel like "ballpark" not "exact accounting."

### Results Display

- **Side-by-side comparison:** "Current State" vs. "With SolidFrame"
- **Emergency section:** Shows "Lost to Competitor" in red, "Recovered" in green
- **Service section:** Shows "Slipping Away" in orange, "Recovered" in green
- **Bottom line:** Net annual gain with cost comparison factored in

## Impact
- Affected specs: `roi-projector` (new capability, ADDED requirements)
- Affected code:
  - `site/toolbox/src/lib/hooks/use-roi-calculator.ts`
  - `site/toolbox/src/components/tools/roi/ROIControls.tsx`
  - `site/toolbox/src/components/tools/roi/ROIVisualization.tsx`
  - `site/toolbox/src/components/tools/roi/ROIReport.tsx`

## Non-Goals
- No complicated time-decay factors (callback time, after-hours %) - keep it head-to-head simple
- Not integrating with actual call data (manual input only)
- Not showing explicit pricing tiers (inferred from volume)
