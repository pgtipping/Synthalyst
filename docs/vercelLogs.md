# Vercel Build Logs

## 2025-03-13

[21:11:38.424] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: f9183f2)
[21:11:38.915] Cloning completed: 491.000ms
[21:11:48.657] Restored build cache from previous deployment (5GRPCS47ReQ1nf4h5zSBX7SP4E2Y)
[21:11:48.776] Running build in Washington, D.C., USA (East) – iad1
[21:11:49.271] Running "vercel build"
[21:11:49.616] Vercel CLI 41.3.2
[21:11:49.985] Running "install" command: `npm install`...
[21:11:55.404]
[21:11:55.405] > nextjs-app@0.1.0 postinstall
[21:11:55.405] > prisma generate
[21:11:55.405]
[21:11:55.905] Prisma schema loaded from prisma/schema.prisma
[21:11:56.926]
[21:11:56.926] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 514ms
[21:11:56.926]
[21:11:56.926] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[21:11:56.926]
[21:11:56.927] Tip: Want real-time updates to your database without manual polling? Discover how with Pulse: https://pris.ly/tip-0-pulse
[21:11:56.927]
[21:11:57.129]
[21:11:57.129] up to date, audited 1790 packages in 7s
[21:11:57.130]
[21:11:57.130] 386 packages are looking for funding
[21:11:57.130] run `npm fund` for details
[21:11:57.150]
[21:11:57.150] 10 vulnerabilities (2 moderate, 8 high)
[21:11:57.150]
[21:11:57.150] To address issues that do not require attention, run:
[21:11:57.150] npm audit fix
[21:11:57.150]
[21:11:57.150] To address all issues possible (including breaking changes), run:
[21:11:57.150] npm audit fix --force
[21:11:57.151]
[21:11:57.151] Some issues need review, and may require choosing
[21:11:57.151] a different dependency.
[21:11:57.151]
[21:11:57.151] Run `npm audit` for details.
[21:11:57.189] Detected Next.js version: 15.2.1
[21:11:57.192] Running "prisma generate && node scripts/handle-db-build.js && next build"
[21:11:57.572] Prisma schema loaded from prisma/schema.prisma
[21:11:58.428]
[21:11:58.428] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 432ms
[21:11:58.429]
[21:11:58.429] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[21:11:58.429]
[21:11:58.429] Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
[21:11:58.430]
[21:11:58.452] ┌─────────────────────────────────────────────────────────┐
[21:11:58.452] │ Update available 6.4.1 -> 6.5.0 │
[21:11:58.453] │ Run the following to update │
[21:11:58.453] │ npm i --save-dev prisma@latest │
[21:11:58.453] │ npm i @prisma/client@latest │
[21:11:58.453] └─────────────────────────────────────────────────────────┘
[21:11:58.656] Build environment detected, creating mock Prisma client...
[21:11:58.660] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[21:11:58.661] Database handling for build complete
[21:12:00.030] ▲ Next.js 15.2.1
[21:12:00.030] - Experiments (use with caution):
[21:12:00.031] ✓ optimizeCss
[21:12:00.031]
[21:12:00.107] Creating an optimized production build ...
[21:12:39.793] Failed to compile.
[21:12:39.794]
[21:12:39.794] ./src/app/blog/[slug]/page.tsx
[21:12:39.796] Module not found: Can't resolve '@/components/ShareButtons'
[21:12:39.796]
[21:12:39.796] https://nextjs.org/docs/messages/module-not-found
[21:12:39.796]
[21:12:39.796] ./src/app/blog/[slug]/page.tsx
[21:12:39.796] Module not found: Can't resolve '@/components/CommentSection'
[21:12:39.796]
[21:12:39.796] https://nextjs.org/docs/messages/module-not-found
[21:12:39.797]
[21:12:39.797] ./src/app/blog/[slug]/page.tsx
[21:12:39.797] Module not found: Can't resolve '@/components/RelatedPosts'
[21:12:39.797]
[21:12:39.797] https://nextjs.org/docs/messages/module-not-found
[21:12:39.797]
[21:12:39.797]
[21:12:39.797] > Build failed because of webpack errors
[21:12:39.862] Error: Command "prisma generate && node scripts/handle-db-build.js && next build" exited with 1
[21:12:40.881]
