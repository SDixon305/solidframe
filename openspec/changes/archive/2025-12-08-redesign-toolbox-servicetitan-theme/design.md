## Context
The toolbox serves both internal admin users and external client demos. A professional, familiar UI (ServiceTitan-like) is critical for client trust. The current sci-fi aesthetic may work for internal tools but creates friction when showing demos to HVAC business owners who recognize and trust ServiceTitan's interface.

## Goals / Non-Goals
**Goals:**
- Match ServiceTitan's visual language closely (colors, layout, typography, spacing)
- Maintain component architecture (shared components across admin/client-demo)
- Keep all existing functionality intact—only visual changes

**Non-Goals:**
- Pixel-perfect clone of ServiceTitan (we're inspired by, not copying)
- Adding new features or pages
- Changing routing or data flow

## Decisions

### Decision: Use CSS Custom Properties for Design Tokens
ServiceTitan design tokens will be defined as CSS custom properties in `globals.css`. This allows:
- Easy global theme adjustments
- Potential future dark mode toggle (simply swap token values)
- Clear documentation of the design system

### Decision: Single Accent Color
Replace folder-specific color themes (rose, amber, cyan, emerald) with a single primary accent (`#5f3bff` purple). This:
- Simplifies the codebase
- Creates consistent visual identity
- Matches ServiceTitan's approach

**Alternative considered:** Keep multi-color themes → Rejected because ServiceTitan uses consistent accent color and it reduces visual noise.

### Decision: Remove Glow Effects
Replace `shadow-[0_0_20px_...]` glow effects with subtle shadows (`box-shadow: 0 1px 2px ...`). Glows feel sci-fi; subtle shadows feel professional.

### Decision: Dark Sidebar, Light Content
Match ServiceTitan's layout:
- Left sidebar: `#111827` (near-black)
- Main content: `#f4f5f7` (light gray)
- Cards/surfaces: `#ffffff` (white)

This creates clear visual hierarchy and matches user expectations from ServiceTitan.

## Risks / Trade-offs
- **Risk:** Some users may prefer the current dark theme → We can add dark mode toggle later
- **Risk:** Extensive changes across many components → Mitigated by thorough task breakdown
- **Trade-off:** Losing distinctive "SolidFrame look" → Acceptable because professional trust > brand uniqueness for sales tool

## Migration Plan
1. Add new CSS tokens alongside existing (no removal yet)
2. Update shared components one at a time
3. Test each component in both admin and client-demo contexts
4. Remove deprecated tokens and effects after all components updated
5. No database or API changes required

## Resolved Questions
- **Hover animations:** Yes, keep them but subtle—scale(1.02) instead of scale(1.1)
- **Framer-motion:** Keep for enter/exit animations, use CSS transitions for hover states
