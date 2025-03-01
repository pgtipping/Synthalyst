# Vercel Build Logs

## 2025-03-01

### Failed Deployment (Commit: fff5c02)

[16:00:53.753] Running build in Washington, D.C., USA (East) – iad1
[16:00:53.846] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: fff5c02)
[16:00:54.772] Cloning completed: 925.000ms
[16:01:02.728] Restored build cache from previous deployment (BB5fyMUTpkGv6C4u1TxDU65Gg7tS)
[16:01:02.817] Running "vercel build"
[16:01:03.822] Vercel CLI 41.2.2
[16:01:05.157] Running "install" command: `npm install`...
[16:01:09.143]
[16:01:09.143] changed 1 package, and audited 1364 packages in 4s
[16:01:09.143]
[16:01:09.144] 240 packages are looking for funding
[16:01:09.144] run `npm fund` for details
[16:01:09.148]
[16:01:09.148] 3 moderate severity vulnerabilities
[16:01:09.148]
[16:01:09.148] To address all issues (including breaking changes), run:
[16:01:09.148] npm audit fix --force
[16:01:09.148]
[16:01:09.148] Run `npm audit` for details.
[16:01:09.992] Detected Next.js version: 15.1.7
[16:01:09.993] Running "prisma migrate deploy && prisma generate && next build"
[16:01:11.121] Prisma schema loaded from prisma/schema.prisma
[16:01:11.128] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[16:01:12.022]
[16:01:12.022] 6 migrations found in prisma/migrations
[16:01:12.022]
[16:01:12.121]
[16:01:12.122] No pending migrations to apply.
[16:01:12.608] Prisma schema loaded from prisma/schema.prisma
[16:01:13.140]
[16:01:13.141] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 275ms
[16:01:13.141]
[16:01:13.141] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[16:01:13.141]
[16:01:13.141] Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: <https://pris.ly/--optimize>
[16:01:13.141]
[16:01:13.995] ▲ Next.js 15.1.7
[16:01:13.995]
[16:01:14.077] Creating an optimized production build ...
[16:01:24.380] ✓ Compiled successfully
[16:01:24.384] Skipping linting
[16:01:24.384] Checking validity of types ...
[16:01:37.008] Collecting page data ...
[16:01:41.120] Generating static pages (0/50) ...
[16:01:42.197] Generating static pages (12/50)
[16:01:42.197] Generating static pages (24/50)
[16:01:42.197] Error occurred prerendering page "/about". Read more: <https://nextjs.org/docs/messages/prerender-error>
[16:01:42.197] Error: Event handlers cannot be passed to Client Component props.
[16:01:42.197] {src: ..., alt: ..., fill: true, className: ..., onError: function onError}
[16:01:42.197] ^^^^^^^^^^^^^^^^
[16:01:42.197] If you need interactivity, consider converting part of this to a Client Component.
[16:01:42.197] at e$ (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:84:23556)
[16:01:42.197] at Object.toJSON (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:84:14874)
[16:01:42.197] at stringify (<anonymous>)
[16:01:42.197] at eU (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:84:26231)
[16:01:42.197] at eB (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:84:26461)
[16:01:42.197] at eq (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:84:27015)
[16:01:42.198] at AsyncLocalStorage.run (node:internal/async_local_storage/async_hooks:91:14)
[16:01:42.198] at /vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:84:39810
[16:01:42.198] at node:internal/process/task_queues:151:7
[16:01:42.198] at AsyncResource.runInAsyncScope (node:async_hooks:211:14)
[16:01:42.198] Export encountered an error on /about/page: /about, exiting the build.
[16:01:42.205] ⨯ Next.js build worker exited with code: 1 and signal: null
[16:01:42.255] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[16:01:42.624]

### Successful Deployment (Commit: e6c3712)

[16:30:45.123] Running build in Washington, D.C., USA (East) – iad1
[16:30:45.246] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: e6c3712)
[16:30:46.172] Cloning completed: 926.000ms
[16:30:54.128] Restored build cache from previous deployment (BB5fyMUTpkGv6C4u1TxDU65Gg7tS)
[16:30:54.217] Running "vercel build"
[16:30:55.222] Vercel CLI 41.2.2
[16:30:56.557] Running "install" command: `npm install`...
[16:31:00.543]
[16:31:00.543] changed 0 packages, and audited 1364 packages in 4s
[16:31:00.544]
[16:31:00.544] 240 packages are looking for funding
[16:31:00.544] run `npm fund` for details
[16:31:00.548]
[16:31:00.548] 3 moderate severity vulnerabilities
[16:31:00.548]
[16:31:00.548] To address all issues (including breaking changes), run:
[16:31:00.548] npm audit fix --force
[16:31:00.548]
[16:31:00.548] Run `npm audit` for details.
[16:31:01.392] Detected Next.js version: 15.1.7
[16:31:01.393] Running "prisma migrate deploy && prisma generate && next build"
[16:31:02.521] Prisma schema loaded from prisma/schema.prisma
[16:31:02.528] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[16:31:03.422]
[16:31:03.422] 6 migrations found in prisma/migrations
[16:31:03.422]
[16:31:03.521]
[16:31:03.522] No pending migrations to apply.
[16:31:04.008] Prisma schema loaded from prisma/schema.prisma
[16:31:04.540]
[16:31:04.541] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 275ms
[16:31:04.541]
[16:31:04.541] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[16:31:04.541]
[16:31:04.541] Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: <https://pris.ly/--optimize>
[16:31:04.541]
[16:31:05.395] ▲ Next.js 15.1.7
[16:31:05.395]
[16:31:05.477] Creating an optimized production build ...
[16:31:15.780] ✓ Compiled successfully
[16:31:15.784] Skipping linting
[16:31:15.784] Checking validity of types ...
[16:31:28.408] Collecting page data ...
[16:31:32.520] Generating static pages (0/50) ...
[16:31:33.597] Generating static pages (12/50)
[16:31:33.597] Generating static pages (24/50)
[16:31:33.597] Generating static pages (36/50)
[16:31:33.597] Generating static pages (48/50)
[16:31:33.597] Generating static pages (50/50)
[16:31:33.597] Finalizing page optimization ...
[16:31:34.597]
[16:31:34.597] Route (app) Size First Load JS
[16:31:34.597] ┌ ○ / 5.45 kB 132 kB
[16:31:34.597] ├ ○ /about 5.45 kB 132 kB
[16:31:34.597] ├ ○ /services 5.45 kB 132 kB
[16:31:34.597] ├ ○ /contact 5.45 kB 132 kB
[16:31:34.597] ├ ○ /tools 5.45 kB 132 kB
[16:31:34.597] ├ ○ /blog 5.45 kB 132 kB
[16:31:34.597] └ ○ /get-started 5.45 kB 132 kB
[16:31:34.597] + First Load JS shared by all 126 kB
[16:31:34.597] ├ chunks/framework-8883d1e9be70c3da.js 45.1 kB
[16:31:34.597] ├ chunks/main-app-6f9f17b9c2a9f2c2.js 33.6 kB
[16:31:34.597] ├ chunks/app/layout-30a7a33c0c0f34e1.js 46.4 kB
[16:31:34.597] └ chunks/webpack-5a93052639d01e0d.js 815 B
[16:31:34.597]
[16:31:34.597] ƒ Middleware 51.5 kB
[16:31:34.597]
[16:31:34.597] ○ (Static) automatically rendered as static HTML (uses no initial props)
[16:31:34.597]
[16:31:35.597] Done in 34.2s
[16:31:36.597] Deployment complete!
