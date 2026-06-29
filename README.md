# Financial Foundation Check

Production-ready React + Vite implementation of the Financial Foundation Profile mockup.

## Scripts

- npm run dev: start local development server
- npm run build: create production bundle in dist/
- npm run preview: preview production build locally

## Stack

- React 18
- Vite 5
- Tailwind CSS 3

## Cloudflare Pages Deployment

This app builds to static assets and includes a Cloudflare Pages Function at `/api/submit` for lead email submission.

### Standard deploy

1. Push the repo to GitHub or GitLab.
2. In Cloudflare, open Workers & Pages and create a new Pages project from your repo.
3. Use these build settings:
	- Build command: `npm run build`
	- Build output directory: `dist`
	- Root directory: leave blank if this repo root is the app root
4. Deploy.

### Cloudflare native email submission setup

The quote form posts lead data to `functions/api/submit.js`, which sends email through Cloudflare's native Email Sending REST API. The React frontend does not contain email credentials or API keys.

#### 1. Enable Email Routing for your domain

1. In Cloudflare, open the zone for your domain.
2. Go to Email > Email Routing.
3. Click Get started or Enable Email Routing.
4. Add and verify destination addresses. For examples in this documentation, use placeholder inboxes:
	- `sender@example.com`
	- `advisor@example.com`
5. Open the verification email sent by Cloudflare and verify that destination address.
6. Let Cloudflare add the required Email Routing DNS records, or add the shown MX and TXT records manually if prompted.
7. Confirm Email Routing shows as enabled for the zone.

#### 2. Configure a verified sender

1. Choose a sender address on your Cloudflare zone, such as `sender@example.com`.
2. Make sure the sender domain is onboarded for Cloudflare Email sending.
3. Use only a sender address from that verified Cloudflare zone. Cloudflare will reject unverified senders.

#### 3. Create an Email Sending API token

The Pages dashboard may not show a Send Email binding. That is expected. Use Cloudflare's REST API from the Pages Function instead.

1. In Cloudflare, open My Profile > API Tokens.
2. Create a custom token.
3. Grant the token permission to send email for the account that owns your verified domain.
4. Copy the token once and keep it secret.
5. Copy your Cloudflare Account ID from the Cloudflare dashboard.

#### 4. Add Pages environment variables

In the same Pages project, go to Settings > Environment variables and add:

- `EMAIL_PROVIDER`: optional, use `cloudflare` by default or `resend` for unrestricted outbound agent/contact emails
- `CLOUDFLARE_ACCOUNT_ID`: your Cloudflare account ID, required when `EMAIL_PROVIDER` is unset or `cloudflare`
- `CLOUDFLARE_EMAIL_API_TOKEN`: the API token with Email Sending permission, required when `EMAIL_PROVIDER` is unset or `cloudflare`
- `RESEND_API_KEY`: required when `EMAIL_PROVIDER=resend`
- `EMAIL_FROM`: verified sender address, such as `sender@example.com`
- `AGENTS_JSON`: JSON array of manually configured agents for `/agent_name` links
- `DEFAULT_AGENT_SLUG`: optional slug from `AGENTS_JSON` that should own root submissions from `https://assess.example.com`
- `EMAIL_TO`: optional fallback recipient for root/non-agent submissions
- `EXTERNAL_SYSTEM_ENDPOINT`: optional fallback endpoint for forwarding assessment payloads
- `EXTERNAL_SYSTEM_API_TOKEN`: optional bearer token for the external system
- `EXTERNAL_SYSTEM_SHARED_SECRET`: optional shared secret sent as `X-Assessment-Secret`
- `REQUIRE_EXTERNAL_FORWARD`: optional, set to `true` to fail submission when forwarding fails
- `SEND_CONTACT_COPY`: optional, set to `true` to email the submitted contact a copy of their score and roadmap summary

For multi-agent links, the Function uses `agentEmail` from `AGENTS_JSON` instead of the fixed `EMAIL_TO` fallback. When `DEFAULT_AGENT_SLUG` is set, the root URL uses that same agent profile and routing. Keep `EMAIL_FROM` on a verified sender domain for the selected provider.

By default, the Function sends the complete lead report to the resolved agent email. When `SEND_CONTACT_COPY=true`, the Function also sends a customer-facing copy to the email address entered in the form. The contact-copy send is best effort: if the owner notification succeeds but the selected provider rejects the contact copy, the form still completes and the failure is logged in the Pages Function logs.

Cloudflare Email Routing is primarily an inbound forwarding product, and Cloudflare email setups can require manually verified destination addresses. If agent or contact emails should be sent to arbitrary external inboxes from `AGENTS_JSON` or form submissions, use `EMAIL_PROVIDER=resend` or another transactional email provider instead of relying on Cloudflare Email Routing destinations.

Redeploy the Pages project after adding or changing environment variables.

The Function calls Cloudflare's native Email Sending REST API:

```js
await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ to, from, subject, html, text })
});
```

When `EMAIL_PROVIDER=resend`, the Function calls Resend's HTTP API instead:

```js
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ to, from, subject, html, text, reply_to })
});
```

For local Cloudflare Pages Function testing, copy `.dev.vars.example` to `.dev.vars` and replace the placeholder values:

