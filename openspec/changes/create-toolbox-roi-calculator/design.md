# Design

## Architecture
The ROI Projector will be a client-side heavy feature to ensure instant feedback.
-   **State Management**: React State + potentially `localStorage` for persistence.
-   **Calculation**: Pure functions in a `utils/calculator.ts` file.
-   **Routing**: `/tools/roi-projector` within the `dashboard` layout.

## UX/UI Strategy
Reflecting the "Command Center" aesthetic:
-   **Visual Language**: Dark mode with high-contrast neon accents (Amber for "Priority/Warning", Cyan/Emerald for "Gain/Success").
-   **Interactivity**: Sliders should feel tactile. "Crunching numbers" effects when inputs change.
-   **Typography**: Monospace fonts for data values (`JetBrains Mono` or similar) to emphasize precision.

## Technical Choices
-   **Charting**: `Recharts` for composable, responsive charts. It integrates well with React and supports custom SVG elements for that "techy" look.
-   **PDF Generation**: `@react-pdf/renderer`. It allows defining PDF layouts using React components, ensuring the PDF looks as good as the web UI.
-   **Animations**: `framer-motion` for smooth enter/exit of result cards and counting up numbers.
