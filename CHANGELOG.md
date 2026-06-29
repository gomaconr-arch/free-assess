# Changelog

## 1.5.15 - 2026-06-29

Prompt context:
- Remove the email-delivery bottleneck where agent and contact emails had to be manually added as Cloudflare email destinations before delivery worked.

Changes:
- Added configurable outbound email delivery through `EMAIL_PROVIDER`, keeping Cloudflare as the default and adding `EMAIL_PROVIDER=resend` support.
- Updated lead notification and optional contact-copy emails to use the selected provider without changing `AGENTS_JSON`.
- Documented why Cloudflare Email Routing is not suitable for arbitrary agent/contact nurture emails and added the Resend environment variables.
- Updated the agent setup guide to call out Cloudflare destination verification limits.
- Bumped project version for the outbound email provider option.

## 1.5.14 - 2026-06-26

Prompt context:
- Add stateless multi-agent submission routing, document non-technical agent setup, and verify the Cloudflare staging deployment path.

Changes:
- Added first-path-segment agent slug detection so links like `/advisor` can load advisor-specific assessment copy.
- Added `/api/agents/[slug]` for public agent configuration lookup from `AGENTS_JSON`.
- Added stateless submission routing that sends lead notification emails to the configured `agentEmail`.
- Added agent metadata to owner notification emails so routed submissions show the agent, slug, and tool name.
- Added external assessment forwarding support with per-agent endpoint override and shared-secret header support.
- Added `functions/lib/agents.js` to normalize, validate, and resolve configured agents while excluding reserved app routes.
- Added `ADDING_AGENTS.md` as a non-technical guide for creating, updating, testing, and disabling agent links in Cloudflare.
- Updated README and in-app documentation with manual agent configuration, required environment variables, production URLs, and testing steps.
- Adjusted external forwarding to send the original assessment payload directly and log a compact forwarding response summary.
- Bumped project version for the multi-agent routing, agent documentation, and forwarding payload update.

## 1.5.13 - 2026-06-24

Prompt context:
- Polish the final lead capture and submission flow with transparent contact copy, a slide-to-submit interaction, and loading/layout refinements.

Changes:
- Added a premium slide-to-submit control that grants consent and submits once a valid email is entered.
- Updated the final capture screen copy to explain why both email and mobile number are requested.
- Reworked the privacy promise to cover all contact details with a prominent emerald shield treatment.
- Improved the submit loading state with "Preparing your analysis..." copy and a spinner in the slider thumb.
- Added a quick fade-out transition before the analyzing screen unmounts.
- Expanded the airplane celebration animation container edge-to-edge on mobile.
- Updated budget daily cost text into colored premium badges.
- Bumped project version for the final capture and submission UX polish.

## 1.5.12 - 2026-06-24

Prompt context:
- Refine the personalization age step so the life-stage cards behave as a passive infographic while the tap-and-hold age stepper remains the primary input.

Changes:
- Restored the age tap-and-hold stepper with clamped age handling and timer cleanup.
- Reworked the life-stage cards into subtle white infographic cards with emerald, indigo, and rose icon accents.
- Kept the life-stage icon animations while removing heavy dark gradients that made the cards read as primary actions.
- Moved the age selector above the infographic cards to keep the primary input visually dominant.
- Applied the emerald action button style to the personalization form CTA.
- Bumped project version for the age-step visual hierarchy and CTA refinement.

## 1.5.11 - 2026-06-19

Prompt context:
- Remove the Quick Win Simulator friction from the fortress page and improve the final roadmap summary with calculation details and private sharing.

Changes:
- Removed `QuickWinSimulatorCard` from the fortress/gap reveal page.
- Restored the "How it was calculated" breakdown card below the final roadmap summary.
- Added an animated question icon above the "What happens next?" section.
- Added a mobile-first "Share the Tool" copy-to-clipboard button on the final success screen.
- Added copied-state feedback that switches the share button to "Link Copied! ✅" for 2 seconds.
- Bumped project version for the final-screen sharing and roadmap summary refinements.

## 1.5.10 - 2026-06-19

Prompt context:
- Update Budget, Contact, and Success screen copy/icons in the calibration funnel while preserving dynamic score and budget rendering.

Changes:
- Updated the budget step headline and support copy to use "Pick Your Comfort Zone" language.
- Added budget-step assurance microcopy: "Zero payment required. No commitment."
- Updated the contact step headline/subtext and added an animated email/send SVG icon above the heading.
- Updated the final reveal body copy to inject the selected budget label into the new roadmap-finalization message.
- Added highlighted no-commitment/no-payment assurance copy on the success screen.
- Removed now-unused contact-copy response state from the frontend success copy path.
- Bumped project version for the funnel copy and UI icon update.

## 1.5.9 - 2026-06-19

