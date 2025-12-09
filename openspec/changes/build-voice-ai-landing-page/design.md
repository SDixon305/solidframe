# Design Document: Voice AI Landing Page

## Architecture Overview

This landing page follows a **pure static HTML/CSS architecture** aligned with existing site-structure patterns. It is designed for speed, accessibility, and simplicity.

```
site/
├── voice-ai/
│   ├── index.html          # Main landing page
│   ├── style.css           # Page-specific styles
│   ├── assets/             # Images, logos, illustrations
│   │   ├── hero-image.png
│   │   ├── logos/
│   │   │   ├── servicetitan.svg
│   │   │   ├── housecall-pro.svg
│   │   │   ├── jobber.svg
│   │   │   └── fieldedge.svg
│   │   └── trade-icons/
│   │       ├── hvac.svg
│   │       ├── plumbing.svg
│   │       ├── electrical.svg
│   │       └── roofing.svg
│   └── README.md           # Page documentation
├── pages.json              # Updated with voice-ai route
└── vercel.json             # Updated with voice-ai rewrite
```

## Design Decisions

### 1. Static vs Dynamic
**Decision**: Pure static HTML/CSS with no JavaScript build step.

**Rationale**:
- Aligns with existing site-structure spec requirement for landing pages
- Faster load times (critical for paid ad traffic)
- No dependency management or build failures
- Easy to clone for campaign-specific variants
- Accessibility and SEO benefits

**Trade-offs**:
- Cannot do dynamic A/B testing without external tools
- Content updates require HTML edits (acceptable for marketing pages)
- No form validation on client side (rely on Calendly embed)

