module.exports = [
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([]);
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "OTLPExporterBase",
    ()=>OTLPExporterBase
]);
class OTLPExporterBase {
    _delegate;
    constructor(delegate){
        this._delegate = delegate;
    }
    /**
     * Export items.
     * @param items
     * @param resultCallback
     */ export(items, resultCallback) {
        this._delegate.export(items, resultCallback);
    }
    forceFlush() {
        return this._delegate.forceFlush();
    }
    shutdown() {
        return this._delegate.shutdown();
    }
} //# sourceMappingURL=OTLPExporterBase.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/common/internal.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInstrumentationScope",
    ()=>createInstrumentationScope,
    "createResource",
    ()=>createResource,
    "toAnyValue",
    ()=>toAnyValue,
    "toAttributes",
    ()=>toAttributes,
    "toKeyValue",
    ()=>toKeyValue
]);
function createResource(resource, encoder) {
    const result = {
        attributes: toAttributes(resource.attributes, encoder),
        droppedAttributesCount: 0
    };
    const schemaUrl = resource.schemaUrl;
    if (schemaUrl && schemaUrl !== '') result.schemaUrl = schemaUrl;
    return result;
}
function createInstrumentationScope(scope) {
    return {
        name: scope.name,
        version: scope.version
    };
}
function toAttributes(attributes, encoder) {
    return Object.keys(attributes).map((key)=>toKeyValue(key, attributes[key], encoder));
}
function toKeyValue(key, value, encoder) {
    return {
        key: key,
        value: toAnyValue(value, encoder)
    };
}
function toAnyValue(value, encoder) {
    const t = typeof value;
    if (t === 'string') return {
        stringValue: value
    };
    if (t === 'number') {
        if (!Number.isInteger(value)) return {
            doubleValue: value
        };
        return {
            intValue: value
        };
    }
    if (t === 'boolean') return {
        boolValue: value
    };
    if (value instanceof Uint8Array) return {
        bytesValue: encoder.encodeUint8Array(value)
    };
    if (Array.isArray(value)) {
        const values = new Array(value.length);
        for(let i = 0; i < value.length; i++){
            values[i] = toAnyValue(value[i], encoder);
        }
        return {
            arrayValue: {
                values
            }
        };
    }
    if (t === 'object' && value != null) {
        const keys = Object.keys(value);
        const values = new Array(keys.length);
        for(let i = 0; i < keys.length; i++){
            values[i] = {
                key: keys[i],
                value: toAnyValue(value[keys[i]], encoder)
            };
        }
        return {
            kvlistValue: {
                values
            }
        };
    }
    return {};
} //# sourceMappingURL=internal.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/trace/internal.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createExportTraceServiceRequest",
    ()=>createExportTraceServiceRequest,
    "sdkSpanToOtlpSpan",
    ()=>sdkSpanToOtlpSpan,
    "toOtlpLink",
    ()=>toOtlpLink,
    "toOtlpSpanEvent",
    ()=>toOtlpSpanEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$internal$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/common/internal.js [instrumentation] (ecmascript)");
;
// Span flags constants matching the OTLP specification
const SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK = 0x100;
const SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK = 0x200;
/**
 * Builds the 32-bit span flags value combining the low 8-bit W3C TraceFlags
 * with the HAS_IS_REMOTE and IS_REMOTE bits according to the OTLP spec.
 */ function buildSpanFlagsFrom(traceFlags, isRemote) {
    // low 8 bits are W3C TraceFlags (e.g., sampled)
    let flags = traceFlags & 0xff | SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK;
    if (isRemote) {
        flags |= SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK;
    }
    return flags;
}
function sdkSpanToOtlpSpan(span, encoder) {
    const ctx = span.spanContext();
    const status = span.status;
    const parentSpanId = span.parentSpanContext?.spanId ? encoder.encodeSpanContext(span.parentSpanContext?.spanId) : undefined;
    return {
        traceId: encoder.encodeSpanContext(ctx.traceId),
        spanId: encoder.encodeSpanContext(ctx.spanId),
        parentSpanId: parentSpanId,
        traceState: ctx.traceState?.serialize(),
        name: span.name,
        // Span kind is offset by 1 because the API does not define a value for unset
        kind: span.kind == null ? 0 : span.kind + 1,
        startTimeUnixNano: encoder.encodeHrTime(span.startTime),
        endTimeUnixNano: encoder.encodeHrTime(span.endTime),
        attributes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$internal$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["toAttributes"])(span.attributes, encoder),
        droppedAttributesCount: span.droppedAttributesCount,
        events: span.events.map((event)=>toOtlpSpanEvent(event, encoder)),
        droppedEventsCount: span.droppedEventsCount,
        status: {
            // API and proto enums share the same values
            code: status.code,
            message: status.message
        },
        links: span.links.map((link)=>toOtlpLink(link, encoder)),
        droppedLinksCount: span.droppedLinksCount,
        flags: buildSpanFlagsFrom(ctx.traceFlags, span.parentSpanContext?.isRemote)
    };
}
function toOtlpLink(link, encoder) {
    return {
        attributes: link.attributes ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$internal$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["toAttributes"])(link.attributes, encoder) : [],
        spanId: encoder.encodeSpanContext(link.context.spanId),
        traceId: encoder.encodeSpanContext(link.context.traceId),
        traceState: link.context.traceState?.serialize(),
        droppedAttributesCount: link.droppedAttributesCount || 0,
        flags: buildSpanFlagsFrom(link.context.traceFlags, link.context.isRemote)
    };
}
function toOtlpSpanEvent(timedEvent, encoder) {
    return {
        attributes: timedEvent.attributes ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$internal$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["toAttributes"])(timedEvent.attributes, encoder) : [],
        name: timedEvent.name,
        timeUnixNano: encoder.encodeHrTime(timedEvent.time),
        droppedAttributesCount: timedEvent.droppedAttributesCount || 0
    };
}
function createExportTraceServiceRequest(spans, encoder) {
    return {
        resourceSpans: spanRecordsToResourceSpans(spans, encoder)
    };
}
function createResourceMap(readableSpans) {
    const resourceMap = new Map();
    for (const record of readableSpans){
        let ilsMap = resourceMap.get(record.resource);
        if (!ilsMap) {
            ilsMap = new Map();
            resourceMap.set(record.resource, ilsMap);
        }
        // TODO this is duplicated in basic tracer. Consolidate on a common helper in core
        const instrumentationScopeKey = `${record.instrumentationScope.name}@${record.instrumentationScope.version || ''}:${record.instrumentationScope.schemaUrl || ''}`;
        let records = ilsMap.get(instrumentationScopeKey);
        if (!records) {
            records = [];
            ilsMap.set(instrumentationScopeKey, records);
        }
        records.push(record);
    }
    return resourceMap;
}
function spanRecordsToResourceSpans(readableSpans, encoder) {
    const resourceMap = createResourceMap(readableSpans);
    const out = [];
    const entryIterator = resourceMap.entries();
    let entry = entryIterator.next();
    while(!entry.done){
        const [resource, ilmMap] = entry.value;
        const scopeResourceSpans = [];
        const ilmIterator = ilmMap.values();
        let ilmEntry = ilmIterator.next();
        while(!ilmEntry.done){
            const scopeSpans = ilmEntry.value;
            if (scopeSpans.length > 0) {
                const spans = scopeSpans.map((readableSpan)=>sdkSpanToOtlpSpan(readableSpan, encoder));
                scopeResourceSpans.push({
                    scope: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$internal$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentationScope"])(scopeSpans[0].instrumentationScope),
                    spans: spans,
                    schemaUrl: scopeSpans[0].instrumentationScope.schemaUrl
                });
            }
            ilmEntry = ilmIterator.next();
        }
        const processedResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$internal$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createResource"])(resource, encoder);
        const transformedSpans = {
            resource: processedResource,
            scopeSpans: scopeResourceSpans,
            schemaUrl: processedResource.schemaUrl
        };
        out.push(transformedSpans);
        entry = entryIterator.next();
    }
    return out;
} //# sourceMappingURL=internal.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "otperformance",
    ()=>otperformance
]);
;
;
;
const otperformance = performance; //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/time.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "addHrTimes",
    ()=>addHrTimes,
    "getTimeOrigin",
    ()=>getTimeOrigin,
    "hrTime",
    ()=>hrTime,
    "hrTimeDuration",
    ()=>hrTimeDuration,
    "hrTimeToMicroseconds",
    ()=>hrTimeToMicroseconds,
    "hrTimeToMilliseconds",
    ()=>hrTimeToMilliseconds,
    "hrTimeToNanoseconds",
    ()=>hrTimeToNanoseconds,
    "hrTimeToTimeStamp",
    ()=>hrTimeToTimeStamp,
    "isTimeInput",
    ()=>isTimeInput,
    "isTimeInputHrTime",
    ()=>isTimeInputHrTime,
    "millisToHrTime",
    ()=>millisToHrTime,
    "timeInputToHrTime",
    ()=>timeInputToHrTime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/index.js [instrumentation] (ecmascript) <locals>");
