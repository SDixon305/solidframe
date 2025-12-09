# Implementation Tasks: Build Voice AI Landing Page

## Phase 1: Foundation & Structure

### Task 1: Create landing page directory structure
- Create `site/voice-ai/` folder
- Create `site/voice-ai/assets/` folder for images
- Create `site/voice-ai/assets/logos/` subfolder for integration logos
- Create `site/voice-ai/assets/trade-icons/` subfolder for HVAC/Plumbing/Electrical/Roofing icons
- Create placeholder `site/voice-ai/README.md` documenting page purpose and structure

**Validation**: Directory structure exists and matches design.md architecture

### Task 2: Update routing configuration
- Add Voice AI entry to `site/pages.json` with route `/voice-ai`, folder `voice-ai`, title "Voice AI Agents for Trade Businesses"
- Add rewrite rule to `site/vercel.json`: `{ "source": "/voice-ai", "destination": "/voice-ai/index.html" }`
- Verify no routing conflicts with existing pages

**Validation**: pages.json and vercel.json updated correctly, no JSON syntax errors

## Phase 2: HTML Structure

### Task 3: Create base HTML structure
- Create `site/voice-ai/index.html` with semantic HTML5 structure
- Add `<head>` section with meta tags:
  - Charset, viewport, title, description
  - Open Graph tags for social sharing
  - Favicon link (reuse existing solidframe.ai favicon)
- Add semantic elements: `<header>`, `<main>`, `<footer>`
- Set up proper heading hierarchy (single H1, multiple H2s, H3s for subsections)

**Validation**: HTML validates with W3C validator, semantic structure is logical

### Task 4: Build hero / above-the-fold section
- Create hero section with two-column grid (content + visual placeholder)
- Add trust indicator badge or text (e.g., "Trusted by 50+ trade businesses")
- Add H1 with results-based headline: "Voice AI Agents That Capture 40% More Emergency Calls for Trade Businesses"
- Add subheadline paragraph with benefit statement
- Add primary CTA button linking to Calendly (placeholder URL for now)
- Add integration logos row (ServiceTitan, Housecall Pro, Jobber, Field Edge)

**Validation**: Hero section displays all required elements, CTA is prominent and clickable

### Task 5: Build problem revelation section
- Create section with heading "The Challenge Facing Trade Businesses"
- Add two-column layout: "Old Way" vs "New Way" comparison
- Old Way: List 4 pain points (Missed calls, Manual processes, Lost leads, Overworked staff)
- New Way: List 4 corresponding solutions (24/7 AI, Instant routing, Capture every lead, Staff efficiency)
- Add visual distinction (red/gray for old, green/blue for new)

**Validation**: Problem/solution pairing is clear, comparison is visually distinct

### Task 6: Build four-trade showcase section
- Create section with heading "Built for HVAC, Plumbing, Electrical & Roofing"
- Add four equal-sized cards in a grid (2x2 on mobile, 4x1 on desktop)
- Each card includes: trade icon (placeholder), trade name, 1-2 sentence description
- Use generic language applicable to all trades (e.g., "Never miss emergency calls during peak season")

**Validation**: Four cards displayed equally, generic language used, responsive layout works

### Task 7: Build benefits section
- Create section with heading "Real Results for Your Business"
- Add 4-6 benefit blocks with icons and descriptions
- Benefits focus on outcomes: "Capture More Emergency Calls", "Free Up Office Staff", "Seamless Integration", "Go Live in Weeks"
- Include at least 2 specific metrics (e.g., "40% increase in captured calls", "3% missed call rate")
- Add secondary CTA button at end of section

**Validation**: Benefits are outcome-focused, metrics are specific, CTA is present

### Task 8: Build "How It Works" section
- Create section with heading "Getting Started is Simple"
- Add three numbered steps in horizontal layout (stack on mobile)
- Step 1: "Book a Call" - Simple discovery call
- Step 2: "We Build Your Agent" - Custom development by SolidFrame
- Step 3: "We Handle Maintenance" - Ongoing support included
- Add visual numbering or step indicators

**Validation**: Three steps are clear, process appears effortless, layout is responsive

### Task 9: Build social proof section
- Create section with heading "Proven Results"
- Add Chanin Air case study card with:
  - Company name, owner name, location (Chanin Air, Ryan Chanin, Miami Beach)
  - 2-3 specific metrics (e.g., "43% increase in emergency call conversion", "12 additional jobs/month", "340% ROI in 90 days")
  - Quote or testimonial (fabricated but realistic)
- Add 2-3 additional testimonial cards (generic or placeholders)
- Add tertiary CTA button at end

**Validation**: Case study includes specific metrics, testimonials are credible, CTA present

### Task 10: Build FAQ section
- Create section with heading "Frequently Asked Questions"
- Add at least 5 FAQ items addressing:
  1. Pricing and cost structure
  2. Setup time and complexity
  3. Integration with existing systems (ServiceTitan, etc.)
  4. Data security and privacy
  5. Customization options
- Use accordion or simple expand/collapse pattern (can be CSS-only initially)
- Add final CTA button at end

