# Vercel Build Logs

## 2025-03-01

[03:22:34.627] Running build in Washington, D.C., USA (East) – iad1
[03:22:34.730] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 7a9a521)
[03:22:35.072] Cloning completed: 335.000ms
[03:22:43.361] Restored build cache from previous deployment (AripFmzF58M8je5VfGD7TuuveEU2)
[03:22:43.437] Running "vercel build"
[03:22:44.415] Vercel CLI 41.2.2
[03:22:44.954] Running "install" command: `npm install`...
[03:22:48.765]
[03:22:48.765] changed 1 package, and audited 1364 packages in 4s
[03:22:48.765]
[03:22:48.765] 240 packages are looking for funding
[03:22:48.766] run `npm fund` for details
[03:22:48.770]
[03:22:48.770] 3 moderate severity vulnerabilities
[03:22:48.770]
[03:22:48.770] To address all issues (including breaking changes), run:
[03:22:48.770] npm audit fix --force
[03:22:48.770]
[03:22:48.770] Run `npm audit` for details.
[03:22:48.949] Detected Next.js version: 15.1.7
[03:22:48.949] Running "npm run build"
[03:22:49.082]
[03:22:49.082] > nextjs-app@0.1.0 build
[03:22:49.082] > prisma generate && next build
[03:22:49.082]
[03:22:50.840] Prisma schema loaded from prisma/schema.prisma
[03:22:51.631]
[03:22:51.632] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 283ms
[03:22:51.632]
[03:22:51.632] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[03:22:51.632]
[03:22:51.632] Tip: Want to react to database changes in your app as they happen? Discover how with Pulse: <https://pris.ly/tip-1-pulse>
[03:22:51.632]
[03:22:52.494] ▲ Next.js 15.1.7
[03:22:52.494]
[03:22:52.573] Creating an optimized production build ...
[03:23:12.156] Collecting page data ...
[03:23:16.200] Generating static pages (0/46) ...
[03:23:17.279] ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/auth/error". Read more: <https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout>
[03:23:17.279] at a (/vercel/path1/.next/server/chunks/1164.js:1:26515)
[03:23:17.279] at f (/vercel/path1/.next/server/chunks/1164.js:1:43111)
[03:23:17.279] at d (/vercel/path1/.next/server/app/auth/error/page.js:1:2669)
[03:23:17.279] at nO (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:45959)
[03:23:17.279] at nI (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:47734)
[03:23:17.279] at nL (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:65533)
[03:23:17.279] at nN (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:63164)
[03:23:17.279] at n$ (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:46311)
[03:23:17.279] at nI (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:47780)
[03:23:17.279] at nI (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:62515)
[03:23:17.279] Error occurred prerendering page "/auth/error". Read more: <https://nextjs.org/docs/messages/prerender-error>
[03:23:17.279] Export encountered an error on /auth/error/page: /auth/error, exiting the build.
[03:23:17.280] Generating static pages (11/46)
[03:23:17.280] Generating static pages (22/46)
[03:23:17.286] ⨯ Next.js build worker exited with code: 1 and signal: null
[03:23:17.339] Error: Command "npm run build" exited with 1
[03:23:17.949]
