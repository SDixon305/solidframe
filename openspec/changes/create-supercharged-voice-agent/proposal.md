# Proposal: Supercharged Omni-Trade Voice Agent

## Why
We are building the "God Mode" Voice Agent platform. This tool will effectively be the "CMS for Voice Agents" within SolidFrame, allowing internal teams to spin up high-fidelity demos for HVAC, Plumbing, Electrical, and Roofing clients in seconds, while giving clients a safe, branded environment to test drive the tech.

## Architecture: The Three Pillars
We will use a **Single Monorepo (Next.js)** approach with **Middleware Routing**. This allows us to share code (UI, Auth, API) while presenting three distinct faces to the world based on the subdomain.

### 1. God Mode (Internal)
-   **URL**: `toolbox.solidframe.ai`
-   **Auth**: Staff Only (Google Auth/Email).
-   **Features**:
    -   **Agent Factory**: Create/Edit Agent Configs (System Prompt, Voice, Trade, Tools).
    -   **Client Manager**: Provision new client subdomains (`trinity.toolbox...`).
    -   **Playground**: Full debug mode chat with raw logs.
    -   **Knowledge Base**: Upload PDFs/Text for RAG.
    -   **Global Settings**: Toggle "Emergency Mode", "Office Hours".

### 2. The Demo (Sales)
-   **URL**: `client-toolbox.solidframe.ai`
-   **Auth**: Generic (e.g., `demo`/`demo`).
-   **Features**:
    -   **Trade Toggle**: "I am a [Plumber]" (Instant personality switch).
    -   **Light Config**: Change "Business Name" for the call.
    -   **Interactive Demo**: Web-based call allowing "Break it" testing.
    -   **Restricted**: No system prompt access.

### 3. The Client Portal (Live)
-   **URL**: `[client-name].toolbox.solidframe.ai` (e.g., `trinity-cooling.toolbox...`)
-   **Auth**: Client Email/Password.
-   **Features**:
    -   **Live Dashboard**: Call logs, recordings, sentiment analysis.
    -   **Billing**: Stripe Customer Portal embedding.
    -   **Toggles**: "Mark as Closed for Holiday", "Change After-Hours Number".
    -   **Tools**: Access to ROI Projector, specific report generators.

## Tech Stack
-   **Framework**: Next.js 14 (App Router)
-   **Database**: Supabase (Multi-tenant schema via `organization_id`).
-   **Voice Backend**: **Vapi**.
    -   *Why*: Best-in-class API for programmatic agent creation ("God Mode"), huge voice selection (11Labs, PlayHT, Deepgram), and strong function calling for tools.
    -   *Retell AI Note*: While Retell is great for speed, Vapi's customization depth is better for a "Supercharged" builder tool.
-   **Middleware**: Custom Next.js middleware to rewrite paths based on hostname:
    -   `toolbox.*` -> `/app/admin`
    -   `client-toolbox.*` -> `/app/demo`
    -   `*.*` -> `/app/client`

## Implementation Phases
1.  **Foundation**: Set up `middleware.ts` and the 3 distinct layouts.
2.  **Backend**: Create Supabase tables `agents`, `clients`, `knowledge_bases`.
3.  **Vapi Integration**: Build the "Universal Vapi Hook" to spawn web calls with dynamic configs.
4.  **UI Construction**:
    -   Build the "God Mode" Configurator (Inputs for Prompts, Voices).
    -   Build the "Demo" Interface (Simple, pretty, "Call Me" button).
5.  **Multi-Trade Content**: Write base prompts for HVAC, Plumbing, Electrical, Roofing.

## Questions/Decisions Required
> [!NOTE]
> No further questions! Proceeding to Plan.

