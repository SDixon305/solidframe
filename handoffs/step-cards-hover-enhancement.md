# Handoff: Step Cards Hover Enhancement

## Important

This project uses **OpenSpec** for spec-driven development. Before making changes, read `openspec/AGENTS.md` to understand the workflow. For visual polish like this, you may not need a full proposal—but check the guidelines.

## Context

The main landing page (`site/home/index.html`, `site/home/style.css`) has a "How It Works" section with 3 step cards. Currently, when you hover over a step, it gets a white background and subtle shadow - but it's not visually interesting enough.

## Current State

```css
.step {
    text-align: center;
    padding: 32px 24px;
    border-radius: 12px;
    transition: all 0.25s ease;
    cursor: default;
}

.step:hover {
    background: var(--bg);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
}
```

The step cards sit on a gray background (`var(--bg-alt)` = #F5F7FA). The hover effect just adds a white background and lift - feels generic.

## What We Need

A more visually distinctive hover effect for the step cards. Ideas to explore:

1. **Accent border** - Add an orange left/bottom border on hover (like the toolbox tiles have)
2. **Gradient background** - Subtle gradient instead of flat white
3. **Step number animation** - The orange circle could scale up, pulse, or get a glow
4. **Card outline** - Thin orange outline that animates in
5. **Background pattern** - Subtle diagonal stripes or dots that appear on hover
6. **Glow effect** - Soft orange glow/shadow instead of gray shadow

## Constraints

- Keep it professional (trades industry, not tech-startup)
- No external libraries - CSS only
- Must work with existing `prefers-reduced-motion` support
- Mobile responsive (cards stack on mobile)

## Files to Edit

- `site/home/style.css` - Lines ~174-186 (`.step` and `.step:hover`)

## Preview

Local server: `python3 -m http.server 3333` from `site/home/`
Or: http://localhost:3333

## Related Context

- The toolbox tiles have a nice accent border-left hover effect that works well
- Trade icons have circular backgrounds with orange tint
- Orange accent color: `var(--accent)` = #FF6B35
