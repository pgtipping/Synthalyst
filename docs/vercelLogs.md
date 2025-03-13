# Vercel Build Logs

## 2025-03-12

[17:40:31.396] Cloning github.com/pgtipping/Synthalyst (Branch: main, Commit: 347c202)
[17:40:33.463] Cloning completed: 2.067s
[17:40:40.186] Restored build cache from previous deployment (2iz1hCbVQcRZATg51pNTAqCBLrYm)
[17:40:40.299] Running build in Washington, D.C., USA (East) – iad1
[17:40:40.907] Running "vercel build"
[17:40:41.400] Vercel CLI 41.3.2
[17:40:43.014] Running "install" command: `npm install`...
[17:40:52.226]
[17:40:52.227] > nextjs-app@0.1.0 postinstall
[17:40:52.227] > prisma generate
[17:40:52.228]
[17:40:52.937] Prisma schema loaded from prisma/schema.prisma
[17:40:54.334]
[17:40:54.335] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 707ms
[17:40:54.335]
[17:40:54.335] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[17:40:54.336]
[17:40:54.336] Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: https://pris.ly/--optimize
[17:40:54.336]
[17:40:54.537]
[17:40:54.537] up to date, audited 1788 packages in 10s
[17:40:54.538]
[17:40:54.538] 386 packages are looking for funding
[17:40:54.538] run `npm fund` for details
[17:40:54.557]
[17:40:54.558] 10 vulnerabilities (2 moderate, 8 high)
[17:40:54.558]
[17:40:54.558] To address issues that do not require attention, run:
[17:40:54.559] npm audit fix
[17:40:54.559]
[17:40:54.559] To address all issues possible (including breaking changes), run:
[17:40:54.559] npm audit fix --force
[17:40:54.560]
[17:40:54.560] Some issues need review, and may require choosing
[17:40:54.560] a different dependency.
[17:40:54.560]
[17:40:54.562] Run `npm audit` for details.
[17:40:54.609] Detected Next.js version: 15.2.1
[17:40:54.614] Running "prisma generate && node scripts/handle-db-build.js && next build"
[17:40:55.131] Prisma schema loaded from prisma/schema.prisma
[17:40:56.433]
[17:40:56.433] ✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 683ms
[17:40:56.433]
[17:40:56.433] Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
[17:40:56.433]
[17:40:56.434] Tip: Curious about the SQL queries Prisma ORM generates? Optimize helps you enhance your visibility: https://pris.ly/tip-2-optimize
[17:40:56.434]
[17:40:56.470] ┌─────────────────────────────────────────────────────────┐
[17:40:56.470] │ Update available 6.4.1 -> 6.5.0 │
[17:40:56.471] │ Run the following to update │
[17:40:56.471] │ npm i --save-dev prisma@latest │
[17:40:56.471] │ npm i @prisma/client@latest │
[17:40:56.471] └─────────────────────────────────────────────────────────┘
[17:40:56.672] Build environment detected, creating mock Prisma client...
[17:40:56.673] Mock Prisma client created at /vercel/path1/node_modules/@prisma/client/mock.js
[17:40:56.673] Database handling for build complete
[17:40:58.582] ▲ Next.js 15.2.1
[17:40:58.583]
[17:40:58.688] Creating an optimized production build ...
[17:40:59.532] ⚠ Production code optimization has been disabled in your project. Read more: https://nextjs.org/docs/messages/minification-disabled
[17:41:28.884] Failed to compile.
[17:41:28.885]
[17:41:28.886] ./src/components/admin/Breadcrumb.tsx
[17:41:28.886] Error: [31mx[0m You're importing a component that needs `usePathname`. This React hook only works in a client component. To fix, mark the file (or its parent) with the `"use client"` directive.
[17:41:28.886] [31m|[0m
[17:41:28.886] [31m|[0m Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
[17:41:28.887] [31m|[0m
[17:41:28.887] [31m|[0m
[17:41:28.887] ,-[[36;1;4m/vercel/path1/src/components/admin/Breadcrumb.tsx[0m:3:1]
[17:41:28.887] [2m1[0m | import { Fragment } from "react";
[17:41:28.887] [2m2[0m | import Link from "next/link";
[17:41:28.887] [2m3[0m | import { usePathname } from "next/navigation";
[17:41:28.887] : [35;1m ^^^^^^^^^^^[0m
[17:41:28.887] [2m4[0m | import { ChevronRight } from "lucide-react";
[17:41:28.888] [2m5[0m |
[17:41:28.888] [2m6[0m | interface BreadcrumbItem {
[17:41:28.888] `----
[17:41:28.888] 
[17:41:28.888] Import trace for requested module:
[17:41:28.888] ./src/components/admin/Breadcrumb.tsx
[17:41:28.889] ./src/app/admin/layout.tsx
[17:41:28.889] 
[17:41:28.889] ./src/components/admin/RedisMonitoring.tsx
[17:41:28.890] Error:   [31mx[0m You're importing a component that needs `useEffect`. This React hook only works in a client component. To fix, mark the file (or its parent) with the `"use client"`directive.
[17:41:28.890]   [31m|[0m 
[17:41:28.890]   [31m|[0m  Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
[17:41:28.890]   [31m|[0m 
[17:41:28.890]   [31m|[0m 
[17:41:28.890]    ,-[[36;1;4m/vercel/path1/src/components/admin/RedisMonitoring.tsx[0m:1:1]
[17:41:28.891]  [2m1[0m | import { useEffect, useState } from "react";
[17:41:28.891]    : [35;1m         ^^^^^^^^^[0m
[17:41:28.891]  [2m2[0m | import {
[17:41:28.891]  [2m3[0m |   Card,
[17:41:28.891]  [2m4[0m |   CardContent,
[17:41:28.892]   `----
[17:41:28.892] [31mx[0m You're importing a component that needs `useState`. This React hook only works in a client component. To fix, mark the file (or its parent) with the `"use client"` directive.
[17:41:28.892] [31m|[0m
[17:41:28.892] [31m|[0m Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
[17:41:28.892] [31m|[0m
[17:41:28.892] [31m|[0m
[17:41:28.893] ,-[[36;1;4m/vercel/path1/src/components/admin/RedisMonitoring.tsx[0m:1:1]
[17:41:28.893] [2m1[0m | import { useEffect, useState } from "react";
[17:41:28.893] : [35;1m ^^^^^^^^[0m
[17:41:28.893] [2m2[0m | import {
[17:41:28.893] [2m3[0m | Card,
[17:41:28.893] [2m4[0m | CardContent,
[17:41:28.894] `----
[17:41:28.894]
[17:41:28.899] Import trace for requested module:
[17:41:28.899] ./src/components/admin/RedisMonitoring.tsx
[17:41:28.900] ./src/app/admin/monitoring/page.tsx
[17:41:28.900]
[17:41:28.902] ./src/lib/rate-limit.ts:1:1
[17:41:28.903] Module not found: Can't resolve '@upstash/ratelimit'
[17:41:28.903] > 1 | import { Ratelimit } from "@upstash/ratelimit";
[17:41:28.903] | ^
[17:41:28.903] 2 | import { Redis } from "@upstash/redis";
[17:41:28.903] 3 | import { NextRequest } from "next/server";
[17:41:28.903] 4 | import { redisMonitor } from "./redis-monitor";
[17:41:28.903]
[17:41:28.904] https://nextjs.org/docs/messages/module-not-found
[17:41:28.904]
[17:41:28.904] Import trace for requested module:
[17:41:28.904] ./src/app/api/monitoring/redis/route.ts
[17:41:28.904] ./node_modules/next/dist/build/webpack/loaders/next-edge-app-route-loader/index.js?absolutePagePath=private-next-app-dir%2Fapi%2Fmonitoring%2Fredis%2Froute.ts&page=%2Fapi%2Fmonitoring%2Fredis%2Froute&appDirLoader=bmV4dC1hcHAtbG9hZGVyP25hbWU9YXBwJTJGYXBpJTJGbW9uaXRvcmluZyUyRnJlZGlzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZtb25pdG9yaW5nJTJGcmVkaXMlMkZyb3V0ZSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRm1vbml0b3JpbmclMkZyZWRpcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZ2ZXJjZWwlMkZwYXRoMSUyRnNyYyUyRmFwcCZhcHBQYXRocz0lMkZhcGklMkZtb25pdG9yaW5nJTJGcmVkaXMlMkZyb3V0ZSZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD1zdGFuZGFsb25lJnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0Qh&nextConfig=eyJlbnYiOnt9LCJlc2xpbnQiOnsiaWdub3JlRHVyaW5nQnVpbGRzIjp0cnVlfSwidHlwZXNjcmlwdCI6eyJpZ25vcmVCdWlsZEVycm9ycyI6dHJ1ZSwidHNjb25maWdQYXRoIjoidHNjb25maWcuanNvbiJ9LCJkaXN0RGlyIjoiLm5leHQiLCJjbGVhbkRpc3REaXIiOnRydWUsImFzc2V0UHJlZml4IjoiIiwiY2FjaGVNYXhNZW1vcnlTaXplIjo1MjQyODgwMCwiY29uZmlnT3JpZ2luIjoibmV4dC5jb25maWcuanMiLCJ1c2VGaWxlU3lzdGVtUHVibGljUm91dGVzIjp0cnVlLCJnZW5lcmF0ZUV0YWdzIjp0cnVlLCJwYWdlRXh0ZW5zaW9ucyI6WyJ0c3giLCJ0cyIsImpzeCIsImpzIl0sInBvd2VyZWRCeUhlYWRlciI6dHJ1ZSwiY29tcHJlc3MiOnRydWUsImltYWdlcyI6eyJkZXZpY2VTaXplcyI6WzY0MCw3NTAsODI4LDEwODAsMTIwMCwxOTIwLDIwNDgsMzg0MF0sImltYWdlU2l6ZXMiOlsxNiwzMiw0OCw2NCw5NiwxMjgsMjU2LDM4NF0sInBhdGgiOiIvX25leHQvaW1hZ2UiLCJsb2FkZXIiOiJkZWZhdWx0IiwibG9hZGVyRmlsZSI6IiIsImRvbWFpbnMiOlsibGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwiaW1hZ2VzLnVuc3BsYXNoLmNvbSIsInNvdXJjZS51bnNwbGFzaC5jb20iLCJwaWNzdW0ucGhvdG9zIiwicGxhY2Vob2xkLmNvIiwicmVzLmNsb3VkaW5hcnkuY29tIl0sImRpc2FibGVTdGF0aWNJbWFnZXMiOmZhbHNlLCJtaW5pbXVtQ2FjaGVUVEwiOjYwLCJmb3JtYXRzIjpbImltYWdlL3dlYnAiXSwiZGFuZ2Vyb3VzbHlBbGxvd1NWRyI6dHJ1ZSwiY29udGVudFNlY3VyaXR5UG9saWN5IjoiZGVmYXVsdC1zcmMgJ3NlbGYnOyBzY3JpcHQtc3JjICdub25lJzsgc2FuZGJveDsiLCJjb250ZW50RGlzcG9zaXRpb25UeXBlIjoiYXR0YWNobWVudCIsInJlbW90ZVBhdHRlcm5zIjpbeyJwcm90b2NvbCI6Imh0dHBzIiwiaG9zdG5hbWUiOiIqKiJ9LHsicHJvdG9jb2wiOiJodHRwIiwiaG9zdG5hbWUiOiIqKiJ9XSwidW5vcHRpbWl6ZWQiOmZhbHNlfSwiZGV2SW5kaWNhdG9ycyI6eyJwb3NpdGlvbiI6ImJvdHRvbS1sZWZ0In0sIm9uRGVtYW5kRW50cmllcyI6eyJtYXhJbmFjdGl2ZUFnZSI6MzYwMDAwMCwicGFnZXNCdWZmZXJMZW5ndGgiOjV9LCJhbXAiOnsiY2Fub25pY2FsQmFzZSI6IiJ9LCJiYXNlUGF0aCI6IiIsInNhc3NPcHRpb25zIjp7fSwidHJhaWxpbmdTbGFzaCI6ZmFsc2UsImkxOG4iOm51bGwsInByb2R1Y3Rpb25Ccm93c2VyU291cmNlTWFwcyI6ZmFsc2UsImV4Y2x1ZGVEZWZhdWx0TW9tZW50TG9jYWxlcyI6dHJ1ZSwic2VydmVyUnVudGltZUNvbmZpZyI6e30sInB1YmxpY1J1bnRpbWVDb25maWciOnt9LCJyZWFjdFByb2R1Y3Rpb25Qcm9maWxpbmciOmZhbHNlLCJyZWFjdFN0cmljdE1vZGUiOnRydWUsInJlYWN0TWF4SGVhZGVyc0xlbmd0aCI6NjAwMCwiaHR0cEFnZW50T3B0aW9ucyI6eyJrZWVwQWxpdmUiOnRydWV9LCJsb2dnaW5nIjp7fSwiZXhwaXJlVGltZSI6MzE1MzYwMDAsInN0YXRpY1BhZ2VHZW5lcmF0aW9uVGltZW91dCI6MTIwLCJvdXRwdXQiOiJzdGFuZGFsb25lIiwibW9kdWxhcml6ZUltcG9ydHMiOnsiQG11aS9pY29ucy1tYXRlcmlhbCI6eyJ0cmFuc2Zvcm0iOiJAbXVpL2ljb25zLW1hdGVyaWFsL3t7bWVtYmVyfX0ifSwibG9kYXNoIjp7InRyYW5zZm9ybSI6ImxvZGFzaC97e21lbWJlcn19In19LCJvdXRwdXRGaWxlVHJhY2luZ1Jvb3QiOiIvdmVyY2VsL3BhdGgxIiwiZXhwZXJpbWVudGFsIjp7Im5vZGVNaWRkbGV3YXJlIjpmYWxzZSwiY2FjaGVMaWZlIjp7ImRlZmF1bHQiOnsic3RhbGUiOjMwMCwicmV2YWxpZGF0ZSI6OTAwLCJleHBpcmUiOjQyOTQ5NjcyOTR9LCJzZWNvbmRzIjp7InN0YWxlIjowLCJyZXZhbGlkYXRlIjoxLCJleHBpcmUiOjYwfSwibWludXRlcyI6eyJzdGFsZSI6MzAwLCJyZXZhbGlkYXRlIjo2MCwiZXhwaXJlIjozNjAwfSwiaG91cnMiOnsic3RhbGUiOjMwMCwicmV2YWxpZGF0ZSI6MzYwMCwiZXhwaXJlIjo4NjQwMH0sImRheXMiOnsic3RhbGUiOjMwMCwicmV2YWxpZGF0ZSI6ODY0MDAsImV4cGlyZSI6NjA0ODAwfSwid2Vla3MiOnsic3RhbGUiOjMwMCwicmV2YWxpZGF0ZSI6NjA0ODAwLCJleHBpcmUiOjI1OTIwMDB9LCJtYXgiOnsic3RhbGUiOjMwMCwicmV2YWxpZGF0ZSI6MjU5MjAwMCwiZXhwaXJlIjo0Mjk0OTY3Mjk0fX0sImNhY2hlSGFuZGxlcnMiOnt9LCJjc3NDaHVua2luZyI6dHJ1ZSwibXVsdGlab25lRHJhZnRNb2RlIjpmYWxzZSwiYXBwTmF2RmFpbEhhbmRsaW5nIjpmYWxzZSwicHJlcmVuZGVyRWFybHlFeGl0Ijp0cnVlLCJzZXJ2ZXJNaW5pZmljYXRpb24iOnRydWUsInNlcnZlclNvdXJjZU1hcHMiOmZhbHNlLCJsaW5rTm9Ub3VjaFN0YXJ0IjpmYWxzZSwiY2FzZVNlbnNpdGl2ZVJvdXRlcyI6ZmFsc2UsImNsaWVudFNlZ21lbnRDYWNoZSI6ZmFsc2UsInByZWxvYWRFbnRyaWVzT25TdGFydCI6dHJ1ZSwiY2xpZW50Um91dGVyRmlsdGVyIjp0cnV
[17:41:28.905]
[17:41:28.905]
[17:41:28.905] > Build failed because of webpack errors
[17:41:28.989] Error: Command "prisma generate && node scripts/handle-db-build.js && next build" exited with 1
[17:41:30.459]
