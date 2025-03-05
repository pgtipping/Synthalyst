# Vercel Build Logs

## 2025-03-05

### Fix for Next.js 15 Type Error in Coming Soon Page

**Date:** 2025-03-05

**Fix Description:** Fixed a TypeScript error in the Coming Soon page that was causing Vercel deployments to fail.

**Issue:** The error was:

```
Type '{ searchParams: Promise<{ tool?: string | undefined; path?: string | undefined; }> | { tool?: string | undefined; path?: string | undefined; }; }' does not satisfy the constraint 'PageProps'.
Types of property 'searchParams' are incompatible.
Type 'Promise<{ tool?: string | undefined; path?: string | undefined; }> | { tool?: string | undefined; path?: string | undefined; }' is not assignable to type 'Promise<any> | undefined'.
Type '{ tool?: string | undefined; path?: string | undefined; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

**Root Cause:** Next.js 15 requires `searchParams` to be a Promise type, while our implementation was expecting it to be either a Promise or a plain object.

**Solution Steps:**

1. Updated the Coming Soon page component to be async
2. Modified the `searchParams` type to accept only Promise type
3. Updated the code to always await `searchParams` since it's now guaranteed to be a Promise
4. Committed the changes with message: "Fix Next.js 15 type error in Coming Soon page"

**File Changed:** `nextjs-app/src/app/coming-soon/page.tsx`

[21:22:56.888] Running build in Washington, D.C., USA (East) – iad1
[21:22:56.994] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 148c166)
[21:22:57.306] Cloning completed: 312.000ms
[21:23:04.179] Restored build cache from previous deployment (DUaMNLyiuZTrsvVZ6KPnxrZqUTi4)
[21:23:04.267] Running "vercel build"
[21:23:05.280] Vercel CLI 41.2.2
[21:23:07.028] Running "install" command: `npm install`...
[21:23:14.496]
[21:23:14.497] changed 11 packages, and audited 1434 packages in 7s
[21:23:14.497]
[21:23:14.497] 255 packages are looking for funding
[21:23:14.497] run `npm fund` for details
[21:23:14.509]
[21:23:14.509] 5 vulnerabilities (3 moderate, 2 high)
[21:23:14.509]
[21:23:14.509] To address all issues (including breaking changes), run:
[21:23:14.509] npm audit fix --force
[21:23:14.509]
[21:23:14.509] Run `npm audit` for details.
[21:23:14.557] Detected Next.js version: 15.2.0
[21:23:14.558] Running "prisma migrate deploy && prisma generate && next build"
[21:23:15.029] Prisma schema loaded from prisma/schema.prisma
[21:23:15.036] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[21:23:15.131]
[21:23:15.131] 6 migrations found in prisma/migrations
[21:23:15.131]
[21:23:15.204]
[21:23:15.204] No pending migrations to apply.
[21:23:15.665] Prisma schema loaded from prisma/schema.prisma
[21:23:16.174]
[21:23:16.174] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 239ms
[21:23:16.174]
[21:23:16.174] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[21:23:16.174]
[21:23:16.175] Tip: Curious about the SQL queries Prisma ORM generates? Optimize helps you enhance your visibility: https://pris.ly/tip-2-optimize
[21:23:16.175]
[21:23:17.021] ▲ Next.js 15.2.0
[21:23:17.021]
[21:23:17.100] Creating an optimized production build ...
[21:23:29.459] ✓ Compiled successfully
[21:23:29.465] Skipping linting
[21:23:29.465] Checking validity of types ...
[21:23:46.385] Failed to compile.
[21:23:46.386]
[21:23:46.386] src/app/coming-soon/page.tsx
[21:23:46.386] Type error: Type '{ searchParams: Promise<{ tool?: string | undefined; path?: string | undefined; }> | { tool?: string | undefined; path?: string | undefined; }; }' does not satisfy the constraint 'PageProps'.
[21:23:46.386] Types of property 'searchParams' are incompatible.
[21:23:46.386] Type 'Promise<{ tool?: string | undefined; path?: string | undefined; }> | { tool?: string | undefined; path?: string | undefined; }' is not assignable to type 'Promise<any> | undefined'.
[21:23:46.386] Type '{ tool?: string | undefined; path?: string | undefined; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
[21:23:46.386]
[21:23:46.438] Next.js build worker exited with code: 1 and signal: null
[21:23:46.487] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[21:23:46.863]
