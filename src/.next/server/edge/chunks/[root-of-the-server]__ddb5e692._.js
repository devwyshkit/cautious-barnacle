(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__ddb5e692._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/supabase/middleware'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/lib/logging/logger'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
async function middleware(request) {
    try {
        // 1. Resolve Session and Auth context
        const { supabaseResponse, user, roles } = await updateSession(request);
        // 2. Resolve Location Context
        const lat = request.cookies.get('wyshkit_lat')?.value;
        const lng = request.cookies.get('wyshkit_lng')?.value;
        const name = request.cookies.get('wyshkit_location_name')?.value;
        // WYSHKIT 2026: Edge Context Injection (Request Patching)
        const requestHeaders = new Headers(request.headers);
        if (lat && lng) {
            requestHeaders.set('x-wyshkit-location-lat', lat);
            requestHeaders.set('x-wyshkit-location-lng', lng);
            if (name) {
                requestHeaders.set('x-wyshkit-location-name', encodeURIComponent(name));
            }
        }
        // Auth Context Injection (Request Patching for One-Trip)
        if (user) {
            requestHeaders.set('x-wyshkit-user-id', user.id);
            requestHeaders.set('x-wyshkit-user-role', roles?.[0] || 'customer');
            requestHeaders.set('x-wyshkit-user-email', user.email || '');
        }
        // 3. Handle Redirects from updateSession (Auth/Access Control)
        const isRedirect = supabaseResponse.status >= 300 && supabaseResponse.status < 400;
        if (isRedirect) {
            return supabaseResponse;
        }
        // 4. Create path-through response with updated request headers
        const finalResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
            request: {
                headers: requestHeaders
            }
        });
        // 4. Merge cookies/headers from supabaseResponse (important for auth sessions)
        supabaseResponse.cookies.getAll().forEach((cookie)=>{
            finalResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        supabaseResponse.headers.forEach((value, key)=>{
            if (key.toLowerCase() !== 'content-type') {
                finalResponse.headers.set(key, value);
            }
        });
        return finalResponse;
    } catch (error) {
        logger.error('Error in middleware runtime', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
}
const config = {
    matcher: [
        /*
    * Match all request paths except for the ones starting with:
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico (favicon file)
    * Feel free to modify this pattern to include more paths.
    */ '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__ddb5e692._.js.map