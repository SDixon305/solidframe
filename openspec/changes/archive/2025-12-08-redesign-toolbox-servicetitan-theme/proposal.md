# Change: Redesign Toolbox with ServiceTitan Theme

## Why
The current toolbox uses a dark sci-fi aesthetic (glowing effects, "SYSTEM ONLINE" indicators, grid animations) that feels experimental rather than professional. HVAC business owners are familiar with ServiceTitan's clean, enterprise-grade interface. Matching that visual language builds trust and reduces friction during sales demos.

## What Changes
- **BREAKING**: Complete visual overhaul—dark theme replaced with light theme
- Replace CSS variables with ServiceTitan design tokens (colors, typography, spacing, radii)
- Update Sidebar to use dark (#111827) background with white active state
- Update main content area to use light (#f4f5f7) background with white surface cards
- Replace purple accent (#5f3bff) throughout instead of multi-color folder themes
- Remove sci-fi elements: BorderBeam, SpotlightCard glows, "SYSTEM ONLINE", CPU indicators
- Adopt clean typography (system-ui font stack) and subtle shadows instead of glows

### Design Token Mapping
| Current | ServiceTitan |
|---------|--------------|
| `#09090b` (bg) | `#f4f5f7` (app bg) |
| `glass-panel` | `#ffffff` (surface) |
| Rose/amber/cyan accents | `#5f3bff` (primary accent) |
| Glow shadows | Subtle `box-shadow` |
| Uppercase mono labels | Sentence case, system font |

## Impact
- **Affected code:** `site/toolbox/src/app/globals.css` (design tokens)
- **Affected code:** `site/toolbox/src/lib/theme.ts` (theme config)
- **Affected code:** `site/toolbox/src/components/shared/*` (Sidebar, Header, DashboardLayout, ToolCard, ToolGrid)
- **Affected code:** `site/toolbox/src/components/shared/effects/*` (may remove or simplify)
- **Affected specs:** None existing—creates new `toolbox-design` capability spec
- **Synergy:** Enhances `build-client-demo-portal` by providing professional client-facing UI
