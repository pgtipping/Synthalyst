# Vercel Build Logs

## 2025-03-05

[05:59:28.162] Running build in Washington, D.C., USA (East) – iad1
[05:59:28.258] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 9a754c3)
[05:59:29.388] Cloning completed: 1.130s
[05:59:37.169] Restored build cache from previous deployment (2ad5WkoqiA3ZCMcypmnKGwqsFppM)
[05:59:37.250] Running "vercel build"
[05:59:38.065] Vercel CLI 41.2.2
[05:59:39.687] Running "install" command: `npm install`...
[05:59:48.760]
[05:59:48.760] > nextjs-app@0.1.0 postinstall
[05:59:48.760] > prisma generate
[05:59:48.760]
[05:59:49.201] Prisma schema loaded from prisma/schema.prisma
[05:59:49.779]
[05:59:49.780] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 328ms
[05:59:49.780]
[05:59:49.780] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[05:59:49.780]
[05:59:49.780] Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: https://pris.ly/orm/survey/release-5-22
[05:59:49.780]
[05:59:49.981]
[05:59:49.982] up to date, audited 1453 packages in 10s
[05:59:49.982]
[05:59:49.982] 258 packages are looking for funding
[05:59:49.982] run `npm fund` for details
[05:59:49.994]
[05:59:49.995] 5 vulnerabilities (3 moderate, 2 high)
[05:59:49.995]
[05:59:49.995] To address all issues (including breaking changes), run:
[05:59:49.995] npm audit fix --force
[05:59:49.995]
[05:59:49.995] Run `npm audit` for details.
[05:59:50.034] Detected Next.js version: 15.2.0
[05:59:50.035] Running "prisma migrate deploy && prisma generate && next build"
[05:59:50.498] Prisma schema loaded from prisma/schema.prisma
[05:59:50.505] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[05:59:50.592]
[05:59:50.592] 7 migrations found in prisma/migrations
[05:59:50.592]
[05:59:50.858]
[05:59:50.858] No pending migrations to apply.
[05:59:51.343] Prisma schema loaded from prisma/schema.prisma
[05:59:51.864]
[05:59:51.864] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 252ms
[05:59:51.864]
[05:59:51.864] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[05:59:51.864]
[05:59:51.864] Tip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate
[05:59:51.864]
[05:59:52.877] ▲ Next.js 15.2.0
[05:59:52.877]
[05:59:52.960] Creating an optimized production build ...
[06:00:07.398] ✓ Compiled successfully
[06:00:07.403] Skipping linting
[06:00:07.404] Checking validity of types ...
[06:00:25.467] Failed to compile.
[06:00:25.467]
[06:00:25.467] src/app/admin/layout.tsx
[06:00:25.467] Type error: File '/vercel/path1/src/app/admin/layout.tsx' is not a module.
[06:00:25.467]
[06:00:25.526] Next.js build worker exited with code: 1 and signal: null
[06:00:25.578] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[06:00:26.022]
