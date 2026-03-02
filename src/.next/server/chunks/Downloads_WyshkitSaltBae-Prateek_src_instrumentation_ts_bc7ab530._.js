module.exports = [
"[project]/Downloads/WyshkitSaltBae-Prateek/src/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if ("TURBOPACK compile-time truthy", 1) {
        const { resourceFromAttributes } = await __turbopack_context__.A("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/index.js [instrumentation] (ecmascript, async loader)");
        const { ATTR_SERVICE_NAME } = await __turbopack_context__.A("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [instrumentation] (ecmascript, async loader)");
        const { NodeSDK } = await __turbopack_context__.A("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-node/build/src/index.js [instrumentation] (ecmascript, async loader)");
        const { OTLPTraceExporter } = await __turbopack_context__.A("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/index.js [instrumentation] (ecmascript, async loader)");
        const sdk = new NodeSDK({
            resource: resourceFromAttributes({
                [ATTR_SERVICE_NAME]: 'wyshkit-saltbae'
            }),
            traceExporter: new OTLPTraceExporter({
                // Configurable via environment variables
                url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces'
            })
        });
        sdk.start();
    // logger.info('OTel Instrumentation initialized');
    }
}
}),
];

//# sourceMappingURL=Downloads_WyshkitSaltBae-Prateek_src_instrumentation_ts_bc7ab530._.js.map