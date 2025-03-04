# Vercel Build Logs

## 2025-03-04

[06:19:22.667] Running build in Washington, D.C., USA (East) – iad1
[06:19:22.760] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 6c7dd45)
[06:19:23.112] Cloning completed: 352.000ms
[06:19:30.026] Restored build cache from previous deployment (2CaCiFC2bbGGNnku6WY5DryAHC2d)
[06:19:30.115] Running "vercel build"
[06:19:30.891] Vercel CLI 41.2.2
[06:19:32.087] Running "install" command: `npm install`...
[06:19:36.045]
[06:19:36.045] up to date, audited 1413 packages in 4s
[06:19:36.045]
[06:19:36.045] 244 packages are looking for funding
[06:19:36.045] run `npm fund` for details
[06:19:36.049]
[06:19:36.050] 3 moderate severity vulnerabilities
[06:19:36.050]
[06:19:36.050] To address all issues (including breaking changes), run:
[06:19:36.050] npm audit fix --force
[06:19:36.050]
[06:19:36.050] Run `npm audit` for details.
[06:19:38.073] Detected Next.js version: 15.2.0
[06:19:38.073] Running "prisma migrate deploy && prisma generate && next build"
[06:19:38.548] Prisma schema loaded from prisma/schema.prisma
[06:19:38.555] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[06:19:39.252]
[06:19:39.253] 6 migrations found in prisma/migrations
[06:19:39.253]
[06:19:39.363]
[06:19:39.364] No pending migrations to apply.
[06:19:39.835] Prisma schema loaded from prisma/schema.prisma
[06:19:40.332]
[06:19:40.333] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 262ms
[06:19:40.333]
[06:19:40.333] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[06:19:40.333]
[06:19:40.333] Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
[06:19:40.333]
[06:19:41.168] ▲ Next.js 15.2.0
[06:19:41.169]
[06:19:41.247] Creating an optimized production build ...
[06:19:47.223] Failed to compile.
[06:19:47.223]
[06:19:47.223] ./src/components/TrainingPlanPDF.tsx
[06:19:47.223] Module not found: Can't resolve 'react-pdf-html'
[06:19:47.223]
[06:19:47.223] https://nextjs.org/docs/messages/module-not-found
[06:19:47.223]
[06:19:47.224] Import trace for requested module:
[06:19:47.224] ./src/app/training-plan/client-component.tsx
[06:19:47.224]
[06:19:47.224]
[06:19:47.224] > Build failed because of webpack errors
[06:19:47.262] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[06:19:47.635]

## 2025-03-05 - Fixed Deployment Issue

### Issue Identified

The Vercel deployment was failing because the `react-pdf-html` package was missing from the dependencies in package.json. This package is required by the TrainingPlanPDF component for rendering HTML content in PDFs.

### Solution Implemented

1. Added `react-pdf-html` version 1.1.18 to the dependencies in package.json
2. Added `react-pdf` version 7.7.0 to ensure all required dependencies are available
3. Committed and pushed the changes to the main branch

### Expected Result

The next Vercel deployment should successfully build now that the required package is properly included in the dependencies. This will allow the TrainingPlanPDF component to function correctly in the production environment.

### Additional Notes

- Local build attempts encountered some issues with Prisma permissions and React child errors in the 404 page, but these are separate from the Vercel deployment issue.
- The specific error "Module not found: Can't resolve 'react-pdf-html'" should be resolved with this fix.
- Future enhancements to the PDF functionality should ensure all required dependencies are properly added to package.json.
