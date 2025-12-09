# Change: Add Drag-to-Reorder for Status Board

## Why
The status board shows tools grouped by status (Live, In Progress, Planned), but there's no way to prioritize which tools to build next within a column. Users need to reorder tools vertically to indicate build priority.

## What Changes
- Add `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop functionality
- Enable vertical drag-to-reorder within each status column (no cross-column dragging)
- Persist tool order to localStorage (per-column)
- Add visual feedback during drag (lift effect, drop indicator)
- Add drag handle to tool cards

## Impact
- Affected specs: toolbox-design
- Affected code:
  - `site/toolbox/src/components/ToolboxStatusBoard.tsx` (add DnD wrappers)
  - `site/toolbox/src/hooks/use-tool-order.ts` (new hook for order persistence)
  - `package.json` (add @dnd-kit dependencies)
