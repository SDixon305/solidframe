# Design: Voice Agent Demo UX Enhancement

## Context

The voice agent demo at `/demo` is a critical sales tool. When we're on a discovery call with a trades business owner, we point them here to show—not tell—how AI handles their after-hours calls. The current implementation prioritizes technical aesthetics over business clarity.

**Stakeholders:**
- Sales team (needs a tool that closes deals)
- Trades business owners (need to "get it" in 30 seconds)
- Development team (needs clear implementation guidance)

**Constraints:**
- Frontend-only changes (no backend/Vapi integration yet)
- Must work with mock data until agent is trained
- Mobile-responsive (owners often on phone during demos)

## Goals / Non-Goals

### Goals
- Make the demo immediately understandable to non-technical users
- Create an emotional connection through personalization (business name)
- Show clear business value (time saved, money recovered, emergencies caught)
- Guide users naturally toward booking a call

### Non-Goals
- Actual Vapi integration (deferred to later phase)
- Admin/portal interfaces (separate concern)
- Multi-language support
- Backend API development

## Key Design Decisions

### Decision 1: Phone-Style UI vs Abstract Orb

**Chosen:** Hybrid approach—keep the orb but contextualize it within a phone UI

**Rationale:**
- The orb animation is well-built and visually distinctive
- But alone, it's confusing for non-technical users
- Solution: Frame the orb inside a "phone call" metaphor
  - Show incoming call screen first
  - Orb becomes the "active call" visualization
  - Familiar iconography (phone icons, mute button, speaker button)

**Alternatives considered:**
1. Full phone UI (realistic phone screen) — Too skeuomorphic, limits brand expression
2. Keep orb only — Current problem persists
3. Remove orb entirely — Loses visual interest

### Decision 2: When to Capture Business Name

**Chosen:** On trade selection page, before starting demo

**Rationale:**
- Creates investment before the demo starts
- Enables personalized greeting immediately
- Avoids interrupting the call flow

**Implementation:**
```
Trade Selection Page:
├── Heading: "Pick Your Trade"
├── Trade cards (HVAC, Plumbing, etc.)
├── On card click → Modal or inline input:
│   └── "What's your business name?"
│   └── Input: [Mike's Heating & Air]
│   └── Button: "Start Demo"
└── Navigate to /demo/[trade]?name=Mike's+Heating+%26+Air
```

### Decision 3: Call Flow Structure

**Chosen:** Three-act structure matching real call experience

**Act 1: The Ring (3 seconds)**
- Screen shows "Incoming Call"
- Business name displayed
- "11:47 PM" timestamp (always show late night for impact)
- User clicks "Answer" or auto-answers after 3s

**Act 2: The Conversation (30-45 seconds)**
- Split screen: Orb visualization (left) + Live transcript (right)
- Real-time indicators:
  - "Listening..." when customer speaks
  - "Thinking..." brief pause
  - "Responding..." when agent speaks
- Emergency detection badge appears when triggered
- Progress bar shows call duration

**Act 3: The Outcome (persists until dismissed)**
- Call summary card overlays/replaces call UI
- Shows:
  - Classification: "EMERGENCY" / "ROUTINE" / "SALES INQUIRY"
  - Customer name + issue captured
  - Action taken: "SMS sent to on-call technician"
  - Call value: "$450 emergency service call saved"
- CTA buttons:
  - "See Your Yearly Savings" → ROI calculator
  - "Book a Demo" → Calendly

### Decision 4: Copy/Language Framework

**Chosen:** Problem-Agitation-Solution framework in all copy

| Element | Current | Revised |
|---------|---------|---------|
| Page heading | "Choose Your Agent" | "Stop Missing Calls. Start Tonight." |
| Subheading | "Select a trade to deploy..." | "See how AI answers your after-hours calls—with your business name." |
| Trade card CTA | "Deploy Agent" | "Try It Now" |
| Call button | "Start Call" | "Simulate a Call" |
| Status badge | "SOLIDFRAME VOICE ENGINE 2.0" | "24/7 Virtual Receptionist" |

### Decision 5: Mobile Experience

**Chosen:** Stack layout with collapsible transcript

**Rationale:**
- Many demo sessions happen while owner is on their phone
- Full orb + transcript side-by-side doesn't fit
- Solution:
  - Orb and controls stack vertically
  - Transcript in collapsible drawer (swipe up to see)
  - Summary card is full-screen modal

## Component Architecture

```
/demo
├── page.tsx (Trade Selector)
│   ├── TradeCard.tsx (x4)
│   └── BusinessNameModal.tsx
│
└── /[trade]
    └── page.tsx
        ├── IncomingCallScreen.tsx (Act 1)
        ├── ActiveCallScreen.tsx (Act 2)
        │   ├── OrbVisualizer.tsx (existing, refined)
        │   ├── LiveTranscript.tsx
        │   └── EmergencyBadge.tsx
        └── CallSummary.tsx (Act 3)
```

## Mock Data Strategy

Until Vapi is connected, use curated mock transcripts per trade:

```typescript
const MOCK_SCENARIOS: Record<Trade, Scenario[]> = {
  hvac: [
    {
      title: "Emergency - No Heat",
      time: "11:47 PM",
      transcript: [...],
      classification: "EMERGENCY",
      customerName: "Margaret Wilson",
      issue: "No heat, elderly homeowner, 28°F outside",
      action: "SMS dispatched to John (on-call)",
      value: 450
    },
    // 2-3 scenarios per trade
  ],
  // ...
}
```

Rotate scenarios or let user pick for variety.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Business name input adds friction | Make it optional with default "Your Business" |
| Mock data feels fake | Use realistic scenarios based on HVAC landing page pain points |
| Users expect real call | Clear "Demo Mode" badge, explain it simulates what would happen |
| Mobile performance with animations | Test on low-end devices, reduce particle count if needed |

## Open Questions

1. **Should we auto-play or require click?**
   - Auto-play could be jarring; click-to-start gives control
   - Recommendation: Auto-play after 3 second countdown with skip option

2. **How many mock scenarios per trade?**
   - Recommendation: 3 (Emergency, Routine, Sales Inquiry) to show range

3. **Should ROI calculator pre-fill from demo context?**
   - Yes: Pass scenario value to calculator as starting point
   - "Based on this call type, here's your yearly projection..."
