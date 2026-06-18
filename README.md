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
4. Add and verify destination addresses. This project is configured around these verified inboxes:
	- `info@lablibre.com`
	- `richard.badlisan@gmail.com`
5. Open the verification email sent by Cloudflare and verify that destination address.
6. Let Cloudflare add the required Email Routing DNS records, or add the shown MX and TXT records manually if prompted.
7. Confirm Email Routing shows as enabled for the zone.

#### 2. Configure a verified sender

1. Choose a sender address on your Cloudflare zone. For this project, use `info@lablibre.com`.
2. Make sure the sender domain is onboarded for Cloudflare Email sending.
3. Use only a sender address from that verified Cloudflare zone. Cloudflare will reject unverified senders.

#### 3. Create an Email Sending API token

The Pages dashboard may not show a Send Email binding. That is expected. Use Cloudflare's REST API from the Pages Function instead.

1. In Cloudflare, open My Profile > API Tokens.
2. Create a custom token.
3. Grant the token permission to send email for the account that owns `lablibre.com`.
4. Copy the token once and keep it secret.
5. Copy your Cloudflare Account ID from the Cloudflare dashboard.

#### 4. Add Pages environment variables

In the same Pages project, go to Settings > Environment variables and add:

- `CLOUDFLARE_ACCOUNT_ID`: your Cloudflare account ID
- `CLOUDFLARE_EMAIL_API_TOKEN`: the API token with Email Sending permission
- `EMAIL_TO`: `info@lablibre.com`
- `EMAIL_FROM`: `info@lablibre.com`

If you prefer the Gmail inbox to receive lead notifications directly, set `EMAIL_TO=richard.badlisan@gmail.com` instead. Keep `EMAIL_FROM=info@lablibre.com` because the sender should be on the verified Cloudflare zone.

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

For local Cloudflare Pages Function testing, copy `.dev.vars.example` to `.dev.vars` and replace the placeholder values:

```bash
cp .dev.vars.example .dev.vars
```

The local `.dev.vars` file should not be committed.

```txt
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_EMAIL_API_TOKEN=your_email_sending_api_token
EMAIL_TO=info@lablibre.com
EMAIL_FROM=info@lablibre.com
```

Run the app through Cloudflare Pages local development when testing the Function endpoint locally. A plain Vite dev server will run the frontend, but it will not execute `functions/api/submit.js`.

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
