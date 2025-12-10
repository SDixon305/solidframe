# VAPI Assistant Configuration Guide

## The Problem You Were Having

When you called your VAPI number, the agent:
- **Didn't answer with a greeting** (like "High Time Air Conditioning and Heating")
- **Waited for you to speak first** instead of greeting you
- **Had no context** about its role or responsibilities
- **Didn't know what to do** or how to handle the conversation

## Why This Happened

Your `update_vapi_assistant.js` script only updated the **tools** (the functions the AI can call), but VAPI assistants need much more configuration:

1. **`firstMessage`** - The greeting the AI says when answering the phone
2. **`systemPrompt`** - Instructions that tell the AI its role, responsibilities, and how to behave
3. **Voice settings** - Which voice provider and voice ID to use
4. **Model settings** - Which AI model and temperature to use
5. **Tools** - The functions it can call (you had this part)

## The Solution

I've created a **complete assistant configuration** that includes everything:

### Files Created:

1. **`VAPI_ASSISTANT_FULL_CONFIG.json`** - Complete configuration including:
   - Greeting: "High Time Air Conditioning and Heating, how may I help you?"
   - Detailed system prompt with emergency detection, call flow, and tone guidelines
   - Voice settings (11Labs voice)
   - All three tools (lookup_customer, check_technician_availability, book_appointment)
   - Recording and messaging settings

2. **`update_full_assistant.js`** - Script to push the full configuration to VAPI

3. **`update_full_assistant.sh`** - Shell wrapper that loads credentials from `.env`

## How to Fix Your Assistant

### Step 1: Add Missing Environment Variables

Open `backend/.env` and add these lines if they're missing:

```bash
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_assistant_id_here
```

### Step 2: Update Your Webhook URLs

The configuration still uses the example ngrok URL. You need to update it:

1. Open `VAPI_ASSISTANT_FULL_CONFIG.json`
2. Find all instances of `"https://many-islands-watch.loca.lt/webhook/vapi-call-status"`
3. Replace with your actual backend URL (either ngrok, localtunnel, or deployed URL)

### Step 3: Run the Update Script

Option A - Using the shell script (easiest):
```bash
cd docs/vapi
./update_full_assistant.sh
```

Option B - Direct node command:
```bash
cd docs/vapi
node update_full_assistant.js <YOUR_ASSISTANT_ID> <YOUR_API_KEY>
```

### Step 4: Test

1. Call your VAPI phone number
2. The agent should immediately greet you with:
   **"High Time Air Conditioning and Heating, how may I help you?"**
3. The agent will speak FIRST (not wait for you)
4. The agent now has full context about its role

## What the Agent Now Knows

The system prompt tells the agent:

✅ **Identity**: It's a receptionist for High Time Air Conditioning and Heating
✅ **Emergency Detection**: How to detect emergencies (heat waves, elderly, health risks, etc.)
✅ **Call Flow**: Step-by-step process for handling calls
✅ **Tone**: Professional, calm, reassuring
✅ **Tools**: When and how to use each of the 3 functions
✅ **Behavior**: Speak first when answering, confirm information, etc.

## Configuration Details

### First Message
```
"High Time Air Conditioning and Heating, how may I help you?"
```

This is what the agent says immediately when answering - it speaks FIRST.

### System Prompt Key Points

1. **Emergency Detection** - Detects keywords like:
   - Heat wave, extreme heat (>95°F)
   - Elderly person, senior citizen (>80 years)
   - Health risk, medical condition
   - Emergency, urgent, critical

2. **Call Flow** - 12-step process:
   - Greet caller
   - Listen to issue
   - Ask if existing customer
   - Use lookup_customer tool
   - Confirm address
   - Check for emergency
   - Use appropriate tool (emergency dispatch or appointment booking)
   - Get phone number for confirmation
   - Summarize next steps

3. **Tone Guidelines**:
   - Professional and calm
   - Reassuring and friendly
   - Show urgency for emergencies while staying composed
   - Make customers feel they're in good hands

### Voice Settings
```json
{
  "provider": "11labs",
  "voiceId": "21m00Tcm4TlvDq8ikWAM",
  "stability": 0.5,
  "similarityBoost": 0.75
}
```

### Model Settings
```json
{
  "provider": "openai",
  "model": "gpt-4",
  "temperature": 0.7
}
```

## Troubleshooting

### Agent Still Not Greeting
- Check that `firstMessage` is set in the assistant configuration
- Verify the update was successful (script shows confirmation)
- Wait 30-60 seconds for VAPI to propagate the changes

### Agent Not Using Tools
- Check that webhook URLs in the config point to your backend
- Verify your backend is accessible (use ngrok/localtunnel status)
- Check backend logs when the agent tries to call a tool

### Agent Not Following Instructions
- The system prompt is very detailed - it should follow the flow
- If behavior is off, you can adjust the temperature (lower = more consistent)
- Make sure the model is GPT-4 (not GPT-3.5)

## Comparison: Before vs After

### BEFORE (just tools)
```json
{
  "tools": [...]
}
```
Result: Agent has functions but no idea when/how to use them

### AFTER (full config)
```json
{
  "name": "High Time Air Conditioning & Heating - Demo Agent",
  "firstMessage": "High Time Air Conditioning and Heating, how may I help you?",
  "model": {
    "systemPrompt": "You are a professional receptionist for..."
  },
  "voice": {...},
  "tools": [...]
}
```
Result: Agent knows who it is, greets properly, follows instructions, uses tools appropriately

## Next Steps

After updating your assistant:

1. ✅ Test basic call flow (greeting, conversation)
2. ✅ Test customer lookup tool
3. ✅ Test emergency detection and dispatch
4. ✅ Test appointment booking
5. ✅ Adjust system prompt based on real call behavior
6. ✅ Consider customizing the voice if needed

## Notes

- The configuration uses GPT-4 which is more expensive but more reliable than GPT-3.5
- You can change the business name by editing `firstMessage` and `systemPrompt`
- The voice ID is for a professional-sounding voice from 11Labs
- Recording is enabled by default for quality assurance
- All tools point to `/webhook/vapi-call-status` - make sure your backend handles these endpoints
