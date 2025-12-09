# tool-engine Specification

## Purpose
TBD - created by archiving change build-platform-foundation. Update Purpose after archive.
## Requirements
### Requirement: Tool Definition Registry
The system SHALL maintain a registry of all available tools with metadata including slug, display name, description, icon, category, and whether the tool has real functionality (is_real) or is a UI mockup.

#### Scenario: List available tools
- **WHEN** an admin requests the tool list
- **THEN** the system returns all 8 tools with their metadata

#### Scenario: Tool categories
- **WHEN** displaying tools in the UI
- **THEN** tools are grouped by category (communication, automation, training)

### Requirement: Tool Version Management
The system SHALL support multiple versions per tool, each with a status (draft, staging, production, deprecated) and configuration schema.

#### Scenario: Create new version
- **WHEN** an admin creates a new version of "after-hours-agent"
- **THEN** the version is created with status "draft"
- **AND** inherits the previous version's config schema as a starting point

#### Scenario: Only one production version
- **WHEN** a version is promoted to production
- **THEN** the previous production version is automatically set to "deprecated"

### Requirement: Version Deployment Pipeline
The system SHALL enforce a deployment pipeline: draft -> staging -> production. Versions cannot skip stages.

#### Scenario: Deploy to staging
- **WHEN** an admin deploys a draft version to staging
- **THEN** the version status changes to "staging"
- **AND** the tool becomes testable at staging URLs

#### Scenario: Deploy to production
- **WHEN** an admin deploys a staging version to production
- **THEN** the version status changes to "production"
- **AND** all tenants (subject to rollout percentage) receive the new version

#### Scenario: Skip stage rejected
- **WHEN** an admin attempts to deploy a draft version directly to production
- **THEN** the system rejects with "Version must be in staging first"

### Requirement: Canary Rollout
The system SHALL support gradual rollouts via rollout_pct (0-100) on production versions, determining what percentage of tenants receive the new version.

#### Scenario: 10% canary rollout
- **WHEN** a version is deployed to production with rollout_pct=10
- **THEN** approximately 10% of tenants (deterministically selected by tenant_id hash) receive the new version
- **AND** remaining tenants continue using the previous production version

#### Scenario: Full rollout
- **WHEN** rollout_pct is increased to 100
- **THEN** all tenants receive the new version

### Requirement: Version Rollback
The system SHALL support instant rollback to the previous production version without code deployment.

#### Scenario: Rollback after bad deploy
- **WHEN** an admin triggers rollback for a tool
- **THEN** the current production version is set to "deprecated"
- **AND** the previous production version is restored to "production"
- **AND** all tenants immediately receive the rolled-back version

### Requirement: Tenant Tool Activation
The system SHALL track which tools are activated per tenant via the tenant_tools table, with activation date for billing purposes.

#### Scenario: Activate tool for tenant
- **WHEN** an admin activates "review-request-bot" for tenant "acme"
- **THEN** a tenant_tools record is created with is_active=true
- **AND** activated_at is set to current timestamp

#### Scenario: Deactivate tool
- **WHEN** an admin deactivates a tool for a tenant
- **THEN** is_active is set to false
- **AND** the tenant can no longer access the tool

### Requirement: Per-Tenant Tool Configuration
The system SHALL store tenant-specific tool configurations in tenant_tool_configs as JSON, validated against the tool version's config_schema.

#### Scenario: Default configuration
- **WHEN** a tool is activated for a tenant with no custom config
- **THEN** the system uses the tool version's default configuration

#### Scenario: Custom configuration
- **WHEN** a tenant completes onboarding for a tool
- **THEN** their custom settings are stored in tenant_tool_configs.config
- **AND** merged with defaults for any unset values

### Requirement: Stripe Subscription Tracking
The system SHALL track Stripe subscription status per tenant, syncing via webhooks to keep the database current.

#### Scenario: Subscription created
- **WHEN** Stripe sends customer.subscription.created webhook
- **THEN** the system creates/updates the subscriptions record
- **AND** sets status to match Stripe status

#### Scenario: Payment failed
- **WHEN** Stripe sends invoice.payment_failed webhook
- **THEN** the system updates subscription status to "past_due"
- **AND** creates an alert for the admin

#### Scenario: Subscription cancelled
- **WHEN** Stripe sends customer.subscription.deleted webhook
- **THEN** the system sets subscription status to "cancelled"
- **AND** sets tenant status to "suspended"