;
const NANOSECOND_DIGITS = 9;
const NANOSECOND_DIGITS_IN_MILLIS = 6;
const MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS);
const SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
function millisToHrTime(epochMillis) {
    const epochSeconds = epochMillis / 1000;
    // Decimals only.
    const seconds = Math.trunc(epochSeconds);
    // Round sub-nanosecond accuracy to nanosecond.
    const nanos = Math.round(epochMillis % 1000 * MILLISECONDS_TO_NANOSECONDS);
    return [
        seconds,
        nanos
    ];
}
function getTimeOrigin() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["otperformance"].timeOrigin;
}
function hrTime(performanceNow) {
    const timeOrigin = millisToHrTime(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["otperformance"].timeOrigin);
    const now = millisToHrTime(typeof performanceNow === 'number' ? performanceNow : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["otperformance"].now());
    return addHrTimes(timeOrigin, now);
}
function timeInputToHrTime(time) {
    // process.hrtime
    if (isTimeInputHrTime(time)) {
        return time;
    } else if (typeof time === 'number') {
        // Must be a performance.now() if it's smaller than process start time.
        if (time < __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["otperformance"].timeOrigin) {
            return hrTime(time);
        } else {
            // epoch milliseconds or performance.timeOrigin
            return millisToHrTime(time);
        }
    } else if (time instanceof Date) {
        return millisToHrTime(time.getTime());
    } else {
        throw TypeError('Invalid input type');
    }
}
function hrTimeDuration(startTime, endTime) {
    let seconds = endTime[0] - startTime[0];
    let nanos = endTime[1] - startTime[1];
    // overflow
    if (nanos < 0) {
        seconds -= 1;
        // negate
        nanos += SECOND_TO_NANOSECONDS;
    }
    return [
        seconds,
        nanos
    ];
}
function hrTimeToTimeStamp(time) {
    const precision = NANOSECOND_DIGITS;
    const tmp = `${'0'.repeat(precision)}${time[1]}Z`;
    const nanoString = tmp.substring(tmp.length - precision - 1);
    const date = new Date(time[0] * 1000).toISOString();
    return date.replace('000Z', nanoString);
}
function hrTimeToNanoseconds(time) {
    return time[0] * SECOND_TO_NANOSECONDS + time[1];
}
function hrTimeToMilliseconds(time) {
    return time[0] * 1e3 + time[1] / 1e6;
}
function hrTimeToMicroseconds(time) {
    return time[0] * 1e6 + time[1] / 1e3;
}
function isTimeInputHrTime(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number';
}
function isTimeInput(value) {
    return isTimeInputHrTime(value) || typeof value === 'number' || value instanceof Date;
}
function addHrTimes(time1, time2) {
    const out = [
        time1[0] + time2[0],
        time1[1] + time2[1]
    ];
    // Nanoseconds
    if (out[1] >= SECOND_TO_NANOSECONDS) {
        out[1] -= SECOND_TO_NANOSECONDS;
        out[0] += 1;
    }
    return out;
} //# sourceMappingURL=time.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/common/hex-to-binary.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "hexToBinary",
    ()=>hexToBinary
]);
function intValue(charCode) {
    // 0-9
    if (charCode >= 48 && charCode <= 57) {
        return charCode - 48;
    }
    // a-f
    if (charCode >= 97 && charCode <= 102) {
        return charCode - 87;
    }
    // A-F
    return charCode - 55;
}
function hexToBinary(hexStr) {
    const buf = new Uint8Array(hexStr.length / 2);
    let offset = 0;
    for(let i = 0; i < hexStr.length; i += 2){
        const hi = intValue(hexStr.charCodeAt(i));
        const lo = intValue(hexStr.charCodeAt(i + 1));
        buf[offset++] = hi << 4 | lo;
    }
    return buf;
} //# sourceMappingURL=hex-to-binary.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/common/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "JSON_ENCODER",
    ()=>JSON_ENCODER,
    "PROTOBUF_ENCODER",
    ()=>PROTOBUF_ENCODER,
    "encodeAsLongBits",
    ()=>encodeAsLongBits,
    "encodeAsString",
    ()=>encodeAsString,
    "hrTimeToNanos",
    ()=>hrTimeToNanos,
    "toLongBits",
    ()=>toLongBits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/time.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$hex$2d$to$2d$binary$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/common/hex-to-binary.js [instrumentation] (ecmascript)");
;
;
function hrTimeToNanos(hrTime) {
    const NANOSECONDS = BigInt(1000000000);
    return BigInt(Math.trunc(hrTime[0])) * NANOSECONDS + BigInt(Math.trunc(hrTime[1]));
}
function toLongBits(value) {
    const low = Number(BigInt.asUintN(32, value));
    const high = Number(BigInt.asUintN(32, value >> BigInt(32)));
    return {
        low,
        high
    };
}
function encodeAsLongBits(hrTime) {
    const nanos = hrTimeToNanos(hrTime);
    return toLongBits(nanos);
}
function encodeAsString(hrTime) {
    const nanos = hrTimeToNanos(hrTime);
    return nanos.toString();
}
const encodeTimestamp = typeof BigInt !== 'undefined' ? encodeAsString : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToNanoseconds"];
function identity(value) {
    return value;
}
function optionalHexToBinary(str) {
    if (str === undefined) return undefined;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$hex$2d$to$2d$binary$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hexToBinary"])(str);
}
const PROTOBUF_ENCODER = {
    encodeHrTime: encodeAsLongBits,
    encodeSpanContext: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$hex$2d$to$2d$binary$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hexToBinary"],
    encodeOptionalSpanContext: optionalHexToBinary,
    encodeUint8Array: identity
};
const JSON_ENCODER = {
    encodeHrTime: encodeTimestamp,
    encodeSpanContext: identity,
    encodeOptionalSpanContext: identity,
    encodeUint8Array: (bytes)=>{
        if (typeof Buffer !== 'undefined') {
            return Buffer.from(bytes).toString('base64');
        }
        // implementation note: not using spread operator and passing to
        // btoa to avoid stack overflow on large Uint8Arrays
        const chars = new Array(bytes.length);
        for(let i = 0; i < bytes.length; i++){
            chars[i] = String.fromCharCode(bytes[i]);
        }
        return btoa(chars.join(''));
    }
}; //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/trace/json/trace.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JsonTraceSerializer",
    ()=>JsonTraceSerializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$trace$2f$internal$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/trace/internal.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/common/utils.js [instrumentation] (ecmascript)");
