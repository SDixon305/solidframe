# Project Context

## Purpose
SolidFrame.ai is an intelligent automation agency platform specializing in AI-powered call triage and business automation solutions. The primary demo showcases an HVAC (Heating, Ventilation, and Air Conditioning) business automation system featuring:
- Emergency call detection with GPT-4 analysis
- Real-time dispatch and technician notifications
- Revenue optimization through intelligent call handling
- Interactive ROI calculator for prospects

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.3 + PostCSS
- **Icons:** Lucide React
- **Database Client:** Supabase JS SDK
- **Utilities:** date-fns

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.9+
- **Server:** Uvicorn
- **Database:** Supabase (PostgreSQL)
- **AI Services:** OpenAI GPT-4
- **SMS:** Twilio
- **Voice Platform:** Vapi.ai (webhook-based)

### Infrastructure
- **Deployment:** Vercel (frontend), Railway/Render compatible (backend)
- **Tunneling:** ngrok (local development)

## Project Conventions

### Code Style

#### TypeScript/React
- Functional components with hooks (useState, useEffect, useRef, useMemo)
- TypeScript interfaces for component props
- `'use client'` directive for client-side components in App Router
- Tailwind CSS classes for styling (dark mode theme with slate colors)
- Lucide React icons
- Next.js Link component for internal navigation
- Responsive design with Tailwind breakpoints (sm:, md:, lg:)

#### Python
- Docstrings for all classes and functions
- Type hints for function parameters and return values
- Class-based organization for handlers
- Configuration through environment variables via `config.py`

### File Organization

```
solidframe/
├── site/                      # The solidframe.ai website
│   ├── pages.json             # Registry of all pages/routes
│   ├── vercel.json            # Unified Vercel config
│   ├── home/                  # solidframe.ai/ (root landing)
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── hvac/                  # solidframe.ai/hvac
│       ├── index.html         # HVAC landing page
│       ├── assets/            # Images, icons
│       ├── audio/             # Audio files
│       └── app/               # HVAC demo application
│           ├── frontend/      # Next.js dashboard
│           │   ├── app/       # App Router pages
│           │   ├── components/
│           │   ├── hooks/
│           │   └── lib/
│           └── backend/       # FastAPI API
│               ├── main.py
│               ├── database.py
│               ├── ai_handler.py
│               ├── sms_handler.py
│               └── config.py
├── archive/                   # Old experiments (read-only)
├── openspec/                  # Specifications
├── outreach/                  # Business/marketing files
└── scraper/                   # Utility scripts
```

### Architecture Patterns
- **Monorepo:** Multiple landing pages + main Next.js/FastAPI demo
- **App Router:** Next.js file-based routing with client/server component mix
- **Webhook-based:** Receives events from Vapi.ai and Twilio
- **Service Layer:** Dedicated handlers for AI, SMS, Database concerns
- **Real-time:** Supabase subscriptions for dashboard updates

### Testing Strategy
No automated test framework currently configured. Testing is manual/integration-based through live call scenarios.

### Git Workflow
- Primary branch: `main` (production)
- Direct commits to main with descriptive messages
- Frequent small commits
- Vercel auto-deploys on push to main

## Domain Context

### HVAC Emergency Detection
- **Keyword-based:** Gas leaks, no heat, no AC, water damage, safety concerns
- **Regional intelligence:** South = AC emergencies prioritized, North = heating emergencies prioritized
- **Confidence scoring:** GPT-4 contextual analysis with 0-100 confidence

### Pricing Model
- ≤25 calls/week: $299/month
- >25 calls/week: $500/month
- ROI calculator demonstrates value proposition to prospects

### Call Flow
1. Caller dials Vapi number
2. Vapi AI answers and converses
3. Webhook sent to FastAPI backend
4. GPT-4 analyzes transcript for emergency indicators
5. Data logged to Supabase
6. If emergency: SMS sent via Twilio to technician
7. Frontend dashboard updates in real-time

## Important Constraints
- Environment variables required for all external services (never committed to repo)
- Webhook URLs must be updated when deployment URL changes
- 5-minute escalation timeout for unanswered emergency alerts
- CORS configured for specific frontend origins

## External Dependencies

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| **Vapi.ai** | AI voice receptionist | Webhook: `/webhook/vapi` |
| **OpenAI GPT-4** | Emergency analysis | Direct API calls |
| **Twilio** | SMS notifications | API + Webhook: `/webhook/sms` |
| **Supabase** | Database + real-time | Client SDK (frontend + backend) |
| **Vercel** | Frontend deployment | CI/CD on git push |
