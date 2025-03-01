# Vercel Build Logs

## 2025-03-01

[17:22:30.495] Running build in Washington, D.C., USA (East) – iad1
[17:22:30.606] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 59070f4)
[17:22:30.758] Previous build caches not available
[17:22:31.627] Cloning completed: 1.021s
[17:22:32.034] Running "vercel build"
[17:22:32.429] Vercel CLI 41.2.2
[17:22:32.861] Running "install" command: `npm install`...
[17:22:36.709] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[17:22:37.586] npm warn deprecated npmlog@5.0.1: This package is no longer supported.
[17:22:38.315] npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
[17:22:38.913] npm warn deprecated gauge@3.0.2: This package is no longer supported.
[17:22:39.093] npm warn deprecated domexception@4.0.0: Use your platform's native DOMException instead
[17:22:39.569] npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
[17:22:39.648] npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
[17:22:39.868] npm warn deprecated @types/testing-library__jest-dom@6.0.0: This is a stub types definition. @testing-library/jest-dom provides its own type definitions, so you do not need this installed.
[17:22:42.176] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[17:22:42.302] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[17:22:42.491] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[17:22:42.695] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[17:22:43.001] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[17:23:04.217]
[17:23:04.217] added 1357 packages, and audited 1358 packages in 31s
[17:23:04.217]
[17:23:04.218] 237 packages are looking for funding
[17:23:04.218] run `npm fund` for details
[17:23:04.222]
[17:23:04.222] 3 moderate severity vulnerabilities
[17:23:04.222]
[17:23:04.222] To address all issues (including breaking changes), run:
[17:23:04.222] npm audit fix --force
[17:23:04.222]
[17:23:04.222] Run `npm audit` for details.
[17:23:04.277] Detected Next.js version: 15.1.7
[17:23:04.278] Running "npm run build"
[17:23:04.803]
[17:23:04.804] > nextjs-app@0.1.0 build
[17:23:04.804] > prisma generate && next build
[17:23:04.804]
[17:23:05.459] Prisma schema loaded from prisma/schema.prisma
[17:23:06.125]
[17:23:06.125] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 223ms
[17:23:06.126]
[17:23:06.126] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[17:23:06.126]
[17:23:06.126] Tip: Interested in query caching in just a few lines of code? Try Accelerate today! <https://pris.ly/tip-3-accelerate>
[17:23:06.126]
[17:23:06.944] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[17:23:06.944] This information is used to shape Next.js' roadmap and prioritize features.
[17:23:06.944] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[17:23:06.944] <https://nextjs.org/telemetry>
[17:23:06.944]
[17:23:07.316] ▲ Next.js 15.1.7
[17:23:07.317]
[17:23:07.346] Creating an optimized production build ...
[17:23:07.589] Disabled SWC as replacement for Babel because of custom Babel configuration ".babelrc" <https://nextjs.org/docs/messages/swc-disabled>
[17:23:08.267] Using external babel configuration from /vercel/path1/.babelrc
[17:23:31.471] Failed to compile.
[17:23:31.471]
[17:23:31.471] ./src/app/interview-questions/components/InterviewQuestionsForm.tsx
[17:23:31.471] Error: [31mx[0m You're importing a component that needs `useState`. This React hook only works in a client component. To fix, mark the file (or its parent) with the `"use client"` directive.
[17:23:31.471] [31m|[0m
[17:23:31.471] [31m|[0m Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
[17:23:31.471] [31m|[0m
[17:23:31.471] [31m|[0m
[17:23:31.471] ,-[[36;1;4m/vercel/path1/src/app/interview-questions/components/InterviewQuestionsForm.tsx[0m:1:1]
[17:23:31.471] [2m1[0m | import { useState } from "react";
[17:23:31.472] : [35;1m ^^^^^^^^[0m
[17:23:31.472] [2m2[0m | import { useForm } from "react-hook-form";
[17:23:31.472] [2m3[0m | import { zodResolver } from "@hookform/resolvers/zod";
[17:23:31.472] [2m4[0m | import \* as z from "zod";
[17:23:31.472] `----
[17:23:31.472]
[17:23:31.472] Import trace for requested module:
[17:23:31.472] ./src/app/interview-questions/components/InterviewQuestionsForm.tsx
[17:23:31.472] ./src/app/interview-questions/page.tsx
[17:23:31.472]
[17:23:31.472] ./src/app/layout.tsx:2:1
[17:23:31.472] Syntax error: "next/font" requires SWC although Babel is being used due to a custom babel config being present.
[17:23:31.472] Read more: https://nextjs.org/docs/messages/babel-font-loader-conflict
[17:23:31.472]
[17:23:31.472] ./node_modules/next/dist/esm/server/app-render/after-task-async-storage.external.js:2:114
[17:23:31.472] Syntax error: Support for the experimental syntax 'importAttributes' isn't currently enabled (2:115):
[17:23:31.472]
[17:23:31.472] 1 | // Share the instance module in the next-shared layer
[17:23:31.472] > 2 | import { afterTaskAsyncStorageInstance as afterTaskAsyncStorage } from './after-task-async-storage-instance' with {
[17:23:31.472] | ^
[17:23:31.472] 3 | 'turbopack-transition': 'next-shared'
[17:23:31.472] 4 | };
[17:23:31.472] 5 | export { afterTaskAsyncStorage };
[17:23:31.473]
[17:23:31.473] Add @babel/plugin-syntax-import-attributes (https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-attributes) to the 'plugins' section of your Babel config to enable parsing.
[17:23:31.473]
[17:23:31.473] ./node_modules/next/dist/esm/server/app-render/work-async-storage.external.js:2:78
[17:23:31.473] Syntax error: Support for the experimental syntax 'importAttributes' isn't currently enabled (2:79):
[17:23:31.473]
[17:23:31.473] 1 | // Share the instance module in the next-shared layer
[17:23:31.473] > 2 | import { workAsyncStorageInstance } from './work-async-storage-instance' with {
[17:23:31.473] | ^
[17:23:31.473] 3 | 'turbopack-transition': 'next-shared'
[17:23:31.473] 4 | };
[17:23:31.473] 5 | export { workAsyncStorageInstance as workAsyncStorage };
[17:23:31.473]
[17:23:31.473] Add @babel/plugin-syntax-import-attributes (https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-attributes) to the 'plugins' section of your Babel config to enable parsing.
[17:23:31.473]
[17:23:31.473] ./node_modules/next/dist/esm/server/app-render/work-unit-async-storage.external.js:2:87
[17:23:31.473] Syntax error: Support for the experimental syntax 'importAttributes' isn't currently enabled (2:88):
[17:23:31.473]
[17:23:31.473] 1 | // Share the instance module in the next-shared layer
[17:23:31.473] > 2 | import { workUnitAsyncStorageInstance } from './work-unit-async-storage-instance' with {
[17:23:31.473] | ^
[17:23:31.473] 3 | 'turbopack-transition': 'next-shared'
[17:23:31.473] 4 | };
[17:23:31.473] 5 | export { workUnitAsyncStorageInstance as workUnitAsyncStorage };
[17:23:31.473]
[17:23:31.473] Add @babel/plugin-syntax-import-attributes (https://github.com/babel/babel/tree/main/packages/babel-plugin-syntax-import-attributes) to the 'plugins' section of your Babel config to enable parsing.
[17:23:31.473]
[17:23:31.473]
[17:23:31.474] > Build failed because of webpack errors
[17:23:31.535] Error: Command "npm run build" exited with 1
[17:23:32.019]
