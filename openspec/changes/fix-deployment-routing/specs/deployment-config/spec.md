# deployment-config Specification

## Purpose
Defines the Vercel deployment configuration, domain aliases, and auto-deployment requirements for the SolidFrame platform.

## ADDED Requirements

### Requirement: Vercel Project Structure
The platform SHALL use separate Vercel projects for distinct application boundaries.

#### Scenario: Site project configuration
- **WHEN** the site/ directory is deployed
- **THEN** it deploys to Vercel project "site" serving solidframe.ai

#### Scenario: Toolbox project configuration
- **WHEN** the site/toolbox/ directory is deployed
- **THEN** it deploys to Vercel project "toolbox" serving toolbox.solidframe.ai and *.toolbox.solidframe.ai

#### Scenario: Project isolation
- **WHEN** code is pushed to the repository
- **THEN** each Vercel project deploys independently with its own build settings

### Requirement: Domain Alias Configuration
Each Vercel project SHALL have correctly configured domain aliases matching the intended architecture.

#### Scenario: Site project domains
- **WHEN** the site project is checked in Vercel
- **THEN** it has the domain alias: solidframe.ai

#### Scenario: Toolbox project domains
- **WHEN** the toolbox project is checked in Vercel
- **THEN** it has domain aliases: toolbox.solidframe.ai, client-toolbox.solidframe.ai, *.toolbox.solidframe.ai

#### Scenario: Obsolete domain removal
- **WHEN** a domain is no longer needed (e.g., hvac-demo.solidframe.ai)
- **THEN** its alias MUST be removed from all Vercel projects

### Requirement: Automatic Deployment
Vercel projects SHALL automatically deploy when commits are pushed to the main branch.

#### Scenario: Git push triggers deployment
- **WHEN** code is pushed to the main branch on GitHub
- **THEN** Vercel automatically triggers a deployment for affected projects

#### Scenario: Deployment verification
- **WHEN** a deployment completes
- **THEN** the latest commit hash is reflected in the live application

#### Scenario: Deployment failure notification
- **WHEN** a deployment fails
- **THEN** the deployer is notified via email or Vercel dashboard

### Requirement: Fresh Deployment Process
Deployments SHALL use the latest code from the repository without caching issues.

#### Scenario: Force fresh deployment
- **WHEN** a manual deployment is triggered via Vercel CLI
- **THEN** it pulls the latest code and builds from scratch

#### Scenario: Deployment rollback
- **WHEN** a deployment introduces issues
- **THEN** the previous deployment can be instantly rolled back via Vercel dashboard

### Requirement: Domain SSL Certificates
All production domains SHALL have valid SSL certificates provisioned by Vercel.

#### Scenario: SSL for primary domain
- **WHEN** solidframe.ai is accessed via HTTPS
- **THEN** a valid SSL certificate is presented

#### Scenario: SSL for wildcard subdomain
- **WHEN** any *.toolbox.solidframe.ai subdomain is accessed
- **THEN** a valid SSL certificate is presented

#### Scenario: Automatic SSL renewal
- **WHEN** an SSL certificate approaches expiration
- **THEN** Vercel automatically renews it without manual intervention

### Requirement: Deployment Environment Variables
Vercel projects SHALL have necessary environment variables configured for production.

#### Scenario: Database connection
- **WHEN** the toolbox application needs to connect to Supabase
- **THEN** NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are available

#### Scenario: Environment variable security
- **WHEN** sensitive keys are stored in Vercel
- **THEN** they are encrypted and not exposed in build logs

### Requirement: Build Configuration
Each Vercel project SHALL have correct build settings for its framework.

#### Scenario: Next.js build settings
- **WHEN** the toolbox project is built
- **THEN** it uses Next.js build command and serves from .next directory

#### Scenario: Static site build settings
- **WHEN** the site project is built
- **THEN** it serves static files directly without a build step

#### Scenario: Root directory configuration
- **WHEN** a monorepo subdirectory is deployed
- **THEN** the Vercel project root directory setting points to the correct subdirectory
