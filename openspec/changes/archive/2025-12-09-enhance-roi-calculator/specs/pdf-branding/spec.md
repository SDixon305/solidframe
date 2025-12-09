# PDF Branding

## ADDED Requirements

### Requirement: Cover Page
The PDF export MUST include a branded cover page with the client's name and date.

#### Scenario: Generating Report
- *Given* I have entered "Cool Air HVAC" as the business name
- *When* I export the blueprint
- *Then* the first page of the PDF is a high-design cover page titled "Growth Strategy for Cool Air HVAC".

### Requirement: Executive Summary
The PDF SHALL include an auto-generated text summary interpreting the data.

#### Scenario: Reading the Report
- *Given* the report is generated
- *When* I read the second page
- *Then* I see a paragraph like "Based on your weekly volume of 15 missed calls, you are currently leaking ~$350k annually..."
