# multi-tenancy Specification

## Purpose
TBD - created by archiving change build-platform-foundation. Update Purpose after archive.
## Requirements
### Requirement: Tenant Data Model
The system SHALL maintain a tenants table that stores client company information including unique slug, display name, logo URL, status (active/suspended/cancelled), and Stripe customer ID.

#### Scenario: Create new tenant
- **WHEN** an admin creates a new tenant with name "Acme HVAC"
- **THEN** the system generates a unique slug "acme-hvac"
- **AND** creates a Stripe customer record
- **AND** stores the tenant with status "active"

#### Scenario: Tenant slug uniqueness
- **WHEN** an admin attempts to create a tenant with an existing slug
- **THEN** the system rejects the request with a conflict error

### Requirement: User-Tenant Association
The system SHALL associate every user with exactly one tenant via tenant_id foreign key, except super_admin users who have platform-wide access.

#### Scenario: User belongs to tenant
- **WHEN** a user logs in
- **THEN** the system loads their tenant_id from the users table
- **AND** all subsequent queries are scoped to that tenant

#### Scenario: Super admin access
- **WHEN** a super_admin user queries any tenant-scoped resource
- **THEN** the system allows access regardless of tenant_id

### Requirement: Row-Level Security Isolation
The system SHALL enforce tenant data isolation at the database level using PostgreSQL Row-Level Security policies on all tenant-scoped tables.

#### Scenario: Cross-tenant data access blocked
- **WHEN** a user with tenant_id "acme" attempts to query data belonging to tenant_id "other"
- **THEN** the database returns zero rows
- **AND** no error is raised (silent filtering)

#### Scenario: RLS bypass prevention
- **WHEN** application code contains a bug that doesn't filter by tenant
- **THEN** RLS policies still enforce isolation
- **AND** the user only sees their own tenant's data

### Requirement: Tenant Status Management
The system SHALL support tenant lifecycle states: active, suspended, cancelled. Suspended tenants can log in but cannot use tools. Cancelled tenants cannot log in.

#### Scenario: Suspended tenant access
- **WHEN** a user from a suspended tenant logs in
- **THEN** they can view their dashboard
- **BUT** all tool actions are blocked with a "subscription suspended" message

#### Scenario: Cancelled tenant access
- **WHEN** a user from a cancelled tenant attempts to log in
- **THEN** authentication fails with "account cancelled" message

