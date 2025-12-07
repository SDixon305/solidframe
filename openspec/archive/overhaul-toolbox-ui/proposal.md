# Change: Overhaul Toolbox UI

## Why
The current Toolbox UI looks like a standard admin dashboard. The user wants a "Command Center" aesthetic to impress HVAC owners during demos, conveying high-tech competence and a premium "Iron Man" feel.

## What Changes
- **Visual Style**: Switch to a "Tech-Noir" aesthetic (Deep dark mode, Glassmorphism, Neon glows).
- **Typography**: Adopt a mix of sans-serif (Inter/Geist) and monospace fonts for a technical feel.
- **Layout**: Implement a "Bento Grid" layout with interactive, glowing cards.
- **Animation**: Add a "living" background (mesh gradient/particles) and micro-interactions.
- **Tech Stack**: Introduce `framer-motion` for smooth, premium animations.

## Impact
- **Affected Specs**: `internal-tools` (UI/UX requirements).
- **Affected Code**: `site/toolbox/src/components/`, `site/toolbox/src/app/globals.css`.
