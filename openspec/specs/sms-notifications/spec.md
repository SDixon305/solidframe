# SMS Notifications

## Purpose
Twilio-powered SMS alerts for technician dispatch, emergency escalation, and two-way communication with field staff.

## Requirements

### Requirement: Emergency SMS Alerts
The system SHALL send immediate SMS notifications to technicians when an emergency call is detected.

#### Scenario: Emergency alert sent
- **WHEN** call classified as emergency
- **THEN** SMS sent to on-call technician with caller info and emergency summary

#### Scenario: Alert content
- **WHEN** emergency SMS sent
- **THEN** message includes caller phone, emergency type, and key details from transcript

### Requirement: Escalation Timeout
The system SHALL escalate unanswered emergency alerts to the business owner after a 5-minute timeout.

#### Scenario: Technician unresponsive
- **WHEN** no response received within 5 minutes of emergency alert
- **THEN** escalate to business owner via SMS

#### Scenario: Technician responds
- **WHEN** technician responds to SMS within timeout period
- **THEN** escalation canceled and response logged

### Requirement: SMS Response Handling
The system SHALL receive and process technician SMS responses via Twilio webhook.

#### Scenario: Acknowledgment received
- **WHEN** technician responds to emergency alert
- **THEN** response captured via `/webhook/sms` and logged to database

#### Scenario: Status update from technician
- **WHEN** technician sends status update via SMS
- **THEN** call record updated with technician response

### Requirement: Twilio Integration
The system SHALL use Twilio API for all SMS send/receive operations.

#### Scenario: Outbound SMS
- **WHEN** system needs to send alert
- **THEN** Twilio API called with recipient and message

#### Scenario: Inbound SMS webhook
- **WHEN** SMS received on Twilio number
- **THEN** webhook POST to `/webhook/sms` with message content
