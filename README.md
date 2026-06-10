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

This app builds to static assets and is suitable for Cloudflare Pages without a server runtime.

### Standard deploy

1. Push the repo to GitHub or GitLab.
2. In Cloudflare, open Workers & Pages and create a new Pages project from your repo.
3. Use these build settings:
	- Build command: `npm run build`
	- Build output directory: `dist`
	- Root directory: leave blank if this repo root is the app root
4. Deploy.

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
