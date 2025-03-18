# Vercel Build Logs

[03:30:49.864] Running build in Washington, D.C., USA (East) – iad1
[03:30:49.970] Cloning github.com/pgtipping/Synthalyst (Branch: simplified-deployment, Commit: 1b96781)
[03:30:50.666] Cloning completed: 696.000ms
[03:31:04.215] Restored build cache from previous deployment (3u2PKdQgVLvCsnaSrxYngYBigJXi)
[03:31:04.991] Running "vercel build"
[03:31:05.697] Vercel CLI 41.3.2
[03:31:06.581] Running "install" command: `npm install`...
[03:31:10.149] npm warn deprecated @types/lru-cache@7.10.10: This is a stub types definition. lru-cache provides its own type definitions, so you do not need this installed.
[03:31:11.394] npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
[03:31:11.472] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[03:31:11.525] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[03:31:27.600]
[03:31:27.600] > nextjs-app@0.1.0 postinstall
[03:31:27.601] > prisma generate
[03:31:27.601]
[03:31:28.200] Prisma schema loaded from prisma/schema.prisma
[03:31:29.746]
[03:31:29.746] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 762ms
[03:31:29.746]
[03:31:29.746] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[03:31:29.746]
[03:31:29.746] Tip: Want real-time updates to your database without manual polling? Discover how with Pulse: https://pris.ly/tip-0-pulse
[03:31:29.746]
[03:31:30.059]
[03:31:30.060] added 148 packages, removed 31 packages, changed 47 packages, and audited 1905 packages in 23s
[03:31:30.061]
[03:31:30.061] 396 packages are looking for funding
[03:31:30.061] run `npm fund` for details
[03:31:30.078]
[03:31:30.078] 8 vulnerabilities (1 moderate, 7 high)
[03:31:30.078]
[03:31:30.079] To address issues that do not require attention, run:
[03:31:30.079] npm audit fix
[03:31:30.079]
[03:31:30.079] To address all issues possible (including breaking changes), run:
[03:31:30.080] npm audit fix --force
[03:31:30.084]
[03:31:30.084] Some issues need review, and may require choosing
[03:31:30.085] a different dependency.
[03:31:30.085]
[03:31:30.085] Run `npm audit` for details.
[03:31:30.310] Detected Next.js version: 15.2.3
[03:31:30.313] Running "npm install clsx tailwind-merge @tailwindcss/postcss && rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh"
[03:31:34.880]
[03:31:34.880] up to date, audited 978 packages in 5s
[03:31:34.881]
[03:31:34.881] 214 packages are looking for funding
[03:31:34.881] run `npm fund` for details
[03:31:34.905]
[03:31:34.912] 8 vulnerabilities (1 moderate, 7 high)
[03:31:34.912]
[03:31:34.913] To address issues that do not require attention, run:
[03:31:34.913] npm audit fix
[03:31:34.913]
[03:31:34.913] To address all issues possible (including breaking changes), run:
[03:31:34.913] npm audit fix --force
[03:31:34.913]
[03:31:34.913] Some issues need review, and may require choosing
[03:31:34.913] a different dependency.
[03:31:34.914]
[03:31:34.914] Run `npm audit` for details.
[03:31:34.927] + echo 'Installing required packages...'
[03:31:34.928] + npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[03:31:34.928] Installing required packages...
[03:31:38.144]
[03:31:38.144] up to date, audited 978 packages in 3s
[03:31:38.145]
[03:31:38.145] 214 packages are looking for funding
[03:31:38.146] run `npm fund` for details
[03:31:38.161]
[03:31:38.162] 8 vulnerabilities (1 moderate, 7 high)
[03:31:38.162]
[03:31:38.162] To address issues that do not require attention, run:
[03:31:38.162] npm audit fix
[03:31:38.162]
[03:31:38.162] To address all issues possible (including breaking changes), run:
[03:31:38.162] npm audit fix --force
[03:31:38.163]
[03:31:38.163] Some issues need review, and may require choosing
[03:31:38.163] a different dependency.
[03:31:38.163]
[03:31:38.163] Run `npm audit` for details.
[03:31:38.177] + npm install --save @tailwindcss/postcss@4.0.14 clsx@2.1.1 tailwind-merge@3.0.2
[03:31:41.300]
[03:31:41.301] up to date, audited 978 packages in 3s
[03:31:41.301]
[03:31:41.301] 214 packages are looking for funding
[03:31:41.301] run `npm fund` for details
[03:31:41.320]
[03:31:41.321] 8 vulnerabilities (1 moderate, 7 high)
[03:31:41.321]
[03:31:41.321] To address issues that do not require attention, run:
[03:31:41.321] npm audit fix
[03:31:41.322]
[03:31:41.322] To address all issues possible (including breaking changes), run:
[03:31:41.322] npm audit fix --force
[03:31:41.322]
[03:31:41.322] Some issues need review, and may require choosing
[03:31:41.322] a different dependency.
[03:31:41.322]
[03:31:41.323] Run `npm audit` for details.
[03:31:41.333] + npm install --save @radix-ui/react-slot@1.1.2 @radix-ui/react-tabs@1.1.3
[03:31:44.573]
[03:31:44.573] up to date, audited 978 packages in 3s
[03:31:44.574]
[03:31:44.574] 214 packages are looking for funding
[03:31:44.574] run `npm fund` for details
[03:31:44.594]
[03:31:44.595] 8 vulnerabilities (1 moderate, 7 high)
[03:31:44.595]
[03:31:44.595] To address issues that do not require attention, run:
[03:31:44.596] npm audit fix
[03:31:44.596]
[03:31:44.596] To address all issues possible (including breaking changes), run:
[03:31:44.596] npm audit fix --force
[03:31:44.596]
[03:31:44.596] Some issues need review, and may require choosing
[03:31:44.596] a different dependency.
[03:31:44.597]
[03:31:44.597] Run `npm audit` for details.
[03:31:44.608] + echo 'Verifying essential dependencies...'
[03:31:44.608] + npm list clsx
[03:31:44.608] Verifying essential dependencies...
[03:31:46.650] + npm list tailwind-merge
[03:31:47.568] + npm list @radix-ui/react-tabs
[03:31:48.498] + npm list @tailwindcss/postcss
[03:31:49.395] + echo '@tailwindcss/postcss not found, installing...'
[03:31:49.395] + npm install --save @tailwindcss/postcss@4.0.14
[03:31:49.396] @tailwindcss/postcss not found, installing...
[03:31:52.483]
[03:31:52.484] up to date, audited 978 packages in 3s
[03:31:52.484]
[03:31:52.484] 214 packages are looking for funding
[03:31:52.484] run `npm fund` for details
[03:31:52.503]
[03:31:52.503] 8 vulnerabilities (1 moderate, 7 high)
[03:31:52.503]
[03:31:52.504] To address issues that do not require attention, run:
[03:31:52.504] npm audit fix
[03:31:52.504]
[03:31:52.504] To address all issues possible (including breaking changes), run:
[03:31:52.504] npm audit fix --force
[03:31:52.504]
[03:31:52.505] Some issues need review, and may require choosing
[03:31:52.505] a different dependency.
[03:31:52.505]
[03:31:52.505] Run `npm audit` for details.
[03:31:52.515] + echo 'Verifying PostCSS configuration...'
[03:31:52.515] + node scripts/ensure-postcss-config.js
[03:31:52.516] Verifying PostCSS configuration...
[03:31:52.547] ✅ PostCSS configuration is already using @tailwindcss/postcss
[03:31:52.548] ⚠️ @tailwindcss/postcss package is not installed. Installing now...
[03:31:55.668]
[03:31:55.669] up to date, audited 978 packages in 3s
[03:31:55.669]
[03:31:55.670] 214 packages are looking for funding
[03:31:55.670] run `npm fund` for details
[03:31:55.689]
[03:31:55.690] 8 vulnerabilities (1 moderate, 7 high)
[03:31:55.690]
[03:31:55.691] To address issues that do not require attention, run:
[03:31:55.691] npm audit fix
[03:31:55.691]
[03:31:55.691] To address all issues possible (including breaking changes), run:
[03:31:55.691] npm audit fix --force
[03:31:55.692]
[03:31:55.692] Some issues need review, and may require choosing
[03:31:55.692] a different dependency.
[03:31:55.692]
[03:31:55.692] Run `npm audit` for details.
[03:31:55.702] ✅ @tailwindcss/postcss installed successfully!
[03:31:55.703] ⚠️ autoprefixer package is not installed. Installing now...
[03:31:58.840]
[03:31:58.842] up to date, audited 978 packages in 3s
[03:31:58.843]
[03:31:58.843] 214 packages are looking for funding
[03:31:58.843] run `npm fund` for details
[03:31:58.860]
[03:31:58.861] 8 vulnerabilities (1 moderate, 7 high)
[03:31:58.861]
[03:31:58.861] To address issues that do not require attention, run:
[03:31:58.861] npm audit fix
[03:31:58.861]
[03:31:58.861] To address all issues possible (including breaking changes), run:
[03:31:58.862] npm audit fix --force
[03:31:58.862]
[03:31:58.862] Some issues need review, and may require choosing
[03:31:58.862] a different dependency.
[03:31:58.862]
[03:31:58.862] Run `npm audit` for details.
[03:31:58.875] ✅ autoprefixer installed successfully!
[03:31:58.877] ✅ clsx package is installed
[03:31:58.878] ✅ tailwind-merge package is installed
[03:31:58.879] ✅ globals.css already has required Tailwind directives
[03:31:58.879] ✅ PostCSS configuration verified!
[03:31:58.885] + echo 'Preparing UI components...'
[03:31:58.885] + node scripts/prepare-ui-components.js
[03:31:58.886] Preparing UI components...
[03:31:58.914] Preparing UI components for build...
[03:31:58.914] Updating .npmrc file...
[03:31:58.915] components.json exists, ensuring aliases are correctly set...
[03:31:58.915] UI components preparation complete!
[03:31:58.917] + echo 'Verifying UI components...'
[03:31:58.918] + node scripts/verify-ui-components.js
[03:31:58.918] Verifying UI components...
[03:31:58.947] Verifying UI components...
[03:31:58.947] UI component exists: breadcrumb.tsx
[03:31:58.948] UI component exists: button.tsx
[03:31:58.949] UI component exists: card.tsx
[03:31:58.949] UI component exists: tabs.tsx
[03:31:58.949] utils.ts exists
[03:31:58.949] UI components verification complete!
[03:31:58.951] + echo 'Copying UI components...'
[03:31:58.951] + node scripts/copy-ui-components-to-build.js
[03:31:58.951] Copying UI components...
[03:31:58.983] Copying UI components to build directory...
[03:31:58.988] Checking component: breadcrumb.tsx
[03:31:58.989] Component breadcrumb.tsx already exists and has cn utility
[03:31:58.989] Checking component: button.tsx
[03:31:58.989] Component button.tsx already exists and has cn utility
[03:31:58.989] Checking component: card.tsx
[03:31:58.990] Component card.tsx already exists and has cn utility
[03:31:58.990] Checking component: tabs.tsx
[03:31:58.990] Component tabs.tsx already exists and has cn utility
[03:31:58.990] Installing required dependencies...
[03:31:58.991] Required dependencies already installed
[03:31:58.991] Generating index.ts for component exports...
[03:31:58.991] Component index file generated
[03:31:58.991] UI components copying completed!
[03:31:58.995] + echo 'Debugging Babel configuration...'
[03:31:58.995] + node scripts/debug-babel.js
[03:31:58.995] Debugging Babel configuration...
[03:31:59.026] === Debugging Babel Configuration ===
[03:31:59.026] ❌ @babel/plugin-syntax-import-attributes is NOT installed
[03:31:59.027] Installing now...
[03:32:01.018] npm warn ERESOLVE overriding peer dependency
[03:32:01.020] npm warn While resolving: @typescript-eslint/eslint-plugin@8.24.0
[03:32:01.020] npm warn Found: typescript@5.8.2
[03:32:01.020] npm warn node_modules/typescript
[03:32:01.020] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:32:01.020] npm warn node_modules/@prisma/client
[03:32:01.020] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:32:01.020] npm warn node_modules/@auth/prisma-adapter
[03:32:01.020] npm warn 1 more (the root project)
[03:32:01.020] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:32:01.020] npm warn
[03:32:01.020] npm warn Could not resolve dependency:
[03:32:01.020] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:32:01.021] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:32:01.021] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[03:32:01.021] npm warn node_modules/eslint-config-next
[03:32:01.021] npm warn
[03:32:01.021] npm warn Conflicting peer dependency: typescript@5.7.3
[03:32:01.021] npm warn node_modules/typescript
[03:32:01.021] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:32:01.022] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:32:01.022] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[03:32:01.022] npm warn node_modules/eslint-config-next
[03:32:01.033] npm warn ERESOLVE overriding peer dependency
[03:32:01.034] npm warn While resolving: @typescript-eslint/parser@8.24.0
[03:32:01.034] npm warn Found: typescript@5.8.2
[03:32:01.034] npm warn node_modules/typescript
[03:32:01.034] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:32:01.034] npm warn node_modules/@prisma/client
[03:32:01.034] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:32:01.034] npm warn node_modules/@auth/prisma-adapter
[03:32:01.034] npm warn 1 more (the root project)
[03:32:01.034] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:32:01.034] npm warn
[03:32:01.034] npm warn Could not resolve dependency:
[03:32:01.034] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[03:32:01.035] npm warn node_modules/@typescript-eslint/parser
[03:32:01.035] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:32:01.035] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:32:01.035] npm warn 1 more (eslint-config-next)
[03:32:01.035] npm warn
[03:32:01.035] npm warn Conflicting peer dependency: typescript@5.7.3
[03:32:01.035] npm warn node_modules/typescript
[03:32:01.035] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[03:32:01.035] npm warn node_modules/@typescript-eslint/parser
[03:32:01.035] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:32:01.035] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:32:01.035] npm warn 1 more (eslint-config-next)
[03:32:01.044] npm warn ERESOLVE overriding peer dependency
[03:32:01.051] npm warn While resolving: @typescript-eslint/type-utils@8.24.0
[03:32:01.051] npm warn Found: typescript@5.8.2
[03:32:01.051] npm warn node_modules/typescript
[03:32:01.052] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:32:01.052] npm warn node_modules/@prisma/client
[03:32:01.052] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:32:01.052] npm warn node_modules/@auth/prisma-adapter
[03:32:01.052] npm warn 1 more (the root project)
[03:32:01.053] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:32:01.053] npm warn
[03:32:01.053] npm warn Could not resolve dependency:
[03:32:01.053] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[03:32:01.053] npm warn node_modules/@typescript-eslint/type-utils
[03:32:01.054] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:32:01.054] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:32:01.054] npm warn
[03:32:01.056] npm warn Conflicting peer dependency: typescript@5.7.3
[03:32:01.057] npm warn node_modules/typescript
[03:32:01.057] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[03:32:01.057] npm warn node_modules/@typescript-eslint/type-utils
[03:32:01.057] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:32:01.057] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:32:01.062] npm warn ERESOLVE overriding peer dependency
[03:32:01.063] npm warn While resolving: @typescript-eslint/typescript-estree@8.24.0
[03:32:01.064] npm warn Found: typescript@5.8.2
[03:32:01.064] npm warn node_modules/typescript
[03:32:01.064] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:32:01.064] npm warn node_modules/@prisma/client
[03:32:01.064] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:32:01.065] npm warn node_modules/@auth/prisma-adapter
[03:32:01.065] npm warn 1 more (the root project)
[03:32:01.065] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:32:01.065] npm warn
[03:32:01.065] npm warn Could not resolve dependency:
[03:32:01.065] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[03:32:01.065] npm warn node_modules/@typescript-eslint/typescript-estree
[03:32:01.066] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[03:32:01.066] npm warn node_modules/@typescript-eslint/parser
[03:32:01.066] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[03:32:01.066] npm warn
[03:32:01.066] npm warn Conflicting peer dependency: typescript@5.7.3
[03:32:01.066] npm warn node_modules/typescript
[03:32:01.067] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[03:32:01.067] npm warn node_modules/@typescript-eslint/typescript-estree
[03:32:01.067] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[03:32:01.067] npm warn node_modules/@typescript-eslint/parser
[03:32:01.067] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[03:32:01.067] npm warn ERESOLVE overriding peer dependency
[03:32:01.067] npm warn While resolving: @typescript-eslint/utils@8.24.0
[03:32:01.068] npm warn Found: typescript@5.8.2
[03:32:01.068] npm warn node_modules/typescript
[03:32:01.068] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[03:32:01.068] npm warn node_modules/@prisma/client
[03:32:01.068] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[03:32:01.068] npm warn node_modules/@auth/prisma-adapter
[03:32:01.068] npm warn 1 more (the root project)
[03:32:01.069] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[03:32:01.069] npm warn
[03:32:01.069] npm warn Could not resolve dependency:
[03:32:01.069] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[03:32:01.069] npm warn node_modules/@typescript-eslint/utils
[03:32:01.069] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:32:01.069] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:32:01.070] npm warn 1 more (@typescript-eslint/type-utils)
[03:32:01.070] npm warn
[03:32:01.070] npm warn Conflicting peer dependency: typescript@5.7.3
[03:32:01.070] npm warn node_modules/typescript
[03:32:01.070] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[03:32:01.070] npm warn node_modules/@typescript-eslint/utils
[03:32:01.070] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[03:32:01.071] npm warn node_modules/@typescript-eslint/eslint-plugin
[03:32:01.071] npm warn 1 more (@typescript-eslint/type-utils)
[03:32:01.650] npm error code ERESOLVE
[03:32:01.651] npm error ERESOLVE could not resolve
[03:32:01.652] npm error
[03:32:01.652] npm error While resolving: react-pdf@7.5.1
[03:32:01.652] npm error Found: @types/react@19.0.10
[03:32:01.652] npm error node_modules/@types/react
[03:32:01.652] npm error peer @types/react@">=16" from @mdx-js/react@3.1.0
[03:32:01.652] npm error node_modules/@mdx-js/react
[03:32:01.653] npm error @mdx-js/react@"^3.0.1" from next-mdx-remote@5.0.0
[03:32:01.653] npm error node_modules/next-mdx-remote
[03:32:01.653] npm error next-mdx-remote@"^5.0.0" from the root project
[03:32:01.653] npm error peerOptional @types/react@"\*" from @radix-ui/react-accordion@1.2.3
[03:32:01.653] npm error node_modules/@radix-ui/react-accordion
[03:32:01.653] npm error @radix-ui/react-accordion@"^1.2.3" from the root project
[03:32:01.653] npm error 74 more (@radix-ui/react-alert-dialog, @radix-ui/react-arrow, ...)
[03:32:01.653] npm error
[03:32:01.654] npm error Could not resolve dependency:
[03:32:01.654] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[03:32:01.654] npm error node_modules/react-pdf
[03:32:01.654] npm error react-pdf@"^7.5.1" from the root project
[03:32:01.654] npm error
[03:32:01.654] npm error Conflicting peer dependency: @types/react@18.3.18
[03:32:01.654] npm error node_modules/@types/react
[03:32:01.654] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[03:32:01.655] npm error node_modules/react-pdf
[03:32:01.655] npm error react-pdf@"^7.5.1" from the root project
[03:32:01.655] npm error
[03:32:01.655] npm error Fix the upstream dependency conflict, or retry
[03:32:01.655] npm error this command with --force or --legacy-peer-deps
[03:32:01.655] npm error to accept an incorrect (and potentially broken) dependency resolution.
[03:32:01.655] npm error
[03:32:01.655] npm error
[03:32:01.655] npm error For a full report see:
[03:32:01.656] npm error /vercel/.npm/\_logs/2025-03-18T07_31_59_090Z-eresolve-report.txt
[03:32:01.656] npm error A complete log of this run can be found in: /vercel/.npm/\_logs/2025-03-18T07_31_59_090Z-debug-0.log
[03:32:01.669] ❌ Failed to install @babel/plugin-syntax-import-attributes: Command failed: npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[03:32:01.670] ✅ .babelrc exists
[03:32:01.670] Contents of .babelrc:
[03:32:01.670] {
[03:32:01.670] "presets": [["next/babel"]],
[03:32:01.670] "plugins": ["@babel/plugin-syntax-import-attributes"],
[03:32:01.670] "generatorOpts": {
[03:32:01.670] "maxSize": 2000000
[03:32:01.670] }
[03:32:01.671] }
[03:32:01.671]
[03:32:01.671] ✅ @babel/plugin-syntax-import-attributes is included in .babelrc
[03:32:01.671] ✅ babel.config.js exists
[03:32:01.671] Contents of babel.config.js:
[03:32:01.672] module.exports = {
[03:32:01.672] presets: [["next/babel"]],
[03:32:01.672] plugins: ["@babel/plugin-syntax-import-attributes"],
[03:32:01.672] // Increase the size limit for files that Babel will optimize
[03:32:01.672] generatorOpts: {
[03:32:01.672] maxSize: 2000000, // 2MB
[03:32:01.673] },
[03:32:01.673] };
[03:32:01.673]
[03:32:01.673] ✅ @babel/plugin-syntax-import-attributes is included in babel.config.js
[03:32:01.673] === Babel Configuration Debugging Complete ===
[03:32:01.676] + echo 'Temporarily moving Babel configuration files...'
[03:32:01.676] + '[' -f .babelrc ']'
[03:32:01.676] Temporarily moving Babel configuration files...
[03:32:01.677] + mv .babelrc .babelrc.backup
[03:32:01.678] + '[' -f babel.config.js ']'
[03:32:01.678] + mv babel.config.js babel.config.js.backup
[03:32:01.679] + echo 'Cleaning .next directory...'
[03:32:01.680] + rm -rf .next
[03:32:01.680] Cleaning .next directory...
[03:32:01.716] + echo 'Generating Prisma client...'
[03:32:01.717] + npx prisma generate
[03:32:01.717] Generating Prisma client...
[03:32:02.981] npm warn exec The following package was not found and will be installed: prisma@6.5.0
[03:32:08.848] Prisma schema loaded from prisma/schema.prisma
[03:32:10.102]
[03:32:10.103] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 592ms
[03:32:10.103]
[03:32:10.104] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[03:32:10.104]
[03:32:10.104] Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: https://pris.ly/orm/survey/release-5-22
[03:32:10.104]
[03:32:10.315] + echo 'Handling database setup...'
[03:32:10.316] + node scripts/handle-db-build.js
[03:32:10.316] Handling database setup...
[03:32:10.345] Build environment detected, creating mock Prisma client...
[03:32:10.346] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[03:32:10.346] Database handling for build complete
[03:32:10.348] + echo 'Building Next.js app with default compiler...'
[03:32:10.349] + npx next build
[03:32:10.349] Building Next.js app with default compiler...
[03:32:11.800] ▲ Next.js 15.2.3
[03:32:11.800] - Environments: .env.production
[03:32:11.800]
[03:32:11.827] Creating an optimized production build ...
[03:32:49.144] Failed to compile.
[03:32:49.144]
[03:32:49.145] ./src/app/admin/communications/page.tsx
[03:32:49.145] Module not found: Can't resolve '@/components/admin/AdminLayout'
[03:32:49.145]
[03:32:49.145] https://nextjs.org/docs/messages/module-not-found
[03:32:49.145]
[03:32:49.145] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[03:32:49.145] Module not found: Can't resolve '@/components/contact-submissions/ContactSubmissionsList'
[03:32:49.146]
[03:32:49.146] https://nextjs.org/docs/messages/module-not-found
[03:32:49.146]
[03:32:49.146] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[03:32:49.150] Module not found: Can't resolve '@/components/admin/AdminLayout'
[03:32:49.150]
[03:32:49.150] https://nextjs.org/docs/messages/module-not-found
[03:32:49.151]
[03:32:49.151] ./src/app/admin/email-logs/page.tsx
[03:32:49.151] Module not found: Can't resolve '@/components/admin/AdminLayout'
[03:32:49.151]
[03:32:49.151] https://nextjs.org/docs/messages/module-not-found
[03:32:49.151]
[03:32:49.151] ./src/app/admin/feedback/page.tsx
[03:32:49.152] Module not found: Can't resolve '@/components/admin/AdminLayout'
[03:32:49.152]
[03:32:49.152] https://nextjs.org/docs/messages/module-not-found
[03:32:49.152]
[03:32:49.152]
[03:32:49.152] > Build failed because of webpack errors
[03:32:49.226] Error: Command "npm install clsx tailwind-merge @tailwindcss/postcss && rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh" exited with 1
[03:32:49.609]
