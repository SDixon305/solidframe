## 1. Design Tokens & Global Styles
- [x] 1.1 Add ServiceTitan CSS custom properties to `globals.css` (colors, typography, spacing, radii, shadows)
- [x] 1.2 Update `:root` background and foreground variables for light theme
- [x] 1.3 Remove or comment out sci-fi utilities (`glass-panel`, `bg-grid-animation`)
- [x] 1.4 Add utility classes for common ServiceTitan patterns (`.surface-card`, `.text-label`, etc.)

## 2. Theme Configuration
- [x] 2.1 Update `lib/theme.ts` to use single purple accent instead of folder-specific colors
- [x] 2.2 Simplify `folderThemes` to use consistent accent color
- [x] 2.3 Update `statusColors` to use ServiceTitan semantic colors (success green, warning amber, etc.)

## 3. Shared Components - Layout
- [x] 3.1 Update `DashboardLayout.tsx` - light background, remove dark theme classes
- [x] 3.2 Update `Sidebar.tsx` - dark background (#111827), white active state, remove glow effects
- [x] 3.3 Update `Header.tsx` - white background, remove "SYSTEM ONLINE" and CPU indicators, clean typography

## 4. Shared Components - Content
- [x] 4.1 Update `ToolCard.tsx` - white card with subtle shadow, remove BorderBeam/SpotlightCard effects
- [x] 4.2 Update `ToolGrid.tsx` - adjust spacing for light theme if needed
- [x] 4.3 Simplify or remove `effects/SpotlightCard.tsx` and `effects/BorderBeam.tsx`

## 5. Page-Level Updates
- [x] 5.1 Update `app/page.tsx` (main dashboard) - ensure light theme works
- [x] 5.2 Update `app/client-demo/layout.tsx` and `page.tsx` - apply new theme
- [x] 5.3 Update `app/client-demo/roi/page.tsx` - apply new theme
- [x] 5.4 Update `app/tools/roi-projector/page.tsx` - apply new theme to ROI calculator

## 6. ROI Calculator Components
- [x] 6.1 Update `ROIQuestionnaire.tsx` - light theme styling
- [x] 6.2 Update `ROIVisualization.tsx` - white cards, professional colors
- [x] 6.3 Update `ROIInputsCompact.tsx` - light inputs and sliders

## 7. Verification
- [x] 7.1 Build passes without errors
- [x] 7.2 Visual verification of all routes (manual)