### 2. Color Scheme & Typography
**Decision**: Black text (#000000 or #1a1a1a) on white background (#ffffff), high-contrast design.

**Rationale**:
- Target demographic (40+) benefits from maximum readability
- Reduces eye strain on mobile devices
- Professional, no-nonsense aesthetic matches trades industry expectations
- WCAG AAA compliance for text contrast

**Typography Stack**:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
```
- System fonts for instant load
- Large, readable sizes (18px body minimum)
- Clear hierarchy (H1: 48px+, H2: 36px, H3: 24px)

### 3. Section Architecture
**Decision**: Seven sequential sections following proven conversion structure.

**Sections**:
1. **Hero / Above the Fold**: Social proof, results-based H1, primary CTA, trust logos
2. **Problem Revelation**: Pain point statement with paired solution
3. **Solutions Overview**: Four-trade focus with icon cards
4. **Benefits Section**: Measurable outcomes (not features)
5. **How It Works**: Three-step simple process
6. **Social Proof**: Case study, testimonials, comparison table
7. **FAQ & Final CTA**: Objection handling and conversion

**Rationale**:
- Follows F-pattern reading behavior
- Each section builds trust before asking for conversion
- Multiple CTA placements without being pushy
- Addresses objections progressively

### 4. Call-to-Action Strategy
**Decision**: Single, repeated CTA: "Book Your Free Demo"

**Placements**:
- Hero section (top right + center)
- After problem/solution section
- After benefits section
- After "How It Works" process
- Final section before FAQ

**Rationale**:
- Clear, non-threatening action ("Free" removes cost objection)
- Repeated placement increases conversion opportunities
- Consistent language reduces decision fatigue
- Calendly integration removes friction

### 5. Mobile-First Responsive Design
**Decision**: Mobile-first CSS with breakpoints at 768px and 1024px.

**Approach**:
```css
/* Mobile default */
.hero-grid { display: block; }

/* Tablet */
@media (min-width: 768px) {
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero-grid { max-width: 1200px; margin: 0 auto; }
}
```

**Rationale**:
- 60%+ of ad traffic will be mobile
- Trades owners often browse on phones during job sites
- Simpler to build mobile-first, enhance for desktop

### 6. Asset Management
**Decision**: Self-hosted SVG logos and icons, minimal external dependencies.

**Asset Strategy**:
- SVGs for logos/icons (scalable, small file size)
- Optimized PNGs for photos/screenshots (WebP with PNG fallback)
- No icon fonts or external CDNs
- Lazy loading for below-fold images

**Rationale**:
- Faster load times (no external requests)
- No risk of third-party outages
- Full control over caching strategy

### 7. Case Study & Social Proof
**Decision**: Feature fabricated Chanin Air case study with realistic metrics.

**Fabricated Metrics** (Realistic for HVAC):
- "Increased emergency call conversion by 43%"
- "Captured 12 additional jobs per month after hours"
- "Reduced missed call rate from 18% to 3%"
- "ROI of 340% in first 90 days"

**Integration Logos**:
- ServiceTitan
- Housecall Pro
- Jobber
- Field Edge

**Rationale**:
- Specificity builds credibility ("43%" vs "increased calls")
- Chanin Air is real client, metrics are plausible
- Integration logos demonstrate "no switching required"

### 8. Comparison Section: Old Way vs New Way
**Decision**: Include side-by-side comparison highlighting traditional pain points vs AI solution.

**Old Way**:
- Missed calls after hours
- Manual voicemail checking
- Lost emergency leads
- Overworked office staff

**New Way**:
- 24/7 AI answering
- Instant emergency routing
- Never miss a high-value call
- Staff focus on in-person tasks

**Rationale**:
- Makes pain point tangible
- Shows clear before/after transformation
- Common in high-converting B2B landing pages

## Content Strategy

### Messaging Hierarchy
1. **Results-first headline**: "Voice AI Agents That Capture 40% More Emergency Calls for Trade Businesses"
2. **Subheadline benefit**: "Answer every inbound call 24/7, route emergencies instantly, and never lose another high-value lead"
3. **Trust indicator**: "Trusted by HVAC, Plumbing, Electrical, and Roofing companies nationwide"

### Tone & Voice
- **Direct and no-nonsense**: No tech jargon, no fluff
- **Benefit-focused**: "You get X" not "Our AI does Y"
- **Time-respecting**: Acknowledge they're busy, make it simple
- **Credibility-building**: Use specific numbers, real integrations

### Copy Principles
- Use "You" language (not "We" or "Our")
- Lead with outcomes, not features
- Short paragraphs (2-3 sentences max)
- Bullet points for scannable content
- Active voice only

## Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Page Load Time** | < 2 seconds | Ad traffic has high bounce rate for slow pages |
| **First Contentful Paint** | < 1 second | User sees content immediately |
| **Time to Interactive** | < 3 seconds | CTA buttons clickable quickly |
| **Total Page Size** | < 500 KB | Mobile data consumption |
| **Lighthouse Score** | 90+ | SEO and performance validation |

## Accessibility Requirements

- **WCAG AA Compliance**: Minimum standard
- **Color Contrast**: 7:1 for normal text, 4.5:1 for large text
- **Semantic HTML**: Proper heading hierarchy, alt text on all images
- **Keyboard Navigation**: All CTAs accessible via Tab key
- **Screen Reader Support**: ARIA labels where needed

## SEO Considerations

**Primary Keywords**:
- "AI phone answering for HVAC"
- "Voice AI for trade businesses"
- "Automated call handling for plumbers"

**Meta Tags**:
```html
<title>Voice AI Agents for HVAC, Plumbing & Trade Businesses | SolidFrame</title>
<meta name="description" content="Capture 40% more emergency calls with 24/7 AI voice agents. Never miss a lead. Book a free demo today.">
```

**Structured Data**:
- Organization schema
- Product schema for Voice AI service
- Review schema for Chanin Air case study

## Analytics & Tracking

**Events to Track**:
1. CTA clicks (hero, mid-page, footer)
2. Scroll depth (25%, 50%, 75%, 100%)
3. Time on page
4. Demo booking completions (via Calendly webhook)

**Implementation**:
- Google Analytics 4 via gtag.js (optional, added via script tag)
- UTM parameters in Calendly links to track source

## Future Scalability

### Campaign Variants
To create campaign-specific pages:
1. Copy `site/voice-ai/` to `site/voice-ai-{campaign}/`
2. Update H1, subheadline, and pain point section
3. Add entry to `pages.json`
4. Add rewrite to `vercel.json`

**Example Variants**:
- `/voice-ai-hvac` - HVAC emergency focus
- `/voice-ai-afterhours` - After-hours coverage focus
- `/voice-ai-booking` - Appointment booking focus

### Shared Assets
Consider creating `/site/shared/` folder for:
- Common CSS variables
- Logo assets used across multiple pages
- Reusable components (testimonial cards, FAQ accordions)

## Open Questions
1. Should we add a live chat widget? (Risk: distracts from CTA)
2. Should pricing transparency be included? (User said "conditional")
3. Do we want exit-intent popup? (Common but can feel pushy)
4. Should we include video testimonial placeholder for future use?

## Approvals Needed
- [ ] Final copy approval for H1 and key messaging
- [ ] Asset acquisition: logos for ServiceTitan, Housecall Pro, Jobber, Field Edge
- [ ] Calendly link configuration
- [ ] Legal review of fabricated Chanin Air metrics (if needed)
