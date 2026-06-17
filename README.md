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

The quote form posts lead data to `functions/api/submit.js`, which sends email through Cloudflare's native Send Email binding. The React frontend does not contain email credentials or API keys.

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

#### 3. Add the Send Email binding to the Pages project

1. In Cloudflare, open Workers & Pages.
2. Select this Pages project.
3. Go to Settings > Functions > Bindings.
4. Add a Send Email binding.
5. Set the binding variable name to `SEND_EMAIL`.
6. If Cloudflare asks for restrictions, use one of these:
	- Destination restriction: set the destination address to `info@lablibre.com`.
	- Sender restriction: allow the sender address `info@lablibre.com`.
7. Save the binding for Production.
8. Add the same binding for Preview if you want preview deployments to send test emails.

#### 4. Add address environment variables

In the same Pages project, go to Settings > Environment variables and add:

- `EMAIL_TO`: `info@lablibre.com`
- `EMAIL_FROM`: `info@lablibre.com`

If you prefer the Gmail inbox to receive lead notifications directly, set `EMAIL_TO=richard.badlisan@gmail.com` instead. Keep `EMAIL_FROM=info@lablibre.com` because the sender should be on the verified Cloudflare zone.

Redeploy the Pages project after adding the binding or changing environment variables.

The Function uses Cloudflare's native `EmailMessage` format:

```js
import { EmailMessage } from 'cloudflare:email';

const message = new EmailMessage(from, to, rawMimeMessage);
await env.SEND_EMAIL.send(message);
```

The raw MIME message includes plain-text and HTML versions of the lead summary.

For local Cloudflare Pages Function testing, copy `.dev.vars.example` to `.dev.vars` and replace the placeholder values:

```bash
cp .dev.vars.example .dev.vars
```

The local `.dev.vars` file should not be committed.

```txt
EMAIL_TO=info@lablibre.com
EMAIL_FROM=info@lablibre.com
```

Run the app through Cloudflare Pages local development when testing the Function endpoint locally. A plain Vite dev server will run the frontend, but it will not execute `functions/api/submit.js`. Local email binding behavior may require Wrangler remote bindings or testing on a deployed Preview/Production environment.

### Subpath deploy

If the site will be served from a subpath such as `/free-assess/`, set the `VITE_BASE_PATH` build environment variable.

- Example local build: `VITE_BASE_PATH=/free-assess/ npm run build`
- Example Cloudflare Pages environment variable: `VITE_BASE_PATH=/free-assess/`

The Vite config normalizes this value so both `/free-assess` and `/free-assess/` resolve correctly.

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
