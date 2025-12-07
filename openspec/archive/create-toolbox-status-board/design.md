## Context
The user wants a "under construction zone" to see tool progress, similar to Jira tickets.

## Goals / Non-Goals
- **Goals**: 
  - Visual representation of tool status.
  - "Jira-like" or "Kanban-like" feel.
  - Frontend-only implementation for now.
- **Non-Goals**: 
  - Real-time backend integration (future scope).
  - dragging/dropping (read-only for now).

## Decisions
- **Decision**: Use a static configuration/mock data file for the initial list of tools and statuses.
- **Reason**: Allows rapid frontend iteration without blocking on backend schema changes.
- **Structure**: A simple 3-column layout (Live, Building, Backlog) using CSS Grid/Flexbox.

## Risks / Trade-offs
- **Risk**: Static data might get out of date if not manually updated.
- **Mitigation**: Add a visible "Mock Data" label or transition to DB quickly in next iteration.
