# client-demo Specification

## Purpose
TBD - created by archiving change build-client-demo-portal. Update Purpose after archive.
## Requirements
### Requirement: Client Demo Portal Access
The system SHALL provide a sandboxed demo environment at `/client-demo` routes within the toolbox application.

#### Scenario: Accessing demo with personalized link
- **WHEN** a user visits `/client-demo?token=<base64-encoded-json>`
- **THEN** the system decodes the token and displays personalized greeting with owner name and business name

#### Scenario: Accessing demo without token
- **WHEN** a user visits `/client-demo` without a token parameter
- **THEN** the system displays default greeting "Welcome, Trinity Cooling"

#### Scenario: Accessing demo with expired link
- **WHEN** a user visits `/client-demo` with a token that has expired (older than 14 days)
- **THEN** the system displays a "Link Expired" message with instructions to request a new demo link

#### Scenario: Demo state isolation
- **WHEN** a user interacts with any demo tool and then reloads the page
- **THEN** all demo state resets to initial values with no persistence

---

### Requirement: Demo Tool Suite
The system SHALL provide 8 sandboxed demo tools accessible from the client demo dashboard.

#### Scenario: Demo dashboard displays all tools
- **WHEN** a user visits `/client-demo`
- **THEN** the system displays a grid of 8 demo tools: ROI Calculator, Voice Agent Demo, Lead Scraper, Review Request Generator, Competitive Analysis, Call Dashboard, Technician Training, Appointment Scheduler

#### Scenario: Each tool uses mock data
- **WHEN** a user opens any demo tool
- **THEN** the tool displays realistic mock data with no connection to production systems

---

### Requirement: ROI Calculator Demo
The system SHALL provide an ROI calculator demo that reuses existing calculator components with mock defaults.

#### Scenario: Calculator shows realistic projections
- **WHEN** a user adjusts inputs in the ROI calculator demo
- **THEN** the system recalculates and displays updated revenue projections in real-time

---

### Requirement: Voice Agent Demo
The system SHALL provide a mock voice agent interface demonstrating AI call handling.

#### Scenario: Simulated call flow
- **WHEN** a user initiates a demo call
- **THEN** the system displays a scripted AI conversation with realistic timing and responses

---

### Requirement: Lead Scraper Demo
The system SHALL provide a mock lead scraper showing sample lead data.

#### Scenario: Display mock leads
- **WHEN** a user triggers a lead scrape in demo mode
- **THEN** the system displays mock lead results with names, phones, and addresses

---

### Requirement: Review Request Generator Demo
The system SHALL provide a mock SMS review request flow.

#### Scenario: Preview SMS template
- **WHEN** a user composes a review request in demo mode
- **THEN** the system displays the SMS preview and simulates a send confirmation

---

### Requirement: Competitive Analysis Demo
The system SHALL provide mock competitor analysis data.

#### Scenario: Display competitor profiles
- **WHEN** a user views competitive analysis in demo mode
- **THEN** the system displays mock competitor cards with ratings, review counts, and snippets

---

### Requirement: Call Dashboard Demo
The system SHALL provide a mock call dashboard with simulated incoming calls.

#### Scenario: Mock call feed
- **WHEN** a user views the call dashboard in demo mode
- **THEN** the system displays mock call entries with transcripts, timestamps, and emergency detection flags

---

### Requirement: Technician Training Demo
The system SHALL provide a mock training module for technician onboarding scenarios.

#### Scenario: Training quiz flow
- **WHEN** a user starts a training module in demo mode
- **THEN** the system displays mock training scenarios with questions and feedback

---

### Requirement: Appointment Scheduler Demo
The system SHALL provide a mock appointment booking interface.

#### Scenario: Mock booking flow
- **WHEN** a user selects an appointment slot in demo mode
- **THEN** the system simulates a booking confirmation with mock details

---

### Requirement: Magic Link Generator
The system SHALL provide an admin tool to generate personalized demo links.

#### Scenario: Generate personalized link
- **WHEN** an admin enters owner name and business name and clicks generate
- **THEN** the system creates a URL with base64-encoded token containing the personalization data

#### Scenario: Copy link to clipboard
- **WHEN** an admin clicks "Copy Link" after generating a demo link
- **THEN** the system copies the URL to clipboard and shows confirmation feedback

#### Scenario: Track link generation
- **WHEN** an admin generates a demo link
- **THEN** the system logs the link metadata (owner, business, created_at, token) to Supabase for analytics

---

### Requirement: Shared Component Architecture
The system SHALL use a shared component library across all toolbox variants (admin, client-demo, future client toolboxes).

#### Scenario: Design change propagation
- **WHEN** a shared component (e.g., ToolCard, Header, Sidebar) is modified
- **THEN** the change is reflected in admin toolbox, client demo, and future client toolboxes

#### Scenario: Data injection pattern
- **WHEN** a shared tool component is rendered
- **THEN** it receives data and action handlers via props, allowing different variants to inject real or mock data

