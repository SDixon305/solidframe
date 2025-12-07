# Handoff: Supercharged Voice Agent

## Task summary
We are building a "Supercharged Voice Agent Platform" within the SolidFrame Toolbox. This involves a "Three Pillar" architecture where the `site/toolbox` Next.js app renders three different interfaces (Admin, Demo, Client Portal) based on the subdomain/route, powered by Vapi for voice dispatch.

## Current state of work
We have implemented the core infrastructure and initial UI for all three pillars.
-   **Middleware (`site/toolbox/src/middleware.ts`)**: Implements the routing logic to rewrite traffic:
    -   `toolbox.*` -> `/admin` (God Mode)
    -   `client-toolbox.*` -> `/demo` (Sales Demo)
    -   `*.*` -> `/portal` (Client Dashboard)
-   **Admin UI (`site/toolbox/src/app/admin`)**:
    -   `agents/page.tsx`: "Agent Factory" for configuring prompts/voices per trade.
    -   `clients/page.tsx`: "Client Manager" to view active deployments.
    -   **Note**: User recently modified `layout.tsx` to remove the sidebar.
-   **Demo UI (`site/toolbox/src/app/demo`)**:
    -   `page.tsx`: Trade selector (HVAC, Plumbing, etc.).
    -   `[trade]/page.tsx`: Live interactive call page with Vapi hook and visualizer.
-   **Vapi Integration**:
    -   `site/toolbox/src/lib/vapi.ts`: Helper functions to start/stop calls.
    -   `site/toolbox/src/lib/types.ts`: Shared types (`Trade`, `AgentConfig`).
-   **Dashboard**:
    -   Updated `site/toolbox/src/components/ToolboxDashboard.tsx` to link "Instant Agent Demo" to `/demo`.

## Dependencies and specs to read
-   `openspec/changes/create-supercharged-voice-agent/proposal.md`: The architectural proposal.
-   `site/toolbox/src/lib/toolbox-data.ts`: Implementation of tool data.
-   `.env.local`: Needs `NEXT_PUBLIC_VAPI_PUBLIC_KEY`.

## Remaining work / next steps
-   **Visual Refinement**: The user requested "finetuning" of the frontend (specifically `/demo` and `/admin`).
    -   *Action*: Ask user for specific design feedback on the "Orb" or "Trade Selector".
-   **Admin Layout**: The user removed the sidebar in `admin/layout.tsx`. Ensure the navigation flow still makes sense (maybe a top bar?).
-   **Vapi Keys**: Ensure the user has added their real `NEXT_PUBLIC_VAPI_PUBLIC_KEY` to `.env.local` for calls to work.
-   **Client Portal**: currently just a stub. Needs to be fleshed out with real data if prioritized.

## Risks, caveats, and open questions
-   **Localhost Routing**: Middleware subdomain routing is tricky on localhost. We mostly tested via direct paths (`/admin`, `/demo`) during dev.
-   **Vapi Keys**: If the key is missing, the "Start Call" button will fail silently or log an error.

## Startup prompt for the next agent
You are continuing the work on the "Supercharged Voice Agent".
1.  Read this handoff file (`handoffs/handoff-supercharged-voice-agent-2025-12-06-0947.md`).
2.  Read `openspec/changes/create-supercharged-voice-agent/proposal.md` for context.
3.  Your immediate goal is to **Refine the Frontend Experience** based on the user's latest manual edits (removed sidebar) and general feedback.
4.  Confirm you understand the "Three Pillar" architecture (Admin/Demo/Portal).
5.  Propose a plan to polish the UI and verify Vapi connectivity.
