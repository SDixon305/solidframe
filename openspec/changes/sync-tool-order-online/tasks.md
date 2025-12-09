## Prerequisites
- [ ] 0.1 Wait for `build-platform-foundation` auth system (Task 2) to be complete

## 1. Database

- [ ] 1.1 Create `tool_order_preferences` table migration
- [ ] 1.2 Add RLS policies (users can only access their own preferences)

## 2. Implementation

- [ ] 2.1 Update `use-tool-order` hook to check auth state
- [ ] 2.2 Add Supabase fetch/save logic for authenticated users
- [ ] 2.3 Keep localStorage fallback for unauthenticated users
- [ ] 2.4 Handle optimistic updates and error recovery
