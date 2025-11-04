This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## PWA (Progressive Web App)

This app is configured with `next-pwa` and ships a service worker (`/sw.js`) and web manifest (`/manifest.json`).

- Service worker is enabled in all environments (dev and prod). To temporarily disable it locally, set `NEXT_DISABLE_PWA=1` before starting the app.
- Chrome install prompt appears when the browser fires `beforeinstallprompt`. It won’t appear if the app is already installed or running in standalone mode.
- iOS Safari does not support the automatic install prompt. A custom banner shows instructions to use “Add to Home Screen”.

Tips to test the install prompt in Chrome:

1. Open DevTools → Application → Service Workers and click “Unregister” to reset old workers if needed.
2. Clear site data (Application → Clear storage → Clear site data).
3. Reload the page and browse a bit; the prompt should slide in at the bottom.
4. If you dismissed the prompt multiple times, Chrome may throttle re-prompts for a while.
