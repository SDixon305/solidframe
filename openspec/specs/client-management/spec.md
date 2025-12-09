# client-management Specification

## Purpose
TBD - created by archiving change build-admin-portal. Update Purpose after archive.
## Requirements
### Requirement: Client List View
The system SHALL display a searchable, filterable list of all tenant clients.

#### Scenario: View all clients
- **WHEN** admin navigates to /admin/clients
- **THEN** they see a list of all clients with name, logo, status, tool count, and created date

#### Scenario: Search clients
- **WHEN** admin types "Acme" in the search box
- **THEN** the list filters to show only clients with "Acme" in their name

#### Scenario: Filter by status
- **WHEN** admin selects "Active" status filter
- **THEN** only clients with status "active" are shown

### Requirement: Client Creation
The system SHALL allow admins to create new client accounts with required business information.

#### Scenario: Create new client
- **WHEN** admin fills out the new client form with company name "Acme HVAC" and owner email "owner@acmehvac.com"
- **THEN** a new tenant is created with auto-generated slug "acme-hvac"
- **AND** a Stripe customer is created
- **AND** the admin is redirected to the client detail page

#### Scenario: Duplicate slug prevented
- **WHEN** admin attempts to create a client that would result in duplicate slug
- **THEN** the system appends a number to make it unique (e.g., "acme-hvac-2")

### Requirement: Client Detail View
The system SHALL provide a detailed view of each client with tabs for different aspects of their account.

#### Scenario: View client overview
- **WHEN** admin clicks on a client in the list
- **THEN** they see the client detail page with Overview tab active
- **AND** the overview shows: company info, subscription status, quick usage stats

#### Scenario: Tab navigation
- **WHEN** admin clicks the "Tools" tab
- **THEN** the tab content switches to show tool activation grid
- **AND** the URL updates to reflect the active tab

### Requirement: Tool Activation Management
The system SHALL allow admins to activate and deactivate tools for each client.

#### Scenario: Activate tool
- **WHEN** admin toggles "Review Request Bot" to ON for client "Acme HVAC"
- **THEN** a tenant_tools record is created with is_active=true
- **AND** the activation timestamp is recorded
- **AND** the client can now access the tool

#### Scenario: Deactivate tool
- **WHEN** admin toggles an active tool to OFF
- **THEN** tenant_tools.is_active is set to false
- **AND** the client can no longer access the tool
- **AND** existing configurations are preserved for potential reactivation

### Requirement: Client Tool Configuration View
The system SHALL allow admins to view and edit tool configurations for each client.

#### Scenario: View configuration
- **WHEN** admin views the Config tab for a client
- **THEN** they see a list of activated tools with their current configurations

#### Scenario: Edit configuration
- **WHEN** admin edits a tool's configuration JSON
- **THEN** the configuration is validated against the tool's schema
- **AND** if valid, saved to tenant_tool_configs

### Requirement: Client Impersonation View
The system SHALL allow admins to view the client portal as the client would see it, in read-only mode.

#### Scenario: View as client
- **WHEN** admin clicks "View As" tab for client "Acme HVAC"
- **THEN** they see the client portal for Acme HVAC
- **AND** all actions are disabled (read-only mode)
- **AND** a banner indicates "Viewing as Acme HVAC"

### Requirement: Client Deletion
The system SHALL allow admins to delete clients with appropriate safeguards.

#### Scenario: Delete client
- **WHEN** admin clicks delete and confirms
- **THEN** the tenant and all associated data is soft-deleted
- **AND** the client can no longer log in
- **AND** the Stripe subscription is cancelled

#### Scenario: Delete confirmation required
- **WHEN** admin clicks delete
- **THEN** a confirmation dialog appears requiring the client name to be typed

