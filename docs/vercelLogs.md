# Vercel Build Logs

[00:39:07.248] Running build in Washington, D.C., USA (East) – iad1
[00:39:07.380] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 3d59ce2)
[00:39:08.268] Cloning completed: 888.000ms
[00:39:20.788] Restored build cache from previous deployment (3u2PKdQgVLvCsnaSrxYngYBigJXi)
[00:39:21.556] Running "vercel build"
[00:39:22.625] Vercel CLI 41.3.2
[00:39:23.514] Running "install" command: `npm install`...
[00:39:27.142] npm warn deprecated @types/lru-cache@7.10.10: This is a stub types definition. lru-cache provides its own type definitions, so you do not need this installed.
[00:39:28.577] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[00:39:28.617] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[00:39:28.787] npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
[00:39:44.741]
[00:39:44.741] > nextjs-app@0.1.0 postinstall
[00:39:44.742] > prisma generate
[00:39:44.742]
[00:39:45.308] Prisma schema loaded from prisma/schema.prisma
[00:39:46.773]
[00:39:46.773] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 825ms
[00:39:46.774]
[00:39:46.774] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[00:39:46.774]
[00:39:46.774] Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
[00:39:46.774]
[00:39:46.966]
[00:39:46.966] added 148 packages, removed 31 packages, changed 47 packages, and audited 1905 packages in 23s
[00:39:46.967]
[00:39:46.967] 396 packages are looking for funding
[00:39:46.967] run `npm fund` for details
[00:39:46.985]
[00:39:46.985] 8 vulnerabilities (1 moderate, 7 high)
[00:39:46.985]
[00:39:46.985] To address issues that do not require attention, run:
[00:39:46.986] npm audit fix
[00:39:46.986]
[00:39:46.986] To address all issues possible (including breaking changes), run:
[00:39:46.986] npm audit fix --force
[00:39:46.992]
[00:39:46.992] Some issues need review, and may require choosing
[00:39:46.992] a different dependency.
[00:39:46.992]
[00:39:46.992] Run `npm audit` for details.
[00:39:47.309] Detected Next.js version: 15.2.3
[00:39:47.310] Running "npm install clsx tailwind-merge @tailwindcss/postcss && rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh"
[00:39:52.093]
[00:39:52.093] up to date, audited 978 packages in 5s
[00:39:52.094]
[00:39:52.094] 214 packages are looking for funding
[00:39:52.094] run `npm fund` for details
[00:39:52.110]
[00:39:52.110] 8 vulnerabilities (1 moderate, 7 high)
[00:39:52.110]
[00:39:52.110] To address issues that do not require attention, run:
[00:39:52.110] npm audit fix
[00:39:52.110]
[00:39:52.111] To address all issues possible (including breaking changes), run:
[00:39:52.111] npm audit fix --force
[00:39:52.111]
[00:39:52.111] Some issues need review, and may require choosing
[00:39:52.111] a different dependency.
[00:39:52.111]
[00:39:52.111] Run `npm audit` for details.
[00:39:52.306] + echo 'Installing required packages...'
[00:39:52.307] + npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[00:39:52.307] Installing required packages...
[00:39:55.392]
[00:39:55.392] up to date, audited 978 packages in 3s
[00:39:55.393]
[00:39:55.393] 214 packages are looking for funding
[00:39:55.393] run `npm fund` for details
[00:39:55.410]
[00:39:55.410] 8 vulnerabilities (1 moderate, 7 high)
[00:39:55.410]
[00:39:55.410] To address issues that do not require attention, run:
[00:39:55.411] npm audit fix
[00:39:55.411]
[00:39:55.411] To address all issues possible (including breaking changes), run:
[00:39:55.411] npm audit fix --force
[00:39:55.411]
[00:39:55.411] Some issues need review, and may require choosing
[00:39:55.412] a different dependency.
[00:39:55.412]
[00:39:55.412] Run `npm audit` for details.
[00:39:55.424] + npm install --save @tailwindcss/postcss@4.0.14 clsx@2.1.1 tailwind-merge@3.0.2
[00:39:58.464]
[00:39:58.464] up to date, audited 978 packages in 3s
[00:39:58.464]
[00:39:58.464] 214 packages are looking for funding
[00:39:58.464] run `npm fund` for details
[00:39:58.485]
[00:39:58.485] 8 vulnerabilities (1 moderate, 7 high)
[00:39:58.485]
[00:39:58.487] To address issues that do not require attention, run:
[00:39:58.487] npm audit fix
[00:39:58.487]
[00:39:58.487] To address all issues possible (including breaking changes), run:
[00:39:58.487] npm audit fix --force
[00:39:58.487]
[00:39:58.487] Some issues need review, and may require choosing
[00:39:58.487] a different dependency.
[00:39:58.487]
[00:39:58.488] Run `npm audit` for details.
[00:39:58.497] + npm install --save @radix-ui/react-slot@1.1.2 @radix-ui/react-tabs@1.1.3
[00:40:01.683]
[00:40:01.684] changed 1 package, and audited 978 packages in 3s
[00:40:01.684]
[00:40:01.684] 214 packages are looking for funding
[00:40:01.684] run `npm fund` for details
[00:40:01.700]
[00:40:01.701] 8 vulnerabilities (1 moderate, 7 high)
[00:40:01.701]
[00:40:01.701] To address issues that do not require attention, run:
[00:40:01.701] npm audit fix
[00:40:01.701]
[00:40:01.701] To address all issues possible (including breaking changes), run:
[00:40:01.701] npm audit fix --force
[00:40:01.701]
[00:40:01.701] Some issues need review, and may require choosing
[00:40:01.701] a different dependency.
[00:40:01.701]
[00:40:01.701] Run `npm audit` for details.
[00:40:01.719] + echo 'Verifying essential dependencies...'
[00:40:01.719] + npm list clsx
[00:40:01.720] Verifying essential dependencies...
[00:40:02.672] + npm list tailwind-merge
[00:40:03.564] + npm list @radix-ui/react-tabs
[00:40:04.451] + npm list @tailwindcss/postcss
[00:40:05.349] + echo '@tailwindcss/postcss not found, installing...'
[00:40:05.350] + npm install --save @tailwindcss/postcss@4.0.14
[00:40:05.350] @tailwindcss/postcss not found, installing...
[00:40:08.369]
[00:40:08.371] up to date, audited 978 packages in 3s
[00:40:08.371]
[00:40:08.371] 214 packages are looking for funding
[00:40:08.371] run `npm fund` for details
[00:40:08.391]
[00:40:08.391] 8 vulnerabilities (1 moderate, 7 high)
[00:40:08.392]
[00:40:08.392] To address issues that do not require attention, run:
[00:40:08.392] npm audit fix
[00:40:08.392]
[00:40:08.392] To address all issues possible (including breaking changes), run:
[00:40:08.393] npm audit fix --force
[00:40:08.393]
[00:40:08.393] Some issues need review, and may require choosing
[00:40:08.393] a different dependency.
[00:40:08.393]
[00:40:08.393] Run `npm audit` for details.
[00:40:08.403] + echo 'Verifying PostCSS configuration...'
[00:40:08.403] + node scripts/ensure-postcss-config.js
[00:40:08.403] Verifying PostCSS configuration...
[00:40:08.435] ✅ PostCSS configuration is already using @tailwindcss/postcss
[00:40:08.436] ⚠️ @tailwindcss/postcss package is not installed. Installing now...
[00:40:11.506]
[00:40:11.507] up to date, audited 978 packages in 3s
[00:40:11.507]
[00:40:11.507] 214 packages are looking for funding
[00:40:11.507] run `npm fund` for details
[00:40:11.525]
[00:40:11.526] 8 vulnerabilities (1 moderate, 7 high)
[00:40:11.526]
[00:40:11.526] To address issues that do not require attention, run:
[00:40:11.527] npm audit fix
[00:40:11.527]
[00:40:11.527] To address all issues possible (including breaking changes), run:
[00:40:11.527] npm audit fix --force
[00:40:11.527]
[00:40:11.527] Some issues need review, and may require choosing
[00:40:11.527] a different dependency.
[00:40:11.528]
[00:40:11.528] Run `npm audit` for details.
[00:40:11.538] ✅ @tailwindcss/postcss installed successfully!
[00:40:11.539] ⚠️ autoprefixer package is not installed. Installing now...
[00:40:14.542]
[00:40:14.543] up to date, audited 978 packages in 3s
[00:40:14.543]
[00:40:14.543] 214 packages are looking for funding
[00:40:14.543] run `npm fund` for details
[00:40:14.559]
[00:40:14.560] 8 vulnerabilities (1 moderate, 7 high)
[00:40:14.560]
[00:40:14.560] To address issues that do not require attention, run:
[00:40:14.560] npm audit fix
[00:40:14.560]
[00:40:14.560] To address all issues possible (including breaking changes), run:
[00:40:14.560] npm audit fix --force
[00:40:14.560]
[00:40:14.561] Some issues need review, and may require choosing
[00:40:14.561] a different dependency.
[00:40:14.561]
[00:40:14.561] Run `npm audit` for details.
[00:40:14.571] ✅ autoprefixer installed successfully!
[00:40:14.574] ✅ clsx package is installed
[00:40:14.575] ✅ tailwind-merge package is installed
[00:40:14.576] ✅ globals.css already has required Tailwind directives
[00:40:14.576] ✅ PostCSS configuration verified!
[00:40:14.579] + echo 'Preparing UI components...'
[00:40:14.579] + node scripts/prepare-ui-components.js
[00:40:14.580] Preparing UI components...
[00:40:14.606] Preparing UI components for build...
[00:40:14.606] Updating .npmrc file...
[00:40:14.607] components.json exists, ensuring aliases are correctly set...
[00:40:14.607] UI components preparation complete!
[00:40:14.609] + echo 'Verifying UI components...'
[00:40:14.610] + node scripts/verify-ui-components.js
[00:40:14.610] Verifying UI components...
[00:40:14.638] Verifying UI components...
[00:40:14.638] UI component exists: breadcrumb.tsx
[00:40:14.638] UI component exists: button.tsx
[00:40:14.638] UI component exists: card.tsx
[00:40:14.639] UI component exists: tabs.tsx
[00:40:14.639] utils.ts exists
[00:40:14.639] UI components verification complete!
[00:40:14.641] + echo 'Copying UI components...'
[00:40:14.642] + node scripts/copy-ui-components-to-build.js
[00:40:14.642] Copying UI components...
[00:40:14.670] Copying UI components to build directory...
[00:40:14.674] Checking component: breadcrumb.tsx
[00:40:14.675] Component breadcrumb.tsx already exists and has cn utility
[00:40:14.675] Checking component: button.tsx
[00:40:14.675] Component button.tsx already exists and has cn utility
[00:40:14.675] Checking component: card.tsx
[00:40:14.676] Component card.tsx already exists and has cn utility
[00:40:14.676] Checking component: tabs.tsx
[00:40:14.676] Component tabs.tsx already exists and has cn utility
[00:40:14.676] Installing required dependencies...
[00:40:14.676] Required dependencies already installed
[00:40:14.677] Generating index.ts for component exports...
[00:40:14.677] Component index file generated
[00:40:14.677] UI components copying completed!
[00:40:14.679] + echo 'Debugging Babel configuration...'
[00:40:14.679] + node scripts/debug-babel.js
[00:40:14.679] Debugging Babel configuration...
[00:40:14.708] === Debugging Babel Configuration ===
[00:40:14.709] ❌ @babel/plugin-syntax-import-attributes is NOT installed
[00:40:14.709] Installing now...
[00:40:16.602] npm warn ERESOLVE overriding peer dependency
[00:40:16.602] npm warn While resolving: @typescript-eslint/eslint-plugin@8.24.0
[00:40:16.603] npm warn Found: typescript@5.8.2
[00:40:16.603] npm warn node_modules/typescript
[00:40:16.603] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[00:40:16.603] npm warn node_modules/@prisma/client
[00:40:16.603] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[00:40:16.603] npm warn node_modules/@auth/prisma-adapter
[00:40:16.604] npm warn 1 more (the root project)
[00:40:16.604] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[00:40:16.604] npm warn
[00:40:16.604] npm warn Could not resolve dependency:
[00:40:16.604] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[00:40:16.604] npm warn node_modules/@typescript-eslint/eslint-plugin
[00:40:16.605] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[00:40:16.605] npm warn node_modules/eslint-config-next
[00:40:16.605] npm warn
[00:40:16.605] npm warn Conflicting peer dependency: typescript@5.7.3
[00:40:16.605] npm warn node_modules/typescript
[00:40:16.605] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[00:40:16.605] npm warn node_modules/@typescript-eslint/eslint-plugin
[00:40:16.606] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[00:40:16.606] npm warn node_modules/eslint-config-next
[00:40:16.615] npm warn ERESOLVE overriding peer dependency
[00:40:16.616] npm warn While resolving: @typescript-eslint/parser@8.24.0
[00:40:16.616] npm warn Found: typescript@5.8.2
[00:40:16.616] npm warn node_modules/typescript
[00:40:16.617] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[00:40:16.617] npm warn node_modules/@prisma/client
[00:40:16.617] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[00:40:16.617] npm warn node_modules/@auth/prisma-adapter
[00:40:16.617] npm warn 1 more (the root project)
[00:40:16.617] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[00:40:16.618] npm warn
[00:40:16.618] npm warn Could not resolve dependency:
[00:40:16.618] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[00:40:16.618] npm warn node_modules/@typescript-eslint/parser
[00:40:16.619] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[00:40:16.619] npm warn node_modules/@typescript-eslint/eslint-plugin
[00:40:16.619] npm warn 1 more (eslint-config-next)
[00:40:16.619] npm warn
[00:40:16.619] npm warn Conflicting peer dependency: typescript@5.7.3
[00:40:16.619] npm warn node_modules/typescript
[00:40:16.619] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[00:40:16.619] npm warn node_modules/@typescript-eslint/parser
[00:40:16.619] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[00:40:16.619] npm warn node_modules/@typescript-eslint/eslint-plugin
[00:40:16.619] npm warn 1 more (eslint-config-next)
[00:40:16.629] npm warn ERESOLVE overriding peer dependency
[00:40:16.630] npm warn While resolving: @typescript-eslint/type-utils@8.24.0
[00:40:16.630] npm warn Found: typescript@5.8.2
[00:40:16.630] npm warn node_modules/typescript
[00:40:16.630] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[00:40:16.630] npm warn node_modules/@prisma/client
[00:40:16.630] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[00:40:16.630] npm warn node_modules/@auth/prisma-adapter
[00:40:16.631] npm warn 1 more (the root project)
[00:40:16.631] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[00:40:16.631] npm warn
[00:40:16.631] npm warn Could not resolve dependency:
[00:40:16.631] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[00:40:16.631] npm warn node_modules/@typescript-eslint/type-utils
[00:40:16.631] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[00:40:16.631] npm warn node_modules/@typescript-eslint/eslint-plugin
[00:40:16.631] npm warn
[00:40:16.631] npm warn Conflicting peer dependency: typescript@5.7.3
[00:40:16.631] npm warn node_modules/typescript
[00:40:16.631] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[00:40:16.632] npm warn node_modules/@typescript-eslint/type-utils
[00:40:16.632] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[00:40:16.632] npm warn node_modules/@typescript-eslint/eslint-plugin
[00:40:16.639] npm warn ERESOLVE overriding peer dependency
[00:40:16.640] npm warn While resolving: @typescript-eslint/typescript-estree@8.24.0
[00:40:16.640] npm warn Found: typescript@5.8.2
[00:40:16.640] npm warn node_modules/typescript
[00:40:16.640] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[00:40:16.640] npm warn node_modules/@prisma/client
[00:40:16.641] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[00:40:16.641] npm warn node_modules/@auth/prisma-adapter
[00:40:16.641] npm warn 1 more (the root project)
[00:40:16.641] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[00:40:16.641] npm warn
[00:40:16.641] npm warn Could not resolve dependency:
[00:40:16.641] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[00:40:16.641] npm warn node_modules/@typescript-eslint/typescript-estree
[00:40:16.641] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[00:40:16.641] npm warn node_modules/@typescript-eslint/parser
[00:40:16.641] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[00:40:16.641] npm warn
[00:40:16.641] npm warn Conflicting peer dependency: typescript@5.7.3
[00:40:16.642] npm warn node_modules/typescript
[00:40:16.642] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[00:40:16.642] npm warn node_modules/@typescript-eslint/typescript-estree
[00:40:16.642] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[00:40:16.642] npm warn node_modules/@typescript-eslint/parser
[00:40:16.642] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[00:40:16.648] npm warn ERESOLVE overriding peer dependency
[00:40:16.649] npm warn While resolving: @typescript-eslint/utils@8.24.0
[00:40:16.649] npm warn Found: typescript@5.8.2
[00:40:16.649] npm warn node_modules/typescript
[00:40:16.649] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[00:40:16.649] npm warn node_modules/@prisma/client
[00:40:16.649] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[00:40:16.649] npm warn node_modules/@auth/prisma-adapter
[00:40:16.649] npm warn 1 more (the root project)
[00:40:16.650] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[00:40:16.650] npm warn
[00:40:16.650] npm warn Could not resolve dependency:
[00:40:16.650] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[00:40:16.650] npm warn node_modules/@typescript-eslint/utils
[00:40:16.650] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[00:40:16.650] npm warn node_modules/@typescript-eslint/eslint-plugin
[00:40:16.650] npm warn 1 more (@typescript-eslint/type-utils)
[00:40:16.650] npm warn
[00:40:16.650] npm warn Conflicting peer dependency: typescript@5.7.3
[00:40:16.650] npm warn node_modules/typescript
[00:40:16.650] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[00:40:16.651] npm warn node_modules/@typescript-eslint/utils
[00:40:16.651] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[00:40:16.651] npm warn node_modules/@typescript-eslint/eslint-plugin
[00:40:16.651] npm warn 1 more (@typescript-eslint/type-utils)
[00:40:17.314] npm error code ERESOLVE
[00:40:17.317] npm error ERESOLVE could not resolve
[00:40:17.317] npm error
[00:40:17.317] npm error While resolving: react-pdf@7.5.1
[00:40:17.317] npm error Found: @types/react@19.0.10
[00:40:17.317] npm error node_modules/@types/react
[00:40:17.317] npm error peer @types/react@">=16" from @mdx-js/react@3.1.0
[00:40:17.318] npm error node_modules/@mdx-js/react
[00:40:17.318] npm error @mdx-js/react@"^3.0.1" from next-mdx-remote@5.0.0
[00:40:17.318] npm error node_modules/next-mdx-remote
[00:40:17.318] npm error next-mdx-remote@"^5.0.0" from the root project
[00:40:17.318] npm error peerOptional @types/react@"\*" from @radix-ui/react-accordion@1.2.3
[00:40:17.318] npm error node_modules/@radix-ui/react-accordion
[00:40:17.318] npm error @radix-ui/react-accordion@"^1.2.3" from the root project
[00:40:17.318] npm error 74 more (@radix-ui/react-alert-dialog, @radix-ui/react-arrow, ...)
[00:40:17.318] npm error
[00:40:17.318] npm error Could not resolve dependency:
[00:40:17.318] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[00:40:17.318] npm error node_modules/react-pdf
[00:40:17.318] npm error react-pdf@"^7.5.1" from the root project
[00:40:17.318] npm error
[00:40:17.318] npm error Conflicting peer dependency: @types/react@18.3.18
[00:40:17.318] npm error node_modules/@types/react
[00:40:17.318] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[00:40:17.319] npm error node_modules/react-pdf
[00:40:17.319] npm error react-pdf@"^7.5.1" from the root project
[00:40:17.319] npm error
[00:40:17.319] npm error Fix the upstream dependency conflict, or retry
[00:40:17.319] npm error this command with --force or --legacy-peer-deps
[00:40:17.319] npm error to accept an incorrect (and potentially broken) dependency resolution.
[00:40:17.319] npm error
[00:40:17.319] npm error
[00:40:17.319] npm error For a full report see:
[00:40:17.319] npm error /vercel/.npm/\_logs/2025-03-18T04_40_14_766Z-eresolve-report.txt
[00:40:17.319] npm error A complete log of this run can be found in: /vercel/.npm/\_logs/2025-03-18T04_40_14_766Z-debug-0.log
[00:40:17.332] ❌ Failed to install @babel/plugin-syntax-import-attributes: Command failed: npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[00:40:17.332] ✅ .babelrc exists
[00:40:17.332] Contents of .babelrc:
[00:40:17.332] {
[00:40:17.333] "presets": [["next/babel"]],
[00:40:17.333] "plugins": ["@babel/plugin-syntax-import-attributes"],
[00:40:17.333] "generatorOpts": {
[00:40:17.333] "maxSize": 2000000
[00:40:17.333] }
[00:40:17.333] }
[00:40:17.333]
[00:40:17.333] ✅ @babel/plugin-syntax-import-attributes is included in .babelrc
[00:40:17.333] ✅ babel.config.js exists
[00:40:17.333] Contents of babel.config.js:
[00:40:17.334] module.exports = {
[00:40:17.334] presets: [["next/babel"]],
[00:40:17.334] plugins: ["@babel/plugin-syntax-import-attributes"],
[00:40:17.334] // Increase the size limit for files that Babel will optimize
[00:40:17.334] generatorOpts: {
[00:40:17.334] maxSize: 2000000, // 2MB
[00:40:17.334] },
[00:40:17.334] };
[00:40:17.334]
[00:40:17.334] ✅ @babel/plugin-syntax-import-attributes is included in babel.config.js
[00:40:17.334] === Babel Configuration Debugging Complete ===
[00:40:17.337] + echo 'Temporarily moving Babel configuration files...'
[00:40:17.337] Temporarily moving Babel configuration files...
[00:40:17.337] + '[' -f .babelrc ']'
[00:40:17.338] + mv .babelrc .babelrc.backup
[00:40:17.340] + '[' -f babel.config.js ']'
[00:40:17.340] + mv babel.config.js babel.config.js.backup
[00:40:17.341] + echo 'Cleaning .next directory...'
[00:40:17.341] + rm -rf .next
[00:40:17.341] Cleaning .next directory...
[00:40:17.377] + echo 'Generating Prisma client...'
[00:40:17.378] + npx prisma generate
[00:40:17.378] Generating Prisma client...
[00:40:18.650] npm warn exec The following package was not found and will be installed: prisma@6.5.0
[00:40:29.863] Prisma schema loaded from prisma/schema.prisma
[00:40:31.032]
[00:40:31.033] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 549ms
[00:40:31.033]
[00:40:31.033] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[00:40:31.033]
[00:40:31.033] Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: https://pris.ly/--optimize
[00:40:31.034]
[00:40:31.242] + echo 'Handling database setup...'
[00:40:31.242] + node scripts/handle-db-build.js
[00:40:31.242] Handling database setup...
[00:40:31.274] Build environment detected, creating mock Prisma client...
[00:40:31.275] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[00:40:31.275] Database handling for build complete
[00:40:31.277] + echo 'Building Next.js app with default compiler...'
[00:40:31.278] + npx next build
[00:40:31.278] Building Next.js app with default compiler...
[00:40:32.275] ▲ Next.js 15.2.3
[00:40:32.276]
[00:40:32.301] Creating an optimized production build ...
[00:41:07.773] Failed to compile.
[00:41:07.773]
[00:41:07.773] ./src/app/admin/communications/page.tsx
[00:41:07.774] Module not found: Can't resolve '@/components/admin/AdminLayout'
[00:41:07.774]
[00:41:07.774] https://nextjs.org/docs/messages/module-not-found
[00:41:07.774]
[00:41:07.774] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[00:41:07.774] Module not found: Can't resolve '@/components/contact-submissions/ContactSubmissionsList'
[00:41:07.774]
[00:41:07.775] https://nextjs.org/docs/messages/module-not-found
[00:41:07.775]
[00:41:07.775] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[00:41:07.775] Module not found: Can't resolve '@/components/admin/AdminLayout'
[00:41:07.775]
[00:41:07.775] https://nextjs.org/docs/messages/module-not-found
[00:41:07.775]
[00:41:07.776] ./src/app/admin/email-logs/page.tsx
[00:41:07.778] Module not found: Can't resolve '@/components/admin/AdminLayout'
[00:41:07.778]
[00:41:07.778] https://nextjs.org/docs/messages/module-not-found
[00:41:07.778]
[00:41:07.778] ./src/app/admin/feedback/page.tsx
[00:41:07.778] Module not found: Can't resolve '@/components/admin/AdminLayout'
[00:41:07.778]
[00:41:07.779] https://nextjs.org/docs/messages/module-not-found
[00:41:07.779]
[00:41:07.779]
[00:41:07.779] > Build failed because of webpack errors
[00:41:07.857] Error: Command "npm install clsx tailwind-merge @tailwindcss/postcss && rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh" exited with 1
[00:41:08.703]
