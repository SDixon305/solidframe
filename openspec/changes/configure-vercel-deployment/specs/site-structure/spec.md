## ADDED Requirements

### Requirement: Dual Vercel Deployment Architecture
The solidframe.ai site SHALL use two separate Vercel projects to serve different parts of the application.

#### Scenario: Static site project
- **WHEN** a user visits solidframe.ai or solidframe.ai/hvac
- **THEN** they are served by the `solidframe` Vercel project deploying from `site/` root

#### Scenario: Next.js demo app project
- **WHEN** a user visits hvac-demo.solidframe.ai
- **THEN** they are served by the `hvac-demo-app` Vercel project deploying from `site/hvac/app/frontend/`

### Requirement: Subdomain Configuration
The HVAC demo dashboard SHALL be accessible at the subdomain hvac-demo.solidframe.ai.

#### Scenario: Subdomain routing
- **WHEN** a user navigates to https://hvac-demo.solidframe.ai
- **THEN** they see the Next.js HVAC demo dashboard application

#### Scenario: SSL configuration
- **WHEN** hvac-demo.solidframe.ai is accessed
- **THEN** it SHALL use a valid SSL certificate provisioned by Vercel

### Requirement: Repository Naming Convention
The GitHub repository SHALL be named `solidframe` to match the primary domain and project name.

#### Scenario: Repository access
- **WHEN** a developer clones the repository
- **THEN** they use `git clone https://github.com/SDixon305/solidframe.git`

#### Scenario: Redirect from old name
- **WHEN** someone accesses https://github.com/SDixon305/hvac-demo
- **THEN** GitHub automatically redirects to https://github.com/SDixon305/solidframe
