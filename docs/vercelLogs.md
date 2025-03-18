# Vercel Build Logs

[16:14:17.657] Running build in Washington, D.C., USA (East) – iad1
[16:14:17.825] Retrieving list of deployment files...
[16:14:18.231] Downloading 665 deployment files...
[16:14:35.568] Restored build cache from previous deployment (AR9amcy2M8PvZqUKGWKFWR9KSe4C)
[16:14:35.773] Running "vercel build"
[16:14:38.120] Vercel CLI 41.4.1
[16:14:38.443] WARN! Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply. Learn More: https://vercel.link/unused-build-settings
[16:14:41.382] Running "install" command: `npm install`...
[16:14:51.619]
[16:14:51.620] > nextjs-app@0.1.0 postinstall
[16:14:51.620] > prisma generate
[16:14:51.621]
[16:14:52.177] Environment variables loaded from .env
[16:14:52.179] Prisma schema loaded from prisma/schema.prisma
[16:14:53.359]
[16:14:53.360] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 643ms
[16:14:53.360]
[16:14:53.360] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[16:14:53.360]
[16:14:53.360] Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
[16:14:53.360]
[16:14:53.561]
[16:14:53.561] removed 1 package, changed 3 packages, and audited 1905 packages in 12s
[16:14:53.562]
[16:14:53.562] 396 packages are looking for funding
[16:14:53.562] run `npm fund` for details
[16:14:53.580]
[16:14:53.580] 8 vulnerabilities (1 moderate, 7 high)
[16:14:53.581]
[16:14:53.581] To address issues that do not require attention, run:
[16:14:53.581] npm audit fix
[16:14:53.581]
[16:14:53.581] To address all issues possible (including breaking changes), run:
[16:14:53.581] npm audit fix --force
[16:14:53.581]
[16:14:53.581] Some issues need review, and may require choosing
[16:14:53.581] a different dependency.
[16:14:53.581]
[16:14:53.581] Run `npm audit` for details.
[16:14:53.624] Detected Next.js version: 15.2.3
[16:14:53.625] Running "rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh"
[16:14:54.027] + echo 'Installing required packages...'
[16:14:54.028] + npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[16:14:54.028] Installing required packages...
[16:14:57.966]
[16:14:57.966] up to date, audited 978 packages in 4s
[16:14:57.966]
[16:14:57.966] 214 packages are looking for funding
[16:14:57.966] run `npm fund` for details
[16:14:57.985]
[16:14:57.985] 8 vulnerabilities (1 moderate, 7 high)
[16:14:57.985]
[16:14:57.986] To address issues that do not require attention, run:
[16:14:57.986] npm audit fix
[16:14:57.986]
[16:14:57.986] To address all issues possible (including breaking changes), run:
[16:14:57.986] npm audit fix --force
[16:14:57.986]
[16:14:57.986] Some issues need review, and may require choosing
[16:14:57.986] a different dependency.
[16:14:57.987]
[16:14:57.987] Run `npm audit` for details.
[16:14:58.005] + npm install --save @tailwindcss/postcss@4.0.14 clsx@2.1.1 tailwind-merge@3.0.2
[16:15:01.269]
[16:15:01.270] up to date, audited 978 packages in 3s
[16:15:01.270]
[16:15:01.271] 214 packages are looking for funding
[16:15:01.271] run `npm fund` for details
[16:15:01.284]
[16:15:01.284] 8 vulnerabilities (1 moderate, 7 high)
[16:15:01.285]
[16:15:01.285] To address issues that do not require attention, run:
[16:15:01.285] npm audit fix
[16:15:01.285]
[16:15:01.285] To address all issues possible (including breaking changes), run:
[16:15:01.286] npm audit fix --force
[16:15:01.286]
[16:15:01.286] Some issues need review, and may require choosing
[16:15:01.286] a different dependency.
[16:15:01.286]
[16:15:01.286] Run `npm audit` for details.
[16:15:01.296] + npm install --save @radix-ui/react-slot@1.1.2 @radix-ui/react-tabs@1.1.3
[16:15:04.536]
[16:15:04.536] up to date, audited 978 packages in 3s
[16:15:04.536]
[16:15:04.536] 214 packages are looking for funding
[16:15:04.536] run `npm fund` for details
[16:15:04.553]
[16:15:04.554] 8 vulnerabilities (1 moderate, 7 high)
[16:15:04.554]
[16:15:04.554] To address issues that do not require attention, run:
[16:15:04.555] npm audit fix
[16:15:04.555]
[16:15:04.555] To address all issues possible (including breaking changes), run:
[16:15:04.555] npm audit fix --force
[16:15:04.555]
[16:15:04.555] Some issues need review, and may require choosing
[16:15:04.556] a different dependency.
[16:15:04.556]
[16:15:04.556] Run `npm audit` for details.
[16:15:04.565] + echo 'Verifying essential dependencies...'
[16:15:04.566] Verifying essential dependencies...
[16:15:04.566] + npm list clsx
[16:15:05.466] + npm list tailwind-merge
[16:15:06.369] + npm list @radix-ui/react-tabs
[16:15:07.272] + npm list @tailwindcss/postcss
[16:15:08.178] + echo '@tailwindcss/postcss not found, installing...'
[16:15:08.178] + npm install --save @tailwindcss/postcss@4.0.14
[16:15:08.178] @tailwindcss/postcss not found, installing...
[16:15:11.234]
[16:15:11.235] up to date, audited 978 packages in 3s
[16:15:11.235]
[16:15:11.235] 214 packages are looking for funding
[16:15:11.235] run `npm fund` for details
[16:15:11.252]
[16:15:11.253] 8 vulnerabilities (1 moderate, 7 high)
[16:15:11.253]
[16:15:11.253] To address issues that do not require attention, run:
[16:15:11.253] npm audit fix
[16:15:11.254]
[16:15:11.254] To address all issues possible (including breaking changes), run:
[16:15:11.254] npm audit fix --force
[16:15:11.254]
[16:15:11.254] Some issues need review, and may require choosing
[16:15:11.255] a different dependency.
[16:15:11.255]
[16:15:11.255] Run `npm audit` for details.
[16:15:11.265] + echo 'Verifying PostCSS configuration...'
[16:15:11.265] + node scripts/ensure-postcss-config.js
[16:15:11.265] Verifying PostCSS configuration...
[16:15:11.296] ✅ PostCSS configuration is already using @tailwindcss/postcss
[16:15:11.297] ⚠️ @tailwindcss/postcss package is not installed. Installing now...
[16:15:14.312]
[16:15:14.313] up to date, audited 978 packages in 3s
[16:15:14.313]
[16:15:14.313] 214 packages are looking for funding
[16:15:14.314] run `npm fund` for details
[16:15:14.334]
[16:15:14.334] 8 vulnerabilities (1 moderate, 7 high)
[16:15:14.334]
[16:15:14.334] To address issues that do not require attention, run:
[16:15:14.335] npm audit fix
[16:15:14.335]
[16:15:14.335] To address all issues possible (including breaking changes), run:
[16:15:14.335] npm audit fix --force
[16:15:14.335]
[16:15:14.335] Some issues need review, and may require choosing
[16:15:14.336] a different dependency.
[16:15:14.336]
[16:15:14.336] Run `npm audit` for details.
[16:15:14.346] ✅ @tailwindcss/postcss installed successfully!
[16:15:14.347] ⚠️ autoprefixer package is not installed. Installing now...
[16:15:17.432]
[16:15:17.432] up to date, audited 978 packages in 3s
[16:15:17.432]
[16:15:17.433] 214 packages are looking for funding
[16:15:17.433] run `npm fund` for details
[16:15:17.446]
[16:15:17.446] 8 vulnerabilities (1 moderate, 7 high)
[16:15:17.446]
[16:15:17.446] To address issues that do not require attention, run:
[16:15:17.447] npm audit fix
[16:15:17.447]
[16:15:17.447] To address all issues possible (including breaking changes), run:
[16:15:17.447] npm audit fix --force
[16:15:17.447]
[16:15:17.448] Some issues need review, and may require choosing
[16:15:17.448] a different dependency.
[16:15:17.448]
[16:15:17.448] Run `npm audit` for details.
[16:15:17.459] ✅ autoprefixer installed successfully!
[16:15:17.462] ✅ clsx package is installed
[16:15:17.463] ✅ tailwind-merge package is installed
[16:15:17.464] ✅ globals.css already has required Tailwind directives
[16:15:17.464] ✅ PostCSS configuration verified!
[16:15:17.467] + echo 'Preparing styles with performance optimization...'
[16:15:17.467] + node scripts/prepare-styles.js
[16:15:17.467] Preparing styles with performance optimization...
[16:15:17.496] Preparing styles for build with performance optimization...
[16:15:17.497] Read critical.css content
[16:15:17.497] Read globals.css content
[16:15:17.497] non-critical.css already exists, making a backup...
[16:15:17.503] Checking PostCSS configuration...
[16:15:17.504] ✅ PostCSS configuration looks good!
[16:15:17.504] Creating Tailwind safelist to prevent important classes from being purged...
[16:15:17.506] ✅ Created Tailwind safelist
[16:15:17.506] ✅ Styles preparation complete!
[16:15:17.507] 🚀 Performance optimizations applied to CSS loading process
[16:15:17.519] + echo 'Preparing UI components...'
[16:15:17.520] + node scripts/prepare-ui-components.js
[16:15:17.520] Preparing UI components...
[16:15:17.565] Preparing UI components for build...
[16:15:17.566] Updating .npmrc file...
[16:15:17.566] components.json exists, ensuring aliases are correctly set...
[16:15:17.566] UI components preparation complete!
[16:15:17.572] + echo 'Verifying UI components...'
[16:15:17.572] + node scripts/verify-ui-components.js
[16:15:17.572] Verifying UI components...
[16:15:17.601] Verifying UI components...
[16:15:17.601] UI component exists: breadcrumb.tsx
[16:15:17.601] UI component exists: button.tsx
[16:15:17.601] UI component exists: card.tsx
[16:15:17.602] UI component exists: tabs.tsx
[16:15:17.602] utils.ts exists
[16:15:17.602] UI components verification complete!
[16:15:17.605] + echo 'Copying UI components...'
[16:15:17.605] + node scripts/copy-ui-components-to-build.js
[16:15:17.605] Copying UI components...
[16:15:17.651] Copying UI components to build directory...
[16:15:17.657] Checking component: breadcrumb.tsx
[16:15:17.657] Component breadcrumb.tsx already exists and has cn utility
[16:15:17.657] Checking component: button.tsx
[16:15:17.658] Component button.tsx already exists and has cn utility
[16:15:17.658] Checking component: card.tsx
[16:15:17.658] Component card.tsx already exists and has cn utility
[16:15:17.658] Checking component: tabs.tsx
[16:15:17.658] Component tabs.tsx already exists and has cn utility
[16:15:17.659] Installing required dependencies...
[16:15:17.659] Required dependencies already installed
[16:15:17.659] Generating index.ts for component exports...
[16:15:17.660] Component index file generated
[16:15:17.660] UI components copying completed!
[16:15:17.664] + echo 'Debugging Babel configuration...'
[16:15:17.664] + node scripts/debug-babel.js
[16:15:17.664] Debugging Babel configuration...
[16:15:17.696] === Debugging Babel Configuration ===
[16:15:17.703] ❌ @babel/plugin-syntax-import-attributes is NOT installed
[16:15:17.704] Installing now...
[16:15:19.800] npm warn ERESOLVE overriding peer dependency
[16:15:19.802] npm warn While resolving: @typescript-eslint/eslint-plugin@8.24.0
[16:15:19.802] npm warn Found: typescript@5.8.2
[16:15:19.803] npm warn node_modules/typescript
[16:15:19.803] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:15:19.803] npm warn node_modules/@prisma/client
[16:15:19.803] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:15:19.803] npm warn node_modules/@auth/prisma-adapter
[16:15:19.804] npm warn 1 more (the root project)
[16:15:19.804] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:15:19.804] npm warn
[16:15:19.804] npm warn Could not resolve dependency:
[16:15:19.804] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:15:19.805] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:15:19.805] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[16:15:19.805] npm warn node_modules/eslint-config-next
[16:15:19.805] npm warn
[16:15:19.805] npm warn Conflicting peer dependency: typescript@5.7.3
[16:15:19.805] npm warn node_modules/typescript
[16:15:19.806] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:15:19.806] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:15:19.806] npm warn @typescript-eslint/eslint-plugin@"^5.4.2 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-config-next@15.2.0
[16:15:19.806] npm warn node_modules/eslint-config-next
[16:15:19.816] npm warn ERESOLVE overriding peer dependency
[16:15:19.816] npm warn While resolving: @typescript-eslint/parser@8.24.0
[16:15:19.817] npm warn Found: typescript@5.8.2
[16:15:19.817] npm warn node_modules/typescript
[16:15:19.817] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:15:19.817] npm warn node_modules/@prisma/client
[16:15:19.817] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:15:19.818] npm warn node_modules/@auth/prisma-adapter
[16:15:19.818] npm warn 1 more (the root project)
[16:15:19.818] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:15:19.818] npm warn
[16:15:19.818] npm warn Could not resolve dependency:
[16:15:19.818] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[16:15:19.819] npm warn node_modules/@typescript-eslint/parser
[16:15:19.819] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:15:19.822] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:15:19.822] npm warn 1 more (eslint-config-next)
[16:15:19.822] npm warn
[16:15:19.823] npm warn Conflicting peer dependency: typescript@5.7.3
[16:15:19.823] npm warn node_modules/typescript
[16:15:19.823] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/parser@8.24.0
[16:15:19.823] npm warn node_modules/@typescript-eslint/parser
[16:15:19.823] npm warn peer @typescript-eslint/parser@"^8.0.0 || ^8.0.0-alpha.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:15:19.824] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:15:19.825] npm warn 1 more (eslint-config-next)
[16:15:19.825] npm warn ERESOLVE overriding peer dependency
[16:15:19.825] npm warn While resolving: @typescript-eslint/type-utils@8.24.0
[16:15:19.825] npm warn Found: typescript@5.8.2
[16:15:19.826] npm warn node_modules/typescript
[16:15:19.826] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:15:19.826] npm warn node_modules/@prisma/client
[16:15:19.826] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:15:19.826] npm warn node_modules/@auth/prisma-adapter
[16:15:19.827] npm warn 1 more (the root project)
[16:15:19.827] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:15:19.827] npm warn
[16:15:19.827] npm warn Could not resolve dependency:
[16:15:19.827] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[16:15:19.828] npm warn node_modules/@typescript-eslint/type-utils
[16:15:19.828] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:15:19.828] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:15:19.828] npm warn
[16:15:19.828] npm warn Conflicting peer dependency: typescript@5.7.3
[16:15:19.828] npm warn node_modules/typescript
[16:15:19.829] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/type-utils@8.24.0
[16:15:19.829] npm warn node_modules/@typescript-eslint/type-utils
[16:15:19.829] npm warn @typescript-eslint/type-utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:15:19.829] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:15:19.840] npm warn ERESOLVE overriding peer dependency
[16:15:19.841] npm warn While resolving: @typescript-eslint/typescript-estree@8.24.0
[16:15:19.841] npm warn Found: typescript@5.8.2
[16:15:19.841] npm warn node_modules/typescript
[16:15:19.841] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:15:19.841] npm warn node_modules/@prisma/client
[16:15:19.841] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:15:19.841] npm warn node_modules/@auth/prisma-adapter
[16:15:19.841] npm warn 1 more (the root project)
[16:15:19.841] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:15:19.841] npm warn
[16:15:19.841] npm warn Could not resolve dependency:
[16:15:19.841] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[16:15:19.842] npm warn node_modules/@typescript-eslint/typescript-estree
[16:15:19.842] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[16:15:19.842] npm warn node_modules/@typescript-eslint/parser
[16:15:19.842] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[16:15:19.842] npm warn
[16:15:19.842] npm warn Conflicting peer dependency: typescript@5.7.3
[16:15:19.842] npm warn node_modules/typescript
[16:15:19.842] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/typescript-estree@8.24.0
[16:15:19.842] npm warn node_modules/@typescript-eslint/typescript-estree
[16:15:19.842] npm warn @typescript-eslint/typescript-estree@"8.24.0" from @typescript-eslint/parser@8.24.0
[16:15:19.842] npm warn node_modules/@typescript-eslint/parser
[16:15:19.842] npm warn 2 more (@typescript-eslint/type-utils, @typescript-eslint/utils)
[16:15:19.848] npm warn ERESOLVE overriding peer dependency
[16:15:19.849] npm warn While resolving: @typescript-eslint/utils@8.24.0
[16:15:19.849] npm warn Found: typescript@5.8.2
[16:15:19.849] npm warn node_modules/typescript
[16:15:19.849] npm warn peerOptional typescript@">=5.1.0" from @prisma/client@6.5.0
[16:15:19.849] npm warn node_modules/@prisma/client
[16:15:19.849] npm warn peer @prisma/client@">=2.26.0 || >=3 || >=4 || >=5 || >=6" from @auth/prisma-adapter@2.8.0
[16:15:19.849] npm warn node_modules/@auth/prisma-adapter
[16:15:19.849] npm warn 1 more (the root project)
[16:15:19.849] npm warn 10 more (cosmiconfig, eslint-config-next, jest-mock-extended, ...)
[16:15:19.849] npm warn
[16:15:19.850] npm warn Could not resolve dependency:
[16:15:19.850] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[16:15:19.850] npm warn node_modules/@typescript-eslint/utils
[16:15:19.850] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:15:19.850] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:15:19.850] npm warn 1 more (@typescript-eslint/type-utils)
[16:15:19.850] npm warn
[16:15:19.850] npm warn Conflicting peer dependency: typescript@5.7.3
[16:15:19.850] npm warn node_modules/typescript
[16:15:19.850] npm warn peer typescript@">=4.8.4 <5.8.0" from @typescript-eslint/utils@8.24.0
[16:15:19.850] npm warn node_modules/@typescript-eslint/utils
[16:15:19.850] npm warn @typescript-eslint/utils@"8.24.0" from @typescript-eslint/eslint-plugin@8.24.0
[16:15:19.850] npm warn node_modules/@typescript-eslint/eslint-plugin
[16:15:19.850] npm warn 1 more (@typescript-eslint/type-utils)
[16:15:20.701] npm error code ERESOLVE
[16:15:20.702] npm error ERESOLVE could not resolve
[16:15:20.702] npm error
[16:15:20.703] npm error While resolving: react-pdf@7.5.1
[16:15:20.703] npm error Found: @types/react@19.0.10
[16:15:20.703] npm error node_modules/@types/react
[16:15:20.703] npm error peer @types/react@">=16" from @mdx-js/react@3.1.0
[16:15:20.703] npm error node_modules/@mdx-js/react
[16:15:20.703] npm error @mdx-js/react@"^3.0.1" from next-mdx-remote@5.0.0
[16:15:20.704] npm error node_modules/next-mdx-remote
[16:15:20.704] npm error next-mdx-remote@"^5.0.0" from the root project
[16:15:20.704] npm error peerOptional @types/react@"\*" from @radix-ui/react-accordion@1.2.3
[16:15:20.704] npm error node_modules/@radix-ui/react-accordion
[16:15:20.704] npm error @radix-ui/react-accordion@"^1.2.3" from the root project
[16:15:20.704] npm error 74 more (@radix-ui/react-alert-dialog, @radix-ui/react-arrow, ...)
[16:15:20.704] npm error
[16:15:20.704] npm error Could not resolve dependency:
[16:15:20.704] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[16:15:20.704] npm error node_modules/react-pdf
[16:15:20.705] npm error react-pdf@"^7.5.1" from the root project
[16:15:20.705] npm error
[16:15:20.705] npm error Conflicting peer dependency: @types/react@18.3.18
[16:15:20.705] npm error node_modules/@types/react
[16:15:20.705] npm error peerOptional @types/react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-pdf@7.5.1
[16:15:20.705] npm error node_modules/react-pdf
[16:15:20.705] npm error react-pdf@"^7.5.1" from the root project
[16:15:20.705] npm error
[16:15:20.705] npm error Fix the upstream dependency conflict, or retry
[16:15:20.705] npm error this command with --force or --legacy-peer-deps
[16:15:20.705] npm error to accept an incorrect (and potentially broken) dependency resolution.
[16:15:20.705] npm error
[16:15:20.706] npm error
[16:15:20.706] npm error For a full report see:
[16:15:20.706] npm error /vercel/.npm/\_logs/2025-03-18T20_15_17_763Z-eresolve-report.txt
[16:15:20.706] npm error A complete log of this run can be found in: /vercel/.npm/\_logs/2025-03-18T20_15_17_763Z-debug-0.log
[16:15:20.717] ❌ Failed to install @babel/plugin-syntax-import-attributes: Command failed: npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
[16:15:20.717] ✅ .babelrc exists
[16:15:20.718] Contents of .babelrc:
[16:15:20.718] {
[16:15:20.718] "presets": [["next/babel"]],
[16:15:20.718] "plugins": ["@babel/plugin-syntax-import-attributes"],
[16:15:20.718] "generatorOpts": {
[16:15:20.718] "maxSize": 2000000
[16:15:20.718] }
[16:15:20.718] }
[16:15:20.718]
[16:15:20.719] ✅ @babel/plugin-syntax-import-attributes is included in .babelrc
[16:15:20.719] ✅ babel.config.js exists
[16:15:20.719] Contents of babel.config.js:
[16:15:20.719] module.exports = {
[16:15:20.719] presets: [["next/babel"]],
[16:15:20.719] plugins: ["@babel/plugin-syntax-import-attributes"],
[16:15:20.719] // Increase the size limit for files that Babel will optimize
[16:15:20.720] generatorOpts: {
[16:15:20.720] maxSize: 2000000, // 2MB
[16:15:20.720] },
[16:15:20.720] };
[16:15:20.720]
[16:15:20.720] ✅ @babel/plugin-syntax-import-attributes is included in babel.config.js
[16:15:20.720] === Babel Configuration Debugging Complete ===
[16:15:20.726] + echo 'Temporarily moving Babel configuration files...'
[16:15:20.726] + '[' -f .babelrc ']'
[16:15:20.727] Temporarily moving Babel configuration files...
[16:15:20.727] + mv .babelrc .babelrc.backup
[16:15:20.972] + '[' -f babel.config.js ']'
[16:15:20.972] + mv babel.config.js babel.config.js.backup
[16:15:20.972] + echo 'Cleaning .next directory...'
[16:15:20.972] + rm -rf .next
[16:15:20.972] Cleaning .next directory...
[16:15:21.030] + echo 'Generating Prisma client...'
[16:15:21.030] + npx prisma generate
[16:15:21.031] Generating Prisma client...
[16:15:22.316] npm warn exec The following package was not found and will be installed: prisma@6.5.0
[16:15:30.259] Environment variables loaded from .env
[16:15:30.262] Prisma schema loaded from prisma/schema.prisma
[16:15:31.412]
[16:15:31.412] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 534ms
[16:15:31.413]
[16:15:31.413] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[16:15:31.414]
[16:15:31.414] Tip: Curious about the SQL queries Prisma ORM generates? Optimize helps you enhance your visibility: https://pris.ly/tip-2-optimize
[16:15:31.414]
[16:15:31.619] + echo 'Handling database setup...'
[16:15:31.620] + node scripts/handle-db-build.js
[16:15:31.620] Handling database setup...
[16:15:31.654] Build environment detected, creating mock Prisma client...
[16:15:31.654] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[16:15:31.655] Database handling for build complete
[16:15:31.657] + echo 'Building Next.js app with performance optimizations...'
[16:15:31.657] + NEXT_OPTIMIZE_CSS=true
[16:15:31.657] Building Next.js app with performance optimizations...
[16:15:31.658] + npx next build
[16:15:32.593] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[16:15:32.594] This information is used to shape Next.js' roadmap and prioritize features.
[16:15:32.594] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[16:15:32.594] https://nextjs.org/telemetry
[16:15:32.594]
[16:15:32.654] ▲ Next.js 15.2.3
[16:15:32.655] - Environments: .env.production, .env
[16:15:32.655] - Experiments (use with caution):
[16:15:32.655] ✓ optimizeCss
[16:15:32.655]
[16:15:32.735] Creating an optimized production build ...
[16:16:07.959] Failed to compile.
[16:16:07.960]
[16:16:07.960] ./src/app/admin/communications/page.tsx
[16:16:07.960] Module not found: Can't resolve '@/components/admin/AdminLayout'
[16:16:07.960]
[16:16:07.960] https://nextjs.org/docs/messages/module-not-found
[16:16:07.961]
[16:16:07.962] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[16:16:07.962] Module not found: Can't resolve '@/components/contact-submissions/ContactSubmissionsList'
[16:16:07.962]
[16:16:07.962] https://nextjs.org/docs/messages/module-not-found
[16:16:07.963]
[16:16:07.963] ./src/app/admin/contact-submissions/ContactSubmissionsPage.tsx
[16:16:07.963] Module not found: Can't resolve '@/components/admin/AdminLayout'
[16:16:07.963]
[16:16:07.963] https://nextjs.org/docs/messages/module-not-found
[16:16:07.963]
[16:16:07.963] ./src/app/admin/email-logs/page.tsx
[16:16:07.963] Module not found: Can't resolve '@/components/admin/AdminLayout'
[16:16:07.963]
[16:16:07.963] https://nextjs.org/docs/messages/module-not-found
[16:16:07.963]
[16:16:07.963] ./src/app/admin/feedback/page.tsx
[16:16:07.963] Module not found: Can't resolve '@/components/admin/AdminLayout'
[16:16:07.963]
[16:16:07.963] https://nextjs.org/docs/messages/module-not-found
[16:16:07.964]
[16:16:07.964]
[16:16:07.964] > Build failed because of webpack errors
[16:16:08.048] Error: Command "rm -rf node_modules/.cache && chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh" exited with 1
[16:16:08.402]
