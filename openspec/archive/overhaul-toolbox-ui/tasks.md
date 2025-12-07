## 1. Setup & Dependencies
- [x] 1.1 Install `framer-motion` and `lucide-react` (if not already fully set).
- [x] 1.2 Update `tailwind.config.ts` with transparent/glass utility supports and custom colors/gradients.
- [x] 1.3 Update `globals.css` with the "living background" animation styles.

## 2. Component Design
- [x] 2.1 Create `GlassCard` component (reusable container with gloss effect + border glow).
- [x] 2.2 Create `TechBackground` component (absolute positioned animated mesh).
- [x] 2.3 Refactor `ToolboxDashboard.tsx`:
    - Implement Sidebar with glowing active states.
    - Implement Grid using `GlassCard`.
    - Add hover effects (glow intensification).

## 3. Polish
- [x] 3.1 specific fonts (Inter + JetBrains Mono/Geist Mono via Next.js fonts).
- [x] 3.2 Add "System Status" pulsing indicator in header.
- [x] 3.3 Verify responsive behavior doesn't break with new absolute positioning.
