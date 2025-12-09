# voice-ai-landing Specification

## Purpose
Define the structure, content, and behavior of the conversion-optimized Voice AI landing page targeting trade business owners. This page serves as the primary destination for paid advertising campaigns promoting SolidFrame's Voice AI Agents for inbound call handling.

## ADDED Requirements

### Requirement: Page Structure and Routing
The Voice AI landing page SHALL be accessible at the `/voice-ai` route and follow the static landing page architecture pattern.

#### Scenario: Route configuration
- **WHEN** a user navigates to `solidframe.ai/voice-ai`
- **THEN** they are served the static HTML page from `site/voice-ai/index.html`

#### Scenario: Page registry
- **WHEN** the Voice AI landing page is deployed
- **THEN** it is listed in `site/pages.json` with route `/voice-ai`, folder `voice-ai`, and title "Voice AI Agents for Trade Businesses"

#### Scenario: Vercel routing
- **WHEN** the site is deployed to Vercel
- **THEN** `vercel.json` includes a rewrite rule mapping `/voice-ai` to `/voice-ai/index.html`

### Requirement: Accessibility and Readability
The landing page SHALL use high-contrast black text on white background with large, readable typography optimized for users 40+ years old.

#### Scenario: Color contrast
- **WHEN** the page is rendered
- **THEN** body text is black (#000000 or #1a1a1a) on white background (#ffffff)
- **AND** all text meets WCAG AA contrast ratio requirements (4.5:1 minimum for normal text)

#### Scenario: Typography sizing
- **WHEN** the page loads on desktop
- **THEN** body text is at least 18px
- **AND** H1 headings are at least 48px
- **AND** H2 headings are at least 36px
- **AND** H3 headings are at least 24px

#### Scenario: Mobile readability
- **WHEN** the page loads on mobile devices (< 768px width)
- **THEN** body text scales to at least 16px
- **AND** headings scale proportionally
- **AND** line-height is at least 1.6 for body text

### Requirement: Above the Fold Section
The hero section SHALL immediately establish credibility, communicate the value proposition, and provide a clear call-to-action.

#### Scenario: Results-based headline
- **WHEN** a visitor lands on the page
- **THEN** the H1 headline is results-focused and specific
- **AND** it avoids technical jargon or "AI-powered" fluff
- **AND** it quantifies the benefit (e.g., "Capture 40% More Emergency Calls")

#### Scenario: Initial social proof
- **WHEN** the hero section loads
- **THEN** it displays trust indicators above or near the headline
- **AND** trust indicators include either client count, industry leaders mention, or company logos

#### Scenario: Primary CTA placement
- **WHEN** the hero section is visible
- **THEN** a prominent "Book a Demo" or "Book Your Free Demo" button is displayed
- **AND** the button uses high-contrast colors for visibility
- **AND** the button is clickable and links to a Calendly booking page

#### Scenario: Technology logos
- **WHEN** the hero section displays trust indicators
- **THEN** logos of integration partners (ServiceTitan, Housecall Pro, Jobber, Field Edge) are shown
- **AND** logos are displayed in a horizontal row or grid
- **AND** logos are grayscale or muted colors to avoid distraction

### Requirement: Problem and Solution Section
The page SHALL clearly articulate the pain points of trade businesses and immediately pair them with the AI solution.

#### Scenario: Problem revelation
- **WHEN** a visitor scrolls past the hero
- **THEN** they encounter a section stating specific pain points
- **AND** pain points are relatable to trades (e.g., "Missed calls after hours", "Manual voicemail checking", "Lost emergency leads")

#### Scenario: Solution pairing
- **WHEN** the problem is stated
- **THEN** the solution is positioned directly adjacent (side-by-side on desktop, stacked on mobile)
- **AND** the solution addresses each stated pain point explicitly

#### Scenario: Specific solution focus
- **WHEN** the solution is described
- **THEN** it focuses exclusively on "Voice AI Agents for Inbound Call Handling"
- **AND** it does not mention chatbots, internal tools, or other unrelated services

### Requirement: Trade Industry Cards
The page SHALL highlight the four target trades (HVAC, Plumbing, Electrical, Roofing) with equal prominence.

#### Scenario: Four-trade showcase
- **WHEN** the solutions section is displayed
- **THEN** four cards or blocks represent HVAC, Plumbing, Electrical, and Roofing
- **AND** each card includes an icon or illustration representing that trade
- **AND** each card uses generic language applicable to all trades

#### Scenario: Equal visual weight
- **WHEN** the trade cards are rendered
- **THEN** all four cards have identical sizing and styling
- **AND** no single trade is visually prioritized over others

### Requirement: Benefits Section
The page SHALL emphasize measurable outcomes and business benefits rather than technical features.

#### Scenario: Benefit-focused content
- **WHEN** the benefits section is displayed
- **THEN** each benefit describes a business outcome (e.g., "Capture more emergency calls", "Never miss a high-value lead")
- **AND** benefits do NOT describe technical features (e.g., "GPT-4 powered", "Natural language processing")

#### Scenario: Measurable outcomes
- **WHEN** benefits are listed
- **THEN** at least two benefits include specific, quantifiable metrics
- **AND** metrics are realistic and credible (e.g., "40% more emergency calls", "3% missed call rate")

#### Scenario: Integration messaging
- **WHEN** benefits mention technology integrations
- **THEN** they emphasize "seamless integration" and "no need to switch systems"
- **AND** they reference specific tools by name (ServiceTitan, Housecall Pro, etc.)

#### Scenario: Implementation speed
- **WHEN** benefits describe timeline
- **THEN** they state fast implementation (e.g., "Go live in weeks, not months")
- **AND** they emphasize that no development team is needed

### Requirement: How It Works Section
The page SHALL display a simple three-step process that makes getting started appear effortless.

#### Scenario: Three-step process
- **WHEN** the "How It Works" section is displayed
- **THEN** exactly three steps are shown in sequential order
- **AND** steps are numbered (1, 2, 3)
- **AND** each step has a clear title and brief description

#### Scenario: Process simplicity
- **WHEN** the process steps are described
- **THEN** Step 1 is a simple action by the prospect (e.g., "Book a call with us")
- **AND** Steps 2 and 3 emphasize that SolidFrame handles the work (e.g., "We do the development", "We handle the maintenance")

#### Scenario: Effort minimization
- **WHEN** the process is presented
- **THEN** it conveys that the prospect's time investment is minimal
- **AND** it reassures that no technical knowledge is required

### Requirement: Social Proof and Case Studies
The page SHALL include credible testimonials and case studies with specific metrics to build trust.

#### Scenario: Chanin Air case study
- **WHEN** the social proof section is displayed
- **THEN** it features a case study for Chanin Air (owned by Ryan Chanin, Miami Beach)
- **AND** the case study includes at least two specific metrics (e.g., "43% increase in emergency call conversion", "12 additional jobs per month")
- **AND** the case study includes a quote or testimonial attributed to the client

#### Scenario: Metric specificity
- **WHEN** metrics are displayed in testimonials or case studies
- **THEN** they use precise numbers (e.g., "43%" not "increased calls")
- **AND** metrics are contextualized with timeframes (e.g., "in first 90 days")

#### Scenario: Outcome prioritization
- **WHEN** testimonials are presented
- **THEN** they focus on business outcomes achieved (not generic praise)
- **AND** they avoid making prospects feel like "lab rats" by showing proven results

### Requirement: Comparison Table (Old Way vs New Way)
The page SHALL include a side-by-side comparison highlighting traditional pain points versus the AI solution.

#### Scenario: Comparison structure
- **WHEN** a comparison table is included
- **THEN** it shows two columns: "Old Way" and "New Way"
- **AND** each row contrasts a traditional pain point with the AI solution
- **AND** the comparison uses simple, non-technical language

#### Scenario: Pain point emphasis
- **WHEN** the "Old Way" column is displayed
- **THEN** it lists specific, relatable frustrations (e.g., "Missed calls after hours", "Manual voicemail checking")
- **AND** uses red, gray, or muted colors to convey negativity

#### Scenario: Solution emphasis
- **WHEN** the "New Way" column is displayed
- **THEN** it lists corresponding AI-powered solutions (e.g., "24/7 AI answering", "Instant emergency routing")
- **AND** uses green or blue colors to convey positivity and improvement

### Requirement: FAQ Section
The page SHALL include a Frequently Asked Questions section that proactively addresses common objections.

#### Scenario: Objection handling
- **WHEN** the FAQ section is displayed
- **THEN** it includes at least 5 questions
- **AND** questions address common objections (e.g., pricing, setup complexity, integration requirements, data security)

#### Scenario: Concise answers
- **WHEN** an FAQ answer is displayed
- **THEN** it is no longer than 2-3 sentences
- **AND** it reassures the prospect without overwhelming detail

#### Scenario: CTA after FAQ
- **WHEN** a visitor reads the FAQ section
- **THEN** they encounter another "Book a Demo" CTA immediately after
- **AND** the CTA is visually consistent with previous CTAs

### Requirement: Call-to-Action Consistency
The page SHALL use a single, repeated call-to-action throughout all sections.

#### Scenario: CTA text consistency
- **WHEN** CTA buttons are displayed throughout the page
- **THEN** all buttons use identical or near-identical text (e.g., "Book Your Free Demo")
- **AND** the word "Free" is included to reduce cost objection

#### Scenario: CTA placement frequency
- **WHEN** the page is scrolled from top to bottom
- **THEN** at least 5 CTA buttons or links are encountered
- **AND** CTAs appear in hero, after problem/solution, after benefits, after process, and in final section

#### Scenario: CTA styling
- **WHEN** CTA buttons are rendered
- **THEN** they use high-contrast colors (e.g., blue or green on white background)
- **AND** they have sufficient padding and touch target size (minimum 44px height on mobile)
- **AND** they have hover and focus states for accessibility

### Requirement: Mobile Responsiveness
The page SHALL be fully functional and optimized for mobile devices.

#### Scenario: Mobile breakpoint
- **WHEN** the page is viewed on screens narrower than 768px
- **THEN** the layout switches to a single-column mobile view
- **AND** all sections stack vertically
- **AND** images and cards scale to fit the viewport width

#### Scenario: Touch targets
- **WHEN** the page is used on a touchscreen device
- **THEN** all interactive elements (buttons, links) are at least 44px in height and width
- **AND** there is adequate spacing between touch targets to prevent mis-taps

#### Scenario: Performance on mobile
- **WHEN** the page loads on a mobile device with 3G connection
- **THEN** the page becomes interactive within 5 seconds
- **AND** above-the-fold content is visible within 2 seconds

### Requirement: Performance and Load Time
The page SHALL load quickly to minimize bounce rate from paid advertising traffic.

#### Scenario: Page load time
- **WHEN** the page is accessed from a standard broadband connection
- **THEN** the full page loads in under 2 seconds
- **AND** First Contentful Paint occurs in under 1 second

#### Scenario: Asset optimization
- **WHEN** the page includes images and logos
- **THEN** all images are optimized (compressed PNGs or WebP)
- **AND** SVGs are used for logos and icons
- **AND** images below the fold use lazy loading

#### Scenario: Minimal dependencies
- **WHEN** the page HTML is inspected
- **THEN** it includes no JavaScript frameworks or libraries (React, Vue, etc.)
- **AND** it includes minimal or no external CSS frameworks
- **AND** it may include Google Analytics or similar tracking (optional)

### Requirement: SEO Optimization
The page SHALL be optimized for search engines to support organic discovery.

#### Scenario: Meta tags
- **WHEN** the page HTML is inspected
- **THEN** it includes a descriptive `<title>` tag containing primary keywords
- **AND** it includes a `<meta name="description">` tag summarizing the value proposition
- **AND** it includes Open Graph tags for social sharing

#### Scenario: Semantic HTML
- **WHEN** the page structure is analyzed
- **THEN** it uses semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- **AND** heading tags follow a logical hierarchy (H1 → H2 → H3)
- **AND** all images include descriptive `alt` attributes

#### Scenario: Structured data
- **WHEN** search engines crawl the page
- **THEN** the page MAY include JSON-LD structured data for Organization, Product, or Review schemas
- **AND** structured data is valid according to schema.org standards

### Requirement: Analytics and Tracking
The page SHALL support analytics tracking to measure conversion performance.

#### Scenario: Event tracking
- **WHEN** a visitor interacts with the page
- **THEN** key events are tracked (CTA clicks, scroll depth, time on page)
- **AND** events are sent to Google Analytics or equivalent

#### Scenario: UTM parameter preservation
- **WHEN** a visitor arrives via a URL with UTM parameters (e.g., `?utm_source=google&utm_campaign=hvac`)
- **THEN** those parameters are preserved in Calendly booking links
- **AND** campaign performance can be attributed to specific ads

#### Scenario: Privacy compliance
- **WHEN** analytics tracking is implemented
- **THEN** it complies with GDPR and CCPA requirements (if applicable)
- **AND** a privacy policy link is included in the footer
