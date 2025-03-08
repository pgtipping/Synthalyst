# Vercel Build Logs

## 2025-03-08

[05:37:32.089] Running build in Washington, D.C., USA (East) – iad1
[05:37:32.210] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: a641fb6)
[05:37:33.542] Cloning completed: 1.329s
[05:37:42.632] Restored build cache from previous deployment (6x29YpDkWPgUMcbxernvQZ4pjB9i)
[05:37:42.825] Running "vercel build"
[05:37:43.453] Vercel CLI 41.2.2
[05:37:45.341] Running "install" command: `npm install`...
[05:37:52.835]
[05:37:52.836] > nextjs-app@0.1.0 postinstall
[05:37:52.836] > prisma generate
[05:37:52.836]
[05:37:53.407] Prisma schema loaded from prisma/schema.prisma
[05:37:54.288]
[05:37:54.289] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 472ms
[05:37:54.289]
[05:37:54.289] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[05:37:54.289]
[05:37:54.290] Tip: Curious about the SQL queries Prisma ORM generates? Optimize helps you enhance your visibility: https://pris.ly/tip-2-optimize
[05:37:54.290]
[05:37:54.489]
[05:37:54.489] changed 1 package, and audited 1518 packages in 9s
[05:37:54.489]
[05:37:54.489] 259 packages are looking for funding
[05:37:54.490] run `npm fund` for details
[05:37:54.504]
[05:37:54.504] 6 vulnerabilities (3 moderate, 3 high)
[05:37:54.505]
[05:37:54.505] To address all issues possible (including breaking changes), run:
[05:37:54.505] npm audit fix --force
[05:37:54.505]
[05:37:54.506] Some issues need review, and may require choosing
[05:37:54.506] a different dependency.
[05:37:54.506]
[05:37:54.506] Run `npm audit` for details.
[05:37:54.556] Detected Next.js version: 15.2.1
[05:37:54.559] Running "prisma migrate deploy && prisma generate && next build"
[05:37:55.017] Prisma schema loaded from prisma/schema.prisma
[05:37:55.024] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[05:37:55.124]
[05:37:55.125] 11 migrations found in prisma/migrations
[05:37:55.125]
[05:38:05.178] Error: P1002
[05:38:05.178]
[05:38:05.178] The database server at `ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech:5432` was reached but timed out.
[05:38:05.178]
[05:38:05.178] Please try again.
[05:38:05.178]
[05:38:05.178] Please make sure your database server is running at `ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech:5432`.
[05:38:05.178]
[05:38:05.178] Context: Timed out trying to acquire a postgres advisory lock (SELECT pg_advisory_lock(72707369)). Elapsed: 10000ms. See https://pris.ly/d/migrate-advisory-locking for details.
[05:38:05.178]
[05:38:05.178]
[05:38:05.191] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[05:38:05.562]
