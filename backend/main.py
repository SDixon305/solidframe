"""
FastAPI main application - HVAC Demo System
"""
from fastapi import FastAPI, Request, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio
from datetime import datetime, date

from database import db, Business, Technician, Call
from ai_handler import EmergencyDetector, CallAnalyzer
from sms_handler import SMSHandler, escalation_manager
from report_generator import report_gen
from config import FRONTEND_URL
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

    # Extract customer phone from call data
    customer_info = call_data.get('customer', {})
    customer_phone = customer_info.get('number')

    call = Call(
        business_id=business_id,
        vapi_call_id=call_data.get('id'),
        customer_phone=customer_phone,
        status='in_progress',
        transcript=''
    )

    result = db.create_call(call)
    print(f"📞 Call started - ID: {result.get('id')} from {customer_phone}")
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


async def handle_transcript_update(call_data: Dict[str, Any], message: Dict[str, Any]):
    """Handle real-time transcript updates"""
    vapi_call_id = call_data.get('id')

    # Get transcript text from message
    transcript_text = message.get('transcript', '')
    role = message.get('role', 'unknown')  # 'user' or 'assistant'

    if not transcript_text:
        return {"status": "received"}

    # Find the call by vapi_call_id
    # We need to query Supabase to find the call
    try:
        result = supabase.table('calls')\
            .select('*')\
            .eq('vapi_call_id', vapi_call_id)\
            .execute()

        if result.data and len(result.data) > 0:
            call_record = result.data[0]
            current_transcript = call_record.get('transcript', '')

            # Append new transcript line
            speaker = "Customer" if role == "user" else "Agent"
            new_line = f"\n{speaker}: {transcript_text}"
            updated_transcript = current_transcript + new_line

            # Update the call record
            db.update_call(call_record['id'], {
                'transcript': updated_transcript
            })

            print(f"📝 Transcript update: {speaker[:1]}: {transcript_text[:50]}...")
    except Exception as e:
        print(f"Error updating transcript: {e}")

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

            business_name = business.name

            async with httpx.AsyncClient() as client:
                vapi_response = await client.patch(
                    f"https://api.vapi.ai/assistant/{VAPI_ASSISTANT_ID}",
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {VAPI_API_KEY}"
                    },
                    json={
                        "firstMessage": f"{business_name}, how may I help you?",
                        "model": {
                            "provider": "openai",
                            "model": "gpt-4",
                            "temperature": 0.7,
                            "systemPrompt": f"""You are a professional receptionist for {business_name}, an HVAC company serving customers in South Florida. Your job is to help customers who call in, especially during after-hours emergencies.

IMPORTANT CONTEXT:
- Business Name: {business_name}
- You have access to customer records via the lookup_customer tool
- You can check technician availability in real-time
- You can book appointments for routine service

EMERGENCY DETECTION:
If the customer mentions ANY of these, treat it as an emergency:
- Heat wave, extreme heat, or temperatures over 95°F
- Elderly person, senior citizen, or anyone over 80 years old
- Health risk, medical condition, or safety concern
- No AC/heating in extreme weather conditions
- Words like "emergency", "urgent", "critical"
- Young children or infants in uncomfortable conditions

CALL FLOW:
1. Greet: "{business_name}, how may I help you?"
2. Listen carefully to their issue
3. Ask: "Are you a current customer of ours?"
4. If YES: Ask for their "first and last name please"
5. Use the lookup_customer tool to get their information
6. Confirm their address from the records
7. If EMERGENCY detected: Use check_technician_availability tool immediately
8. If tech available: Inform customer of dispatch and ETA
9. If NOT emergency: Use book_appointment tool for scheduling
10. Always ask for the best phone number for text confirmation
11. Repeat the number back to confirm accuracy
12. Provide a summary of what will happen next

TONE: Professional, calm, reassuring, and friendly. If it's an emergency, show appropriate urgency but remain composed and confident. Make customers feel they're in good hands.

REMEMBER: You speak FIRST when answering the phone. Don't wait for the customer to say hello."""
                        }
                    }
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
    from_number = form_data.get('From')
    message_body = form_data.get('Body')

    # Parse response
    response = SMSHandler.parse_technician_response(message_body)

    if response['action'] == 'accept':
        # Find pending notification for this technician
        # Update call status to accepted
        # Send confirmation to customer
        pass

    return {"status": "received"}


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
    """
    try:
        data = await request.json()
        print(f"VAPI Tool Call: {data}")

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

            # Get the caller's phone number from VAPI data
            call_info = data.get('call', {})
            customer_phone = call_info.get('customer', {}).get('number', data.get('message', {}).get('call', {}).get('customer', {}).get('number'))

            # Send SMS to customer (the demo user gets BOTH messages)
            if customer_phone:
                from sms_handler import SMSHandler

                # Customer confirmation
                customer_msg = f"🚨 EMERGENCY SERVICE DISPATCHED\n\nTechnician: Mike Rodriguez\nETA: 45 minutes\nAddress: {customer_address}\nConfirmation: {confirmation_number}\n\nMike will call when he's 10 minutes away."
                SMSHandler.send_sms(customer_phone, customer_msg)

                # Technician alert (demo user sees what technician receives)
                tech_msg = f"🚨 EMERGENCY DISPATCH - {emergency_type.upper()}\n\nCustomer Address: {customer_address}\nPhone: {customer_phone}\nETA Required: 45 min\nConfirmation: {confirmation_number}\n\nReply 'ACCEPT' to confirm or 'BUSY' if unavailable."
                SMSHandler.send_sms(customer_phone, tech_msg)

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

            # Get caller phone from VAPI
            call_info = data.get('call', {})
            customer_phone = call_info.get('customer', {}).get('number', data.get('message', {}).get('call', {}).get('customer', {}).get('number'))

            # Send SMS confirmations
            if customer_phone:
                from sms_handler import SMSHandler

                # Customer confirmation
                customer_msg = f"📅 APPOINTMENT CONFIRMED\n\n{service_type}\nTomorrow at 2:00 PM\nTechnician: Mike Rodriguez\nConfirmation: {confirmation_number}\n\nWe'll text you 30 minutes before arrival."
                SMSHandler.send_sms(customer_phone, customer_msg)

                # Technician assignment (demo user sees what tech gets)
                tech_msg = f"📅 NEW APPOINTMENT - {service_type.upper()}\n\nTomorrow 2:00 PM\nCustomer: {customer_name}\nPhone: {phone_number or customer_phone}\nConfirmation: {confirmation_number}\n\nReview job details in portal."
                SMSHandler.send_sms(customer_phone, tech_msg)

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
    Update VAPI assistant's greeting and system prompt with the new business name
    Called from frontend when user configures their business
    """
    try:
        from config import VAPI_API_KEY, VAPI_ASSISTANT_ID
        import httpx

        data = await request.json()
        business_name = data.get('business_name', 'our company')

        print(f"📝 Updating VAPI assistant greeting with business name: {business_name}")

        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"https://api.vapi.ai/assistant/{VAPI_ASSISTANT_ID}",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {VAPI_API_KEY}"
                },
                json={
                    "firstMessage": f"Thank you for calling {business_name}, how may I help you?",
                    "model": {
                        "provider": "openai",
                        "model": "gpt-4",
                        "temperature": 0.7,
                        "systemPrompt": f"""You are a professional receptionist for {business_name}, an HVAC company.

EXACT SCRIPT TO FOLLOW:

When customer says they're an existing customer:
1. You: "What's your first and last name?"
2. Customer gives name (e.g., "Seth Dixon")
3. You call lookup_customer tool
4. After 2 seconds, you MUST say: "Perfect! I have you here at [ADDRESS from tool response]. Now, what's going on with your system?"

CRITICAL RULES:
- DO NOT say "let me look that up" or "one moment" or "hold on"
- DO NOT announce you're using any tools
- DO NOT go silent after calling lookup_customer
- DO NOT ask customer to confirm their address
- After receiving lookup_customer response, count to 2 in your head, then IMMEDIATELY speak the address
- You must TELL them their address, not ASK them

EXAMPLE OF CORRECT FLOW:
Customer: "I'm an existing customer"
You: "Great! What's your first and last name?"
Customer: "John Smith"
You: [call lookup_customer] "Perfect! I have you here at 456 Ocean Drive in West Palm Beach. Now, what's going on with your AC?"

EXAMPLE OF WRONG FLOW (DO NOT DO THIS):
Customer: "I'm an existing customer"
You: "What's your name?"
Customer: "John Smith"
You: "Let me look that up" [WRONG - never say this]
You: "Using lookup tool" [WRONG - never say this]
You: [silence] [WRONG - never go silent]
You: "Can you confirm your address?" [WRONG - you tell them, don't ask]

EMERGENCY DETECTION:
If customer mentions: heat wave, elderly person, extreme heat, health risk, emergency, urgent - treat as emergency.

For emergencies: After getting address, say "That sounds urgent. I'm dispatching a technician right now." Then call check_technician_availability and give them technician name, ETA, and confirmation number.

For routine service: Call book_appointment and confirm the appointment details.

TONE: Professional, confident, efficient. Act like you have all their information instantly available."""
                    }
                }
            )

            if response.status_code == 200:
                print(f"✅ Successfully updated VAPI assistant with greeting: '{business_name}, how may I help you?'")
                return {"success": True, "business_name": business_name}
            else:
                print(f"❌ Failed to update VAPI assistant: {response.status_code} - {response.text}")
                return {"success": False, "error": response.text}

    except Exception as e:
        print(f"❌ Error updating VAPI greeting: {e}")
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
                    "firstMessage": f"{business_name}, how may I help you?",
                    "model": {
                        "provider": "openai",
                        "model": "gpt-4",
                        "temperature": 0.7,
                        "systemPrompt": f"""You are a professional receptionist for {business_name}, an HVAC company.

EXACT SCRIPT TO FOLLOW:

When customer says they're an existing customer:
1. You: "What's your first and last name?"
2. Customer gives name (e.g., "Seth Dixon")
3. You call lookup_customer tool
4. After 2 seconds, you MUST say: "Perfect! I have you here at [ADDRESS from tool response]. Now, what's going on with your system?"

CRITICAL RULES:
- DO NOT say "let me look that up" or "one moment" or "hold on"
- DO NOT announce you're using any tools
- DO NOT go silent after calling lookup_customer
- DO NOT ask customer to confirm their address
- After receiving lookup_customer response, count to 2 in your head, then IMMEDIATELY speak the address
- You must TELL them their address, not ASK them

EXAMPLE OF CORRECT FLOW:
Customer: "I'm an existing customer"
You: "Great! What's your first and last name?"
Customer: "John Smith"
You: [call lookup_customer] "Perfect! I have you here at 456 Ocean Drive in West Palm Beach. Now, what's going on with your AC?"

EXAMPLE OF WRONG FLOW (DO NOT DO THIS):
Customer: "I'm an existing customer"
You: "What's your name?"
Customer: "John Smith"
You: "Let me look that up" [WRONG - never say this]
You: "Using lookup tool" [WRONG - never say this]
You: [silence] [WRONG - never go silent]
You: "Can you confirm your address?" [WRONG - you tell them, don't ask]

EMERGENCY DETECTION:
If customer mentions: heat wave, elderly person, extreme heat, health risk, emergency, urgent - treat as emergency.

For emergencies: After getting address, say "That sounds urgent. I'm dispatching a technician right now." Then call check_technician_availability and give them technician name, ETA, and confirmation number.

For routine service: Call book_appointment and confirm the appointment details.

TONE: Professional, confident, efficient. Act like you have all their information instantly available."""
                    }
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

        # For demo, use the default business
        # In production, you'd look up business by phone number
        business_id = "00000000-0000-0000-0000-000000000001"
        business = db.get_business(business_id)

        if not business:
            # Fallback if no business found
            return {
                "assistant": {
                    "firstMessage": "Hello, how may I help you?",
                    "model": {
                        "systemPrompt": "You are a helpful assistant."
                    }
                }
            }

        business_name = business.get('name', 'our company')

        # Return dynamic configuration with business-specific greeting
        return {
            "assistant": {
                "firstMessage": f"{business_name}, how may I help you?",
                "model": {
                    "systemPrompt": f"""You are a professional receptionist for {business_name}, an HVAC company serving customers in South Florida. Your job is to help customers who call in, especially during after-hours emergencies.

IMPORTANT CONTEXT:
- Business Name: {business_name}
- You have access to customer records via the lookup_customer tool
- You can check technician availability in real-time
- You can book appointments for routine service

EMERGENCY DETECTION:
If the customer mentions ANY of these, treat it as an emergency:
- Heat wave, extreme heat, or temperatures over 95°F
- Elderly person, senior citizen, or anyone over 80 years old
- Health risk, medical condition, or safety concern
- No AC/heating in extreme weather conditions
- Words like "emergency", "urgent", "critical"
- Young children or infants in uncomfortable conditions

CALL FLOW:
1. Greet: "{business_name}, how may I help you?"
2. Listen carefully to their issue
3. Ask: "Are you a current customer of ours?"
4. If YES: Ask for their "first and last name please"
5. Use the lookup_customer tool to get their information
6. Confirm their address from the records
7. If EMERGENCY detected: Use check_technician_availability tool immediately
8. If tech available: Inform customer of dispatch and ETA
9. If NOT emergency: Use book_appointment tool for scheduling
10. Always ask for the best phone number for text confirmation
11. Repeat the number back to confirm accuracy
12. Provide a summary of what will happen next

TONE: Professional, calm, reassuring, and friendly. If it's an emergency, show appropriate urgency but remain composed and confident. Make customers feel they're in good hands.

REMEMBER: You speak FIRST when answering the phone. Don't wait for the customer to say hello."""
                }
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
