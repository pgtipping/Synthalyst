# Vercel Build Logs

## 2025-03-06

[22:22:52.382] Running build in Washington, D.C., USA (East) – iad1
[22:22:52.507] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: b07c3a8)
[22:22:53.696] Cloning completed: 1.187s
[22:23:01.940] Restored build cache from previous deployment (Gov7qBWNKBVbY8cUJGsHfKh3Krzp)
[22:23:02.154] Running "vercel build"
[22:23:02.941] Vercel CLI 41.2.2
[22:23:04.278] Running "install" command: `npm install`...
[22:23:13.264]
[22:23:13.265] > nextjs-app@0.1.0 postinstall
[22:23:13.266] > prisma generate
[22:23:13.266]
[22:23:13.683] Prisma schema loaded from prisma/schema.prisma
[22:23:14.578]
[22:23:14.579] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 462ms
[22:23:14.579]
[22:23:14.579] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[22:23:14.580]
[22:23:14.580] Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: <https://pris.ly/--optimize>
[22:23:14.580]
[22:23:14.774]
[22:23:14.774] added 11 packages, changed 1 package, and audited 1468 packages in 10s
[22:23:14.774]
[22:23:14.774] 258 packages are looking for funding
[22:23:14.774] run `npm fund` for details
[22:23:14.787]
[22:23:14.787] 6 vulnerabilities (3 moderate, 3 high)
[22:23:14.788]
[22:23:14.788] To address all issues possible (including breaking changes), run:
[22:23:14.788] npm audit fix --force
[22:23:14.788]
[22:23:14.788] Some issues need review, and may require choosing
[22:23:14.788] a different dependency.
[22:23:14.788]
[22:23:14.788] Run `npm audit` for details.
[22:23:14.846] Detected Next.js version: 15.2.0
[22:23:14.848] Running "prisma migrate deploy && prisma generate && next build"
[22:23:15.291] Prisma schema loaded from prisma/schema.prisma
[22:23:15.299] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[22:23:15.385]
[22:23:15.385] 11 migrations found in prisma/migrations
[22:23:15.385]
[22:23:15.498]
[22:23:15.499] No pending migrations to apply.
[22:23:16.023] Prisma schema loaded from prisma/schema.prisma
[22:23:16.887]
[22:23:16.888] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 446ms
[22:23:16.888]
[22:23:16.888] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[22:23:16.889]
[22:23:16.889] Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: <https://pris.ly/orm/survey/release-5-22>
[22:23:16.889]
[22:23:17.703] ▲ Next.js 15.2.0
[22:23:17.704]
[22:23:17.778] Creating an optimized production build ...
[22:23:42.504] ⚠ Compiled with warnings
[22:23:42.504]
[22:23:42.504] ./src/app/api/competency-manager/frameworks/[id]/route.ts
[22:23:42.505] Attempted import error: 'authOptions' is not exported from '@/app/api/auth/[...nextauth]/route' (imported as 'authOptions').
[22:23:42.505]
[22:23:42.505] Import trace for requested module:
[22:23:42.505] ./src/app/api/competency-manager/frameworks/[id]/route.ts
[22:23:42.505]
[22:23:42.505] ./src/app/api/competency-manager/frameworks/[id]/route.ts
[22:23:42.506] Attempted import error: 'authOptions' is not exported from '@/app/api/auth/[...nextauth]/route' (imported as 'authOptions').
[22:23:42.506]
[22:23:42.506] Import trace for requested module:
[22:23:42.506] ./src/app/api/competency-manager/frameworks/[id]/route.ts
[22:23:42.506]
[22:23:42.511] Skipping linting
[22:23:42.512] Checking validity of types ...
[22:24:07.923] Failed to compile.
[22:24:07.923]
[22:24:07.924] ./src/app/api/competency-manager/feedback/route.ts:155:22
[22:24:07.924] Type error: Argument of type '(item: { rating: 1 | 2 | 3 | 4 | 5; }) => void' is not assignable to parameter of type '(value: { id: string; userId: string | null; createdAt: Date; updatedAt: Date; isPublic: boolean; rating: number; feedback: string; llmQualityFeedback: string | null; llmImprovementSuggestion: string; frameworkId: string; }, index: number, array: { ...; }[]) => void'.
[22:24:07.924] Types of parameters 'item' and 'value' are incompatible.
[22:24:07.924] Type '{ id: string; userId: string | null; createdAt: Date; updatedAt: Date; isPublic: boolean; rating: number; feedback: string; llmQualityFeedback: string | null; llmImprovementSuggestion: string; frameworkId: string; }' is not assignable to type '{ rating: 1 | 2 | 3 | 5 | 4; }'.
[22:24:07.924] Types of property 'rating' are incompatible.
[22:24:07.924] Type 'number' is not assignable to type '1 | 2 | 3 | 5 | 4'.
[22:24:07.924]
[22:24:07.924] [0m [90m 153 |[39m }[33m;[39m[0m
[22:24:07.925] [0m [90m 154 |[39m[0m
[22:24:07.925] [0m[31m[1m>[22m[39m[90m 155 |[39m feedback[33m.[39mforEach((item[33m:[39m { rating[33m:[39m [35m1[39m [33m|[39m [35m2[39m [33m|[39m [35m3[39m [33m|[39m [35m4[39m [33m|[39m [35m5[39m }) [33m=>[39m {[0m
[22:24:07.925] [0m [90m |[39m [31m[1m^[22m[39m[0m
[22:24:07.925] [0m [90m 156 |[39m ratingCounts[item[33m.[39mrating][33m++[39m[33m;[39m[0m
[22:24:07.925] [0m [90m 157 |[39m })[33m;[39m[0m
[22:24:07.925] [0m [90m 158 |[39m[0m
[22:24:07.992] Next.js build worker exited with code: 1 and signal: null
[22:24:08.023] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[22:24:08.384]
