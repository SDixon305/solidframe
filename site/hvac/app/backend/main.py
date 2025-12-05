"""
FastAPI main application - HVAC Demo System
"""
from fastapi import FastAPI, Request, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio
import os
from datetime import datetime, date

from database import db, Business, Technician, Call, DemoCall, supabase
from ai_handler import EmergencyDetector, CallAnalyzer
from sms_handler import SMSHandler, escalation_manager
from report_generator import report_gen
from config import FRONTEND_URL, BACKEND_URL
from area_code_mapping import infer_region_from_phone

app = FastAPI(title="HVAC Demo System API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class VapiWebhook(BaseModel):
    """Vapi.ai webhook payload"""
    type: str
    call: Dict[str, Any]
    message: Optional[Dict[str, Any]] = None


class BusinessCreate(BaseModel):
    """Business creation request"""
    name: str
    phone_number: str
    region: Optional[str] = None  # Optional - will be inferred from owner_phone if not provided
    hours_start: Optional[str] = None
    hours_end: Optional[str] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None


class TechnicianCreate(BaseModel):
    """Technician creation request"""
    business_id: str
    name: str
    phone_number: str
    email: Optional[str] = None
    is_on_call: bool = False
    priority_order: int = 1


# Helper function to get Vapi config
def get_vapi_config(business_name: str) -> Dict[str, Any]:
    """
    Read Vapi config from JSON file and replace placeholders.
    Also appends TRAINING_NOTES.md to the system prompt.
    """
    import json
    import os
    from pathlib import Path

    # Try to find the config file
    config_path = Path("docs/vapi/VAPI_ASSISTANT_FULL_CONFIG.json")
    if not config_path.exists():
        config_path = Path("../docs/vapi/VAPI_ASSISTANT_FULL_CONFIG.json")
    
    if not config_path.exists():
        # Fallback to hardcoded default if file not found
        return {
            "firstMessage": f"{business_name}, how may I help you?",
            "model": {
                "provider": "openai",
                "model": "gpt-4",
                "temperature": 0.7,
                "systemPrompt": f"You are a professional receptionist for {business_name}."
            }
        }

    with open(config_path, "r") as f:
        config_str = f.read()
    
    # Replace placeholders
    config_str = config_str.replace("{{BUSINESS_NAME}}", business_name)
    config_str = config_str.replace("{{SERVER_URL}}", BACKEND_URL)
    
    config = json.loads(config_str)

    # Append training notes if they exist
    training_notes_path = Path("docs/vapi/TRAINING_NOTES.md")
    if not training_notes_path.exists():
        training_notes_path = Path("../docs/vapi/TRAINING_NOTES.md")
    
    if training_notes_path.exists():
        with open(training_notes_path, "r") as f:
            training_notes = f.read().strip()
        
        if training_notes and "model" in config and "systemPrompt" in config["model"]:
            config["model"]["systemPrompt"] += f"\n\nADDITIONAL TRAINING INSTRUCTIONS:\n{training_notes}"
            print(f"✓ Appended training notes from {training_notes_path}")
    
    return config


# Routes
@app.get("/")
async def root():
    """Health check"""
    return {"status": "ok", "service": "HVAC Demo System"}


@app.post("/webhook/vapi")
async def vapi_webhook(webhook: VapiWebhook, background_tasks: BackgroundTasks):
    """
    Handle Vapi.ai webhooks for call events
    """
    event_type = webhook.type
    call_data = webhook.call

    print(f"📥 Received Vapi webhook: {event_type}")

    if event_type == "call-started":
        # Call initiated
        return await handle_call_started(call_data)

    elif event_type == "function-call":
        # AI extracted information during call
        return await handle_function_call(call_data, webhook.message)

    elif event_type == "call-ended":
        # Call completed - process and dispatch
        background_tasks.add_task(handle_call_ended, call_data)
        return {"status": "processing"}

    elif event_type == "transcript":
        # Real-time transcript update
        return await handle_transcript_update(call_data, webhook.message)

    elif event_type == "status-update":
        # Call status changed
        return await handle_status_update(call_data, webhook.message)

    return {"status": "received"}


@app.post("/webhook/call-ended")
async def call_ended_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Alternative endpoint for VAPI call-ended events
    VAPI may send to this endpoint instead of /webhook/vapi
    """
    try:
        data = await request.json()
        print(f"Received call-ended webhook: {data}")

        # Extract call data from the payload
        call_data = data.get('call', data)

        # Process in background
        background_tasks.add_task(handle_call_ended, call_data)

        return {"status": "processing", "message": "Call ended event received"}
    except Exception as e:
        print(f"Error in call-ended webhook: {e}")
        return {"status": "error", "message": str(e)}


async def handle_call_started(call_data: Dict[str, Any]):
    """Handle call start event"""
    # Create initial call record
    # For demo, we'll use a default business (Bob's HVAC)
    # In production, this would be determined by the phone number called

    business_id = "00000000-0000-0000-0000-000000000001"  # Demo business UUID
    vapi_call_id = call_data.get('id')

    # Extract customer phone from call data
    customer_info = call_data.get('customer', {})
    customer_phone = customer_info.get('number')

    call = Call(
        business_id=business_id,
        vapi_call_id=vapi_call_id,
        customer_phone=customer_phone,
        status='in_progress',
        transcript=''
    )

    result = db.create_call(call)
    print(f"📞 Call started - ID: {result.get('id')} from {customer_phone}")

    # Update demo_calls for real-time monitoring
    # Retry logic to find active demo call (handling race conditions)
    active_demo_call = None
    for i in range(3):
        active_demo_call = db.get_active_demo_call()
        if active_demo_call:
            break
        print(f"⚠️ No active demo call found, retrying ({i+1}/3)...")
        await asyncio.sleep(1)

    # Fallback: Check for any recent demo call created in the last 5 minutes
    if not active_demo_call:
        print("⚠️ Checking for recent demo calls as fallback...")
        # We'll need to add a method to get recent demo calls regardless of status
        # For now, we'll just try to get the most recent one created
        try:
            recent_calls = supabase.table('demo_calls')\
                .select('*')\
                .order('created_at', desc=True)\
                .limit(1)\
                .execute()
            
            if recent_calls.data:
                potential_call = recent_calls.data[0]
                # Check if it's recent (within 5 minutes)
                created_at = datetime.fromisoformat(potential_call['created_at'].replace('Z', '+00:00'))
                now = datetime.now(created_at.tzinfo)
                if (now - created_at).total_seconds() < 300:
                    active_demo_call = potential_call
                    print(f"⚠️ Found recent demo call {active_demo_call['id']} as fallback")
        except Exception as e:
            print(f"Error checking recent calls: {e}")

    if active_demo_call:
        # Get business name from active session for greeting
        session = supabase.table('demo_sessions')\
            .select('business_name')\
            .eq('id', active_demo_call['session_id'])\
            .execute()
        business_name = session.data[0]['business_name'] if session.data else 'HVAC Company'

        # Store vapi_call_id in metadata (since the column doesn't exist)
        current_metadata = active_demo_call.get('metadata', {}) or {}
        current_metadata['vapi_call_id'] = vapi_call_id
        
        # Update status to connected
        db.update_demo_call(active_demo_call['id'], {
            'metadata': current_metadata,
            'status': 'connected',
            'transcript': f"AI: {business_name}, how may I help you?"
        })
        print(f"🔗 Linked VAPI call {vapi_call_id} to demo_call {active_demo_call['id']}")
    else:
        print(f"❌ Could not link VAPI call {vapi_call_id} to any demo session")

    return {"status": "call_created", "call_id": result.get('id')}


async def handle_function_call(call_data: Dict[str, Any], message: Dict[str, Any]):
    """Handle AI function call during conversation"""
    function_name = message.get('functionCall', {}).get('name')
    parameters = message.get('functionCall', {}).get('parameters', {})
    
    if function_name == "extract_call_info":
        # Update call record with extracted information
        vapi_call_id = call_data.get('id')
        
        # Find call by vapi_call_id
        # Note: We'd need to add a method to search by vapi_call_id
        # For now, we'll return the data to be stored
        
        return {
            "result": {
                "success": True,
                "message": "Information recorded. I'm dispatching this to our team now."
            }
        }
    
    return {"result": {"success": False}}


async def handle_call_ended(call_data: Dict[str, Any]):
    """Process completed call - update with final data"""
    vapi_call_id = call_data.get('id')
    transcript = call_data.get('transcript', '')
    recording_url = call_data.get('recordingUrl')
    duration = call_data.get('duration')

    print(f"☎️ Call ended - VAPI ID: {vapi_call_id}")

    # Find the call by vapi_call_id
    try:
        result = supabase.table('calls')\
            .select('*')\
            .eq('vapi_call_id', vapi_call_id)\
            .execute()

        if result.data and len(result.data) > 0:
            call_record = result.data[0]
            call_id = call_record['id']

            # Update with final call data
            updates = {
                'status': 'completed',
                'recording_url': recording_url,
                'duration_seconds': duration
            }

            # If we have a full transcript from VAPI, use it
            # Otherwise keep the real-time transcript we built
            if transcript:
                updates['transcript'] = transcript

            db.update_call(call_id, updates)

            print(f"✅ Call {call_id} completed - Duration: {duration}s")
        else:
            # Call record doesn't exist yet - create it
            print(f"⚠️ No existing call record found for {vapi_call_id}, creating one")

            business_id = "00000000-0000-0000-0000-000000000001"
            customer_info = call_data.get('customer', {})

            call = Call(
                business_id=business_id,
                vapi_call_id=vapi_call_id,
                customer_phone=customer_info.get('number'),
                transcript=transcript,
                status='completed',
                recording_url=recording_url,
                duration_seconds=duration
            )

            result = db.create_call(call)
            print(f"✅ Call record created: {result.get('id')}")

    except Exception as e:
        print(f"❌ Error handling call-ended: {e}")

    # Update demo_calls for real-time monitoring
    try:
        demo_call = db.get_demo_call_by_vapi_id(vapi_call_id)
        if demo_call:
            db.update_demo_call(demo_call['id'], {
                'status': 'completed'
            })
            print(f"✅ Demo call {demo_call['id']} marked as completed")
    except Exception as e:
        print(f"Error updating demo_call on call-ended: {e}")


async def handle_transcript_update(call_data: Dict[str, Any], message: Dict[str, Any]):
    """Handle real-time transcript updates"""
    vapi_call_id = call_data.get('id')

    # Get transcript text from message
    transcript_text = message.get('transcript', '')
    role = message.get('role', 'unknown')  # 'user' or 'assistant'

    if not transcript_text:
        return {"status": "received"}

    # Determine speaker label
    speaker = "Customer" if role == "user" else "AI"
    new_line = f"{speaker}: {transcript_text}"

    # Update the calls table
    try:
        result = supabase.table('calls')\
            .select('*')\
            .eq('vapi_call_id', vapi_call_id)\
            .execute()

        if result.data and len(result.data) > 0:
            call_record = result.data[0]
            current_transcript = call_record.get('transcript', '')
            updated_transcript = current_transcript + '\n' + new_line if current_transcript else new_line

            db.update_call(call_record['id'], {
                'transcript': updated_transcript
            })

            print(f"📝 Transcript update: {speaker[:1]}: {transcript_text[:50]}...")
    except Exception as e:
        print(f"Error updating calls transcript: {e}")

    # Update demo_calls for real-time monitoring
    try:
        demo_call = db.get_demo_call_by_vapi_id(vapi_call_id)
        if demo_call:
            current_transcript = demo_call.get('transcript', '')
            updated_transcript = current_transcript + '\n' + new_line if current_transcript else new_line

            # Set status based on who's speaking
            new_status = 'listening' if role == 'user' else 'processing'

            db.update_demo_call(demo_call['id'], {
                'transcript': updated_transcript,
                'status': new_status
            })
            print(f"🎙️ Demo call transcript updated - status: {new_status}")
    except Exception as e:
        print(f"Error updating demo_calls transcript: {e}")

    return {"status": "received"}


async def handle_status_update(call_data: Dict[str, Any], message: Dict[str, Any]):
    """Handle call status updates"""
    vapi_call_id = call_data.get('id')
    status = message.get('status') if message else call_data.get('status')

    if not status:
        return {"status": "received"}

    print(f"🔄 Status update: {status}")

    # Map VAPI statuses to our statuses
    status_map = {
        'queued': 'received',
        'ringing': 'received',
        'in-progress': 'in_progress',
        'forwarding': 'in_progress',
        'ended': 'completed'
    }

    our_status = status_map.get(status, status)

    # Find and update the call
    try:
        result = supabase.table('calls')\
            .select('*')\
            .eq('vapi_call_id', vapi_call_id)\
            .execute()

        if result.data and len(result.data) > 0:
            call_record = result.data[0]
            db.update_call(call_record['id'], {
                'status': our_status
            })
    except Exception as e:
        print(f"Error updating status: {e}")

    return {"status": "received"}


# Business Management Routes
@app.post("/api/businesses")
async def create_business(business: BusinessCreate):
    """Create a new business"""
    business_data = business.model_dump()

    # Infer region from owner_phone if region not provided
    if not business_data.get('region') and business_data.get('owner_phone'):
        business_data['region'] = infer_region_from_phone(business_data['owner_phone'])
        print(f"Inferred region '{business_data['region']}' from phone {business_data['owner_phone']}")
    elif not business_data.get('region'):
        # Default to south if no region and no phone
        business_data['region'] = 'south'

    biz = Business(**business_data)
    result = db.create_business(biz)
    return result


@app.get("/api/businesses/{business_id}")
async def get_business(business_id: str):
    """Get business details"""
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@app.patch("/api/businesses/{business_id}")
async def update_business(business_id: str, business: BusinessCreate):
    """Update business details and sync with VAPI"""
    # Update business in database
    biz_data = business.model_dump()

    # Infer region from owner_phone if region not provided
    if not biz_data.get('region') and biz_data.get('owner_phone'):
        biz_data['region'] = infer_region_from_phone(biz_data['owner_phone'])
        print(f"Inferred region '{biz_data['region']}' from phone {biz_data['owner_phone']}")

    result = db.update_business(business_id, biz_data)

    if not result:
        raise HTTPException(status_code=404, detail="Business not found")

    # If this is the demo business, update VAPI assistant
    if business_id == "00000000-0000-0000-0000-000000000001":
        try:
            from config import VAPI_API_KEY, VAPI_ASSISTANT_ID
            import httpx
            # Get config from helper
            vapi_config = get_vapi_config(business_name)
            
            # Extract the parts we want to update
            update_payload = {
                "model": vapi_config["model"],
                "firstMessage": vapi_config["firstMessage"],
                "voice": vapi_config["voice"]
            }
            
            async with httpx.AsyncClient() as client:
                vapi_response = await client.patch(
                    f"https://api.vapi.ai/assistant/{VAPI_ASSISTANT_ID}",
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {VAPI_API_KEY}"
                    },
                    json=update_payload
                )

                if vapi_response.status_code == 200:
                    print(f"✅ Synced VAPI assistant with updated business name: {business_name}")
                else:
                    print(f"⚠️  Failed to sync VAPI assistant: {vapi_response.text}")
                
        except Exception as e:
            print(f"⚠️  Error syncing VAPI assistant: {e}")
            # Don't fail the business update if VAPI sync fails

    return result


# Technician Management Routes
@app.post("/api/technicians")
async def create_technician(tech: TechnicianCreate):
    """Create a new technician"""
    technician = Technician(**tech.model_dump())
    result = db.create_technician(technician)
    return result


@app.get("/api/businesses/{business_id}/technicians")
async def get_technicians(business_id: str):
    """Get all technicians for a business"""
    techs = db.get_on_call_technicians(business_id)
    return techs


# Call Management Routes
@app.get("/api/businesses/{business_id}/calls")
async def get_calls(business_id: str, limit: int = 50):
    """Get recent calls for a business"""
    calls = db.get_calls_by_business(business_id, limit)
    return calls


@app.get("/api/calls/{call_id}")
async def get_call(call_id: str):
    """Get call details"""
    call = db.get_call(call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call


@app.get("/api/businesses/{business_id}/calls/latest")
async def get_latest_call(business_id: str):
    """Get the most recent call for a business"""
    calls = db.get_calls_by_business(business_id, limit=1)
    if not calls or len(calls) == 0:
        raise HTTPException(status_code=404, detail="No calls found")
    return calls[0]


# Report Routes
@app.post("/api/businesses/{business_id}/reports/generate")
async def generate_report(business_id: str, report_date: Optional[str] = None):
    """Generate daily report for a business"""
    if report_date:
        date_obj = date.fromisoformat(report_date)
    else:
        date_obj = date.today()
    
    report = report_gen.generate_daily_report(business_id, date_obj)
    return report


@app.get("/api/businesses/{business_id}/reports/{report_date}")
async def get_report(business_id: str, report_date: str):
    """Get existing daily report"""
    report = db.get_daily_report(business_id, report_date)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


# Twilio SMS Webhook (for receiving technician responses)
@app.post("/webhook/sms")
async def sms_webhook(request: Request):
    """Handle incoming SMS from technicians"""
    form_data = await request.form()
    message_body = form_data.get('Body')

    # Parse response
    response = SMSHandler.parse_technician_response(message_body)

    if response['action'] == 'accept':
        # Find pending notification for this technician
        # Update call status to accepted
        # Send confirmation to customer
        pass

    return {"status": "received"}


# Demo Call Monitoring Endpoints
class StartMonitoringRequest(BaseModel):
    """Request to start call monitoring"""
    session_id: str


@app.post("/api/demo/start-monitoring")
async def start_demo_monitoring(request: StartMonitoringRequest):
    """
    Start monitoring for a demo call.
    Creates a demo_call record that the frontend can subscribe to via Supabase real-time.
    """
    try:
        session_id = request.session_id

        # Verify session exists
        session = supabase.table('demo_sessions')\
            .select('*')\
            .eq('id', session_id)\
            .execute()

        if not session.data:
            raise HTTPException(status_code=404, detail="Session not found")

        # Check if there's already an active demo call for this session
        existing = db.get_demo_call_by_session(session_id)
        if existing and existing.get('status') not in ['completed']:
            # Return existing call
            return {
                "success": True,
                "demo_call_id": existing['id'],
                "status": existing['status'],
                "message": "Resumed existing call monitoring"
            }

        # Create new demo call record
        demo_call = DemoCall(
            session_id=session_id,
            status='connecting',
            transcript='',
            metadata={}
        )

        result = db.create_demo_call(demo_call)

        if not result:
            raise HTTPException(status_code=500, detail="Failed to create demo call")

        print(f"📞 Demo call monitoring started - ID: {result['id']} for session: {session_id}")

        return {
            "success": True,
            "demo_call_id": result['id'],
            "status": "connecting",
            "message": "Call monitoring started. Waiting for incoming call..."
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error starting demo monitoring: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/demo/call-status")
async def update_demo_call_status(request: Request):
    """
    Update demo call status (for testing/debugging)
    """
    try:
        data = await request.json()
        demo_call_id = data.get('demo_call_id')
        status = data.get('status')
        transcript_line = data.get('transcript_line')

        if not demo_call_id:
            raise HTTPException(status_code=400, detail="demo_call_id required")

        updates = {}
        if status:
            updates['status'] = status

        if transcript_line:
            # Get current transcript and append
            current = supabase.table('demo_calls')\
                .select('transcript')\
                .eq('id', demo_call_id)\
                .execute()

            current_transcript = current.data[0]['transcript'] if current.data else ''
            updates['transcript'] = current_transcript + '\n' + transcript_line if current_transcript else transcript_line

        if updates:
            db.update_demo_call(demo_call_id, updates)

        return {"success": True, "updates": updates}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating demo call status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# VAPI Tool Webhooks (called by AI during conversation)
@app.post("/webhook/lookup-customer")
async def lookup_customer(request: Request):
    """
    Look up a customer by phone number to see if they are an existing client.
    Called by VAPI AI during phone conversation.
    """
    try:
        data = await request.json()
        phone_number = data.get('phone_number', '')

        print(f"Looking up customer: {phone_number}")

        # Search for existing calls from this customer
        # Get demo business
        business = db.get_business("00000000-0000-0000-0000-000000000001")
        if not business:
            return {
                "success": False,
                "message": "System error - unable to look up customer",
                "is_existing_customer": False
            }

        # Search recent calls by phone number
        all_calls = db.get_calls_by_business("00000000-0000-0000-0000-000000000001", limit=100)
        existing_calls = [
            call for call in all_calls
            if call.get('customer_phone') == phone_number
        ]

        if existing_calls:
            # Found existing customer
            latest_call = existing_calls[0]
            return {
                "success": True,
                "is_existing_customer": True,
                "customer_name": latest_call.get('customer_name', 'Unknown'),
                "customer_address": latest_call.get('customer_address', 'Unknown'),
                "previous_calls_count": len(existing_calls),
                "message": f"Welcome back! I have your information on file. How can we help you today?"
            }
        else:
            # New customer
            return {
                "success": True,
                "is_existing_customer": False,
                "message": "I don't see you in our system yet. Can I get your name and address?"
            }

    except Exception as e:
        print(f"Error in lookup_customer: {e}")
        return {
            "success": False,
            "message": "I'm having trouble looking up your information. Let me take your details.",
            "is_existing_customer": False
        }


@app.post("/webhook/dispatch-emergency")
async def dispatch_emergency(request: Request):
    """
    Dispatch a technician for an emergency situation.
    Called by VAPI AI when it detects an emergency.
    """
    try:
        data = await request.json()
        customer_name = data.get('customer_name', 'Unknown')
        address = data.get('address', 'Unknown')
        issue = data.get('issue', 'Emergency situation')

        print(f"Emergency dispatch: {customer_name} at {address} - {issue}")

        # Get on-call technicians
        technicians = db.get_on_call_technicians("00000000-0000-0000-0000-000000000001")

        if not technicians:
            return {
                "success": False,
                "message": "I'm very sorry, but I don't have any technicians available right now. Let me escalate this to our owner immediately."
            }

        # Create emergency call record
        call = Call(
            business_id="00000000-0000-0000-0000-000000000001",
            customer_name=customer_name,
            customer_address=address,
            issue_description=issue,
            priority_level="emergency",
            status="dispatching"
        )

        call_result = db.create_call(call)
        call_id = call_result.get('id')

        # Dispatch to first available technician
        primary_tech = technicians[0]

        # Update call with technician assignment
        db.update_call(call_id, {
            "status": "dispatched",
            "assigned_tech_id": primary_tech['id'],
            "dispatched_at": datetime.utcnow().isoformat()
        })

        # Send emergency SMS
        customer_info = {
            "customer_name": customer_name,
            "customer_address": address
        }

        notification_id = SMSHandler.send_emergency_alert(
            call_id=call_id,
            technician_phone=primary_tech['phone_number'],
            customer_info=customer_info,
            issue_description=issue
        )

        # Start escalation monitoring if owner phone is available
        business = db.get_business("00000000-0000-0000-0000-000000000001")
        if notification_id and business and business.get('owner_phone'):
            asyncio.create_task(
                escalation_manager.monitor_technician_response(
                    call_id=call_id,
                    notification_id=notification_id,
                    owner_phone=business['owner_phone'],
                    customer_info=customer_info,
                    issue_description=issue
                )
            )

        return {
            "success": True,
            "message": f"I'm dispatching our emergency technician {primary_tech['name']} to your location right away. They should arrive within 30-60 minutes. Please stay safe.",
            "technician_name": primary_tech['name'],
            "estimated_arrival": "30-60 minutes"
        }

    except Exception as e:
        print(f"Error in dispatch_emergency: {e}")
        return {
            "success": False,
            "message": "I'm having trouble dispatching a technician. Let me transfer you to our emergency line."
        }


@app.post("/webhook/check-calendar")
async def check_calendar(request: Request):
    """
    Check for available appointment slots for routine service.
    Called by VAPI AI for non-emergency scheduling.
    """
    try:
        data = await request.json()
        service_type = data.get('service_type', 'maintenance')

        print(f"Checking calendar for: {service_type}")

        # For demo purposes, return some available slots
        # In production, this would check actual technician availability
        available_slots = [
            "Tomorrow morning between 9 AM and 12 PM",
            "Tomorrow afternoon between 1 PM and 4 PM",
            "Day after tomorrow, any time between 8 AM and 5 PM"
        ]

        return {
            "success": True,
            "available_slots": available_slots,
            "message": f"For {service_type}, I have availability: {available_slots[0]}, {available_slots[1]}, or {available_slots[2]}. Which works best for you?"
        }

    except Exception as e:
        print(f"Error in check_calendar: {e}")
        return {
            "success": False,
            "message": "I'm having trouble checking our calendar. Would you like me to have someone call you back to schedule?"
        }


# VAPI Tool Calls Endpoint (Unified for Demo)
@app.post("/webhook/vapi-call-status")
async def vapi_tool_handler(request: Request):
    """
    Unified endpoint for all VAPI tool calls (DEMO MODE)
    Returns dummy data instantly for demonstration purposes
    SMS goes to the owner_phone from the active demo_session
    """
    try:
        data = await request.json()
        print(f"VAPI Tool Call: {data}")

        # Get the demo phone from active demo_session
        from config import SUPABASE_URL, SUPABASE_KEY
        import httpx

        demo_phone = None
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{SUPABASE_URL}/rest/v1/demo_sessions",
                    headers={
                        "apikey": SUPABASE_KEY,
                        "Authorization": f"Bearer {SUPABASE_KEY}"
                    },
                    params={
                        "is_active": "eq.true",
                        "select": "owner_phone,business_name",
                        "limit": "1"
                    }
                )
                if response.status_code == 200:
                    sessions = response.json()
                    if sessions:
                        demo_phone = sessions[0].get('owner_phone')
                        print(f"📱 Demo phone from session: {demo_phone}")
        except Exception as e:
            print(f"⚠️ Could not fetch demo_session: {e}")

        # Extract the message/function call info
        message = data.get('message', {})
        function_call = message.get('functionCall', message.get('function_call', {}))
        function_name = function_call.get('name', function_call.get('function', {}).get('name'))
        parameters = function_call.get('parameters', function_call.get('arguments', {}))

        print(f"Function: {function_name}, Parameters: {parameters}")

        # Return dummy data based on function name
        if function_name == "lookup_customer":
            first_name = parameters.get('first_name', 'John')
            last_name = parameters.get('last_name', 'Smith')

            # Return data without a message - let the system prompt guide the response
            return {
                "results": [{
                    "customer_name": f"{first_name} {last_name}",
                    "address": "456 Ocean Drive, West Palm Beach, FL 33401",
                    "phone": "+1-561-555-0199",
                    "status": "Active Customer",
                    "member_since": "2023"
                }]
            }

        elif function_name == "check_technician_availability":
            emergency_type = parameters.get('emergency_type', 'HVAC emergency')
            customer_address = parameters.get('customer_address', '123 Main Street, Miami FL')
            confirmation_number = "HVAC-" + str(hash(emergency_type))[-6:]

            # Use demo_phone from session (both customer and tech SMS go to demo user)
            sms_target = demo_phone
            if sms_target:
                from sms_handler import SMSHandler

                # Customer confirmation
                customer_msg = f"🚨 EMERGENCY SERVICE DISPATCHED\n\nTechnician: Mike Rodriguez\nETA: 45 minutes\nAddress: {customer_address}\nConfirmation: {confirmation_number}\n\nMike will call when he's 10 minutes away."
                SMSHandler.send_sms(sms_target, customer_msg)

                # Technician alert (demo user sees what technician receives)
                tech_msg = f"🚨 EMERGENCY DISPATCH - {emergency_type.upper()}\n\nCustomer Address: {customer_address}\nETA Required: 45 min\nConfirmation: {confirmation_number}\n\nReply 'ACCEPT' to confirm or 'BUSY' if unavailable."
                SMSHandler.send_sms(sms_target, tech_msg)
            else:
                print("⚠️ No demo_phone configured - SMS not sent")

            return {
                "results": [{
                    "available": True,
                    "technician_name": "Mike Rodriguez",
                    "eta_minutes": 45,
                    "confirmation_number": confirmation_number,
                    "message": "Perfect, I have Mike Rodriguez available and I'm dispatching him to your location right now. He'll arrive in approximately 45 minutes. Your confirmation number is " + confirmation_number + ". You'll receive two text messages - one as the customer and one showing what the technician receives."
                }]
            }

        elif function_name == "book_appointment":
            customer_name = parameters.get('customer_name', 'Customer')
            service_type = parameters.get('service_type', 'service')
            phone_number = parameters.get('phone_number', '')
            confirmation_number = "APT-" + str(hash(customer_name))[-6:]

            # Use demo_phone from session (both customer and tech SMS go to demo user)
            sms_target = demo_phone
            if sms_target:
                from sms_handler import SMSHandler

                # Customer confirmation
                customer_msg = f"📅 APPOINTMENT CONFIRMED\n\n{service_type}\nTomorrow at 2:00 PM\nTechnician: Mike Rodriguez\nConfirmation: {confirmation_number}\n\nWe'll text you 30 minutes before arrival."
                SMSHandler.send_sms(sms_target, customer_msg)

                # Technician assignment (demo user sees what tech gets)
                tech_msg = f"📅 NEW APPOINTMENT - {service_type.upper()}\n\nTomorrow 2:00 PM\nCustomer: {customer_name}\nPhone: {phone_number or sms_target}\nConfirmation: {confirmation_number}\n\nReview job details in portal."
                SMSHandler.send_sms(sms_target, tech_msg)
            else:
                print("⚠️ No demo_phone configured - SMS not sent")

            return {
                "results": [{
                    "appointment_scheduled": True,
                    "scheduled_date": "Tomorrow, 2:00 PM",
                    "technician_assigned": "Mike Rodriguez",
                    "confirmation_number": confirmation_number,
                    "message": f"Perfect! I've scheduled your {service_type} appointment for tomorrow at 2 PM. Mike Rodriguez will be your technician. Your confirmation number is {confirmation_number}. You'll receive two text messages - your confirmation and what the technician receives."
                }]
            }

        # Default response for unknown functions
        return {
            "results": [{
                "success": True,
                "message": "Request received and processed."
            }]
        }

    except Exception as e:
        print(f"Error in vapi tool handler: {e}")
        return {
            "results": [{
                "success": False,
                "message": "I apologize, I'm having trouble processing that request. Let me transfer you to our support team."
            }]
        }


# VAPI Greeting Update Endpoint
@app.post("/api/update-vapi-greeting")
async def update_vapi_greeting(request: Request):
    """
    Update VAPI assistant using the config template file.
    Reads VAPI_ASSISTANT_FULL_CONFIG.json and replaces {{BUSINESS_NAME}} placeholders.
    Called from frontend when user configures their business.
    """
    try:
        from config import VAPI_API_KEY, VAPI_ASSISTANT_ID
        import httpx

        data = await request.json()
        business_name = data.get('business_name', 'HVAC Company')

        print(f"📝 Updating VAPI assistant with business name: {business_name}")

        # Get config from helper
        vapi_config = get_vapi_config(business_name)
        
        print(f"✓ Generated config for: {business_name}")
        print(f"  - First Message: {vapi_config.get('firstMessage', 'N/A')}")

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.patch(
                f"https://api.vapi.ai/assistant/{VAPI_ASSISTANT_ID}",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {VAPI_API_KEY}"
                },
                json=vapi_config
            )

            if response.status_code == 200:
                print(f"✅ Successfully updated VAPI assistant for '{business_name}'")
                return {"success": True, "business_name": business_name}
            else:
                print(f"❌ Failed to update VAPI assistant: {response.status_code} - {response.text}")
                return {"success": False, "error": response.text}

    except Exception as e:
        print(f"❌ Error updating VAPI greeting: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}


# VAPI Assistant Update Endpoint
@app.post("/api/update-vapi-assistant")
async def update_vapi_assistant(request: Request):
    """
    Update VAPI assistant configuration when business name changes
    Called after business name is updated in database
    """
    try:
        from config import VAPI_API_KEY, VAPI_ASSISTANT_ID

        # Get business from database
        business_id = "00000000-0000-0000-0000-000000000001"
        business = db.get_business(business_id)

        if not business:
            return {"success": False, "error": "Business not found"}

        business_name = business.get('name', 'our company')

        # Get config from helper
        vapi_config = get_vapi_config(business_name)

        # Update VAPI assistant with new configuration
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"https://api.vapi.ai/assistant/{VAPI_ASSISTANT_ID}",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {VAPI_API_KEY}"
                },
                json={
                    "firstMessage": vapi_config["firstMessage"],
                    "model": vapi_config["model"]
                }
            )

            if response.status_code == 200:
                print(f"✅ Updated VAPI assistant with business name: {business_name}")
                return {"success": True, "business_name": business_name}
            else:
                print(f"❌ Failed to update VAPI assistant: {response.text}")
                return {"success": False, "error": response.text}

    except Exception as e:
        print(f"Error updating VAPI assistant: {e}")
        return {"success": False, "error": str(e)}


# VAPI Dynamic Configuration Endpoint
@app.post("/webhook/vapi-config")
async def vapi_config_webhook(request: Request):
    """
    Dynamic assistant configuration endpoint for VAPI
    VAPI calls this to get business-specific greeting and configuration
    """
    try:
        data = await request.json()
        print(f"VAPI config request: {data}")

        # For demo, use the active session
        # This ensures we get the business name the user just configured
        active_session = db.get_active_demo_session()
        
        if active_session:
            business_name = active_session.get('business_name', 'HVAC Company')
            print(f"✓ Found active demo session for: {business_name}")
        else:
            # Fallback to default business if no active session
            business_id = "00000000-0000-0000-0000-000000000001"
            business = db.get_business(business_id)
            business_name = business.get('name', 'our company') if business else 'HVAC Company'
            print(f"⚠️ No active demo session, using fallback: {business_name}")

        # Get config from helper
        vapi_config = get_vapi_config(business_name)

        # Return dynamic configuration with business-specific greeting
        return {
            "assistant": {
                "firstMessage": vapi_config["firstMessage"],
                "model": vapi_config["model"]
            }
        }

    except Exception as e:
        print(f"Error in vapi-config webhook: {e}")
        # Return fallback configuration
        return {
            "assistant": {
                "firstMessage": "Hello, how may I help you?",
                "model": {
                    "systemPrompt": "You are a helpful assistant."
                }
            }
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
