# HVAC Demo System

AI-powered call triage system for HVAC businesses. This demo showcases emergency detection, automated dispatch, and real-time call monitoring.

## Project Structure

```
HVAC Agent Demo/
├── backend/              # FastAPI backend
│   ├── main.py          # Main application & webhooks
│   ├── database.py      # Supabase client & models
│   ├── ai_handler.py    # Emergency detection & AI analysis
│   ├── sms_handler.py   # Twilio SMS & escalation
│   ├── report_generator.py  # Daily reports
│   ├── config.py        # Configuration
│   ├── schema.sql       # Database schema
│   └── requirements.txt # Python dependencies
│
└── frontend/            # Next.js frontend
    ├── app/
    │   ├── page.tsx     # Main demo page
    │   ├── dashboard/   # Live call dashboard
    │   └── layout.tsx   # Root layout
    └── components/
        ├── BusinessSetup.tsx  # Business configuration
        └── CallCard.tsx       # Call display component
```

## Features

- ✅ **Real-time Call Handling** - AI answers calls via Vapi.ai
- ✅ **Emergency Detection** - Analyzes calls for urgency using GPT-4
- ✅ **Regional Intelligence** - AC emergencies in south, furnace in north
- ✅ **SMS Notifications** - Twilio integration for technician alerts
- ✅ **Escalation Logic** - 5-minute timeout with owner escalation
- ✅ **Live Dashboard** - Real-time call monitoring
- ✅ **Daily Reports** - Automated call summaries

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your API keys:
# - Vapi.ai API key
# - Twilio credentials
# - Supabase URL and key
# - OpenAI API key
```

### 2. Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the schema.sql file in the Supabase SQL editor
3. Copy your Supabase URL and anon key to `.env`

### 3. Vapi.ai Setup

1. Sign up at https://vapi.ai
2. Create a new phone number
3. Create an assistant (or use the API to create one)
4. Set webhook URL to: `https://your-backend-url.com/webhook/vapi`
5. Copy API key and phone number to `.env`

### 4. Twilio Setup

1. Sign up at https://twilio.com
2. Get a phone number
3. Copy Account SID, Auth Token, and phone number to `.env`
4. Set SMS webhook to: `https://your-backend-url.com/webhook/sms`

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your backend URL
```

## Running the Demo

### Start Backend
```bash
cd backend
source venv/bin/activate
python main.py
```

Backend will run on http://localhost:8000

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:3000

## Demo Flow

1. **Configure Business** - Set up "Bob's HVAC" with region and owner info
2. **Get Demo Number** - System provides a phone number to call
3. **Make Emergency Call** - Call with emergency scenario (gas leak, no heat)
4. **Watch Real-time** - See transcription and analysis in dashboard
5. **SMS Notification** - Technician receives emergency alert
6. **Escalation** - If no response in 5 min, escalates to owner
7. **Daily Report** - View generated call summary

## Demo Scenarios

### Emergency Call Script
> "Hi, I'm Sarah Mitchell at 847 Oak Street. Our furnace stopped working and there's a strong gas smell. We have two young children in the house and it's freezing outside."

**Expected Behavior:**
- AI detects "gas smell" + "no heat" + "children" = EMERGENCY
- Immediate SMS to on-call technician
- 5-minute escalation timer starts
- Rapid emergency report generated

### Standard Call Script
> "Hi, I'm John Davis at 123 Main Street. I'd like to schedule an AC tune-up before summer. My number is 555-0123."

**Expected Behavior:**
- AI categorizes as standard service request
- Collects customer information
- Creates service ticket
- Notifies technician for scheduling

## API Endpoints

- `POST /webhook/vapi` - Vapi.ai call events
- `POST /webhook/sms` - Twilio SMS responses
- `GET /api/businesses/{id}` - Get business details
- `GET /api/businesses/{id}/calls` - Get recent calls
- `POST /api/businesses/{id}/reports/generate` - Generate daily report

## Tech Stack

- **Backend**: FastAPI, Python 3.11+
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4, Vapi.ai
- **SMS**: Twilio
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS

## Environment Variables

### Backend (.env)
```
VAPI_API_KEY=your_vapi_key
VAPI_PHONE_NUMBER=your_vapi_phone
VAPI_ASSISTANT_ID=your_assistant_id
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Deployment

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy from `backend` directory
4. Update Vapi webhook URL

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy from `frontend` directory

## License

MIT
