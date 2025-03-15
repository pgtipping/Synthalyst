# Vercel Build Logs

[20:01:25.043] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: a635bd5)
[20:01:26.253] Cloning completed: 1.209s
[20:01:35.240] Restored build cache from previous deployment (7uGTYtEyaXWaXhF1ojVUUA9ri2pa)
[20:01:35.331] Running build in Washington, D.C., USA (East) – iad1
[20:01:35.913] Running "vercel build"
[20:01:36.276] Vercel CLI 41.3.2
[20:01:37.075] Running "install" command: `npm install`...
[20:01:45.768]
[20:01:45.769] > nextjs-app@0.1.0 postinstall
[20:01:45.769] > prisma generate
[20:01:45.769]
[20:01:47.701] Prisma schema loaded from prisma/schema.prisma
[20:01:48.967]
[20:01:48.968] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 658ms
[20:01:48.968]
[20:01:48.969] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[20:01:48.969]
[20:01:48.969] Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: https://pris.ly/orm/survey/release-5-22
[20:01:48.969]
[20:01:49.178]
[20:01:49.178] added 105 packages, changed 11 packages, and audited 1904 packages in 12s
[20:01:49.179]
[20:01:49.179] 392 packages are looking for funding
[20:01:49.179] run `npm fund` for details
[20:01:49.198]
[20:01:49.198] 9 vulnerabilities (1 moderate, 8 high)
[20:01:49.198]
[20:01:49.198] To address issues that do not require attention, run:
[20:01:49.198] npm audit fix
[20:01:49.198]
[20:01:49.199] To address all issues possible (including breaking changes), run:
[20:01:49.199] npm audit fix --force
[20:01:49.199]
[20:01:49.199] Some issues need review, and may require choosing
[20:01:49.199] a different dependency.
[20:01:49.199]
[20:01:49.199] Run `npm audit` for details.
[20:01:49.240] Detected Next.js version: 15.2.1
[20:01:49.244] Running "prisma generate && node scripts/handle-db-build.js && next build"
[20:01:49.677] Prisma schema loaded from prisma/schema.prisma
[20:01:50.733]
[20:01:50.733] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 557ms
[20:01:50.734]
[20:01:50.734] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[20:01:50.734]
[20:01:50.734] Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: https://pris.ly/orm/survey/release-5-22
[20:01:50.734]
[20:01:50.785] ┌─────────────────────────────────────────────────────────┐
[20:01:50.785] │ Update available 6.4.1 -> 6.5.0 │
[20:01:50.785] │ Run the following to update │
[20:01:50.785] │ npm i --save-dev prisma@latest │
[20:01:50.786] │ npm i @prisma/client@latest │
[20:01:50.786] └─────────────────────────────────────────────────────────┘
[20:01:50.979] Build environment detected, creating mock Prisma client...
[20:01:50.981] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[20:01:50.981] Database handling for build complete
[20:01:53.311] ▲ Next.js 15.2.1
[20:01:53.312] - Experiments (use with caution):
[20:01:53.312] ✓ optimizeCss
[20:01:53.312]
[20:01:53.397] Creating an optimized production build ...
[20:01:53.743] Using tsconfig file: tsconfig.typecheck.json
[20:01:53.952] Disabled SWC as replacement for Babel because of custom Babel configuration "babel.config.js" https://nextjs.org/docs/messages/swc-disabled
[20:01:55.571] Using external babel configuration from /vercel/path1/babel.config.js
[20:02:34.802] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/xlsx/xlsx.mjs as it exceeds the max of 500KB.
[20:02:54.167] [BABEL] Note: The code generator has deoptimised the styling of /vercel/path1/node_modules/react-pdftotext/node_modules/pdfjs-dist/build/pdf.mjs as it exceeds the max of 500KB.
[20:03:34.916] Failed to compile.
[20:03:34.917]
[20:03:34.917] ./src/app/layout.tsx:3:1
[20:03:34.917] Syntax error: "next/font" requires SWC although Babel is being used due to a custom babel config being present.
[20:03:34.918] Read more: https://nextjs.org/docs/messages/babel-font-loader-conflict
[20:03:34.922]
[20:03:34.922] ./node_modules/next/dist/esm/server/app-render/after-task-async-storage.external.js:2:114
[20:03:34.922] Syntax error: Support for the experimental syntax 'importAttributes' isn't currently enabled (2:115):
[20:03:34.922]
[20:03:34.923] 1 | // Share the instance module in the next-shared layer
[20:03:34.923] > 2 | import { afterTaskAsyncStorageInstance as afterTaskAsyncStorage } from './after-task-async-storage-instance' with {
[20:03:34.927] | ^
[20:03:34.928] 3 | 'turbopack-transition': 'next-shared'
[20:03:34.929] 4 | };
[20:03:34.929] 5 | export { afterTaskAsyncStorage };
[20:03:34.929]
[20:03:34.929] Add @babel/plugin-syntax-import-attributes (https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-attributes) to the 'plugins' section of your Babel config to enable parsing.
[20:03:34.929]
[20:03:34.929] ./node_modules/next/dist/esm/server/app-render/work-async-storage.external.js:2:78
[20:03:34.929] Syntax error: Support for the experimental syntax 'importAttributes' isn't currently enabled (2:79):
[20:03:34.929]
[20:03:34.929] 1 | // Share the instance module in the next-shared layer
[20:03:34.930] > 2 | import { workAsyncStorageInstance } from './work-async-storage-instance' with {
[20:03:34.930] | ^
[20:03:34.930] 3 | 'turbopack-transition': 'next-shared'
[20:03:34.930] 4 | };
[20:03:34.930] 5 | export { workAsyncStorageInstance as workAsyncStorage };
[20:03:34.930]
[20:03:34.930] Add @babel/plugin-syntax-import-attributes (https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-attributes) to the 'plugins' section of your Babel config to enable parsing.
[20:03:34.930]
[20:03:34.930] ./node_modules/next/dist/esm/server/app-render/work-unit-async-storage.external.js:2:87
[20:03:34.931] Syntax error: Support for the experimental syntax 'importAttributes' isn't currently enabled (2:88):
[20:03:34.931]
[20:03:34.931] 1 | // Share the instance module in the next-shared layer
[20:03:34.931] > 2 | import { workUnitAsyncStorageInstance } from './work-unit-async-storage-instance' with {
[20:03:34.931] | ^
[20:03:34.931] 3 | 'turbopack-transition': 'next-shared'
[20:03:34.931] 4 | };
[20:03:34.931] 5 | export { workUnitAsyncStorageInstance as workUnitAsyncStorage };
[20:03:34.932]
[20:03:34.932] Add @babel/plugin-syntax-import-attributes (https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-attributes) to the 'plugins' section of your Babel config to enable parsing.
[20:03:34.932]
[20:03:34.932] ./node_modules/next/dist/esm/server/app-render/after-task-async-storage.external.js:2:114
[20:03:34.932] Syntax error: Support for the experimental syntax 'importAttributes' isn't currently enabled (2:115):
[20:03:34.932]
[20:03:34.932] 1 | // Share the instance module in the next-shared layer
[20:03:34.932] > 2 | import { afterTaskAsyncStorageInstance as afterTaskAsyncStorage } from './after-task-async-storage-instance' with {
[20:03:34.933] | ^
[20:03:34.933] 3 | 'turbopack-transition': 'next-shared'
[20:03:34.933] 4 | };
[20:03:34.933] 5 | export { afterTaskAsyncStorage };
[20:03:34.933]
[20:03:34.933] Add @babel/plugin-syntax-import-attributes (https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-attributes) to the 'plugins' section of your Babel config to enable parsing.
[20:03:34.933]
[20:03:34.934]
[20:03:34.934] > Build failed because of webpack errors
[20:03:35.078] Error: Command "prisma generate && node scripts/handle-db-build.js && next build" exited with 1
[20:03:36.421]
