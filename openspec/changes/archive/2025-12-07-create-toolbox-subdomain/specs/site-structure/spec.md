## MODIFIED Requirements
### Requirement: Dual Vercel Deployment Architecture
The solidframe.ai site SHALL use multiple separate Vercel projects to serve different parts of the application.

#### Scenario: Static site project
- **WHEN** a user visits solidframe.ai or solidframe.ai/hvac
- **THEN** they are served by the `solidframe` Vercel project deploying from `site/` root

#### Scenario: Next.js demo app project
- **WHEN** a user visits hvac-demo.solidframe.ai
- **THEN** they are served by the `hvac-demo-app` Vercel project deploying from `site/hvac/app/frontend/`

#### Scenario: Toolbox app project
- **WHEN** a user visits toolbox.solidframe.ai
- **THEN** they are served by the `toolbox-app` Vercel project deploying from `site/toolbox/`

### Requirement: Subdomain Configuration
The HVAC demo dashboard and Internal Toolbox SHALL be accessible at their respective subdomains.

#### Scenario: Demo subdomain routing
- **WHEN** a user navigates to https://hvac-demo.solidframe.ai
- **THEN** they see the Next.js HVAC demo dashboard application

#### Scenario: Toolbox subdomain routing
- **WHEN** a user navigates to https://toolbox.solidframe.ai
- **THEN** they see the Internal Toolbox Next.js application

#### Scenario: SSL configuration
- **WHEN** any subdomain is accessed
- **THEN** it SHALL use a valid SSL certificate provisioned by Vercel
