"use client";

import { useEffect, useRef } from "react";

type ReporterProps = {
    /* ⎯⎯ props are only provided on the global-error page ⎯⎯ */
    error?: Error & { digest?: string };
    reset?: () => void;
};

export default function ErrorReporter({ error, reset }: ReporterProps) {
    /* ─ instrumentation shared by every route ─ */
    const lastOverlayMsg = useRef("");
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        const inIframe = window.parent !== window;
        if (!inIframe) return;

        const send = (payload: unknown) => window.parent.postMessage(payload, "*");

        const onError = (e: ErrorEvent) =>
            send({
                type: "ERROR_CAPTURED",
                error: {
                    message: e.message,
                    stack: e.error?.stack,
                    filename: e.filename,
                    lineno: e.lineno,
                    colno: e.colno,
                    source: "window.onerror",
                },
                timestamp: Date.now(),
            });

        const onReject = (e: PromiseRejectionEvent) =>
            send({
                type: "ERROR_CAPTURED",
                error: {
                    message: e.reason?.message ?? String(e.reason),
                    stack: e.reason?.stack,
                    source: "unhandledrejection",
                },
                timestamp: Date.now(),
            });

        window.addEventListener("error", onError);
        window.addEventListener("unhandledrejection", onReject);

        return () => {
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onReject);
        };
    }, []);

    /* ─ extra postMessage when on the global-error route ─ */
    useEffect(() => {
        if (!error) return;
        window.parent.postMessage(
            {
                type: "global-error-reset",
                error: {
                    message: error.message,
                    stack: error.stack,
                    digest: error.digest,
                    name: error.name,
                },
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
            },
            "*"
        );
    }, [error]);

    /* ─ ordinary pages render nothing ─ */
    if (!error) return null;

    /* ─ global-error or route-error UI ─ */
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center gap-6 animate-in fade-in duration-500">
            <div className="size-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                    Something went wrong
                </h1>
                <p className="text-sm font-medium text-[var(--text-secondary)] max-w-xs mx-auto">
                    We encountered an unexpected error. Our team has been notified.
                </p>
            </div>

            {reset && (
                <button
                    onClick={() => reset()}
                    className="h-11 px-8 rounded-full bg-[var(--foreground)] text-[var(--text-inverse)] font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--shadow-sm)]"
                >
                    Try Again
                </button>
            )}

            {process.env.NODE_ENV === "development" && (
                <div className="w-full max-w-lg mt-8 text-left bg-[var(--surface-muted)] rounded-2xl p-6 border border-[var(--border)] overflow-hidden">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Technical Exception (Dev Only)</p>
                    <pre className="text-xs font-mono text-[var(--text-secondary)] overflow-auto max-h-[200px] whitespace-pre-wrap">
                        {error.message}
                        {"\n\n"}
                        {error.stack}
                    </pre>
                </div>
            )}
        </div>
    );
}
