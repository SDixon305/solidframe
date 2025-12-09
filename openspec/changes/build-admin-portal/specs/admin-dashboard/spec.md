## ADDED Requirements

### Requirement: Admin Dashboard Home
The system SHALL provide an admin dashboard home page displaying key platform metrics and recent alerts at a glance.

#### Scenario: Dashboard loads with metrics
- **WHEN** a super_admin navigates to /admin
- **THEN** they see metric cards for: Total Clients, Active Tools, Calls This Month, Unread Alerts
- **AND** a Recent Alerts section showing the 5 most recent alerts

#### Scenario: Metric updates
- **WHEN** a new client is created
- **THEN** the Total Clients metric increments on next page load

### Requirement: Admin Navigation
The system SHALL provide a persistent navigation sidebar with links to all admin sections and visual indication of unread alerts.

#### Scenario: Navigation between sections
- **WHEN** admin clicks "Clients" in the sidebar
- **THEN** they navigate to /admin/clients
- **AND** the Clients nav item is visually highlighted as active

#### Scenario: Alert badge
- **WHEN** there are 5 unread alerts
- **THEN** the Alerts nav item shows a badge with "5"
- **AND** the badge updates in real-time when new alerts arrive

### Requirement: Admin Access Control
The system SHALL restrict all /admin routes to users with the super_admin role.

#### Scenario: Super admin access
- **WHEN** a super_admin user navigates to /admin
- **THEN** they see the admin dashboard

#### Scenario: Non-admin rejected
- **WHEN** a client_user attempts to access /admin
- **THEN** they are redirected to /login
- **AND** an error message indicates insufficient permissions

### Requirement: Admin Layout Responsiveness
The system SHALL provide a responsive admin layout that works on desktop and mobile devices.

#### Scenario: Desktop view
- **WHEN** viewing on desktop (>1024px)
- **THEN** sidebar is always visible
- **AND** content area takes remaining width

#### Scenario: Mobile view
- **WHEN** viewing on mobile (<768px)
- **THEN** sidebar is hidden by default
- **AND** a hamburger menu toggles sidebar visibility
