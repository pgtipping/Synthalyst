# Vercel Build Logs

[21:21:14.887] Running build in Washington, D.C., USA (East) – iad1
[21:21:15.014] Retrieving list of deployment files...
[21:21:16.169] Downloading 655 deployment files...
[21:21:29.561] Restored build cache from previous deployment (3u2PKdQgVLvCsnaSrxYngYBigJXi)
[21:21:30.300] Running "vercel build"
[21:21:33.605] Vercel CLI 41.3.2
[21:21:34.502] Running "install" command: `npm install`...
[21:21:39.767] npm warn deprecated @types/lru-cache@7.10.10: This is a stub types definition. lru-cache provides its own type definitions, so you do not need this installed.
[21:21:41.160] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[21:21:41.321] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[21:21:41.389] npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
[21:21:58.978]
[21:21:58.978] > nextjs-app@0.1.0 postinstall
[21:21:58.979] > prisma generate
[21:21:58.979]
[21:21:59.563] Environment variables loaded from .env
[21:21:59.566] Prisma schema loaded from prisma/schema.prisma
[21:22:00.864]
[21:22:00.865] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 650ms
[21:22:00.865]
[21:22:00.865] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[21:22:00.866]
[21:22:00.866] Tip: Want real-time updates to your database without manual polling? Discover how with Pulse: https://pris.ly/tip-0-pulse
[21:22:00.866]
[21:22:01.080]
[21:22:01.081] added 152 packages, removed 37 packages, changed 47 packages, and audited 1903 packages in 26s
[21:22:01.081]
[21:22:01.081] 397 packages are looking for funding
[21:22:01.081] run `npm fund` for details
[21:22:01.104]
[21:22:01.104] 8 vulnerabilities (1 moderate, 7 high)
[21:22:01.105]
[21:22:01.105] To address issues that do not require attention, run:
[21:22:01.105] npm audit fix
[21:22:01.105]
[21:22:01.105] To address all issues possible (including breaking changes), run:
[21:22:01.106] npm audit fix --force
[21:22:01.106]
[21:22:01.106] Some issues need review, and may require choosing
[21:22:01.106] a different dependency.
[21:22:01.106]
[21:22:01.107] Run `npm audit` for details.
[21:22:01.157] Detected Next.js version: 15.2.3
[21:22:01.158] Running "npm install @tailwindcss/postcss && node scripts/ensure-postcss-config.js && npx rimraf .next && prisma generate && node scripts/handle-db-build.js && next build"
[21:22:02.318] npm warn idealTree Removing dependencies.@tailwindcss/postcss in favor of devDependencies.@tailwindcss/postcss
[21:22:05.199]
[21:22:05.199] up to date, audited 978 packages in 4s
[21:22:05.199]
[21:22:05.199] 214 packages are looking for funding
[21:22:05.199] run `npm fund` for details
[21:22:05.219]
[21:22:05.220] 8 vulnerabilities (1 moderate, 7 high)
[21:22:05.220]
[21:22:05.220] To address issues that do not require attention, run:
[21:22:05.221] npm audit fix
[21:22:05.221]
[21:22:05.221] To address all issues possible (including breaking changes), run:
[21:22:05.221] npm audit fix --force
[21:22:05.221]
[21:22:05.221] Some issues need review, and may require choosing
[21:22:05.222] a different dependency.
[21:22:05.222]
[21:22:05.222] Run `npm audit` for details.
[21:22:05.263] ✅ PostCSS configuration is already using @tailwindcss/postcss
[21:22:05.264] ⚠️ @tailwindcss/postcss package is not installed. Installing now...
[21:22:08.358]
[21:22:08.359] up to date, audited 978 packages in 3s
[21:22:08.360]
[21:22:08.360] 214 packages are looking for funding
[21:22:08.360] run `npm fund` for details
[21:22:08.379]
[21:22:08.380] 8 vulnerabilities (1 moderate, 7 high)
[21:22:08.380]
[21:22:08.380] To address issues that do not require attention, run:
[21:22:08.381] npm audit fix
[21:22:08.381]
[21:22:08.381] To address all issues possible (including breaking changes), run:
[21:22:08.381] npm audit fix --force
[21:22:08.382]
[21:22:08.382] Some issues need review, and may require choosing
[21:22:08.382] a different dependency.
[21:22:08.382]
[21:22:08.382] Run `npm audit` for details.
[21:22:08.399] ✅ @tailwindcss/postcss installed successfully!
[21:22:08.399] ✅ PostCSS configuration verified!
[21:22:10.772] sh: line 1: rimraf: command not found
[21:22:10.788] Error: Command "npm install @tailwindcss/postcss && node scripts/ensure-postcss-config.js && npx rimraf .next && prisma generate && node scripts/handle-db-build.js && next build" exited with 127
[21:22:12.246]
