# Vercel Build Logs

## 2025-03-01

[20:52:26.992] Running build in Washington, D.C., USA (East) – iad1
[20:52:27.097] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 9d5767d)
[20:52:27.206] Previous build caches not available
[20:52:27.367] Cloning completed: 270.000ms
[20:52:27.782] Running "vercel build"
[20:52:28.158] Vercel CLI 41.2.2
[20:52:28.451] Running "install" command: `npm install`...
[20:52:32.237] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[20:52:33.075] npm warn deprecated npmlog@5.0.1: This package is no longer supported.
[20:52:33.749] npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
[20:52:34.391] npm warn deprecated gauge@3.0.2: This package is no longer supported.
[20:52:34.496] npm warn deprecated domexception@4.0.0: Use your platform's native DOMException instead
[20:52:35.036] npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
[20:52:35.153] npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
[20:52:35.230] npm warn deprecated @types/testing-library__jest-dom@6.0.0: This is a stub types definition. @testing-library/jest-dom provides its own type definitions, so you do not need this installed.
[20:52:37.350] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[20:52:37.450] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[20:52:37.620] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[20:52:37.826] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[20:52:38.112] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[20:52:57.928]
[20:52:57.929] added 1357 packages, and audited 1358 packages in 29s
[20:52:57.929]
[20:52:57.929] 237 packages are looking for funding
[20:52:57.929] run `npm fund` for details
[20:52:57.934]
[20:52:57.934] 3 moderate severity vulnerabilities
[20:52:57.934]
[20:52:57.934] To address all issues (including breaking changes), run:
[20:52:57.934] npm audit fix --force
[20:52:57.934]
[20:52:57.934] Run `npm audit` for details.
[20:52:58.146] Detected Next.js version: 15.1.7
[20:52:58.147] Running "npm run build"
[20:52:58.364]
[20:52:58.365] > nextjs-app@0.1.0 build
[20:52:58.365] > prisma generate && next build
[20:52:58.365]
[20:52:59.017] Prisma schema loaded from prisma/schema.prisma
[20:52:59.650]
[20:52:59.650] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 210ms
[20:52:59.650]
[20:52:59.650] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[20:52:59.650]
[20:52:59.650] Tip: Want to turn off tips and other hints? <https://pris.ly/tip-4-nohints>
[20:52:59.650]
[20:53:00.435] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[20:53:00.435] This information is used to shape Next.js' roadmap and prioritize features.
[20:53:00.435] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[20:53:00.435] <https://nextjs.org/telemetry>
[20:53:00.435]
[20:53:00.792] ▲ Next.js 15.1.7
[20:53:00.792]
[20:53:00.809] Creating an optimized production build ...
[20:53:01.070] Disabled SWC as replacement for Babel because of custom Babel configuration ".babelrc" <https://nextjs.org/docs/messages/swc-disabled>
[20:53:01.758] Using external babel configuration from /vercel/path1/.babelrc
[20:53:23.902] Failed to compile.
[20:53:23.902]
[20:53:23.902] ./src/app/layout.tsx:2:1
[20:53:23.902] Syntax error: "next/font" requires SWC although Babel is being used due to a custom babel config being present.
[20:53:23.902] Read more: <https://nextjs.org/docs/messages/babel-font-loader-conflict>
[20:53:23.902]
[20:53:23.903]
[20:53:23.903] > Build failed because of webpack errors
[20:53:23.964] Error: Command "npm run build" exited with 1

## 2025-03-01 - Fix for Babel and SWC Conflict

The Vercel deployment was failing due to a conflict between Next.js font loading (which requires SWC) and a custom Babel configuration.

Changes made to fix the issue:

1. Moved Babel configuration from `.babelrc` to a test-specific `.babelrc.test.js` file
2. Updated Jest configuration to use the test-specific Babel config
3. Converted `next.config.ts` to `next.config.js` for better compatibility

This should allow Next.js to use its SWC compiler for builds while still maintaining the custom Babel configuration for tests.
