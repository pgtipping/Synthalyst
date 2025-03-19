# Vercel Build Logs

[16:44:59.439] Running build in Washington, D.C., USA (East) – iad1
[16:44:59.580] Cloning github.com/pgtipping/Synthalyst (Branch: simplified-deployment, Commit: de6969e)
[16:45:00.288] Cloning completed: 709.000ms
[16:45:16.744] Restored build cache from previous deployment (AR9amcy2M8PvZqUKGWKFWR9KSe4C)
[16:45:16.947] Running "vercel build"
[16:45:18.701] Vercel CLI 41.4.1
[16:45:19.319] WARN! Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply. Learn More: https://vercel.link/unused-build-settings
[16:45:19.805] Running "install" command: `npm install`...
[16:45:29.847]
[16:45:29.848] > nextjs-app@0.1.0 postinstall
[16:45:29.848] > prisma generate
[16:45:29.849]
[16:45:30.544] Prisma schema loaded from prisma/schema.prisma
[16:45:31.757]
[16:45:31.758] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 656ms
[16:45:31.758]
[16:45:31.758] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[16:45:31.758]
[16:45:31.759] Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
[16:45:31.759]
[16:45:31.962]
[16:45:31.963] removed 1 package, changed 3 packages, and audited 1905 packages in 12s
[16:45:31.963]
[16:45:31.963] 396 packages are looking for funding
[16:45:31.963] run `npm fund` for details
[16:45:31.979]
[16:45:31.980] 8 vulnerabilities (1 moderate, 7 high)
[16:45:31.980]
[16:45:31.980] To address issues that do not require attention, run:
[16:45:31.981] npm audit fix
[16:45:31.981]
[16:45:31.981] To address all issues possible (including breaking changes), run:
[16:45:31.981] npm audit fix --force
[16:45:31.981]
[16:45:31.982] Some issues need review, and may require choosing
[16:45:31.982] a different dependency.
[16:45:31.982]
[16:45:31.982] Run `npm audit` for details.
[16:45:32.026] Detected Next.js version: 15.2.3
[16:45:32.028] Running "rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh"
[16:45:32.037] + echo 'Installing required packages...'
[16:45:32.037] + npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[16:45:32.037] Installing required packages...
[16:45:36.151]
[16:45:36.152] up to date, audited 978 packages in 4s
[16:45:36.153]
[16:45:36.153] 214 packages are looking for funding
[16:45:36.153] run `npm fund` for details
[16:45:36.170]
[16:45:36.171] 8 vulnerabilities (1 moderate, 7 high)
[16:45:36.171]
[16:45:36.172] To address issues that do not require attention, run:
[16:45:36.172] npm audit fix
[16:45:36.172]
[16:45:36.172] To address all issues possible (including breaking changes), run:
[16:45:36.172] npm audit fix --force
[16:45:36.172]
[16:45:36.173] Some issues need review, and may require choosing
[16:45:36.173] a different dependency.
[16:45:36.173]
[16:45:36.173] Run `npm audit` for details.
[16:45:36.183] + npm install --save @tailwindcss/postcss@4.0.14 clsx@2.1.1 tailwind-merge@3.0.2
[16:45:39.425]
[16:45:39.425] up to date, audited 978 packages in 3s
[16:45:39.428]
[16:45:39.428] 214 packages are looking for funding
[16:45:39.428] run `npm fund` for details
[16:45:39.448]
[16:45:39.448] 8 vulnerabilities (1 moderate, 7 high)
[16:45:39.448]
[16:45:39.448] To address issues that do not require attention, run:
[16:45:39.448] npm audit fix
[16:45:39.448]
[16:45:39.448] To address all issues possible (including breaking changes), run:
[16:45:39.448] npm audit fix --force
[16:45:39.449]
[16:45:39.449] Some issues need review, and may require choosing
[16:45:39.449] a different dependency.
[16:45:39.449]
[16:45:39.449] Run `npm audit` for details.
[16:45:39.477] + npm install --save @radix-ui/react-slot@1.1.2 @radix-ui/react-tabs@1.1.3
[16:45:42.758]
[16:45:42.758] up to date, audited 978 packages in 3s
[16:45:42.759]
[16:45:42.759] 214 packages are looking for funding
[16:45:42.759] run `npm fund` for details
[16:45:42.777]
[16:45:42.778] 8 vulnerabilities (1 moderate, 7 high)
[16:45:42.778]
[16:45:42.780] To address issues that do not require attention, run:
[16:45:42.781] npm audit fix
[16:45:42.781]
[16:45:42.781] To address all issues possible (including breaking changes), run:
[16:45:42.781] npm audit fix --force
[16:45:42.781]
[16:45:42.781] Some issues need review, and may require choosing
[16:45:42.781] a different dependency.
[16:45:42.782]
[16:45:42.782] Run `npm audit` for details.
[16:45:42.793] + echo 'Verifying essential dependencies...'
[16:45:42.793] + npm list clsx
[16:45:42.794] Verifying essential dependencies...
[16:45:43.749] + npm list tailwind-merge
[16:45:44.689] + npm list @radix-ui/react-tabs
[16:45:45.632] + npm list @tailwindcss/postcss
[16:45:46.559] + echo '@tailwindcss/postcss not found, installing...'
[16:45:46.559] + npm install --save @tailwindcss/postcss@4.0.14
[16:45:46.559] @tailwindcss/postcss not found, installing...
[16:45:49.664]
[16:45:49.664] up to date, audited 978 packages in 3s
[16:45:49.665]
[16:45:49.665] 214 packages are looking for funding
[16:45:49.665] run `npm fund` for details
[16:45:49.683]
[16:45:49.684] 8 vulnerabilities (1 moderate, 7 high)
[16:45:49.684]
[16:45:49.684] To address issues that do not require attention, run:
[16:45:49.685] npm audit fix
[16:45:49.685]
[16:45:49.685] To address all issues possible (including breaking changes), run:
[16:45:49.685] npm audit fix --force
[16:45:49.685]
[16:45:49.685] Some issues need review, and may require choosing
[16:45:49.685] a different dependency.
[16:45:49.686]
[16:45:49.686] Run `npm audit` for details.
[16:45:49.697] + echo 'Verifying PostCSS configuration...'
[16:45:49.697] + node scripts/ensure-postcss-config.js
[16:45:49.697] Verifying PostCSS configuration...
[16:45:49.729] ✅ PostCSS configuration is already using @tailwindcss/postcss
[16:45:49.730] ⚠️ @tailwindcss/postcss package is not installed. Installing now...
[16:45:52.839]
[16:45:52.839] up to date, audited 978 packages in 3s
[16:45:52.840]
[16:45:52.840] 214 packages are looking for funding
[16:45:52.840] run `npm fund` for details
[16:45:52.857]
[16:45:52.857] 8 vulnerabilities (1 moderate, 7 high)
[16:45:52.857]
[16:45:52.858] To address issues that do not require attention, run:
[16:45:52.858] npm audit fix
[16:45:52.858]
[16:45:52.858] To address all issues possible (including breaking changes), run:
[16:45:52.858] npm audit fix --force
[16:45:52.858]
[16:45:52.858] Some issues need review, and may require choosing
[16:45:52.859] a different dependency.
[16:45:52.859]
[16:45:52.859] Run `npm audit` for details.
[16:45:52.874] ✅ @tailwindcss/postcss installed successfully!
[16:45:52.875] ⚠️ autoprefixer package is not installed. Installing now...
[16:45:56.050]
[16:45:56.050] up to date, audited 978 packages in 3s
[16:45:56.050]
[16:45:56.051] 214 packages are looking for funding
[16:45:56.051] run `npm fund` for details
[16:45:56.067]
[16:45:56.067] 8 vulnerabilities (1 moderate, 7 high)
[16:45:56.067]
[16:45:56.067] To address issues that do not require attention, run:
[16:45:56.067] npm audit fix
[16:45:56.067]
[16:45:56.068] To address all issues possible (including breaking changes), run:
[16:45:56.068] npm audit fix --force
[16:45:56.068]
[16:45:56.068] Some issues need review, and may require choosing
[16:45:56.068] a different dependency.
[16:45:56.068]
[16:45:56.068] Run `npm audit` for details.
[16:45:56.080] ✅ autoprefixer installed successfully!
[16:45:56.084] ✅ clsx package is installed
[16:45:56.085] ✅ tailwind-merge package is installed
[16:45:56.085] ✅ globals.css already has required Tailwind directives
[16:45:56.085] ✅ PostCSS configuration verified!
[16:45:56.089] + echo 'Preparing styles with performance optimization...'
[16:45:56.089] + node scripts/prepare-styles.js
[16:45:56.089] Preparing styles with performance optimization...
[16:45:56.118] Preparing styles for build with performance optimization...
[16:45:56.119] Read critical.css content
[16:45:56.120] Read globals.css content
[16:45:56.120] non-critical.css already exists, making a backup...
[16:45:56.124] Checking PostCSS configuration...
[16:45:56.125] ✅ PostCSS configuration looks good!
[16:45:56.125] Creating Tailwind safelist to prevent important classes from being purged...
[16:45:56.125] ✅ Created Tailwind safelist
[16:45:56.125] ✅ Styles preparation complete!
[16:45:56.127] 🚀 Performance optimizations applied to CSS loading process
[16:45:56.130] + echo 'Preparing UI components...'
[16:45:56.130] + node scripts/prepare-ui-components.js
[16:45:56.130] Preparing UI components...
[16:45:56.159] Preparing UI components for build...
[16:45:56.160] Updating .npmrc file...
[16:45:56.160] components.json exists, ensuring aliases are correctly set...
[16:45:56.160] UI components preparation complete!
[16:45:56.163] + echo 'Verifying UI components...'
[16:45:56.163] + node scripts/verify-ui-components.js
[16:45:56.164] Verifying UI components...
[16:45:56.193] Verifying UI components...
[16:45:56.193] UI component exists: breadcrumb.tsx
[16:45:56.194] UI component exists: button.tsx
[16:45:56.194] UI component exists: card.tsx
[16:45:56.194] UI component exists: tabs.tsx
[16:45:56.194] utils.ts exists
[16:45:56.195] UI components verification complete!
[16:45:56.198] + echo 'Copying UI components...'
[16:45:56.198] + node scripts/copy-ui-components-to-build.js
[16:45:56.198] Copying UI components...
[16:45:56.230] Copying UI components to build directory...
[16:45:56.235] Checking component: breadcrumb.tsx
[16:45:56.236] Component breadcrumb.tsx already exists and has cn utility
[16:45:56.236] Checking component: button.tsx
[16:45:56.236] Component button.tsx already exists and has cn utility
[16:45:56.236] Checking component: card.tsx
[16:45:56.236] Component card.tsx already exists and has cn utility
[16:45:56.236] Checking component: tabs.tsx
[16:45:56.237] Component tabs.tsx already exists and has cn utility
[16:45:56.237] Installing required dependencies...
[16:45:56.237] Required dependencies already installed
[16:45:56.237] Generating index.ts for component exports...
[16:45:56.237] Component index file generated
[16:45:56.238] UI components copying completed!
[16:45:56.240] + echo 'Debugging Babel configuration...'
[16:45:56.241] + node scripts/debug-babel.js
[16:45:56.241] Debugging Babel configuration...
[16:45:56.273] === Debugging Babel Configuration ===
[16:45:56.274] ❌ @babel/plugin-syntax-import-attributes is NOT installed
[16:45:56.274] Installing now...
[16:45:58.326] npm warn ERESOLVE overriding peer dependency
[16:45:58.332] npm warn While resolving: @typescript-eslint/eslint-plugin@8.24.0
[16:45:58.333] npm warn Found: typescript@5.8.2
[16:45:58.333] npm warn node_modules/typescript
[16:45:58.334] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:45:58.334] npm warn node_modules/@prisma/client
[16:45:58.334] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:45:58.334] npm warn node_modules/@auth/prisma-adapter
[16:45:58.334] npm warn 1 more (the root project)
[16:45:58.335] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:45:58.335] npm warn
[16:45:58.335] npm warn Could not resolve dependency:
[16:45:58.335] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:45:58.335] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:45:58.336] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[16:45:58.336] npm warn node_modules/eslint-config-next
[16:45:58.336] npm warn
[16:45:58.336] npm warn Conflicting peer dependency: typescript@5.7.3
[16:45:58.336] npm warn node_modules/typescript
[16:45:58.337] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:45:58.337] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:45:58.337] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[16:45:58.337] npm warn node_modules/eslint-config-next
[16:45:58.343] npm warn ERESOLVE overriding peer dependency
[16:45:58.344] npm warn While resolving: @typescript-eslint/parser@8.24.0
[16:45:58.345] npm warn Found: typescript@5.8.2
[16:45:58.345] npm warn node_modules/typescript
[16:45:58.345] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:45:58.345] npm warn node_modules/@prisma/client
[16:45:58.345] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:45:58.346] npm warn node_modules/@auth/prisma-adapter
[16:45:58.346] npm warn 1 more (the root project)
[16:45:58.346] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:45:58.346] npm warn
[16:45:58.346] npm warn Could not resolve dependency:
[16:45:58.347] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[16:45:58.347] npm warn node_modules/@typescript-eslint/parser
[16:45:58.347] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:45:58.347] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:45:58.347] npm warn 1 more (eslint-config-next)
[16:45:58.348] npm warn
[16:45:58.348] npm warn Conflicting peer dependency: typescript@5.7.3
[16:45:58.348] npm warn node_modules/typescript
[16:45:58.348] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[16:45:58.348] npm warn node_modules/@typescript-eslint/parser
[16:45:58.348] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:45:58.349] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:45:58.349] npm warn 1 more (eslint-config-next)
[16:45:58.355] npm warn ERESOLVE overriding peer dependency
[16:45:58.355] npm warn While resolving: @typescript-eslint/type-utils@8.24.0
[16:45:58.355] npm warn Found: typescript@5.8.2
[16:45:58.355] npm warn node_modules/typescript
[16:45:58.355] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:45:58.355] npm warn node_modules/@prisma/client
[16:45:58.355] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:45:58.355] npm warn node_modules/@auth/prisma-adapter
[16:45:58.355] npm warn 1 more (the root project)
[16:45:58.355] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:45:58.356] npm warn
[16:45:58.356] npm warn Could not resolve dependency:
[16:45:58.356] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[16:45:58.356] npm warn node_modules/@typescript-eslint/type-utils
[16:45:58.356] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:45:58.356] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:45:58.356] npm warn
[16:45:58.356] npm warn Conflicting peer dependency: typescript@5.7.3
[16:45:58.356] npm warn node_modules/typescript
[16:45:58.356] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[16:45:58.356] npm warn node_modules/@typescript-eslint/type-utils
[16:45:58.356] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:45:58.356] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:45:58.373] npm warn ERESOLVE overriding peer dependency
[16:45:58.373] npm warn While resolving: @typescript-eslint/typescript-estree@8.24.0
[16:45:58.373] npm warn Found: typescript@5.8.2
[16:45:58.373] npm warn node_modules/typescript
[16:45:58.373] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:45:58.373] npm warn node_modules/@prisma/client
[16:45:58.373] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:45:58.373] npm warn node_modules/@auth/prisma-adapter
[16:45:58.374] npm warn 1 more (the root project)
[16:45:58.374] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:45:58.374] npm warn
[16:45:58.374] npm warn Could not resolve dependency:
[16:45:58.374] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[16:45:58.374] npm warn node_modules/@typescript-eslint/typescript-estree
[16:45:58.374] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[16:45:58.374] npm warn node_modules/@typescript-eslint/parser
[16:45:58.374] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[16:45:58.374] npm warn
[16:45:58.374] npm warn Conflicting peer dependency: typescript@5.7.3
[16:45:58.376] npm warn node_modules/typescript
[16:45:58.376] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[16:45:58.376] npm warn node_modules/@typescript-eslint/typescript-estree
[16:45:58.376] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[16:45:58.376] npm warn node_modules/@typescript-eslint/parser
[16:45:58.376] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[16:45:58.380] npm warn ERESOLVE overriding peer dependency
[16:45:58.380] npm warn While resolving: @typescript-eslint/utils@8.24.0
[16:45:58.380] npm warn Found: typescript@5.8.2
[16:45:58.380] npm warn node_modules/typescript
[16:45:58.380] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:45:58.380] npm warn node_modules/@prisma/client
[16:45:58.380] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:45:58.380] npm warn node_modules/@auth/prisma-adapter
[16:45:58.380] npm warn 1 more (the root project)
[16:45:58.381] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:45:58.381] npm warn
[16:45:58.381] npm warn Could not resolve dependency:
[16:45:58.381] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[16:45:58.381] npm warn node_modules/@typescript-eslint/utils
[16:45:58.381] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:45:58.381] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:45:58.381] npm warn 1 more (@typescript-eslint/type-utils)
[16:45:58.381] npm warn
[16:45:58.381] npm warn Conflicting peer dependency: typescript@5.7.3
[16:45:58.381] npm warn node_modules/typescript
[16:45:58.381] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[16:45:58.381] npm warn node_modules/@typescript-eslint/utils
[16:45:58.381] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:45:58.381] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:45:58.382] npm warn 1 more (@typescript-eslint/type-utils)
[16:45:59.327] npm error code ERESOLVE
[16:45:59.328] npm error ERESOLVE could not resolve
[16:45:59.328] npm error
[16:45:59.328] npm error While resolving: react-pdf@7.5.1
[16:45:59.328] npm error Found: @types/react@19.0.10
[16:45:59.328] npm error node_modules/@types/react
[16:45:59.328] npm error peer @types/react@">=16" from @mdx-js/react@3.1.0
[16:45:59.328] npm error node_modules/@mdx-js/react
[16:45:59.328] npm error @mdx-js/react@"^3.0.1" from next-mdx-remote@5.0.0
[16:45:59.329] npm error node_modules/next-mdx-remote
[16:45:59.329] npm error next-mdx-remote@"^5.0.0" from the root project
[16:45:59.329] npm error peerOptional @types/react@"\*" from @radix-ui/react-accordion@1.2.3
[16:45:59.329] npm error node_modules/@radix-ui/react-accordion
[16:45:59.329] npm error @radix-ui/react-accordion@"^1.2.3" from the root project
[16:45:59.329] npm error 74 more (@radix-ui/react-alert-dialog, @radix-ui/react-arrow, ...)
[16:45:59.329] npm error
[16:45:59.329] npm error Could not resolve dependency:
[16:45:59.329] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[16:45:59.330] npm error node_modules/react-pdf
[16:45:59.330] npm error react-pdf@"^7.5.1" from the root project
[16:45:59.330] npm error
[16:45:59.330] npm error Conflicting peer dependency: @types/react@18.3.18
[16:45:59.330] npm error node_modules/@types/react
[16:45:59.330] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[16:45:59.330] npm error node_modules/react-pdf
[16:45:59.330] npm error react-pdf@"^7.5.1" from the root project
[16:45:59.330] npm error
[16:45:59.331] npm error Fix the upstream dependency conflict, or retry
[16:45:59.331] npm error this command with --force or --legacy-peer-deps
[16:45:59.331] npm error to accept an incorrect (and potentially broken) dependency resolution.
[16:45:59.331] npm error
[16:45:59.331] npm error
[16:45:59.331] npm error For a full report see:
[16:45:59.331] npm error /vercel/.npm/\_logs/2025-03-18T20_45_56_337Z-eresolve-report.txt
[16:45:59.331] npm error A complete log of this run can be found in: /vercel/.npm/\_logs/2025-03-18T20_45_56_337Z-debug-0.log
[16:45:59.346] ❌ Failed to install @babel/plugin-syntax-import-attributes: Command failed: npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[16:45:59.346] ✅ .babelrc exists
[16:45:59.347] Contents of .babelrc:
[16:45:59.347] {
[16:45:59.347] "presets": [["next/babel"]],
[16:45:59.347] "plugins": ["@babel/plugin-syntax-import-attributes"],
[16:45:59.347] "generatorOpts": {
[16:45:59.347] "maxSize": 2000000
[16:45:59.347] }
[16:45:59.347] }
[16:45:59.347]
[16:45:59.347] ✅ @babel/plugin-syntax-import-attributes is included in .babelrc
[16:45:59.352] ✅ babel.config.js exists
[16:45:59.353] Contents of babel.config.js:
[16:45:59.353] module.exports = {
[16:45:59.353] presets: [["next/babel"]],
[16:45:59.353] plugins: ["@babel/plugin-syntax-import-attributes"],
[16:45:59.353] // Increase the size limit for files that Babel will optimize
[16:45:59.353] generatorOpts: {
[16:45:59.353] maxSize: 2000000, // 2MB
[16:45:59.353] },
[16:45:59.353] };
[16:45:59.353]
[16:45:59.353] ✅ @babel/plugin-syntax-import-attributes is included in babel.config.js
[16:45:59.353] === Babel Configuration Debugging Complete ===
[16:45:59.357] + echo 'Temporarily moving Babel configuration files...'
[16:45:59.358] + '[' -f .babelrc ']'
[16:45:59.358] + mv .babelrc .babelrc.backup
[16:45:59.358] Temporarily moving Babel configuration files...
[16:45:59.360] + '[' -f babel.config.js ']'
[16:45:59.360] + mv babel.config.js babel.config.js.backup
[16:45:59.361] + echo 'Cleaning .next directory...'
[16:45:59.361] + rm -rf .next
[16:45:59.361] Cleaning .next directory...
[16:45:59.419] + echo 'Generating Prisma client...'
[16:45:59.420] + npx prisma generate
[16:45:59.420] Generating Prisma client...
[16:46:00.721] npm warn exec The following package was not found and will be installed: prisma@6.5.0
[16:46:07.614] Prisma schema loaded from prisma/schema.prisma
[16:46:08.846]
[16:46:08.846] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 577ms
[16:46:08.847]
[16:46:08.847] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[16:46:08.847]
[16:46:08.847] Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
[16:46:08.847]
[16:46:09.057] + echo 'Handling database setup...'
[16:46:09.057] + node scripts/handle-db-build.js
[16:46:09.058] Handling database setup...
[16:46:09.092] Build environment detected, creating mock Prisma client...
[16:46:09.093] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[16:46:09.093] Database handling for build complete
[16:46:09.101] + echo 'Building Next.js app with performance optimizations...'
[16:46:09.102] + NEXT_OPTIMIZE_CSS=true
[16:46:09.102] + npx next build
[16:46:09.102] Building Next.js app with performance optimizations...
[16:46:10.126] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[16:46:10.127] This information is used to shape Next.js' roadmap and prioritize features.
[16:46:10.127] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[16:46:10.128] https://nextjs.org/telemetry
[16:46:10.128]
[16:46:10.191] ▲ Next.js 15.2.3
[16:46:10.191] - Environments: .env.production
[16:46:10.191] - Experiments (use with caution):
[16:46:10.192] ✓ optimizeCss
[16:46:10.192]
[16:46:10.274] Creating an optimized production build ...
[16:46:48.068] Failed to compile.
[16:46:48.069]
[16:46:48.069] ./src/app/admin/communications/page.tsx
[16:46:48.070] Module not found: Can't resolve '@/components/admin/AdminLayout'
[16:46:48.070]
[16:46:48.070] https://nextjs.org/docs/messages/module-not-found
[16:46:48.070]
[16:46:48.070] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[16:46:48.070] Module not found: Can't resolve '@/components/contact-submissions/ContactSubmissionsList'
[16:46:48.070]
[16:46:48.072] https://nextjs.org/docs/messages/module-not-found
[16:46:48.073]
[16:46:48.073] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[16:46:48.073] Module not found: Can't resolve '@/components/admin/AdminLayout'
[16:46:48.073]
[16:46:48.073] https://nextjs.org/docs/messages/module-not-found
[16:46:48.073]
[16:46:48.073] ./src/app/admin/email-logs/page.tsx
[16:46:48.073] Module not found: Can't resolve '@/components/admin/AdminLayout'
[16:46:48.074]
[16:46:48.074] https://nextjs.org/docs/messages/module-not-found
[16:46:48.074]
[16:46:48.074] ./src/app/admin/feedback/page.tsx
[16:46:48.074] Module not found: Can't resolve '@/components/admin/AdminLayout'
[16:46:48.074]
[16:46:48.074] https://nextjs.org/docs/messages/module-not-found
[16:46:48.074]
[16:46:48.074]
[16:46:48.074] > Build failed because of webpack errors
[16:46:48.161] Error: Command "rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh" exited with 1
[16:46:48.537]