;
;
const JsonTraceSerializer = {
    serializeRequest: (arg)=>{
        const request = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$trace$2f$internal$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createExportTraceServiceRequest"])(arg, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$common$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["JSON_ENCODER"]);
        const encoder = new TextEncoder();
        return encoder.encode(JSON.stringify(request));
    },
    deserializeResponse: (arg)=>{
        if (arg.length === 0) {
            return {};
        }
        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(arg));
    }
}; //# sourceMappingURL=trace.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/platform/node/globalThis.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /** only globals that common to node and browsers are allowed */ // eslint-disable-next-line node/no-unsupported-features/es-builtins
__turbopack_context__.s([
    "_globalThis",
    ()=>_globalThis
]);
var _globalThis = typeof globalThis === 'object' ? globalThis : /*TURBOPACK member replacement*/ __turbopack_context__.g; //# sourceMappingURL=globalThis.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/version.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ // this is autogenerated file, see scripts/version-update.js
__turbopack_context__.s([
    "VERSION",
    ()=>VERSION
]);
var VERSION = '1.9.0'; //# sourceMappingURL=version.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/internal/semver.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "_makeCompatibilityCheck",
    ()=>_makeCompatibilityCheck,
    "isCompatible",
    ()=>isCompatible
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/version.js [instrumentation] (ecmascript)");
;
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function _makeCompatibilityCheck(ownVersion) {
    var acceptedVersions = new Set([
        ownVersion
    ]);
    var rejectedVersions = new Set();
    var myVersionMatch = ownVersion.match(re);
    if (!myVersionMatch) {
        // we cannot guarantee compatibility so we always return noop
        return function() {
            return false;
        };
    }
    var ownVersionParsed = {
        major: +myVersionMatch[1],
        minor: +myVersionMatch[2],
        patch: +myVersionMatch[3],
        prerelease: myVersionMatch[4]
    };
    // if ownVersion has a prerelease tag, versions must match exactly
    if (ownVersionParsed.prerelease != null) {
        return function isExactmatch(globalVersion) {
            return globalVersion === ownVersion;
        };
    }
    function _reject(v) {
        rejectedVersions.add(v);
        return false;
    }
    function _accept(v) {
        acceptedVersions.add(v);
        return true;
    }
    return function isCompatible(globalVersion) {
        if (acceptedVersions.has(globalVersion)) {
            return true;
        }
        if (rejectedVersions.has(globalVersion)) {
            return false;
        }
        var globalVersionMatch = globalVersion.match(re);
        if (!globalVersionMatch) {
            // cannot parse other version
            // we cannot guarantee compatibility so we always noop
            return _reject(globalVersion);
        }
        var globalVersionParsed = {
            major: +globalVersionMatch[1],
            minor: +globalVersionMatch[2],
            patch: +globalVersionMatch[3],
            prerelease: globalVersionMatch[4]
        };
        // if globalVersion has a prerelease tag, versions must match exactly
        if (globalVersionParsed.prerelease != null) {
            return _reject(globalVersion);
        }
        // major versions must match
        if (ownVersionParsed.major !== globalVersionParsed.major) {
            return _reject(globalVersion);
        }
        if (ownVersionParsed.major === 0) {
            if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
                return _accept(globalVersion);
            }
            return _reject(globalVersion);
        }
        if (ownVersionParsed.minor <= globalVersionParsed.minor) {
            return _accept(globalVersion);
        }
        return _reject(globalVersion);
    };
}
var isCompatible = _makeCompatibilityCheck(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["VERSION"]); //# sourceMappingURL=semver.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/internal/global-utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "getGlobal",
    ()=>getGlobal,
    "registerGlobal",
    ()=>registerGlobal,
    "unregisterGlobal",
    ()=>unregisterGlobal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$platform$2f$node$2f$globalThis$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/platform/node/globalThis.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/version.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$internal$2f$semver$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/internal/semver.js [instrumentation] (ecmascript)");
;
;
;
var major = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["VERSION"].split('.')[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$platform$2f$node$2f$globalThis$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["_globalThis"];
function registerGlobal(type, instance, diag, allowOverride) {
    var _a;
    if (allowOverride === void 0) {
        allowOverride = false;
    }
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
        version: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["VERSION"]
    };
    if (!allowOverride && api[type]) {
        // already registered an API of this type
        var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
        diag.error(err.stack || err.message);
        return false;
    }
    if (api.version !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["VERSION"]) {
        // All registered APIs must be of the same version exactly
        var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["VERSION"]);
        diag.error(err.stack || err.message);
        return false;
    }
    api[type] = instance;
    diag.debug("@opentelemetry/api: Registered a global for " + type + " v" + __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["VERSION"] + ".");
    return true;
}
function getGlobal(type) {
    var _a, _b;
    var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
    if (!globalVersion || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$internal$2f$semver$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isCompatible"])(globalVersion)) {
        return;
    }
    return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag) {
    diag.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["VERSION"] + ".");
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api) {
        delete api[type];
    }
} //# sourceMappingURL=global-utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "DiagComponentLogger",
    ()=>DiagComponentLogger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/internal/global-utils.js [instrumentation] (ecmascript)");
var __read = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
;
/**
 * Component Logger which is meant to be used as part of any component which
 * will add automatically additional namespace in front of the log message.
 * It will then forward all message to global diag logger
 * @example
 * const cLogger = diag.createComponentLogger({ namespace: '@opentelemetry/instrumentation-http' });
 * cLogger.debug('test');
 * // @opentelemetry/instrumentation-http test
 */ var DiagComponentLogger = function() {
    function DiagComponentLogger(props) {
        this._namespace = props.namespace || 'DiagComponentLogger';
    }
    DiagComponentLogger.prototype.debug = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy('debug', this._namespace, args);
    };
    DiagComponentLogger.prototype.error = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy('error', this._namespace, args);
    };
    DiagComponentLogger.prototype.info = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy('info', this._namespace, args);
    };
    DiagComponentLogger.prototype.warn = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy('warn', this._namespace, args);
    };
    DiagComponentLogger.prototype.verbose = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy('verbose', this._namespace, args);
    };
    return DiagComponentLogger;
}();
;
function logProxy(funcName, namespace, args) {
    var logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getGlobal"])('diag');
    // shortcut if logger not set
    if (!logger) {
        return;
    }
    args.unshift(namespace);
    return logger[funcName].apply(logger, __spreadArray([], __read(args), false));
} //# sourceMappingURL=ComponentLogger.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag/types.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Defines the available internal logging levels for the diagnostic logger, the numeric values
 * of the levels are defined to match the original values from the initial LogLevel to avoid
 * compatibility/migration issues for any implementation that assume the numeric ordering.
 */ __turbopack_context__.s([
    "DiagLogLevel",
    ()=>DiagLogLevel
]);
var DiagLogLevel;
(function(DiagLogLevel) {
    /** Diagnostic Logging level setting to disable all logging (except and forced logs) */ DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
    /** Identifies an error scenario */ DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
    /** Identifies a warning scenario */ DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
    /** General informational log message */ DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
    /** General debug log message */ DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
    /**
     * Detailed trace level logging should only be used for development, should only be set
     * in a development environment.
     */ DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
    /** Used to set the logging level to include all logging */ DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
})(DiagLogLevel || (DiagLogLevel = {})); //# sourceMappingURL=types.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "createLogLevelDiagLogger",
    ()=>createLogLevelDiagLogger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag/types.js [instrumentation] (ecmascript)");
;
function createLogLevelDiagLogger(maxLevel, logger) {
    if (maxLevel < __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].NONE) {
        maxLevel = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].NONE;
    } else if (maxLevel > __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].ALL) {
        maxLevel = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].ALL;
    }
    // In case the logger is null or undefined
    logger = logger || {};
    function _filterFunc(funcName, theLevel) {
        var theFunc = logger[funcName];
        if (typeof theFunc === 'function' && maxLevel >= theLevel) {
            return theFunc.bind(logger);
        }
        return function() {};
    }
    return {
        error: _filterFunc('error', __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].ERROR),
        warn: _filterFunc('warn', __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].WARN),
        info: _filterFunc('info', __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].INFO),
        debug: _filterFunc('debug', __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].DEBUG),
        verbose: _filterFunc('verbose', __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].VERBOSE)
    };
} //# sourceMappingURL=logLevelLogger.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/api/diag.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "DiagAPI",
    ()=>DiagAPI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$ComponentLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$internal$2f$logLevelLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag/types.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/internal/global-utils.js [instrumentation] (ecmascript)");
