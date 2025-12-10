# Call Monitoring Fix Plan

## Status: IMPLEMENTED ✅

All phases have been completed. See "Setup Instructions" at the bottom to activate.

---

## Problem Summary

When clicking "I'm Calling Now", the UI shows "Connecting..." but nothing happens afterward. The call never progresses, and no transcript is displayed.

## Root Cause Analysis

### Issue 1: No Connection to VAPI Real-Time Events
The frontend listens to a Supabase table (`demo_calls`) that **doesn't exist** and has no mechanism to receive VAPI webhook events in real-time.

**Current Flow (Broken):**
1. User clicks "I'm Calling Now" → `startCallMonitoring()` called
2. Status set to `'connecting'` → UI shows spinner
3. Supabase listener set up for `demo_calls` table (doesn't exist!)
4. Nothing happens → Spinner forever

**Expected Flow:**
1. User clicks "I'm Calling Now"
2. Frontend subscribes to real-time updates
3. User calls the VAPI phone number from their real phone
4. VAPI receives call → sends webhooks to backend
5. Backend creates/updates call record → triggers Supabase real-time
6. Frontend receives update → shows transcript in real-time

### Issue 2: Schema Mismatch
- Hook listens to `demo_calls` table → Table doesn't exist (only `calls` exists)
- Hook filters by `session_id` → Column doesn't exist in `calls` table
- No link between demo sessions and calls

### Issue 3: No Real-Time Transcript Bridge
- Backend receives VAPI webhooks with transcript updates
- Backend stores in `calls` table
- Frontend has no way to receive these updates in real-time

---

## Implementation Plan

### Phase 1: Database Schema Updates

**1.1 Create `demo_calls` table for real-time demo tracking**

```sql
CREATE TABLE IF NOT EXISTS demo_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES demo_sessions(id) ON DELETE CASCADE,
  vapi_call_id TEXT,
  status TEXT DEFAULT 'connecting' CHECK (status IN ('connecting', 'connected', 'listening', 'processing', 'completed')),
  transcript TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE demo_calls;

-- RLS policies for demo access
ALTER TABLE demo_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on demo_calls" ON demo_calls FOR ALL USING (true) WITH CHECK (true);
```

**1.2 Enable Supabase Realtime on the table**

This allows the frontend to subscribe to INSERT/UPDATE events.

---

### Phase 2: Backend Modifications

**2.1 Link VAPI calls to demo sessions**

Modify `handle_call_started` and `handle_transcript_update` in `backend/main.py` to:
1. Find the active demo session when a call comes in
2. Create a `demo_calls` record linked to the session
3. Update the `demo_calls` record with transcript updates

**2.2 Add endpoint to initialize call monitoring**

New endpoint: `POST /api/demo/start-monitoring`
- Receives `session_id` from frontend
- Creates initial `demo_calls` record with status `'connecting'`
- Returns the `demo_call_id` for tracking

**2.3 Update webhook handlers to push to demo_calls**

When VAPI sends transcript events:
1. Find the `demo_calls` record by `vapi_call_id`
2. Update transcript and status
3. Supabase real-time broadcasts to frontend

---

### Phase 3: Frontend Real-Time Integration

**3.1 Fix `useRealCallWorkflow.ts`**

Update the hook to:
1. Call backend to create `demo_calls` record when "I'm Calling Now" clicked
2. Subscribe to correct table (`demo_calls`) with correct filter (`session_id`)
3. Handle INSERT → set status to `'connected'`
4. Handle UPDATE → update transcript and status

**3.2 Enhanced transcript display**

Format transcript updates for beautiful display:
- Parse `AI:` and `Customer:` prefixes
- Add timestamps
- Smooth animations as new lines appear
- Auto-scroll to bottom

---

### Phase 4: Call Flow Improvements

**4.1 Status state machine**

```
idle → connecting → connected → listening ↔ processing → completed
```

- `connecting`: User clicked button, waiting for VAPI call to connect
- `connected`: VAPI call started (first webhook received)
- `listening`: AI is listening to customer speak
- `processing`: AI is thinking/responding
- `completed`: Call ended

**4.2 Better status detection from VAPI webhooks**

Map VAPI events to our status:
- `call-started` → `connected`
- `speech-started` (user) → `listening`
- `speech-started` (assistant) → `processing`
- `transcript` → append to transcript
- `call-ended` → `completed`

---

## Detailed File Changes

### File 1: `backend/migrations/create_demo_calls.sql` (NEW)

Create the demo_calls table with real-time enabled.

### File 2: `backend/main.py`

1. Add `POST /api/demo/start-monitoring` endpoint
2. Modify `handle_call_started` to create/link demo_call
3. Modify `handle_transcript_update` to update demo_calls
4. Add speech event handling for status updates

### File 3: `frontend/hooks/useRealCallWorkflow.ts`

1. Call backend when starting monitoring
2. Fix Supabase subscription to correct table
3. Handle all event types properly
4. Better error handling

### File 4: `frontend/components/LiveCallStatus.tsx`

1. Add `connected` status visualization (currently missing)
2. Improve transcript formatting
3. Better loading/error states

---

## Architecture Overview

```
┌─────────────────┐    Phone Call    ┌─────────────────┐
│  User's Phone   │ ───────────────► │    VAPI.ai      │
└─────────────────┘                  └────────┬────────┘
                                              │
                                              │ Webhooks
                                              ▼
┌─────────────────┐                  ┌─────────────────┐
│    Frontend     │ ◄────────────────│    Backend      │
│  (React/Next)   │   Supabase       │   (FastAPI)     │
│                 │   Real-time      │                 │
│ - LiveCallStatus│                  │ - /webhook/vapi │
│ - Transcript    │                  │ - Updates DB    │
└────────┬────────┘                  └────────┬────────┘
         │                                    │
         │         ┌─────────────────┐        │
         └────────►│    Supabase     │◄───────┘
                   │   (Postgres)    │
                   │                 │
                   │ - demo_sessions │
                   │ - demo_calls    │
                   │ - Real-time     │
                   └─────────────────┘
```

---

## Implementation Order

1. **Database**: Create `demo_calls` table with real-time enabled
2. **Backend**: Add start-monitoring endpoint
3. **Backend**: Update webhook handlers to write to `demo_calls`
4. **Frontend**: Fix hook to use new endpoint and correct table
5. **Frontend**: Add `connected` status and improve transcript display
6. **Testing**: End-to-end test with real VAPI call

---

## Success Criteria

After implementation:
1. User clicks "I'm Calling Now" → Status shows "Connecting..."
2. User calls VAPI number from their phone
3. Call connects → Status changes to "Connected"
4. AI speaks → Status shows "Processing", transcript shows AI text
5. User speaks → Status shows "Listening", transcript shows user text
6. Conversation continues with real-time transcript updates
7. Call ends → Status shows "Completed", full transcript visible

---

## Testing Plan

1. **Unit Tests**
   - Hook state transitions
   - Supabase subscription setup/teardown

2. **Integration Tests**
   - Backend webhook handlers
   - Database writes trigger real-time

3. **E2E Tests**
   - Full flow from button click to completed call
   - Transcript accuracy

4. **Manual Testing**
   - Real phone call to VAPI number
   - Multiple concurrent demo sessions
   - Network interruption recovery

---

## Setup Instructions

### Step 1: Run the Database Migration

Run the following SQL in your Supabase SQL Editor:

```sql
-- Copy contents from: backend/migrations/create_demo_calls.sql
```

Or run directly:
```bash
# If you have Supabase CLI configured
supabase db push
```

### Step 2: Verify Real-time is Enabled

In Supabase Dashboard:
1. Go to **Database** → **Replication**
2. Ensure `demo_calls` table is listed under "Tables being replicated"
3. If not, run: `ALTER PUBLICATION supabase_realtime ADD TABLE demo_calls;`

### Step 3: Restart Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### Step 4: Test the Flow

1. Open the frontend at http://localhost:3000
2. Configure a business in Step 1
3. Click "I'm Calling Now"
4. Call the VAPI phone number from your real phone
5. Watch the transcript appear in real-time!

---

## Files Changed

| File | Change |
|------|--------|
| `backend/migrations/create_demo_calls.sql` | NEW - Migration for demo_calls table |
| `backend/database.py` | Added DemoCall model and CRUD operations |
| `backend/main.py` | Added `/api/demo/start-monitoring` endpoint, updated webhooks |
| `frontend/hooks/useRealCallWorkflow.ts` | Fixed to call backend and use correct Supabase subscription |
| `frontend/components/LiveCallStatus.tsx` | Added `connected` status, enhanced transcript display |
