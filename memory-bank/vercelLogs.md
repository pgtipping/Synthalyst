# Vercel Build Logs

## 2025-03-01

[02:18:54.674] Running build in Washington, D.C., USA (East) – iad1
[02:18:55.222] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: f912c1b)
[02:18:55.509] Cloning completed: 287.000ms
[02:19:03.305] Restored build cache from previous deployment (71sKq7AEJcHtWUmTdk5dLro1fVom)
[02:19:03.443] Running "vercel build"
[02:19:04.378] Vercel CLI 41.2.2
[02:19:05.345] Running "install" command: `npm install`...
[02:19:08.218]
[02:19:08.218] changed 1 package, and audited 1358 packages in 2s
[02:19:08.218]
[02:19:08.219] 237 packages are looking for funding
[02:19:08.219] run `npm fund` for details
[02:19:08.223]
[02:19:08.223] 3 moderate severity vulnerabilities
[02:19:08.223]
[02:19:08.223] To address all issues (including breaking changes), run:
[02:19:08.223] npm audit fix --force
[02:19:08.223]
[02:19:08.223] Run `npm audit` for details.
[02:19:08.265] Detected Next.js version: 15.1.7
[02:19:08.266] Running "npm run build"
[02:19:08.380]
[02:19:08.381] > nextjs-app@0.1.0 build
[02:19:08.381] > prisma generate && next build
[02:19:08.381]
[02:19:08.812] Prisma schema loaded from prisma/schema.prisma
[02:19:09.293]
[02:19:09.294] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 215ms
[02:19:09.294]
[02:19:09.294] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[02:19:09.294]
[02:19:09.294] Tip: Interested in query caching in just a few lines of code? Try Accelerate today! <https://pris.ly/tip-3-accelerate>
[02:19:09.294]
[02:19:10.125] ▲ Next.js 15.1.7
[02:19:10.125]
[02:19:10.202] Creating an optimized production build ...
[02:19:18.901] ✓ Compiled successfully
[02:19:18.904] Skipping linting
[02:19:18.904] Checking validity of types ...
[02:19:31.108] Collecting page data ...
[02:19:35.282] Generating static pages (0/45) ...
[02:19:36.383] ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/auth/signup". Read more: <https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout>
[02:19:36.383] at a (/vercel/path1/.next/server/chunks/1164.js:1:26515)
[02:19:36.383] at f (/vercel/path1/.next/server/chunks/1164.js:1:43111)
[02:19:36.383] at d (/vercel/path1/.next/server/app/auth/signup/page.js:1:2711)
[02:19:36.383] at nO (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:45959)
[02:19:36.383] at nI (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:47734)
[02:19:36.383] at nL (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:65533)
[02:19:36.383] at nN (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:63164)
[02:19:36.383] at n$ (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:46311)
[02:19:36.383] at nI (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:47780)
[02:19:36.383] at nI (/vercel/path1/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:20:62515)
[02:19:36.383] Error occurred prerendering page "/auth/signup". Read more: <https://nextjs.org/docs/messages/prerender-error>
[02:19:36.383] Export encountered an error on /auth/signup/page: /auth/signup, exiting the build.
[02:19:36.383] Generating static pages (11/45)
[02:19:36.384] Generating static pages (22/45)
[02:19:36.390] ⨯ Next.js build worker exited with code: 1 and signal: null
[02:19:36.438] Error: Command "npm run build" exited with 1
[02:19:36.827]
