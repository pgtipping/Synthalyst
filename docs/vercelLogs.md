# Vercel Build Logs

[15:34:00.148] Running build in Washington, D.C., USA (East) – iad1
[15:34:00.255] Retrieving list of deployment files...
[15:34:00.601] Downloading 649 deployment files...
[15:34:13.455] Restored build cache from previous deployment (3u2PKdQgVLvCsnaSrxYngYBigJXi)
[15:34:14.161] Running "vercel build"
[15:34:14.941] Vercel CLI 41.3.2
[15:34:16.829] Running "install" command: `npm install`...
[15:34:20.133] npm warn deprecated @types/lru-cache@7.10.10: This is a stub types definition. lru-cache provides its own type definitions, so you do not need this installed.
[15:34:20.928] npm warn deprecated critters@0.0.25: Ownership of Critters has moved to the Nuxt team, who will be maintaining the project going forward. If you'd like to keep using Critters, please switch to the actively-maintained fork at <https://github.com/danielroe/beasties>
[15:34:21.104] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[15:34:21.118] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[15:34:31.922]
[15:34:31.922] > nextjs-app@0.1.0 postinstall
[15:34:31.923] > prisma generate
[15:34:31.923]
[15:34:32.509] Environment variables loaded from .env
[15:34:32.513] Prisma schema loaded from prisma/schema.prisma
[15:34:33.707]
[15:34:33.708] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 551ms
[15:34:33.708]
[15:34:33.709] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[15:34:33.709]
[15:34:33.709] Tip: Want real-time updates to your database without manual polling? Discover how with Pulse: <https://pris.ly/tip-0-pulse>
[15:34:33.709]
[15:34:33.911]
[15:34:33.912] added 144 packages, removed 39 packages, changed 42 packages, and audited 1893 packages in 17s
[15:34:33.912]
[15:34:33.912] 393 packages are looking for funding
[15:34:33.913] run `npm fund` for details
[15:34:33.935]
[15:34:33.936] 8 vulnerabilities (1 moderate, 7 high)
[15:34:33.936]
[15:34:33.936] To address issues that do not require attention, run:
[15:34:33.936] npm audit fix
[15:34:33.938]
[15:34:33.940] To address all issues possible (including breaking changes), run:
[15:34:33.940] npm audit fix --force
[15:34:33.940]
[15:34:33.940] Some issues need review, and may require choosing
[15:34:33.940] a different dependency.
[15:34:33.940]
[15:34:33.940] Run `npm audit` for details.
[15:34:34.001] Detected Next.js version: 15.2.1
[15:34:34.003] Running "npx rimraf .next && prisma generate && node scripts/handle-db-build.js && next build"
[15:34:35.020] Environment variables loaded from .env
[15:34:35.023] Prisma schema loaded from prisma/schema.prisma
[15:34:36.244]
[15:34:36.246] ✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 584ms
[15:34:36.246]
[15:34:36.247] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[15:34:36.247]
[15:34:36.247] Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: <https://pris.ly/--optimize>
[15:34:36.247]
[15:34:36.466] Build environment detected, creating mock Prisma client...
[15:34:36.467] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[15:34:36.467] Database handling for build complete
[15:34:37.757] ▲ Next.js 15.2.1
[15:34:37.757] - Environments: .env
[15:34:37.758] - Experiments (use with caution):
[15:34:37.758] ✓ optimizeCss
[15:34:37.758]
[15:34:37.784] Creating an optimized production build ...
[15:34:37.946] Using tsconfig file: tsconfig.typecheck.json
[15:34:38.127] Disabled SWC as replacement for Babel because of custom Babel configuration ".babelrc" <https://nextjs.org/docs/messages/swc-disabled>
[15:34:39.811] Using external babel configuration from /vercel/path1/.babelrc
[15:35:37.506] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/xlsx/xlsx.mjs as it exceeds the max of 500KB.
[15:36:09.643] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/fontkit/dist/main.cjs as it exceeds the max of 500KB.
[15:36:18.640] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/react-pdftotext/node_modules/pdfjs-dist/build/pdf.mjs as it exceeds the max of 500KB.
[15:36:32.928] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/brotli/dec/dictionary-data.js as it exceeds the max of 500KB.
[15:38:00.805] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/xlsx/xlsx.mjs as it exceeds the max of 500KB.
[15:38:37.574] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/@react-pdf/pdfkit/lib/pdfkit.browser.cjs as it exceeds the max of 500KB.
[15:39:04.356] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/fontkit/dist/browser.cjs as it exceeds the max of 500KB.
[15:39:34.568] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/react-pdftotext/node_modules/pdfjs-dist/build/pdf.mjs as it exceeds the max of 500KB.
[15:40:53.337] Failed to compile.
[15:40:53.337]
[15:40:53.337] ./src/app/critical.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!./src/app/critical.css
[15:40:53.338] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[15:40:53.338] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[15:40:53.338] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[15:40:53.338] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[15:40:53.338] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[15:40:53.338] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[15:40:53.338]
[15:40:53.338] Import trace for requested module:
[15:40:53.339] ./src/app/critical.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!./src/app/critical.css
[15:40:53.339] ./src/app/critical.css
[15:40:53.339]
[15:40:53.339] ./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!./src/app/globals.css
[15:40:53.339] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[15:40:53.339] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[15:40:53.339] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[15:40:53.339] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[15:40:53.339] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[15:40:53.340] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[15:40:53.341]
[15:40:53.341] Import trace for requested module:
[15:40:53.341] ./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!./src/app/globals.css
[15:40:53.341] ./src/app/globals.css
[15:40:53.341]
[15:40:53.341] ./src/app/critical.css
[15:40:53.341] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[15:40:53.341] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[15:40:53.341] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[15:40:53.341] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[15:40:53.341] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[15:40:53.341] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[15:40:53.341] at tryRunOrWebpackError (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:316142)
[15:40:53.341] at **webpack_require_module** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131548)
[15:40:53.341] at **nested_webpack_require_161494** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130983)
[15:40:53.341] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131840
[15:40:53.341] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
[15:40:53.341] at done (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14824)
[15:40:53.341] at Hook.eval [as callAsync] (eval at create (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:9224), <anonymous>:15:1)
[15:40:53.341] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130703
[15:40:53.341] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14402)
[15:40:53.341] at timesSync (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:5027)
[15:40:53.341] -- inner error --
[15:40:53.341] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[15:40:53.342] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[15:40:53.342] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[15:40:53.342] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[15:40:53.342] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[15:40:53.342] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[15:40:53.342] at Object.<anonymous> (/vercel/path1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!/vercel/path1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!/vercel/path1/src/app/critical.css:1:7)
[15:40:53.342] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:962742
[15:40:53.342] at Hook.eval [as call] (eval at create (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:9002), <anonymous>:7:1)
[15:40:53.342] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131581
[15:40:53.342] at tryRunOrWebpackError (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:316096)
[15:40:53.342] at **webpack_require_module** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131548)
[15:40:53.342] at **nested_webpack_require_161494** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130983)
[15:40:53.342] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131840
[15:40:53.342] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
[15:40:53.342] at done (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14824)
[15:40:53.342]
[15:40:53.342] Generated code for /vercel/path1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!/vercel/path1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!/vercel/path1/src/app/critical.css
[15:40:53.342]
[15:40:53.342] Import trace for requested module:
[15:40:53.342] ./src/app/critical.css
[15:40:53.342]
[15:40:53.342] ./src/app/globals.css
[15:40:53.342] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[15:40:53.342] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[15:40:53.342] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[15:40:53.342] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[15:40:53.342] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[15:40:53.342] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[15:40:53.342] at tryRunOrWebpackError (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:316142)
[15:40:53.342] at **webpack_require_module** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131548)
[15:40:53.342] at **nested_webpack_require_161494** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130983)
[15:40:53.342] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131840
[15:40:53.342] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
[15:40:53.342] at done (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14824)
[15:40:53.342] at Hook.eval [as callAsync] (eval at create (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:9224), <anonymous>:15:1)
[15:40:53.342] at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:6378)
[15:40:53.342] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130703
[15:40:53.342] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14402)
[15:40:53.342] -- inner error --
[15:40:53.343] Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
[15:40:53.343] at Re (/vercel/path1/node_modules/tailwindcss/dist/lib.js:33:1889)
[15:40:53.343] at LazyResult.runOnRoot (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:329:16)
[15:40:53.343] at LazyResult.runAsync (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:258:26)
[15:40:53.343] at LazyResult.async (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:160:30)
[15:40:53.343] at LazyResult.then (/vercel/path1/node_modules/next/node_modules/postcss/lib/lazy-result.js:404:17)
[15:40:53.343] at Object.<anonymous> (/vercel/path1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!/vercel/path1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!/vercel/path1/src/app/globals.css:1:7)
[15:40:53.343] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:962742
[15:40:53.343] at Hook.eval [as call] (eval at create (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:9002), <anonymous>:7:1)
[15:40:53.343] at Hook.CALL_DELEGATE [as _call] (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:14:6272)
[15:40:53.343] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131581
[15:40:53.343] at tryRunOrWebpackError (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:316096)
[15:40:53.343] at **webpack_require_module** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131548)
[15:40:53.343] at **nested_webpack_require_161494** (/vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:130983)
[15:40:53.343] at /vercel/path1/node_modules/next/dist/compiled/webpack/bundle5.js:29:131840
[15:40:53.355] at symbolIterator (/vercel/path1/node_modules/next/dist/compiled/neo-async/async.js:1:14444)
[15:40:53.355]
[15:40:53.356] Generated code for /vercel/path1/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!/vercel/path1/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[3]!/vercel/path1/src/app/globals.css
[15:40:53.356]
[15:40:53.356] Import trace for requested module:
[15:40:53.356] ./src/app/globals.css
[15:40:53.356]
[15:40:53.357]
[15:40:53.357] > Build failed because of webpack errors
[15:40:53.570] Error: Command "npx rimraf .next && prisma generate && node scripts/handle-db-build.js && next build" exited with 1
[15:40:54.062]
