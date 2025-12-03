# Step 1: Define the Offer

## 1. The Avatar (Who are we serving?)
**Primary Target:** Residential HVAC Business Owners.
- **Revenue Range:** $1M - $5M (They have volume but maybe not a full 24/7 dispatch team).
- **Pain Points:**
  - Missed calls after 5 PM = Lost revenue to competitors.
  - "On-call" technicians hate answering phones (burnout).
  - Generic answering services take messages but don't triage (bad customer experience).
  - Paying for leads (LSA/Ads) that go to voicemail.

## 2. The Core Offer (What are we selling?)
**"AI-Powered After-Hours Triage & Dispatch System"**
- **Mechanism:** A conversational AI Voice Agent (Vapi) that answers calls instantly, 24/7.
- **Capabilities:**
  - Distinguishes between **Emergencies** (No heat/AC, water leak) and **Routine Maintenance**.
  - Checks service area (Zip code validation).
  - Collects customer details (Name, Address, Issue).
  - **For Emergencies:** Patches the call to the on-call tech or sends an urgent SMS/Slack alert.
  - **For Routine:** Books a tentative slot or sends a booking link; logs to CRM/Dashboard.

## 3. The Big Promise (The Hook)
> "Stop Losing Revenue to Missed Calls. Our AI Answers Instantly, Qualifies Leads, and Dispatches Techs—While You Sleep."

## 4. Pricing Strategy (Draft - To Be Validated)
*Goal: Low barrier to entry, high recurring value.*

- **Setup Fee:** $500 - $1,000 (One-time onboarding, script customization, phone number setup).
- **Monthly Retainer:** $297 - $497/month (SaaS + Service fee).
- **Usage:** Included 100-200 mins, then $0.20/min (Pass-through cost + margin).
- **Alternative Performance Model:** Pay-Per-Booked-Appointment (Riskier for you, easier to sell).
  - *Recommendation:* Stick to Setup + Monthly for stability.

## 5. The Guarantee (Risk Reversal)
> "Try it for 30 days. If it doesn't handle your calls better than your current answering service, we'll refund your setup fee."

## 6. Technical Deliverables (What they actually get)
- A dedicated local phone number (Twilio).
- Custom-trained AI Agent (Vapi).
- A "Missed Call Text Back" workflow (n8n).
- A simple dashboard to listen to call recordings (Streamlit/Next.js).
