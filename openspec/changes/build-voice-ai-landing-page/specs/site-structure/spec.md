# site-structure Specification

## Purpose
Define the organization and routing of the SolidFrame.ai website's landing pages and applications.

## MODIFIED Requirements

### Requirement: Route-Based Folder Structure
The site folder structure SHALL map directly to URL routes, where each page's folder name matches its URL path segment.

#### Scenario: Home page location
- **WHEN** a developer needs to edit the home page
- **THEN** they find it at `site/home/index.html`

#### Scenario: HVAC landing page location
- **WHEN** a developer needs to edit the HVAC landing page
- **THEN** they find it at `site/hvac/index.html`

#### Scenario: Voice AI landing page location
- **WHEN** a developer needs to edit the Voice AI landing page
- **THEN** they find it at `site/voice-ai/index.html`

#### Scenario: Adding a new landing page
- **WHEN** a developer wants to add a plumbing landing page at `/plumbing`
- **THEN** they create `site/plumbing/index.html` and add an entry to `pages.json`

### Requirement: Campaign-Specific Landing Pages
The site SHALL support multiple landing pages optimized for different advertising campaigns or pain points.

#### Scenario: Campaign variant creation
- **WHEN** a developer needs to create a campaign-specific variant (e.g., `/voice-ai-hvac`)
- **THEN** they copy the base landing page folder structure
- **AND** modify only the heading, subheadline, and primary pain point section
- **AND** add an entry to `pages.json` with the new route

#### Scenario: Shared asset strategy
- **WHEN** multiple campaign pages share common assets (logos, CSS variables, scripts)
- **THEN** developers MAY create a `site/shared/` folder for reusable resources
- **AND** individual landing pages reference shared resources via relative paths
- **AND** each landing page remains independently deployable

#### Scenario: A/B testing variants
- **WHEN** running A/B tests for conversion optimization
- **THEN** separate routes are created for each variant (e.g., `/voice-ai-variant-a`, `/voice-ai-variant-b`)
- **AND** traffic is split using external tools (Google Optimize, Vercel Edge Middleware, etc.)
