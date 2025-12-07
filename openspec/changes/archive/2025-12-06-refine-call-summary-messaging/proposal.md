# Change: Refine Call Summary Messaging for Business Value Clarity

## Why

The current call summary UI successfully shows what happened, but the messaging hierarchy doesn't clearly communicate why an HVAC business owner should care. The dollar value is secondary to technical details, and the comparison with "missing the call" lacks emotional punch.

A prospect viewing this demo needs to instantly understand: **"This call was worth $450, and it would have gone to my competitor without AI."**

## What Changes

**Content hierarchy refinements only—no structural or styling changes:**

1. **Increase visual priority of call value**
   - Make `$450` larger and more dominant
   - Update subtitle to: `Booked revenue that would have gone to voicemail.`

2. **Update status text**
   - Replace `"Call Handled"` with `"Emergency Job Booked"`

3. **Modify emergency header section**
   - Remove/de-emphasize the active timer
   - Replace with static: `Handled in 47 seconds — no waiting.`

4. **Improve caller details formatting**
   - Format issue as bullet points: `No heat`, `Elderly homeowner`, `28°F outside`
   - Add green checkmark with: `Job successfully converted`

5. **Add AI message preview**
   - Show what the AI told the customer in a message bubble
   - Content: `"I'm sorry you're without heat — especially in this weather. I've dispatched our on-call technician. They'll text you shortly with an ETA."`

6. **Strengthen comparison text**
   - Replace current comparison with:
     - `Without AI: Missed call → voicemail → customer calls a competitor`
     - `With AI: Job booked + technician dispatched`

7. **Add monthly ROI metric**
   - Near "See Yearly Savings" button
   - Text: `Month-to-date recovered revenue: $8,760`

## Impact

- **Affected specs**: `voice-agent-demo` (call summary section)
- **Affected code**: `site/toolbox/src/app/demo/[trade]/page.tsx` (lines 405-512)
- **No breaking changes**: Layout, buttons, and dark mode styling remain unchanged
