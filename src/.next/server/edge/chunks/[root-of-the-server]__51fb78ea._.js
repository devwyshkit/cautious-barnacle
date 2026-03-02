(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__51fb78ea._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/logging/logger.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Structured Logging Service
 * Wyshkit 2026: Production-grade logging with context, levels, and observability
 */ __turbopack_context__.s([
    "LogLevel",
    ()=>LogLevel,
    "log",
    ()=>log,
    "logger",
    ()=>logger
]);
var LogLevel = /*#__PURE__*/ function(LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    return LogLevel;
}({});
class Logger {
    minLevel;
    isDevelopment;
    constructor(){
        this.isDevelopment = ("TURBOPACK compile-time value", "development") === 'development';
        // WYSHKIT 2026: God Level Purity. 
        // Absolute production-grade silence. Only ERRORs reach the stream in non-development.
        // In development, we use WARN to keep the DX clean.
        this.minLevel = this.isDevelopment ? "warn" : "error";
    }
    shouldLog(level) {
        const levels = [
            "debug",
            "info",
            "warn",
            "error"
        ];
        return levels.indexOf(level) >= levels.indexOf(this.minLevel);
    }
    createLogEntry(level, message, context, error, metadata) {
        const entry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            metadata
        };
        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined
            };
        }
        return entry;
    }
    log(entry) {
        if (!this.shouldLog(entry.level)) {
            return;
        }
        // WYSHKIT 2026: Zero Console Leak Enforcement
        // In production, we ONLY log to standard output if log level is ERROR or WARN.
        // In development, we use full verbosity for DX.
        if (this.isDevelopment) {
            const prefix = `[${entry.level.toUpperCase()}]`;
            const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
            const errorStr = entry.error ? ` | Error: ${entry.error.name}: ${entry.error.message}` : '';
            const metadataStr = entry.metadata ? ` | Metadata: ${JSON.stringify(entry.metadata)}` : '';
            // Clean single-line log for dev console
            console.log(`${prefix} ${entry.message}${contextStr}${errorStr}${metadataStr}`);
            if (entry.error?.stack) {
                console.error(entry.error.stack);
            }
        } else if (entry.level === "error" || entry.level === "warn") {
            // In production, output structured JSON for log aggregation
            console.log(JSON.stringify(entry));
        }
    }
    debug(message, context, metadata) {
        this.log(this.createLogEntry("debug", message, context, undefined, metadata));
    }
    info(message, context, metadata) {
        this.log(this.createLogEntry("info", message, context, undefined, metadata));
    }
    warn(message, context, metadata) {
        this.log(this.createLogEntry("warn", message, context, undefined, metadata));
    }
    error(message, error, context, metadata) {
        const err = error instanceof Error ? error : undefined;
        if (!err && error) {
            // Convert unknown error to Error
            const errorMessage = typeof error === 'string' ? error : error && typeof error === 'object' && 'message' in error ? String(error.message) : JSON.stringify(error) || 'Unknown error';
            const errObj = new Error(errorMessage);
            this.log(this.createLogEntry("error", message, context, errObj, metadata));
        } else {
            this.log(this.createLogEntry("error", message, context, err, metadata));
        }
    }
    // Convenience methods for common scenarios
    logAction(action, context, metadata) {
        const fullContext = {
            ...context,
            action,
            env: this.isDevelopment ? 'dev' : 'prod'
        };
        this.info(`[ACTION] ${action}`, fullContext, metadata);
    }
    logAPIRequest(method, path, context) {
        this.info(`[API] ${method} ${path}`, {
            ...context,
            method,
            path
        });
    }
    logOrderEvent(event, orderId, context) {
        this.info(`[ORDER] ${event}`, {
            ...context,
            orderId,
            event
        });
    }
    logPerformance(operation, duration, context) {
        this.info(`[PERF] ${operation} took ${duration}ms`, context, {
            duration,
            operation
        });
    }
}
const logger = new Logger();
const log = {
    debug: (message, context, metadata)=>logger.debug(message, context, metadata),
    info: (message, context, metadata)=>logger.info(message, context, metadata),
    warn: (message, context, metadata)=>logger.warn(message, context, metadata),
    error: (message, error, context, metadata)=>logger.error(message, error, context, metadata),
    action: (action, context, metadata)=>logger.logAction(action, context, metadata),
    api: (method, path, context)=>logger.logAPIRequest(method, path, context),
    order: (event, orderId, context)=>logger.logOrderEvent(event, orderId, context),
    performance: (operation, duration, context)=>logger.logPerformance(operation, duration, context)
};
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/env.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkRecommendedEnv",
    ()=>checkRecommendedEnv,
    "getSupabaseEnv",
    ()=>getSupabaseEnv,
    "getSupabaseEnvSafe",
    ()=>getSupabaseEnvSafe,
    "validateEnv",
    ()=>validateEnv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/logging/logger.ts [middleware-edge] (ecmascript)");
