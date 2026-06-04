# Changelog

## 1.3.0 - 2026-06-04

Prompt context:
- Make progress bars red-to-green gradient, enlarge one-time completion checks, auto-scroll to results CTA, add moving gradient CTA effect, and switch to Figtree font variants.

Changes:
- Updated progress fills across hub/module/quote/dashboard breakdown bars to a red-to-green gradient treatment.
- Enlarged completed journey icon tile and implemented one-time check animation playback, then static dominant check state.
- Added automatic hub scroll to the See My Results CTA after finishing the full journey.
- Added moving gradient motion styling to the post-journey See My Results button.
- Switched typography from Inter to Google Figtree with broader weight and italic variants.

## 1.2.0 - 2026-06-04

Prompt context:
- Integrate Lottie animations and refine motion design without breaking the existing lead-generation flow.

Changes:
- Added Lottie-based completion, celebration, success, and result-reveal animations across the roadmap, fortress, and quote funnel.
- Delayed journey hub auto-scroll so completion animations can finish before the next module is brought into focus.
- Added a full-screen final roadmap celebration, an inviting pulsing analyze CTA, and a subtle reset journey action.
- Added a triumphant fortress reveal celebration and a success animation on the request received screen.
- Centered the mobile layout more intentionally on tablet and desktop while preserving mobile responsiveness.

## 1.1.0 - 2026-06-04

Prompt context:
- Replicate the mockup HTML into a production-ready web app while retaining the UI UX, workflow, logic, and context.

Changes:
- Migrated runtime CDN/Babel mockup into a production React app using Vite.
- Preserved the full multi-screen UX flow, questionnaire logic, scoring model, CTAs, and quote funnel behavior.
- Added Tailwind build configuration and moved custom animation styles into source CSS.
- Added build scripts and project metadata for dev, production build, and preview workflows.
- Added baseline project docs and gitignore for standard app operations.
