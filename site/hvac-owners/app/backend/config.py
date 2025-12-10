"""
Configuration management for HVAC Demo System
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Vapi.ai Configuration
VAPI_API_KEY = os.getenv("VAPI_API_KEY")
VAPI_PHONE_NUMBER = os.getenv("VAPI_PHONE_NUMBER")
VAPI_ASSISTANT_ID = os.getenv("VAPI_ASSISTANT_ID")

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# App Configuration
# App Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "https://hvac-demo-seth.loca.lt")
if "localhost" in BACKEND_URL or "127.0.0.1" in BACKEND_URL:
    BACKEND_URL = "https://hvac-demo-seth.loca.lt"
    
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Emergency Detection Configuration
EMERGENCY_KEYWORDS = {
    "gas": ["gas leak", "smell gas", "gas odor", "gas smell"],
    "no_heat": ["no heat", "furnace out", "furnace not working", "heater broken", "freezing"],
    "no_ac": ["no ac", "no air", "ac out", "air conditioning broken", "overheating"],
    "water": ["water leak", "flooding", "water damage"],
    "safety": ["carbon monoxide", "smoke", "fire"]
}

# Regional Emergency Thresholds
REGIONAL_EMERGENCIES = {
    "north": {
        "winter_temp_threshold": 45,  # Fahrenheit
        "priority_issues": ["no_heat", "gas", "safety"]
    },
    "south": {
        "summer_temp_threshold": 85,  # Fahrenheit
        "priority_issues": ["no_ac", "gas", "safety"]
    }
}

# Escalation Configuration
TECHNICIAN_RESPONSE_TIMEOUT = 300  # 5 minutes in seconds
