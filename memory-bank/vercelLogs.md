# Vercel Build Logs

## 2025-03-05

[06:09:43.621] Running build in Washington, D.C., USA (East) – iad1
[06:09:43.726] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 56cd2bf)
[06:09:51.621] Restored build cache from previous deployment (2ad5WkoqiA3ZCMcypmnKGwqsFppM)
[06:09:51.704] Running "vercel build"
[06:09:52.266] Vercel CLI 41.2.2
[06:09:54.264] Running "install" command: `npm install`...
[06:10:02.578]
[06:10:02.578] > nextjs-app@0.1.0 postinstall
[06:10:02.578] > prisma generate
[06:10:02.579]
[06:10:03.022] Prisma schema loaded from prisma/schema.prisma
[06:10:03.597]
[06:10:03.597] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 271ms
[06:10:03.597]
[06:10:03.597] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[06:10:03.597]
[06:10:03.598] Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
[06:10:03.598]
[06:10:03.799]
[06:10:03.800] up to date, audited 1453 packages in 9s
[06:10:03.800]
[06:10:03.800] 258 packages are looking for funding
[06:10:03.800] run `npm fund` for details
[06:10:03.813]
[06:10:03.813] 5 vulnerabilities (3 moderate, 2 high)
[06:10:03.813]
[06:10:03.813] To address all issues (including breaking changes), run:
[06:10:03.814] npm audit fix --force
[06:10:03.814]
[06:10:03.814] Run `npm audit` for details.
[06:10:03.863] Detected Next.js version: 15.2.0
[06:10:03.864] Running "prisma migrate deploy && prisma generate && next build"
[06:10:04.329] Prisma schema loaded from prisma/schema.prisma
[06:10:04.337] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[06:10:04.421]
[06:10:04.422] 7 migrations found in prisma/migrations
[06:10:04.422]
[06:10:04.473]
[06:10:04.473] No pending migrations to apply.
[06:10:05.010] Prisma schema loaded from prisma/schema.prisma
[06:10:05.604]
[06:10:05.604] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 252ms
[06:10:05.604]
[06:10:05.605] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[06:10:05.605]
[06:10:05.605] Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: https://pris.ly/orm/survey/release-5-22
[06:10:05.605]
[06:10:06.468] ▲ Next.js 15.2.0
[06:10:06.468]
[06:10:06.550] Creating an optimized production build ...
[06:10:21.425] ✓ Compiled successfully
[06:10:21.431] Skipping linting
[06:10:21.431] Checking validity of types ...
[06:10:40.073] Failed to compile.
[06:10:40.074]
[06:10:40.074] src/app/api/admin/contact-submissions/[id]/delete/route.ts
[06:10:40.074] Type error: Route "src/app/api/admin/contact-submissions/[id]/delete/route.ts" has an invalid "DELETE" export:
[06:10:40.074] Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
[06:10:40.074]
[06:10:40.133] Next.js build worker exited with code: 1 and signal: null
[06:10:40.170] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[06:10:40.550]
