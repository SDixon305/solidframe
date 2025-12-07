# Visualizations

This spec defines the charts and visual feedback mechanisms.

## ADDED Requirements

### Requirement: Revenue Leak Visualization
A chart MUST show where money is being lost (e.g., missed calls, unbooked leads).

#### Scenario: Visualizing leaks
-   *Given* the calculator has data
-   *When* I view the "Leakage" tab
-   *Then* a Donut chart breaks down losses by category (Missed Calls vs. Low Conversion).

### Requirement: Current vs. AI Comparison
A side-by-side bar chart SHALL compare "Current Reality" vs. "With SolidFrame".

#### Scenario: Comparing scenarios
-   *Given* valid inputs
-   *When* I look at the main graph
-   *Then* I see two bars: one valid "Current Revenue" (lower) and one "Projected Revenue" (higher) in a vibrant accent color.

### Requirement: Interactive Feedback
UI elements MUST glow or animate when positive results are achieved.

#### Scenario: Hitting a high recovery number
-   *Given* the "Net Gain" calculation exceeds $100k/year
-   *When* the slider settles
-   *Then* the result card pulses with a gold/success glow.
