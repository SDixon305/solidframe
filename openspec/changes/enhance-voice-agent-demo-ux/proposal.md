# Proposal: Enhance Voice Agent Demo UX for Trades Business Owners

## Why

The current demo is built for developers and "sci-fi nerds"—it uses technical jargon like "Deploy Agent," "v2.4-Turbo," and "SOLIDFRAME VOICE ENGINE 2.0." A trades business owner who's curious about AI but skeptical won't connect with this. They don't care about the technology; they care about **missed calls costing them money** and **getting their nights back**.

This is our closing tool. When we're on a call with a prospect who's bleeding revenue from after-hours missed calls, we need to show them—in 30 seconds—exactly how this solves their problem. The current demo fails that test.

## The Business Owner Persona

**Mike, 52, owns "Mike's Heating & Air"**
- 8 trucks, $2.5M revenue, runs ServiceTitan
- Gets 15-20 after-hours calls/week, misses ~40% of them
- His phone rings at dinner, on weekends, at 2 AM
- He's heard about "AI" but thinks it's either hype or too complicated
- He'll give you 60 seconds before deciding "this isn't for me"

**What Mike needs to see:**
1. "This sounds like a real person answering MY phone"
2. "It knows my business—HVAC, not some generic robot"
3. "It can tell an emergency from a routine request"
4. "I can see exactly what happened without listening to recordings"
5. "How much is this actually saving me?"

## Critical Gaps in Current Demo

### 1. **Language is Tech-Forward, Not Trade-Forward**
| Current (Wrong) | Should Be |
|-----------------|-----------|
| "SOLIDFRAME VOICE ENGINE 2.0" | "Your 24/7 Virtual Receptionist" |
| "Deploy Agent" | "Hear It In Action" |
| "System: v2.4-Turbo" | "Trained for [HVAC] businesses" |
| "Choose Your Agent" | "Pick Your Trade" |
| "specialized voice model trained on industry-specific scenarios" | "Answers like your best dispatcher" |

### 2. **No Immediate Value Demonstration**
- Owner lands on page → sees abstract orbs → has to click → wait → figure out what's happening
- Should: Immediately show a call playing, let them hear the voice, see the transcript, feel the "aha"

### 3. **Missing Business Context**
Current demo shows:
- Generic orb animation
- Transcript with no context

Should show:
- "It's 11:47 PM. A customer just called."
- Call classification: "EMERGENCY - No heat, elderly homeowner"
- What happened: SMS sent to on-call tech, callback scheduled
- Dollar impact: "This call is worth $450. Without AI, you'd have missed it."

### 4. **No Personalization Hook**
- No way to enter business name
- No way to hear "Thanks for calling Mike's Heating & Air"
- Missing the "holy shit, that's my business" moment

### 5. **The Orb is Cool But Confusing**
- Trades owners don't know what the orb means
- No phone iconography, no familiar call UI
- Need something that looks like "a call is happening" not "a portal is opening"

### 6. **No Outcome Visualization**
After the call ends, nothing happens. Should show:
- Call summary card
- Emergency classification with color coding
- "Action taken: Dispatched to John (On-call tech)"
- Link to ROI calculator with pre-filled values

## What Changes

### Phase 1: Language & Framing Overhaul
- Replace all developer jargon with trades-friendly copy
- Add scenario context ("It's 2 AM. Your phone would be ringing.")
- Trade selector becomes "I run a [HVAC/Plumbing/Electrical/Roofing] business"

### Phase 2: Business Personalization
- Add "Your Business Name" input field before call
- Agent greets with their actual business name
- Show their name in transcript and summary

### Phase 3: Call Experience Enhancement
- Replace abstract orb with phone-style UI (incoming call screen → active call)
- Add real-time status: "Listening..." → "Understanding..." → "Responding..."
- Show emergency detection live: badge changes from gray to red when emergency detected

### Phase 4: Outcome & Value Display
- Post-call summary card with:
  - Call classification (Emergency/Routine/Sales Inquiry)
  - Customer info captured
  - Action taken (or would be taken)
  - Estimated value of call
- "See your yearly savings" button → ROI calculator with pre-filled data

### Phase 5: Social Proof & Trust
- Add testimonial snippets from beta users
- "Used by 47 HVAC companies" (when true)
- "Average response time: 0.8 seconds"

## Impact

- **Affected code**: `site/toolbox/src/app/demo/`, `site/toolbox/src/app/demo/[trade]/`
- **New components needed**: `CallSimulator.tsx`, `CallSummary.tsx`, `BusinessNameInput.tsx`
- **Spec changes**: New `voice-agent-demo` capability spec

## Success Criteria

1. A trades owner can understand what this does within 10 seconds of landing
2. They can hear a demo call with their business name within 30 seconds
3. After the demo, they see a dollar value tied to the capability
4. The path to "Book a Call" is obvious and emotionally motivated
