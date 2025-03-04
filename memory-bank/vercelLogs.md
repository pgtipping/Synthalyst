# Vercel Build Logs

## 2025-03-03

[22:34:07.116] Running build in Washington, D.C., USA (East) – iad1
[22:34:07.229] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 866b1ba)
[22:34:07.544] Cloning completed: 315.000ms
[22:34:14.318] Restored build cache from previous deployment (BxuAnJC1kp2Lexj5vXtZHNmRNKaA)
[22:34:14.454] Running "vercel build"
[22:34:16.122] Vercel CLI 41.2.2
[22:34:16.929] Running "install" command: `npm install`...
[22:34:25.716]
[22:34:25.716] added 5 packages, changed 10 packages, and audited 1413 packages in 9s
[22:34:25.716]
[22:34:25.717] 244 packages are looking for funding
[22:34:25.717] run `npm fund` for details
[22:34:25.720]
[22:34:25.721] 3 moderate severity vulnerabilities
[22:34:25.721]
[22:34:25.721] To address all issues (including breaking changes), run:
[22:34:25.721] npm audit fix --force
[22:34:25.721]
[22:34:25.721] Run `npm audit` for details.
[22:34:25.759] Detected Next.js version: 15.2.0
[22:34:25.760] Running "prisma migrate deploy && prisma generate && next build"
[22:34:26.218] Prisma schema loaded from prisma/schema.prisma
[22:34:26.225] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[22:34:26.888]
[22:34:26.888] 6 migrations found in prisma/migrations
[22:34:26.888]
[22:34:26.994]
[22:34:26.995] No pending migrations to apply.
[22:34:27.458] Prisma schema loaded from prisma/schema.prisma
[22:34:27.948]
[22:34:27.948] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 249ms
[22:34:27.948]
[22:34:27.948] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[22:34:27.948]
[22:34:27.948] Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: <https://pris.ly/orm/survey/release-5-22>
[22:34:27.948]
[22:34:28.788] ▲ Next.js 15.2.0
[22:34:28.789]
[22:34:28.869] Creating an optimized production build ...
[22:34:55.709] ✓ Compiled successfully
[22:34:55.714] Skipping linting
[22:34:55.715] Checking validity of types ...
[22:35:12.456] Collecting page data ...
[22:35:16.286] Generating static pages (0/56) ...
[22:35:17.143] Generating static pages (14/56)
[22:35:17.398] Generating static pages (28/56)
[22:35:17.536] Generating static pages (42/56)
[22:35:17.994] ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/training-plan". Read more: <https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout>
[22:35:17.994] at a (/vercel/path1/.next/server/chunks/8302.js:4:25258)
[22:35:17.995] at d (/vercel/path1/.next/server/chunks/8302.js:4:147954)
[22:35:17.995] at rs (/vercel/path1/.next/server/app/training-plan/page.js:1:41384)
[22:35:17.995] at nL (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:46773)
[22:35:17.995] at nU (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:48548)
[22:35:17.995] at nU (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:64360)
[22:35:17.995] at nq (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:67434)
[22:35:17.995] at nH (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:65009)
[22:35:17.995] at nG (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:70865)
[22:35:17.995] at nz (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:69548)
[22:35:17.995] Error occurred prerendering page "/training-plan". Read more: <https://nextjs.org/docs/messages/prerender-error>
[22:35:17.995] Export encountered an error on /training-plan/page: /training-plan, exiting the build.
[22:35:18.008] ⨯ Next.js build worker exited with code: 1 and signal: null
[22:35:18.086] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[22:35:18.451]
