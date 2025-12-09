## MODIFIED Requirements

### Requirement: Status Board Tool Reordering
Users SHALL be able to reorder tools within a status column to indicate build priority.

#### Scenario: Drag tool to new position
- **WHEN** a user drags a tool card vertically within a column
- **THEN** the tool is repositioned and the new order is persisted

#### Scenario: Order persists across sessions (authenticated)
- **WHEN** an authenticated user reorders tools and refreshes the page
- **THEN** the custom order is restored from Supabase

#### Scenario: Order persists across sessions (unauthenticated)
- **WHEN** an unauthenticated user reorders tools and refreshes the page
- **THEN** the custom order is restored from localStorage

#### Scenario: Order syncs across devices
- **WHEN** an authenticated user reorders tools on one device
- **THEN** the order is visible on other devices when they log in

#### Scenario: Visual feedback during drag
- **WHEN** a user is dragging a tool card
- **THEN** the card displays a lifted appearance and a drop indicator shows the target position

#### Scenario: Cross-column drag prevented
- **WHEN** a user attempts to drag a tool to a different status column
- **THEN** the drag is cancelled and the tool returns to its original position