```bash
cp .dev.vars.example .dev.vars
```

The local `.dev.vars` file should not be committed.

```txt
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_EMAIL_API_TOKEN=your_email_sending_api_token
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=sender@example.com
EMAIL_TO=owner@example.com
AGENTS_JSON=[{"slug":"advisor","agentName":"Advisor Name","agentEmail":"advisor@example.com","toolName":"Financial Foundation Check","headline":"Check your financial foundation in minutes","subheadline":"Answer a few questions and get a personalized readiness snapshot.","status":"active","externalSystemEndpoint":"https://leads.lablibre.com/api/assessment-intake"}]
DEFAULT_AGENT_SLUG=advisor
EXTERNAL_SYSTEM_API_TOKEN=your_external_system_token
SEND_CONTACT_COPY=true
```

Run the app through Cloudflare Pages local development when testing the Function endpoint locally. A plain Vite dev server will run the frontend, but it will not execute `functions/api/submit.js`.

### Manual agent configuration

For the multi-agent version, this assessment app should stay stateless. It only loads an agent configuration, accepts form input, sends the assessment email to that agent, and forwards the same payload to the external system that owns storage and downstream processing.

Agent links should use the first path segment as the agent slug:

```txt
https://assess.example.com/advisor
https://assess.example.com/team-member
https://assess.example.com/agent_name
```

To make the root URL use a configured profile, set `DEFAULT_AGENT_SLUG` to one of the active slugs in `AGENTS_JSON`. For example, `DEFAULT_AGENT_SLUG=advisor` makes `https://assess.example.com` load that advisor's public copy and route root submissions to that advisor's `agentEmail` and `externalSystemEndpoint`.

Each manually configured agent should have:

```json
{
  "slug": "advisor",
  "agentName": "Advisor Name",
  "agentEmail": "advisor@example.com",
  "toolName": "Financial Foundation Check",
  "headline": "Check your financial foundation in minutes",
  "subheadline": "Answer a few questions and get a personalized readiness snapshot.",
  "status": "active",
  "externalSystemEndpoint": "https://leads.lablibre.com/api/assessment-intake"
}
```

Field usage:

- `slug`: public URL identifier. Keep it lowercase, unique, and URL-safe.
- `agentName`: display name for the agent or advisor.
- `agentEmail`: recipient for lead notification emails.
- `toolName`: per-agent name shown in the assessment UI.
- `headline` and `subheadline`: basic per-agent page copy.
- `status`: use `active` to accept submissions, `inactive` to show an unavailable page.
- `externalSystemEndpoint`: API endpoint that receives the submitted assessment payload.

Manual setup checklist:

1. Add the agent configuration record in the configured agent source.
2. Verify the `slug` does not conflict with reserved app routes such as `api`, assets, or documentation pages.
3. Verify `agentEmail` is the address that should receive the complete assessment submission.
4. Confirm the shared `EMAIL_FROM` sender is a verified Cloudflare sender.
5. Confirm the external system endpoint and server-side API secret are configured outside the frontend.
6. Open `/{slug}` and confirm the page loads the agent-specific tool name and copy.
7. Submit a test assessment and verify:
	- The email is sent to `agentEmail`.
	- The email `Reply-To` uses the lead's submitted email.
	- The full assessment payload is forwarded to the external system.

Recommended email headers for each submitted assessment:

```txt
From: Financial Foundation Check <leads@domain.com>
To: Agent Name <agent@email.com>
Reply-To: Lead Name <lead@email.com>
Subject: New Financial Foundation Lead: Lead Name
```

Keep `EMAIL_FROM` shared and verified at the domain level. Do not expose agent emails, API keys, or forwarding secrets in the frontend bundle.

### Subpath deploy

By default, the app emits relative asset URLs so the same build works from the domain root or a simple subpath.

If you need absolute asset URLs for a specific mount point, set the `VITE_BASE_PATH` build environment variable.

- Example local build: `VITE_BASE_PATH=/free-assess/ npm run build`
- Example Cloudflare Pages environment variable: `VITE_BASE_PATH=/free-assess/`
- For a domain-root absolute build, use `VITE_BASE_PATH=/`

The Vite config normalizes this value so both `/free-assess` and `/free-assess/` resolve correctly. If production reports that a module script was served as `text/html`, check that the deployed HTML is requesting the correct asset path and clear any stale Cloudflare cache.

### Self-hosted runtime assets

The app now serves its fonts and Lottie animations from local bundled assets instead of requesting them from Google Fonts or LottieFiles at runtime. That makes Cloudflare deployment more predictable and avoids external asset dependencies during page load.

### Optional CLI deploy

```bash
npm run build
npx wrangler pages deploy dist
```

### Cloudflare headers and CSP

Cloudflare Pages will publish the included `public/_headers` file as response headers.

- The current policy keeps the app self-contained to same-origin assets.
- `script-src` includes `'unsafe-eval'` because `lottie-web` still relies on it.
- `style-src` includes `'unsafe-inline'` because the current React UI uses inline style attributes in several places.

If you want a stricter CSP later, the main follow-up work is removing `lottie-web` or replacing the remaining inline styles.
