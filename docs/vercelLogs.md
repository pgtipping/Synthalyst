# Vercel Build Logs

[17:21:02.392] Running build in Washington, D.C., USA (East) – iad1
[17:21:02.512] Retrieving list of deployment files...
[17:21:03.055] Downloading 653 deployment files...
[17:21:16.492] Restored build cache from previous deployment (3u2PKdQgVLvCsnaSrxYngYBigJXi)
[17:21:17.180] Running "vercel build"
[17:21:18.112] Vercel CLI 41.3.2
[17:21:21.976] Running "install" command: `npm install`...
[17:21:28.461] npm warn deprecated @types/lru-cache@7.10.10: This is a stub types definition. lru-cache provides its own type definitions, so you do not need this installed.
[17:21:28.641] npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at https://github.com/danielroe/beasties
[17:21:29.292] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[17:21:29.323] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[17:21:40.673]
[17:21:40.674] > nextjs-app@0.1.0 postinstall
[17:21:40.674] > prisma generate
[17:21:40.675]
[17:21:41.244] Environment variables loaded from .env
[17:21:41.246] Prisma schema loaded from prisma/schema.prisma
[17:21:42.507]
[17:21:42.510] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 599ms
[17:21:42.511]
[17:21:42.511] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[17:21:42.512]
[17:21:42.512] Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
[17:21:42.512]
[17:21:42.687]
[17:21:42.688] added 152 packages, removed 37 packages, changed 43 packages, and audited 1903 packages in 19s
[17:21:42.688]
[17:21:42.688] 397 packages are looking for funding
[17:21:42.688] run `npm fund` for details
[17:21:42.708]
[17:21:42.708] 8 vulnerabilities (1 moderate, 7 high)
[17:21:42.708]
[17:21:42.708] To address issues that do not require attention, run:
[17:21:42.708] npm audit fix
[17:21:42.708]
[17:21:42.708] To address all issues possible (including breaking changes), run:
[17:21:42.711] npm audit fix --force
[17:21:42.711]
[17:21:42.711] Some issues need review, and may require choosing
[17:21:42.711] a different dependency.
[17:21:42.711]
[17:21:42.711] Run `npm audit` for details.
[17:21:42.752] Detected Next.js version: 15.2.1
[17:21:42.753] Running "npx rimraf .next && prisma generate && node scripts/handle-db-build.js && next build"
[17:21:43.796] Environment variables loaded from .env
[17:21:43.798] Prisma schema loaded from prisma/schema.prisma
[17:21:44.978]
[17:21:44.978] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 563ms
[17:21:44.979]
[17:21:44.979] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[17:21:44.979]
[17:21:44.979] Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: https://pris.ly/orm/survey/release-5-22
[17:21:44.980]
[17:21:45.201] Build environment detected, creating mock Prisma client...
[17:21:45.201] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[17:21:45.201] Database handling for build complete
[17:21:45.851] ▲ Next.js 15.2.1
[17:21:45.852] - Environments: .env
[17:21:45.852] - Experiments (use with caution):
[17:21:45.852] ✓ optimizeCss
[17:21:45.852]
[17:21:45.881] Creating an optimized production build ...
[17:21:46.019] Using tsconfig file: tsconfig.typecheck.json
[17:21:46.194] Disabled SWC as replacement for Babel because of custom Babel configuration ".babelrc" https://nextjs.org/docs/messages/swc-disabled
[17:21:47.774] Using external babel configuration from /vercel/path1/.babelrc
[17:22:40.068] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/xlsx/xlsx.mjs as it exceeds the max of 500KB.
[17:23:03.150] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/fontkit/dist/main.cjs as it exceeds the max of 500KB.
[17:23:16.504] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/react-pdftotext/node_modules/pdfjs-dist/build/pdf.mjs as it exceeds the max of 500KB.
[17:23:27.538] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/brotli/dec/dictionary-data.js as it exceeds the max of 500KB.
[17:24:36.796] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/xlsx/xlsx.mjs as it exceeds the max of 500KB.
[17:25:12.521] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/@react-pdf/pdfkit/lib/pdfkit.browser.cjs as it exceeds the max of 500KB.
[17:25:29.381] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/fontkit/dist/browser.cjs as it exceeds the max of 500KB.
[17:26:02.353] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/react-pdftotext/node_modules/pdfjs-dist/build/pdf.mjs as it exceeds the max of 500KB.
[17:26:58.888] Failed to compile.
[17:26:58.889]
[17:26:58.889] ./src/app/critical.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!./src/app/critical.css
[17:26:58.890] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[17:26:58.890] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[17:26:58.890] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[17:26:58.890] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[17:26:58.890] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[17:26:58.890] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[17:26:58.890]
[17:26:58.891] Import trace for requested module:
[17:26:58.891] ./src/app/critical.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!./src/app/critical.css
[17:26:58.891] ./src/app/critical.css
[17:26:58.891]
[17:26:58.891] ./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!./src/app/globals.css
[17:26:58.891] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[17:26:58.891] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[17:26:58.891] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[17:26:58.892] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[17:26:58.892] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[17:26:58.892] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[17:26:58.892]
[17:26:58.892] Import trace for requested module:
[17:26:58.892] ./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!./src/app/globals.css
[17:26:58.892] ./src/app/globals.css
[17:26:58.893]
[17:26:58.893] ./src/app/critical.css
[17:26:58.893] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[17:26:58.901] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[17:26:58.901] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[17:26:58.901] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[17:26:58.901] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[17:26:58.902] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[17:26:58.902] at tryRunOrWebpackError (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:316142)
[17:26:58.902] at **webpack_require_module** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131548)
[17:26:58.902] at **nested_webpack_require_161494** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130983)
[17:26:58.902] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131840
[17:26:58.902] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
[17:26:58.902] at done (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14824)
[17:26:58.903] at Hook.eval [as callAsync] (eval at create (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:9224), <anonymous>:15:1)
[17:26:58.903] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130703
[17:26:58.910] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14402)
[17:26:58.910] at timesSync (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:5027)
[17:26:58.910] -- inner error --
[17:26:58.911] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[17:26:58.911] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[17:26:58.911] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[17:26:58.911] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[17:26:58.911] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[17:26:58.911] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[17:26:58.912] at Object.<anonymous> (/vercel/path1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!/vercel/path1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!/vercel/path1/src/app/critical.css:1:7)
[17:26:58.912] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:962742
[17:26:58.912] at Hook.eval [as call] (eval at create (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:9002), <anonymous>:7:1)
[17:26:58.913] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131581
[17:26:58.913] at tryRunOrWebpackError (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:316096)
[17:26:58.913] at **webpack_require_module** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131548)
[17:26:58.913] at **nested_webpack_require_161494** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130983)
[17:26:58.913] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131840
[17:26:58.913] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
[17:26:58.913] at done (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14824)
[17:26:58.913]
[17:26:58.913] Generated code for /vercel/path1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!/vercel/path1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!/vercel/path1/src/app/critical.css
[17:26:58.913]
[17:26:58.913] Import trace for requested module:
[17:26:58.913] ./src/app/critical.css
[17:26:58.913]
[17:26:58.913] ./src/app/globals.css
[17:26:58.913] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[17:26:58.913] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[17:26:58.913] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[17:26:58.913] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[17:26:58.913] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[17:26:58.913] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[17:26:58.913] at tryRunOrWebpackError (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:316142)
[17:26:58.913] at **webpack_require_module** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131548)
[17:26:58.913] at **nested_webpack_require_161494** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130983)
[17:26:58.913] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131840
[17:26:58.914] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
[17:26:58.914] at done (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14824)
[17:26:58.914] at Hook.eval [as callAsync] (eval at create (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:9224), <anonymous>:15:1)
[17:26:58.914] at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:6378)
[17:26:58.914] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130703
[17:26:58.914] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14402)
[17:26:58.914] -- inner error --
[17:26:58.914] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[17:26:58.914] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[17:26:58.914] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[17:26:58.914] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[17:26:58.914] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[17:26:58.914] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[17:26:58.914] at Object.<anonymous> (/vercel/path1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!/vercel/path1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!/vercel/path1/src/app/globals.css:1:7)
[17:26:58.914] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:962742
[17:26:58.914] at Hook.eval [as call] (eval at create (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:9002), <anonymous>:7:1)
[17:26:58.915] at Hook.CALL_DELEGATE [as _call] (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:6272)
[17:26:58.916] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131581
[17:26:58.916] at tryRunOrWebpackError (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:316096)
[17:26:58.916] at **webpack_require_module** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131548)
[17:26:58.916] at **nested_webpack_require_161494** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130983)
[17:26:58.916] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131840
[17:26:58.917] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
[17:26:58.917]
[17:26:58.922] Generated code for /vercel/path1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!/vercel/path1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!/vercel/path1/src/app/globals.css
[17:26:58.922]
[17:26:58.922] Import trace for requested module:
[17:26:58.922] ./src/app/globals.css
[17:26:58.922]
[17:26:58.922]
[17:26:58.923] > Build failed because of webpack errors
[17:26:58.923] Error: Command "npx rimraf .next && prisma generate && node scripts/handle-db-build.js && next build" exited with 1
[17:26:59.439]
