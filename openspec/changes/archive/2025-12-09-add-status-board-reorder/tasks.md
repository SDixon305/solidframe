## 1. Setup

- [x] 1.1 Install @dnd-kit/core and @dnd-kit/sortable packages

## 2. Implementation

- [x] 2.1 Create `use-tool-order` hook for localStorage persistence
- [x] 2.2 Add DndContext and SortableContext wrappers to status board
- [x] 2.3 Create SortableToolCard component with drag handle
- [x] 2.4 Implement onDragEnd handler to reorder tools within columns
- [x] 2.5 Add visual feedback (drag overlay, drop placeholder)

## 3. Polish

- [x] 3.1 Ensure keyboard accessibility for reordering (KeyboardSensor added)
- [x] 3.2 Test on mobile (touch-none on drag handle, PointerSensor with distance constraint)
