# Change: Redesign Main Landing Page with Trades-Focused Positioning

## Why

The current solidframe.ai homepage is product-focused, selling a specific "AI Dispatcher" with pricing tiers, feature lists, and beta access CTAs. This approach:

- Limits the audience to HVAC only (ignores plumbers, roofers, electricians)
- Leads with price and features before establishing trust
- Feels transactional rather than consultative
- Doesn't convey confidence in what SolidFrame can deliver

The new positioning should communicate: "We are specialists who only work with trades businesses. We're so confident in what we do that we offer a free 20-minute discovery call—once you see the possibilities, you'll want to work with us."

## What Changes

### Messaging Overhaul
- **FROM:** "Stop Losing Revenue to Missed Calls" (product pitch)
- **TO:** "We Make Trades Businesses Better, Faster, and More Profitable" (partner positioning)

### Target Audience Expansion
- **FROM:** HVAC-only messaging
- **TO:** Explicit support for HVAC, Plumbers, Roofers, Electricians

### CTA Transformation
- **FROM:** "Get Beta Access" / pricing tiers / lead capture form
- **TO:** Single confident CTA: "Book Your Free 20-Minute Discovery Call"

### Content Structure
- **REMOVE:** Pricing section, feature grid, stats about missed calls, FAQ
- **ADD:** Clear statement of who we serve, what we do, and the discovery call offer
- **ADD:** Confidence-building messaging ("we know once you see what's possible...")

### Page Simplification
- Strip down from 7 sections to ~3 focused sections:
  1. Hero with bold positioning statement
  2. Who we serve + what we do (brief)
  3. Discovery call CTA with calendar booking

## Impact

- **Affected specs:** `site-structure` (homepage content and purpose)
- **Affected code:** `site/home/index.html`, `site/home/style.css`
- **User experience:** Completely different first impression—consultative partner vs product vendor
- **Lead flow:** Shifts from form submission to calendar booking for discovery calls
- **Calendar integration:** Calendly link: https://calendly.com/seth-solidframe/ai-discovery-call