var __read = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
;
;
;
;
var API_NAME = 'diag';
/**
 * Singleton object which represents the entry point to the OpenTelemetry internal
 * diagnostic API
 */ var DiagAPI = function() {
    /**
     * Private internal constructor
     * @private
     */ function DiagAPI() {
        function _logProxy(funcName) {
            return function() {
                var args = [];
                for(var _i = 0; _i < arguments.length; _i++){
                    args[_i] = arguments[_i];
                }
                var logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getGlobal"])('diag');
                // shortcut if logger not set
                if (!logger) return;
                return logger[funcName].apply(logger, __spreadArray([], __read(args), false));
            };
        }
        // Using self local variable for minification purposes as 'this' cannot be minified
        var self = this;
        // DiagAPI specific functions
        var setLogger = function(logger, optionsOrLogLevel) {
            var _a, _b, _c;
            if (optionsOrLogLevel === void 0) {
                optionsOrLogLevel = {
                    logLevel: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].INFO
                };
            }
            if (logger === self) {
                // There isn't much we can do here.
                // Logging to the console might break the user application.
                // Try to log to self. If a logger was previously registered it will receive the log.
                var err = new Error('Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation');
                self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
                return false;
            }
            if (typeof optionsOrLogLevel === 'number') {
                optionsOrLogLevel = {
                    logLevel: optionsOrLogLevel
                };
            }
            var oldLogger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getGlobal"])('diag');
            var newLogger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$internal$2f$logLevelLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createLogLevelDiagLogger"])((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].INFO, logger);
            // There already is an logger registered. We'll let it know before overwriting it.
            if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
                var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : '<failed to generate stacktrace>';
                oldLogger.warn("Current logger will be overwritten from " + stack);
                newLogger.warn("Current logger will overwrite one already registered from " + stack);
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["registerGlobal"])('diag', newLogger, self, true);
        };
        self.setLogger = setLogger;
        self.disable = function() {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["unregisterGlobal"])(API_NAME, self);
        };
        self.createComponentLogger = function(options) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$ComponentLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagComponentLogger"](options);
        };
        self.verbose = _logProxy('verbose');
        self.debug = _logProxy('debug');
        self.info = _logProxy('info');
        self.warn = _logProxy('warn');
        self.error = _logProxy('error');
    }
    /** Get the singleton instance of the DiagAPI API */ DiagAPI.instance = function() {
        if (!this._instance) {
            this._instance = new DiagAPI();
        }
        return this._instance;
    };
    return DiagAPI;
}();
;
 //# sourceMappingURL=diag.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ // Split module-level variable definition into separate files to allow
// tree-shaking on each api instance.
__turbopack_context__.s([
    "diag",
    ()=>diag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$api$2f$diag$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/api/diag.js [instrumentation] (ecmascript)");
;
var diag = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$api$2f$diag$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagAPI"].instance(); //# sourceMappingURL=diag-api.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-configuration.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "getSharedConfigurationDefaults",
    ()=>getSharedConfigurationDefaults,
    "mergeOtlpSharedConfigurationWithDefaults",
    ()=>mergeOtlpSharedConfigurationWithDefaults,
    "validateTimeoutMillis",
    ()=>validateTimeoutMillis,
    "wrapStaticHeadersInFunction",
    ()=>wrapStaticHeadersInFunction
]);
function validateTimeoutMillis(timeoutMillis) {
    if (Number.isFinite(timeoutMillis) && timeoutMillis > 0) {
        return timeoutMillis;
    }
    throw new Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${timeoutMillis}')`);
}
function wrapStaticHeadersInFunction(headers) {
    if (headers == null) {
        return undefined;
    }
    return async ()=>headers;
}
function mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    return {
        timeoutMillis: validateTimeoutMillis(userProvidedConfiguration.timeoutMillis ?? fallbackConfiguration.timeoutMillis ?? defaultConfiguration.timeoutMillis),
        concurrencyLimit: userProvidedConfiguration.concurrencyLimit ?? fallbackConfiguration.concurrencyLimit ?? defaultConfiguration.concurrencyLimit,
        compression: userProvidedConfiguration.compression ?? fallbackConfiguration.compression ?? defaultConfiguration.compression
    };
}
function getSharedConfigurationDefaults() {
    return {
        timeoutMillis: 10000,
        concurrencyLimit: 30,
        compression: 'none'
    };
} //# sourceMappingURL=shared-configuration.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/util.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "validateAndNormalizeHeaders",
    ()=>validateAndNormalizeHeaders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
