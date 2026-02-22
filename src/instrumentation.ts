export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { resourceFromAttributes } = await import('@opentelemetry/resources');
        const { ATTR_SERVICE_NAME } = await import('@opentelemetry/semantic-conventions');
        const { NodeSDK } = await import('@opentelemetry/sdk-node');
        const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');

        const sdk = new NodeSDK({
            resource: resourceFromAttributes({
                [ATTR_SERVICE_NAME]: 'wyshkit-saltbae',
            }),
            traceExporter: new OTLPTraceExporter({
                // Configurable via environment variables
                url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
            }),
        });

        sdk.start();

        console.log('OTel Instrumentation started for Wyshkit');
    }
}
