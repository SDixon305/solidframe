# Proposal: Build Voice AI Landing Page

## Summary
Create a conversion-optimized static landing page at `/voice-ai` specifically designed to convert trades business owners (HVAC, Plumbing, Electrical, Roofing) into demo call bookings. The page implements proven landing page conversion strategies targeting a 40+ demographic with limited time.

## Problem
The current landing pages (home, hvac) are positioned for beta partners and general exploration. We need a dedicated landing page optimized for paid advertising campaigns that:
- Focuses on selling ONE specific solution (Voice AI Agents for Inbound Calls)
- Maximizes readability and accessibility for 40+ decision-makers
- Removes friction and clearly demonstrates ROI
- Drives a single conversion action: booking a demo call

## Solution
Build a new static landing page at `site/voice-ai/` following expert-recommended conversion optimization patterns:

1. **Above the Fold**: Immediate clarity with results-based heading, social proof, and clear CTA
2. **Problem/Solution**: Direct pain point revelation paired with specific solution
3. **Value Proposition**: Benefits-focused content with measurable metrics
4. **Conversion Flow**: Simple 3-step process, case studies, testimonials, FAQ, and final CTA

## Design Constraints
- **Accessibility First**: Black text on white background for maximum readability
- **Simplicity**: Clean, minimal layout using plain HTML/CSS (no build steps)
- **Speed**: Fast load times, minimal dependencies
- **Mobile Optimized**: Responsive design for all devices
- **Single CTA**: Every section drives toward "Book a Demo" call-to-action

## Target Audience
- Trade business owners and decision-makers
- Age: 40+ years old
- Industries: HVAC, Plumbing, Electrical, Roofing
- Limited time, skeptical of "tech fluff"
- Need clear ROI and simple implementation path

## Scope
**In Scope:**
- New static landing page at `/voice-ai`
- Seven main sections following conversion best practices
- Responsive HTML/CSS with no JavaScript dependencies
- Integration with Calendly for demo bookings
- Case study featuring Chanin Air (fabricated metrics)
- Trust indicators (ServiceTitan, Housecall Pro, Jobber, Field Edge logos)

**Out of Scope:**
- Working demo/audio player
- ROI calculator integration
- Multiple industry-specific variants (v1 uses generic trades language)
- Dynamic content or A/B testing framework
- Backend functionality

## Success Criteria
- Landing page loads in under 2 seconds
- Mobile-responsive across all screen sizes
- Clear visual hierarchy with one primary CTA per section
- Passes WCAG AA accessibility standards for text contrast
- Successfully deployed and accessible at solidframe.ai/voice-ai

## Future Considerations
- Create campaign-specific variants (e.g., `/voice-ai-hvac`, `/voice-ai-emergency`)
- A/B testing framework for headline/CTA variations
- Integration with analytics tracking
- Lead magnet downloads (e.g., "HVAC Automation Checklist")

## Dependencies
- Existing site-structure spec (routing, pages.json)
- Calendly account for demo booking links
- Asset library (logos for ServiceTitan, Housecall Pro, Jobber, Field Edge)

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Generic content doesn't resonate with any specific trade | Use universal pain points (missed calls, manual tasks) that apply across all trades |
| Lack of real metrics reduces credibility | Use industry benchmarks and fabricated case study with realistic numbers |
| Page looks "too simple" compared to competitors | Emphasize that simplicity = professionalism for busy owners |
| Multiple campaign needs require many duplicates | Build v1 as template, document cloning process for future variants |
