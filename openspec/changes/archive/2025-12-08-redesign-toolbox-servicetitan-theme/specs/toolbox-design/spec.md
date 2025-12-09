## ADDED Requirements

### Requirement: ServiceTitan-Inspired Design System
The toolbox application SHALL use a design system inspired by ServiceTitan with consistent colors, typography, and spacing.

#### Scenario: Light theme app shell
- **WHEN** a user loads any toolbox page
- **THEN** the main content area displays with a light gray background (#f4f5f7) and white surface cards (#ffffff)

#### Scenario: Dark sidebar navigation
- **WHEN** a user views the toolbox sidebar
- **THEN** the sidebar displays with a dark background (#111827) and light text on dark

#### Scenario: Active navigation state
- **WHEN** a user selects a navigation item in the sidebar
- **THEN** the active item displays with a white background and dark text, clearly distinguishing it from inactive items

#### Scenario: Consistent accent color
- **WHEN** accent colors are used throughout the application (buttons, active states, links)
- **THEN** the primary purple accent (#5f3bff) is used consistently

---

### Requirement: Professional Typography
The toolbox application SHALL use professional, readable typography following system font conventions.

#### Scenario: Font family
- **WHEN** text is rendered in the application
- **THEN** the system font stack (system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif) is used

#### Scenario: Text hierarchy
- **WHEN** displaying page titles, labels, and body text
- **THEN** clear size and weight hierarchy is maintained (titles: 20-24px semibold, body: 14px regular, labels: 13px medium, captions: 11px)

---

### Requirement: Clean Visual Effects
The toolbox application SHALL use subtle, professional visual effects instead of sci-fi styling.

#### Scenario: Card shadows
- **WHEN** a card or surface component is rendered
- **THEN** a subtle box shadow is applied (e.g., `0 1px 2px rgba(15, 23, 42, 0.06)`) instead of glow effects

#### Scenario: No animated grid background
- **WHEN** the dashboard loads
- **THEN** no animated grid or particle effects are displayed in the background

#### Scenario: Hover states
- **WHEN** a user hovers over interactive elements
- **THEN** subtle transitions are applied (background color change, slight scale) without glow effects

---

### Requirement: Consistent Spacing and Radii
The toolbox application SHALL use consistent spacing and border radius values throughout.

#### Scenario: Border radius
- **WHEN** rounded corners are applied to UI elements
- **THEN** consistent radius values are used (buttons: 6px, cards: 8px, pills: 999px)

#### Scenario: Component spacing
- **WHEN** spacing is applied within and between components
- **THEN** a consistent 4px base scale is used (4, 8, 12, 16, 20, 24, 32px)
