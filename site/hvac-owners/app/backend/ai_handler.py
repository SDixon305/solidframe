"""
AI conversation handler and emergency detection logic
"""
from typing import Dict, Any, List, Optional
from openai import OpenAI
from config import OPENAI_API_KEY, EMERGENCY_KEYWORDS, REGIONAL_EMERGENCIES

client = OpenAI(api_key=OPENAI_API_KEY)


class EmergencyDetector:
    """Detects emergency situations from call transcripts"""
    
    @staticmethod
    def detect_emergency(transcript: str, region: str = "south") -> Dict[str, Any]:
        """
        Analyze transcript for emergency indicators
        
        Returns:
            {
                "is_emergency": bool,
                "emergency_type": str or None,
                "confidence": float,
                "reasoning": str
            }
        """
        transcript_lower = transcript.lower()
        
        # Check for explicit emergency keywords
        detected_keywords = []
        emergency_type = None
        
        for category, keywords in EMERGENCY_KEYWORDS.items():
            for keyword in keywords:
                if keyword in transcript_lower:
                    detected_keywords.append(keyword)
                    emergency_type = category
                    break
        
        # Regional emergency detection
        regional_config = REGIONAL_EMERGENCIES.get(region, REGIONAL_EMERGENCIES["south"])
        priority_issues = regional_config.get("priority_issues", [])
        
        # Use OpenAI to analyze context
        analysis = EmergencyDetector._analyze_with_ai(transcript, region)
        
        # Combine keyword detection with AI analysis
        is_emergency = (
            len(detected_keywords) > 0 or 
            analysis.get("is_emergency", False)
        )
        
        # Boost confidence if it's a regional priority issue
        confidence = analysis.get("confidence", 0.5)
        if emergency_type in priority_issues:
            confidence = min(confidence + 0.2, 1.0)
        
        return {
            "is_emergency": is_emergency,
            "emergency_type": emergency_type or analysis.get("emergency_type"),
            "confidence": confidence,
            "reasoning": analysis.get("reasoning", "Keyword detection"),
            "detected_keywords": detected_keywords
        }
    
    @staticmethod
    def _analyze_with_ai(transcript: str, region: str) -> Dict[str, Any]:
        """Use OpenAI to analyze transcript for emergency context"""
        try:
            response = client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": f"""You are an HVAC emergency detection system for the {region} region.
                        
Analyze the call transcript and determine if this is an emergency situation.

EMERGENCY CRITERIA:
- Gas leaks or gas smells (ALWAYS emergency)
- No heat in cold weather (especially with vulnerable people)
- No AC in extreme heat (especially with vulnerable people, elderly, or children)
- Water leaks or flooding
- Carbon monoxide or safety concerns

REGIONAL CONTEXT ({region}):
- North: No heat is critical in winter
- South: No AC is critical in summer

Return your analysis in this exact JSON format:
{{
    "is_emergency": true/false,
    "emergency_type": "gas" | "no_heat" | "no_ac" | "water" | "safety" | null,
    "confidence": 0.0-1.0,
    "reasoning": "brief explanation"
}}"""
                    },
                    {
                        "role": "user",
                        "content": f"Transcript: {transcript}"
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            print(f"AI analysis error: {e}")
            return {
                "is_emergency": False,
                "emergency_type": None,
                "confidence": 0.0,
                "reasoning": "AI analysis failed"
            }


class CallAnalyzer:
    """Analyzes call transcripts to extract structured information"""
    
    @staticmethod
    def extract_call_info(transcript: str) -> Dict[str, Any]:
        """
        Extract customer information from transcript
        
        Returns:
            {
                "customer_name": str,
                "customer_phone": str,
                "customer_address": str,
                "issue_description": str,
                "has_vulnerable_people": bool,
                "temperature_mentioned": str or None
            }
        """
        try:
            response = client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": """Extract customer information from this HVAC service call transcript.

Return JSON with these fields:
- customer_name: Full name if mentioned, otherwise null
- customer_phone: Phone number if mentioned, otherwise null
- customer_address: Full address if mentioned, otherwise null
- issue_description: Brief summary of the problem
- has_vulnerable_people: true if elderly, children, or health concerns mentioned
- temperature_mentioned: Any temperature information mentioned

Be precise and only include information explicitly stated."""
                    },
                    {
                        "role": "user",
                        "content": f"Transcript: {transcript}"
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.2
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            print(f"Call info extraction error: {e}")
            return {
                "customer_name": None,
                "customer_phone": None,
                "customer_address": None,
                "issue_description": "Error extracting information",
                "has_vulnerable_people": False,
                "temperature_mentioned": None
            }


def get_vapi_assistant_config(business_name: str, region: str) -> Dict[str, Any]:
    """
    Generate Vapi.ai assistant configuration for a business
    """
    return {
        "name": f"{business_name} After-Hours Assistant",
        "voice": {
            "provider": "11labs",
            "voiceId": "rachel",  # Professional female voice
        },
        "model": {
            "provider": "openai",
            "model": "gpt-4-turbo",
            "temperature": 0.7,
            "systemPrompt": f"""You are the after-hours emergency assistant for {business_name}, an HVAC company.

Your role:
1. Greet the caller professionally: "Thank you for calling {business_name}. I'm here to help with your HVAC emergency. What's happening?"
2. Listen carefully to their issue
3. Ask clarifying questions to understand urgency:
   - What's the specific problem?
   - What's the temperature like?
   - Are there children, elderly, or anyone with health concerns in the home?
4. Collect their information:
   - Full name
   - Phone number
   - Address
5. Confirm all information back to them
6. For emergencies: "I'm dispatching this to our on-call technician right now as a priority emergency. They'll be calling you within the next few minutes."
7. For standard requests: "I'll create a service request and our team will contact you first thing in the morning to schedule."

Be empathetic, professional, and efficient. Keep the call under 3 minutes if possible."""
        },
        "functions": [
            {
                "name": "extract_call_info",
                "description": "Extract customer information and issue details from the call",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "customer_name": {
                            "type": "string",
                            "description": "Customer's full name"
                        },
                        "customer_phone": {
                            "type": "string",
                            "description": "Customer's phone number"
                        },
                        "customer_address": {
                            "type": "string",
                            "description": "Customer's address"
                        },
                        "issue_description": {
                            "type": "string",
                            "description": "Description of the HVAC issue"
                        },
                        "has_vulnerable_people": {
                            "type": "boolean",
                            "description": "Whether there are children, elderly, or people with health concerns"
                        },
                        "temperature_info": {
                            "type": "string",
                            "description": "Current temperature or weather conditions mentioned"
                        }
                    },
                    "required": ["issue_description"]
                }
            }
        ]
    }
