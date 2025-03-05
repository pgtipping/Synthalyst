# Vercel Build Logs

## 2025-03-05

### Fixed: Next.js 15 Type Error in Coming Soon Page

**Issue:**

```
Failed to compile.

src/app/coming-soon/page.tsx
Type error: Type '{ searchParams: { tool?: string | undefined; path?: string | undefined; }; }' does not satisfy the constraint 'PageProps'.
Types of property 'searchParams' are incompatible.
Type '{ tool?: string | undefined; path?: string | undefined; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

**Root Cause:**
Next.js 15 requires `searchParams` to be a Promise type, but our Coming Soon page was expecting a plain object.

**Solution:**

1. Updated the Coming Soon page component to be async
2. Changed the searchParams type to accept both Promise and plain object
3. Added logic to resolve the searchParams if it's a Promise
4. Committed with message: "Fix Next.js 15 type error in Coming Soon page"

**File Changed:**

- `nextjs-app/src/app/coming-soon/page.tsx`

## 2025-03-04

[21:16:55.493] Running build in Washington, D.C., USA (East) – iad1
[21:16:55.600] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 0b74cea)
[21:16:55.939] Cloning completed: 336.000ms
[21:17:04.292] Restored build cache from previous deployment (DUaMNLyiuZTrsvVZ6KPnxrZqUTi4)
[21:17:04.380] Running "vercel build"
[21:17:05.161] Vercel CLI 41.2.2
[21:17:07.483] Running "install" command: `npm install`...
[21:17:17.529]
[21:17:17.529] changed 11 packages, and audited 1434 packages in 10s
[21:17:17.530]
[21:17:17.530] 255 packages are looking for funding
[21:17:17.530] run `npm fund` for details
[21:17:17.540]
[21:17:17.540] 5 vulnerabilities (3 moderate, 2 high)
[21:17:17.540]
[21:17:17.540] To address all issues (including breaking changes), run:
[21:17:17.541] npm audit fix --force
[21:17:17.541]
[21:17:17.541] Run `npm audit` for details.
[21:17:17.590] Detected Next.js version: 15.2.0
[21:17:17.591] Running "prisma migrate deploy && prisma generate && next build"
[21:17:18.039] Prisma schema loaded from prisma/schema.prisma
[21:17:18.046] Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-noisy-mountain-a4gl2bkt-pooler.us-east-1.aws.neon.tech"
[21:17:18.136]
[21:17:18.136] 6 migrations found in prisma/migrations
[21:17:18.137]
[21:17:18.199]
[21:17:18.199] No pending migrations to apply.
[21:17:18.684] Prisma schema loaded from prisma/schema.prisma
[21:17:19.172]
[21:17:19.173] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 246ms
[21:17:19.173]
[21:17:19.173] Start by importing your Prisma Client (See: <https://pris.ly/d/importing-client>)
[21:17:19.173]
[21:17:19.173] Tip: Interested in query caching in just a few lines of code? Try Accelerate today! <https://pris.ly/tip-3-accelerate>
[21:17:19.173]
[21:17:20.012] ▲ Next.js 15.2.0
[21:17:20.012]
[21:17:20.091] Creating an optimized production build ...
[21:17:32.450] ✓ Compiled successfully
[21:17:32.457] Skipping linting
[21:17:32.457] Checking validity of types ...
[21:17:49.319] Failed to compile.
[21:17:49.319]
[21:17:49.319] src/app/coming-soon/page.tsx
[21:17:49.319] Type error: Type '{ searchParams: { tool?: string | undefined; path?: string | undefined; }; }' does not satisfy the constraint 'PageProps'.
[21:17:49.319] Types of property 'searchParams' are incompatible.
[21:17:49.319] Type '{ tool?: string | undefined; path?: string | undefined; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
[21:17:49.319]
[21:17:49.375] Next.js build worker exited with code: 1 and signal: null
[21:17:49.425] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[21:17:49.790]
