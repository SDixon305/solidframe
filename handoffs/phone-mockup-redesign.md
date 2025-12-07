# Handoff: Phone Mockup Redesign

## Important

This project uses **OpenSpec** for spec-driven development. Before making changes, read `openspec/AGENTS.md` to understand the workflow. For visual polish like this, you may not need a full proposal—but check the guidelines.

## Context

The main landing page (`site/home/index.html`, `site/home/style.css`) has a "Visual Demo" section between the Toolbox and Results sections. It features a CSS-only phone mockup showing an AI call transcript at 2:47 AM.

## Current State

The phone mockup is functional but visually weak—**rated 2/10**. It looks like a placeholder, not a polished design element.

Current issues:
- Generic rounded rectangle doesn't read as a phone
- No notch, speaker, or device details
- The "2:47 AM / AI ACTIVE" header feels flat
- Transcript bubbles are basic
- No depth or premium feel
- Doesn't match the polish level of the rest of the site

## What We Need

A redesigned phone mockup that looks like a real device and feels premium. Ideas to explore:

1. **Device frame** - Add notch/dynamic island, speaker grille, subtle bezels
2. **Screen depth** - Inner shadow, slight gradient to simulate glass
3. **Status bar** - More realistic iOS/Android-style status indicators
4. **Transcript polish** - Better bubble styling, typing indicators, timestamps
5. **Shadow/lighting** - More dramatic shadow, maybe a subtle reflection
6. **Animation** - Consider subtle entrance animation for transcript lines

## Constraints

- CSS only—no images or external assets
- Must work with existing `prefers-reduced-motion` support
- Mobile responsive (phone mockup should scale down gracefully)
- Keep the content (2:47 AM, caller text, AI response, "Job Booked: 8:00 AM")

## Files to Edit

- `site/home/style.css` - Lines ~352-510 (Visual Demo Section)
- `site/home/index.html` - Lines ~183-222 (Visual Demo markup, if structure changes needed)

## Preview

Local server: `python3 -m http.server 3333` from `site/home/`
Or: http://localhost:3333

## Related Context

- The proof block below has a nice card treatment with subtle shadow
- Tool tiles have clean hover states
- Orange accent color: `var(--accent)` = #FF6B35
- Dark color (used for phone frame): `var(--text)` = #1A1A1A

## Goal

Take the phone mockup from 2/10 to 8+/10. It should look like something you'd see on a premium SaaS landing page—not a wireframe.
