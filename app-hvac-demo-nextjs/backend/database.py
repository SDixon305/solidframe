"""
Database client and models for Supabase
"""
from supabase import create_client, Client
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# Pydantic Models
class Business(BaseModel):
    id: Optional[str] = None
    name: str
    phone_number: str
    region: str  # 'north' or 'south'
    hours_start: Optional[str] = None
    hours_end: Optional[str] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
    created_at: Optional[datetime] = None


class Technician(BaseModel):
    id: Optional[str] = None
    business_id: str
    name: str
    phone_number: str
    email: Optional[str] = None
    is_on_call: bool = False
    priority_order: int = 1
    created_at: Optional[datetime] = None


class Call(BaseModel):
    id: Optional[str] = None
    business_id: str
    vapi_call_id: Optional[str] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    issue_description: Optional[str] = None
    transcript: Optional[str] = None
    priority_level: Optional[str] = None  # 'emergency' or 'standard'
    status: str = 'received'  # 'received', 'analyzing', 'dispatched', 'accepted', 'completed'
    assigned_tech_id: Optional[str] = None
    recording_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    created_at: Optional[datetime] = None
    dispatched_at: Optional[datetime] = None
    accepted_at: Optional[datetime] = None


class Notification(BaseModel):
    id: Optional[str] = None
    call_id: str
    recipient_type: str  # 'technician' or 'owner'
    recipient_phone: str
    message: str
    status: str = 'sent'  # 'sent', 'delivered', 'responded', 'timeout'
    sent_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None
    response_text: Optional[str] = None


class DailyReport(BaseModel):
    id: Optional[str] = None
    business_id: str
    report_date: str
    total_calls: int
    emergency_calls: int
    standard_calls: int
    missed_calls: int
    avg_response_time_seconds: Optional[int] = None
    report_data: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None


class DemoCall(BaseModel):
    """Demo call for real-time monitoring"""
    id: Optional[str] = None
    session_id: str
    vapi_call_id: Optional[str] = None
    status: str = 'connecting'  # 'connecting', 'connected', 'listening', 'processing', 'completed'
    transcript: str = ''
    metadata: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# Database Operations