;
/**
 * WYSHKIT 2026: Environment Validation
 * Ensures critical external services are configured.
 */ const REQUIRED_ENV_VARS = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
];
function validateEnv() {
    const missing = REQUIRED_ENV_VARS.filter((key)=>!process.env[key]);
    if (missing.length > 0) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logger"].error('CRITICAL: Missing environment variables', {
            missing
        });
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
}
/**
 * Optional vars that trigger warnings if missing but don't halt production
 */ const RECOMMENDED_ENV_VARS = [
    'SHADOWFAX_API_KEY',
    'RAZORPAY_X_ACCOUNT_NUMBER'
];
function checkRecommendedEnv() {
    const missing = RECOMMENDED_ENV_VARS.filter((key)=>!process.env[key]);
    if (missing.length > 0) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logger"].warn('Recommended environment variables missing', {
            missing
        });
    }
}
function getSupabaseEnv() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        const missing = [];
        if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
        if (!key) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        throw new Error(`Missing required Supabase environment variables: ${missing.join(', ')}. ` + 'Please check your .env.local file.');
    }
    return {
        url,
        key
    };
}
function getSupabaseEnvSafe() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return {
        url,
        key
    };
}
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/supabase/resilience.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resilientFetch",
    ()=>resilientFetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/logging/logger.ts [middleware-edge] (ecmascript)");
;
async function resilientFetch(input, options = {}) {
    const inputUrl = typeof input === 'string' ? input : 'url' in input ? input.url : input.toString();
    const { timeoutMs = 7000, maxAttempts = 3, traceName = 'SUPABASE_RESILIENCE', ...fetchOptions } = options;
    let lastError;
    const getMirrorUrl = (url)=>url.includes('.supabase.co') ? url.replace('.supabase.co', '.supabase.com') : null;
    for(let i = 0; i < maxAttempts; i++){
        const mirrorUrl = getMirrorUrl(inputUrl);
        /**
         * WYSHKIT 2026: Fast-Failover Strategy
         * 1. Attempt 1: Standard URL (Fast timeout: 2.5s)
         * 2. Attempt 2+: If attempt 1 failed, use .com Mirror immediately
         */ const useMirror = i > 0 && mirrorUrl;
        const attemptUrl = useMirror ? mirrorUrl : inputUrl;
        const isFallback = attemptUrl !== inputUrl;
        try {
            const controller = new AbortController();
            // Fast detection: 2.5s for first attempt, 5s for subsequent
            const currentTimeout = i === 0 ? 2500 : 5000;
            const timeoutId = setTimeout(()=>controller.abort(), currentTimeout);
            const response = await fetch(attemptUrl, {
                ...fetchOptions,
                signal: controller.signal,
                headers: {
                    ...fetchOptions.headers,
                    'x-wyshkit-resilience': 'true',
                    'x-wyshkit-attempt': (i + 1).toString(),
                    'x-wyshkit-fallback': isFallback.toString()
                }
            });
            clearTimeout(timeoutId);
            if (isFallback) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logger"].info(`[${traceName}] DNS Failover SUCCESS via ${attemptUrl}`);
            }
            return response;
        } catch (err) {
            lastError = err;
            const isDnsFailure = err.message?.includes('fetch failed') || err.message?.includes('ENOTFOUND') || err.name === 'AbortError';
            if (isDnsFailure) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logger"].warn(`[${traceName}] DNS/Timeout on attempt ${i + 1} for ${attemptUrl}. ${i === 0 ? 'FAST ESCALATING TO MIRROR' : 'Retrying...'}`);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logger"].error(`[${traceName}] Network error on attempt ${i + 1} (${attemptUrl})`, err.message);
            }
            // Faster backoff for DNS failures 
            if (i < maxAttempts - 1) {
                const backoff = isDnsFailure ? 100 : 300 * (i + 1);
                await new Promise((res)=>setTimeout(res, backoff));
            }
        }
    }
    throw lastError;
}
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateSession",
    ()=>updateSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/logging/logger.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$env$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/env.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$supabase$2f$resilience$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/supabase/resilience.ts [middleware-edge] (ecmascript)");
