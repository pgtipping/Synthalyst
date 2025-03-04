# Vercel Build Logs

## 2025-03-04

[06:39:35.760] Running build in Washington, D.C., USA (East) – iad1
[06:39:35.862] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 05710bf)
[06:39:36.208] Cloning completed: 346.000ms
[06:39:42.866] Restored build cache from previous deployment (2CaCiFC2bbGGNnku6WY5DryAHC2d)
[06:39:42.948] Running "vercel build"
[06:39:44.020] Vercel CLI 41.2.2
[06:39:45.238] Running "install" command: `npm install`...
[06:39:54.600]
[06:39:54.601] added 21 packages, and audited 1434 packages in 9s
[06:39:54.601]
[06:39:54.601] 255 packages are looking for funding
[06:39:54.601] run `npm fund` for details
[06:39:54.613]
[06:39:54.613] 5 vulnerabilities (3 moderate, 2 high)
[06:39:54.613]
[06:39:54.613] To address all issues (including breaking changes), run:
[06:39:54.613] npm audit fix --force
[06:39:54.613]
[06:39:54.613] Run `npm audit` for details.
[06:39:54.659] Detected Next.js version: 15.2.0
[06:39:54.660] Running "prisma migrate deploy && prisma generate && next build"
[06:39:55.112] Prisma schema loaded from prisma/schema.prisma
[06:39:55.119] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[06:39:55.209]
[06:39:55.209] 6 migrations found in prisma/migrations
[06:39:55.209]
[06:39:55.271]
[06:39:55.271] No pending migrations to apply.
[06:39:55.727] Prisma schema loaded from prisma/schema.prisma
[06:39:56.251]
[06:39:56.251] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 255ms
[06:39:56.251]
[06:39:56.251] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[06:39:56.251]
[06:39:56.251] Tip: Want to react to database changes in your app as they happen? Discover how with Pulse: <https://pris.ly/tip-1-pulse>
[06:39:56.251]
[06:39:57.093] ▲ Next.js 15.2.0
[06:39:57.093]
[06:39:57.173] Creating an optimized production build ...
[06:40:14.435] Failed to compile.
[06:40:14.436]
[06:40:14.436] ./node_modules/react-pdf-html/dist/esm/resolveCssFile.js
[06:40:14.437] Module not found: Can't resolve 'fs'
[06:40:14.437]
[06:40:14.437] <https://nextjs.org/docs/messages/module-not-found>
[06:40:14.437]
[06:40:14.437] Import trace for requested module:
[06:40:14.437] ./node_modules/react-pdf-html/dist/esm/parse.js
[06:40:14.438] ./node_modules/react-pdf-html/dist/esm/render.js
[06:40:14.438] ./node_modules/react-pdf-html/dist/esm/index.js
[06:40:14.438] ./src/components/TrainingPlanPDF.tsx
[06:40:14.438] ./src/app/training-plan/client-component.tsx
[06:40:14.438]
[06:40:14.439]
[06:40:14.439] > Build failed because of webpack errors
[06:40:14.571] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[06:40:14.967]
