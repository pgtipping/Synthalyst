# Vercel Build Logs

## 2025-03-07

[12:11:28.080] Running build in Washington, D.C., USA (East) – iad1
[12:11:28.182] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 192c94f)
[12:11:29.319] Cloning completed: 1.137s
[12:11:40.088] Restored build cache from previous deployment (8DvcpiDNHLAUPjcAn1TrBRqUpQAM)
[12:11:40.175] Running "vercel build"
[12:11:40.831] Vercel CLI 41.2.2
[12:11:41.159] Running "install" command: `npm install`...
[12:11:47.315]
[12:11:47.315] > nextjs-app@0.1.0 postinstall
[12:11:47.315] > prisma generate
[12:11:47.315]
[12:11:47.720] Prisma schema loaded from prisma/schema.prisma
[12:11:48.637]
[12:11:48.637] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 505ms
[12:11:48.637]
[12:11:48.637] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[12:11:48.638]
[12:11:48.638] Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: https://pris.ly/--optimize
[12:11:48.638]
[12:11:48.849]
[12:11:48.849] up to date, audited 1471 packages in 7s
[12:11:48.849]
[12:11:48.849] 258 packages are looking for funding
[12:11:48.850] run `npm fund` for details
[12:11:48.872]
[12:11:48.873] 6 vulnerabilities (3 moderate, 3 high)
[12:11:48.873]
[12:11:48.873] To address all issues possible (including breaking changes), run:
[12:11:48.873] npm audit fix --force
[12:11:48.873]
[12:11:48.873] Some issues need review, and may require choosing
[12:11:48.874] a different dependency.
[12:11:48.874]
[12:11:48.879] Run `npm audit` for details.
[12:11:48.963] Detected Next.js version: 15.2.0
[12:11:48.965] Running "prisma migrate deploy && prisma generate && next build"
[12:11:49.416] Prisma schema loaded from prisma/schema.prisma
[12:11:49.423] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[12:11:50.255]
[12:11:50.256] 11 migrations found in prisma/migrations
[12:11:50.256]
[12:11:50.363]
[12:11:50.363] No pending migrations to apply.
[12:11:50.883] Prisma schema loaded from prisma/schema.prisma
[12:11:51.711]
[12:11:51.711] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 430ms
[12:11:51.712]
[12:11:51.712] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[12:11:51.712]
[12:11:51.712] Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
[12:11:51.712]
[12:11:52.523] ▲ Next.js 15.2.0
[12:11:52.524]
[12:11:52.596] Creating an optimized production build ...
[12:12:07.524] ✓ Compiled successfully
[12:12:07.531] Skipping linting
[12:12:07.531] Checking validity of types ...
[12:12:32.046] Collecting page data ...
[12:12:37.749] Generating static pages (0/66) ...
[12:12:38.783] Generating static pages (16/66)
[12:12:38.877] Generating static pages (32/66)
[12:12:39.448] Error occurred prerendering page "/competency-manager". Read more: https://nextjs.org/docs/messages/prerender-error
[12:12:39.448] Error: `Tooltip` must be used within `TooltipProvider`
[12:12:39.449] at /vercel/path1/.next/server/chunks/8302.js:1:16269
[12:12:39.449] at M (/vercel/path1/.next/server/chunks/340.js:1:1143)
[12:12:39.449] at nL (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:46773)
[12:12:39.449] at nU (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:48548)
[12:12:39.449] at nq (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:67434)
[12:12:39.449] at nH (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:65009)
[12:12:39.450] at nG (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:70865)
[12:12:39.450] at nz (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:69548)
[12:12:39.450] at nq (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:67701)
[12:12:39.450] at nH (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:76:65009)
[12:12:39.450] Export encountered an error on /competency-manager/page: /competency-manager, exiting the build.
[12:12:39.458] ⨯ Next.js build worker exited with code: 1 and signal: null
[12:12:39.501] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[12:12:39.826]
