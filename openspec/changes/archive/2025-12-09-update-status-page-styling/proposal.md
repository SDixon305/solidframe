# Change: Update Status Page to Match Toolbox Design System

## Why
The `/status` page uses a standalone dark glass-panel theme that doesn't match the rest of the toolbox. All other toolbox pages (admin, client-demo, etc.) use the ServiceTitan-inspired design system with shared components. This creates visual inconsistency.

## What Changes
- Refactor `ToolboxStatusBoard.tsx` to use shared `DashboardLayout`, `Sidebar`, and `Header` components
- Replace dark glass-panel styling with light slate-100 background and slate/amber color palette
- Update Kanban board columns to use professional card styling consistent with `toolbox-design` spec
- Remove custom sidebar in favor of the shared `Sidebar` component with status link highlighted as active

## Impact
- Affected specs: toolbox-design
- Affected code:
  - `site/toolbox/src/components/ToolboxStatusBoard.tsx` (major refactor)
  - `site/toolbox/src/app/status/page.tsx` (minor updates if needed)
