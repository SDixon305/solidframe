"""
SMS notification handler with Twilio integration
"""
from twilio.rest import Client
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import asyncio
from config import (
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    TECHNICIAN_RESPONSE_TIMEOUT
)
from database import db, Notification

# Initialize Twilio client
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


class SMSHandler:
    """Handles SMS notifications and escalation logic"""

    @staticmethod
    def send_sms(to_phone: str, message: str) -> bool:
        """
        Send a generic SMS message

        Args:
            to_phone: Phone number to send to
            message: Message body

        Returns:
            True if successful, False otherwise
        """
        try:
            sms = twilio_client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=to_phone
            )
            print(f"SMS sent to {to_phone}: {sms.sid}")
            return True
        except Exception as e:
            print(f"Error sending SMS to {to_phone}: {e}")
            return False

    @staticmethod
    def send_emergency_alert(
        call_id: str,
        technician_phone: str,
        customer_info: Dict[str, Any],
        issue_description: str
    ) -> Optional[str]:
        """
        Send emergency alert to technician
        
        Returns notification_id if successful
        """
        message = f"""🚨 EMERGENCY CALL - {customer_info.get('customer_name', 'Unknown')}

Issue: {issue_description}
Phone: {customer_info.get('customer_phone', 'Not provided')}
Address: {customer_info.get('customer_address', 'Not provided')}

Reply ACCEPT to take this call or view dashboard for details."""
        
        try:
            # Send SMS via Twilio
            sms = twilio_client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=technician_phone
            )
            
            # Log notification in database
            notification = Notification(
                call_id=call_id,
                recipient_type="technician",
                recipient_phone=technician_phone,
                message=message,
                status="sent"
            )
            
            result = db.create_notification(notification)
            return result.get('id') if result else None
            
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return None
    
    @staticmethod
    def send_standard_alert(
        call_id: str,
        technician_phone: str,
        customer_info: Dict[str, Any],
        issue_description: str
    ) -> Optional[str]:
        """Send standard service request alert to technician"""
        message = f"""📋 SERVICE REQUEST - {customer_info.get('customer_name', 'Unknown')}

Issue: {issue_description}
Phone: {customer_info.get('customer_phone', 'Not provided')}
Address: {customer_info.get('customer_address', 'Not provided')}

View dashboard to schedule this service call."""
        
        try:
            sms = twilio_client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=technician_phone
            )
            
            notification = Notification(
                call_id=call_id,
                recipient_type="technician",
                recipient_phone=technician_phone,
                message=message,
                status="sent"
            )
            
            result = db.create_notification(notification)
            return result.get('id') if result else None
            
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return None
    
    @staticmethod
    def send_owner_escalation(
        call_id: str,
        owner_phone: str,
        customer_info: Dict[str, Any],
        issue_description: str,
        reason: str = "No technician response"
    ) -> Optional[str]:
        """Escalate to owner when technician doesn't respond"""
        message = f"""⚠️ ESCALATED EMERGENCY - {customer_info.get('customer_name', 'Unknown')}

Reason: {reason}

Issue: {issue_description}
Phone: {customer_info.get('customer_phone', 'Not provided')}
Address: {customer_info.get('customer_address', 'Not provided')}

IMMEDIATE ATTENTION REQUIRED"""
        
        try:
            sms = twilio_client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=owner_phone
            )
            
            notification = Notification(
                call_id=call_id,
                recipient_type="owner",
                recipient_phone=owner_phone,
                message=message,
                status="sent"
            )
            
            result = db.create_notification(notification)
            return result.get('id') if result else None
            
        except Exception as e:
            print(f"Error sending escalation SMS: {e}")
            return None
    
    @staticmethod
    def send_customer_confirmation(
        customer_phone: str,
        technician_name: str,
        is_emergency: bool = False
    ) -> bool:
        """Send confirmation to customer that help is on the way"""
        if is_emergency:
            message = f"""Your emergency service request has been received. {technician_name} will contact you within the next few minutes.

Stay safe and thank you for your patience."""
        else:
            message = f"""Your service request has been received. We'll contact you first thing in the morning to schedule your appointment.

Thank you for choosing us!"""
        
        try:
            twilio_client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=customer_phone
            )
            return True
        except Exception as e:
            print(f"Error sending customer confirmation: {e}")
            return False
    
    @staticmethod
    def parse_technician_response(message_body: str) -> Dict[str, Any]:
        """Parse technician SMS response"""
        message_lower = message_body.lower().strip()
        
        if "accept" in message_lower or "yes" in message_lower:
            return {"action": "accept", "accepted": True}
        elif "reject" in message_lower or "no" in message_lower or "decline" in message_lower:
            return {"action": "reject", "accepted": False}
        else:
            return {"action": "unknown", "accepted": False}


class EscalationManager:
    """Manages escalation logic with timeouts"""
    
    def __init__(self):
        self.pending_escalations = {}
    
    async def monitor_technician_response(
        self,
        call_id: str,
        notification_id: str,
        owner_phone: str,
        customer_info: Dict[str, Any],
        issue_description: str,
        timeout_seconds: int = TECHNICIAN_RESPONSE_TIMEOUT
    ):
        """
        Monitor for technician response and escalate if timeout
        """
        # Wait for timeout period
        await asyncio.sleep(timeout_seconds)
        
        # Check if technician has responded
        notification = db.get_pending_notifications(call_id)
        
        # If still pending, escalate to owner
        if notification and notification[0].get('status') == 'sent':
            print(f"Escalating call {call_id} to owner - no technician response")
            
            # Update notification status
            db.update_notification(notification_id, {"status": "timeout"})
            
            # Send escalation to owner
            SMSHandler.send_owner_escalation(
                call_id=call_id,
                owner_phone=owner_phone,
                customer_info=customer_info,
                issue_description=issue_description,
                reason="Technician did not respond within 5 minutes"
            )
            
            # Update call status
            db.update_call(call_id, {"status": "escalated"})


# Global escalation manager instance
escalation_manager = EscalationManager()
