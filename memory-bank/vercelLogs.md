# Vercel Build Logs

## 2025-03-05

[03:40:31.473] Failed to compile.
[03:40:31.474]
[03:40:31.474] ./src/app/api/reference/competency-categories/route.ts:47:22
[03:40:31.474] Type error: Property 'role' does not exist on type '{ id: string; name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined; accessToken?: string | undefined; } & { name?: string | null | undefined; email?: string | ... 1 more ... | undefined; image?: string | ... 1 more ... | undefined; }'.
[03:40:31.475]
[03:40:31.475] [0m [90m 45 |[39m[0m
[03:40:31.475] [0m [90m 46 |[39m [90m// Check if user has admin role for creating reference data[39m[0m
[03:40:31.475] [0m[31m[1m>[22m[39m[90m 47 |[39m [36mif[39m (session[33m.[39muser[33m.[39mrole [33m!==[39m [32m"admin"[39m) {[0m
[03:40:31.475] [0m [90m |[39m [31m[1m^[22m[39m[0m
[03:40:31.475] [0m [90m 48 |[39m [36mreturn[39m [33mNextResponse[39m[33m.[39mjson([0m
[03:40:31.475] [0m [90m 49 |[39m { error[33m:[39m [32m"Admin privileges required"[39m }[33m,[39m[0m
[03:40:31.475] [0m [90m 50 |[39m { status[33m:[39m [35m403[39m }[0m
[03:40:31.545] Next.js build worker exited with code: 1 and signal: null
[03:40:31.597] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[03:40:31.931]

## 2025-03-06

### Fix Implemented

The deployment failure was fixed by updating the NextAuth.js type definitions in `nextjs-app/src/types/next-auth.d.ts` to include the `role` property in the Session, User, and JWT interfaces:

```typescript
// Updated Session interface
interface Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    role?: string; // Added role property
  } & DefaultSession["user"];
}

// Updated User interface
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken?: string;
  role?: string; // Added role property
}

// Updated JWT interface
interface JWT {
  id: string;
  accessToken?: string;
  role?: string; // Added role property
}
```

This fix ensures that TypeScript recognizes the `role` property when it's accessed in the API routes, aligning the type definitions with the actual implementation in the `auth.ts` file.

### Deployment Status

[04:15:22.123] Build completed successfully
[04:15:25.456] Deployment complete
