# Vercel Build Logs

## 2025-03-01

[21:35:01.260] Running build in Washington, D.C., USA (East) – iad1
[21:35:01.355] Cloning github.com/pgtipping/Synthalyst (Branch: upgrade-shadcn-ui, Commit: 9502792)
[21:35:01.782] Cloning completed: 427.000ms
[21:35:09.380] Restored build cache from previous deployment (6XtFizMDS33g1qVKGi71W9ZqKooX)
[21:35:09.459] Running "vercel build"
[21:35:10.246] Vercel CLI 41.2.2
[21:35:14.773] Running "install" command: `npm install`...
[21:35:19.874]
[21:35:19.874] added 37 packages, removed 9 packages, changed 1 package, and audited 1394 packages in 5s
[21:35:19.875]
[21:35:19.875] 244 packages are looking for funding
[21:35:19.875] run `npm fund` for details
[21:35:19.878]
[21:35:19.879] 3 moderate severity vulnerabilities
[21:35:19.879]
[21:35:19.879] To address all issues (including breaking changes), run:
[21:35:19.879] npm audit fix --force
[21:35:19.879]
[21:35:19.879] Run `npm audit` for details.
[21:35:19.917] Detected Next.js version: 15.1.7
[21:35:19.918] Running "prisma migrate deploy && prisma generate && next build"
[21:35:20.369] Prisma schema loaded from prisma/schema.prisma
[21:35:20.377] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-red-dew-a4ina63f-pooler.us-east-1.aws.neon.tech"
[21:35:20.480]
[21:35:20.481] 6 migrations found in prisma/migrations
[21:35:20.481]
[21:35:20.581]
[21:35:20.582] No pending migrations to apply.
[21:35:21.043] Prisma schema loaded from prisma/schema.prisma
[21:35:21.578]
[21:35:21.578] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 272ms
[21:35:21.578]
[21:35:21.579] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[21:35:21.579]
[21:35:21.579] Tip: Want to react to database changes in your app as they happen? Discover how with Pulse: <https://pris.ly/tip-1-pulse>
[21:35:21.579]
[21:35:22.413] ▲ Next.js 15.1.7
[21:35:22.413]
[21:35:22.491] Creating an optimized production build ...
[21:35:35.338] ✓ Compiled successfully
[21:35:35.343] Skipping linting
[21:35:35.343] Checking validity of types ...
[21:35:48.349] Collecting page data ...
[21:35:49.119] Error: The GROQ_API_KEY environment variable is missing or empty; either provide it, or instantiate the Groq client with an apiKey option, like new Groq({ apiKey: 'My API Key' }).
[21:35:49.119] at new p2 (.next/server/chunks/8742.js:1:151178)
[21:35:49.119] at 31879 (.next/server/app/api/interview-questions/generate/route.js:1:1972)
[21:35:49.119] at t (.next/server/webpack-runtime.js:1:128)
[21:35:49.119] at t (.next/server/app/api/interview-questions/generate/route.js:52:2759)
[21:35:49.119] at <unknown> (.next/server/app/api/interview-questions/generate/route.js:52:2800)
[23:40:03.335] Running build in Washington, D.C., USA (East) – iad1
[23:40:03.430] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 80d8af8)
[23:40:03.735] Cloning completed: 306.000ms
[23:40:11.129] Restored build cache from previous deployment (6XtFizMDS33g1qVKGi71W9ZqKooX)
[23:40:11.221] Running "vercel build"
[23:40:12.207] Vercel CLI 41.2.2
[23:40:13.496] Running "install" command: `npm install`...
[23:40:16.997]
[23:40:16.997] added 51 packages, removed 9 packages, changed 1 package, and audited 1408 packages in 3s
[23:40:16.997]
[23:40:16.997] 244 packages are looking for funding
[23:40:16.997] run `npm fund` for details
[23:40:17.003]
[23:40:17.003] 3 moderate severity vulnerabilities
[23:40:17.003]
[23:40:17.004] To address all issues (including breaking changes), run:
[23:40:17.004] npm audit fix --force
[23:40:17.004]
[23:40:17.004] Run `npm audit` for details.
[23:40:17.353] Detected Next.js version: 15.1.7
[23:40:17.353] Running "prisma migrate deploy && prisma generate && next build"
[23:40:18.495] Prisma schema loaded from prisma/schema.prisma
[23:40:18.502] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[23:40:19.363]
[23:40:19.363] 6 migrations found in prisma/migrations
[23:40:19.364]
[23:40:19.462]
[23:40:19.463] No pending migrations to apply.
[23:40:19.974] Prisma schema loaded from prisma/schema.prisma
[23:40:20.510]
[23:40:20.510] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 283ms
[23:40:20.510]
[23:40:20.510] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[23:40:20.510]
[23:40:20.510] Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: <https://pris.ly/--optimize>
[23:40:20.510]
[23:40:21.361] ▲ Next.js 15.1.7
[23:40:21.362]
[23:40:21.441] Creating an optimized production build ...
[23:40:34.366] ✓ Compiled successfully
[23:40:34.371] Skipping linting
[23:40:34.371] Checking validity of types ...
[23:40:47.761] Failed to compile.
[23:40:47.761]
[23:40:47.761] ./src/app/2do/page.tsx:43:11
[23:40:47.761] Type error: Object literal may only specify known properties, and 'variant' does not exist in type 'Omit<ToasterToast, "id">'.
[23:40:47.761]
[23:40:47.762] [0m [90m 41 |[39m title[33m:[39m [32m"Error"[39m[33m,[39m[0m
[23:40:47.762] [0m [90m 42 |[39m description[33m:[39m [32m"Failed to load tasks. Please try again."[39m[33m,[39m[0m
[23:40:47.762] [0m[31m[1m>[22m[39m[90m 43 |[39m variant[33m:[39m [32m"destructive"[39m[33m,[39m[0m
[23:40:47.762] [0m [90m |[39m [31m[1m^[22m[39m[0m
[23:40:47.762] [0m [90m 44 |[39m })[33m;[39m[0m
[23:40:47.762] [0m [90m 45 |[39m } [36mfinally[39m {[0m
[23:40:47.762] [0m [90m 46 |[39m setIsLoading([36mfalse[39m)[33m;[39m[0m
[23:40:47.810] Next.js build worker exited with code: 1 and signal: null
[23:40:47.843] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[23:40:48.179]
