# client-dashboard Specification

## Purpose
TBD - created by archiving change build-client-portal. Update Purpose after archive.
## Requirements
### Requirement: Client Dashboard Home
The system SHALL provide a client dashboard home page displaying all available tools in a grid layout with status and key metrics.

#### Scenario: Dashboard loads with tool grid
- **WHEN** a client user navigates to /[tenant]/
- **THEN** they see a grid of 8 tool cards
- **AND** each card shows tool name, icon, status, and key metric

#### Scenario: Tool card navigation
- **WHEN** client clicks a tool card
- **THEN** they navigate to that tool's detail page

### Requirement: Client Layout
The system SHALL provide a client-specific layout with sidebar navigation, header with tenant branding, and main content area.

#### Scenario: Layout renders with branding
- **WHEN** client accesses their portal
- **THEN** the header displays their company logo (if uploaded)
- **AND** the sidebar shows navigation for Dashboard, Tools, Settings, Feedback

#### Scenario: Mobile responsive
- **WHEN** viewing on mobile device
- **THEN** sidebar collapses to hamburger menu
- **AND** tool grid adjusts to single column

### Requirement: Tenant Route Validation
The system SHALL validate that the tenant slug in the URL exists and that the authenticated user belongs to that tenant.

#### Scenario: Valid tenant access
- **WHEN** user from "acme-hvac" accesses /acme-hvac/
- **THEN** they see their dashboard

#### Scenario: Invalid tenant slug
- **WHEN** anyone accesses /nonexistent-tenant/
- **THEN** they receive a 404 Not Found page

#### Scenario: Wrong tenant access
- **WHEN** user from "acme-hvac" attempts to access /other-company/
- **THEN** they receive a 403 Forbidden response

### Requirement: Onboarding Status Indicator
The system SHALL display onboarding completion status on the dashboard with a prompt to complete if incomplete.

#### Scenario: Incomplete onboarding
- **WHEN** client with incomplete onboarding views dashboard
- **THEN** a banner shows "Complete your setup" with progress percentage
- **AND** clicking the banner navigates to onboarding wizard

#### Scenario: Complete onboarding
- **WHEN** client with complete onboarding views dashboard
- **THEN** no onboarding banner is shown

### Requirement: Client Settings Page
The system SHALL provide a settings page where clients can update their logo and view their account information.

#### Scenario: Upload logo
- **WHEN** client uploads a logo image
- **THEN** the logo is stored and displayed in the header

#### Scenario: View account info
- **WHEN** client views settings
- **THEN** they see their company name, contact email, and subscription status (read-only)

