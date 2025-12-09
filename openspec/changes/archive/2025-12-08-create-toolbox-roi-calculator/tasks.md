# Tasks

1.  **Scaffold Page Structure**
    -   Create `/tools/roi-projector` page in Next.js structure.
    -   Create basic layout with Sidebar (existing) and Main Content area.
    -   <!-- Validation: Navigate to /tools/roi-projector in browser -->

2.  **Implement Calculator Logic & State**
    -   Create `useROICalculator` hook to manage inputs and derived values.
    -   Implement the formulas for Weekly/Monthly/Annual loss and recovery.
    -   <!-- Validation: Unit tests for calculations or verified log output -->

3.  **Build Input Interface**
    -   Create "Control Panel" component with sliders (`Range` input) and number fields.
    -   Apply Toolbox "Sci-Fi" styling (borders, glowing text).
    -   <!-- Validation: Visual inspection of inputs -->

4.  **Implement Visualizations**
    -   Install `recharts` (or use existing if available).
    -   Build "Revenue Comparison" Bar Chart.
    -   Build "Leak Breakdown" Donut Chart.
    -   <!-- Validation: Charts render with correct data from state -->

5.  **Build Result Cards**
    -   Create high-impact big number cards for "Annual Net Gain".
    -   Add count-up animations for numbers.
    -   <!-- Validation: Numbers animate on change -->

6.  **Add PDF Export**
    -   Implement PDF generation (using `react-pdf` or `html2canvas` + `jspdf`).
    -   Design the PDF layout module.
    -   <!-- Validation: Click export, verify PDF opens/downloads -->

7.  **Polish & Mobile Responsiveness**
    -   Ensure stackable layout on mobile.
    -   Fine-tune hover states and transitions.
    -   <!-- Validation: Responsive check in browser dev tools -->
