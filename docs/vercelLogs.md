# Vercel Build Logs

[23:11:44.778] Running build in Washington, D.C., USA (East) – iad1
[23:11:44.884] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: e9983da)
[23:11:47.939] Cloning completed: 3.054s
[23:12:02.442] Restored build cache from previous deployment (3u2PKdQgVLvCsnaSrxYngYBigJXi)
[23:12:03.295] Running "vercel build"
[23:12:03.796] Vercel CLI 41.3.2
[23:12:04.194] Running "install" command: `npm install`...
[23:12:08.959] npm warn deprecated @types/lru-cache@7.10.10: This is a stub types definition. lru-cache provides its own type definitions, so you do not need this installed.
[23:12:10.066] npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
[23:12:10.539] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[23:12:10.540] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[23:12:29.993]
[23:12:29.994] > nextjs-app@0.1.0 postinstall
[23:12:29.995] > prisma generate
[23:12:29.995]
[23:12:30.586] Prisma schema loaded from prisma/schema.prisma
[23:12:31.852]
[23:12:31.853] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 619ms
[23:12:31.853]
[23:12:31.853] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[23:12:31.853]
[23:12:31.853] Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
[23:12:31.853]
[23:12:32.061]
[23:12:32.062] added 148 packages, removed 31 packages, changed 74 packages, and audited 1905 packages in 28s
[23:12:32.062]
[23:12:32.062] 396 packages are looking for funding
[23:12:32.063] run `npm fund` for details
[23:12:32.084]
[23:12:32.084] 8 vulnerabilities (1 moderate, 7 high)
[23:12:32.085]
[23:12:32.085] To address issues that do not require attention, run:
[23:12:32.085] npm audit fix
[23:12:32.085]
[23:12:32.085] To address all issues possible (including breaking changes), run:
[23:12:32.085] npm audit fix --force
[23:12:32.089]
[23:12:32.090] Some issues need review, and may require choosing
[23:12:32.090] a different dependency.
[23:12:32.090]
[23:12:32.091] Run `npm audit` for details.
[23:12:32.137] Detected Next.js version: 15.2.3
[23:12:32.138] Running "npm install clsx tailwind-merge @tailwindcss/postcss && rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh"
[23:12:33.434] npm warn idealTree Removing dependencies.@tailwindcss/postcss in favor of devDependencies.@tailwindcss/postcss
[23:12:36.557]
[23:12:36.558] changed 2 packages, and audited 978 packages in 4s
[23:12:36.559]
[23:12:36.559] 214 packages are looking for funding
[23:12:36.559] run `npm fund` for details
[23:12:36.577]
[23:12:36.577] 8 vulnerabilities (1 moderate, 7 high)
[23:12:36.578]
[23:12:36.578] To address issues that do not require attention, run:
[23:12:36.578] npm audit fix
[23:12:36.578]
[23:12:36.579] To address all issues possible (including breaking changes), run:
[23:12:36.579] npm audit fix --force
[23:12:36.579]
[23:12:36.579] Some issues need review, and may require choosing
[23:12:36.579] a different dependency.
[23:12:36.580]
[23:12:36.580] Run `npm audit` for details.
[23:12:36.889] + echo 'Installing required packages...'
[23:12:36.892] + npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[23:12:36.893] Installing required packages...
[23:12:40.101]
[23:12:40.101] up to date, audited 978 packages in 3s
[23:12:40.102]
[23:12:40.102] 214 packages are looking for funding
[23:12:40.102] run `npm fund` for details
[23:12:40.149]
[23:12:40.150] 8 vulnerabilities (1 moderate, 7 high)
[23:12:40.150]
[23:12:40.150] To address issues that do not require attention, run:
[23:12:40.150] npm audit fix
[23:12:40.150]
[23:12:40.151] To address all issues possible (including breaking changes), run:
[23:12:40.151] npm audit fix --force
[23:12:40.151]
[23:12:40.151] Some issues need review, and may require choosing
[23:12:40.152] a different dependency.
[23:12:40.152]
[23:12:40.152] Run `npm audit` for details.
[23:12:40.175] + npm install --save @tailwindcss/postcss clsx tailwind-merge
[23:12:43.325]
[23:12:43.325] up to date, audited 978 packages in 3s
[23:12:43.326]
[23:12:43.326] 214 packages are looking for funding
[23:12:43.326] run `npm fund` for details
[23:12:43.345]
[23:12:43.346] 8 vulnerabilities (1 moderate, 7 high)
[23:12:43.346]
[23:12:43.346] To address issues that do not require attention, run:
[23:12:43.346] npm audit fix
[23:12:43.346]
[23:12:43.346] To address all issues possible (including breaking changes), run:
[23:12:43.346] npm audit fix --force
[23:12:43.346]
[23:12:43.346] Some issues need review, and may require choosing
[23:12:43.346] a different dependency.
[23:12:43.346]
[23:12:43.346] Run `npm audit` for details.
[23:12:43.363] + npm install --save @radix-ui/react-slot @radix-ui/react-tabs
[23:12:46.793]
[23:12:46.793] changed 2 packages, and audited 978 packages in 3s
[23:12:46.793]
[23:12:46.793] 214 packages are looking for funding
[23:12:46.793] run `npm fund` for details
[23:12:46.843]
[23:12:46.843] 8 vulnerabilities (1 moderate, 7 high)
[23:12:46.843]
[23:12:46.843] To address issues that do not require attention, run:
[23:12:46.843] npm audit fix
[23:12:46.843]
[23:12:46.843] To address all issues possible (including breaking changes), run:
[23:12:46.843] npm audit fix --force
[23:12:46.843]
[23:12:46.843] Some issues need review, and may require choosing
[23:12:46.843] a different dependency.
[23:12:46.843]
[23:12:46.843] Run `npm audit` for details.
[23:12:46.861] + echo 'Verifying PostCSS configuration...'
[23:12:46.862] + node scripts/ensure-postcss-config.js
[23:12:46.862] Verifying PostCSS configuration...
[23:12:46.893] ✅ PostCSS configuration is already using @tailwindcss/postcss
[23:12:46.894] ⚠️ @tailwindcss/postcss package is not installed. Installing now...
[23:12:50.030]
[23:12:50.031] up to date, audited 978 packages in 3s
[23:12:50.031]
[23:12:50.032] 214 packages are looking for funding
[23:12:50.032] run `npm fund` for details
[23:12:50.053]
[23:12:50.054] 8 vulnerabilities (1 moderate, 7 high)
[23:12:50.054]
[23:12:50.054] To address issues that do not require attention, run:
[23:12:50.055] npm audit fix
[23:12:50.055]
[23:12:50.055] To address all issues possible (including breaking changes), run:
[23:12:50.056] npm audit fix --force
[23:12:50.056]
[23:12:50.056] Some issues need review, and may require choosing
[23:12:50.056] a different dependency.
[23:12:50.057]
[23:12:50.057] Run `npm audit` for details.
[23:12:50.067] ✅ @tailwindcss/postcss installed successfully!
[23:12:50.068] ⚠️ autoprefixer package is not installed. Installing now...
[23:12:53.389]
[23:12:53.390] up to date, audited 978 packages in 3s
[23:12:53.390]
[23:12:53.390] 214 packages are looking for funding
[23:12:53.391] run `npm fund` for details
[23:12:53.408]
[23:12:53.408] 8 vulnerabilities (1 moderate, 7 high)
[23:12:53.408]
[23:12:53.408] To address issues that do not require attention, run:
[23:12:53.408] npm audit fix
[23:12:53.408]
[23:12:53.408] To address all issues possible (including breaking changes), run:
[23:12:53.408] npm audit fix --force
[23:12:53.409]
[23:12:53.409] Some issues need review, and may require choosing
[23:12:53.409] a different dependency.
[23:12:53.409]
[23:12:53.409] Run `npm audit` for details.
[23:12:53.421] ✅ autoprefixer installed successfully!
[23:12:53.424] ✅ clsx package is installed
[23:12:53.425] ✅ tailwind-merge package is installed
[23:12:53.426] ✅ globals.css already has required Tailwind directives
[23:12:53.426] ✅ PostCSS configuration verified!
[23:12:53.429] + echo 'Preparing UI components...'
[23:12:53.429] + node scripts/prepare-ui-components.js
[23:12:53.430] Preparing UI components...
[23:12:53.459] Preparing UI components for build...
[23:12:53.459] Updating .npmrc file...
[23:12:53.460] components.json exists, ensuring aliases are correctly set...
[23:12:53.460] UI components preparation complete!
[23:12:53.464] + echo 'Verifying UI components...'
[23:12:53.464] + node scripts/verify-ui-components.js
[23:12:53.464] Verifying UI components...
[23:12:53.493] Verifying UI components...
[23:12:53.493] UI component exists: breadcrumb.tsx
[23:12:53.493] UI component exists: button.tsx
[23:12:53.493] UI component exists: card.tsx
[23:12:53.494] UI component exists: tabs.tsx
[23:12:53.494] utils.ts exists
[23:12:53.494] UI components verification complete!
[23:12:53.497] + echo 'Debugging Babel configuration...'
[23:12:53.497] + node scripts/debug-babel.js
[23:12:53.497] Debugging Babel configuration...
[23:12:53.528] === Debugging Babel Configuration ===
[23:12:53.529] ❌ @babel/plugin-syntax-import-attributes is NOT installed
[23:12:53.530] Installing now...
[23:12:55.588] npm warn ERESOLVE overriding peer dependency
[23:12:55.590] npm warn While resolving: @typescript-eslint/eslint-plugin@8.24.0
[23:12:55.590] npm warn Found: typescript@5.8.2
[23:12:55.590] npm warn node_modules/typescript
[23:12:55.590] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[23:12:55.590] npm warn node_modules/@prisma/client
[23:12:55.590] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[23:12:55.591] npm warn node_modules/@auth/prisma-adapter
[23:12:55.591] npm warn 1 more (the root project)
[23:12:55.591] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[23:12:55.591] npm warn
[23:12:55.591] npm warn Could not resolve dependency:
[23:12:55.592] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[23:12:55.592] npm warn node_modules/@typescript-eslint/eslint-plugin
[23:12:55.592] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[23:12:55.592] npm warn node_modules/eslint-config-next
[23:12:55.592] npm warn
[23:12:55.592] npm warn Conflicting peer dependency: typescript@5.7.3
[23:12:55.592] npm warn node_modules/typescript
[23:12:55.592] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[23:12:55.592] npm warn node_modules/@typescript-eslint/eslint-plugin
[23:12:55.592] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[23:12:55.592] npm warn node_modules/eslint-config-next
[23:12:55.601] npm warn ERESOLVE overriding peer dependency
[23:12:55.602] npm warn While resolving: @typescript-eslint/parser@8.24.0
[23:12:55.602] npm warn Found: typescript@5.8.2
[23:12:55.602] npm warn node_modules/typescript
[23:12:55.602] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[23:12:55.602] npm warn node_modules/@prisma/client
[23:12:55.602] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[23:12:55.602] npm warn node_modules/@auth/prisma-adapter
[23:12:55.602] npm warn 1 more (the root project)
[23:12:55.602] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[23:12:55.602] npm warn
[23:12:55.602] npm warn Could not resolve dependency:
[23:12:55.602] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[23:12:55.602] npm warn node_modules/@typescript-eslint/parser
[23:12:55.602] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[23:12:55.603] npm warn node_modules/@typescript-eslint/eslint-plugin
[23:12:55.603] npm warn 1 more (eslint-config-next)
[23:12:55.603] npm warn
[23:12:55.603] npm warn Conflicting peer dependency: typescript@5.7.3
[23:12:55.603] npm warn node_modules/typescript
[23:12:55.603] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[23:12:55.603] npm warn node_modules/@typescript-eslint/parser
[23:12:55.603] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[23:12:55.603] npm warn node_modules/@typescript-eslint/eslint-plugin
[23:12:55.603] npm warn 1 more (eslint-config-next)
[23:12:55.610] npm warn ERESOLVE overriding peer dependency
[23:12:55.611] npm warn While resolving: @typescript-eslint/type-utils@8.24.0
[23:12:55.612] npm warn Found: typescript@5.8.2
[23:12:55.612] npm warn node_modules/typescript
[23:12:55.612] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[23:12:55.612] npm warn node_modules/@prisma/client
[23:12:55.612] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[23:12:55.613] npm warn node_modules/@auth/prisma-adapter
[23:12:55.613] npm warn 1 more (the root project)
[23:12:55.613] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[23:12:55.613] npm warn
[23:12:55.613] npm warn Could not resolve dependency:
[23:12:55.614] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[23:12:55.614] npm warn node_modules/@typescript-eslint/type-utils
[23:12:55.614] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[23:12:55.614] npm warn node_modules/@typescript-eslint/eslint-plugin
[23:12:55.614] npm warn
[23:12:55.615] npm warn Conflicting peer dependency: typescript@5.7.3
[23:12:55.615] npm warn node_modules/typescript
[23:12:55.615] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[23:12:55.615] npm warn node_modules/@typescript-eslint/type-utils
[23:12:55.615] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[23:12:55.615] npm warn node_modules/@typescript-eslint/eslint-plugin
[23:12:55.625] npm warn ERESOLVE overriding peer dependency
[23:12:55.627] npm warn While resolving: @typescript-eslint/typescript-estree@8.24.0
[23:12:55.627] npm warn Found: typescript@5.8.2
[23:12:55.627] npm warn node_modules/typescript
[23:12:55.628] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[23:12:55.628] npm warn node_modules/@prisma/client
[23:12:55.628] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[23:12:55.628] npm warn node_modules/@auth/prisma-adapter
[23:12:55.628] npm warn 1 more (the root project)
[23:12:55.628] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[23:12:55.629] npm warn
[23:12:55.629] npm warn Could not resolve dependency:
[23:12:55.629] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[23:12:55.629] npm warn node_modules/@typescript-eslint/typescript-estree
[23:12:55.629] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[23:12:55.629] npm warn node_modules/@typescript-eslint/parser
[23:12:55.630] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[23:12:55.630] npm warn
[23:12:55.630] npm warn Conflicting peer dependency: typescript@5.7.3
[23:12:55.630] npm warn node_modules/typescript
[23:12:55.630] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[23:12:55.630] npm warn node_modules/@typescript-eslint/typescript-estree
[23:12:55.631] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[23:12:55.631] npm warn node_modules/@typescript-eslint/parser
[23:12:55.631] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[23:12:55.639] npm warn ERESOLVE overriding peer dependency
[23:12:55.639] npm warn While resolving: @typescript-eslint/utils@8.24.0
[23:12:55.639] npm warn Found: typescript@5.8.2
[23:12:55.640] npm warn node_modules/typescript
[23:12:55.640] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[23:12:55.640] npm warn node_modules/@prisma/client
[23:12:55.640] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[23:12:55.640] npm warn node_modules/@auth/prisma-adapter
[23:12:55.640] npm warn 1 more (the root project)
[23:12:55.641] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[23:12:55.641] npm warn
[23:12:55.641] npm warn Could not resolve dependency:
[23:12:55.641] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[23:12:55.641] npm warn node_modules/@typescript-eslint/utils
[23:12:55.642] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[23:12:55.642] npm warn node_modules/@typescript-eslint/eslint-plugin
[23:12:55.642] npm warn 1 more (@typescript-eslint/type-utils)
[23:12:55.642] npm warn
[23:12:55.642] npm warn Conflicting peer dependency: typescript@5.7.3
[23:12:55.642] npm warn node_modules/typescript
[23:12:55.643] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[23:12:55.643] npm warn node_modules/@typescript-eslint/utils
[23:12:55.643] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[23:12:55.643] npm warn node_modules/@typescript-eslint/eslint-plugin
[23:12:55.643] npm warn 1 more (@typescript-eslint/type-utils)
[23:12:56.382] npm error code ERESOLVE
[23:12:56.382] npm error ERESOLVE could not resolve
[23:12:56.382] npm error
[23:12:56.382] npm error While resolving: react-pdf@7.5.1
[23:12:56.383] npm error Found: @types/react@19.0.10
[23:12:56.383] npm error node_modules/@types/react
[23:12:56.383] npm error peer @types/react@">=16" from @mdx-js/react@3.1.0
[23:12:56.383] npm error node_modules/@mdx-js/react
[23:12:56.383] npm error @mdx-js/react@"^3.0.1" from next-mdx-remote@5.0.0
[23:12:56.383] npm error node_modules/next-mdx-remote
[23:12:56.383] npm error next-mdx-remote@"^5.0.0" from the root project
[23:12:56.383] npm error peerOptional @types/react@"\*" from @radix-ui/react-accordion@1.2.3
[23:12:56.383] npm error node_modules/@radix-ui/react-accordion
[23:12:56.383] npm error @radix-ui/react-accordion@"^1.2.3" from the root project
[23:12:56.383] npm error 74 more (@radix-ui/react-alert-dialog, @radix-ui/react-arrow, ...)
[23:12:56.383] npm error
[23:12:56.383] npm error Could not resolve dependency:
[23:12:56.383] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[23:12:56.383] npm error node_modules/react-pdf
[23:12:56.383] npm error react-pdf@"^7.5.1" from the root project
[23:12:56.383] npm error
[23:12:56.383] npm error Conflicting peer dependency: @types/react@18.3.18
[23:12:56.383] npm error node_modules/@types/react
[23:12:56.383] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[23:12:56.383] npm error node_modules/react-pdf
[23:12:56.383] npm error react-pdf@"^7.5.1" from the root project
[23:12:56.383] npm error
[23:12:56.384] npm error Fix the upstream dependency conflict, or retry
[23:12:56.384] npm error this command with --force or --legacy-peer-deps
[23:12:56.384] npm error to accept an incorrect (and potentially broken) dependency resolution.
[23:12:56.384] npm error
[23:12:56.384] npm error
[23:12:56.384] npm error For a full report see:
[23:12:56.384] npm error /vercel/.npm/\_logs/2025-03-18T03_12_53_591Z-eresolve-report.txt
[23:12:56.385] npm error A complete log of this run can be found in: /vercel/.npm/\_logs/2025-03-18T03_12_53_591Z-debug-0.log
[23:12:56.402] ❌ Failed to install @babel/plugin-syntax-import-attributes: Command failed: npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[23:12:56.402] ✅ .babelrc exists
[23:12:56.403] Contents of .babelrc:
[23:12:56.403] {
[23:12:56.403] "presets": [["next/babel"]],
[23:12:56.403] "plugins": ["@babel/plugin-syntax-import-attributes"],
[23:12:56.403] "generatorOpts": {
[23:12:56.403] "maxSize": 2000000
[23:12:56.403] }
[23:12:56.403] }
[23:12:56.403]
[23:12:56.403] ✅ @babel/plugin-syntax-import-attributes is included in .babelrc
[23:12:56.403] ✅ babel.config.js exists
[23:12:56.404] Contents of babel.config.js:
[23:12:56.404] module.exports = {
[23:12:56.404] presets: [["next/babel"]],
[23:12:56.405] plugins: ["@babel/plugin-syntax-import-attributes"],
[23:12:56.405] // Increase the size limit for files that Babel will optimize
[23:12:56.405] generatorOpts: {
[23:12:56.405] maxSize: 2000000, // 2MB
[23:12:56.405] },
[23:12:56.405] };
[23:12:56.405]
[23:12:56.405] ✅ @babel/plugin-syntax-import-attributes is included in babel.config.js
[23:12:56.406] === Babel Configuration Debugging Complete ===
[23:12:56.408] + echo 'Temporarily moving Babel configuration files...'
[23:12:56.408] + '[' -f .babelrc ']'
[23:12:56.408] Temporarily moving Babel configuration files...
[23:12:56.408] + mv .babelrc .babelrc.backup
[23:12:56.413] + '[' -f babel.config.js ']'
[23:12:56.413] + mv babel.config.js babel.config.js.backup
[23:12:56.413] + echo 'Cleaning .next directory...'
[23:12:56.413] + rm -rf .next
[23:12:56.413] Cleaning .next directory...
[23:12:56.453] + echo 'Generating Prisma client...'
[23:12:56.453] + npx prisma generate
[23:12:56.454] Generating Prisma client...
[23:12:57.749] npm warn exec The following package was not found and will be installed: prisma@6.5.0
[23:13:04.018] Prisma schema loaded from prisma/schema.prisma
[23:13:05.247]
[23:13:05.247] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 566ms
[23:13:05.247]
[23:13:05.247] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[23:13:05.247]
[23:13:05.248] Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
[23:13:05.248]
[23:13:05.459] + echo 'Handling database setup...'
[23:13:05.459] + node scripts/handle-db-build.js
[23:13:05.459] Handling database setup...
[23:13:05.493] Build environment detected, creating mock Prisma client...
[23:13:05.493] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[23:13:05.494] Database handling for build complete
[23:13:05.497] + echo 'Building Next.js app with default compiler...'
[23:13:05.497] + npx next build
[23:13:05.497] Building Next.js app with default compiler...
[23:13:06.612] ▲ Next.js 15.2.3
[23:13:06.613]
[23:13:06.642] Creating an optimized production build ...
[23:13:39.173] Failed to compile.
[23:13:39.173]
[23:13:39.174] ./src/app/about/page.tsx
[23:13:39.174] Module not found: Can't resolve '@/components/ui/breadcrumb'
[23:13:39.174]
[23:13:39.174] https://nextjs.org/docs/messages/module-not-found
[23:13:39.174]
[23:13:39.174] ./src/app/admin/communications/page.tsx
[23:13:39.174] Module not found: Can't resolve '@/components/ui/breadcrumb'
[23:13:39.174]
[23:13:39.174] https://nextjs.org/docs/messages/module-not-found
[23:13:39.174]
[23:13:39.174] ./src/app/admin/communications/page.tsx
[23:13:39.174] Module not found: Can't resolve '@/components/ui/button'
[23:13:39.174]
[23:13:39.174] https://nextjs.org/docs/messages/module-not-found
[23:13:39.174]
[23:13:39.174] ./src/app/admin/communications/page.tsx
[23:13:39.174] Module not found: Can't resolve '@/components/ui/card'
[23:13:39.174]
[23:13:39.174] https://nextjs.org/docs/messages/module-not-found
[23:13:39.175]
[23:13:39.175] ./src/app/admin/communications/page.tsx
[23:13:39.175] Module not found: Can't resolve '@/components/ui/tabs'
[23:13:39.175]
[23:13:39.175] https://nextjs.org/docs/messages/module-not-found
[23:13:39.175]
[23:13:39.176]
[23:13:39.176] > Build failed because of webpack errors
[23:13:39.249] Error: Command "npm install clsx tailwind-merge @tailwindcss/postcss && rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh" exited with 1
[23:13:39.614]
