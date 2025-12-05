# Call Handling

## Purpose
Vapi.ai integration for AI-powered voice reception, webhook processing, and call classification for HVAC service requests.

## Requirements

### Requirement: AI Voice Reception
The system SHALL answer incoming calls via Vapi.ai with an AI voice assistant that conducts natural conversations with callers.

#### Scenario: Incoming call answered
- **WHEN** caller dials the Vapi phone number
- **THEN** AI assistant answers and greets caller

#### Scenario: Natural conversation flow
- **WHEN** caller describes their HVAC issue
- **THEN** AI assistant asks clarifying questions and gathers necessary information

### Requirement: Webhook Event Processing
The system SHALL receive and process webhook events from Vapi.ai containing call data and transcripts.

#### Scenario: Call completed webhook
- **WHEN** Vapi sends call-completed webhook to `/webhook/vapi`
- **THEN** system extracts transcript and caller information

#### Scenario: Call in-progress updates
- **WHEN** Vapi sends real-time call updates
- **THEN** system processes updates for live dashboard display

### Requirement: Transcript Capture
The system SHALL capture and store complete call transcripts for analysis and record-keeping.

#### Scenario: Full transcript stored
- **WHEN** call ends
- **THEN** complete transcript logged to Supabase database

#### Scenario: Caller information extracted
- **WHEN** webhook received
- **THEN** caller phone number and metadata captured

### Requirement: Call Classification
The system SHALL classify calls as emergency or standard based on emergency detection analysis.

#### Scenario: Emergency call classification
- **WHEN** emergency detection flags call as emergency
- **THEN** call marked with emergency status and priority level

#### Scenario: Standard call classification
- **WHEN** no emergency indicators detected
- **THEN** call marked as standard priority for routine follow-up
