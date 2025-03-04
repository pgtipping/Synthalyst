# Vercel Build Logs

## 2025-03-03

[20:24:30.576] Running build in Washington, D.C., USA (East) – iad1
[20:24:31.198] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 0c26147)
[20:24:31.551] Cloning completed: 352.000ms
[20:24:39.461] Restored build cache from previous deployment (BxuAnJC1kp2Lexj5vXtZHNmRNKaA)
[20:24:39.548] Running "vercel build"
[20:24:40.678] Vercel CLI 41.2.2
[20:24:43.982] Running "install" command: `npm install`...
[20:24:53.111]
[20:24:53.111] added 5 packages, changed 10 packages, and audited 1413 packages in 9s
[20:24:53.111]
[20:24:53.111] 244 packages are looking for funding
[20:24:53.111] run `npm fund` for details
[20:24:53.116]
[20:24:53.116] 3 moderate severity vulnerabilities
[20:24:53.116]
[20:24:53.116] To address all issues (including breaking changes), run:
[20:24:53.116] npm audit fix --force
[20:24:53.116]
[20:24:53.116] Run `npm audit` for details.
[20:24:53.157] Detected Next.js version: 15.2.0
[20:24:53.157] Running "prisma migrate deploy && prisma generate && next build"
[20:24:53.627] Prisma schema loaded from prisma/schema.prisma
[20:24:53.633] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[20:24:54.420]
[20:24:54.420] 6 migrations found in prisma/migrations
[20:24:54.420]
[20:24:54.528]
[20:24:54.534] No pending migrations to apply.
[20:24:55.019] Prisma schema loaded from prisma/schema.prisma
[20:24:55.533]
[20:24:55.533] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 260ms
[20:24:55.533]
[20:24:55.533] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[20:24:55.533]
[20:24:55.533] Tip: Want to react to database changes in your app as they happen? Discover how with Pulse: <https://pris.ly/tip-1-pulse>
[20:24:55.534]
[20:24:56.566] ▲ Next.js 15.2.0
[20:24:56.566]
[20:24:56.650] Creating an optimized production build ...
[20:25:23.171] ⚠ Compiled with warnings
[20:25:23.171]
[20:25:23.171] ./src/app/api/training-plan/enhanced-generate/route.ts
[20:25:23.171] Attempted import error: 'fetchResourcesWithGemini' is not exported from '@/lib/gemini' (imported as 'fetchResourcesWithGemini').
[20:25:23.171]
[20:25:23.172] Import trace for requested module:
[20:25:23.172] ./src/app/api/training-plan/enhanced-generate/route.ts
[20:25:23.172]
[20:25:23.172] ./src/lib/modelComparison.ts
[20:25:23.172] Attempted import error: 'getGeminiModel' is not exported from './gemini' (imported as 'getGeminiModel').
[20:25:23.172]
[20:25:23.172] Import trace for requested module:
[20:25:23.172] ./src/lib/modelComparison.ts
[20:25:23.173] ./src/app/api/model-comparison/route.ts
[20:25:23.173]
[20:25:23.177] Skipping linting
[20:25:23.177] Checking validity of types ...
[20:25:40.150] Failed to compile.
[20:25:40.150]
[20:25:40.151] src/app/api/training-plan/[id]/regenerate-section/route.ts
[20:25:40.151] Type error: Route "src/app/api/training-plan/[id]/regenerate-section/route.ts" has an invalid "POST" export:
[20:25:40.151] Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
[20:25:40.151]
[20:25:40.213] Next.js build worker exited with code: 1 and signal: null
[20:25:40.280] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[20:25:40.669]
