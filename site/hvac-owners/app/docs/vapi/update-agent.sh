#!/bin/bash

# Simple script to update the VAPI agent with your training notes
# Just run: ./update-agent.sh

# Load credentials from .env file
ENV_FILE="$(dirname "$0")/../../backend/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Could not find .env file at: $ENV_FILE"
    exit 1
fi

# Extract the values
VAPI_API_KEY=$(grep "^VAPI_API_KEY=" "$ENV_FILE" | cut -d '=' -f2)
VAPI_ASSISTANT_ID=$(grep "^VAPI_ASSISTANT_ID=" "$ENV_FILE" | cut -d '=' -f2)

if [ -z "$VAPI_API_KEY" ] || [ -z "$VAPI_ASSISTANT_ID" ]; then
    echo "❌ Missing VAPI_API_KEY or VAPI_ASSISTANT_ID in .env file"
    exit 1
fi

echo "🚀 Updating VAPI Agent..."
echo ""

# Run the update script
node "$(dirname "$0")/update_full_assistant.js" "$VAPI_ASSISTANT_ID" "$VAPI_API_KEY"