;
;
;
;
;
async function updateSession(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const host = request.headers.get('host') || '';
        let supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
            request
        });
        const env = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$env$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getSupabaseEnvSafe"])();
        if (!env) return {
            supabaseResponse,
            user: null,
            roles: [
                'customer'
            ]
        };
        // WYSHKIT 2026: Middleware Resilience
        // Session refresh MUST NOT hang due to ISP DNS blocks.
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(env.url, env.key, {
            global: {
                fetch: (u, o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$supabase$2f$resilience$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["resilientFetch"])(u, {
                        ...o,
                        traceName: 'MIDDLEWARE',
                        timeoutMs: 5000
                    })
            },
            cookies: {
                getAll () {
                    return request.cookies.getAll();
                },
                setAll (cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options })=>request.cookies.set({
                                name,
                                value,
                                ...options
                            }));
                        cookiesToSet.forEach(({ name, value, options })=>supabaseResponse.cookies.set(name, value, options));
                    } catch  {
                    // Silently ignore cookie setting errors in middleware
                    }
                }
            }
        });
        const createRedirectResponse = (url)=>{
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(url, request.url));
            supabaseResponse.cookies.getAll().forEach((cookie)=>{
                response.cookies.set(cookie.name, cookie.value, cookie);
            });
            return response;
        };
        // --- SUBDOMAIN & SURFACE DETECTION ---
        const isVendorHost = host.startsWith('vendor.');
        const isAdminHost = host.startsWith('admin.');
        // WYSHKIT 2026: Precision Routing
        // Vendor admin routes own specific fixed suffixes under /vendor.
        // Customer facing stores (/vendor/[id]) are excluded from admin surface checks.
        const vendorAdminPaths = [
            '/vendor/catalog',
            '/vendor/orders',
            '/vendor/financials',
            '/vendor/insights',
            '/vendor/personalization',
            '/vendor/login'
        ];
        const isVendorAdminRoute = pathname === '/vendor' || vendorAdminPaths.some((p)=>pathname.startsWith(p));
        // Path-based fallback for local dev
        const isAdminSurface = isAdminHost || pathname.startsWith('/admin');
        const isVendorSurface = isVendorHost || isVendorAdminRoute;
        // Auth Routes
        const isVendorLogin = pathname === '/vendor/login' || isVendorHost && pathname === '/login';
        const isAdminLogin = pathname === '/admin/login' || isAdminHost && pathname === '/login';
        const isGlobalLogin = pathname === '/login' || pathname === '/signup' || pathname === '/auth/login';
        // WYSHKIT 2026: Middleware Diet - Session refresh only, no DB queries
        // Role/KYC checks delegated to layouts/pages for maximum Edge performance.
        let user = null;
        try {
            const { data } = await supabase.auth.getUser();
            user = data?.user || null;
        } catch  {}
        const roles = user?.app_metadata?.roles || [
            user?.app_metadata?.role || 'customer'
        ];
        const isAdmin = roles.includes('admin');
        const isVendor = roles.includes('vendor');
        // --- ACCESS CONTROL ---
        const isAuthRoute = isVendorLogin || isAdminLogin || isGlobalLogin;
        // A. Guest Access (Not Logged In)
        if (!user) {
            if (isAdminSurface && !isAdminLogin) return {
                supabaseResponse: createRedirectResponse('/admin/login'),
                user: null,
                roles: [
                    'customer'
                ]
            };
            if (isVendorSurface && !isVendorLogin) return {
                supabaseResponse: createRedirectResponse('/vendor/login'),
                user: null,
                roles: [
                    'customer'
                ]
            };
            // WYSHKIT 2026: Progressive Authentication - Guests can access checkout
            // Auth required only at payment step (handled in PaymentIntentBlock)
            // Protect only truly sensitive paths
            const isCustomerProtected = [
                '/profile',
                '/orders'
            ].some((p)=>pathname.startsWith(p));
            if (isCustomerProtected) {
                const url = new URL('/auth', request.url);
                url.searchParams.set('intent', 'signin');
                return {
                    supabaseResponse: createRedirectResponse(url.toString()),
                    user: null,
                    roles: [
                        'customer'
                    ]
                };
            }
            return {
                supabaseResponse,
                user: null,
                roles: [
                    'customer'
                ]
            };
        }
        // B. Authenticated Access (Logged In)
        // Role enforcement: admin surface requires app_metadata admin; vendor surface deferred to layout
        if (user) {
            if (isAdminSurface && !isAdmin && !isAdminLogin) {
                return {
                    supabaseResponse: createRedirectResponse(isVendor ? '/vendor' : '/'),
                    user,
                    roles
                };
            }
            // Vendor surface: let through; (vendor)/layout.tsx does DB-backed vendor+KYC check
            // 2. Login Page Logic (Already logged in)
            if (isAuthRoute) {
                if (isAdminLogin && isAdmin) return {
                    supabaseResponse: createRedirectResponse('/admin'),
                    user,
                    roles
                };
                if (isVendorLogin && isVendor) return {
                    supabaseResponse: createRedirectResponse('/vendor'),
                    user,
                    roles
                };
                if (isGlobalLogin) {
                    if (isAdmin) return {
                        supabaseResponse: createRedirectResponse('/admin'),
                        user,
                        roles
                    };
                    if (isVendor) return {
                        supabaseResponse: createRedirectResponse('/vendor'),
                        user,
                        roles
                    };
                    return {
                        supabaseResponse: createRedirectResponse('/'),
                        user,
                        roles
                    };
                }
                // If logged in but on the "wrong" login page, redirect to correct dashboard
                if (isVendorLogin && isAdmin && !isVendor) return {
                    supabaseResponse: createRedirectResponse('/admin'),
                    user,
                    roles
                };
                if (isAdminLogin && isVendor && !isAdmin) return {
                    supabaseResponse: createRedirectResponse('/vendor'),
                    user,
                    roles
                };
            }
        }
        // WYSHKIT 2026: Auth Context Injection (Request Patching)
        // We return these so the top-level middleware can inject them into the REQUEST headers.
        return {
            supabaseResponse,
            user,
            roles
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logger"].error('Middleware runtime error', error);
        return {
            supabaseResponse: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next(),
            user: null,
            roles: [
                'customer'
            ]
        };
    }
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/src/lib/logging/logger.ts [middleware-edge] (ecmascript)");
;
;
;
async function middleware(request) {
    try {
        // 1. Resolve Session and Auth context
        const { supabaseResponse, user, roles } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSession"])(request);
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
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$src$2f$lib$2f$logging$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logger"].error('Error in middleware runtime', error);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__51fb78ea._.js.map