# Agents Documentation

This document outlines the AI agents configured for the HVAC Agent Demo system.

## 1. HVAC Triage Assistant (Inbound)

**Role:**
The primary receptionist for the HVAC business. Handles all incoming calls, qualifies leads, and manages scheduling.

**Responsibilities:**
- Greet callers professionally.
- Identify the caller's needs (Emergency vs. Routine).
- Collect customer information (Name, Address, Phone).
- Triage emergencies (No AC in extreme heat, water leaks).
- Schedule appointments for routine maintenance.
- Answer basic FAQs about pricing and services.

**Personality & Voice:**
- **Tone:** Professional, warm, empathetic, and efficient.
- **Voice:** [Insert Vapi Voice ID/Name]
- **Style:** "Receptionist-led" conversation. Concise but polite.

**Tools & Capabilities:**
- `check_schedule`: Look up available time slots.
- `book_appointment`: Confirm a booking in the calendar.
- `log_call_summary`: Save call notes to the CRM/Dashboard.
- `escalate_emergency`: Trigger urgent notifications for on-call techs.

**Configuration (Vapi):**
- **System Prompt:** Located in `docs/vapi/VAPI_ASSISTANT_FULL_CONFIG.json`.
- **First Message:** "Thank you for calling [Company Name], this is [Agent Name]. How can I help you today?"
- **Silence Timeout:** ~1-2 seconds for natural turn-taking.

---

## 2. Outbound Confirmation Agent (Optional)

**Role:**
Follows up with customers to confirm appointments or conduct satisfaction surveys.

**Responsibilities:**
- Confirm appointment details 24 hours prior.
- Gather feedback after a service visit.

**Configuration:**
- **Trigger:** Automated via backend workflow after job completion.

---

## Agent Development Workflow

1. **Define Prompt:** Update the system prompt in the Vapi dashboard.
2. **Configure Tools:** Ensure webhooks are active and tools are defined in Vapi.
3. **Test:** Use the "Demo Caller" interface to simulate scenarios.
4. **Refine:** Adjust prompt based on call logs and edge cases.
