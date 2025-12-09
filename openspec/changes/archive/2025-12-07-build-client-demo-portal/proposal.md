# Change: Build Client Demo Portal

## Why
During sales calls, prospects need a hands-on way to experience SolidFrame's value proposition. Currently, demos are verbal explanations or static screenshots. A sandboxed demo portal lets prospects interact with the product—see mock calls, explore tools, and visualize ROI—without any risk to production systems.

## What Changes
- Add `/client-demo` route within existing toolbox with role-based access
- Implement 8 sandboxed demo tools with mock data (no real integrations)
- Create magic link generator for personalized demo URLs
- All demo state resets on page reload (no persistence)

### Demo Tools
1. **ROI Calculator** - Reuse existing component with mock defaults
2. **Voice Agent Demo** - Mock call interface showing AI conversation flow
3. **Lead Scraper** - Display mock lead results for prospect's area
4. **Review Request Generator** - Preview SMS templates and mock send flow
5. **Competitive Analysis** - Show mock competitor ratings/reviews
6. **Call Dashboard** - Mock incoming calls, transcripts, emergency detection
7. **Technician Training Module** - Mock training scenarios and quizzes
8. **Appointment Scheduler Preview** - Mock booking calendar and flow

### Magic Link System
- Internal tool at `/admin/demo-links` to generate personalized URLs
- Inputs: owner name, business name (optional)
- Output: `/client-demo?token=<encoded-data>`
- Demo header shows personalized greeting or falls back to "Demo Company"

## Impact
- **Affected code:** `site/toolbox/src/app/client-demo/*` (new routes)
- **Affected code:** `site/toolbox/src/components/demo/*` (new components)
- **Affected code:** `site/toolbox/src/lib/mock-data/*` (mock data generators)
- **Affected code:** `site/toolbox/src/app/admin/demo-links/` (link generator)
- **Reused:** Existing ROI calculator hook and components
- **Future:** Architecture enables `{client}-toolbox.solidframe.ai` with real data
