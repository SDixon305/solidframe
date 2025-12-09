# Change: Sync Tool Order to Supabase

**BLOCKED BY:** `build-platform-foundation` (needs auth system complete)

## Why
Tool reordering on the status board currently saves to localStorage, which is per-browser and doesn't sync across devices. Once auth is wired up, authenticated users should have their preferences persisted to Supabase.

## What Changes
- Create `tool_order_preferences` table in Supabase
- Update `use-tool-order` hook to detect auth state
- When authenticated: sync to Supabase
- When unauthenticated: fall back to localStorage (for demos/previews)

## Impact
- Affected specs: toolbox-design
- Affected code:
  - `supabase/migrations/XX_tool_order_preferences.sql` (new)
  - `site/toolbox/src/hooks/use-tool-order.ts` (modify)
