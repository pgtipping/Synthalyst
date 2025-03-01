# Vercel Build Logs

## 2025-03-01

[06:37:02.173] Running build in Washington, D.C., USA (East) – iad1
[06:37:02.266] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: e5399a0)
[06:37:02.563] Cloning completed: 294.000ms
[06:37:09.003] Restored build cache from previous deployment (DuM2AfMYTD9TskkzxVE87aFgyRTo)
[06:37:09.094] Running "vercel build"
[06:37:09.928] Vercel CLI 41.2.2
[06:37:11.219] Running "install" command: `npm install`...
[06:37:15.266]
[06:37:15.266] changed 1 package, and audited 1364 packages in 4s
[06:37:15.266]
[06:37:15.266] 240 packages are looking for funding
[06:37:15.267] run `npm fund` for details
[06:37:15.270]
[06:37:15.270] 3 moderate severity vulnerabilities
[06:37:15.270]
[06:37:15.271] To address all issues (including breaking changes), run:
[06:37:15.271] npm audit fix --force
[06:37:15.271]
[06:37:15.271] Run `npm audit` for details.
[06:37:15.312] Detected Next.js version: 15.1.7
[06:37:15.313] Running "prisma migrate deploy && prisma generate && next build"
[06:37:16.253] Prisma schema loaded from prisma/schema.prisma
[06:37:16.266] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[06:37:16.557]
[06:37:16.557] 6 migrations found in prisma/migrations
[06:37:16.561]
[06:37:16.621]
[06:37:16.621] No pending migrations to apply.
[06:37:17.150] Prisma schema loaded from prisma/schema.prisma
[06:37:17.797]
[06:37:17.798] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 372ms
[06:37:17.798]
[06:37:17.798] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[06:37:17.798]
[06:37:17.798] Tip: Want to react to database changes in your app as they happen? Discover how with Pulse: <https://pris.ly/tip-1-pulse>
[06:37:17.798]
[06:37:19.780] ▲ Next.js 15.1.7
[06:37:19.780]
[06:37:19.860] Creating an optimized production build ...
[06:37:29.129] ✓ Compiled successfully
[06:37:29.133] Skipping linting
[06:37:29.133] Checking validity of types ...
[06:37:41.975] Collecting page data ...
[06:37:46.132] Generating static pages (0/46) ...
[06:37:47.198] Generating static pages (11/46)
[06:37:47.198] Generating static pages (22/46)
[06:37:47.388] Generating static pages (34/46)
[06:37:47.543] ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/jd-developer". Read more: <https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout>
[06:37:47.543] at a (/vercel/path1/.next/server/chunks/1164.js:1:26515)
[06:37:47.543] at f (/vercel/path1/.next/server/chunks/1164.js:1:43111)
[06:37:47.543] at f (/vercel/path1/.next/server/app/jd-developer/page.js:1:62614)
[06:37:47.543] at nO (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:45959)
[06:37:47.543] at nI (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:47734)
[06:37:47.543] at nL (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:65533)
[06:37:47.543] at nN (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:63164)
[06:37:47.543] at n$ (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:46311)
[06:37:47.543] at nI (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:47780)
[06:37:47.543] at nI (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:62515)
[06:37:47.543] Error occurred prerendering page "/jd-developer". Read more: <https://nextjs.org/docs/messages/prerender-error>
[06:37:47.543] Export encountered an error on /jd-developer/page: /jd-developer, exiting the build.
[06:37:47.551] ⨯ Next.js build worker exited with code: 1 and signal: null
[06:37:47.598] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[06:37:48.033]
