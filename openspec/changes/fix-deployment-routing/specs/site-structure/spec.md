# site-structure Spec Delta

## MODIFIED Requirements

### Requirement: Subdomain Configuration
The platform SHALL use distinct subdomains for different environments and use path-based routing for marketing content.

#### Scenario: Marketing content routing
- **WHEN** a user navigates to solidframe.ai/hvac-owners
- **THEN** they see the HVAC landing page

#### Scenario: Admin portal access
- **WHEN** a user navigates to toolbox.solidframe.ai
- **THEN** they see the Super Admin portal

#### Scenario: Demo sandbox access
- **WHEN** a user navigates to client-toolbox.solidframe.ai
- **THEN** they see the public demo sandbox (afterhours-agent demo)

#### Scenario: Client tenant access
- **WHEN** a user navigates to acme-hvac.toolbox.solidframe.ai
- **THEN** they see the Acme HVAC tenant portal with polished demo data

## REMOVED Requirements

### ~~Requirement: Subdomain Configuration~~ (OLD VERSION)
~~The HVAC demo dashboard SHALL be accessible at the subdomain hvac-demo.solidframe.ai.~~

#### ~~Scenario: Subdomain routing~~ (REMOVED)
- ~~**WHEN** a user navigates to https://hvac-demo.solidframe.ai~~
- ~~**THEN** they see the Next.js HVAC demo dashboard application~~

**Rationale**: HVAC marketing content should be at a path on the main domain (solidframe.ai/hvac-owners) rather than a separate subdomain, for SEO and consolidation purposes.

## ADDED Requirements

### Requirement: Multi-tenant Subdomain Routing
The toolbox platform SHALL support wildcard subdomain routing for multi-tenant client portals.

#### Scenario: Wildcard subdomain configuration
- **WHEN** Vercel is configured with *.toolbox.solidframe.ai
- **THEN** any subdomain (e.g., acme-hvac.toolbox.solidframe.ai) routes to the toolbox project

#### Scenario: Tenant slug extraction
- **WHEN** a request arrives at [tenant-slug].toolbox.solidframe.ai
- **THEN** Next.js middleware extracts the tenant slug and routes to /[tenant]/

#### Scenario: Demo sandbox isolation
- **WHEN** client-toolbox.solidframe.ai receives a request
- **THEN** it routes to /client-demo instead of /[tenant]/

### Requirement: Vercel Rewrite Rules
The site/vercel.json configuration SHALL define rewrite rules for all marketing content routes.

#### Scenario: Home page rewrite
- **WHEN** vercel.json is read
- **THEN** it contains { "source": "/", "destination": "/home/index.html" }

#### Scenario: HVAC owners page rewrite
- **WHEN** vercel.json is read
- **THEN** it contains { "source": "/hvac-owners", "destination": "/hvac/index.html" }

#### Scenario: Additional trade routes
- **WHEN** new trade-specific landing pages are added (e.g., /plumbing-owners)
- **THEN** corresponding rewrite rules MUST be added to vercel.json
