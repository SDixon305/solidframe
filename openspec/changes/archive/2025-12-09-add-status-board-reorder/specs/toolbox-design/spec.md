## ADDED Requirements

### Requirement: Status Board Tool Reordering
Users SHALL be able to reorder tools within a status column to indicate build priority.

#### Scenario: Drag tool to new position
- **WHEN** a user drags a tool card vertically within a column
- **THEN** the tool is repositioned and the new order is persisted

#### Scenario: Order persists across sessions
- **WHEN** a user reorders tools and refreshes the page
- **THEN** the custom order is restored from localStorage

#### Scenario: Visual feedback during drag
- **WHEN** a user is dragging a tool card
- **THEN** the card displays a lifted appearance and a drop indicator shows the target position

#### Scenario: Cross-column drag prevented
- **WHEN** a user attempts to drag a tool to a different status column
- **THEN** the drag is cancelled and the tool returns to its original position
