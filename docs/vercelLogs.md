# Vercel Build Logs

[03:43:16.695] Running build in Washington, D.C., USA (East) – iad1
[03:43:16.819] Cloning github.com/pgtipping/Synthalyst (Branch: simplified-deployment, Commit: e603068)
[03:43:17.594] Cloning completed: 774.000ms
[03:43:29.186] Restored build cache from previous deployment (3u2PKdQgVLvCsnaSrxYngYBigJXi)
[03:43:29.867] Running "vercel build"
[03:43:30.960] Vercel CLI 41.3.2
[03:43:32.189] Running "install" command: `npm install`...
[03:43:35.689] npm warn deprecated @types/lru-cache@7.10.10: This is a stub types definition. lru-cache provides its own type definitions, so you do not need this installed.
[03:43:36.960] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[03:43:36.960] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[03:43:37.208] npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at <https://github.com/danielroe/beasties>
[03:43:53.074]
[03:43:53.075] > nextjs-app@0.1.0 postinstall
[03:43:53.075] > prisma generate
[03:43:53.075]
[03:43:53.642] Prisma schema loaded from prisma/schema.prisma
[03:43:54.812]
[03:43:54.816] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 543ms
[03:43:54.816]
[03:43:54.816] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[03:43:54.816]
[03:43:54.816] Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: <https://pris.ly/--optimize>
[03:43:54.816]
[03:43:55.017]
[03:43:55.018] added 148 packages, removed 31 packages, changed 47 packages, and audited 1905 packages in 23s
[03:43:55.018]
[03:43:55.019] 396 packages are looking for funding
[03:43:55.019] run `npm fund` for details
[03:43:55.039]
[03:43:55.039] 8 vulnerabilities (1 moderate, 7 high)
[03:43:55.039]
[03:43:55.039] To address issues that do not require attention, run:
[03:43:55.039] npm audit fix
[03:43:55.040]
[03:43:55.040] To address all issues possible (including breaking changes), run:
[03:43:55.040] npm audit fix --force
[03:43:55.040]
[03:43:55.041] Some issues need review, and may require choosing
[03:43:55.042] a different dependency.
[03:43:55.042]
[03:43:55.042] Run `npm audit` for details.
[03:43:55.085] Detected Next.js version: 15.2.3
[03:43:55.086] Running "npm install clsx tailwind-merge @tailwindcss/postcss && rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh"
[03:43:59.268]
[03:43:59.268] up to date, audited 978 packages in 4s
[03:43:59.269]
[03:43:59.269] 214 packages are looking for funding
[03:43:59.269] run `npm fund` for details
[03:43:59.286]
[03:43:59.286] 8 vulnerabilities (1 moderate, 7 high)
[03:43:59.287]
[03:43:59.287] To address issues that do not require attention, run:
[03:43:59.287] npm audit fix
[03:43:59.287]
[03:43:59.287] To address all issues possible (including breaking changes), run:
[03:43:59.288] npm audit fix --force
[03:43:59.288]
[03:43:59.288] Some issues need review, and may require choosing
[03:43:59.288] a different dependency.
[03:43:59.288]
[03:43:59.288] Run `npm audit` for details.
[03:43:59.303] + echo 'Installing required packages...'
[03:43:59.303] + npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[03:43:59.303] Installing required packages...
[03:44:02.358]
[03:44:02.359] up to date, audited 978 packages in 3s
[03:44:02.359]
[03:44:02.359] 214 packages are looking for funding
[03:44:02.360] run `npm fund` for details
[03:44:02.377]
[03:44:02.378] 8 vulnerabilities (1 moderate, 7 high)
[03:44:02.378]
[03:44:02.379] To address issues that do not require attention, run:
[03:44:02.379] npm audit fix
[03:44:02.379]
[03:44:02.379] To address all issues possible (including breaking changes), run:
[03:44:02.379] npm audit fix --force
[03:44:02.380]
[03:44:02.380] Some issues need review, and may require choosing
[03:44:02.380] a different dependency.
[03:44:02.380]
[03:44:02.380] Run `npm audit` for details.
[03:44:02.390] + npm install --save @tailwindcss/postcss@4.0.14 clsx@2.1.1 tailwind-merge@3.0.2
[03:44:05.415]
[03:44:05.415] up to date, audited 978 packages in 3s
[03:44:05.416]
[03:44:05.416] 214 packages are looking for funding
[03:44:05.416] run `npm fund` for details
[03:44:05.435]
[03:44:05.435] 8 vulnerabilities (1 moderate, 7 high)
[03:44:05.435]
[03:44:05.436] To address issues that do not require attention, run:
[03:44:05.436] npm audit fix
[03:44:05.436]
[03:44:05.436] To address all issues possible (including breaking changes), run:
[03:44:05.436] npm audit fix --force
[03:44:05.436]
[03:44:05.437] Some issues need review, and may require choosing
[03:44:05.437] a different dependency.
[03:44:05.437]
[03:44:05.437] Run `npm audit` for details.
[03:44:05.451] + npm install --save @radix-ui/react-slot@1.1.2 @radix-ui/react-tabs@1.1.3
[03:44:08.596]
[03:44:08.597] up to date, audited 978 packages in 3s
[03:44:08.597]
[03:44:08.597] 214 packages are looking for funding
[03:44:08.597] run `npm fund` for details
[03:44:08.613]
[03:44:08.614] 8 vulnerabilities (1 moderate, 7 high)
[03:44:08.614]
[03:44:08.614] To address issues that do not require attention, run:
[03:44:08.614] npm audit fix
[03:44:08.615]
[03:44:08.615] To address all issues possible (including breaking changes), run:
[03:44:08.615] npm audit fix --force
[03:44:08.615]
[03:44:08.615] Some issues need review, and may require choosing
[03:44:08.615] a different dependency.
[03:44:08.616]
[03:44:08.616] Run `npm audit` for details.
[03:44:08.632] + echo 'Verifying essential dependencies...'
[03:44:08.633] + npm list clsx
[03:44:08.633] Verifying essential dependencies...
[03:44:10.151] + npm list tailwind-merge
[03:44:11.147] + npm list @radix-ui/react-tabs
[03:44:12.057] + npm list @tailwindcss/postcss
[03:44:12.952] + echo '@tailwindcss/postcss not found, installing...'
[03:44:12.953] + npm install --save @tailwindcss/postcss@4.0.14
[03:44:12.953] @tailwindcss/postcss not found, installing...
[03:44:16.056]
[03:44:16.056] up to date, audited 978 packages in 3s
[03:44:16.057]
[03:44:16.057] 214 packages are looking for funding
[03:44:16.057] run `npm fund` for details
[03:44:16.074]
[03:44:16.074] 8 vulnerabilities (1 moderate, 7 high)
[03:44:16.074]
[03:44:16.074] To address issues that do not require attention, run:
[03:44:16.074] npm audit fix
[03:44:16.075]
[03:44:16.075] To address all issues possible (including breaking changes), run:
[03:44:16.075] npm audit fix --force
[03:44:16.075]
[03:44:16.075] Some issues need review, and may require choosing
[03:44:16.075] a different dependency.
[03:44:16.075]
[03:44:16.075] Run `npm audit` for details.
[03:44:16.095] + echo 'Verifying PostCSS configuration...'
[03:44:16.095] + node scripts/ensure-postcss-config.js
[03:44:16.096] Verifying PostCSS configuration...
[03:44:16.126] ✅ PostCSS configuration is already using @tailwindcss/postcss
[03:44:16.127] ⚠️ @tailwindcss/postcss package is not installed. Installing now...
[03:44:19.418]
[03:44:19.418] up to date, audited 978 packages in 3s
[03:44:19.418]
[03:44:19.418] 214 packages are looking for funding
[03:44:19.418] run `npm fund` for details
[03:44:19.433]
[03:44:19.434] 8 vulnerabilities (1 moderate, 7 high)
[03:44:19.434]
[03:44:19.434] To address issues that do not require attention, run:
[03:44:19.434] npm audit fix
[03:44:19.434]
[03:44:19.435] To address all issues possible (including breaking changes), run:
[03:44:19.435] npm audit fix --force
[03:44:19.435]
[03:44:19.435] Some issues need review, and may require choosing
[03:44:19.435] a different dependency.
[03:44:19.435]
[03:44:19.436] Run `npm audit` for details.
[03:44:19.450] ✅ @tailwindcss/postcss installed successfully!
[03:44:19.451] ⚠️ autoprefixer package is not installed. Installing now...
[03:44:22.559]
[03:44:22.560] up to date, audited 978 packages in 3s
[03:44:22.560]
[03:44:22.560] 214 packages are looking for funding
[03:44:22.560] run `npm fund` for details
[03:44:22.582]
[03:44:22.583] 8 vulnerabilities (1 moderate, 7 high)
[03:44:22.583]
[03:44:22.583] To address issues that do not require attention, run:
[03:44:22.583] npm audit fix
[03:44:22.583]
[03:44:22.584] To address all issues possible (including breaking changes), run:
[03:44:22.584] npm audit fix --force
[03:44:22.584]
[03:44:22.584] Some issues need review, and may require choosing
[03:44:22.584] a different dependency.
[03:44:22.584]
[03:44:22.585] Run `npm audit` for details.
[03:44:22.596] ✅ autoprefixer installed successfully!
[03:44:22.600] ✅ clsx package is installed
[03:44:22.601] ✅ tailwind-merge package is installed
[03:44:22.601] ✅ globals.css already has required Tailwind directives
[03:44:22.601] ✅ PostCSS configuration verified!
[03:44:22.605] + echo 'Preparing UI components...'
[03:44:22.605] + node scripts/prepare-ui-components.js
[03:44:22.605] Preparing UI components...
[03:44:22.633] Preparing UI components for build...
[03:44:22.633] Updating .npmrc file...
[03:44:22.634] components.json exists, ensuring aliases are correctly set...
[03:44:22.634] UI components preparation complete!
[03:44:22.641] + echo 'Verifying UI components...'
[03:44:22.642] + node scripts/verify-ui-components.js
[03:44:22.642] Verifying UI components...
[03:44:22.670] Verifying UI components...
[03:44:22.670] UI component exists: breadcrumb.tsx
[03:44:22.671] UI component exists: button.tsx
[03:44:22.671] UI component exists: card.tsx
[03:44:22.671] UI component exists: tabs.tsx
[03:44:22.672] utils.ts exists
[03:44:22.672] UI components verification complete!
[03:44:22.674] + echo 'Copying UI components...'
[03:44:22.674] + node scripts/copy-ui-components-to-build.js
[03:44:22.675] Copying UI components...
[03:44:22.709] Copying UI components to build directory...
[03:44:22.714] Checking component: breadcrumb.tsx
[03:44:22.714] Component breadcrumb.tsx already exists and has cn utility
[03:44:22.714] Checking component: button.tsx
[03:44:22.715] Component button.tsx already exists and has cn utility
[03:44:22.715] Checking component: card.tsx
[03:44:22.716] Component card.tsx already exists and has cn utility
[03:44:22.716] Checking component: tabs.tsx
[03:44:22.716] Component tabs.tsx already exists and has cn utility
[03:44:22.716] Installing required dependencies...
[03:44:22.717] Required dependencies already installed
[03:44:22.717] Generating index.ts for component exports...
[03:44:22.717] Component index file generated
[03:44:22.717] UI components copying completed!
[03:44:22.726] + echo 'Debugging Babel configuration...'
[03:44:22.726] + node scripts/debug-babel.js
[03:44:22.726] Debugging Babel configuration...
[03:44:22.756] === Debugging Babel Configuration ===
[03:44:22.757] ❌ @babel/plugin-syntax-import-attributes is NOT installed
[03:44:22.757] Installing now...
[03:44:24.677] npm warn ERESOLVE overriding peer dependency
[03:44:24.678] npm warn While resolving: @typescript-eslint/eslint-plugin@8.24.0
[03:44:24.678] npm warn Found: typescript@5.8.2
[03:44:24.678] npm warn node_modules/typescript
[03:44:24.678] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:44:24.678] npm warn node_modules/@prisma/client
[03:44:24.678] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:44:24.679] npm warn node_modules/@auth/prisma-adapter
[03:44:24.679] npm warn 1 more (the root project)
[03:44:24.679] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:44:24.680] npm warn
[03:44:24.680] npm warn Could not resolve dependency:
[03:44:24.680] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:44:24.680] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:44:24.680] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[03:44:24.680] npm warn node_modules/eslint-config-next
[03:44:24.680] npm warn
[03:44:24.680] npm warn Conflicting peer dependency: typescript@5.7.3
[03:44:24.680] npm warn node_modules/typescript
[03:44:24.680] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:44:24.680] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:44:24.680] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[03:44:24.680] npm warn node_modules/eslint-config-next
[03:44:24.689] npm warn ERESOLVE overriding peer dependency
[03:44:24.690] npm warn While resolving: @typescript-eslint/parser@8.24.0
[03:44:24.690] npm warn Found: typescript@5.8.2
[03:44:24.691] npm warn node_modules/typescript
[03:44:24.691] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:44:24.691] npm warn node_modules/@prisma/client
[03:44:24.691] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:44:24.691] npm warn node_modules/@auth/prisma-adapter
[03:44:24.692] npm warn 1 more (the root project)
[03:44:24.692] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:44:24.692] npm warn
[03:44:24.692] npm warn Could not resolve dependency:
[03:44:24.692] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[03:44:24.692] npm warn node_modules/@typescript-eslint/parser
[03:44:24.693] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:44:24.693] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:44:24.693] npm warn 1 more (eslint-config-next)
[03:44:24.693] npm warn
[03:44:24.693] npm warn Conflicting peer dependency: typescript@5.7.3
[03:44:24.693] npm warn node_modules/typescript
[03:44:24.694] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[03:44:24.694] npm warn node_modules/@typescript-eslint/parser
[03:44:24.694] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:44:24.694] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:44:24.694] npm warn 1 more (eslint-config-next)
[03:44:24.701] npm warn ERESOLVE overriding peer dependency
[03:44:24.702] npm warn While resolving: @typescript-eslint/type-utils@8.24.0
[03:44:24.702] npm warn Found: typescript@5.8.2
[03:44:24.702] npm warn node_modules/typescript
[03:44:24.703] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:44:24.703] npm warn node_modules/@prisma/client
[03:44:24.703] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:44:24.703] npm warn node_modules/@auth/prisma-adapter
[03:44:24.703] npm warn 1 more (the root project)
[03:44:24.703] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:44:24.703] npm warn
[03:44:24.704] npm warn Could not resolve dependency:
[03:44:24.704] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[03:44:24.704] npm warn node_modules/@typescript-eslint/type-utils
[03:44:24.704] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:44:24.704] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:44:24.705] npm warn
[03:44:24.705] npm warn Conflicting peer dependency: typescript@5.7.3
[03:44:24.705] npm warn node_modules/typescript
[03:44:24.705] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[03:44:24.705] npm warn node_modules/@typescript-eslint/type-utils
[03:44:24.705] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:44:24.706] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:44:24.722] npm warn ERESOLVE overriding peer dependency
[03:44:24.722] npm warn While resolving: @typescript-eslint/typescript-estree@8.24.0
[03:44:24.723] npm warn Found: typescript@5.8.2
[03:44:24.723] npm warn node_modules/typescript
[03:44:24.723] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:44:24.723] npm warn node_modules/@prisma/client
[03:44:24.723] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:44:24.723] npm warn node_modules/@auth/prisma-adapter
[03:44:24.724] npm warn 1 more (the root project)
[03:44:24.724] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:44:24.724] npm warn
[03:44:24.724] npm warn Could not resolve dependency:
[03:44:24.724] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[03:44:24.725] npm warn node_modules/@typescript-eslint/typescript-estree
[03:44:24.725] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[03:44:24.725] npm warn node_modules/@typescript-eslint/parser
[03:44:24.725] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[03:44:24.725] npm warn
[03:44:24.725] npm warn Conflicting peer dependency: typescript@5.7.3
[03:44:24.726] npm warn node_modules/typescript
[03:44:24.726] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[03:44:24.726] npm warn node_modules/@typescript-eslint/typescript-estree
[03:44:24.726] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[03:44:24.726] npm warn node_modules/@typescript-eslint/parser
[03:44:24.727] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[03:44:24.733] npm warn ERESOLVE overriding peer dependency
[03:44:24.733] npm warn While resolving: @typescript-eslint/utils@8.24.0
[03:44:24.734] npm warn Found: typescript@5.8.2
[03:44:24.734] npm warn node_modules/typescript
[03:44:24.734] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:44:24.734] npm warn node_modules/@prisma/client
[03:44:24.734] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:44:24.735] npm warn node_modules/@auth/prisma-adapter
[03:44:24.735] npm warn 1 more (the root project)
[03:44:24.735] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:44:24.735] npm warn
[03:44:24.735] npm warn Could not resolve dependency:
[03:44:24.735] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[03:44:24.736] npm warn node_modules/@typescript-eslint/utils
[03:44:24.736] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:44:24.736] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:44:24.736] npm warn 1 more (@typescript-eslint/type-utils)
[03:44:24.736] npm warn
[03:44:24.736] npm warn Conflicting peer dependency: typescript@5.7.3
[03:44:24.737] npm warn node_modules/typescript
[03:44:24.737] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[03:44:24.737] npm warn node_modules/@typescript-eslint/utils
[03:44:24.737] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:44:24.737] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:44:24.737] npm warn 1 more (@typescript-eslint/type-utils)
[03:44:25.295] npm error code ERESOLVE
[03:44:25.295] npm error ERESOLVE could not resolve
[03:44:25.296] npm error
[03:44:25.296] npm error While resolving: react-pdf@7.5.1
[03:44:25.296] npm error Found: @types/react@19.0.10
[03:44:25.296] npm error node_modules/@types/react
[03:44:25.297] npm error peer @types/react@">=16" from @mdx-js/react@3.1.0
[03:44:25.297] npm error node_modules/@mdx-js/react
[03:44:25.297] npm error @mdx-js/react@"^3.0.1" from next-mdx-remote@5.0.0
[03:44:25.297] npm error node_modules/next-mdx-remote
[03:44:25.297] npm error next-mdx-remote@"^5.0.0" from the root project
[03:44:25.297] npm error peerOptional @types/react@"\*" from @radix-ui/react-accordion@1.2.3
[03:44:25.298] npm error node_modules/@radix-ui/react-accordion
[03:44:25.298] npm error @radix-ui/react-accordion@"^1.2.3" from the root project
[03:44:25.298] npm error 74 more (@radix-ui/react-alert-dialog, @radix-ui/react-arrow, ...)
[03:44:25.298] npm error
[03:44:25.298] npm error Could not resolve dependency:
[03:44:25.298] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[03:44:25.298] npm error node_modules/react-pdf
[03:44:25.298] npm error react-pdf@"^7.5.1" from the root project
[03:44:25.298] npm error
[03:44:25.298] npm error Conflicting peer dependency: @types/react@18.3.18
[03:44:25.298] npm error node_modules/@types/react
[03:44:25.299] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[03:44:25.299] npm error node_modules/react-pdf
[03:44:25.299] npm error react-pdf@"^7.5.1" from the root project
[03:44:25.299] npm error
[03:44:25.299] npm error Fix the upstream dependency conflict, or retry
[03:44:25.299] npm error this command with --force or --legacy-peer-deps
[03:44:25.299] npm error to accept an incorrect (and potentially broken) dependency resolution.
[03:44:25.299] npm error
[03:44:25.299] npm error
[03:44:25.299] npm error For a full report see:
[03:44:25.299] npm error /vercel/.npm/\_logs/2025-03-18T07_44_22_819Z-eresolve-report.txt
[03:44:25.300] npm error A complete log of this run can be found in: /vercel/.npm/\_logs/2025-03-18T07_44_22_819Z-debug-0.log
[03:44:25.316] ❌ Failed to install @babel/plugin-syntax-import-attributes: Command failed: npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[03:44:25.316] ✅ .babelrc exists
[03:44:25.317] Contents of .babelrc:
[03:44:25.317] {
[03:44:25.317] "presets": [["next/babel"]],
[03:44:25.317] "plugins": ["@babel/plugin-syntax-import-attributes"],
[03:44:25.317] "generatorOpts": {
[03:44:25.317] "maxSize": 2000000
[03:44:25.317] }
[03:44:25.317] }
[03:44:25.317]
[03:44:25.317] ✅ @babel/plugin-syntax-import-attributes is included in .babelrc
[03:44:25.318] ✅ babel.config.js exists
[03:44:25.318] Contents of babel.config.js:
[03:44:25.318] module.exports = {
[03:44:25.318] presets: [["next/babel"]],
[03:44:25.318] plugins: ["@babel/plugin-syntax-import-attributes"],
[03:44:25.318] // Increase the size limit for files that Babel will optimize
[03:44:25.319] generatorOpts: {
[03:44:25.319] maxSize: 2000000, // 2MB
[03:44:25.319] },
[03:44:25.319] };
[03:44:25.319]
[03:44:25.319] ✅ @babel/plugin-syntax-import-attributes is included in babel.config.js
[03:44:25.319] === Babel Configuration Debugging Complete ===
[03:44:25.322] + echo 'Temporarily moving Babel configuration files...'
[03:44:25.322] + '[' -f .babelrc ']'
[03:44:25.322] Temporarily moving Babel configuration files...
[03:44:25.323] + mv .babelrc .babelrc.backup
[03:44:25.324] + '[' -f babel.config.js ']'
[03:44:25.325] + mv babel.config.js babel.config.js.backup
[03:44:25.326] + echo 'Cleaning .next directory...'
[03:44:25.326] + rm -rf .next
[03:44:25.326] Cleaning .next directory...
[03:44:25.363] + echo 'Generating Prisma client...'
[03:44:25.364] + npx prisma generate
[03:44:25.364] Generating Prisma client...
[03:44:26.728] npm warn exec The following package was not found and will be installed: prisma@6.5.0
[03:44:33.544] Prisma schema loaded from prisma/schema.prisma
[03:44:34.757]
[03:44:34.757] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 564ms
[03:44:34.758]
[03:44:34.758] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[03:44:34.758]
[03:44:34.759] Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: <https://pris.ly/orm/survey/release-5-22>
[03:44:34.759]
[03:44:34.965] + echo 'Handling database setup...'
[03:44:34.965] + node scripts/handle-db-build.js
[03:44:34.965] Handling database setup...
[03:44:34.993] Build environment detected, creating mock Prisma client...
[03:44:34.994] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[03:44:34.994] Database handling for build complete
[03:44:35.001] + echo 'Building Next.js app with default compiler...'
[03:44:35.001] + npx next build
[03:44:35.001] Building Next.js app with default compiler...
[03:44:35.935] ▲ Next.js 15.2.3
[03:44:35.936] - Environments: .env.production
[03:44:35.937]
[03:44:35.963] Creating an optimized production build ...
[03:45:12.217] Failed to compile.
[03:45:12.218]
[03:45:12.218] ./src/app/admin/communications/page.tsx
[03:45:12.218] Module not found: Can't resolve '@/components/admin/AdminLayout'
[03:45:12.218]
[03:45:12.218] <https://nextjs.org/docs/messages/module-not-found>
[03:45:12.218]
[03:45:12.218] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[03:45:12.218] Module not found: Can't resolve '@/components/contact-submissions/ContactSubmissionsList'
[03:45:12.218]
[03:45:12.219] <https://nextjs.org/docs/messages/module-not-found>
[03:45:12.219]
[03:45:12.219] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[03:45:12.219] Module not found: Can't resolve '@/components/admin/AdminLayout'
[03:45:12.219]
[03:45:12.219] <https://nextjs.org/docs/messages/module-not-found>
[03:45:12.219]
[03:45:12.219] ./src/app/admin/email-logs/page.tsx
[03:45:12.219] Module not found: Can't resolve '@/components/admin/AdminLayout'
[03:45:12.220]
[03:45:12.220] <https://nextjs.org/docs/messages/module-not-found>
[03:45:12.220]
[03:45:12.220] ./src/app/admin/feedback/page.tsx
[03:45:12.220] Module not found: Can't resolve '@/components/admin/AdminLayout'
[03:45:12.220]
[03:45:12.220] <https://nextjs.org/docs/messages/module-not-found>
[03:45:12.220]
[03:45:12.221]
[03:45:12.221] > Build failed because of webpack errors
[03:45:12.299] Error: Command "npm install clsx tailwind-merge @tailwindcss/postcss && rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh" exited with 1
[03:45:12.609]
