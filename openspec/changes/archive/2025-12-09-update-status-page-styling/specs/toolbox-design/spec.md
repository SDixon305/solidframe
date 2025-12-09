## ADDED Requirements

### Requirement: Status Page Design Consistency
The status page SHALL follow the same design system as other toolbox pages.

#### Scenario: Status page uses shared layout
- **WHEN** a user navigates to the /status page
- **THEN** the page renders using DashboardLayout with dark sidebar, light main content area, and shared header

#### Scenario: Status page color palette
- **WHEN** viewing the status page Kanban board
- **THEN** the columns and cards use the slate/amber color palette consistent with other toolbox pages (light gray background, white cards, subtle shadows)

#### Scenario: Status page sidebar active state
- **WHEN** viewing the status page
- **THEN** the "Tool Status" link in the sidebar displays with active styling (white background highlight, amber accent)