**Validation**: 5+ FAQs present, answers are concise, objections are addressed

### Task 11: Build footer section
- Create footer with three columns (or stack on mobile):
  - Column 1: Logo and tagline
  - Column 2: Quick links (Home, HVAC Demo, Privacy Policy, Terms)
  - Column 3: Contact info (Email, Phone, Address)
- Add copyright notice and "Built by SolidFrame.ai" attribution
- Add social media icons (optional, if available)

**Validation**: Footer contains all standard elements, links are valid or placeholder

## Phase 3: Styling

### Task 12: Create base CSS stylesheet
- Create `site/voice-ai/style.css`
- Add CSS reset or normalize
- Define CSS custom properties (variables) for:
  - Colors: black text (#1a1a1a), white background (#ffffff), CTA color (blue or green)
  - Typography: font-family (system fonts), font-sizes for headings and body
  - Spacing: consistent padding/margin scale (e.g., 1rem, 2rem, 4rem)
  - Breakpoints: mobile (<768px), tablet (768px-1024px), desktop (>1024px)
- Link stylesheet in index.html `<head>`

**Validation**: CSS file exists, variables defined, no syntax errors

### Task 13: Style typography for readability
- Set body text to 18px (desktop) and 16px (mobile) minimum
- Set H1 to 48px (desktop), scale down to 36px (mobile)
- Set H2 to 36px (desktop), scale down to 28px (mobile)
- Set H3 to 24px (desktop), scale down to 20px (mobile)
- Set line-height to 1.6 for body text, 1.2 for headings
- Use system font stack for instant load and readability

**Validation**: Text is readable, sizes are appropriate, line-height improves readability

### Task 14: Style hero section for impact
- Create two-column grid for hero (60% content, 40% visual on desktop)
- Style H1 with bold weight, ample margin
- Style CTA button with high-contrast color, padding (16px vertical, 32px horizontal)
- Add hover state for CTA button
- Make hero responsive: stack columns on mobile, center text
- Style integration logos row: grayscale filter, equal sizing, horizontal layout

**Validation**: Hero section is visually impactful, CTA stands out, responsive layout works

### Task 15: Style comparison section
- Create side-by-side layout for Old Way vs New Way (stack on mobile)
- Add background colors or borders: red/gray for Old Way, green/blue for New Way
- Style pain points as bulleted or icon list
- Ensure equal visual weight on both sides

**Validation**: Comparison is visually clear, color coding reinforces message

### Task 16: Style trade cards
- Create 4-column grid on desktop, 2-column on tablet, 1-column on mobile
- Add card styling: border or subtle shadow, padding, hover effect
- Ensure icons are centered and sized appropriately
- Add equal spacing between cards

**Validation**: Cards are visually balanced, grid is responsive, hover effects work

### Task 17: Style benefits section
- Create grid layout for benefit blocks (2-3 columns on desktop, 1-2 on tablet, 1 on mobile)
- Add icons or visual indicators for each benefit
- Highlight metrics with larger font size or bold weight
- Style secondary CTA button consistently with primary

**Validation**: Benefits are scannable, metrics stand out, CTA is consistent

### Task 18: Style "How It Works" process
- Create horizontal layout for three steps (stack on mobile)
- Add large, prominent step numbers (1, 2, 3)
- Add connecting lines or arrows between steps (optional)
- Ensure steps have equal visual weight

**Validation**: Process is visually clear, steps are easy to follow

### Task 19: Style social proof section
- Create card layout for case study and testimonials
- Add subtle background color or border to differentiate cards
- Highlight metrics within case study (bold, larger font, or color)
- Add quotation marks or styling for testimonial quotes
- Style tertiary CTA button consistently

**Validation**: Social proof is credible and visually distinct, CTA is consistent

### Task 20: Style FAQ section
- Create simple expand/collapse styling (if using accordions)
- Style questions as bold or larger font
- Style answers as regular body text
- Add dividers between FAQ items
- Ensure final CTA button is prominent

**Validation**: FAQs are easy to read, answers are concise, CTA stands out

### Task 21: Style footer
- Create responsive column layout (3 columns on desktop, stack on mobile)
- Use smaller font size (14-16px) for footer content
- Style links with hover states
- Add subtle background color to differentiate from main content
- Ensure footer doesn't compete visually with main CTAs

**Validation**: Footer is functional but unobtrusive, links work

## Phase 4: Assets & Content

### Task 22: Acquire or create integration logos
- Obtain SVG or PNG logos for: ServiceTitan, Housecall Pro, Jobber, Field Edge
- Optimize and save to `site/voice-ai/assets/logos/`
- If official logos unavailable, use text-based badges or defer to placeholders
- Add alt text for each logo in HTML

**Validation**: Logos display correctly, file sizes optimized, alt text present

### Task 23: Create or source trade icons
- Obtain or create icons for: HVAC (thermostat/wrench), Plumbing (pipe/wrench), Electrical (lightning/plug), Roofing (house/shingles)
- Save as SVG to `site/voice-ai/assets/trade-icons/`
- Ensure icons have consistent style and sizing
- Add alt text or ARIA labels in HTML

**Validation**: Icons display correctly, consistent style, accessible

### Task 24: Write final copy for all sections
- Finalize H1 headline (results-based, specific)
- Write subheadline and hero paragraph
- Write problem/solution comparison copy
- Write benefit descriptions with metrics
- Write "How It Works" step descriptions
- Write Chanin Air case study with fabricated metrics
- Write FAQ questions and answers
- Proofread all copy for clarity, grammar, and tone

**Validation**: Copy is clear, benefit-focused, free of jargon, proofread

### Task 25: Configure Calendly integration
- Obtain Calendly booking URL for demo calls
- Replace all CTA button placeholder URLs with actual Calendly link
- Add UTM parameters to Calendly URL for tracking (e.g., `?utm_source=voice-ai-landing`)
- Test Calendly link opens correctly in new tab

**Validation**: All CTAs link to Calendly, UTM parameters present, link works

## Phase 5: Optimization & Testing

### Task 26: Optimize for performance
- Compress all images (logos, icons, photos) to reduce file size
- Use WebP format with PNG fallback for photos (if applicable)
- Add lazy loading attribute to below-the-fold images: `loading="lazy"`
- Minify CSS (optional, can defer to deployment)
- Test page load time: target < 2 seconds on broadband, < 5 seconds on 3G

**Validation**: Images optimized, lazy loading added, load time meets targets

### Task 27: Ensure mobile responsiveness
- Test page on mobile device or browser dev tools (375px, 768px, 1024px widths)
- Verify all sections stack correctly on mobile
- Verify touch targets (buttons, links) are at least 44px height/width
- Verify text is readable without zooming
- Fix any layout issues

**Validation**: Page is fully functional on mobile, no layout breaks, touch targets adequate

### Task 28: Validate accessibility
- Run page through WAVE or Lighthouse accessibility audit
- Verify color contrast meets WCAG AA (4.5:1 for normal text)
- Verify all images have alt text
- Verify heading hierarchy is logical (H1 → H2 → H3)
- Verify keyboard navigation works for all interactive elements
- Add ARIA labels where needed

**Validation**: Accessibility audit passes, WCAG AA met, keyboard navigation works

### Task 29: Test SEO optimization
- Verify `<title>` tag is descriptive and includes primary keywords
- Verify `<meta name="description">` summarizes value proposition
- Verify Open Graph tags present for social sharing
- Verify semantic HTML is used (`<header>`, `<main>`, `<section>`, `<footer>`)
- Run Lighthouse SEO audit
- Add JSON-LD structured data (optional, if time permits)

**Validation**: Meta tags present, semantic HTML used, Lighthouse SEO score 90+

### Task 30: Add analytics tracking (optional)
- Add Google Analytics 4 tracking code to `<head>` (if desired)
- Set up event tracking for CTA clicks, scroll depth, time on page
- Verify analytics tracking fires correctly (use GA debugger or browser console)
- Document tracking implementation in README.md

**Validation**: Analytics tracking implemented and functional (if included)

## Phase 6: Deployment & Verification

### Task 31: Deploy to Vercel staging
- Commit changes to git: `git add site/voice-ai site/pages.json site/vercel.json`
- Create descriptive commit message
- Push to GitHub: `git push origin main`
- Verify Vercel auto-deploys the changes
- Check deployment logs for errors

**Validation**: Changes committed and pushed, Vercel deployment succeeds

### Task 32: Verify production deployment
- Visit `solidframe.ai/voice-ai` in browser
- Verify page loads correctly
- Verify all sections render properly
- Verify all CTAs link to Calendly correctly
- Verify mobile responsiveness on actual mobile device

**Validation**: Page is live and functional on production URL

### Task 33: Run final quality checks
- Run Lighthouse audit (Performance, Accessibility, SEO, Best Practices)
- Verify performance score 90+
- Verify accessibility score 90+
- Verify SEO score 90+
- Fix any critical issues flagged by Lighthouse

**Validation**: Lighthouse scores meet targets, no critical issues

### Task 34: Share with stakeholders for feedback
- Share production URL with team/stakeholders
- Document any feedback or requested changes
- Prioritize feedback into immediate fixes vs. future enhancements
- Create follow-up tasks if needed

**Validation**: Stakeholder review completed, feedback documented

### Task 35: Document page and create clone guide
- Update `site/voice-ai/README.md` with:
  - Page purpose and target audience
  - Key conversion metrics to track
  - Instructions for updating copy
  - Instructions for cloning page for campaign variants
- Document in main project README or wiki (if applicable)

**Validation**: README.md is comprehensive, cloning process documented

---

## Summary
- **Total Tasks**: 35
- **Estimated Effort**: 2-3 days for experienced developer
- **Deliverables**:
  - Fully functional landing page at `/voice-ai`
  - Responsive design (mobile, tablet, desktop)
  - Accessibility-compliant (WCAG AA)
  - SEO-optimized
  - Performance-optimized (< 2s load time)
  - Deployed to production