function validateAndNormalizeHeaders(partialHeaders) {
    const headers = {};
    Object.entries(partialHeaders ?? {}).forEach(([key, value])=>{
        if (typeof value !== 'undefined') {
            headers[key] = String(value);
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Header "${key}" has invalid value (${value}) and will be ignored`);
        }
    });
    return headers;
} //# sourceMappingURL=util.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-http-configuration.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "getHttpConfigurationDefaults",
    ()=>getHttpConfigurationDefaults,
    "mergeOtlpHttpConfigurationWithDefaults",
    ()=>mergeOtlpHttpConfigurationWithDefaults
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-configuration.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/util.js [instrumentation] (ecmascript)");
;
;
function mergeHeaders(userProvidedHeaders, fallbackHeaders, defaultHeaders) {
    return async ()=>{
        const requiredHeaders = {
            ...await defaultHeaders()
        };
        const headers = {};
        // add fallback ones first
        if (fallbackHeaders != null) {
            Object.assign(headers, await fallbackHeaders());
        }
        // override with user-provided ones
        if (userProvidedHeaders != null) {
            Object.assign(headers, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["validateAndNormalizeHeaders"])(await userProvidedHeaders()));
        }
        // override required ones.
        return Object.assign(headers, requiredHeaders);
    };
}
function validateUserProvidedUrl(url) {
    if (url == null) {
        return undefined;
    }
    try {
        // NOTE: In non-browser environments, `globalThis.location` will be `undefined`.
        const base = globalThis.location?.href;
        return new URL(url, base).href;
    } catch  {
        throw new Error(`Configuration: Could not parse user-provided export URL: '${url}'`);
    }
}
function mergeOtlpHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["mergeOtlpSharedConfigurationWithDefaults"])(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration),
        headers: mergeHeaders(userProvidedConfiguration.headers, fallbackConfiguration.headers, defaultConfiguration.headers),
        url: validateUserProvidedUrl(userProvidedConfiguration.url) ?? fallbackConfiguration.url ?? defaultConfiguration.url
    };
}
function getHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getSharedConfigurationDefaults"])(),
        headers: async ()=>requiredHeaders,
        url: 'http://localhost:4318/' + signalResourcePath
    };
} //# sourceMappingURL=otlp-http-configuration.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-node-http-configuration.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "getNodeHttpConfigurationDefaults",
    ()=>getNodeHttpConfigurationDefaults,
    "httpAgentFactoryFromOptions",
    ()=>httpAgentFactoryFromOptions,
    "mergeOtlpNodeHttpConfigurationWithDefaults",
    ()=>mergeOtlpNodeHttpConfigurationWithDefaults
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-http-configuration.js [instrumentation] (ecmascript)");
;
function httpAgentFactoryFromOptions(options) {
    return async (protocol)=>{
        const isInsecure = protocol === 'http:';
        const module = isInsecure ? __turbopack_context__.A("[externals]/http [external] (http, cjs, async loader)") : __turbopack_context__.A("[externals]/https [external] (https, cjs, async loader)");
        const { Agent } = await module;
        if (isInsecure) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- these props should not be used in agent options
            const { ca, cert, key, ...insecureOptions } = options;
            return new Agent(insecureOptions);
        }
        return new Agent(options);
    };
}
function mergeOtlpNodeHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["mergeOtlpHttpConfigurationWithDefaults"])(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration),
        agentFactory: userProvidedConfiguration.agentFactory ?? fallbackConfiguration.agentFactory ?? defaultConfiguration.agentFactory,
        userAgent: userProvidedConfiguration.userAgent
    };
}
function getNodeHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getHttpConfigurationDefaults"])(requiredHeaders, signalResourcePath),
        agentFactory: httpAgentFactoryFromOptions({
            keepAlive: true
        })
    };
} //# sourceMappingURL=otlp-node-http-configuration.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/environment.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "getBooleanFromEnv",
    ()=>getBooleanFromEnv,
    "getNumberFromEnv",
    ()=>getNumberFromEnv,
    "getStringFromEnv",
    ()=>getStringFromEnv,
    "getStringListFromEnv",
    ()=>getStringListFromEnv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/util [external] (util, cjs)");
;
;
function getNumberFromEnv(key) {
    const raw = process.env[key];
    if (raw == null || raw.trim() === '') {
        return undefined;
    }
    const value = Number(raw);
    if (isNaN(value)) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Unknown value ${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__["inspect"])(raw)} for ${key}, expected a number, using defaults`);
        return undefined;
    }
    return value;
}
function getStringFromEnv(key) {
    const raw = process.env[key];
    if (raw == null || raw.trim() === '') {
        return undefined;
    }
    return raw;
}
function getBooleanFromEnv(key) {
    const raw = process.env[key]?.trim().toLowerCase();
    if (raw == null || raw === '') {
        // NOTE: falling back to `false` instead of `undefined` as required by the specification.
        // If you have a use-case that requires `undefined`, consider using `getStringFromEnv()` and applying the necessary
        // normalizations in the consuming code.
        return false;
    }
    if (raw === 'true') {
        return true;
    } else if (raw === 'false') {
        return false;
    } else {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Unknown value ${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__["inspect"])(raw)} for ${key}, expected 'true' or 'false', falling back to 'false' (default)`);
        return false;
    }
}
function getStringListFromEnv(key) {
    return getStringFromEnv(key)?.split(',').map((v)=>v.trim()).filter((s)=>s !== '');
} //# sourceMappingURL=environment.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "BaggageImpl",
    ()=>BaggageImpl
]);
var __read = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __values = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var BaggageImpl = function() {
    function BaggageImpl(entries) {
        this._entries = entries ? new Map(entries) : new Map();
    }
    BaggageImpl.prototype.getEntry = function(key) {
        var entry = this._entries.get(key);
        if (!entry) {
            return undefined;
        }
        return Object.assign({}, entry);
    };
    BaggageImpl.prototype.getAllEntries = function() {
        return Array.from(this._entries.entries()).map(function(_a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            return [
                k,
                v
            ];
        });
    };
    BaggageImpl.prototype.setEntry = function(key, entry) {
        var newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
    };
    BaggageImpl.prototype.removeEntry = function(key) {
        var newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
    };
    BaggageImpl.prototype.removeEntries = function() {
        var e_1, _a;
        var keys = [];
        for(var _i = 0; _i < arguments.length; _i++){
            keys[_i] = arguments[_i];
        }
        var newBaggage = new BaggageImpl(this._entries);
        try {
            for(var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()){
                var key = keys_1_1.value;
                newBaggage._entries.delete(key);
            }
        } catch (e_1_1) {
            e_1 = {
                error: e_1_1
            };
        } finally{
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            } finally{
                if (e_1) throw e_1.error;
            }
        }
        return newBaggage;
    };
    BaggageImpl.prototype.clear = function() {
        return new BaggageImpl();
    };
    return BaggageImpl;
}();
;
 //# sourceMappingURL=baggage-impl.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/baggage/internal/symbol.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Symbol used to make BaggageEntryMetadata an opaque type
 */ __turbopack_context__.s([
    "baggageEntryMetadataSymbol",
    ()=>baggageEntryMetadataSymbol
]);
var baggageEntryMetadataSymbol = Symbol('BaggageEntryMetadata'); //# sourceMappingURL=symbol.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/baggage/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "baggageEntryMetadataFromString",
    ()=>baggageEntryMetadataFromString,
    "createBaggage",
    ()=>createBaggage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$api$2f$diag$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/api/diag.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$baggage$2f$internal$2f$baggage$2d$impl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$baggage$2f$internal$2f$symbol$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/baggage/internal/symbol.js [instrumentation] (ecmascript)");
;
;
;
var diag = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$api$2f$diag$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagAPI"].instance();
function createBaggage(entries) {
    if (entries === void 0) {
        entries = {};
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$baggage$2f$internal$2f$baggage$2d$impl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BaggageImpl"](new Map(Object.entries(entries)));
}
function baggageEntryMetadataFromString(str) {
    if (typeof str !== 'string') {
        diag.error("Cannot create baggage metadata from unknown type: " + typeof str);
        str = '';
    }
    return {
        __TYPE__: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$baggage$2f$internal$2f$symbol$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["baggageEntryMetadataSymbol"],
        toString: function() {
            return str;
        }
    };
} //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/baggage/constants.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "BAGGAGE_HEADER",
    ()=>BAGGAGE_HEADER,
    "BAGGAGE_ITEMS_SEPARATOR",
    ()=>BAGGAGE_ITEMS_SEPARATOR,
    "BAGGAGE_KEY_PAIR_SEPARATOR",
    ()=>BAGGAGE_KEY_PAIR_SEPARATOR,
    "BAGGAGE_MAX_NAME_VALUE_PAIRS",
    ()=>BAGGAGE_MAX_NAME_VALUE_PAIRS,
    "BAGGAGE_MAX_PER_NAME_VALUE_PAIRS",
    ()=>BAGGAGE_MAX_PER_NAME_VALUE_PAIRS,
    "BAGGAGE_MAX_TOTAL_LENGTH",
    ()=>BAGGAGE_MAX_TOTAL_LENGTH,
    "BAGGAGE_PROPERTIES_SEPARATOR",
    ()=>BAGGAGE_PROPERTIES_SEPARATOR
]);
const BAGGAGE_KEY_PAIR_SEPARATOR = '=';
const BAGGAGE_PROPERTIES_SEPARATOR = ';';
const BAGGAGE_ITEMS_SEPARATOR = ',';
const BAGGAGE_HEADER = 'baggage';
const BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
const BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
const BAGGAGE_MAX_TOTAL_LENGTH = 8192; //# sourceMappingURL=constants.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/baggage/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "getKeyPairs",
    ()=>getKeyPairs,
    "parseKeyPairsIntoRecord",
    ()=>parseKeyPairsIntoRecord,
    "parsePairKeyValue",
    ()=>parsePairKeyValue,
    "serializeKeyPairs",
    ()=>serializeKeyPairs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/baggage/utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/baggage/constants.js [instrumentation] (ecmascript)");
;
;
function serializeKeyPairs(keyPairs) {
    return keyPairs.reduce((hValue, current)=>{
        const value = `${hValue}${hValue !== '' ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_ITEMS_SEPARATOR"] : ''}${current}`;
        return value.length > __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_MAX_TOTAL_LENGTH"] ? hValue : value;
    }, '');
}
function getKeyPairs(baggage) {
    return baggage.getAllEntries().map(([key, value])=>{
        let entry = `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`;
        // include opaque metadata if provided
        // NOTE: we intentionally don't URI-encode the metadata - that responsibility falls on the metadata implementation
        if (value.metadata !== undefined) {
            entry += __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_PROPERTIES_SEPARATOR"] + value.metadata.toString();
        }
        return entry;
    });
}
function parsePairKeyValue(entry) {
    if (!entry) return;
    const metadataSeparatorIndex = entry.indexOf(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_PROPERTIES_SEPARATOR"]);
    const keyPairPart = metadataSeparatorIndex === -1 ? entry : entry.substring(0, metadataSeparatorIndex);
    const separatorIndex = keyPairPart.indexOf(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_KEY_PAIR_SEPARATOR"]);
    if (separatorIndex <= 0) return;
    const rawKey = keyPairPart.substring(0, separatorIndex).trim();
    const rawValue = keyPairPart.substring(separatorIndex + 1).trim();
    if (!rawKey || !rawValue) return;
    let key;
    let value;
    try {
        key = decodeURIComponent(rawKey);
        value = decodeURIComponent(rawValue);
    } catch  {
        return;
    }
    let metadata;
    if (metadataSeparatorIndex !== -1 && metadataSeparatorIndex < entry.length - 1) {
        const metadataString = entry.substring(metadataSeparatorIndex + 1);
        metadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["baggageEntryMetadataFromString"])(metadataString);
    }
    return {
        key,
        value,
        metadata
    };
}
function parseKeyPairsIntoRecord(value) {
    const result = {};
    if (typeof value === 'string' && value.length > 0) {
        value.split(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_ITEMS_SEPARATOR"]).forEach((entry)=>{
            const keyPair = parsePairKeyValue(entry);
            if (keyPair !== undefined && keyPair.value.length > 0) {
                result[keyPair.key] = keyPair.value;
            }
        });
    }
    return result;
} //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-env-configuration.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "getSharedConfigurationFromEnvironment",
    ()=>getSharedConfigurationFromEnvironment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/environment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
