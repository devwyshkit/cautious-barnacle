/**
 * WYSHKIT 2026: The "Observability Pulse"
 * Purged: OpenTelemetry SDK removed for performance.
 * withTrace is now a no-op wrapper to maintain interface compatibility.
 */
export async function withTrace<T>(
    name: string,
    operation: (span: any) => Promise<T>,
    attributes: Record<string, string | number | boolean> = {}
): Promise<T> {
    // Zero Shadow Tracing: Just execute the operation.
    return await operation({
        setAttributes: () => { },
        setStatus: () => { },
        recordException: () => { },
        end: () => { }
    });
}