class DatabaseOperations:
    """Helper class for database operations"""
    
    @staticmethod
    def create_business(business: Business) -> Dict[str, Any]:
        """Create a new business"""
        data = business.model_dump(exclude={'id', 'created_at'}, exclude_none=True)
        result = supabase.table('businesses').insert(data).execute()
        return result.data[0] if result.data else None
    
    @staticmethod
    def get_business(business_id: str) -> Optional[Dict[str, Any]]:
        """Get business by ID"""
        result = supabase.table('businesses').select('*').eq('id', business_id).execute()
        return result.data[0] if result.data else None

    @staticmethod
    def update_business(business_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update a business record"""
        result = supabase.table('businesses').update(updates).eq('id', business_id).execute()
        return result.data[0] if result.data else None

    @staticmethod
    def create_technician(technician: Technician) -> Dict[str, Any]:
        """Create a new technician"""
        data = technician.model_dump(exclude={'id', 'created_at'}, exclude_none=True)
        result = supabase.table('technicians').insert(data).execute()
        return result.data[0] if result.data else None
    
    @staticmethod
    def get_on_call_technicians(business_id: str) -> List[Dict[str, Any]]:
        """Get all on-call technicians for a business, ordered by priority"""
        result = supabase.table('technicians')\
            .select('*')\
            .eq('business_id', business_id)\
            .eq('is_on_call', True)\
            .order('priority_order')\
            .execute()
        return result.data if result.data else []
    
    @staticmethod
    def create_call(call: Call) -> Dict[str, Any]:
        """Create a new call record"""
        data = call.model_dump(exclude={'id', 'created_at'}, exclude_none=True)
        result = supabase.table('calls').insert(data).execute()
        return result.data[0] if result.data else None
    
    @staticmethod
    def update_call(call_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update a call record"""
        result = supabase.table('calls').update(updates).eq('id', call_id).execute()
        return result.data[0] if result.data else None
    
    @staticmethod
    def get_call(call_id: str) -> Optional[Dict[str, Any]]:
        """Get call by ID"""
        result = supabase.table('calls').select('*').eq('id', call_id).execute()
        return result.data[0] if result.data else None
    
    @staticmethod
    def get_calls_by_business(business_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent calls for a business"""
        result = supabase.table('calls')\
            .select('*')\
            .eq('business_id', business_id)\
            .order('created_at', desc=True)\
            .limit(limit)\
            .execute()
        return result.data if result.data else []
    
    @staticmethod
    def create_notification(notification: Notification) -> Dict[str, Any]:
        """Create a new notification record"""
        data = notification.model_dump(exclude={'id', 'sent_at'}, exclude_none=True)
        result = supabase.table('notifications').insert(data).execute()
        return result.data[0] if result.data else None
    
    @staticmethod
    def update_notification(notification_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update a notification record"""
        result = supabase.table('notifications').update(updates).eq('id', notification_id).execute()
        return result.data[0] if result.data else None
    
    @staticmethod
    def get_pending_notifications(call_id: str) -> List[Dict[str, Any]]:
        """Get pending notifications for a call"""
        result = supabase.table('notifications')\
            .select('*')\
            .eq('call_id', call_id)\
            .eq('status', 'sent')\
            .execute()
        return result.data if result.data else []
    
    @staticmethod
    def create_daily_report(report: DailyReport) -> Dict[str, Any]:
        """Create a new daily report"""
        data = report.model_dump(exclude={'id', 'created_at'}, exclude_none=True)
        result = supabase.table('daily_reports').insert(data).execute()
        return result.data[0] if result.data else None
    
    @staticmethod
    def get_daily_report(business_id: str, report_date: str) -> Optional[Dict[str, Any]]:
        """Get daily report for a specific date"""
        result = supabase.table('daily_reports')\
            .select('*')\
            .eq('business_id', business_id)\
            .eq('report_date', report_date)\
            .execute()
        return result.data[0] if result.data else None

    # Demo Call Operations
    @staticmethod
    def create_demo_call(demo_call: 'DemoCall') -> Dict[str, Any]:
        """Create a new demo call record for real-time monitoring"""
        data = demo_call.model_dump(exclude={'id', 'created_at', 'updated_at'}, exclude_none=True)
        result = supabase.table('demo_calls').insert(data).execute()
        return result.data[0] if result.data else None

    @staticmethod
    def update_demo_call(demo_call_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update a demo call record"""
        result = supabase.table('demo_calls').update(updates).eq('id', demo_call_id).execute()
        return result.data[0] if result.data else None

    @staticmethod
    def get_demo_call_by_session(session_id: str) -> Optional[Dict[str, Any]]:
        """Get the most recent demo call for a session"""
        result = supabase.table('demo_calls')\
            .select('*')\
            .eq('session_id', session_id)\
            .order('created_at', desc=True)\
            .limit(1)\
            .execute()
        return result.data[0] if result.data else None

    @staticmethod
    def get_demo_call_by_vapi_id(vapi_call_id: str) -> Optional[Dict[str, Any]]:
        """Get demo call by VAPI call ID (stored in metadata->vapi_call_id)"""
        result = supabase.table('demo_calls')\
            .select('*')\
            .eq('metadata->>vapi_call_id', vapi_call_id)\
            .execute()
        return result.data[0] if result.data else None

    @staticmethod
    def get_active_demo_session() -> Optional[Dict[str, Any]]:
        """Get the currently active demo session"""
        result = supabase.table('demo_sessions')\
            .select('*')\
            .eq('is_active', True)\
            .order('created_at', desc=True)\
            .limit(1)\
            .execute()
        return result.data[0] if result.data else None

    @staticmethod
    def get_active_demo_call() -> Optional[Dict[str, Any]]:
        """Get the most recent active (non-completed) demo call"""
        result = supabase.table('demo_calls')\
            .select('*')\
            .neq('status', 'completed')\
            .order('created_at', desc=True)\
            .limit(1)\
            .execute()
        return result.data[0] if result.data else None


# Export database operations
db = DatabaseOperations()
