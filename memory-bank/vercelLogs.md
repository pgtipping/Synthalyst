# Vercel Build Logs

## 2025-03-04

[06:46:38.602] ▲ Next.js 15.2.0
[06:46:38.603]
[06:46:38.682] Creating an optimized production build ...
[06:47:07.494] ✓ Compiled successfully
[06:47:07.501] Skipping linting
[06:47:07.501] Checking validity of types ...
[06:47:24.296] Failed to compile.
[06:47:24.296]
[06:47:24.296] ./src/components/TrainingPlanPDF.tsx:2:22
[06:47:24.296] Type error: Could not find a declaration file for module 'react-pdf-html'. '/vercel/path1/node_modules/react-pdf-html/dist/esm/index.js' implicitly has an 'any' type.
[06:47:24.296] There are types at '/vercel/path1/node_modules/react-pdf-html/dist/types/index.d.ts', but this result could not be resolved when respecting package.json "exports". The 'react-pdf-html' library may need to update its package.json or typings.
[06:47:24.297]
[06:47:24.297] [0m [90m 1 |[39m [36mimport[39m { [33mDocument[39m[33m,[39m [33mPage[39m[33m,[39m [33mText[39m[33m,[39m [33mView[39m[33m,[39m [33mStyleSheet[39m } [36mfrom[39m [32m"@react-pdf/renderer"[39m[33m;[39m[0m
[06:47:24.297] [0m[31m[1m>[22m[39m[90m 2 |[39m [36mimport[39m { [33mHtml[39m } [36mfrom[39m [32m"react-pdf-html"[39m[33m;[39m[0m
[06:47:24.297] [0m [90m |[39m [31m[1m^[22m[39m[0m
[06:47:24.297] [0m [90m 3 |[39m [36mimport[39m [33mReact[39m [36mfrom[39m [32m"react"[39m[33m;[39m[0m
[06:47:24.297] [0m [90m 4 |[39m[0m
[06:47:24.297] [0m [90m 5 |[39m [90m// Create styles[39m[0m
[06:47:24.344] Next.js build worker exited with code: 1 and signal: null
[06:47:24.416] Error: Command "prisma migrate deploy && prisma generate && next build" exited with 1
[06:47:24.837]

## 2025-03-09 - RESOLVED

Issue: TypeScript could not find declaration file for 'react-pdf-html' module.

Resolution:

- Created a custom type declaration file at `nextjs-app/src/types/react-pdf-html.d.ts`
- Defined the necessary types for the Html component used in TrainingPlanPDF.tsx
- Fixed the build process by providing TypeScript with the missing type information

The issue was caused by the react-pdf-html package's package.json "exports" field not correctly exposing the type definitions. Our custom type declaration file provides the necessary type information for TypeScript to properly type-check the code.

Local build verification:

```
✓ Compiled successfully
✓ Checking validity of types
```

This fix should resolve the Vercel deployment failure and allow successful builds going forward.
