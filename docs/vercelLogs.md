# Vercel Build Logs

## 2025-03-08

[16:00:22.052] Running build in Washington, D.C., USA (East) – iad1
[16:00:22.383] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: b66e889)
[16:00:23.052] Cloning completed: 667.000ms
[16:00:34.405] Restored build cache from previous deployment (GktoTsmQVvVTru893xrUxSgQncKx)
[16:00:34.641] Running "vercel build"
[16:00:35.441] Vercel CLI 41.2.2
[16:00:37.528] Running "install" command: `npm install`...
[16:00:46.254]
[16:00:46.255] > nextjs-app@0.1.0 postinstall
[16:00:46.256] > prisma generate
[16:00:46.256]
[16:00:46.719] Prisma schema loaded from prisma/schema.prisma
[16:00:47.650]
[16:00:47.650] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 501ms
[16:00:47.650]
[16:00:47.650] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[16:00:47.650]
[16:00:47.650] Tip: Want real-time updates to your database without manual polling? Discover how with Pulse: https://pris.ly/tip-0-pulse
[16:00:47.650]
[16:00:47.850]
[16:00:47.851] up to date, audited 1575 packages in 10s
[16:00:47.851]
[16:00:47.851] 261 packages are looking for funding
[16:00:47.851] run `npm fund` for details
[16:00:47.868]
[16:00:47.869] 6 vulnerabilities (3 moderate, 3 high)
[16:00:47.869]
[16:00:47.869] To address all issues possible (including breaking changes), run:
[16:00:47.870] npm audit fix --force
[16:00:47.870]
[16:00:47.870] Some issues need review, and may require choosing
[16:00:47.870] a different dependency.
[16:00:47.870]
[16:00:47.871] Run `npm audit` for details.
[16:00:47.915] Detected Next.js version: 15.2.1
[16:00:47.919] Running "prisma generate && next build"
[16:00:48.353] Prisma schema loaded from prisma/schema.prisma
[16:00:49.229]
[16:00:49.229] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 459ms
[16:00:49.230]
[16:00:49.230] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[16:00:49.230]
[16:00:49.230] Tip: Curious about the SQL queries Prisma ORM generates? Optimize helps you enhance your visibility: https://pris.ly/tip-2-optimize
[16:00:49.230]
[16:00:50.062] ▲ Next.js 15.2.1
[16:00:50.063]
[16:00:50.142] Creating an optimized production build ...
[16:00:50.546] ⚠ Production code optimization has been disabled in your project. Read more: https://nextjs.org/docs/messages/minification-disabled
[16:01:04.817] ✓ Compiled successfully
[16:01:04.822] Skipping validation of types
[16:01:04.822] Skipping linting
[16:01:05.089] Collecting page data ...
[16:01:10.959] Generating static pages (0/73) ...
[16:01:11.853] Generating static pages (18/73)
[16:01:11.927] Generating static pages (36/73)
[16:01:12.869] Generating static pages (54/73)
[16:01:13.822] prisma:info Starting a postgresql pool with 3 connections.
[16:01:19.370] prisma:error
[16:01:19.371] Invalid `prisma.$queryRaw()` invocation:
[16:01:19.371]
[16:01:19.371]
[16:01:19.372] Can't reach database server at `ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech:5432`
[16:01:19.372]
[16:01:19.372] Please make sure your database server is running at `ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech:5432`.
[16:01:19.372] prisma:error
[16:01:19.372] Invalid `prisma.$queryRaw()` invocation:
[16:01:19.372]
[16:01:19.373]
[16:01:19.373] Can't reach database server at `ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech:5432`
[16:01:19.373]
[16:01:19.373] Please make sure your database server is running at `ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech:5432`.
[16:01:19.373] Error occurred prerendering page "/admin/contact-submissions". Read more: https://nextjs.org/docs/messages/prerender-error
[16:01:19.373] PrismaClientInitializationError:
[16:01:19.374] Invalid `prisma.$queryRaw()` invocation:
[16:01:19.374]
[16:01:19.374]
[16:01:19.374] Can't reach database server at `ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech:5432`
[16:01:19.374]
[16:01:19.374] Please make sure your database server is running at `ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech:5432`.
[16:01:19.375] at Un.handleRequestError (/vercel/path1/node_modules/@prisma/client/runtime/library.js:121:7748)
[16:01:19.375] at Un.handleAndLogRequestError (/vercel/path1/node_modules/@prisma/client/runtime/library.js:121:6771)
[16:01:19.375] at Un.request (/vercel/path1/node_modules/@prisma/client/runtime/library.js:121:6478)
[16:01:19.375] at async l (/vercel/path1/node_modules/@prisma/client/runtime/library.js:130:9644)
[16:01:19.375] at async d (/vercel/path1/.next/server/app/admin/contact-submissions/page.js:2:1073)
[16:01:19.375] Export encountered an error on /admin/contact-submissions/page: /admin/contact-submissions, exiting the build.
[16:01:19.379] ⨯ Next.js build worker exited with code: 1 and signal: null
[16:01:19.426] Error: Command "prisma generate && next build" exited with 1
[16:01:19.771]
