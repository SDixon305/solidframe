# Change: Create Toolbox Subdomain

## Why
The user needs a centralized hub to maintain and visualize internal tools (scrapers, script generators, etc.) in an application-like interface. Currently, these tools are scattered or command-line based. A dedicated `toolbox.solidframe.ai` subdomain will provide a unified UI for these utilities.

## What Changes
- **New Subdomain**: `toolbox.solidframe.ai` mapped to a new Next.js application.
- **New Directory**: `site/toolbox/` to house the new application.
- **New Capability**: `internal-tools` spec to define the requirements for the toolbox functionality, including job management and execution.
- **New Architecture**: Async Job Queue system using Supabase and a Python Worker to handle long-running tasks.
- **Site Structure Update**: Register the new route and deployment project in `site-structure`.

## Impact
- **Affected Specs**: `site-structure`, `internal-tools` (new).
- **Affected Code**: `site/` directory, process for running tools (new `worker` service).
