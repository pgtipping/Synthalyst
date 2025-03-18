# Vercel Build Logs

[21:43:47.322] Running build in Washington, D.C., USA (East) – iad1
[21:43:47.437] Retrieving list of deployment files...
[21:43:47.793] Downloading 656 deployment files...
[21:44:00.959] Restored build cache from previous deployment (3u2PKdQgVLvCsnaSrxYngYBigJXi)
[21:44:01.625] Running "vercel build"
[21:44:02.843] Vercel CLI 41.3.2
[21:44:04.714] Running "install" command: `npm install`...
[21:44:09.506] npm warn deprecated @types/lru-cache@7.10.10: This is a stub types definition. lru-cache provides its own type definitions, so you do not need this installed.
[21:44:10.814] npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
[21:44:11.018] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[21:44:11.019] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[21:44:26.746]
[21:44:26.746] > nextjs-app@0.1.0 postinstall
[21:44:26.747] > prisma generate
[21:44:26.747]
[21:44:27.500] Environment variables loaded from .env
[21:44:27.502] Prisma schema loaded from prisma/schema.prisma
[21:44:28.920]
[21:44:28.920] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 643ms
[21:44:28.920]
[21:44:28.920] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[21:44:28.920]
[21:44:28.920] Tip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate
[21:44:28.920]
[21:44:29.114]
[21:44:29.114] added 148 packages, removed 31 packages, changed 74 packages, and audited 1905 packages in 24s
[21:44:29.114]
[21:44:29.116] 396 packages are looking for funding
[21:44:29.116] run `npm fund` for details
[21:44:29.133]
[21:44:29.134] 8 vulnerabilities (1 moderate, 7 high)
[21:44:29.134]
[21:44:29.134] To address issues that do not require attention, run:
[21:44:29.135] npm audit fix
[21:44:29.135]
[21:44:29.135] To address all issues possible (including breaking changes), run:
[21:44:29.135] npm audit fix --force
[21:44:29.135]
[21:44:29.136] Some issues need review, and may require choosing
[21:44:29.136] a different dependency.
[21:44:29.136]
[21:44:29.136] Run `npm audit` for details.
[21:44:29.383] Detected Next.js version: 15.2.3
[21:44:29.385] Running "chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh"
[21:44:29.484] + echo 'Installing @tailwindcss/postcss...'
[21:44:29.485] Installing @tailwindcss/postcss...
[21:44:29.485] + npm install --save @tailwindcss/postcss
[21:44:30.825] npm warn idealTree Removing dependencies.@tailwindcss/postcss in favor of devDependencies.@tailwindcss/postcss
[21:44:33.830]
[21:44:33.831] up to date, audited 978 packages in 4s
[21:44:33.832]
[21:44:33.832] 214 packages are looking for funding
[21:44:33.832] run `npm fund` for details
[21:44:33.848]
[21:44:33.848] 8 vulnerabilities (1 moderate, 7 high)
[21:44:33.849]
[21:44:33.849] To address issues that do not require attention, run:
[21:44:33.849] npm audit fix
[21:44:33.849]
[21:44:33.849] To address all issues possible (including breaking changes), run:
[21:44:33.850] npm audit fix --force
[21:44:33.850]
[21:44:33.850] Some issues need review, and may require choosing
[21:44:33.850] a different dependency.
[21:44:33.850]
[21:44:33.850] Run `npm audit` for details.
[21:44:33.864] + echo 'Verifying PostCSS configuration...'
[21:44:33.865] + node scripts/ensure-postcss-config.js
[21:44:33.865] Verifying PostCSS configuration...
[21:44:33.894] ✅ PostCSS configuration is already using @tailwindcss/postcss
[21:44:33.894] ⚠️ @tailwindcss/postcss package is not installed. Installing now...
[21:44:36.926]
[21:44:36.927] up to date, audited 978 packages in 3s
[21:44:36.927]
[21:44:36.928] 214 packages are looking for funding
[21:44:36.928] run `npm fund` for details
[21:44:36.946]
[21:44:36.946] 8 vulnerabilities (1 moderate, 7 high)
[21:44:36.946]
[21:44:36.946] To address issues that do not require attention, run:
[21:44:36.946] npm audit fix
[21:44:36.946]
[21:44:36.947] To address all issues possible (including breaking changes), run:
[21:44:36.947] npm audit fix --force
[21:44:36.947]
[21:44:36.947] Some issues need review, and may require choosing
[21:44:36.947] a different dependency.
[21:44:36.947]
[21:44:36.947] Run `npm audit` for details.
[21:44:36.965] ✅ @tailwindcss/postcss installed successfully!
[21:44:36.965] ✅ globals.css already has required Tailwind directives
[21:44:36.965] ✅ PostCSS configuration verified!
[21:44:36.968] + echo 'Cleaning .next directory...'
[21:44:36.968] + rm -rf .next
[21:44:36.968] Cleaning .next directory...
[21:44:37.044] + echo 'Generating Prisma client...'
[21:44:37.044] + npx prisma generate
[21:44:37.044] Generating Prisma client...
[21:44:38.312] npm warn exec The following package was not found and will be installed: prisma@6.5.0
[21:44:44.668] Environment variables loaded from .env
[21:44:44.670] Prisma schema loaded from prisma/schema.prisma
[21:44:45.870]
[21:44:45.870] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 566ms
[21:44:45.870]
[21:44:45.870] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[21:44:45.870]
[21:44:45.870] Tip: Want to react to database changes in your app as they happen? Discover how with Pulse: https://pris.ly/tip-1-pulse
[21:44:45.870]
[21:44:46.081] + echo 'Handling database setup...'
[21:44:46.081] + node scripts/handle-db-build.js
[21:44:46.081] Handling database setup...
[21:44:46.108] Build environment detected, creating mock Prisma client...
[21:44:46.109] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[21:44:46.109] Database handling for build complete
[21:44:46.112] + echo 'Building Next.js app...'
[21:44:46.112] + npx next build
[21:44:46.112] Building Next.js app...
[21:44:47.653] ▲ Next.js 15.2.3
[21:44:47.654] - Environments: .env
[21:44:47.655]
[21:44:47.683] Creating an optimized production build ...
[21:44:47.831] Disabled SWC as replacement for Babel because of custom Babel configuration ".babelrc" https://nextjs.org/docs/messages/swc-disabled
[21:44:49.440] Using external babel configuration from /vercel/path1/.babelrc
[21:44:52.652] Failed to compile.
[21:44:52.653]
[21:44:52.654] ./node_modules/next/dist/pages/\_app.js
[21:44:52.654] Error: Cannot find module '@babel/plugin-syntax-import-attributes'
[21:44:52.654] Require stack:
[21:44:52.654] - /vercel/path1/node_modules/next/dist/compiled/babel/bundle.js
[21:44:52.655] - /vercel/path1/node_modules/next/dist/compiled/babel/code-frame.js
[21:44:52.655] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/shared.js
[21:44:52.655] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/middleware-webpack.js
[21:44:52.655] - /vercel/path1/node_modules/next/dist/server/patch-error-inspect.js
[21:44:52.655] - /vercel/path1/node_modules/next/dist/server/node-environment-extensions/error-inspect.js
[21:44:52.655] - /vercel/path1/node_modules/next/dist/server/node-environment.js
[21:44:52.655] - /vercel/path1/node_modules/next/dist/build/utils.js
[21:44:52.655] - /vercel/path1/node_modules/next/dist/build/swc/options.js
[21:44:52.656] - /vercel/path1/node_modules/next/dist/build/swc/index.js
[21:44:52.656] - /vercel/path1/node_modules/next/dist/build/analysis/parse-module.js
[21:44:52.656] - /vercel/path1/node_modules/next/dist/build/analysis/get-page-static-info.js
[21:44:52.656] - /vercel/path1/node_modules/next/dist/build/index.js
[21:44:52.656] - /vercel/path1/node_modules/next/dist/cli/next-build.js
[21:44:52.656]
[21:44:52.656] Make sure that all the Babel plugins and presets you are using
[21:44:52.656] are defined as dependencies or devDependencies in your package.json
[21:44:52.657] file. It's possible that the missing plugin is loaded by a preset
[21:44:52.657] you are using that forgot to add the plugin to its dependencies: you
[21:44:52.657] can workaround this problem by explicitly adding the missing package
[21:44:52.657] to your top-level package.json.
[21:44:52.657]
[21:44:52.657] at Function.<anonymous> (node:internal/modules/cjs/loader:1225:15)
[21:44:52.658] at /vercel/path1/node_modules/next/dist/server/require-hook.js:55:36
[21:44:52.658] at resolve (node:internal/modules/helpers:146:19)
[21:44:52.658] at tryRequireResolve (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:121752)
[21:44:52.658] at resolveStandardizedNameForRequire (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122104)
[21:44:52.658] at resolveStandardizedName (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122510)
[21:44:52.658] at loadPlugin (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:119860)
[21:44:52.658] at loadPlugin.next (<anonymous>)
[21:44:52.658] at createDescriptor (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:105297)
[21:44:52.659] at createDescriptor.next (<anonymous>)
[21:44:52.661]
[21:44:52.661] ./node_modules/next/dist/pages/\_document.js
[21:44:52.662] Error: Cannot find module '@babel/plugin-syntax-import-attributes'
[21:44:52.663] Require stack:
[21:44:52.663] - /vercel/path1/node_modules/next/dist/compiled/babel/bundle.js
[21:44:52.663] - /vercel/path1/node_modules/next/dist/compiled/babel/code-frame.js
[21:44:52.663] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/shared.js
[21:44:52.663] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/middleware-webpack.js
[21:44:52.664] - /vercel/path1/node_modules/next/dist/server/patch-error-inspect.js
[21:44:52.664] - /vercel/path1/node_modules/next/dist/server/node-environment-extensions/error-inspect.js
[21:44:52.664] - /vercel/path1/node_modules/next/dist/server/node-environment.js
[21:44:52.664] - /vercel/path1/node_modules/next/dist/build/utils.js
[21:44:52.664] - /vercel/path1/node_modules/next/dist/build/swc/options.js
[21:44:52.664] - /vercel/path1/node_modules/next/dist/build/swc/index.js
[21:44:52.664] - /vercel/path1/node_modules/next/dist/build/analysis/parse-module.js
[21:44:52.664] - /vercel/path1/node_modules/next/dist/build/analysis/get-page-static-info.js
[21:44:52.664] - /vercel/path1/node_modules/next/dist/build/index.js
[21:44:52.665] - /vercel/path1/node_modules/next/dist/cli/next-build.js
[21:44:52.665]
[21:44:52.665] Make sure that all the Babel plugins and presets you are using
[21:44:52.665] are defined as dependencies or devDependencies in your package.json
[21:44:52.665] file. It's possible that the missing plugin is loaded by a preset
[21:44:52.665] you are using that forgot to add the plugin to its dependencies: you
[21:44:52.665] can workaround this problem by explicitly adding the missing package
[21:44:52.665] to your top-level package.json.
[21:44:52.665]
[21:44:52.666] at Function.<anonymous> (node:internal/modules/cjs/loader:1225:15)
[21:44:52.666] at /vercel/path1/node_modules/next/dist/server/require-hook.js:55:36
[21:44:52.666] at resolve (node:internal/modules/helpers:146:19)
[21:44:52.666] at tryRequireResolve (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:121752)
[21:44:52.666] at resolveStandardizedNameForRequire (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122104)
[21:44:52.666] at resolveStandardizedName (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122510)
[21:44:52.666] at loadPlugin (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:119860)
[21:44:52.667] at loadPlugin.next (<anonymous>)
[21:44:52.667] at createDescriptor (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:105297)
[21:44:52.667] at createDescriptor.next (<anonymous>)
[21:44:52.667]
[21:44:52.667] ./node_modules/next/dist/pages/\_error.js
[21:44:52.667] Error: Cannot find module '@babel/plugin-syntax-import-attributes'
[21:44:52.668] Require stack:
[21:44:52.668] - /vercel/path1/node_modules/next/dist/compiled/babel/bundle.js
[21:44:52.668] - /vercel/path1/node_modules/next/dist/compiled/babel/code-frame.js
[21:44:52.668] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/shared.js
[21:44:52.668] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/middleware-webpack.js
[21:44:52.669] - /vercel/path1/node_modules/next/dist/server/patch-error-inspect.js
[21:44:52.669] - /vercel/path1/node_modules/next/dist/server/node-environment-extensions/error-inspect.js
[21:44:52.669] - /vercel/path1/node_modules/next/dist/server/node-environment.js
[21:44:52.670] - /vercel/path1/node_modules/next/dist/build/utils.js
[21:44:52.670] - /vercel/path1/node_modules/next/dist/build/swc/options.js
[21:44:52.670] - /vercel/path1/node_modules/next/dist/build/swc/index.js
[21:44:52.670] - /vercel/path1/node_modules/next/dist/build/analysis/parse-module.js
[21:44:52.671] - /vercel/path1/node_modules/next/dist/build/analysis/get-page-static-info.js
[21:44:52.671] - /vercel/path1/node_modules/next/dist/build/index.js
[21:44:52.671] - /vercel/path1/node_modules/next/dist/cli/next-build.js
[21:44:52.671]
[21:44:52.672] Make sure that all the Babel plugins and presets you are using
[21:44:52.672] are defined as dependencies or devDependencies in your package.json
[21:44:52.672] file. It's possible that the missing plugin is loaded by a preset
[21:44:52.672] you are using that forgot to add the plugin to its dependencies: you
[21:44:52.673] can workaround this problem by explicitly adding the missing package
[21:44:52.673] to your top-level package.json.
[21:44:52.673]
[21:44:52.673] at Function.<anonymous> (node:internal/modules/cjs/loader:1225:15)
[21:44:52.674] at /vercel/path1/node_modules/next/dist/server/require-hook.js:55:36
[21:44:52.674] at resolve (node:internal/modules/helpers:146:19)
[21:44:52.674] at tryRequireResolve (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:121752)
[21:44:52.674] at resolveStandardizedNameForRequire (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122104)
[21:44:52.675] at resolveStandardizedName (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122510)
[21:44:52.675] at loadPlugin (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:119860)
[21:44:52.675] at loadPlugin.next (<anonymous>)
[21:44:52.675] at createDescriptor (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:105297)
[21:44:52.675] at createDescriptor.next (<anonymous>)
[21:44:52.675]
[21:44:52.676] Import trace for requested module:
[21:44:52.676] ./node_modules/next/dist/pages/\_error.js
[21:44:52.676]
[21:44:52.676] ./node_modules/next/dist/client/components/forbidden-error.js
[21:44:52.676] Error: Cannot find module '@babel/plugin-syntax-import-attributes'
[21:44:52.676] Require stack:
[21:44:52.676] - /vercel/path1/node_modules/next/dist/compiled/babel/bundle.js
[21:44:52.676] - /vercel/path1/node_modules/next/dist/compiled/babel/code-frame.js
[21:44:52.676] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/shared.js
[21:44:52.677] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/middleware-webpack.js
[21:44:52.677] - /vercel/path1/node_modules/next/dist/server/patch-error-inspect.js
[21:44:52.677] - /vercel/path1/node_modules/next/dist/server/node-environment-extensions/error-inspect.js
[21:44:52.677] - /vercel/path1/node_modules/next/dist/server/node-environment.js
[21:44:52.677] - /vercel/path1/node_modules/next/dist/build/utils.js
[21:44:52.677] - /vercel/path1/node_modules/next/dist/build/swc/options.js
[21:44:52.677] - /vercel/path1/node_modules/next/dist/build/swc/index.js
[21:44:52.677] - /vercel/path1/node_modules/next/dist/build/analysis/parse-module.js
[21:44:52.678] - /vercel/path1/node_modules/next/dist/build/analysis/get-page-static-info.js
[21:44:52.678] - /vercel/path1/node_modules/next/dist/build/index.js
[21:44:52.678] - /vercel/path1/node_modules/next/dist/cli/next-build.js
[21:44:52.678]
[21:44:52.678] Make sure that all the Babel plugins and presets you are using
[21:44:52.678] are defined as dependencies or devDependencies in your package.json
[21:44:52.678] file. It's possible that the missing plugin is loaded by a preset
[21:44:52.678] you are using that forgot to add the plugin to its dependencies: you
[21:44:52.678] can workaround this problem by explicitly adding the missing package
[21:44:52.678] to your top-level package.json.
[21:44:52.678]
[21:44:52.679] at Function.<anonymous> (node:internal/modules/cjs/loader:1225:15)
[21:44:52.679] at /vercel/path1/node_modules/next/dist/server/require-hook.js:55:36
[21:44:52.679] at resolve (node:internal/modules/helpers:146:19)
[21:44:52.679] at tryRequireResolve (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:121752)
[21:44:52.679] at resolveStandardizedNameForRequire (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122104)
[21:44:52.679] at resolveStandardizedName (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122510)
[21:44:52.679] at loadPlugin (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:119860)
[21:44:52.679] at loadPlugin.next (<anonymous>)
[21:44:52.679] at createDescriptor (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:105297)
[21:44:52.680] at createDescriptor.next (<anonymous>)
[21:44:52.680]
[21:44:52.680] Import trace for requested module:
[21:44:52.680] ./node_modules/next/dist/client/components/forbidden-error.js
[21:44:52.680]
[21:44:52.680] ./node_modules/next/dist/client/components/unauthorized-error.js
[21:44:52.680] Error: Cannot find module '@babel/plugin-syntax-import-attributes'
[21:44:52.680] Require stack:
[21:44:52.680] - /vercel/path1/node_modules/next/dist/compiled/babel/bundle.js
[21:44:52.680] - /vercel/path1/node_modules/next/dist/compiled/babel/code-frame.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/shared.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/client/components/react-dev-overlay/server/middleware-webpack.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/server/patch-error-inspect.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/server/node-environment-extensions/error-inspect.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/server/node-environment.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/build/utils.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/build/swc/options.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/build/swc/index.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/build/analysis/parse-module.js
[21:44:52.681] - /vercel/path1/node_modules/next/dist/build/analysis/get-page-static-info.js
[21:44:52.682] - /vercel/path1/node_modules/next/dist/build/index.js
[21:44:52.682] - /vercel/path1/node_modules/next/dist/cli/next-build.js
[21:44:52.682]
[21:44:52.682] Make sure that all the Babel plugins and presets you are using
[21:44:52.682] are defined as dependencies or devDependencies in your package.json
[21:44:52.682] file. It's possible that the missing plugin is loaded by a preset
[21:44:52.682] you are using that forgot to add the plugin to its dependencies: you
[21:44:52.682] can workaround this problem by explicitly adding the missing package
[21:44:52.682] to your top-level package.json.
[21:44:52.682]
[21:44:52.683] at Function.<anonymous> (node:internal/modules/cjs/loader:1225:15)
[21:44:52.683] at /vercel/path1/node_modules/next/dist/server/require-hook.js:55:36
[21:44:52.683] at resolve (node:internal/modules/helpers:146:19)
[21:44:52.683] at tryRequireResolve (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:121752)
[21:44:52.683] at resolveStandardizedNameForRequire (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122104)
[21:44:52.683] at resolveStandardizedName (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:122510)
[21:44:52.683] at loadPlugin (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:119860)
[21:44:52.683] at loadPlugin.next (<anonymous>)
[21:44:52.683] at createDescriptor (/vercel/path1/node_modules/next/dist/compiled/babel/bundle.js:1:105297)
[21:44:52.683] at createDescriptor.next (<anonymous>)
[21:44:52.684]
[21:44:52.684] Import trace for requested module:
[21:44:52.684] ./node_modules/next/dist/client/components/unauthorized-error.js
[21:44:52.694]
[21:44:52.694]
[21:44:52.694] > Build failed because of webpack errors
[21:44:52.757] Error: Command "chmod +x scripts/vercel-build.sh && ./scripts/vercel-build.sh" exited with 1
[21:44:53.037]
