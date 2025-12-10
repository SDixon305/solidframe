# Architecture Overview

This document is the **single source of truth** for understanding the HVAC Agent Demo system architecture.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     HVAC Agent Demo                         │
│           AI-Powered After-Hours Call Triage                │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │ Vapi.ai │          │ Twilio  │          │ OpenAI  │
   │ (Voice) │          │  (SMS)  │          │ (GPT-4) │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                    │                    │
        └──────────┬─────────┴────────────────────┘
                   ▼
        ┌─────────────────────┐
        │   FastAPI Backend   │  ← ACTIVE BACKEND
        │   (backend/main.py) │
        │                     │
        │  • Vapi Webhooks    │
        │  • Call Analysis    │
        │  • SMS Dispatch     │
        │  • Call Logging     │
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   ┌─────────┐          ┌─────────────┐
   │Supabase │          │ Next.js     │
   │   (DB)  │          │ Frontend    │
   └─────────┘          └─────────────┘
```

## Active Components

### Backend (FastAPI) - `/backend/`
**Status: ACTIVE - This is the production backend**

| File | Purpose |
|------|---------|
| `main.py` | API routes, Vapi webhooks, call lifecycle |
| `database.py` | Supabase client, data models |
| `ai_handler.py` | GPT-4 emergency detection & analysis |
| `sms_handler.py` | Twilio SMS, escalation logic |
| `config.py` | Environment configuration |

### Frontend (Next.js) - `/frontend/`
**Status: ACTIVE**

| Component | Purpose |
|-----------|---------|
| `ROICalculator.tsx` | Interactive ROI calculator |
| `LiveCallStatus.tsx` | Real-time call monitoring |
| `BusinessSetup.tsx` | Demo configuration form |
| `Header.tsx` | Navigation header |

### VAPI Configuration - `/docs/vapi/`
**Status: ACTIVE - Voice agent configuration**

| File | Purpose |
|------|---------|
| `VAPI_ASSISTANT_FULL_CONFIG.json` | Vapi assistant configuration |
| `VAPI_TOOLS.json` | Tool definitions for Vapi |
| `TRAINING_NOTES.md` | Voice agent behavior training |
| `update_full_assistant.js` | Script to update Vapi config |
| `update-agent.sh` | Shell wrapper for updates |

## Data Flow

### Inbound Call Flow
1. Caller dials Vapi phone number
2. Vapi AI greets caller, handles conversation
3. Vapi calls tools (lookup_customer, check_availability, etc.)
4. Backend processes webhook, analyzes call with GPT-4
5. If emergency: SMS sent to on-call technician via Twilio
6. Call logged to Supabase
7. Frontend dashboard updates in real-time

### Emergency Detection
The system flags emergencies based on:
- Gas leak/smell mentioned
- No heat/AC in extreme weather
- Elderly or children at risk
- Explicit "emergency" or "urgent" keywords
- Regional context (AC emergencies in South, heating in North)

## External Services

| Service | Purpose | Config Location |
|---------|---------|-----------------|
| **Vapi.ai** | Voice AI platform | `backend/.env` |
| **Twilio** | SMS notifications | `backend/.env` |
| **Supabase** | PostgreSQL database | `backend/.env` |
| **OpenAI** | GPT-4 analysis | `backend/.env` |

## Deployment

| Component | Platform | Docs |
|-----------|----------|------|
| Backend | Railway | `DEPLOYMENT_GUIDE.md` |
| Frontend | Vercel | `DEPLOYMENT_GUIDE.md` |
| Database | Supabase (managed) | Supabase dashboard |

## Key Decisions

### Why FastAPI?
- **Performance**: FastAPI handles high-frequency webhooks efficiently
- **Flexibility**: Complex Python logic for AI analysis
- **Reliability**: Battle-tested in production environments

### Why Vapi over direct Twilio?
- **Simplicity**: Vapi handles STT/TTS orchestration
- **Latency**: Optimized for natural conversation flow
- **Tools**: Native function calling support
- See `twilio_research.md` for alternatives analysis

## File Structure

```
HVAC Agent Demo/
├── backend/                    # FastAPI backend (ACTIVE)
│   ├── main.py
│   ├── database.py
│   ├── ai_handler.py
│   ├── sms_handler.py
│   ├── config.py
│   ├── schema.sql
│   └── requirements.txt
│
├── frontend/                   # Next.js frontend
│   ├── app/
│   ├── components/
│   └── public/
│
├── docs/                       # Documentation & config
│   └── vapi/                   # VAPI assistant configuration
│       ├── VAPI_ASSISTANT_FULL_CONFIG.json
│       ├── VAPI_TOOLS.json
│       ├── TRAINING_NOTES.md
│       └── update_full_assistant.js
│
├── ARCHITECTURE.md            # This file (source of truth)
├── README.md                  # Project overview
├── DEPLOYMENT_GUIDE.md        # Deployment instructions
├── DEPLOYMENT_CHECKLIST.md    # Deployment tracker
├── QUICK_START.md             # Fast deployment guide
├── AGENTS.md                  # AI agent documentation
├── ROI_Calculator_PRD.md      # ROI calculator spec
└── ROI_Calculator_Engineering_Spec.md
```

## Updating the System

### To update the Vapi assistant:
```bash
cd docs/vapi
./update-agent.sh
```

### To add training notes:
1. Edit `docs/vapi/TRAINING_NOTES.md`
2. Run `./update-agent.sh`

### To deploy changes:
See `DEPLOYMENT_GUIDE.md` for Railway/Vercel deployment steps.
