# Vercel Build Logs

## 2025-03-05

[06:04:26.682] Running build in Washington, D.C., USA (East) – iad1
[06:04:26.781] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 7796f68)
[06:04:27.829] Cloning completed: 1.048s
[06:04:40.194] Running "install" command: `npm install`...
[06:04:48.032]
[06:04:48.032] > nextjs-app@0.1.0 postinstall
[06:04:48.032] > prisma generate
[06:04:48.032]
[06:04:48.461] Prisma schema loaded from prisma/schema.prisma
[06:04:48.990]
[06:04:48.991] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 281ms
[06:04:48.991]
[06:04:48.991] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[06:04:48.991]
[06:04:48.991] Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
[06:04:48.991]
[06:04:49.191]
[06:04:49.192] up to date, audited 1453 packages in 7s
[06:04:49.192]
[06:04:49.192] 258 packages are looking for funding
[06:04:49.192] run `npm fund` for details
[06:04:49.205]
[06:04:49.205] 5 vulnerabilities (3 moderate, 2 high)
[06:04:49.205]
[06:04:49.206] To address all issues (including breaking changes), run:
[06:04:49.206] npm audit fix --force
[06:04:49.206]
[06:04:49.206] Run `npm audit` for details.
[06:04:49.258] Detected Next.js version: 15.2.0
[06:04:49.258] Running "prisma migrate deploy && prisma generate && next build"
[06:04:49.707] Prisma schema loaded from prisma/schema.prisma
[06:04:49.713] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[06:04:49.806]
[06:04:49.806] 7 migrations found in prisma/migrations
[06:04:49.806]
[06:04:49.869]
[06:04:49.870] No pending migrations to apply.
[06:04:50.345] Prisma schema loaded from prisma/schema.prisma
[06:04:50.861]
[06:04:50.861] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 240ms
[06:04:50.861]
[06:04:50.861] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[06:04:50.861]
[06:04:50.861] Tip: Curious about the SQL queries Prisma ORM generates? Optimize helps you enhance your visibility: https://pris.ly/tip-2-optimize
[06:04:50.861]
[06:04:51.686] ▲ Next.js 15.2.0
[06:04:51.686]
[06:04:51.765] Creating an optimized production build ...
[06:05:06.099] ✓ Compiled successfully
[06:05:06.105] Skipping linting
[06:05:06.105] Checking validity of types ...
[06:05:23.832] Failed to compile.
[06:05:23.832]
[06:05:23.832] src/app/api/admin/contact-submissions/[id]/delete/route.ts
[06:05:23.832] Type error: Route "src/app/api/admin/contact-submissions/[id]/delete/route.ts" has an invalid "DELETE" export:
[06:05:23.832] Type "{ params: { id: string; }; }" is not a valid type for the function's second argument.
[06:05:23.832]
[06:05:23.884] Next.js build worker exited with code: 1 and signal: null
[06:05:23.935] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[06:05:24.299]