;
function parseAndValidateTimeoutFromEnv(timeoutEnvVar) {
    const envTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getNumberFromEnv"])(timeoutEnvVar);
    if (envTimeout != null) {
        if (Number.isFinite(envTimeout) && envTimeout > 0) {
            return envTimeout;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Configuration: ${timeoutEnvVar} is invalid, expected number greater than 0 (actual: ${envTimeout})`);
    }
    return undefined;
}
function getTimeoutFromEnv(signalIdentifier) {
    const specificTimeout = parseAndValidateTimeoutFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_TIMEOUT`);
    const nonSpecificTimeout = parseAndValidateTimeoutFromEnv('OTEL_EXPORTER_OTLP_TIMEOUT');
    return specificTimeout ?? nonSpecificTimeout;
}
function parseAndValidateCompressionFromEnv(compressionEnvVar) {
    const compression = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])(compressionEnvVar)?.trim();
    if (compression == null || compression === 'none' || compression === 'gzip') {
        return compression;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Configuration: ${compressionEnvVar} is invalid, expected 'none' or 'gzip' (actual: '${compression}')`);
    return undefined;
}
function getCompressionFromEnv(signalIdentifier) {
    const specificCompression = parseAndValidateCompressionFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_COMPRESSION`);
    const nonSpecificCompression = parseAndValidateCompressionFromEnv('OTEL_EXPORTER_OTLP_COMPRESSION');
    return specificCompression ?? nonSpecificCompression;
}
function getSharedConfigurationFromEnvironment(signalIdentifier) {
    return {
        timeoutMillis: getTimeoutFromEnv(signalIdentifier),
        compression: getCompressionFromEnv(signalIdentifier)
    };
} //# sourceMappingURL=shared-env-configuration.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-node-http-env-configuration.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "getNodeHttpConfigurationFromEnvironment",
    ()=>getNodeHttpConfigurationFromEnvironment
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/environment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/baggage/utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$env$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-env-configuration.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-configuration.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-node-http-configuration.js [instrumentation] (ecmascript)");
;
;
;
;
;
;
;
function getStaticHeadersFromEnv(signalIdentifier) {
    const signalSpecificRawHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])(`OTEL_EXPORTER_OTLP_${signalIdentifier}_HEADERS`);
    const nonSignalSpecificRawHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])('OTEL_EXPORTER_OTLP_HEADERS');
    const signalSpecificHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["parseKeyPairsIntoRecord"])(signalSpecificRawHeaders);
    const nonSignalSpecificHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["parseKeyPairsIntoRecord"])(nonSignalSpecificRawHeaders);
    if (Object.keys(signalSpecificHeaders).length === 0 && Object.keys(nonSignalSpecificHeaders).length === 0) {
        return undefined;
    }
    // headers are combined instead of overwritten, with the specific headers taking precedence over
    // the non-specific ones.
    return Object.assign({}, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["parseKeyPairsIntoRecord"])(nonSignalSpecificRawHeaders), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["parseKeyPairsIntoRecord"])(signalSpecificRawHeaders));
}
function appendRootPathToUrlIfNeeded(url) {
    try {
        const parsedUrl = new URL(url);
        // This will automatically append '/' if there's no root path.
        return parsedUrl.toString();
    } catch  {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Configuration: Could not parse environment-provided export URL: '${url}', falling back to undefined`);
        return undefined;
    }
}
function appendResourcePathToUrl(url, path) {
    try {
        // just try to parse, if it fails we catch and warn.
        new URL(url);
    } catch  {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Configuration: Could not parse environment-provided export URL: '${url}', falling back to undefined`);
        return undefined;
    }
    if (!url.endsWith('/')) {
        url = url + '/';
    }
    url += path;
    try {
        // just try to parse, if it fails we catch and warn.
        new URL(url);
    } catch  {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Configuration: Provided URL appended with '${path}' is not a valid URL, using 'undefined' instead of '${url}'`);
        return undefined;
    }
    return url;
}
function getNonSpecificUrlFromEnv(signalResourcePath) {
    const envUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])('OTEL_EXPORTER_OTLP_ENDPOINT');
    if (envUrl === undefined) {
        return undefined;
    }
    return appendResourcePathToUrl(envUrl, signalResourcePath);
}
function getSpecificUrlFromEnv(signalIdentifier) {
    const envUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])(`OTEL_EXPORTER_OTLP_${signalIdentifier}_ENDPOINT`);
    if (envUrl === undefined) {
        return undefined;
    }
    return appendRootPathToUrlIfNeeded(envUrl);
}
function readFileFromEnv(signalSpecificEnvVar, nonSignalSpecificEnvVar, warningMessage) {
    const signalSpecificPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])(signalSpecificEnvVar);
    const nonSignalSpecificPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])(nonSignalSpecificEnvVar);
    const filePath = signalSpecificPath ?? nonSignalSpecificPath;
    if (filePath != null) {
        try {
            return __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["resolve"](process.cwd(), filePath));
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(warningMessage);
            return undefined;
        }
    } else {
        return undefined;
    }
}
function getClientCertificateFromEnv(signalIdentifier) {
    return readFileFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_CLIENT_CERTIFICATE`, 'OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE', 'Failed to read client certificate chain file');
}
function getClientKeyFromEnv(signalIdentifier) {
    return readFileFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_CLIENT_KEY`, 'OTEL_EXPORTER_OTLP_CLIENT_KEY', 'Failed to read client certificate private key file');
}
function getRootCertificateFromEnv(signalIdentifier) {
    return readFileFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_CERTIFICATE`, 'OTEL_EXPORTER_OTLP_CERTIFICATE', 'Failed to read root certificate file');
}
function getNodeHttpConfigurationFromEnvironment(signalIdentifier, signalResourcePath) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$env$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getSharedConfigurationFromEnvironment"])(signalIdentifier),
        url: getSpecificUrlFromEnv(signalIdentifier) ?? getNonSpecificUrlFromEnv(signalResourcePath),
        headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["wrapStaticHeadersInFunction"])(getStaticHeadersFromEnv(signalIdentifier)),
        agentFactory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["httpAgentFactoryFromOptions"])({
            keepAlive: true,
            ca: getRootCertificateFromEnv(signalIdentifier),
            cert: getClientCertificateFromEnv(signalIdentifier),
            key: getClientKeyFromEnv(signalIdentifier)
        })
    };
} //# sourceMappingURL=otlp-node-http-env-configuration.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-http-options.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "convertLegacyHeaders",
    ()=>convertLegacyHeaders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-configuration.js [instrumentation] (ecmascript)");
;
function convertLegacyHeaders(config) {
    if (typeof config.headers === 'function') {
        return config.headers;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["wrapStaticHeadersInFunction"])(config.headers);
} //# sourceMappingURL=convert-legacy-http-options.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-node-http-options.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertLegacyHttpOptions",
    ()=>convertLegacyHttpOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-node-http-configuration.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$env$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-node-http-env-configuration.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-http-options.js [instrumentation] (ecmascript)");
