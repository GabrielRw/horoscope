# Horoscope on Cloudflare

Deployment: https://horoscope.gabriel-naulleau.workers.dev

This branch starts from production commit `3b7e51a1f46f346bad83bbb0201aa898d87da6ed`. Build with `npm ci` and `npm run build:vinext`, then deploy with `npx cf deploy --prebuilt --secrets-file /path/to/private-secrets.json`. Keep the original FREEASTROAPI_API_KEY and FREEASTROAPI_BASE_URL values in private environment files and the declared server bindings. No credentials belong in Git.

R2 and a SQLite Durable Object preserve persistent revalidation caching. The response-store adapter bypasses POST requests, including personalized readings. The original Next.js commands remain available. Vinext initialization updates React/React DOM and adds the matching RSC dependency. The Babel7 runtime-transform development dependency avoids an npm peer-resolution conflict between the existing shadcn tooling and the Vite React plugin.

Next.js and Vinext builds, four existing npm tests, both type checks, added-file lint and a client secret scan passed. Remote homepage, location search and an Aries daily reading returned200; invalid signs returned400. Browser sign selection rendered a daily reading without consoleerrors. Only public/synthetic inputs were used.

The previous production address is Vercel-owned horoscope-rosy.vercel.app and cannot be transferred. The Cloudflare address above is available; Vercel is retained. Custom-domain selection and Git auto-deployment remain pending.

Expanded test discovery also ran the existing TSX rendering tests:9/10 checks passed. The unchanged test expects `Apr21,4:37PM` in a single HTML text string, while the unchanged component renders date and time in separate spans. This pre-existing assertion mismatch remains; no application/test content was changed for it. A synthetic personalized reading POST also returned200.
