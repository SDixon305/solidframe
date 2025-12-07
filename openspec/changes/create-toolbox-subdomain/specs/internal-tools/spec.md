## ADDED Requirements
### Requirement: Tool Dashboard
The toolbox SHALL provide a unified dashboard listing all available internal tools with live status indicators.

#### Scenario: Tool listing
- **WHEN** user visits the toolbox home page
- **THEN** they see cards for all registered tools (e.g., "Lead Scraper")

#### Scenario: Worker Connectivity
- **WHEN** the backend worker is offline
- **THEN** the dashboard displays a warning ("Job Runner Offline")

### Requirement: Async Job Execution
The system SHALL execute tools asynchronously via a job queue to support long-running processes (scrapers) without timeouts.

#### Scenario: Queue a job
- **WHEN** user clicks "Run" on a tool
- **THEN** a new job is created in the database with "Queued" status
- **AND** the UI updates to show the pending job

#### Scenario: Job completion
- **WHEN** a job finishes processing
- **THEN** the status updates to "Complete"
- **AND** a notification is triggered (Email/Slack)

### Requirement: Job History & Results
The toolbox SHALL maintain a history of past runs and their outputs.

#### Scenario: View history
- **WHEN** user views a specific tool
- **THEN** they see a list of past executions with timestamps and status

#### Scenario: Download results
- **WHEN** a user clicks on a completed Scraper job
- **THEN** they can view or download the generated data interactively

### Requirement: Toolbox Security
The toolbox SHALL be protected by authentication to prevent unauthorized usage.

#### Scenario: Unauthenticated access
- **WHEN** an efficient user visits `toolbox.solidframe.ai` without a session
- **THEN** they are redirected to a login screen

### Requirement: Script Generator (LLM)
The system SHALL provide an interface to generate content using LLMs (e.g., GPT-4) via the backend worker.

#### Scenario: Generate Script
- **WHEN** user submits prompt parameters
- **THEN** the worker calls the LLM provider and saves the generated text as the job result
