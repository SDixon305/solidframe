# Tasks: Enhance Voice Agent Demo UX

## 1. Copy & Language Overhaul
- [x] 1.1 Update `/demo/page.tsx` heading from "Choose Your Agent" to trades-friendly copy
- [x] 1.2 Replace "SOLIDFRAME VOICE ENGINE 2.0" badge with "24/7 AI RECEPTIONIST"
- [x] 1.3 Replace "Deploy Agent" CTA with "Hear It In Action"
- [x] 1.4 Update trade card descriptions to focus on problems solved, not features
- [x] 1.5 Remove "System: v2.4-Turbo" from call page, replace with "Trained for [Trade]"

## 2. Business Name Personalization
- [x] 2.1 Create BusinessNameModal inline in page.tsx with input field
- [x] 2.2 Update trade card click to show modal before navigation
- [x] 2.3 Pass business name via URL param to `/demo/[trade]`
- [x] 2.4 Update mock transcript first message to include business name
- [x] 2.5 Display business name prominently on call screen

## 3. Call Flow Enhancement (Three-Act Structure)
- [x] 3.1 Create incoming call phase with ring animation and "Answer" button
- [x] 3.2 Add timestamp display ("11:47 PM") to create urgency context
- [ ] 3.3 Add auto-answer countdown (3 seconds) with skip option (deferred)
- [x] 3.4 Transition animation from incoming → active call

## 4. Active Call UI Improvements
- [x] 4.1 Add real-time status indicators ("Listening...", "Understanding...", "Responding...")
- [x] 4.2 Create EmergencyBadge that appears when emergency detected in transcript
- [x] 4.3 Add familiar phone controls (mute icon, speaker icon)
- [x] 4.4 Improve orb context with dynamic icons (Mic, Volume2, MessageSquare)
- [x] 4.5 Add call duration timer

## 5. Call Summary (Post-Call Experience)
- [x] 5.1 Create call summary phase in page component
- [x] 5.2 Display call classification (Emergency/Routine/Sales Inquiry) with color coding
- [x] 5.3 Show captured customer info and issue summary
- [x] 5.4 Display "Action Taken" (e.g., "SMS sent to on-call technician")
- [x] 5.5 Show estimated call value ("This call is worth $450")
- [x] 5.6 Add CTA: "See Your Yearly Savings" → ROI calculator with context
- [x] 5.7 Add CTA: "Book a Demo" → Calendly link

## 6. Mock Data Enhancement
- [x] 6.1 Create realistic scenarios per trade (Emergency, Routine for HVAC/Plumbing, Emergency for Electrical, Sales for Roofing)
- [x] 6.2 Include customer names, specific issues, and dollar values
- [x] 6.3 Add emergency detection triggers tied to transcript content
- [x] 6.4 Ensure scenarios reflect HVAC landing page pain points (after-hours, missed calls)

## 7. Mobile Responsiveness
- [x] 7.1 Stack orb and controls vertically on mobile (default behavior)
- [x] 7.2 Add transcript drawer at bottom on mobile
- [x] 7.3 Call summary is scrollable full-page on mobile
- [ ] 7.4 Test touch targets and font sizes (pending manual testing)

## 8. Visual Polish
- [x] 8.1 Add phone iconography to call screens (Phone, PhoneOff icons)
- [x] 8.2 Refine color palette for emergency/routine/inquiry states
- [x] 8.3 Add micro-animations for status transitions
- [x] 8.4 Ensure dark theme consistency

## 9. Testing & Validation
- [ ] 9.1 Test full flow on desktop (Chrome, Safari, Firefox)
- [ ] 9.2 Test full flow on mobile (iOS Safari, Android Chrome)
- [x] 9.3 Verify business name persists through entire flow (via URL param)
- [x] 9.4 Validate ROI calculator link passes context correctly

## 10. Social Proof Implementation (Deferred)
- [ ] 10.1 Add "Used by X companies" dynamic badge to Trade Selector
- [ ] 10.2 Create `TestimonialCarousel.tsx` for Trade Selector page
- [ ] 10.3 Add technical performance stats (e.g. "0.8s response time") to reassure quality
- [ ] 10.4 Gather or generate 3 strong testimonials for the initial implementation
