# Vercel Build Logs

[22:02:14.970] Running build in Washington, D.C., USA (East) – iad1
[22:02:15.092] Retrieving list of deployment files...
[22:02:15.473] Downloading 658 deployment files...
[22:02:29.318] Restored build cache from previous deployment (3u2PKdQgVLvCsnaSrxYngYBigJXi)
[22:02:29.999] Running "vercel build"
[22:02:30.707] Vercel CLI 41.3.2
[22:02:32.230] Running "install" command: `npm install`...
[22:02:36.801] npm warn deprecated @types/lru-cache@7.10.10: This is a stub types definition. lru-cache provides its own type definitions, so you do not need this installed.
[22:02:37.825] npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
[22:02:38.390] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[22:02:38.393] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[22:02:58.514]
[22:02:58.515] > nextjs-app@0.1.0 postinstall
[22:02:58.515] > prisma generate
[22:02:58.515]
[22:02:59.077] Environment variables loaded from .env
[22:02:59.080] Prisma schema loaded from prisma/schema.prisma
[22:03:00.238]
[22:03:00.239] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 534ms
[22:03:00.240]
[22:03:00.240] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[22:03:00.240]
[22:03:00.240] Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
[22:03:00.241]
[22:03:00.448]
[22:03:00.448] added 148 packages, removed 31 packages, changed 74 packages, and audited 1905 packages in 28s
[22:03:00.449]
[22:03:00.449] 396 packages are looking for funding
[22:03:00.449] run `npm fund` for details
[22:03:00.464]
[22:03:00.464] 8 vulnerabilities (1 moderate, 7 high)
[22:03:00.464]
[22:03:00.465] To address issues that do not require attention, run:
[22:03:00.465] npm audit fix
[22:03:00.465]
[22:03:00.465] To address all issues possible (including breaking changes), run:
[22:03:00.469] npm audit fix --force
[22:03:00.469]
[22:03:00.469] Some issues need review, and may require choosing
[22:03:00.469] a different dependency.
[22:03:00.470]
[22:03:00.470] Run `npm audit` for details.
[22:03:00.511] Detected Next.js version: 15.2.3
[22:03:00.515] Running "chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh"
[22:03:00.518] + echo 'Installing required packages...'
[22:03:00.520] + npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[22:03:00.520] Installing required packages...
[22:03:04.495]
[22:03:04.496] changed 1 package, and audited 978 packages in 4s
[22:03:04.496]
[22:03:04.496] 214 packages are looking for funding
[22:03:04.497] run `npm fund` for details
[22:03:04.515]
[22:03:04.516] 8 vulnerabilities (1 moderate, 7 high)
[22:03:04.516]
[22:03:04.516] To address issues that do not require attention, run:
[22:03:04.517] npm audit fix
[22:03:04.517]
[22:03:04.517] To address all issues possible (including breaking changes), run:
[22:03:04.517] npm audit fix --force
[22:03:04.517]
[22:03:04.517] Some issues need review, and may require choosing
[22:03:04.518] a different dependency.
[22:03:04.518]
[22:03:04.518] Run `npm audit` for details.
[22:03:04.528] + npm install --save @tailwindcss/postcss
[22:03:05.695] npm warn idealTree Removing dependencies.@tailwindcss/postcss in favor of devDependencies.@tailwindcss/postcss
[22:03:07.595]
[22:03:07.595] up to date, audited 978 packages in 3s
[22:03:07.596]
[22:03:07.596] 214 packages are looking for funding
[22:03:07.596] run `npm fund` for details
[22:03:07.614]
[22:03:07.615] 8 vulnerabilities (1 moderate, 7 high)
[22:03:07.615]
[22:03:07.615] To address issues that do not require attention, run:
[22:03:07.615] npm audit fix
[22:03:07.615]
[22:03:07.615] To address all issues possible (including breaking changes), run:
[22:03:07.615] npm audit fix --force
[22:03:07.615]
[22:03:07.615] Some issues need review, and may require choosing
[22:03:07.615] a different dependency.
[22:03:07.615]
[22:03:07.615] Run `npm audit` for details.
[22:03:07.626] + echo 'Verifying PostCSS configuration...'
[22:03:07.627] + node scripts/ensure-postcss-config.js
[22:03:07.627] Verifying PostCSS configuration...
[22:03:07.654] ✅ PostCSS configuration is already using @tailwindcss/postcss
[22:03:07.654] ⚠️ @tailwindcss/postcss package is not installed. Installing now...
[22:03:10.556]
[22:03:10.556] up to date, audited 978 packages in 3s
[22:03:10.557]
[22:03:10.557] 214 packages are looking for funding
[22:03:10.557] run `npm fund` for details
[22:03:10.575]
[22:03:10.576] 8 vulnerabilities (1 moderate, 7 high)
[22:03:10.576]
[22:03:10.576] To address issues that do not require attention, run:
[22:03:10.576] npm audit fix
[22:03:10.576]
[22:03:10.577] To address all issues possible (including breaking changes), run:
[22:03:10.577] npm audit fix --force
[22:03:10.577]
[22:03:10.577] Some issues need review, and may require choosing
[22:03:10.577] a different dependency.
[22:03:10.577]
[22:03:10.578] Run `npm audit` for details.
[22:03:10.589] ✅ @tailwindcss/postcss installed successfully!
[22:03:10.590] ✅ globals.css already has required Tailwind directives
[22:03:10.590] ✅ PostCSS configuration verified!
[22:03:10.593] + echo 'Debugging Babel configuration...'
[22:03:10.593] + node scripts/debug-babel.js
[22:03:10.593] Debugging Babel configuration...
[22:03:10.623] === Debugging Babel Configuration ===
[22:03:10.624] ❌ @babel/plugin-syntax-import-attributes is NOT installed
[22:03:10.624] Installing now...
[22:03:13.554]
[22:03:13.554] up to date, audited 978 packages in 3s
[22:03:13.554]
[22:03:13.554] 214 packages are looking for funding
[22:03:13.554] run `npm fund` for details
[22:03:13.570]
[22:03:13.570] 8 vulnerabilities (1 moderate, 7 high)
[22:03:13.570]
[22:03:13.571] To address issues that do not require attention, run:
[22:03:13.571] npm audit fix
[22:03:13.571]
[22:03:13.571] To address all issues possible (including breaking changes), run:
[22:03:13.571] npm audit fix --force
[22:03:13.571]
[22:03:13.572] Some issues need review, and may require choosing
[22:03:13.572] a different dependency.
[22:03:13.572]
[22:03:13.572] Run `npm audit` for details.
[22:03:13.585] ✅ @babel/plugin-syntax-import-attributes installed successfully
[22:03:13.586] ✅ .babelrc exists
[22:03:13.586] Contents of .babelrc:
[22:03:13.586] {
[22:03:13.586] "presets": [["next/babel"]],
[22:03:13.587] "plugins": ["@babel/plugin-syntax-import-attributes"],
[22:03:13.587] "generatorOpts": {
[22:03:13.587] "maxSize": 2000000
[22:03:13.587] }
[22:03:13.587] }
[22:03:13.587]
[22:03:13.588] ✅ @babel/plugin-syntax-import-attributes is included in .babelrc
[22:03:13.588] ✅ babel.config.js exists
[22:03:13.588] Contents of babel.config.js:
[22:03:13.588] module.exports = {
[22:03:13.588] presets: [["next/babel"]],
[22:03:13.588] plugins: ["@babel/plugin-syntax-import-attributes"],
[22:03:13.588] // Increase the size limit for files that Babel will optimize
[22:03:13.589] generatorOpts: {
[22:03:13.589] maxSize: 2000000, // 2MB
[22:03:13.589] },
[22:03:13.589] };
[22:03:13.589]
[22:03:13.589] ✅ @babel/plugin-syntax-import-attributes is included in babel.config.js
[22:03:13.590] === Babel Configuration Debugging Complete ===
[22:03:13.592] + echo 'Temporarily moving Babel configuration files...'
[22:03:13.593] Temporarily moving Babel configuration files...
[22:03:13.594] + '[' -f .babelrc ']'
[22:03:13.594] + mv .babelrc .babelrc.backup
[22:03:13.595] + '[' -f babel.config.js ']'
[22:03:13.595] + mv babel.config.js babel.config.js.backup
[22:03:13.598] + echo 'Cleaning .next directory...'
[22:03:13.598] + rm -rf .next
[22:03:13.598] Cleaning .next directory...
[22:03:13.635] + echo 'Generating Prisma client...'
[22:03:13.635] + npx prisma generate
[22:03:13.635] Generating Prisma client...
[22:03:14.731] npm warn exec The following package was not found and will be installed: prisma@6.5.0
[22:03:20.515] Environment variables loaded from .env
[22:03:20.518] Prisma schema loaded from prisma/schema.prisma
[22:03:21.753]
[22:03:21.754] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 538ms
[22:03:21.754]
[22:03:21.754] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[22:03:21.754]
[22:03:21.754] Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
[22:03:21.754]
[22:03:21.964] + echo 'Handling database setup...'
[22:03:21.964] + node scripts/handle-db-build.js
[22:03:21.965] Handling database setup...
[22:03:21.991] Build environment detected, creating mock Prisma client...
[22:03:21.992] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[22:03:21.993] Database handling for build complete
[22:03:21.996] + echo 'Building Next.js app with default compiler...'
[22:03:21.996] + npx next build
[22:03:21.996] Building Next.js app with default compiler...
[22:03:22.912] ▲ Next.js 15.2.3
[22:03:22.913] - Environments: .env
[22:03:22.913]
[22:03:22.938] Creating an optimized production build ...
[22:03:52.624] Failed to compile.
[22:03:52.625]
[22:03:52.626] ./src/app/about/page.tsx
[22:03:52.626] Module not found: Can't resolve '@/components/ui/breadcrumb'
[22:03:52.626]
[22:03:52.628] https://nextjs.org/docs/messages/module-not-found
[22:03:52.628]
[22:03:52.628] ./src/app/admin/communications/page.tsx
[22:03:52.628] Module not found: Can't resolve '@/components/ui/breadcrumb'
[22:03:52.628]
[22:03:52.628] https://nextjs.org/docs/messages/module-not-found
[22:03:52.628]
[22:03:52.628] ./src/app/admin/communications/page.tsx
[22:03:52.628] Module not found: Can't resolve '@/components/ui/button'
[22:03:52.628]
[22:03:52.628] https://nextjs.org/docs/messages/module-not-found
[22:03:52.629]
[22:03:52.629] ./src/app/admin/communications/page.tsx
[22:03:52.629] Module not found: Can't resolve '@/components/ui/card'
[22:03:52.629]
[22:03:52.629] https://nextjs.org/docs/messages/module-not-found
[22:03:52.629]
[22:03:52.629] ./src/app/admin/communications/page.tsx
[22:03:52.629] Module not found: Can't resolve '@/components/ui/tabs'
[22:03:52.629]
[22:03:52.629] https://nextjs.org/docs/messages/module-not-found
[22:03:52.629]
[22:03:52.629]
[22:03:52.629] > Build failed because of webpack errors
[22:03:52.696] Error: Command "chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh" exited with 1
[22:03:52.989]
