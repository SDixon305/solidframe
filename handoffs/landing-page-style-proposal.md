# Handoff: Landing Page Style & Pizazz Proposal

## Context

We've redesigned the SolidFrame.ai main landing page (`site/home/index.html` and `site/home/style.css`) with a trades-industry focus. The structure and messaging are now in place:

- **Hero:** "Built for the Trades" label, headline, subhead, CTA button
- **Verticals:** Four trade icons (HVAC, Plumbing, Roofing, Electrical) with SVG icons
- **How It Works:** 3-step process
- **Toolbox:** 6 automation feature tiles
- **Results:** Testimonial + metrics
- **Final CTA:** "Let's Accelerate Your Business"

## Current Design

- Light background (#FFFFFF) with gray alternating sections (#F5F7FA)
- Orange accent color (#FF6B35)
- Inter font family
- Clean, minimal, ServiceTitan-inspired aesthetic
- Mobile responsive

## What We Need

**A proposal for adding style and pizazz to make the page more visually engaging and memorable.** The page works structurally but feels a bit flat/generic.

### Areas to Consider

1. **Hero section** - Could use more visual impact. Consider:
   - Background imagery or patterns
   - Subtle animations on load
   - More dynamic layout

2. **Trade icons** - Currently simple SVG strokes. Consider:
   - Icon backgrounds/containers
   - Hover effects
   - More distinctive styling

3. **Section transitions** - Currently just flat color changes. Consider:
   - Diagonal cuts / angled sections
   - Subtle gradients
   - Visual dividers

4. **Feature tiles** - Plain white cards. Consider:
   - Icons for each feature
   - Hover animations
   - Visual hierarchy improvements

5. **Social proof / Results section** - Could be more impactful. Consider:
   - Animated counters for metrics
   - More prominent testimonial styling
   - Trust badges or logos

6. **Micro-interactions** - Currently minimal. Consider:
   - Button hover effects
   - Scroll-triggered animations
   - Subtle parallax

### Constraints

- Must maintain trades-industry aesthetic (not tech-startup futuristic)
- Keep it professional - avoid gimmicks
- Performance matters - no heavy libraries
- Mobile-first responsive
- Accessibility (contrast, motion preferences)

### Deliverable

Provide a proposal document outlining:
1. Specific visual enhancements recommended
2. Priority order (high impact vs nice-to-have)
3. Any new dependencies or assets needed
4. Rough implementation approach

Do NOT implement yet - just propose. We'll review and approve before coding.

## Files to Review

- `site/home/index.html` - Current HTML structure
- `site/home/style.css` - Current styles
- Preview at `http://localhost:3333` (if server running)
