# Report Generation

This spec defines the PDF export capability.

## ADDED Requirements

### Requirement: PDF Export
The system MUST generate a branded PDF report summarizing the inputs and projected gains.

#### Scenario: User clicks "Export Report"
-   *Given* I have completed the calculation
-   *When* I click the "Generate Blueprint" button
-   *Then* a PDF file downloads containing a summary of the numbers, the charts, and SolidFrame branding.

### Requirement: Report Branding
The PDF MUST look professional and include the prospect's (optional) name.

#### Scenario: Customizing the report
-   *Given* an optional "Business Name" input field
-   *When* "Dixon HVAC" is entered
-   *Then* the PDF is titled "Growth Blueprint for Dixon HVAC".
