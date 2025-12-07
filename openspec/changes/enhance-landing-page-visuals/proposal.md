# Change: Enhance Landing Page Visual Design

## Why

The main landing page structure and messaging are complete, but the design feels flat and generic. The current aesthetic is clean but lacks the visual energy needed to make a memorable first impression. The page needs "pizazz" to stand out while maintaining a professional trades-industry feel.

## What Changes

### High Priority (High Impact, Low Effort)

1. **Hero Background Treatment**
   - Add subtle gradient overlay (warm tones: orange → amber)
   - Optional: diagonal/angled bottom edge instead of flat transition

2. **Trade Icons Enhancement**
   - Add circular background containers with subtle border
   - Scale-up hover effect with slight rotation
   - Soft box-shadow on hover

3. **Button Micro-interactions**
   - Add subtle scale + shadow on hover
   - Slight "press" effect on click

4. **Section Transitions**
   - Angled/diagonal dividers between sections (CSS clip-path)
   - Subtle gradient backgrounds instead of flat alternating colors

### Medium Priority (Moderate Impact)

5. **Toolbox Feature Tiles**
   - Add icons for each feature (inline SVG, matches trade icon style)
   - Left-aligned icon with text layout
   - Border-left accent color on hover

6. **Results/Metrics Section**
   - Animated number counters (count up on scroll into view)
   - Larger, bolder metric values
   - Quote styling with large decorative quotation marks

7. **Step Numbers**
   - Connected with a subtle line/path between them
   - Pulse animation on the active/hovered step

### Lower Priority (Nice-to-Have)

8. **Scroll-triggered Fade-in Animations**
   - Elements fade/slide in as they enter viewport
   - Use CSS `@keyframes` + Intersection Observer (vanilla JS)
   - Respect `prefers-reduced-motion`

9. **Parallax-lite Effect**
   - Subtle background movement on hero section
   - CSS-only approach (no heavy libraries)

## Implementation Approach

### No New Dependencies
All enhancements use vanilla CSS and minimal vanilla JavaScript:
- CSS custom properties (already in use)
- CSS transforms, transitions, clip-path
- Intersection Observer API for scroll triggers
- `@keyframes` animations

### Performance Considerations
- No external animation libraries
- CSS-only animations where possible
- Lazy animation triggers (Intersection Observer)
- `will-change` hints for animated properties
- `prefers-reduced-motion` media query support

### Accessibility
- Motion respects `prefers-reduced-motion`
- Color contrast maintained (WCAG AA)
- Focus states preserved on interactive elements

## Impact

- **Affected files:** `site/home/index.html`, `site/home/style.css` (optionally `site/home/script.js`)
- **Affected specs:** None (visual polish only, no functional changes)
- **Breaking changes:** None

## Assets Needed

- 6 inline SVG icons for toolbox features (can derive from existing trade icon style)
- No external images or fonts required
