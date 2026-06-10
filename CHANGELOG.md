# Changelog

## 1.5.4 - 2026-06-10

Prompt context:
- Fix bottom layout collision by hiding the sticky CTA footer when the inline dark CTA card enters view, using `IntersectionObserver` and smooth Tailwind transitions.

Changes:
- Replaced scroll-position docking logic in `DashboardScreen` with an `IntersectionObserver` targeting the inline dark CTA card.
- Added a ref to the inline dark CTA card and observed it within the dashboard scroll container (`root`) for viewport-aware visibility.
- Updated sticky CTA footer visibility classes to smoothly hide/show via `translate-y-full opacity-0 pointer-events-none` and `translate-y-0 opacity-100` with `transition-all duration-300 ease-out`.
- Applied the observer-driven hide/show behavior to the sticky CTA footer regions to prevent footer/inline CTA collision at the bottom.
- Bumped project version for the observer-based sticky CTA collision fix.

## 1.5.3 - 2026-06-10

Prompt context:
- Implement docking CTA behavior so the sticky mobile CTA is visible while scrolling, then disappears at the absolute bottom and hands off to the natural in-flow CTA.

Changes:
- Added scroll-bottom docking detection in `DashboardScreen` using the dashboard scroll container position.
- Added a mobile sticky glass CTA footer that remains visible during scroll and smoothly hides when the user reaches the bottom.
- Restored the in-flow primary CTA button inside the dark dashboard card so the sticky CTA can merge into the natural end-of-content CTA.
- Kept existing pulse emphasis styling on the primary CTA and preserved the constrained glassmorphism footer look.
- Bumped project version for the sticky-to-docked CTA handoff behavior update.

## 1.5.2 - 2026-06-10

Prompt context:
- Refactor the Financial Fortress dashboard to implement a sticky glassmorphism CTA footer and move share/save buttons to the header.

Changes:
- Moved "Share Link" and "Save Image" actions to compact icon buttons fixed at the top-right of the dashboard header.
- Removed the primary CTA button from the dark scrollable card; card now displays headline, hook text, reset action, and disclaimer only.
- Replaced the previous mobile-only sticky footer with a container-width glassmorphism sticky footer (always visible) using backdrop-blur-md, bg-white/90, and border-t on the bottom of the scroll container.
- Sticky footer surfaces the CTA headline and primary button, preventing below-the-fold CTA miss.
- Increased scroll area bottom padding to pb-40 to ensure the Reset Journey button is never hidden behind the sticky footer.
- Bumped project version for the dashboard CTA visibility refactor.

## 1.5.1 - 2026-06-10

Prompt context:
- Make the primary CTA button immediately visible on mobile by adding a sticky frosted-glass bottom container, without removing existing UI elements.

Changes:
- Added a mobile-only sticky bottom CTA container in the dashboard using Tailwind backdrop blur and translucent background utilities.
- Raised CTA stacking with a higher z-index so it remains above scrolling Layer Analysis cards.
- Added extra dashboard content bottom padding on mobile to prevent overlap with the sticky CTA area.
- Bumped project version for the mobile CTA visibility update.

## 1.5.0 - 2026-06-04

Prompt context:
- Implement the next deployment hardening steps by reducing the initial bundle size and adding Cloudflare security headers.

Changes:
- Lazy-loaded the Lottie runtime and animation JSON files so the initial app bundle no longer carries the full animation stack.
- Added a Cloudflare Pages `_headers` file with CSP and baseline security headers plus long-lived asset caching.
- Documented the current CSP allowances and their remaining constraints in the README.
- Bumped the project version for the performance and Cloudflare hardening update.

## 1.4.0 - 2026-06-04

Prompt context:
- Analyze the project for Cloudflare deployment, then add Cloudflare instructions, subpath-safe Vite base handling, and self-hosted runtime assets.

Changes:
- Added Cloudflare Pages deployment guidance and subpath build instructions to the README.
- Updated Vite configuration to support root deploys and configurable subpath deploys through `VITE_BASE_PATH`.
- Replaced runtime Google Fonts and LottieFiles requests with local bundled font and animation assets.
- Bumped the project version for the Cloudflare deployment readiness update.

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