;
;
;
;
;
function convertLegacyAgentOptions(config) {
    if (typeof config.httpAgentOptions === 'function') {
        return config.httpAgentOptions;
    }
    let legacy = config.httpAgentOptions;
    if (config.keepAlive != null) {
        legacy = {
            keepAlive: config.keepAlive,
            ...legacy
        };
    }
    if (legacy != null) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["httpAgentFactoryFromOptions"])(legacy);
    } else {
        return undefined;
    }
}
function convertLegacyHttpOptions(config, signalIdentifier, signalResourcePath, requiredHeaders) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (config.metadata) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('Metadata cannot be set when using http');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["mergeOtlpNodeHttpConfigurationWithDefaults"])({
        url: config.url,
        headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["convertLegacyHeaders"])(config),
        concurrencyLimit: config.concurrencyLimit,
        timeoutMillis: config.timeoutMillis,
        compression: config.compression,
        agentFactory: convertLegacyAgentOptions(config),
        userAgent: config.userAgent
    }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$env$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getNodeHttpConfigurationFromEnvironment"])(signalIdentifier, signalResourcePath), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getNodeHttpConfigurationDefaults"])(requiredHeaders, signalResourcePath));
} //# sourceMappingURL=convert-legacy-node-http-options.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "ExportResultCode",
    ()=>ExportResultCode
]);
var ExportResultCode;
(function(ExportResultCode) {
    ExportResultCode[ExportResultCode["SUCCESS"] = 0] = "SUCCESS";
    ExportResultCode[ExportResultCode["FAILED"] = 1] = "FAILED";
})(ExportResultCode || (ExportResultCode = {})); //# sourceMappingURL=ExportResult.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/types.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Interface for handling error
 */ __turbopack_context__.s([
    "OTLPExporterError",
    ()=>OTLPExporterError
]);
class OTLPExporterError extends Error {
    code;
    name = 'OTLPExporterError';
    data;
    constructor(message, code, data){
        super(message);
        this.data = data;
        this.code = code;
    }
} //# sourceMappingURL=types.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/logging-response-handler.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "createLoggingPartialSuccessResponseHandler",
    ()=>createLoggingPartialSuccessResponseHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
function isPartialSuccessResponse(response) {
    return Object.prototype.hasOwnProperty.call(response, 'partialSuccess');
}
function createLoggingPartialSuccessResponseHandler() {
    return {
        handleResponse (response) {
            // Partial success MUST never be an empty object according the specification
            // see https://opentelemetry.io/docs/specs/otlp/#partial-success
            if (response == null || !isPartialSuccessResponse(response) || response.partialSuccess == null || Object.keys(response.partialSuccess).length === 0) {
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('Received Partial Success response:', JSON.stringify(response.partialSuccess));
        }
    };
} //# sourceMappingURL=logging-response-handler.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-export-delegate.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "createOtlpExportDelegate",
    ()=>createOtlpExportDelegate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/types.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$logging$2d$response$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/logging-response-handler.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
;
;
;
class OTLPExportDelegate {
    _diagLogger;
    _transport;
    _serializer;
    _responseHandler;
    _promiseQueue;
    _timeout;
    constructor(transport, serializer, responseHandler, promiseQueue, timeout){
        this._transport = transport;
        this._serializer = serializer;
        this._responseHandler = responseHandler;
        this._promiseQueue = promiseQueue;
        this._timeout = timeout;
        this._diagLogger = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].createComponentLogger({
            namespace: 'OTLPExportDelegate'
        });
    }
    export(internalRepresentation, resultCallback) {
        this._diagLogger.debug('items to be sent', internalRepresentation);
        // don't do any work if too many exports are in progress.
        if (this._promiseQueue.hasReachedLimit()) {
            resultCallback({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                error: new Error('Concurrent export limit reached')
            });
            return;
        }
        const serializedRequest = this._serializer.serializeRequest(internalRepresentation);
        if (serializedRequest == null) {
            resultCallback({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                error: new Error('Nothing to send')
            });
            return;
        }
        this._promiseQueue.pushPromise(this._transport.send(serializedRequest, this._timeout).then((response)=>{
            if (response.status === 'success') {
                if (response.data != null) {
                    try {
                        this._responseHandler.handleResponse(this._serializer.deserializeResponse(response.data));
                    } catch (e) {
                        this._diagLogger.warn('Export succeeded but could not deserialize response - is the response specification compliant?', e, response.data);
                    }
                }
                // No matter the response, we can consider the export still successful.
                resultCallback({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS
                });
                return;
            } else if (response.status === 'failure' && response.error) {
                resultCallback({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                    error: response.error
                });
                return;
            } else if (response.status === 'retryable') {
                resultCallback({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                    error: response.error ?? new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterError"]('Export failed with retryable status')
                });
            } else {
                resultCallback({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                    error: new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterError"]('Export failed with unknown error')
                });
            }
        }, (reason)=>resultCallback({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                error: reason
            })));
    }
    forceFlush() {
        return this._promiseQueue.awaitAll();
    }
    async shutdown() {
        this._diagLogger.debug('shutdown started');
        await this.forceFlush();
        this._transport.shutdown();
    }
}
function createOtlpExportDelegate(components, settings) {
    return new OTLPExportDelegate(components.transport, components.serializer, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$logging$2d$response$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createLoggingPartialSuccessResponseHandler"])(), components.promiseHandler, settings.timeout);
} //# sourceMappingURL=otlp-export-delegate.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/is-export-retryable.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "isExportHTTPErrorRetryable",
    ()=>isExportHTTPErrorRetryable,
    "parseRetryAfterToMills",
    ()=>parseRetryAfterToMills
]);
function isExportHTTPErrorRetryable(statusCode) {
    return statusCode === 429 || statusCode === 502 || statusCode === 503 || statusCode === 504;
}
function parseRetryAfterToMills(retryAfter) {
    if (retryAfter == null) {
        return undefined;
    }
    const seconds = Number.parseInt(retryAfter, 10);
    if (Number.isInteger(seconds)) {
        return seconds > 0 ? seconds * 1000 : -1;
    }
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After#directives
    const delay = new Date(retryAfter).getTime() - Date.now();
    if (delay >= 0) {
        return delay;
    }
    return 0;
} //# sourceMappingURL=is-export-retryable.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/version.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ // this is autogenerated file, see scripts/version-update.js
__turbopack_context__.s([
    "VERSION",
    ()=>VERSION
]);
const VERSION = '0.212.0'; //# sourceMappingURL=version.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/http-transport-utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compressAndSend",
    ()=>compressAndSend,
    "sendWithHttp",
    ()=>sendWithHttp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/zlib [external] (zlib, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/stream [external] (stream, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$is$2d$export$2d$retryable$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/is-export-retryable.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/types.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/version.js [instrumentation] (ecmascript)");
;
;
;
;
;
const DEFAULT_USER_AGENT = `OTel-OTLP-Exporter-JavaScript/${__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["VERSION"]}`;
function sendWithHttp(request, url, headers, compression, userAgent, agent, data, onDone, timeoutMillis) {
    const parsedUrl = new URL(url);
    if (userAgent) {
        headers['User-Agent'] = `${userAgent} ${DEFAULT_USER_AGENT}`;
    } else {
        headers['User-Agent'] = DEFAULT_USER_AGENT;
    }
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: 'POST',
        headers,
        agent
    };
    const req = request(options, (res)=>{
        const responseData = [];
        res.on('data', (chunk)=>responseData.push(chunk));
        res.on('end', ()=>{
            if (res.statusCode && res.statusCode < 299) {
                onDone({
                    status: 'success',
                    data: Buffer.concat(responseData)
                });
            } else if (res.statusCode && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$is$2d$export$2d$retryable$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isExportHTTPErrorRetryable"])(res.statusCode)) {
                onDone({
                    status: 'retryable',
                    retryInMillis: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$is$2d$export$2d$retryable$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["parseRetryAfterToMills"])(res.headers['retry-after'])
                });
            } else {
                const error = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterError"](res.statusMessage, res.statusCode, Buffer.concat(responseData).toString());
                onDone({
                    status: 'failure',
                    error
                });
            }
        });
    });
    req.setTimeout(timeoutMillis, ()=>{
        req.destroy();
        onDone({
            status: 'retryable',
            error: new Error('Request timed out')
        });
    });
    req.on('error', (error)=>{
        if (isHttpTransportNetworkErrorRetryable(error)) {
            onDone({
                status: 'retryable',
                error
            });
        } else {
            onDone({
                status: 'failure',
                error
            });
        }
    });
    compressAndSend(req, compression, data, (error)=>{
        onDone({
            status: 'failure',
            error
        });
    });
}
function compressAndSend(req, compression, data, onError) {
    let dataStream = readableFromUint8Array(data);
    if (compression === 'gzip') {
        req.setHeader('Content-Encoding', 'gzip');
        dataStream = dataStream.on('error', onError).pipe(__TURBOPACK__imported__module__$5b$externals$5d2f$zlib__$5b$external$5d$__$28$zlib$2c$__cjs$29$__["createGzip"]()).on('error', onError);
    }
    dataStream.pipe(req).on('error', onError);
}
function readableFromUint8Array(buff) {
    const readable = new __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["Readable"]();
    readable.push(buff);
    readable.push(null);
    return readable;
}
function isHttpTransportNetworkErrorRetryable(error) {
    const RETRYABLE_NETWORK_ERROR_CODES = new Set([
        'ECONNRESET',
        'ECONNREFUSED',
        'EPIPE',
        'ETIMEDOUT',
        'EAI_AGAIN',
        'ENOTFOUND',
        'ENETUNREACH',
        'EHOSTUNREACH'
    ]);
    if ('code' in error && typeof error.code === 'string') {
        return RETRYABLE_NETWORK_ERROR_CODES.has(error.code);
    }
    return false;
} //# sourceMappingURL=http-transport-utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/http-exporter-transport.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "createHttpExporterTransport",
    ()=>createHttpExporterTransport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$transport$2f$http$2d$transport$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/http-transport-utils.js [instrumentation] (ecmascript)");
