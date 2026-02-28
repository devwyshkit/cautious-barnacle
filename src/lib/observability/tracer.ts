import { trace, type Tracer, type Span, SpanStatusCode } from '@opentelemetry/api';

/**
 * WYSHKIT 2026: The "Observability Pulse"
 * Centralized tracer for server actions and core logic.
 */
export const tracer: Tracer = trace.getTracer('wyshkit-saltbae');

export async function withTrace<T>(
    name: string,
    operation: (span: Span) => Promise<T>,
    attributes: Record<string, string | number | boolean> = {}
): Promise<T> {
    return tracer.startActiveSpan(name, { attributes }, async (span) => {
        try {
            const result = await operation(span);
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error: any) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error instanceof Error ? error.message : String(error)
            });
            span.recordException(error instanceof Error ? error : new Error(String(error)));
            throw error;
        } finally {
            span.end();
        }
    });
}
