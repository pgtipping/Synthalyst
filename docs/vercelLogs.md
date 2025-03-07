# Vercel Build Logs

## 2025-03-06

[00:52:12.700] Running build in Washington, D.C., USA (East) – iad1
[00:52:12.810] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: b94ceb2)
[00:52:14.291] Cloning completed: 1.478s
[00:52:22.060] Restored build cache from previous deployment (8zi2QKDdyfeMBgM3NVyPPr4bmxkm)
[00:52:22.143] Running "vercel build"
[00:52:23.014] Vercel CLI 41.2.2
[00:52:24.484] Running "install" command: `npm install`...
[00:52:30.696]
[00:52:30.696] > nextjs-app@0.1.0 postinstall
[00:52:30.696] > prisma generate
[00:52:30.696]
[00:52:31.104] Prisma schema loaded from prisma/schema.prisma
[00:52:31.987]
[00:52:31.987] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 463ms
[00:52:31.987]
[00:52:31.987] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[00:52:31.987]
[00:52:31.988] Tip: Want to turn off tips and other hints? <https://pris.ly/tip-4-nohints>
[00:52:31.988]
[00:52:32.187]
[00:52:32.187] up to date, audited 1468 packages in 7s
[00:52:32.187]
[00:52:32.188] 258 packages are looking for funding
[00:52:32.188] run `npm fund` for details
[00:52:32.204]
[00:52:32.204] 6 vulnerabilities (3 moderate, 3 high)
[00:52:32.204]
[00:52:32.204] To address all issues possible (including breaking changes), run:
[00:52:32.204] npm audit fix --force
[00:52:32.204]
[00:52:32.204] Some issues need review, and may require choosing
[00:52:32.204] a different dependency.
[00:52:32.204]
[00:52:32.204] Run `npm audit` for details.
[00:52:32.269] Detected Next.js version: 15.2.0
[00:52:32.269] Running "prisma migrate deploy && prisma generate && next build"
[00:52:32.710] Prisma schema loaded from prisma/schema.prisma
[00:52:32.717] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[00:52:33.309]
[00:52:33.309] 11 migrations found in prisma/migrations
[00:52:33.309]
[00:52:33.388]
[00:52:33.388] No pending migrations to apply.
[00:52:33.909] Prisma schema loaded from prisma/schema.prisma
[00:52:34.758]
[00:52:34.759] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 436ms
[00:52:34.759]
[00:52:34.759] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[00:52:34.760]
[00:52:34.760] Tip: Want real-time updates to your database without manual polling? Discover how with Pulse: <https://pris.ly/tip-0-pulse>
[00:52:34.760]
[00:52:35.546] ▲ Next.js 15.2.0
[00:52:35.547]
[00:52:35.617] Creating an optimized production build ...
[00:52:51.593] ✓ Compiled successfully
[00:52:51.599] Skipping linting
[00:52:51.599] Checking validity of types ...
[00:53:17.183] Failed to compile.
[00:53:17.183]
[00:53:17.183] ./src/app/api/competency-manager/route.ts:193:44
[00:53:17.183] Type error: Argument of type 'string | null' is not assignable to parameter of type 'string'.
[00:53:17.183] Type 'null' is not assignable to type 'string'.
[00:53:17.183]
[00:53:17.184] [0m [90m 191 |[39m [36mconst[39m content [33m=[39m completion[33m.[39mchoices[[35m0[39m][33m.[39mmessage[33m.[39mcontent[33m;[39m[0m
[00:53:17.184] [0m [90m 192 |[39m [36mtry[39m {[0m
[00:53:17.184] [0m[31m[1m>[22m[39m[90m 193 |[39m competencyFramework [33m=[39m [33mJSON[39m[33m.[39mparse(content)[33m;[39m[0m
[00:53:17.184] [0m [90m |[39m [31m[1m^[22m[39m[0m
[00:53:17.184] [0m [90m 194 |[39m } [36mcatch[39m (parseError) {[0m
[00:53:17.184] [0m [90m 195 |[39m console[33m.[39merror([32m"Error parsing Groq response:"[39m[33m,[39m parseError)[33m;[39m[0m
[00:53:17.184] [0m [90m 196 |[39m console[33m.[39mlog([32m"Raw Groq response:"[39m[33m,[39m content)[33m;[39m[0m
[00:53:17.259] Next.js build worker exited with code: 1 and signal: null
[00:53:17.315] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[00:53:17.654]