;
class HttpExporterTransport {
    _utils = null;
    _parameters;
    constructor(parameters){
        this._parameters = parameters;
    }
    async send(data, timeoutMillis) {
        const { agent, request } = await this._loadUtils();
        const headers = await this._parameters.headers();
        return new Promise((resolve)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$transport$2f$http$2d$transport$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["sendWithHttp"])(request, this._parameters.url, headers, this._parameters.compression, this._parameters.userAgent, agent, data, (result)=>{
                resolve(result);
            }, timeoutMillis);
        });
    }
    shutdown() {
    // intentionally left empty, nothing to do.
    }
    async _loadUtils() {
        let utils = this._utils;
        if (utils === null) {
            const protocol = new URL(this._parameters.url).protocol;
            const [agent, request] = await Promise.all([
                this._parameters.agentFactory(protocol),
                requestFunctionFactory(protocol)
            ]);
            utils = this._utils = {
                agent,
                request
            };
        }
        return utils;
    }
}
async function requestFunctionFactory(protocol) {
    const module = protocol === 'http:' ? __turbopack_context__.A("[externals]/http [external] (http, cjs, async loader)") : __turbopack_context__.A("[externals]/https [external] (https, cjs, async loader)");
    const { request } = await module;
    return request;
}
function createHttpExporterTransport(parameters) {
    return new HttpExporterTransport(parameters);
} //# sourceMappingURL=http-exporter-transport.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/bounded-queue-export-promise-handler.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "createBoundedQueueExportPromiseHandler",
    ()=>createBoundedQueueExportPromiseHandler
]);
class BoundedQueueExportPromiseHandler {
    _concurrencyLimit;
    _sendingPromises = [];
    /**
     * @param concurrencyLimit maximum promises allowed in a queue at the same time.
     */ constructor(concurrencyLimit){
        this._concurrencyLimit = concurrencyLimit;
    }
    pushPromise(promise) {
        if (this.hasReachedLimit()) {
            throw new Error('Concurrency Limit reached');
        }
        this._sendingPromises.push(promise);
        const popPromise = ()=>{
            const index = this._sendingPromises.indexOf(promise);
            void this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
    }
    hasReachedLimit() {
        return this._sendingPromises.length >= this._concurrencyLimit;
    }
    async awaitAll() {
        await Promise.all(this._sendingPromises);
    }
}
function createBoundedQueueExportPromiseHandler(options) {
    return new BoundedQueueExportPromiseHandler(options.concurrencyLimit);
} //# sourceMappingURL=bounded-queue-export-promise-handler.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/retrying-transport.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "createRetryingTransport",
    ()=>createRetryingTransport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
const MAX_ATTEMPTS = 5;
const INITIAL_BACKOFF = 1000;
const MAX_BACKOFF = 5000;
const BACKOFF_MULTIPLIER = 1.5;
const JITTER = 0.2;
/**
 * Get a pseudo-random jitter that falls in the range of [-JITTER, +JITTER]
 */ function getJitter() {
    return Math.random() * (2 * JITTER) - JITTER;
}
class RetryingTransport {
    _transport;
    constructor(transport){
        this._transport = transport;
    }
    retry(data, timeoutMillis, inMillis) {
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                this._transport.send(data, timeoutMillis).then(resolve, reject);
            }, inMillis);
        });
    }
    async send(data, timeoutMillis) {
        let attempts = MAX_ATTEMPTS;
        let nextBackoff = INITIAL_BACKOFF;
        const deadline = Date.now() + timeoutMillis;
        let result = await this._transport.send(data, timeoutMillis);
        while(result.status === 'retryable' && attempts > 0){
            attempts--;
            // use maximum of computed backoff and 0 to avoid negative timeouts
            const backoff = Math.max(Math.min(nextBackoff * (1 + getJitter()), MAX_BACKOFF), 0);
            nextBackoff = nextBackoff * BACKOFF_MULTIPLIER;
            const retryInMillis = result.retryInMillis ?? backoff;
            // return when expected retry time is after the export deadline.
            const remainingTimeoutMillis = deadline - Date.now();
            if (retryInMillis > remainingTimeoutMillis) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].info(`Export retry time ${Math.round(retryInMillis)}ms exceeds remaining timeout ${Math.round(remainingTimeoutMillis)}ms, not retrying further.`);
                return result;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].verbose(`Scheduling export retry in ${Math.round(retryInMillis)}ms`);
            result = await this.retry(data, remainingTimeoutMillis, retryInMillis);
        }
        if (result.status === 'success') {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].verbose(`Export succeeded after ${MAX_ATTEMPTS - attempts} retry attempts.`);
        } else if (result.status === 'retryable') {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].info(`Export failed after maximum retry attempts (${MAX_ATTEMPTS}).`);
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].info(`Export failed with non-retryable error: ${result.error}`);
        }
        return result;
    }
    shutdown() {
        return this._transport.shutdown();
    }
}
function createRetryingTransport(options) {
    return new RetryingTransport(options.transport);
} //# sourceMappingURL=retrying-transport.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-http-export-delegate.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "createOtlpHttpExportDelegate",
    ()=>createOtlpHttpExportDelegate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-export-delegate.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$transport$2f$http$2d$exporter$2d$transport$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/http-exporter-transport.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$bounded$2d$queue$2d$export$2d$promise$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/bounded-queue-export-promise-handler.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$retrying$2d$transport$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/retrying-transport.js [instrumentation] (ecmascript)");
;
;
;
;
function createOtlpHttpExportDelegate(options, serializer) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpExportDelegate"])({
        transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$retrying$2d$transport$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createRetryingTransport"])({
            transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$transport$2f$http$2d$exporter$2d$transport$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createHttpExporterTransport"])(options)
        }),
        serializer: serializer,
        promiseHandler: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$bounded$2d$queue$2d$export$2d$promise$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createBoundedQueueExportPromiseHandler"])(options)
    }, {
        timeout: options.timeoutMillis
    });
} //# sourceMappingURL=otlp-http-export-delegate.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/platform/node/OTLPTraceExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ __turbopack_context__.s([
    "OTLPTraceExporter",
    ()=>OTLPTraceExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$trace$2f$json$2f$trace$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/trace/json/trace.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-node-http-options.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-http-export-delegate.js [instrumentation] (ecmascript)");
;
;
;
class OTLPTraceExporter extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterBase"] {
    constructor(config = {}){
        super((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpHttpExportDelegate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["convertLegacyHttpOptions"])(config, 'TRACES', 'v1/traces', {
            'Content-Type': 'application/json'
        }), __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$trace$2f$json$2f$trace$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["JsonTraceSerializer"]));
    }
} //# sourceMappingURL=OTLPTraceExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OTLPTraceExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$trace$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPTraceExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPTraceExporter"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$trace$2d$otlp$2d$http$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$trace$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPTraceExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/platform/node/OTLPTraceExporter.js [instrumentation] (ecmascript)");
}),
];

//# sourceMappingURL=095e5_%40opentelemetry_8d15021c._.js.map