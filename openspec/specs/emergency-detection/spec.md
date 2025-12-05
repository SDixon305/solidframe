# Emergency Detection

## Purpose
AI-powered analysis of incoming calls to identify and prioritize HVAC emergencies using keyword detection, regional intelligence, and GPT-4 contextual analysis.

## Requirements

### Requirement: Keyword-Based Detection
The system SHALL scan call transcripts for emergency keywords including gas leaks, no heat, no AC, water damage, and safety concerns.

#### Scenario: Gas leak detected
- **WHEN** transcript contains "gas leak" or "smell gas"
- **THEN** flag as high-priority emergency

#### Scenario: No heat in winter
- **WHEN** transcript contains "no heat" or "furnace not working"
- **THEN** flag as emergency with regional context applied

#### Scenario: No AC in summer
- **WHEN** transcript contains "no AC" or "air conditioning broken"
- **THEN** flag as emergency with regional context applied

### Requirement: Regional Intelligence
The system SHALL apply regional context to emergency prioritization, with Southern regions prioritizing AC emergencies and Northern regions prioritizing heating emergencies.

#### Scenario: AC emergency in Southern region
- **WHEN** AC-related emergency detected in Southern region
- **THEN** elevate priority level

#### Scenario: Heating emergency in Northern region
- **WHEN** heating-related emergency detected in Northern region
- **THEN** elevate priority level

### Requirement: GPT-4 Contextual Analysis
The system SHALL use GPT-4 to analyze call transcripts for emergency context beyond keyword matching, returning a confidence score from 0-100.

#### Scenario: Ambiguous emergency language
- **WHEN** transcript contains unclear or indirect emergency indicators
- **THEN** GPT-4 analyzes context and assigns confidence score

#### Scenario: False positive prevention
- **WHEN** keywords appear in non-emergency context (e.g., "I had no heat last year")
- **THEN** GPT-4 identifies as non-emergency with low confidence score

### Requirement: Confidence Scoring
The system SHALL assign a confidence score (0-100) to each emergency classification to support dispatch prioritization.

#### Scenario: High confidence emergency
- **WHEN** multiple emergency indicators present with clear context
- **THEN** assign confidence score 80-100

#### Scenario: Low confidence potential emergency
- **WHEN** single indicator or ambiguous context
- **THEN** assign confidence score below 50