Prompt context:
- Refine the "Fortress" score dashboard CTA logic with a Quick Win Simulator pattern that feels useful, low-pressure, and conversion-friendly.
- Implement a delayed score reveal flow that shows gap analysis first, calibrates the score through follow-up questions, then unlocks the final score after contact submission.
- After score calibration, let users move between the revealed fortress page and the submitted roadmap page.
- Add a compass favicon and keep version/changelog updates tied to repository pushes.

Changes:
- Added the delayed reveal/calibration flow so the fortress page initially hides the score behind a calculating state until the lead flow is completed.
- Updated the post-submit fortress page to show the actual Score Ring and provide a "View Sent Roadmap" path back to the submitted roadmap summary.
- Added optional Cloudflare contact-copy email support through `SEND_CONTACT_COPY=true`, while preserving owner lead notification as the primary submission path.
- Added Open Graph/Twitter preview thumbnails and SEO metadata for social sharing and search.
- Added a local compass SVG favicon and linked it from `index.html`.
- Replaced the rejected locked-blueprint teaser with a Quick Win Simulator card below the main score area.
- Added inactive column-card improvement slots for Health Shield, Lifestyle Fund, and Life Protection.
- Moved the Quick Win Simulator below Layer Analysis and styled the increase badge with white text on a dark green background.
- Updated dynamic CTA button copy to use quick-win language for protection, safety-net, family-backup, and default momentum branches.
- Added time expectation microcopy inside the dark CTA card: "Takes ~30 seconds."
- Matched the dashboard CTA animation behavior to the "See My Results" shine treatment while preserving the green palette.
- Improved final journey celebration visibility with a translucent wrapper and replaced the fortress loading shield with the rotating logo treatment.
- Removed the authority badge below the CTA card.
- Preserved the docked CTA handoff behavior while passing clicked CTA context into the quote transition and quote form Step 1.
- Added `quoteIntent` to the lead submission payload so downstream handling can see which CTA path the user selected.
- Replaced the quote Step 1 birthdate input with a mobile-first age stepper that supports press-and-hold adjustment.
- Updated lead payloads and notification emails to use `age` plus computed `birthYear`, rendered as "Age (Year)".
- Bumped project version for the delayed reveal, revisit navigation, favicon, SEO preview, and Cloudflare contact-copy updates.

## 1.5.8 - 2026-06-17

Prompt context:
- Keep the app version updated whenever production-facing changes are made.

Changes:
- Added Cloudflare Pages Function lead submission support and moved email delivery to Cloudflare's native Email Sending REST API.
- Added final-step email capture, consent copy for sending the detailed profile assessment, and clearer non-transactional success messaging.
- Expanded lead notification emails into detailed section-by-section tables covering all journey answers, quote inputs, and fortress scoring.
- Fixed the Financial Fortress CTA scrolling behavior by removing conflicting sticky CTA overlays and keeping the in-flow CTA tappable.
- Updated progress bars to use percentage-specific colors instead of showing the entire red-to-green spectrum in every fill.
- Replaced the "See My Results" RGB-style gradient with a subtle blue/sky-blue animated shine treatment.
- Improved iOS viewport handling so the "Building Your Fortress" screen covers the full device height and the fortress page scrolls with native momentum.
- Bumped project version for the Cloudflare email, lead-flow, progress styling, and iOS scrolling updates.

## 1.5.6 - 2026-06-10

Prompt context:
- Refine the quote transition screen so it feels less boxed-in and the primary CTA has a softer, more premium glow without changing the text or behavior.

Changes:
- Removed the outer border from the transition card so the screen reads as a full-screen app surface instead of a phone-shell mockup.
- Kept the inner card as the visual container and preserved the subtle shadow, rounded corners, and layered background treatment.
- Added a subtler pulsing glow treatment to the primary CTA to improve visual emphasis without making it feel aggressive.
- Preserved all existing quote transition text, navigation, and interaction behavior.
- Bumped project version for the transition screen polish pass.

## 1.5.5 - 2026-06-10

Prompt context:
- Improve the quote transition screen so it feels calm, premium, mobile-first, and conversion-friendly while keeping the exact current text and existing routing behavior.

Changes:
- Reworked the quote transition into a centered premium intro card with softer background atmosphere, stronger visual hierarchy, and better mobile spacing.
- Replaced the emoji-only icon treatment with a polished lucide-react compass-led icon block and subtle decorative accent.
- Added a low-pressure trust cue row with compact icon chips and a soft progress preview to reinforce privacy and guidance without changing the required copy.
- Swapped the static buttons for framer-motion-powered primary and secondary actions with tap/hover feedback and stronger focus states.
- Kept the exact headline, description, primary CTA, and secondary button text unchanged while preserving the existing screen routing behavior.
- Bumped project version for the quote transition UI/UX refinement.

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
