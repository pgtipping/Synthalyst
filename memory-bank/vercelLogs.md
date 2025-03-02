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
[21:35:21.579] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[21:35:21.579]
[21:35:21.579] Tip: Want to react to database changes in your app as they happen? Discover how with Pulse: https://pris.ly/tip-1-pulse
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
[21:35:49.119] at t.X (.next/server/webpack-runtime.js:1:2135)
[21:35:49.119] at <unknown> (.next/server/app/api/interview-questions/generate/route.js:52:2772)
[21:35:49.119] at Object.<anonymous> (.next/server/app/api/interview-questions/generate/route.js:52:2828)
[21:35:49.120]
[21:35:49.121] > Build error occurred
[21:35:49.126] [Error: Failed to collect page data for /api/interview-questions/generate] {
[21:35:49.126] type: 'Error'
[21:35:49.126] }
[21:35:49.161] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[21:35:49.561]
