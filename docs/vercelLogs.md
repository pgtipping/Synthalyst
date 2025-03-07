# Vercel Build Logs

## 2025-03-07

[14:56:26.973] Running build in Washington, D.C., USA (East) – iad1
[14:56:27.531] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: aaac177)
[14:56:28.918] Cloning completed: 1.385s
[14:56:37.557] Restored build cache from previous deployment (5cmw6vyEJQcmm1y3kwi2WKbLNUNv)
[14:56:37.676] Running "vercel build"
[14:56:39.549] Vercel CLI 41.2.2
[14:56:39.911] Running "install" command: `npm install`...
[14:56:46.825]
[14:56:46.825] > nextjs-app@0.1.0 postinstall
[14:56:46.825] > prisma generate
[14:56:46.826]
[14:56:47.241] Prisma schema loaded from prisma/schema.prisma
[14:56:48.129]
[14:56:48.129] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 475ms
[14:56:48.129]
[14:56:48.129] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[14:56:48.130]
[14:56:48.130] Tip: Curious about the SQL queries Prisma ORM generates? Optimize helps you enhance your visibility: <https://pris.ly/tip-2-optimize>
[14:56:48.130]
[14:56:48.330]
[14:56:48.330] added 20 packages, and audited 1491 packages in 8s
[14:56:48.330]
[14:56:48.331] 259 packages are looking for funding
[14:56:48.331] run `npm fund` for details
[14:56:48.342]
[14:56:48.342] 6 vulnerabilities (3 moderate, 3 high)
[14:56:48.343]
[14:56:48.343] To address all issues possible (including breaking changes), run:
[14:56:48.343] npm audit fix --force
[14:56:48.343]
[14:56:48.344] Some issues need review, and may require choosing
[14:56:48.344] a different dependency.
[14:56:48.344]
[14:56:48.344] Run `npm audit` for details.
[14:56:48.393] Detected Next.js version: 15.2.0
[14:56:48.398] Running "prisma migrate deploy && prisma generate && next build"
[14:56:48.825] Prisma schema loaded from prisma/schema.prisma
[14:56:48.832] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[14:56:48.933]
[14:56:48.934] 11 migrations found in prisma/migrations
[14:56:48.934]
[14:56:48.983]
[14:56:48.983] No pending migrations to apply.
[14:56:49.522] Prisma schema loaded from prisma/schema.prisma
[14:56:50.350]
[14:56:50.351] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 429ms
[14:56:50.351]
[14:56:50.351] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[14:56:50.351]
[14:56:50.351] Tip: Want to turn off tips and other hints? <https://pris.ly/tip-4-nohints>
[14:56:50.351]
[14:56:51.368] ▲ Next.js 15.2.0
[14:56:51.369]
[14:56:51.454] Creating an optimized production build ...
[14:57:04.274] Failed to compile.
[14:57:04.275]
[14:57:04.275] ./src/app/competency-manager/shared/[id]/page.tsx
[14:57:04.275] Error: [31mx[0m You are attempting to export "generateMetadata" from a component marked with "use client", which is disallowed. Either remove the export, or the "use client" directive. Read more: https://
[14:57:04.275] [31m|[0m nextjs.org/docs/app/api-reference/directives/use-client
[14:57:04.276] [31m|[0m
[14:57:04.276] [31m|[0m
[14:57:04.277] ,-[[36;1;4m/vercel/path1/src/app/competency-manager/shared/[id]/page.tsx[0m:17:1]
[14:57:04.277] [2m14[0m | };
[14:57:04.277] [2m15[0m | }
[14:57:04.277] [2m16[0m |
[14:57:04.277] [2m17[0m | export async function generateMetadata({
[14:57:04.277] : [35;1m ^^^^^^^^^^^^^^^^[0m
[14:57:04.277] [2m18[0m | params,
[14:57:04.277] [2m19[0m | }: SharedFrameworkPageProps): Promise<Metadata> {
[14:57:04.277] [2m20[0m | const framework = await getFramework(params.id);
[14:57:04.277] `----
[14:57:04.277]
[14:57:04.277] Import trace for requested module:
[14:57:04.278] ./src/app/competency-manager/shared/[id]/page.tsx
[14:57:04.278]
[14:57:04.278]
[14:57:04.278] > Build failed because of webpack errors
[14:57:04.324] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[14:57:04.835]
