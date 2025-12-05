## ADDED Requirements

### Requirement: Route-Based Folder Structure
The site folder structure SHALL map directly to URL routes, where each page's folder name matches its URL path segment.

#### Scenario: Home page location
- **WHEN** a developer needs to edit the home page
- **THEN** they find it at `site/home/index.html`

#### Scenario: HVAC landing page location
- **WHEN** a developer needs to edit the HVAC landing page
- **THEN** they find it at `site/hvac/index.html`

#### Scenario: Adding a new landing page
- **WHEN** a developer wants to add a plumbing landing page at `/plumbing`
- **THEN** they create `site/plumbing/index.html` and add an entry to `pages.json`

### Requirement: Page Registry
The site SHALL maintain a `pages.json` file at `site/pages.json` that lists all active pages with their routes, folder names, and titles.

#### Scenario: Registry structure
- **WHEN** a developer reads `site/pages.json`
- **THEN** they see a JSON object with a `pages` array containing objects with `route`, `folder`, and `title` properties

#### Scenario: Registry accuracy
- **WHEN** a new page is added to the site
- **THEN** it MUST be added to `pages.json` before deployment

### Requirement: Static Landing Pages
Landing pages (home, hvac, plumbing, etc.) SHALL be simple HTML/CSS files without build steps or JavaScript frameworks.

#### Scenario: Landing page technology
- **WHEN** a developer creates a new landing page
- **THEN** they use plain HTML and CSS files only

#### Scenario: Landing page independence
- **WHEN** a landing page is deployed
- **THEN** it does not require Node.js, npm install, or any build process

### Requirement: Demo App Integration
The HVAC demo application (Next.js frontend and FastAPI backend) SHALL be nested under `site/hvac/app/` and accessible at `/hvac/dashboard`.

#### Scenario: Dashboard access
- **WHEN** a user navigates to `solidframe.ai/hvac/dashboard`
- **THEN** they see the Next.js HVAC demo dashboard

#### Scenario: App file location
- **WHEN** a developer needs to modify the dashboard
- **THEN** they find the Next.js app at `site/hvac/app/frontend/`

### Requirement: Archive Preservation
Old experimental landing page folders SHALL be preserved in an `archive/` directory at the repository root.

#### Scenario: Archive location
- **WHEN** a developer looks for old landing page experiments
- **THEN** they find them under `archive/landing-01-simple-html/`, `archive/landing-02-rugged-vite/`, etc.

#### Scenario: Archive immutability
- **WHEN** files are in the archive directory
- **THEN** they SHALL NOT be modified (read-only reference)
