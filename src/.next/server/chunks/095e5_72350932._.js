module.exports = [
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "isTracingSuppressed",
    ()=>isTracingSuppressed,
    "suppressTracing",
    ()=>suppressTracing,
    "unsuppressTracing",
    ()=>unsuppressTracing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2f$context$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/context/context.js [instrumentation] (ecmascript)");
;
const SUPPRESS_TRACING_KEY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2f$context$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createContextKey"])('OpenTelemetry SDK Context Key SUPPRESS_TRACING');
function suppressTracing(context) {
    return context.setValue(SUPPRESS_TRACING_KEY, true);
}
function unsuppressTracing(context) {
    return context.deleteValue(SUPPRESS_TRACING_KEY);
}
function isTracingSuppressed(context) {
    return context.getValue(SUPPRESS_TRACING_KEY) === true;
} //# sourceMappingURL=suppress-tracing.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/internal/exporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "_export",
    ()=>_export
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/context-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js [instrumentation] (ecmascript)");
;
;
function _export(exporter, arg) {
    return new Promise((resolve)=>{
        // prevent downstream exporter calls from generating spans
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["context"].with((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["suppressTracing"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["context"].active()), ()=>{
            exporter.export(arg, resolve);
        });
    });
} //# sourceMappingURL=exporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
    "internal",
    ()=>internal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$internal$2f$exporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/internal/exporter.js [instrumentation] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const internal = {
    _export: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$internal$2f$exporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["_export"]
}; //# sourceMappingURL=index.js.map
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/baggage/propagation/W3CBaggagePropagator.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "W3CBaggagePropagator",
    ()=>W3CBaggagePropagator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$propagation$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/propagation-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/baggage/constants.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/baggage/utils.js [instrumentation] (ecmascript)");
;
;
;
;
class W3CBaggagePropagator {
    inject(context, carrier, setter) {
        const baggage = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$propagation$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["propagation"].getBaggage(context);
        if (!baggage || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isTracingSuppressed"])(context)) return;
        const keyPairs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getKeyPairs"])(baggage).filter((pair)=>{
            return pair.length <= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_MAX_PER_NAME_VALUE_PAIRS"];
        }).slice(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_MAX_NAME_VALUE_PAIRS"]);
        const headerValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["serializeKeyPairs"])(keyPairs);
        if (headerValue.length > 0) {
            setter.set(carrier, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_HEADER"], headerValue);
        }
    }
    extract(context, carrier, getter) {
        const headerValue = getter.get(carrier, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_HEADER"]);
        const baggageString = Array.isArray(headerValue) ? headerValue.join(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_ITEMS_SEPARATOR"]) : headerValue;
        if (!baggageString) return context;
        const baggage = {};
        if (baggageString.length === 0) {
            return context;
        }
        const pairs = baggageString.split(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_ITEMS_SEPARATOR"]);
        pairs.forEach((entry)=>{
            const keyPair = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["parsePairKeyValue"])(entry);
            if (keyPair) {
                const baggageEntry = {
                    value: keyPair.value
                };
                if (keyPair.metadata) {
                    baggageEntry.metadata = keyPair.metadata;
                }
                baggage[keyPair.key] = baggageEntry;
            }
        });
        if (Object.entries(baggage).length === 0) {
            return context;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$propagation$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["propagation"].setBaggage(context, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$propagation$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["propagation"].createBaggage(baggage));
    }
    fields() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BAGGAGE_HEADER"]
        ];
    }
} //# sourceMappingURL=W3CBaggagePropagator.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/anchored-clock.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * A utility for returning wall times anchored to a given point in time. Wall time measurements will
 * not be taken from the system, but instead are computed by adding a monotonic clock time
 * to the anchor point.
 *
 * This is needed because the system time can change and result in unexpected situations like
 * spans ending before they are started. Creating an anchored clock for each local root span
 * ensures that span timings and durations are accurate while preventing span times from drifting
 * too far from the system clock.
 *
 * Only creating an anchored clock once per local trace ensures span times are correct relative
 * to each other. For example, a child span will never have a start time before its parent even
 * if the system clock is corrected during the local trace.
 *
 * Heavily inspired by the OTel Java anchored clock
 * https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk/trace/src/main/java/io/opentelemetry/sdk/trace/AnchoredClock.java
 */ __turbopack_context__.s([
    "AnchoredClock",
    ()=>AnchoredClock
]);
class AnchoredClock {
    _monotonicClock;
    _epochMillis;
    _performanceMillis;
    /**
     * Create a new AnchoredClock anchored to the current time returned by systemClock.
     *
     * @param systemClock should be a clock that returns the number of milliseconds since January 1 1970 such as Date
     * @param monotonicClock should be a clock that counts milliseconds monotonically such as window.performance or perf_hooks.performance
     */ constructor(systemClock, monotonicClock){
        this._monotonicClock = monotonicClock;
        this._epochMillis = systemClock.now();
        this._performanceMillis = monotonicClock.now();
    }
    /**
     * Returns the current time by adding the number of milliseconds since the
     * AnchoredClock was created to the creation epoch time
     */ now() {
        const delta = this._monotonicClock.now() - this._performanceMillis;
        return this._epochMillis + delta;
    }
} //# sourceMappingURL=anchored-clock.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/attributes.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "isAttributeKey",
    ()=>isAttributeKey,
    "isAttributeValue",
    ()=>isAttributeValue,
    "sanitizeAttributes",
    ()=>sanitizeAttributes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
function sanitizeAttributes(attributes) {
    const out = {};
    if (typeof attributes !== 'object' || attributes == null) {
        return out;
    }
    for(const key in attributes){
        if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
            continue;
        }
        if (!isAttributeKey(key)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Invalid attribute key: ${key}`);
            continue;
        }
        const val = attributes[key];
        if (!isAttributeValue(val)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Invalid attribute value set for key: ${key}`);
            continue;
        }
        if (Array.isArray(val)) {
            out[key] = val.slice();
        } else {
            out[key] = val;
        }
    }
    return out;
}
function isAttributeKey(key) {
    return typeof key === 'string' && key !== '';
}
function isAttributeValue(val) {
    if (val == null) {
        return true;
    }
    if (Array.isArray(val)) {
        return isHomogeneousAttributeValueArray(val);
    }
    return isValidPrimitiveAttributeValueType(typeof val);
}
function isHomogeneousAttributeValueArray(arr) {
    let type;
    for (const element of arr){
        // null/undefined elements are allowed
        if (element == null) continue;
        const elementType = typeof element;
        if (elementType === type) {
            continue;
        }
        if (!type) {
            if (isValidPrimitiveAttributeValueType(elementType)) {
                type = elementType;
                continue;
            }
            // encountered an invalid primitive
            return false;
        }
        return false;
    }
    return true;
}
function isValidPrimitiveAttributeValueType(valType) {
    switch(valType){
        case 'number':
        case 'boolean':
        case 'string':
            return true;
    }
    return false;
} //# sourceMappingURL=attributes.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/logging-error-handler.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "loggingErrorHandler",
    ()=>loggingErrorHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
function loggingErrorHandler() {
    return (ex)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error(stringifyException(ex));
    };
}
/**
 * Converts an exception into a string representation
 * @param {Exception} ex
 */ function stringifyException(ex) {
    if (typeof ex === 'string') {
        return ex;
    } else {
        return JSON.stringify(flattenException(ex));
    }
}
/**
 * Flattens an exception into key-value pairs by traversing the prototype chain
 * and coercing values to strings. Duplicate properties will not be overwritten;
 * the first insert wins.
 */ function flattenException(ex) {
    const result = {};
    let current = ex;
    while(current !== null){
        Object.getOwnPropertyNames(current).forEach((propertyName)=>{
            if (result[propertyName]) return;
            const value = current[propertyName];
            if (value) {
                result[propertyName] = String(value);
            }
        });
        current = Object.getPrototypeOf(current);
    }
    return result;
} //# sourceMappingURL=logging-error-handler.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "globalErrorHandler",
    ()=>globalErrorHandler,
    "setGlobalErrorHandler",
    ()=>setGlobalErrorHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$logging$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/logging-error-handler.js [instrumentation] (ecmascript)");
;
/** The global error handler delegate */ let delegateHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$logging$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["loggingErrorHandler"])();
function setGlobalErrorHandler(handler) {
    delegateHandler = handler;
}
function globalErrorHandler(ex) {
    try {
        delegateHandler(ex);
    } catch  {} // eslint-disable-line no-empty
} //# sourceMappingURL=global-error-handler.js.map
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/timer-util.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * @deprecated please copy this code to your implementation instead, this function will be removed in the next major version of this package.
 * @param timer
 */ __turbopack_context__.s([
    "unrefTimer",
    ()=>unrefTimer
]);
function unrefTimer(timer) {
    if (typeof timer !== 'number') {
        timer.unref();
    }
} //# sourceMappingURL=timer-util.js.map
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/version.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
const VERSION = '2.5.1'; //# sourceMappingURL=version.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/semconv.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ /*
 * This file contains a copy of unstable semantic convention definitions
 * used by this package.
 * @see https://github.com/open-telemetry/opentelemetry-js/tree/main/semantic-conventions#unstable-semconv
 */ /**
 * The name of the runtime of this process.
 *
 * @example OpenJDK Runtime Environment
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */ __turbopack_context__.s([
    "ATTR_PROCESS_RUNTIME_NAME",
    ()=>ATTR_PROCESS_RUNTIME_NAME
]);
const ATTR_PROCESS_RUNTIME_NAME = 'process.runtime.name'; //# sourceMappingURL=semconv.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/sdk-info.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "SDK_INFO",
    ()=>SDK_INFO
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/version.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_attributes.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/semconv.js [instrumentation] (ecmascript)");
;
;
;
const SDK_INFO = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_TELEMETRY_SDK_NAME"]]: 'opentelemetry',
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_RUNTIME_NAME"]]: 'node',
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_TELEMETRY_SDK_LANGUAGE"]]: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS"],
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_TELEMETRY_SDK_VERSION"]]: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$version$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["VERSION"]
}; //# sourceMappingURL=sdk-info.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/globalThis.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * @deprecated Use globalThis directly instead.
 */ __turbopack_context__.s([
    "_globalThis",
    ()=>_globalThis
]);
const _globalThis = globalThis; //# sourceMappingURL=globalThis.js.map
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/propagation/composite.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "CompositePropagator",
    ()=>CompositePropagator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
class CompositePropagator {
    _propagators;
    _fields;
    /**
     * Construct a composite propagator from a list of propagators.
     *
     * @param [config] Configuration object for composite propagator
     */ constructor(config = {}){
        this._propagators = config.propagators ?? [];
        this._fields = Array.from(new Set(this._propagators// older propagators may not have fields function, null check to be sure
        .map((p)=>typeof p.fields === 'function' ? p.fields() : []).reduce((x, y)=>x.concat(y), [])));
    }
    /**
     * Run each of the configured propagators with the given context and carrier.
     * Propagators are run in the order they are configured, so if multiple
     * propagators write the same carrier key, the propagator later in the list
     * will "win".
     *
     * @param context Context to inject
     * @param carrier Carrier into which context will be injected
     */ inject(context, carrier, setter) {
        for (const propagator of this._propagators){
            try {
                propagator.inject(context, carrier, setter);
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
            }
        }
    }
    /**
     * Run each of the configured propagators with the given context and carrier.
     * Propagators are run in the order they are configured, so if multiple
     * propagators write the same context key, the propagator later in the list
     * will "win".
     *
     * @param context Context to add values to
     * @param carrier Carrier from which to extract context
     */ extract(context, carrier, getter) {
        return this._propagators.reduce((ctx, propagator)=>{
            try {
                return propagator.extract(ctx, carrier, getter);
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Failed to extract with ${propagator.constructor.name}. Err: ${err.message}`);
            }
            return ctx;
        }, context);
    }
    fields() {
        // return a new array so our fields cannot be modified
        return this._fields.slice();
    }
} //# sourceMappingURL=composite.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/internal/validators.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "validateKey",
    ()=>validateKey,
    "validateValue",
    ()=>validateValue
]);
const VALID_KEY_CHAR_RANGE = '[_0-9a-z-*/]';
const VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`;
const VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`;
const VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`);
const VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
const INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
function validateKey(key) {
    return VALID_KEY_REGEX.test(key);
}
function validateValue(value) {
    return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
} //# sourceMappingURL=validators.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/TraceState.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "TraceState",
    ()=>TraceState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$internal$2f$validators$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/internal/validators.js [instrumentation] (ecmascript)");
;
const MAX_TRACE_STATE_ITEMS = 32;
const MAX_TRACE_STATE_LEN = 512;
const LIST_MEMBERS_SEPARATOR = ',';
const LIST_MEMBER_KEY_VALUE_SPLITTER = '=';
class TraceState {
    _internalState = new Map();
    constructor(rawTraceState){
        if (rawTraceState) this._parse(rawTraceState);
    }
    set(key, value) {
        // TODO: Benchmark the different approaches(map vs list) and
        // use the faster one.
        const traceState = this._clone();
        if (traceState._internalState.has(key)) {
            traceState._internalState.delete(key);
        }
        traceState._internalState.set(key, value);
        return traceState;
    }
    unset(key) {
        const traceState = this._clone();
        traceState._internalState.delete(key);
        return traceState;
    }
    get(key) {
        return this._internalState.get(key);
    }
    serialize() {
        return this._keys().reduce((agg, key)=>{
            agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
            return agg;
        }, []).join(LIST_MEMBERS_SEPARATOR);
    }
    _parse(rawTraceState) {
        if (rawTraceState.length > MAX_TRACE_STATE_LEN) return;
        this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reverse() // Store in reverse so new keys (.set(...)) will be placed at the beginning
        .reduce((agg, part)=>{
            const listMember = part.trim(); // Optional Whitespace (OWS) handling
            const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
            if (i !== -1) {
                const key = listMember.slice(0, i);
                const value = listMember.slice(i + 1, part.length);
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$internal$2f$validators$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["validateKey"])(key) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$internal$2f$validators$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["validateValue"])(value)) {
                    agg.set(key, value);
                } else {
                // TODO: Consider to add warning log
                }
            }
            return agg;
        }, new Map());
        // Because of the reverse() requirement, trunc must be done after map is created
        if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
            this._internalState = new Map(Array.from(this._internalState.entries()).reverse() // Use reverse same as original tracestate parse chain
            .slice(0, MAX_TRACE_STATE_ITEMS));
        }
    }
    _keys() {
        return Array.from(this._internalState.keys()).reverse();
    }
    _clone() {
        const traceState = new TraceState();
        traceState._internalState = new Map(this._internalState);
        return traceState;
    }
} //# sourceMappingURL=TraceState.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/W3CTraceContextPropagator.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "TRACE_PARENT_HEADER",
    ()=>TRACE_PARENT_HEADER,
    "TRACE_STATE_HEADER",
    ()=>TRACE_STATE_HEADER,
    "W3CTraceContextPropagator",
    ()=>W3CTraceContextPropagator,
    "parseTraceParent",
    ()=>parseTraceParent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$TraceState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/TraceState.js [instrumentation] (ecmascript)");
;
;
;
const TRACE_PARENT_HEADER = 'traceparent';
const TRACE_STATE_HEADER = 'tracestate';
const VERSION = '00';
const VERSION_PART = '(?!ff)[\\da-f]{2}';
const TRACE_ID_PART = '(?![0]{32})[\\da-f]{32}';
const PARENT_ID_PART = '(?![0]{16})[\\da-f]{16}';
const FLAGS_PART = '[\\da-f]{2}';
const TRACE_PARENT_REGEX = new RegExp(`^\\s?(${VERSION_PART})-(${TRACE_ID_PART})-(${PARENT_ID_PART})-(${FLAGS_PART})(-.*)?\\s?$`);
function parseTraceParent(traceParent) {
    const match = TRACE_PARENT_REGEX.exec(traceParent);
    if (!match) return null;
    // According to the specification the implementation should be compatible
    // with future versions. If there are more parts, we only reject it if it's using version 00
    // See https://www.w3.org/TR/trace-context/#versioning-of-traceparent
    if (match[1] === '00' && match[5]) return null;
    return {
        traceId: match[2],
        spanId: match[3],
        traceFlags: parseInt(match[4], 16)
    };
}
class W3CTraceContextPropagator {
    inject(context, carrier, setter) {
        const spanContext = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].getSpanContext(context);
        if (!spanContext || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isTracingSuppressed"])(context) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isSpanContextValid"])(spanContext)) return;
        const traceParent = `${VERSION}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].NONE).toString(16)}`;
        setter.set(carrier, TRACE_PARENT_HEADER, traceParent);
        if (spanContext.traceState) {
            setter.set(carrier, TRACE_STATE_HEADER, spanContext.traceState.serialize());
        }
    }
    extract(context, carrier, getter) {
        const traceParentHeader = getter.get(carrier, TRACE_PARENT_HEADER);
        if (!traceParentHeader) return context;
        const traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
        if (typeof traceParent !== 'string') return context;
        const spanContext = parseTraceParent(traceParent);
        if (!spanContext) return context;
        spanContext.isRemote = true;
        const traceStateHeader = getter.get(carrier, TRACE_STATE_HEADER);
        if (traceStateHeader) {
            // If more than one `tracestate` header is found, we merge them into a
            // single header.
            const state = Array.isArray(traceStateHeader) ? traceStateHeader.join(',') : traceStateHeader;
            spanContext.traceState = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$TraceState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceState"](typeof state === 'string' ? state : undefined);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].setSpanContext(context, spanContext);
    }
    fields() {
        return [
            TRACE_PARENT_HEADER,
            TRACE_STATE_HEADER
        ];
    }
} //# sourceMappingURL=W3CTraceContextPropagator.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/rpc-metadata.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "RPCType",
    ()=>RPCType,
    "deleteRPCMetadata",
    ()=>deleteRPCMetadata,
    "getRPCMetadata",
    ()=>getRPCMetadata,
    "setRPCMetadata",
    ()=>setRPCMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2f$context$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/context/context.js [instrumentation] (ecmascript)");
;
const RPC_METADATA_KEY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2f$context$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createContextKey"])('OpenTelemetry SDK Context Key RPC_METADATA');
var RPCType;
(function(RPCType) {
    RPCType["HTTP"] = "http";
})(RPCType || (RPCType = {}));
function setRPCMetadata(context, meta) {
    return context.setValue(RPC_METADATA_KEY, meta);
}
function deleteRPCMetadata(context) {
    return context.deleteValue(RPC_METADATA_KEY);
}
function getRPCMetadata(context) {
    return context.getValue(RPC_METADATA_KEY);
} //# sourceMappingURL=rpc-metadata.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/lodash.merge.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ /* eslint-disable @typescript-eslint/no-explicit-any */ /**
 * based on lodash in order to support esm builds without esModuleInterop.
 * lodash is using MIT License.
 **/ __turbopack_context__.s([
    "isPlainObject",
    ()=>isPlainObject
]);
const objectTag = '[object Object]';
const nullTag = '[object Null]';
const undefinedTag = '[object Undefined]';
const funcProto = Function.prototype;
const funcToString = funcProto.toString;
const objectCtorString = funcToString.call(Object);
const getPrototypeOf = Object.getPrototypeOf;
const objectProto = Object.prototype;
const hasOwnProperty = objectProto.hasOwnProperty;
const symToStringTag = Symbol ? Symbol.toStringTag : undefined;
const nativeObjectToString = objectProto.toString;
function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) !== objectTag) {
        return false;
    }
    const proto = getPrototypeOf(value);
    if (proto === null) {
        return true;
    }
    const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return value != null && typeof value == 'object';
}
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */ function baseGetTag(value) {
    if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */ function getRawTag(value) {
    const isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    let unmasked = false;
    try {
        value[symToStringTag] = undefined;
        unmasked = true;
    } catch  {
    // silence
    }
    const result = nativeObjectToString.call(value);
    if (unmasked) {
        if (isOwn) {
            value[symToStringTag] = tag;
        } else {
            delete value[symToStringTag];
        }
    }
    return result;
}
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */ function objectToString(value) {
    return nativeObjectToString.call(value);
} //# sourceMappingURL=lodash.merge.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/merge.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ /* eslint-disable @typescript-eslint/no-explicit-any */ __turbopack_context__.s([
    "merge",
    ()=>merge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$lodash$2e$merge$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/lodash.merge.js [instrumentation] (ecmascript)");
;
const MAX_LEVEL = 20;
function merge(...args) {
    let result = args.shift();
    const objects = new WeakMap();
    while(args.length > 0){
        result = mergeTwoObjects(result, args.shift(), 0, objects);
    }
    return result;
}
function takeValue(value) {
    if (isArray(value)) {
        return value.slice();
    }
    return value;
}
/**
 * Merges two objects
 * @param one - first object
 * @param two - second object
 * @param level - current deep level
 * @param objects - objects holder that has been already referenced - to prevent
 * cyclic dependency
 */ function mergeTwoObjects(one, two, level = 0, objects) {
    let result;
    if (level > MAX_LEVEL) {
        return undefined;
    }
    level++;
    if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) {
        result = takeValue(two);
    } else if (isArray(one)) {
        result = one.slice();
        if (isArray(two)) {
            for(let i = 0, j = two.length; i < j; i++){
                result.push(takeValue(two[i]));
            }
        } else if (isObject(two)) {
            const keys = Object.keys(two);
            for(let i = 0, j = keys.length; i < j; i++){
                const key = keys[i];
                result[key] = takeValue(two[key]);
            }
        }
    } else if (isObject(one)) {
        if (isObject(two)) {
            if (!shouldMerge(one, two)) {
                return two;
            }
            result = Object.assign({}, one);
            const keys = Object.keys(two);
            for(let i = 0, j = keys.length; i < j; i++){
                const key = keys[i];
                const twoValue = two[key];
                if (isPrimitive(twoValue)) {
                    if (typeof twoValue === 'undefined') {
                        delete result[key];
                    } else {
                        // result[key] = takeValue(twoValue);
                        result[key] = twoValue;
                    }
                } else {
                    const obj1 = result[key];
                    const obj2 = twoValue;
                    if (wasObjectReferenced(one, key, objects) || wasObjectReferenced(two, key, objects)) {
                        delete result[key];
                    } else {
                        if (isObject(obj1) && isObject(obj2)) {
                            const arr1 = objects.get(obj1) || [];
                            const arr2 = objects.get(obj2) || [];
                            arr1.push({
                                obj: one,
                                key
                            });
                            arr2.push({
                                obj: two,
                                key
                            });
                            objects.set(obj1, arr1);
                            objects.set(obj2, arr2);
                        }
                        result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
                    }
                }
            }
        } else {
            result = two;
        }
    }
    return result;
}
/**
 * Function to check if object has been already reference
 * @param obj
 * @param key
 * @param objects
 */ function wasObjectReferenced(obj, key, objects) {
    const arr = objects.get(obj[key]) || [];
    for(let i = 0, j = arr.length; i < j; i++){
        const info = arr[i];
        if (info.key === key && info.obj === obj) {
            return true;
        }
    }
    return false;
}
function isArray(value) {
    return Array.isArray(value);
}
function isFunction(value) {
    return typeof value === 'function';
}
function isObject(value) {
    return !isPrimitive(value) && !isArray(value) && !isFunction(value) && typeof value === 'object';
}
function isPrimitive(value) {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'undefined' || value instanceof Date || value instanceof RegExp || value === null;
}
function shouldMerge(one, two) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$lodash$2e$merge$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isPlainObject"])(one) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$lodash$2e$merge$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isPlainObject"])(two)) {
        return false;
    }
    return true;
} //# sourceMappingURL=merge.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/timeout.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * Error that is thrown on timeouts.
 */ __turbopack_context__.s([
    "TimeoutError",
    ()=>TimeoutError,
    "callWithTimeout",
    ()=>callWithTimeout
]);
class TimeoutError extends Error {
    constructor(message){
        super(message);
        // manually adjust prototype to retain `instanceof` functionality when targeting ES5, see:
        // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}
function callWithTimeout(promise, timeout) {
    let timeoutHandle;
    const timeoutPromise = new Promise(function timeoutFunction(_resolve, reject) {
        timeoutHandle = setTimeout(function timeoutHandler() {
            reject(new TimeoutError('Operation timed out.'));
        }, timeout);
    });
    return Promise.race([
        promise,
        timeoutPromise
    ]).then((result)=>{
        clearTimeout(timeoutHandle);
        return result;
    }, (reason)=>{
        clearTimeout(timeoutHandle);
        throw reason;
    });
} //# sourceMappingURL=timeout.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/url.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "isUrlIgnored",
    ()=>isUrlIgnored,
    "urlMatches",
    ()=>urlMatches
]);
function urlMatches(url, urlToMatch) {
    if (typeof urlToMatch === 'string') {
        return url === urlToMatch;
    } else {
        return !!url.match(urlToMatch);
    }
}
function isUrlIgnored(url, ignoredUrls) {
    if (!ignoredUrls) {
        return false;
    }
    for (const ignoreUrl of ignoredUrls){
        if (urlMatches(url, ignoreUrl)) {
            return true;
        }
    }
    return false;
} //# sourceMappingURL=url.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/promise.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "Deferred",
    ()=>Deferred
]);
class Deferred {
    _promise;
    _resolve;
    _reject;
    constructor(){
        this._promise = new Promise((resolve, reject)=>{
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    get promise() {
        return this._promise;
    }
    resolve(val) {
        this._resolve(val);
    }
    reject(err) {
        this._reject(err);
    }
} //# sourceMappingURL=promise.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/callback.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "BindOnceFuture",
    ()=>BindOnceFuture
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$promise$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/promise.js [instrumentation] (ecmascript)");
;
class BindOnceFuture {
    _isCalled = false;
    _deferred = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$promise$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["Deferred"]();
    _callback;
    _that;
    constructor(callback, that){
        this._callback = callback;
        this._that = that;
    }
    get isCalled() {
        return this._isCalled;
    }
    get promise() {
        return this._deferred.promise;
    }
    call(...args) {
        if (!this._isCalled) {
            this._isCalled = true;
            try {
                Promise.resolve(this._callback.call(this._that, ...args)).then((val)=>this._deferred.resolve(val), (err)=>this._deferred.reject(err));
            } catch (err) {
                this._deferred.reject(err);
            }
        }
        return this._deferred.promise;
    }
} //# sourceMappingURL=callback.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/configuration.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "diagLogLevelFromString",
    ()=>diagLogLevelFromString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag/types.js [instrumentation] (ecmascript)");
;
const logLevelMap = {
    ALL: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].ALL,
    VERBOSE: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].VERBOSE,
    DEBUG: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].DEBUG,
    INFO: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].INFO,
    WARN: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].WARN,
    ERROR: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].ERROR,
    NONE: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].NONE
};
function diagLogLevelFromString(value) {
    if (value == null) {
        // don't fall back to default - no value set has different semantics for ús than an incorrect value (do not set vs. fall back to default)
        return undefined;
    }
    const resolvedLogLevel = logLevelMap[value.toUpperCase()];
    if (resolvedLogLevel == null) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Unknown log level "${value}", expected one of ${Object.keys(logLevelMap)}, using default`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DiagLogLevel"].INFO;
    }
    return resolvedLogLevel;
} //# sourceMappingURL=configuration.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnchoredClock",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$anchored$2d$clock$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AnchoredClock"],
    "BindOnceFuture",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$callback$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BindOnceFuture"],
    "CompositePropagator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$propagation$2f$composite$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["CompositePropagator"],
    "ExportResultCode",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"],
    "RPCType",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$rpc$2d$metadata$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["RPCType"],
    "SDK_INFO",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$sdk$2d$info$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SDK_INFO"],
    "TRACE_PARENT_HEADER",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$W3CTraceContextPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TRACE_PARENT_HEADER"],
    "TRACE_STATE_HEADER",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$W3CTraceContextPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TRACE_STATE_HEADER"],
    "TimeoutError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$timeout$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TimeoutError"],
    "TraceState",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$TraceState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceState"],
    "W3CBaggagePropagator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$propagation$2f$W3CBaggagePropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["W3CBaggagePropagator"],
    "W3CTraceContextPropagator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$W3CTraceContextPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["W3CTraceContextPropagator"],
    "_globalThis",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$globalThis$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["_globalThis"],
    "addHrTimes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["addHrTimes"],
    "callWithTimeout",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$timeout$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["callWithTimeout"],
    "deleteRPCMetadata",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$rpc$2d$metadata$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["deleteRPCMetadata"],
    "diagLogLevelFromString",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diagLogLevelFromString"],
    "getBooleanFromEnv",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getBooleanFromEnv"],
    "getNumberFromEnv",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getNumberFromEnv"],
    "getRPCMetadata",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$rpc$2d$metadata$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getRPCMetadata"],
    "getStringFromEnv",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"],
    "getStringListFromEnv",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringListFromEnv"],
    "getTimeOrigin",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getTimeOrigin"],
    "globalErrorHandler",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"],
    "hrTime",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTime"],
    "hrTimeDuration",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeDuration"],
    "hrTimeToMicroseconds",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMicroseconds"],
    "hrTimeToMilliseconds",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMilliseconds"],
    "hrTimeToNanoseconds",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToNanoseconds"],
    "hrTimeToTimeStamp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToTimeStamp"],
    "internal",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["internal"],
    "isAttributeValue",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isAttributeValue"],
    "isTimeInput",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isTimeInput"],
    "isTimeInputHrTime",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isTimeInputHrTime"],
    "isTracingSuppressed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isTracingSuppressed"],
    "isUrlIgnored",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$url$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isUrlIgnored"],
    "loggingErrorHandler",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$logging$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["loggingErrorHandler"],
    "merge",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$merge$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["merge"],
    "millisToHrTime",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["millisToHrTime"],
    "otperformance",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["otperformance"],
    "parseKeyPairsIntoRecord",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["parseKeyPairsIntoRecord"],
    "parseTraceParent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$W3CTraceContextPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["parseTraceParent"],
    "sanitizeAttributes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["sanitizeAttributes"],
    "setGlobalErrorHandler",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["setGlobalErrorHandler"],
    "setRPCMetadata",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$rpc$2d$metadata$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["setRPCMetadata"],
    "suppressTracing",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["suppressTracing"],
    "timeInputToHrTime",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timeInputToHrTime"],
    "unrefTimer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$timer$2d$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["unrefTimer"],
    "unsuppressTracing",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["unsuppressTracing"],
    "urlMatches",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$url$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["urlMatches"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$propagation$2f$W3CBaggagePropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/baggage/propagation/W3CBaggagePropagator.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$anchored$2d$clock$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/anchored-clock.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/attributes.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$logging$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/logging-error-handler.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/time.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$timer$2d$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/timer-util.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$baggage$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/baggage/utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$sdk$2d$info$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/sdk-info.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$globalThis$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/globalThis.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/environment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$propagation$2f$composite$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/propagation/composite.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$W3CTraceContextPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/W3CTraceContextPropagator.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$rpc$2d$metadata$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/rpc-metadata.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$TraceState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/TraceState.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$merge$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/merge.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$timeout$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/timeout.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$url$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/url.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$callback$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/callback.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/configuration.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
;
;
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/utils/validation.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * Validates if a value is a valid AnyValue for Log Attributes according to OpenTelemetry spec.
 * Log Attributes support a superset of standard Attributes and must support:
 * - Scalar values: string, boolean, signed 64 bit integer, or double precision floating point
 * - Byte arrays (Uint8Array)
 * - Arrays of any values (heterogeneous arrays allowed)
 * - Maps from string to any value (nested objects)
 * - Empty values (null/undefined)
 *
 * @param val - The value to validate
 * @returns true if the value is a valid AnyValue, false otherwise
 */ __turbopack_context__.s([
    "isLogAttributeValue",
    ()=>isLogAttributeValue
]);
function isLogAttributeValue(val) {
    return isLogAttributeValueInternal(val, new WeakSet());
}
function isLogAttributeValueInternal(val, visited) {
    // null and undefined are explicitly allowed
    if (val == null) {
        return true;
    }
    // Scalar values
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return true;
    }
    // Byte arrays
    if (val instanceof Uint8Array) {
        return true;
    }
    // For objects and arrays, check for circular references
    if (typeof val === 'object') {
        if (visited.has(val)) {
            // Circular reference detected - reject it
            return false;
        }
        visited.add(val);
        // Arrays (can contain any AnyValue, including heterogeneous)
        if (Array.isArray(val)) {
            return val.every((item)=>isLogAttributeValueInternal(item, visited));
        }
        // Only accept plain objects (not built-in objects like Date, RegExp, Error, etc.)
        // Check if it's a plain object by verifying its constructor is Object or it has no constructor
        const obj = val;
        if (obj.constructor !== Object && obj.constructor !== undefined) {
            return false;
        }
        // Objects/Maps (including empty objects)
        // All object properties must be valid AnyValues
        return Object.values(obj).every((item)=>isLogAttributeValueInternal(item, visited));
    }
    return false;
} //# sourceMappingURL=validation.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/LogRecordImpl.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "LogRecordImpl",
    ()=>LogRecordImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/time.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$utils$2f$validation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/utils/validation.js [instrumentation] (ecmascript)");
;
;
;
class LogRecordImpl {
    hrTime;
    hrTimeObserved;
    spanContext;
    resource;
    instrumentationScope;
    attributes = {};
    _severityText;
    _severityNumber;
    _body;
    _eventName;
    totalAttributesCount = 0;
    _isReadonly = false;
    _logRecordLimits;
    set severityText(severityText) {
        if (this._isLogRecordReadonly()) {
            return;
        }
        this._severityText = severityText;
    }
    get severityText() {
        return this._severityText;
    }
    set severityNumber(severityNumber) {
        if (this._isLogRecordReadonly()) {
            return;
        }
        this._severityNumber = severityNumber;
    }
    get severityNumber() {
        return this._severityNumber;
    }
    set body(body) {
        if (this._isLogRecordReadonly()) {
            return;
        }
        this._body = body;
    }
    get body() {
        return this._body;
    }
    get eventName() {
        return this._eventName;
    }
    set eventName(eventName) {
        if (this._isLogRecordReadonly()) {
            return;
        }
        this._eventName = eventName;
    }
    get droppedAttributesCount() {
        return this.totalAttributesCount - Object.keys(this.attributes).length;
    }
    constructor(_sharedState, instrumentationScope, logRecord){
        const { timestamp, observedTimestamp, eventName, severityNumber, severityText, body, attributes = {}, context } = logRecord;
        const now = Date.now();
        this.hrTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timeInputToHrTime"])(timestamp ?? now);
        this.hrTimeObserved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timeInputToHrTime"])(observedTimestamp ?? now);
        if (context) {
            const spanContext = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].getSpanContext(context);
            if (spanContext && __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isSpanContextValid"](spanContext)) {
                this.spanContext = spanContext;
            }
        }
        this.severityNumber = severityNumber;
        this.severityText = severityText;
        this.body = body;
        this.resource = _sharedState.resource;
        this.instrumentationScope = instrumentationScope;
        this._logRecordLimits = _sharedState.logRecordLimits;
        this._eventName = eventName;
        this.setAttributes(attributes);
    }
    setAttribute(key, value) {
        if (this._isLogRecordReadonly()) {
            return this;
        }
        if (key.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Invalid attribute key: ${key}`);
            return this;
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$utils$2f$validation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isLogAttributeValue"])(value)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Invalid attribute value set for key: ${key}`);
            return this;
        }
        this.totalAttributesCount += 1;
        if (Object.keys(this.attributes).length >= this._logRecordLimits.attributeCountLimit && !Object.prototype.hasOwnProperty.call(this.attributes, key)) {
            // This logic is to create drop message at most once per LogRecord to prevent excessive logging.
            if (this.droppedAttributesCount === 1) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('Dropping extra attributes.');
            }
            return this;
        }
        this.attributes[key] = this._truncateToSize(value);
        return this;
    }
    setAttributes(attributes) {
        for (const [k, v] of Object.entries(attributes)){
            this.setAttribute(k, v);
        }
        return this;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
    setEventName(eventName) {
        this.eventName = eventName;
        return this;
    }
    setSeverityNumber(severityNumber) {
        this.severityNumber = severityNumber;
        return this;
    }
    setSeverityText(severityText) {
        this.severityText = severityText;
        return this;
    }
    /**
     * @internal
     * A LogRecordProcessor may freely modify logRecord for the duration of the OnEmit call.
     * If logRecord is needed after OnEmit returns (i.e. for asynchronous processing) only reads are permitted.
     */ _makeReadonly() {
        this._isReadonly = true;
    }
    _truncateToSize(value) {
        const limit = this._logRecordLimits.attributeValueLengthLimit;
        // Check limit
        if (limit <= 0) {
            // Negative values are invalid, so do not truncate
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Attribute value limit must be positive, got ${limit}`);
            return value;
        }
        // null/undefined - no truncation needed
        if (value == null) {
            return value;
        }
        // String
        if (typeof value === 'string') {
            return this._truncateToLimitUtil(value, limit);
        }
        // Byte arrays - no truncation needed
        if (value instanceof Uint8Array) {
            return value;
        }
        // Arrays (can contain any AnyValue types)
        if (Array.isArray(value)) {
            return value.map((val)=>this._truncateToSize(val));
        }
        // Objects/Maps - recursively truncate nested values
        if (typeof value === 'object') {
            const truncatedObj = {};
            for (const [k, v] of Object.entries(value)){
                truncatedObj[k] = this._truncateToSize(v);
            }
            return truncatedObj;
        }
        // Other types (number, boolean), no need to apply value length limit
        return value;
    }
    _truncateToLimitUtil(value, limit) {
        if (value.length <= limit) {
            return value;
        }
        return value.substring(0, limit);
    }
    _isLogRecordReadonly() {
        if (this._isReadonly) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('Can not execute the operation on emitted log record');
        }
        return this._isReadonly;
    }
} //# sourceMappingURL=LogRecordImpl.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/Logger.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "Logger",
    ()=>Logger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$types$2f$LogRecord$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/types/LogRecord.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/context-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$LogRecordImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/LogRecordImpl.js [instrumentation] (ecmascript)");
;
;
;
class Logger {
    instrumentationScope;
    _sharedState;
    _loggerConfig;
    constructor(instrumentationScope, sharedState){
        this.instrumentationScope = instrumentationScope;
        this._sharedState = sharedState;
        // Cache the logger configuration at construction time
        // Since we don't support re-configuration, this avoids map lookups
        // and string allocations on each emit() call
        this._loggerConfig = this._sharedState.getLoggerConfig(this.instrumentationScope);
    }
    emit(logRecord) {
        const loggerConfig = this._loggerConfig;
        const currentContext = logRecord.context || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["context"].active();
        // Apply minimum severity filtering
        const recordSeverity = logRecord.severityNumber ?? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$types$2f$LogRecord$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SeverityNumber"].UNSPECIFIED;
        // 1. Minimum severity: If the log record's SeverityNumber is specified
        //    (i.e. not 0) and is less than the configured minimum_severity,
        //    the log record MUST be dropped.
        if (recordSeverity !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$types$2f$LogRecord$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SeverityNumber"].UNSPECIFIED && recordSeverity < loggerConfig.minimumSeverity) {
            // Log record is dropped due to minimum severity filter
            return;
        }
        // 2. Trace-based: If trace_based is true, and if the log record has a
        //    SpanId and the TraceFlags SAMPLED flag is unset, the log record MUST be dropped.
        if (loggerConfig.traceBased) {
            const spanContext = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].getSpanContext(currentContext);
            if (spanContext && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isSpanContextValid"])(spanContext)) {
                // Check if the trace is unsampled (SAMPLED flag is unset)
                const isSampled = (spanContext.traceFlags & __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].SAMPLED) === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].SAMPLED;
                if (!isSampled) {
                    // Log record is dropped due to trace-based filter
                    return;
                }
            }
        // If there's no valid span context, the log record is not associated with a trace
        // and therefore bypasses trace-based filtering (as per spec)
        }
        /**
         * If a Logger was obtained with include_trace_context=true,
         * the LogRecords it emits MUST automatically include the Trace Context from the active Context,
         * if Context has not been explicitly set.
         */ const logRecordInstance = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$LogRecordImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["LogRecordImpl"](this._sharedState, this.instrumentationScope, {
            context: currentContext,
            ...logRecord
        });
        /**
         * the explicitly passed Context,
         * the current Context, or an empty Context if the Logger was obtained with include_trace_context=false
         */ this._sharedState.activeProcessor.onEmit(logRecordInstance, currentContext);
        /**
         * A LogRecordProcessor may freely modify logRecord for the duration of the OnEmit call.
         * If logRecord is needed after OnEmit returns (i.e. for asynchronous processing) only reads are permitted.
         */ logRecordInstance._makeReadonly();
    }
} //# sourceMappingURL=Logger.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/NoopLogRecordProcessor.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "NoopLogRecordProcessor",
    ()=>NoopLogRecordProcessor
]);
class NoopLogRecordProcessor {
    forceFlush() {
        return Promise.resolve();
    }
    onEmit(_logRecord, _context) {}
    shutdown() {
        return Promise.resolve();
    }
} //# sourceMappingURL=NoopLogRecordProcessor.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/MultiLogRecordProcessor.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MultiLogRecordProcessor",
    ()=>MultiLogRecordProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$timeout$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/timeout.js [instrumentation] (ecmascript)");
;
class MultiLogRecordProcessor {
    processors;
    forceFlushTimeoutMillis;
    constructor(processors, forceFlushTimeoutMillis){
        this.processors = processors;
        this.forceFlushTimeoutMillis = forceFlushTimeoutMillis;
    }
    async forceFlush() {
        const timeout = this.forceFlushTimeoutMillis;
        await Promise.all(this.processors.map((processor)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$timeout$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["callWithTimeout"])(processor.forceFlush(), timeout)));
    }
    onEmit(logRecord, context) {
        this.processors.forEach((processors)=>processors.onEmit(logRecord, context));
    }
    async shutdown() {
        await Promise.all(this.processors.map((processor)=>processor.shutdown()));
    }
} //# sourceMappingURL=MultiLogRecordProcessor.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/internal/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * Converting the instrumentation scope object to a unique identifier string.
 * @param scope - The instrumentation scope to convert
 * @returns A unique string identifier for the scope
 */ __turbopack_context__.s([
    "getInstrumentationScopeKey",
    ()=>getInstrumentationScopeKey
]);
function getInstrumentationScopeKey(scope) {
    return `${scope.name}@${scope.version || ''}:${scope.schemaUrl || ''}`;
} //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/internal/LoggerProviderSharedState.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "DEFAULT_LOGGER_CONFIGURATOR",
    ()=>DEFAULT_LOGGER_CONFIGURATOR,
    "LoggerProviderSharedState",
    ()=>LoggerProviderSharedState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$types$2f$LogRecord$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/types/LogRecord.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$NoopLogRecordProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/NoopLogRecordProcessor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$MultiLogRecordProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/MultiLogRecordProcessor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$internal$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/internal/utils.js [instrumentation] (ecmascript)");
;
;
;
;
const DEFAULT_LOGGER_CONFIG = {
    disabled: false,
    minimumSeverity: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$types$2f$LogRecord$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SeverityNumber"].UNSPECIFIED,
    traceBased: false
};
const DEFAULT_LOGGER_CONFIGURATOR = ()=>({
        ...DEFAULT_LOGGER_CONFIG
    });
class LoggerProviderSharedState {
    loggers = new Map();
    activeProcessor;
    registeredLogRecordProcessors = [];
    resource;
    forceFlushTimeoutMillis;
    logRecordLimits;
    processors;
    _loggerConfigurator;
    _loggerConfigs = new Map();
    constructor(resource, forceFlushTimeoutMillis, logRecordLimits, processors, loggerConfigurator){
        this.resource = resource;
        this.forceFlushTimeoutMillis = forceFlushTimeoutMillis;
        this.logRecordLimits = logRecordLimits;
        this.processors = processors;
        if (processors.length > 0) {
            this.registeredLogRecordProcessors = processors;
            this.activeProcessor = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$MultiLogRecordProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MultiLogRecordProcessor"](this.registeredLogRecordProcessors, this.forceFlushTimeoutMillis);
        } else {
            this.activeProcessor = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$NoopLogRecordProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["NoopLogRecordProcessor"]();
        }
        this._loggerConfigurator = loggerConfigurator ?? DEFAULT_LOGGER_CONFIGURATOR;
    }
    /**
     * Get the LoggerConfig for a given instrumentation scope.
     * Uses the LoggerConfigurator function to compute the config on first access
     * and caches the result.
     *
     * @experimental This feature is in development as per the OpenTelemetry specification.
     */ getLoggerConfig(instrumentationScope) {
        const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$internal$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getInstrumentationScopeKey"])(instrumentationScope);
        // Return cached config if available
        let config = this._loggerConfigs.get(key);
        if (config) {
            return config;
        }
        // Compute config using the configurator
        // The configurator always returns a complete config
        config = this._loggerConfigurator(instrumentationScope);
        // Cache the result
        this._loggerConfigs.set(key, config);
        return config;
    }
} //# sourceMappingURL=LoggerProviderSharedState.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/LoggerProvider.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "DEFAULT_LOGGER_NAME",
    ()=>DEFAULT_LOGGER_NAME,
    "LoggerProvider",
    ()=>LoggerProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$callback$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/callback.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$Logger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/Logger.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$internal$2f$LoggerProviderSharedState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/internal/LoggerProviderSharedState.js [instrumentation] (ecmascript)");
;
;
;
;
;
;
const DEFAULT_LOGGER_NAME = 'unknown';
class LoggerProvider {
    _shutdownOnce;
    _sharedState;
    constructor(config = {}){
        const mergedConfig = {
            resource: config.resource ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["defaultResource"])(),
            forceFlushTimeoutMillis: config.forceFlushTimeoutMillis ?? 30000,
            logRecordLimits: {
                attributeCountLimit: config.logRecordLimits?.attributeCountLimit ?? 128,
                attributeValueLengthLimit: config.logRecordLimits?.attributeValueLengthLimit ?? Infinity
            },
            loggerConfigurator: config.loggerConfigurator ?? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$internal$2f$LoggerProviderSharedState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DEFAULT_LOGGER_CONFIGURATOR"],
            processors: config.processors ?? []
        };
        this._sharedState = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$internal$2f$LoggerProviderSharedState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["LoggerProviderSharedState"](mergedConfig.resource, mergedConfig.forceFlushTimeoutMillis, mergedConfig.logRecordLimits, mergedConfig.processors, mergedConfig.loggerConfigurator);
        this._shutdownOnce = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$callback$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BindOnceFuture"](this._shutdown, this);
    }
    /**
     * Get a logger with the configuration of the LoggerProvider.
     */ getLogger(name, version, options) {
        if (this._shutdownOnce.isCalled) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('A shutdown LoggerProvider cannot provide a Logger');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["NOOP_LOGGER"];
        }
        if (!name) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('Logger requested without instrumentation scope name.');
        }
        const loggerName = name || DEFAULT_LOGGER_NAME;
        const key = `${loggerName}@${version || ''}:${options?.schemaUrl || ''}`;
        if (!this._sharedState.loggers.has(key)) {
            this._sharedState.loggers.set(key, new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$Logger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["Logger"]({
                name: loggerName,
                version,
                schemaUrl: options?.schemaUrl
            }, this._sharedState));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._sharedState.loggers.get(key);
    }
    /**
     * Notifies all registered LogRecordProcessor to flush any buffered data.
     *
     * Returns a promise which is resolved when all flushes are complete.
     */ forceFlush() {
        // do not flush after shutdown
        if (this._shutdownOnce.isCalled) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('invalid attempt to force flush after LoggerProvider shutdown');
            return this._shutdownOnce.promise;
        }
        return this._sharedState.activeProcessor.forceFlush();
    }
    /**
     * Flush all buffered data and shut down the LoggerProvider and all registered
     * LogRecordProcessor.
     *
     * Returns a promise which is resolved when all flushes are complete.
     */ shutdown() {
        if (this._shutdownOnce.isCalled) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('shutdown may only be called once per LoggerProvider');
            return this._shutdownOnce.promise;
        }
        return this._shutdownOnce.call();
    }
    _shutdown() {
        return this._sharedState.activeProcessor.shutdown();
    }
} //# sourceMappingURL=LoggerProvider.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/ConsoleLogRecordExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ConsoleLogRecordExporter",
    ()=>ConsoleLogRecordExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/time.js [instrumentation] (ecmascript)");
;
class ConsoleLogRecordExporter {
    /**
     * Export logs.
     * @param logs
     * @param resultCallback
     */ export(logs, resultCallback) {
        this._sendLogRecords(logs, resultCallback);
    }
    /**
     * Shutdown the exporter.
     */ shutdown() {
        return Promise.resolve();
    }
    /**
     * converts logRecord info into more readable format
     * @param logRecord
     */ _exportInfo(logRecord) {
        return {
            resource: {
                attributes: logRecord.resource.attributes
            },
            instrumentationScope: logRecord.instrumentationScope,
            timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMicroseconds"])(logRecord.hrTime),
            traceId: logRecord.spanContext?.traceId,
            spanId: logRecord.spanContext?.spanId,
            traceFlags: logRecord.spanContext?.traceFlags,
            severityText: logRecord.severityText,
            severityNumber: logRecord.severityNumber,
            eventName: logRecord.eventName,
            body: logRecord.body,
            attributes: logRecord.attributes
        };
    }
    /**
     * Showing logs  in console
     * @param logRecords
     * @param done
     */ _sendLogRecords(logRecords, done) {
        for (const logRecord of logRecords){
            console.dir(this._exportInfo(logRecord), {
                depth: 3
            });
        }
        done?.({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS
        });
    }
} //# sourceMappingURL=ConsoleLogRecordExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/SimpleLogRecordProcessor.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "SimpleLogRecordProcessor",
    ()=>SimpleLogRecordProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$callback$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/callback.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript) <locals>");
;
class SimpleLogRecordProcessor {
    _exporter;
    _shutdownOnce;
    _unresolvedExports;
    constructor(exporter){
        this._exporter = exporter;
        this._shutdownOnce = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$callback$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BindOnceFuture"](this._shutdown, this);
        this._unresolvedExports = new Set();
    }
    onEmit(logRecord) {
        if (this._shutdownOnce.isCalled) {
            return;
        }
        const doExport = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["internal"]._export(this._exporter, [
                logRecord
            ]).then((result)=>{
                if (result.code !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"])(result.error ?? new Error(`SimpleLogRecordProcessor: log record export failed (status ${result})`));
                }
            }).catch(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"]);
        // Avoid scheduling a promise to make the behavior more predictable and easier to test
        if (logRecord.resource.asyncAttributesPending) {
            const exportPromise = logRecord.resource.waitForAsyncAttributes?.().then(()=>{
                // Using TS Non-null assertion operator because exportPromise could not be null in here
                // if waitForAsyncAttributes is not present this code will never be reached
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this._unresolvedExports.delete(exportPromise);
                return doExport();
            }, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"]);
            // store the unresolved exports
            if (exportPromise != null) {
                this._unresolvedExports.add(exportPromise);
            }
        } else {
            void doExport();
        }
    }
    async forceFlush() {
        // await unresolved resources before resolving
        await Promise.all(Array.from(this._unresolvedExports));
    }
    shutdown() {
        return this._shutdownOnce.call();
    }
    _shutdown() {
        return this._exporter.shutdown();
    }
} //# sourceMappingURL=SimpleLogRecordProcessor.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/InMemoryLogRecordExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "InMemoryLogRecordExporter",
    ()=>InMemoryLogRecordExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
;
class InMemoryLogRecordExporter {
    _finishedLogRecords = [];
    /**
     * Indicates if the exporter has been "shutdown."
     * When false, exported log records will not be stored in-memory.
     */ _stopped = false;
    export(logs, resultCallback) {
        if (this._stopped) {
            return resultCallback({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                error: new Error('Exporter has been stopped')
            });
        }
        this._finishedLogRecords.push(...logs);
        resultCallback({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS
        });
    }
    shutdown() {
        this._stopped = true;
        this.reset();
        return Promise.resolve();
    }
    getFinishedLogRecords() {
        return this._finishedLogRecords;
    }
    reset() {
        this._finishedLogRecords = [];
    }
} //# sourceMappingURL=InMemoryLogRecordExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/BatchLogRecordProcessorBase.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "BatchLogRecordProcessorBase",
    ()=>BatchLogRecordProcessorBase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$callback$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/callback.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$timeout$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/utils/timeout.js [instrumentation] (ecmascript)");
;
;
class BatchLogRecordProcessorBase {
    _maxExportBatchSize;
    _maxQueueSize;
    _scheduledDelayMillis;
    _exportTimeoutMillis;
    _exporter;
    _isExporting = false;
    _finishedLogRecords = [];
    _timer;
    _shutdownOnce;
    constructor(exporter, config){
        this._exporter = exporter;
        this._maxExportBatchSize = config?.maxExportBatchSize ?? 512;
        this._maxQueueSize = config?.maxQueueSize ?? 2048;
        this._scheduledDelayMillis = config?.scheduledDelayMillis ?? 5000;
        this._exportTimeoutMillis = config?.exportTimeoutMillis ?? 30000;
        this._shutdownOnce = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$callback$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BindOnceFuture"](this._shutdown, this);
        if (this._maxExportBatchSize > this._maxQueueSize) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('BatchLogRecordProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize');
            this._maxExportBatchSize = this._maxQueueSize;
        }
    }
    onEmit(logRecord) {
        if (this._shutdownOnce.isCalled) {
            return;
        }
        this._addToBuffer(logRecord);
    }
    forceFlush() {
        if (this._shutdownOnce.isCalled) {
            return this._shutdownOnce.promise;
        }
        return this._flushAll();
    }
    shutdown() {
        return this._shutdownOnce.call();
    }
    async _shutdown() {
        this.onShutdown();
        await this._flushAll();
        await this._exporter.shutdown();
    }
    /** Add a LogRecord in the buffer. */ _addToBuffer(logRecord) {
        if (this._finishedLogRecords.length >= this._maxQueueSize) {
            return;
        }
        this._finishedLogRecords.push(logRecord);
        this._maybeStartTimer();
    }
    /**
     * Send all LogRecords to the exporter respecting the batch size limit
     * This function is used only on forceFlush or shutdown,
     * for all other cases _flush should be used
     * */ _flushAll() {
        return new Promise((resolve, reject)=>{
            const promises = [];
            const batchCount = Math.ceil(this._finishedLogRecords.length / this._maxExportBatchSize);
            for(let i = 0; i < batchCount; i++){
                promises.push(this._flushOneBatch());
            }
            Promise.all(promises).then(()=>{
                resolve();
            }).catch(reject);
        });
    }
    _flushOneBatch() {
        this._clearTimer();
        if (this._finishedLogRecords.length === 0) {
            return Promise.resolve();
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$utils$2f$timeout$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["callWithTimeout"])(this._export(this._finishedLogRecords.splice(0, this._maxExportBatchSize)), this._exportTimeoutMillis);
    }
    _maybeStartTimer() {
        if (this._isExporting) return;
        const flush = ()=>{
            this._isExporting = true;
            this._flushOneBatch().then(()=>{
                this._isExporting = false;
                if (this._finishedLogRecords.length > 0) {
                    this._clearTimer();
                    this._maybeStartTimer();
                }
            }).catch((e)=>{
                this._isExporting = false;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"])(e);
            });
        };
        // we only wait if the queue doesn't have enough elements yet
        if (this._finishedLogRecords.length >= this._maxExportBatchSize) {
            return flush();
        }
        if (this._timer !== undefined) return;
        this._timer = setTimeout(()=>flush(), this._scheduledDelayMillis);
        // depending on runtime, this may be a 'number' or NodeJS.Timeout
        if (typeof this._timer !== 'number') {
            this._timer.unref();
        }
    }
    _clearTimer() {
        if (this._timer !== undefined) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }
    }
    _export(logRecords) {
        const doExport = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["internal"]._export(this._exporter, logRecords).then((result)=>{
                if (result.code !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"])(result.error ?? new Error(`BatchLogRecordProcessor: log record export failed (status ${result})`));
                }
            }).catch(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"]);
        const pendingResources = [];
        for(let i = 0; i < logRecords.length; i++){
            const resource = logRecords[i].resource;
            if (resource.asyncAttributesPending && typeof resource.waitForAsyncAttributes === 'function') {
                pendingResources.push(resource.waitForAsyncAttributes());
            }
        }
        // Avoid scheduling a promise to make the behavior more predictable and easier to test
        if (pendingResources.length === 0) {
            return doExport();
        } else {
            return Promise.all(pendingResources).then(doExport, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"]);
        }
    }
} //# sourceMappingURL=BatchLogRecordProcessorBase.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/platform/node/export/BatchLogRecordProcessor.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "BatchLogRecordProcessor",
    ()=>BatchLogRecordProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$BatchLogRecordProcessorBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/BatchLogRecordProcessorBase.js [instrumentation] (ecmascript)");
;
class BatchLogRecordProcessor extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$BatchLogRecordProcessorBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BatchLogRecordProcessorBase"] {
    onShutdown() {}
} //# sourceMappingURL=BatchLogRecordProcessor.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/config/LoggerConfigurators.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "createLoggerConfigurator",
    ()=>createLoggerConfigurator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$types$2f$LogRecord$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/types/LogRecord.js [instrumentation] (ecmascript)");
;
/**
 * Default LoggerConfig used when no pattern matches
 *
 * @experimental This feature is in development as per the OpenTelemetry specification.
 */ const DEFAULT_LOGGER_CONFIG = {
    disabled: false,
    minimumSeverity: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$types$2f$LogRecord$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SeverityNumber"].UNSPECIFIED,
    traceBased: false
};
function createLoggerConfigurator(patterns) {
    return (loggerScope)=>{
        const loggerName = loggerScope.name;
        // Find the first matching pattern
        for (const { pattern, config } of patterns){
            if (matchesPattern(loggerName, pattern)) {
                // Compute complete config by merging with defaults
                return {
                    disabled: config.disabled ?? DEFAULT_LOGGER_CONFIG.disabled,
                    minimumSeverity: config.minimumSeverity ?? DEFAULT_LOGGER_CONFIG.minimumSeverity,
                    traceBased: config.traceBased ?? DEFAULT_LOGGER_CONFIG.traceBased
                };
            }
        }
        // No pattern matched, return default config
        return {
            ...DEFAULT_LOGGER_CONFIG
        };
    };
}
/**
 * Matches a logger name against a pattern.
 * Supports simple wildcard matching with '*'.
 *
 * @param name - The logger name to match
 * @param pattern - The pattern to match against (supports '*' wildcard)
 * @returns true if the name matches the pattern
 */ function matchesPattern(name, pattern) {
    // Exact match
    if (pattern === name) {
        return true;
    }
    // Wildcard pattern
    if (pattern.includes('*')) {
        const regexPattern = pattern.split('*').map((part)=>part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(name);
    }
    return false;
} //# sourceMappingURL=LoggerConfigurators.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BatchLogRecordProcessor",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$platform$2f$node$2f$export$2f$BatchLogRecordProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BatchLogRecordProcessor"],
    "ConsoleLogRecordExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$ConsoleLogRecordExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ConsoleLogRecordExporter"],
    "InMemoryLogRecordExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$InMemoryLogRecordExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InMemoryLogRecordExporter"],
    "LoggerProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$LoggerProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["LoggerProvider"],
    "SimpleLogRecordProcessor",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$SimpleLogRecordProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SimpleLogRecordProcessor"],
    "createLoggerConfigurator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$config$2f$LoggerConfigurators$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createLoggerConfigurator"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$LoggerProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/LoggerProvider.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$ConsoleLogRecordExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/ConsoleLogRecordExporter.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$SimpleLogRecordProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/SimpleLogRecordProcessor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$export$2f$InMemoryLogRecordExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/export/InMemoryLogRecordExporter.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$platform$2f$node$2f$export$2f$BatchLogRecordProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/platform/node/export/BatchLogRecordProcessor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$config$2f$LoggerConfigurators$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/config/LoggerConfigurators.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "NOOP_LOGGER",
    ()=>NOOP_LOGGER,
    "NoopLogger",
    ()=>NoopLogger
]);
class NoopLogger {
    emit(_logRecord) {}
}
const NOOP_LOGGER = new NoopLogger(); //# sourceMappingURL=NoopLogger.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/types/LogRecord.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "SeverityNumber",
    ()=>SeverityNumber
]);
var SeverityNumber;
(function(SeverityNumber) {
    SeverityNumber[SeverityNumber["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    SeverityNumber[SeverityNumber["TRACE"] = 1] = "TRACE";
    SeverityNumber[SeverityNumber["TRACE2"] = 2] = "TRACE2";
    SeverityNumber[SeverityNumber["TRACE3"] = 3] = "TRACE3";
    SeverityNumber[SeverityNumber["TRACE4"] = 4] = "TRACE4";
    SeverityNumber[SeverityNumber["DEBUG"] = 5] = "DEBUG";
    SeverityNumber[SeverityNumber["DEBUG2"] = 6] = "DEBUG2";
    SeverityNumber[SeverityNumber["DEBUG3"] = 7] = "DEBUG3";
    SeverityNumber[SeverityNumber["DEBUG4"] = 8] = "DEBUG4";
    SeverityNumber[SeverityNumber["INFO"] = 9] = "INFO";
    SeverityNumber[SeverityNumber["INFO2"] = 10] = "INFO2";
    SeverityNumber[SeverityNumber["INFO3"] = 11] = "INFO3";
    SeverityNumber[SeverityNumber["INFO4"] = 12] = "INFO4";
    SeverityNumber[SeverityNumber["WARN"] = 13] = "WARN";
    SeverityNumber[SeverityNumber["WARN2"] = 14] = "WARN2";
    SeverityNumber[SeverityNumber["WARN3"] = 15] = "WARN3";
    SeverityNumber[SeverityNumber["WARN4"] = 16] = "WARN4";
    SeverityNumber[SeverityNumber["ERROR"] = 17] = "ERROR";
    SeverityNumber[SeverityNumber["ERROR2"] = 18] = "ERROR2";
    SeverityNumber[SeverityNumber["ERROR3"] = 19] = "ERROR3";
    SeverityNumber[SeverityNumber["ERROR4"] = 20] = "ERROR4";
    SeverityNumber[SeverityNumber["FATAL"] = 21] = "FATAL";
    SeverityNumber[SeverityNumber["FATAL2"] = 22] = "FATAL2";
    SeverityNumber[SeverityNumber["FATAL3"] = 23] = "FATAL3";
    SeverityNumber[SeverityNumber["FATAL4"] = 24] = "FATAL4";
})(SeverityNumber || (SeverityNumber = {})); //# sourceMappingURL=LogRecord.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/internal/global-utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "API_BACKWARDS_COMPATIBILITY_VERSION",
    ()=>API_BACKWARDS_COMPATIBILITY_VERSION,
    "GLOBAL_LOGS_API_KEY",
    ()=>GLOBAL_LOGS_API_KEY,
    "_global",
    ()=>_global,
    "makeGetter",
    ()=>makeGetter
]);
const GLOBAL_LOGS_API_KEY = Symbol.for('io.opentelemetry.js.api.logs');
const _global = globalThis;
function makeGetter(requiredVersion, instance, fallback) {
    return (version)=>version === requiredVersion ? instance : fallback;
}
const API_BACKWARDS_COMPATIBILITY_VERSION = 1; //# sourceMappingURL=global-utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/NoopLoggerProvider.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "NOOP_LOGGER_PROVIDER",
    ()=>NOOP_LOGGER_PROVIDER,
    "NoopLoggerProvider",
    ()=>NoopLoggerProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js [instrumentation] (ecmascript)");
;
class NoopLoggerProvider {
    getLogger(_name, _version, _options) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["NoopLogger"]();
    }
}
const NOOP_LOGGER_PROVIDER = new NoopLoggerProvider(); //# sourceMappingURL=NoopLoggerProvider.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/ProxyLogger.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ProxyLogger",
    ()=>ProxyLogger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js [instrumentation] (ecmascript)");
;
class ProxyLogger {
    constructor(provider, name, version, options){
        this._provider = provider;
        this.name = name;
        this.version = version;
        this.options = options;
    }
    /**
     * Emit a log record. This method should only be used by log appenders.
     *
     * @param logRecord
     */ emit(logRecord) {
        this._getLogger().emit(logRecord);
    }
    /**
     * Try to get a logger from the proxy logger provider.
     * If the proxy logger provider has no delegate, return a noop logger.
     */ _getLogger() {
        if (this._delegate) {
            return this._delegate;
        }
        const logger = this._provider._getDelegateLogger(this.name, this.version, this.options);
        if (!logger) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["NOOP_LOGGER"];
        }
        this._delegate = logger;
        return this._delegate;
    }
} //# sourceMappingURL=ProxyLogger.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/ProxyLoggerProvider.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ProxyLoggerProvider",
    ()=>ProxyLoggerProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLoggerProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/NoopLoggerProvider.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$ProxyLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/ProxyLogger.js [instrumentation] (ecmascript)");
;
;
class ProxyLoggerProvider {
    getLogger(name, version, options) {
        var _a;
        return (_a = this._getDelegateLogger(name, version, options)) !== null && _a !== void 0 ? _a : new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$ProxyLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ProxyLogger"](this, name, version, options);
    }
    /**
     * Get the delegate logger provider.
     * Used by tests only.
     * @internal
     */ _getDelegate() {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLoggerProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["NOOP_LOGGER_PROVIDER"];
    }
    /**
     * Set the delegate logger provider
     * @internal
     */ _setDelegate(delegate) {
        this._delegate = delegate;
    }
    /**
     * @internal
     */ _getDelegateLogger(name, version, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getLogger(name, version, options);
    }
} //# sourceMappingURL=ProxyLoggerProvider.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/api/logs.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "LogsAPI",
    ()=>LogsAPI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/internal/global-utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLoggerProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/NoopLoggerProvider.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$ProxyLoggerProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/ProxyLoggerProvider.js [instrumentation] (ecmascript)");
;
;
;
class LogsAPI {
    constructor(){
        this._proxyLoggerProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$ProxyLoggerProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ProxyLoggerProvider"]();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new LogsAPI();
        }
        return this._instance;
    }
    setGlobalLoggerProvider(provider) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["_global"][__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["GLOBAL_LOGS_API_KEY"]]) {
            return this.getLoggerProvider();
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["_global"][__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["GLOBAL_LOGS_API_KEY"]] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["makeGetter"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["API_BACKWARDS_COMPATIBILITY_VERSION"], provider, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLoggerProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["NOOP_LOGGER_PROVIDER"]);
        this._proxyLoggerProvider._setDelegate(provider);
        return provider;
    }
    /**
     * Returns the global logger provider.
     *
     * @returns LoggerProvider
     */ getLoggerProvider() {
        var _a, _b;
        return (_b = (_a = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["_global"][__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["GLOBAL_LOGS_API_KEY"]]) === null || _a === void 0 ? void 0 : _a.call(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["_global"], __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["API_BACKWARDS_COMPATIBILITY_VERSION"])) !== null && _b !== void 0 ? _b : this._proxyLoggerProvider;
    }
    /**
     * Returns a logger from the global logger provider.
     *
     * @returns Logger
     */ getLogger(name, version, options) {
        return this.getLoggerProvider().getLogger(name, version, options);
    }
    /** Remove the global logger provider */ disable() {
        delete __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["_global"][__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$internal$2f$global$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["GLOBAL_LOGS_API_KEY"]];
        this._proxyLoggerProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$ProxyLoggerProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ProxyLoggerProvider"]();
    }
} //# sourceMappingURL=logs.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
    "logs",
    ()=>logs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$api$2f$logs$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/api/logs.js [instrumentation] (ecmascript)");
;
;
;
const logs = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$api$2f$logs$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["LogsAPI"].getInstance(); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NOOP_LOGGER",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["NOOP_LOGGER"],
    "NoopLogger",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["NoopLogger"],
    "SeverityNumber",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$types$2f$LogRecord$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SeverityNumber"],
    "logs",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["logs"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$types$2f$LogRecord$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/types/LogRecord.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$NoopLogger$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/default-service-name.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "_clearDefaultServiceNameCache",
    ()=>_clearDefaultServiceNameCache,
    "defaultServiceName",
    ()=>defaultServiceName
]);
let serviceName;
function defaultServiceName() {
    if (serviceName === undefined) {
        try {
            const argv0 = globalThis.process.argv0;
            serviceName = argv0 ? `unknown_service:${argv0}` : 'unknown_service';
        } catch  {
            serviceName = 'unknown_service';
        }
    }
    return serviceName;
}
function _clearDefaultServiceNameCache() {
    serviceName = undefined;
} //# sourceMappingURL=default-service-name.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "isPromiseLike",
    ()=>isPromiseLike
]);
const isPromiseLike = (val)=>{
    return val !== null && typeof val === 'object' && typeof val.then === 'function';
}; //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "defaultResource",
    ()=>defaultResource,
    "emptyResource",
    ()=>emptyResource,
    "resourceFromAttributes",
    ()=>resourceFromAttributes,
    "resourceFromDetectedResource",
    ()=>resourceFromDetectedResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$sdk$2d$info$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/sdk-info.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_attributes.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$default$2d$service$2d$name$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/default-service-name.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/utils.js [instrumentation] (ecmascript)");
;
;
;
;
;
class ResourceImpl {
    _rawAttributes;
    _asyncAttributesPending = false;
    _schemaUrl;
    _memoizedAttributes;
    static FromAttributeList(attributes, options) {
        const res = new ResourceImpl({}, options);
        res._rawAttributes = guardedRawAttributes(attributes);
        res._asyncAttributesPending = attributes.filter(([_, val])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isPromiseLike"])(val)).length > 0;
        return res;
    }
    constructor(/**
     * A dictionary of attributes with string keys and values that provide
     * information about the entity as numbers, strings or booleans
     * TODO: Consider to add check/validation on attributes.
     */ resource, options){
        const attributes = resource.attributes ?? {};
        this._rawAttributes = Object.entries(attributes).map(([k, v])=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isPromiseLike"])(v)) {
                // side-effect
                this._asyncAttributesPending = true;
            }
            return [
                k,
                v
            ];
        });
        this._rawAttributes = guardedRawAttributes(this._rawAttributes);
        this._schemaUrl = validateSchemaUrl(options?.schemaUrl);
    }
    get asyncAttributesPending() {
        return this._asyncAttributesPending;
    }
    async waitForAsyncAttributes() {
        if (!this.asyncAttributesPending) {
            return;
        }
        for(let i = 0; i < this._rawAttributes.length; i++){
            const [k, v] = this._rawAttributes[i];
            this._rawAttributes[i] = [
                k,
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isPromiseLike"])(v) ? await v : v
            ];
        }
        this._asyncAttributesPending = false;
    }
    get attributes() {
        if (this.asyncAttributesPending) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error('Accessing resource attributes before async attributes settled');
        }
        if (this._memoizedAttributes) {
            return this._memoizedAttributes;
        }
        const attrs = {};
        for (const [k, v] of this._rawAttributes){
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isPromiseLike"])(v)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug(`Unsettled resource attribute ${k} skipped`);
                continue;
            }
            if (v != null) {
                attrs[k] ??= v;
            }
        }
        // only memoize output if all attributes are settled
        if (!this._asyncAttributesPending) {
            this._memoizedAttributes = attrs;
        }
        return attrs;
    }
    getRawAttributes() {
        return this._rawAttributes;
    }
    get schemaUrl() {
        return this._schemaUrl;
    }
    merge(resource) {
        if (resource == null) return this;
        // Order is important
        // Spec states incoming attributes override existing attributes
        const mergedSchemaUrl = mergeSchemaUrl(this, resource);
        const mergedOptions = mergedSchemaUrl ? {
            schemaUrl: mergedSchemaUrl
        } : undefined;
        return ResourceImpl.FromAttributeList([
            ...resource.getRawAttributes(),
            ...this.getRawAttributes()
        ], mergedOptions);
    }
}
function resourceFromAttributes(attributes, options) {
    return ResourceImpl.FromAttributeList(Object.entries(attributes), options);
}
function resourceFromDetectedResource(detectedResource, options) {
    return new ResourceImpl(detectedResource, options);
}
function emptyResource() {
    return resourceFromAttributes({});
}
function defaultResource() {
    return resourceFromAttributes({
        [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_SERVICE_NAME"]]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$default$2d$service$2d$name$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["defaultServiceName"])(),
        [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_TELEMETRY_SDK_LANGUAGE"]]: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$sdk$2d$info$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SDK_INFO"][__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_TELEMETRY_SDK_LANGUAGE"]],
        [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_TELEMETRY_SDK_NAME"]]: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$sdk$2d$info$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SDK_INFO"][__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_TELEMETRY_SDK_NAME"]],
        [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_TELEMETRY_SDK_VERSION"]]: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$sdk$2d$info$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SDK_INFO"][__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_TELEMETRY_SDK_VERSION"]]
    });
}
function guardedRawAttributes(attributes) {
    return attributes.map(([k, v])=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isPromiseLike"])(v)) {
            return [
                k,
                v.catch((err)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug('promise rejection for resource attribute: %s - %s', k, err);
                    return undefined;
                })
            ];
        }
        return [
            k,
            v
        ];
    });
}
function validateSchemaUrl(schemaUrl) {
    if (typeof schemaUrl === 'string' || schemaUrl === undefined) {
        return schemaUrl;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('Schema URL must be string or undefined, got %s. Schema URL will be ignored.', schemaUrl);
    return undefined;
}
function mergeSchemaUrl(old, updating) {
    const oldSchemaUrl = old?.schemaUrl;
    const updatingSchemaUrl = updating?.schemaUrl;
    const isOldEmpty = oldSchemaUrl === undefined || oldSchemaUrl === '';
    const isUpdatingEmpty = updatingSchemaUrl === undefined || updatingSchemaUrl === '';
    if (isOldEmpty) {
        return updatingSchemaUrl;
    }
    if (isUpdatingEmpty) {
        return oldSchemaUrl;
    }
    if (oldSchemaUrl === updatingSchemaUrl) {
        return oldSchemaUrl;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('Schema URL merge conflict: old resource has "%s", updating resource has "%s". Resulting resource will have undefined Schema URL.', oldSchemaUrl, updatingSchemaUrl);
    return undefined;
} //# sourceMappingURL=ResourceImpl.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detect-resources.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "detectResources",
    ()=>detectResources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js [instrumentation] (ecmascript)");
;
;
const detectResources = (config = {})=>{
    const resources = (config.detectors || []).map((d)=>{
        try {
            const resource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["resourceFromDetectedResource"])(d.detect(config));
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug(`${d.constructor.name} found resource.`, resource);
            return resource;
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug(`${d.constructor.name} failed: ${e.message}`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["emptyResource"])();
        }
    });
    return resources.reduce((acc, resource)=>acc.merge(resource), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["emptyResource"])());
}; //# sourceMappingURL=detect-resources.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/EnvDetector.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "envDetector",
    ()=>envDetector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_attributes.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/environment.js [instrumentation] (ecmascript)");
;
;
;
/**
 * EnvDetector can be used to detect the presence of and create a Resource
 * from the OTEL_RESOURCE_ATTRIBUTES environment variable.
 */ class EnvDetector {
    // Type, attribute keys, and attribute values should not exceed 256 characters.
    _MAX_LENGTH = 255;
    // OTEL_RESOURCE_ATTRIBUTES is a comma-separated list of attributes.
    _COMMA_SEPARATOR = ',';
    // OTEL_RESOURCE_ATTRIBUTES contains key value pair separated by '='.
    _LABEL_KEY_VALUE_SPLITTER = '=';
    _ERROR_MESSAGE_INVALID_CHARS = 'should be a ASCII string with a length greater than 0 and not exceed ' + this._MAX_LENGTH + ' characters.';
    _ERROR_MESSAGE_INVALID_VALUE = 'should be a ASCII string with a length not exceed ' + this._MAX_LENGTH + ' characters.';
    /**
     * Returns a {@link Resource} populated with attributes from the
     * OTEL_RESOURCE_ATTRIBUTES environment variable. Note this is an async
     * function to conform to the Detector interface.
     *
     * @param config The resource detection config
     */ detect(_config) {
        const attributes = {};
        const rawAttributes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])('OTEL_RESOURCE_ATTRIBUTES');
        const serviceName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])('OTEL_SERVICE_NAME');
        if (rawAttributes) {
            try {
                const parsedAttributes = this._parseResourceAttributes(rawAttributes);
                Object.assign(attributes, parsedAttributes);
            } catch (e) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug(`EnvDetector failed: ${e.message}`);
            }
        }
        if (serviceName) {
            attributes[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_SERVICE_NAME"]] = serviceName;
        }
        return {
            attributes
        };
    }
    /**
     * Creates an attribute map from the OTEL_RESOURCE_ATTRIBUTES environment
     * variable.
     *
     * OTEL_RESOURCE_ATTRIBUTES: A comma-separated list of attributes describing
     * the source in more detail, e.g. “key1=val1,key2=val2”. Domain names and
     * paths are accepted as attribute keys. Values may be quoted or unquoted in
     * general. If a value contains whitespace, =, or " characters, it must
     * always be quoted.
     *
     * @param rawEnvAttributes The resource attributes as a comma-separated list
     * of key/value pairs.
     * @returns The sanitized resource attributes.
     */ _parseResourceAttributes(rawEnvAttributes) {
        if (!rawEnvAttributes) return {};
        const attributes = {};
        const rawAttributes = rawEnvAttributes.split(this._COMMA_SEPARATOR, -1);
        for (const rawAttribute of rawAttributes){
            const keyValuePair = rawAttribute.split(this._LABEL_KEY_VALUE_SPLITTER, -1);
            if (keyValuePair.length !== 2) {
                continue;
            }
            let [key, value] = keyValuePair;
            // Leading and trailing whitespaces are trimmed.
            key = key.trim();
            value = value.trim().split(/^"|"$/).join('');
            if (!this._isValidAndNotEmpty(key)) {
                throw new Error(`Attribute key ${this._ERROR_MESSAGE_INVALID_CHARS}`);
            }
            if (!this._isValid(value)) {
                throw new Error(`Attribute value ${this._ERROR_MESSAGE_INVALID_VALUE}`);
            }
            attributes[key] = decodeURIComponent(value);
        }
        return attributes;
    }
    /**
     * Determines whether the given String is a valid printable ASCII string with
     * a length not exceed _MAX_LENGTH characters.
     *
     * @param str The String to be validated.
     * @returns Whether the String is valid.
     */ _isValid(name) {
        return name.length <= this._MAX_LENGTH && this._isBaggageOctetString(name);
    }
    // https://www.w3.org/TR/baggage/#definition
    _isBaggageOctetString(str) {
        for(let i = 0; i < str.length; i++){
            const ch = str.charCodeAt(i);
            if (ch < 0x21 || ch === 0x2c || ch === 0x3b || ch === 0x5c || ch > 0x7e) {
                return false;
            }
        }
        return true;
    }
    /**
     * Determines whether the given String is a valid printable ASCII string with
     * a length greater than 0 and not exceed _MAX_LENGTH characters.
     *
     * @param str The String to be validated.
     * @returns Whether the String is valid and not empty.
     */ _isValidAndNotEmpty(str) {
        return str.length > 0 && this._isValid(str);
    }
}
const envDetector = new EnvDetector(); //# sourceMappingURL=EnvDetector.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/semconv.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ /*
 * This file contains a copy of unstable semantic convention definitions
 * used by this package.
 * @see https://github.com/open-telemetry/opentelemetry-js/tree/main/semantic-conventions#unstable-semconv
 */ /**
 * The cloud account ID the resource is assigned to.
 *
 * @example 111111111111
 * @example opentelemetry
 *
 * @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
 */ __turbopack_context__.s([
    "ATTR_CLOUD_ACCOUNT_ID",
    ()=>ATTR_CLOUD_ACCOUNT_ID,
    "ATTR_CLOUD_AVAILABILITY_ZONE",
    ()=>ATTR_CLOUD_AVAILABILITY_ZONE,
    "ATTR_CLOUD_PROVIDER",
    ()=>ATTR_CLOUD_PROVIDER,
    "ATTR_CLOUD_REGION",
    ()=>ATTR_CLOUD_REGION,
    "ATTR_CONTAINER_ID",
    ()=>ATTR_CONTAINER_ID,
    "ATTR_CONTAINER_IMAGE_NAME",
    ()=>ATTR_CONTAINER_IMAGE_NAME,
    "ATTR_CONTAINER_IMAGE_TAGS",
    ()=>ATTR_CONTAINER_IMAGE_TAGS,
    "ATTR_CONTAINER_NAME",
    ()=>ATTR_CONTAINER_NAME,
    "ATTR_HOST_ARCH",
    ()=>ATTR_HOST_ARCH,
    "ATTR_HOST_ID",
    ()=>ATTR_HOST_ID,
    "ATTR_HOST_IMAGE_ID",
    ()=>ATTR_HOST_IMAGE_ID,
    "ATTR_HOST_IMAGE_NAME",
    ()=>ATTR_HOST_IMAGE_NAME,
    "ATTR_HOST_IMAGE_VERSION",
    ()=>ATTR_HOST_IMAGE_VERSION,
    "ATTR_HOST_NAME",
    ()=>ATTR_HOST_NAME,
    "ATTR_HOST_TYPE",
    ()=>ATTR_HOST_TYPE,
    "ATTR_K8S_CLUSTER_NAME",
    ()=>ATTR_K8S_CLUSTER_NAME,
    "ATTR_K8S_DEPLOYMENT_NAME",
    ()=>ATTR_K8S_DEPLOYMENT_NAME,
    "ATTR_K8S_NAMESPACE_NAME",
    ()=>ATTR_K8S_NAMESPACE_NAME,
    "ATTR_K8S_POD_NAME",
    ()=>ATTR_K8S_POD_NAME,
    "ATTR_OS_TYPE",
    ()=>ATTR_OS_TYPE,
    "ATTR_OS_VERSION",
    ()=>ATTR_OS_VERSION,
    "ATTR_PROCESS_COMMAND",
    ()=>ATTR_PROCESS_COMMAND,
    "ATTR_PROCESS_COMMAND_ARGS",
    ()=>ATTR_PROCESS_COMMAND_ARGS,
    "ATTR_PROCESS_EXECUTABLE_NAME",
    ()=>ATTR_PROCESS_EXECUTABLE_NAME,
    "ATTR_PROCESS_EXECUTABLE_PATH",
    ()=>ATTR_PROCESS_EXECUTABLE_PATH,
    "ATTR_PROCESS_OWNER",
    ()=>ATTR_PROCESS_OWNER,
    "ATTR_PROCESS_PID",
    ()=>ATTR_PROCESS_PID,
    "ATTR_PROCESS_RUNTIME_DESCRIPTION",
    ()=>ATTR_PROCESS_RUNTIME_DESCRIPTION,
    "ATTR_PROCESS_RUNTIME_NAME",
    ()=>ATTR_PROCESS_RUNTIME_NAME,
    "ATTR_PROCESS_RUNTIME_VERSION",
    ()=>ATTR_PROCESS_RUNTIME_VERSION,
    "ATTR_SERVICE_INSTANCE_ID",
    ()=>ATTR_SERVICE_INSTANCE_ID,
    "ATTR_SERVICE_NAMESPACE",
    ()=>ATTR_SERVICE_NAMESPACE,
    "ATTR_WEBENGINE_DESCRIPTION",
    ()=>ATTR_WEBENGINE_DESCRIPTION,
    "ATTR_WEBENGINE_NAME",
    ()=>ATTR_WEBENGINE_NAME,
    "ATTR_WEBENGINE_VERSION",
    ()=>ATTR_WEBENGINE_VERSION
]);
const ATTR_CLOUD_ACCOUNT_ID = 'cloud.account.id';
const ATTR_CLOUD_AVAILABILITY_ZONE = 'cloud.availability_zone';
const ATTR_CLOUD_PROVIDER = 'cloud.provider';
const ATTR_CLOUD_REGION = 'cloud.region';
const ATTR_CONTAINER_ID = 'container.id';
const ATTR_CONTAINER_IMAGE_NAME = 'container.image.name';
const ATTR_CONTAINER_IMAGE_TAGS = 'container.image.tags';
const ATTR_CONTAINER_NAME = 'container.name';
const ATTR_HOST_ARCH = 'host.arch';
const ATTR_HOST_ID = 'host.id';
const ATTR_HOST_IMAGE_ID = 'host.image.id';
const ATTR_HOST_IMAGE_NAME = 'host.image.name';
const ATTR_HOST_IMAGE_VERSION = 'host.image.version';
const ATTR_HOST_NAME = 'host.name';
const ATTR_HOST_TYPE = 'host.type';
const ATTR_K8S_CLUSTER_NAME = 'k8s.cluster.name';
const ATTR_K8S_DEPLOYMENT_NAME = 'k8s.deployment.name';
const ATTR_K8S_NAMESPACE_NAME = 'k8s.namespace.name';
const ATTR_K8S_POD_NAME = 'k8s.pod.name';
const ATTR_OS_TYPE = 'os.type';
const ATTR_OS_VERSION = 'os.version';
const ATTR_PROCESS_COMMAND = 'process.command';
const ATTR_PROCESS_COMMAND_ARGS = 'process.command_args';
const ATTR_PROCESS_EXECUTABLE_NAME = 'process.executable.name';
const ATTR_PROCESS_EXECUTABLE_PATH = 'process.executable.path';
const ATTR_PROCESS_OWNER = 'process.owner';
const ATTR_PROCESS_PID = 'process.pid';
const ATTR_PROCESS_RUNTIME_DESCRIPTION = 'process.runtime.description';
const ATTR_PROCESS_RUNTIME_NAME = 'process.runtime.name';
const ATTR_PROCESS_RUNTIME_VERSION = 'process.runtime.version';
const ATTR_SERVICE_INSTANCE_ID = 'service.instance.id';
const ATTR_SERVICE_NAMESPACE = 'service.namespace';
const ATTR_WEBENGINE_DESCRIPTION = 'webengine.description';
const ATTR_WEBENGINE_NAME = 'webengine.name';
const ATTR_WEBENGINE_VERSION = 'webengine.version'; //# sourceMappingURL=semconv.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/getMachineId.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "getMachineId",
    ()=>getMachineId
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$process__$5b$external$5d$__$28$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/process [external] (process, cjs)");
;
let getMachineIdImpl;
async function getMachineId() {
    if (!getMachineIdImpl) {
        switch(__TURBOPACK__imported__module__$5b$externals$5d2f$process__$5b$external$5d$__$28$process$2c$__cjs$29$__["platform"]){
            case 'darwin':
                getMachineIdImpl = (await __turbopack_context__.A("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/getMachineId-darwin.js [instrumentation] (ecmascript, async loader)")).getMachineId;
                break;
            case 'linux':
                getMachineIdImpl = (await __turbopack_context__.A("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/getMachineId-linux.js [instrumentation] (ecmascript, async loader)")).getMachineId;
                break;
            case 'freebsd':
                getMachineIdImpl = (await __turbopack_context__.A("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/getMachineId-bsd.js [instrumentation] (ecmascript, async loader)")).getMachineId;
                break;
            case 'win32':
                getMachineIdImpl = (await __turbopack_context__.A("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/getMachineId-win.js [instrumentation] (ecmascript, async loader)")).getMachineId;
                break;
            default:
                getMachineIdImpl = (await __turbopack_context__.A("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/getMachineId-unsupported.js [instrumentation] (ecmascript, async loader)")).getMachineId;
                break;
        }
    }
    return getMachineIdImpl();
} //# sourceMappingURL=getMachineId.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "normalizeArch",
    ()=>normalizeArch,
    "normalizeType",
    ()=>normalizeType
]);
const normalizeArch = (nodeArchString)=>{
    // Maps from https://nodejs.org/api/os.html#osarch to arch values in spec:
    // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/host.md
    switch(nodeArchString){
        case 'arm':
            return 'arm32';
        case 'ppc':
            return 'ppc32';
        case 'x64':
            return 'amd64';
        default:
            return nodeArchString;
    }
};
const normalizeType = (nodePlatform)=>{
    // Maps from https://nodejs.org/api/os.html#osplatform to arch values in spec:
    // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/os.md
    switch(nodePlatform){
        case 'sunos':
            return 'solaris';
        case 'win32':
            return 'windows';
        default:
            return nodePlatform;
    }
}; //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/HostDetector.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "hostDetector",
    ()=>hostDetector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/semconv.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/os [external] (os, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$machine$2d$id$2f$getMachineId$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/getMachineId.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/utils.js [instrumentation] (ecmascript)");
;
;
;
;
/**
 * HostDetector detects the resources related to the host current process is
 * running on. Currently only non-cloud-based attributes are included.
 */ class HostDetector {
    detect(_config) {
        const attributes = {
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_HOST_NAME"]]: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__["hostname"])(),
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_HOST_ARCH"]]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["normalizeArch"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__["arch"])()),
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_HOST_ID"]]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$machine$2d$id$2f$getMachineId$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getMachineId"])()
        };
        return {
            attributes
        };
    }
}
const hostDetector = new HostDetector(); //# sourceMappingURL=HostDetector.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/OSDetector.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "osDetector",
    ()=>osDetector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/semconv.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/os [external] (os, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/utils.js [instrumentation] (ecmascript)");
;
;
;
/**
 * OSDetector detects the resources related to the operating system (OS) on
 * which the process represented by this resource is running.
 */ class OSDetector {
    detect(_config) {
        const attributes = {
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_OS_TYPE"]]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["normalizeType"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__["platform"])()),
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_OS_VERSION"]]: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__["release"])()
        };
        return {
            attributes
        };
    }
}
const osDetector = new OSDetector(); //# sourceMappingURL=OSDetector.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/ProcessDetector.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "processDetector",
    ()=>processDetector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/semconv.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/os [external] (os, cjs)");
;
;
;
/**
 * ProcessDetector will be used to detect the resources related current process running
 * and being instrumented from the NodeJS Process module.
 */ class ProcessDetector {
    detect(_config) {
        const attributes = {
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_PID"]]: process.pid,
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_EXECUTABLE_NAME"]]: process.title,
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_EXECUTABLE_PATH"]]: process.execPath,
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_COMMAND_ARGS"]]: [
                process.argv[0],
                ...process.execArgv,
                ...process.argv.slice(1)
            ],
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_RUNTIME_VERSION"]]: process.versions.node,
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_RUNTIME_NAME"]]: 'nodejs',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_RUNTIME_DESCRIPTION"]]: 'Node.js'
        };
        if (process.argv.length > 1) {
            attributes[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_COMMAND"]] = process.argv[1];
        }
        try {
            const userInfo = __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__["userInfo"]();
            attributes[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_PROCESS_OWNER"]] = userInfo.username;
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug(`error obtaining process owner: ${e}`);
        }
        return {
            attributes
        };
    }
}
const processDetector = new ProcessDetector(); //# sourceMappingURL=ProcessDetector.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/ServiceInstanceIdDetector.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "serviceInstanceIdDetector",
    ()=>serviceInstanceIdDetector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/semconv.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
/**
 * ServiceInstanceIdDetector detects the resources related to the service instance ID.
 */ class ServiceInstanceIdDetector {
    detect(_config) {
        return {
            attributes: {
                [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$semconv$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_SERVICE_INSTANCE_ID"]]: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])()
            }
        };
    }
}
const serviceInstanceIdDetector = new ServiceInstanceIdDetector(); //# sourceMappingURL=ServiceInstanceIdDetector.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultResource",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["defaultResource"],
    "defaultServiceName",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$default$2d$service$2d$name$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["defaultServiceName"],
    "detectResources",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detect$2d$resources$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["detectResources"],
    "emptyResource",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["emptyResource"],
    "envDetector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$EnvDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["envDetector"],
    "hostDetector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$HostDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hostDetector"],
    "osDetector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$OSDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["osDetector"],
    "processDetector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$ProcessDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["processDetector"],
    "resourceFromAttributes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["resourceFromAttributes"],
    "serviceInstanceIdDetector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$ServiceInstanceIdDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["serviceInstanceIdDetector"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detect$2d$resources$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detect-resources.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$EnvDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/EnvDetector.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$HostDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/HostDetector.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$OSDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/OSDetector.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$ProcessDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/ProcessDetector.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$ServiceInstanceIdDetector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/ServiceInstanceIdDetector.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$default$2d$service$2d$name$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/default-service-name.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/AbstractAsyncHooksContextManager.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AbstractAsyncHooksContextManager = void 0;
const events_1 = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
const ADD_LISTENER_METHODS = [
    'addListener',
    'on',
    'once',
    'prependListener',
    'prependOnceListener'
];
class AbstractAsyncHooksContextManager {
    /**
     * Binds a the certain context or the active one to the target function and then returns the target
     * @param context A context (span) to be bind to target
     * @param target a function or event emitter. When target or one of its callbacks is called,
     *  the provided context will be used as the active context for the duration of the call.
     */ bind(context, target) {
        if (target instanceof events_1.EventEmitter) {
            return this._bindEventEmitter(context, target);
        }
        if (typeof target === 'function') {
            return this._bindFunction(context, target);
        }
        return target;
    }
    _bindFunction(context, target) {
        const manager = this;
        const contextWrapper = function(...args) {
            return manager.with(context, ()=>target.apply(this, args));
        };
        Object.defineProperty(contextWrapper, 'length', {
            enumerable: false,
            configurable: true,
            writable: false,
            value: target.length
        });
        /**
         * It isn't possible to tell Typescript that contextWrapper is the same as T
         * so we forced to cast as any here.
         */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return contextWrapper;
    }
    /**
     * By default, EventEmitter call their callback with their context, which we do
     * not want, instead we will bind a specific context to all callbacks that
     * go through it.
     * @param context the context we want to bind
     * @param ee EventEmitter an instance of EventEmitter to patch
     */ _bindEventEmitter(context, ee) {
        const map = this._getPatchMap(ee);
        if (map !== undefined) return ee;
        this._createPatchMap(ee);
        // patch methods that add a listener to propagate context
        ADD_LISTENER_METHODS.forEach((methodName)=>{
            if (ee[methodName] === undefined) return;
            ee[methodName] = this._patchAddListener(ee, ee[methodName], context);
        });
        // patch methods that remove a listener
        if (typeof ee.removeListener === 'function') {
            ee.removeListener = this._patchRemoveListener(ee, ee.removeListener);
        }
        if (typeof ee.off === 'function') {
            ee.off = this._patchRemoveListener(ee, ee.off);
        }
        // patch method that remove all listeners
        if (typeof ee.removeAllListeners === 'function') {
            ee.removeAllListeners = this._patchRemoveAllListeners(ee, ee.removeAllListeners);
        }
        return ee;
    }
    /**
     * Patch methods that remove a given listener so that we match the "patched"
     * version of that listener (the one that propagate context).
     * @param ee EventEmitter instance
     * @param original reference to the patched method
     */ _patchRemoveListener(ee, original) {
        const contextManager = this;
        return function(event, listener) {
            const events = contextManager._getPatchMap(ee)?.[event];
            if (events === undefined) {
                return original.call(this, event, listener);
            }
            const patchedListener = events.get(listener);
            return original.call(this, event, patchedListener || listener);
        };
    }
    /**
     * Patch methods that remove all listeners so we remove our
     * internal references for a given event.
     * @param ee EventEmitter instance
     * @param original reference to the patched method
     */ _patchRemoveAllListeners(ee, original) {
        const contextManager = this;
        return function(event) {
            const map = contextManager._getPatchMap(ee);
            if (map !== undefined) {
                if (arguments.length === 0) {
                    contextManager._createPatchMap(ee);
                } else if (map[event] !== undefined) {
                    delete map[event];
                }
            }
            return original.apply(this, arguments);
        };
    }
    /**
     * Patch methods on an event emitter instance that can add listeners so we
     * can force them to propagate a given context.
     * @param ee EventEmitter instance
     * @param original reference to the patched method
     * @param [context] context to propagate when calling listeners
     */ _patchAddListener(ee, original, context) {
        const contextManager = this;
        return function(event, listener) {
            /**
             * This check is required to prevent double-wrapping the listener.
             * The implementation for ee.once wraps the listener and calls ee.on.
             * Without this check, we would wrap that wrapped listener.
             * This causes an issue because ee.removeListener depends on the onceWrapper
             * to properly remove the listener. If we wrap their wrapper, we break
             * that detection.
             */ if (contextManager._wrapped) {
                return original.call(this, event, listener);
            }
            let map = contextManager._getPatchMap(ee);
            if (map === undefined) {
                map = contextManager._createPatchMap(ee);
            }
            let listeners = map[event];
            if (listeners === undefined) {
                listeners = new WeakMap();
                map[event] = listeners;
            }
            const patchedListener = contextManager.bind(context, listener);
            // store a weak reference of the user listener to ours
            listeners.set(listener, patchedListener);
            /**
             * See comment at the start of this function for the explanation of this property.
             */ contextManager._wrapped = true;
            try {
                return original.call(this, event, patchedListener);
            } finally{
                contextManager._wrapped = false;
            }
        };
    }
    _createPatchMap(ee) {
        const map = Object.create(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ee[this._kOtListeners] = map;
        return map;
    }
    _getPatchMap(ee) {
        return ee[this._kOtListeners];
    }
    _kOtListeners = Symbol('OtListeners');
    _wrapped = false;
}
exports.AbstractAsyncHooksContextManager = AbstractAsyncHooksContextManager; //# sourceMappingURL=AbstractAsyncHooksContextManager.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/AsyncHooksContextManager.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncHooksContextManager = void 0;
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const asyncHooks = __turbopack_context__.r("[externals]/async_hooks [external] (async_hooks, cjs)");
const AbstractAsyncHooksContextManager_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/AbstractAsyncHooksContextManager.js [instrumentation] (ecmascript)");
/**
 * @deprecated Use AsyncLocalStorageContextManager instead.
 */ class AsyncHooksContextManager extends AbstractAsyncHooksContextManager_1.AbstractAsyncHooksContextManager {
    _asyncHook;
    _contexts = new Map();
    _stack = [];
    constructor(){
        super();
        this._asyncHook = asyncHooks.createHook({
            init: this._init.bind(this),
            before: this._before.bind(this),
            after: this._after.bind(this),
            destroy: this._destroy.bind(this),
            promiseResolve: this._destroy.bind(this)
        });
    }
    active() {
        return this._stack[this._stack.length - 1] ?? api_1.ROOT_CONTEXT;
    }
    with(context, fn, thisArg, ...args) {
        this._enterContext(context);
        try {
            return fn.call(thisArg, ...args);
        } finally{
            this._exitContext();
        }
    }
    enable() {
        this._asyncHook.enable();
        return this;
    }
    disable() {
        this._asyncHook.disable();
        this._contexts.clear();
        this._stack = [];
        return this;
    }
    /**
     * Init hook will be called when userland create a async context, setting the
     * context as the current one if it exist.
     * @param uid id of the async context
     * @param type the resource type
     */ _init(uid, type) {
        // ignore TIMERWRAP as they combine timers with same timeout which can lead to
        // false context propagation. TIMERWRAP has been removed in node 11
        // every timer has it's own `Timeout` resource anyway which is used to propagate
        // context.
        if (type === 'TIMERWRAP') return;
        const context = this._stack[this._stack.length - 1];
        if (context !== undefined) {
            this._contexts.set(uid, context);
        }
    }
    /**
     * Destroy hook will be called when a given context is no longer used so we can
     * remove its attached context.
     * @param uid uid of the async context
     */ _destroy(uid) {
        this._contexts.delete(uid);
    }
    /**
     * Before hook is called just before executing a async context.
     * @param uid uid of the async context
     */ _before(uid) {
        const context = this._contexts.get(uid);
        if (context !== undefined) {
            this._enterContext(context);
        }
    }
    /**
     * After hook is called just after completing the execution of a async context.
     */ _after() {
        this._exitContext();
    }
    /**
     * Set the given context as active
     */ _enterContext(context) {
        this._stack.push(context);
    }
    /**
     * Remove the context at the root of the stack
     */ _exitContext() {
        this._stack.pop();
    }
}
exports.AsyncHooksContextManager = AsyncHooksContextManager; //# sourceMappingURL=AsyncHooksContextManager.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/AsyncLocalStorageContextManager.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncLocalStorageContextManager = void 0;
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const async_hooks_1 = __turbopack_context__.r("[externals]/async_hooks [external] (async_hooks, cjs)");
const AbstractAsyncHooksContextManager_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/AbstractAsyncHooksContextManager.js [instrumentation] (ecmascript)");
class AsyncLocalStorageContextManager extends AbstractAsyncHooksContextManager_1.AbstractAsyncHooksContextManager {
    _asyncLocalStorage;
    constructor(){
        super();
        this._asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
    }
    active() {
        return this._asyncLocalStorage.getStore() ?? api_1.ROOT_CONTEXT;
    }
    with(context, fn, thisArg, ...args) {
        const cb = thisArg == null ? fn : fn.bind(thisArg);
        return this._asyncLocalStorage.run(context, cb, ...args);
    }
    enable() {
        return this;
    }
    disable() {
        this._asyncLocalStorage.disable();
        return this;
    }
}
exports.AsyncLocalStorageContextManager = AsyncLocalStorageContextManager; //# sourceMappingURL=AsyncLocalStorageContextManager.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncLocalStorageContextManager = exports.AsyncHooksContextManager = void 0;
var AsyncHooksContextManager_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/AsyncHooksContextManager.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "AsyncHooksContextManager", {
    enumerable: true,
    get: function() {
        return AsyncHooksContextManager_1.AsyncHooksContextManager;
    }
});
var AsyncLocalStorageContextManager_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/AsyncLocalStorageContextManager.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "AsyncLocalStorageContextManager", {
    enumerable: true,
    get: function() {
        return AsyncLocalStorageContextManager_1.AsyncLocalStorageContextManager;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-node/build/src/NodeTracerProvider.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NodeTracerProvider = void 0;
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
 */ const context_async_hooks_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/index.js [instrumentation] (ecmascript)");
const sdk_trace_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-base/build/esm/index.js [instrumentation] (ecmascript)");
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const core_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
function setupContextManager(contextManager) {
    // null means 'do not register'
    if (contextManager === null) {
        return;
    }
    // undefined means 'register default'
    if (contextManager === undefined) {
        const defaultContextManager = new context_async_hooks_1.AsyncLocalStorageContextManager();
        defaultContextManager.enable();
        api_1.context.setGlobalContextManager(defaultContextManager);
        return;
    }
    contextManager.enable();
    api_1.context.setGlobalContextManager(contextManager);
}
function setupPropagator(propagator) {
    // null means 'do not register'
    if (propagator === null) {
        return;
    }
    // undefined means 'register default'
    if (propagator === undefined) {
        api_1.propagation.setGlobalPropagator(new core_1.CompositePropagator({
            propagators: [
                new core_1.W3CTraceContextPropagator(),
                new core_1.W3CBaggagePropagator()
            ]
        }));
        return;
    }
    api_1.propagation.setGlobalPropagator(propagator);
}
/**
 * Register this TracerProvider for use with the OpenTelemetry API.
 * Undefined values may be replaced with defaults, and
 * null values will be skipped.
 *
 * @param config Configuration object for SDK registration
 */ class NodeTracerProvider extends sdk_trace_base_1.BasicTracerProvider {
    constructor(config = {}){
        super(config);
    }
    /**
     * Register this TracerProvider for use with the OpenTelemetry API.
     * Undefined values may be replaced with defaults, and
     * null values will be skipped.
     *
     * @param config Configuration object for SDK registration
     */ register(config = {}) {
        api_1.trace.setGlobalTracerProvider(this);
        setupContextManager(config.contextManager);
        setupPropagator(config.propagator);
    }
}
exports.NodeTracerProvider = NodeTracerProvider; //# sourceMappingURL=NodeTracerProvider.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-node/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TraceIdRatioBasedSampler = exports.SimpleSpanProcessor = exports.SamplingDecision = exports.RandomIdGenerator = exports.ParentBasedSampler = exports.NoopSpanProcessor = exports.InMemorySpanExporter = exports.ConsoleSpanExporter = exports.BatchSpanProcessor = exports.BasicTracerProvider = exports.AlwaysOnSampler = exports.AlwaysOffSampler = exports.NodeTracerProvider = void 0;
var NodeTracerProvider_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-node/build/src/NodeTracerProvider.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "NodeTracerProvider", {
    enumerable: true,
    get: function() {
        return NodeTracerProvider_1.NodeTracerProvider;
    }
});
var sdk_trace_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-base/build/esm/index.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "AlwaysOffSampler", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.AlwaysOffSampler;
    }
});
Object.defineProperty(exports, "AlwaysOnSampler", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.AlwaysOnSampler;
    }
});
Object.defineProperty(exports, "BasicTracerProvider", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.BasicTracerProvider;
    }
});
Object.defineProperty(exports, "BatchSpanProcessor", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.BatchSpanProcessor;
    }
});
Object.defineProperty(exports, "ConsoleSpanExporter", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.ConsoleSpanExporter;
    }
});
Object.defineProperty(exports, "InMemorySpanExporter", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.InMemorySpanExporter;
    }
});
Object.defineProperty(exports, "NoopSpanProcessor", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.NoopSpanProcessor;
    }
});
Object.defineProperty(exports, "ParentBasedSampler", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.ParentBasedSampler;
    }
});
Object.defineProperty(exports, "RandomIdGenerator", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.RandomIdGenerator;
    }
});
Object.defineProperty(exports, "SamplingDecision", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.SamplingDecision;
    }
});
Object.defineProperty(exports, "SimpleSpanProcessor", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.SimpleSpanProcessor;
    }
});
Object.defineProperty(exports, "TraceIdRatioBasedSampler", {
    enumerable: true,
    get: function() {
        return sdk_trace_base_1.TraceIdRatioBasedSampler;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
;
;
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/autoLoaderUtils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * Enable instrumentations
 * @param instrumentations
 * @param tracerProvider
 * @param meterProvider
 */ __turbopack_context__.s([
    "disableInstrumentations",
    ()=>disableInstrumentations,
    "enableInstrumentations",
    ()=>enableInstrumentations
]);
function enableInstrumentations(instrumentations, tracerProvider, meterProvider, loggerProvider) {
    for(let i = 0, j = instrumentations.length; i < j; i++){
        const instrumentation = instrumentations[i];
        if (tracerProvider) {
            instrumentation.setTracerProvider(tracerProvider);
        }
        if (meterProvider) {
            instrumentation.setMeterProvider(meterProvider);
        }
        if (loggerProvider && instrumentation.setLoggerProvider) {
            instrumentation.setLoggerProvider(loggerProvider);
        }
        // instrumentations have been already enabled during creation
        // so enable only if user prevented that by setting enabled to false
        // this is to prevent double enabling but when calling register all
        // instrumentations should be now enabled
        if (!instrumentation.getConfig().enabled) {
            instrumentation.enable();
        }
    }
}
function disableInstrumentations(instrumentations) {
    instrumentations.forEach((instrumentation)=>instrumentation.disable());
} //# sourceMappingURL=autoLoaderUtils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/autoLoader.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "registerInstrumentations",
    ()=>registerInstrumentations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/metrics-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$autoLoaderUtils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/autoLoaderUtils.js [instrumentation] (ecmascript)");
;
;
;
function registerInstrumentations(options) {
    const tracerProvider = options.tracerProvider || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].getTracerProvider();
    const meterProvider = options.meterProvider || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["metrics"].getMeterProvider();
    const loggerProvider = options.loggerProvider || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["logs"].getLoggerProvider();
    const instrumentations = options.instrumentations?.flat() ?? [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$autoLoaderUtils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["enableInstrumentations"])(instrumentations, tracerProvider, meterProvider, loggerProvider);
    return ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$autoLoaderUtils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["disableInstrumentations"])(instrumentations);
    };
} //# sourceMappingURL=autoLoader.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/semver.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ // This is a custom semantic versioning implementation compatible with the
// `satisfies(version, range, options?)` function from the `semver` npm package;
// with the exception that the `loose` option is not supported.
//
// The motivation for the custom semver implementation is that
// `semver` package has some initialization delay (lots of RegExp init and compile)
// and this leads to coldstart overhead for the OTEL Lambda Node.js layer.
// Hence, we have implemented lightweight version of it internally with required functionalities.
__turbopack_context__.s([
    "satisfies",
    ()=>satisfies
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
const VERSION_REGEXP = /^(?:v)?(?<version>(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*))(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<build>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const RANGE_REGEXP = /^(?<op><|>|=|==|<=|>=|~|\^|~>)?\s*(?:v)?(?<version>(?<major>x|X|\*|0|[1-9]\d*)(?:\.(?<minor>x|X|\*|0|[1-9]\d*))?(?:\.(?<patch>x|X|\*|0|[1-9]\d*))?)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<build>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const operatorResMap = {
    '>': [
        1
    ],
    '>=': [
        0,
        1
    ],
    '=': [
        0
    ],
    '<=': [
        -1,
        0
    ],
    '<': [
        -1
    ],
    '!=': [
        -1,
        1
    ]
};
function satisfies(version, range, options) {
    // Strict semver format check
    if (!_validateVersion(version)) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error(`Invalid version: ${version}`);
        return false;
    }
    // If range is empty, satisfy check succeeds regardless what version is
    if (!range) {
        return true;
    }
    // Cleanup range
    range = range.replace(/([<>=~^]+)\s+/g, '$1');
    // Parse version
    const parsedVersion = _parseVersion(version);
    if (!parsedVersion) {
        return false;
    }
    const allParsedRanges = [];
    // Check given version whether it satisfies given range expression
    const checkResult = _doSatisfies(parsedVersion, range, allParsedRanges, options);
    // If check result is OK,
    // do another final check for pre-release, if pre-release check is included by option
    if (checkResult && !options?.includePrerelease) {
        return _doPreleaseCheck(parsedVersion, allParsedRanges);
    }
    return checkResult;
}
function _validateVersion(version) {
    return typeof version === 'string' && VERSION_REGEXP.test(version);
}
function _doSatisfies(parsedVersion, range, allParsedRanges, options) {
    if (range.includes('||')) {
        // A version matches a range if and only if
        // every comparator in at least one of the ||-separated comparator sets is satisfied by the version
        const ranges = range.trim().split('||');
        for (const r of ranges){
            if (_checkRange(parsedVersion, r, allParsedRanges, options)) {
                return true;
            }
        }
        return false;
    } else if (range.includes(' - ')) {
        // Hyphen ranges: https://github.com/npm/node-semver#hyphen-ranges-xyz---abc
        range = replaceHyphen(range, options);
    } else if (range.includes(' ')) {
        // Multiple separated ranges and all needs to be satisfied for success
        const ranges = range.trim().replace(/\s{2,}/g, ' ').split(' ');
        for (const r of ranges){
            if (!_checkRange(parsedVersion, r, allParsedRanges, options)) {
                return false;
            }
        }
        return true;
    }
    // Check given parsed version with given range
    return _checkRange(parsedVersion, range, allParsedRanges, options);
}
function _checkRange(parsedVersion, range, allParsedRanges, options) {
    range = _normalizeRange(range, options);
    if (range.includes(' ')) {
        // If there are multiple ranges separated, satisfy each of them
        return _doSatisfies(parsedVersion, range, allParsedRanges, options);
    } else {
        // Validate and parse range
        const parsedRange = _parseRange(range);
        allParsedRanges.push(parsedRange);
        // Check parsed version by parsed range
        return _satisfies(parsedVersion, parsedRange);
    }
}
function _satisfies(parsedVersion, parsedRange) {
    // If range is invalid, satisfy check fails (no error throw)
    if (parsedRange.invalid) {
        return false;
    }
    // If range is empty or wildcard, satisfy check succeeds regardless what version is
    if (!parsedRange.version || _isWildcard(parsedRange.version)) {
        return true;
    }
    // Compare version segment first
    let comparisonResult = _compareVersionSegments(parsedVersion.versionSegments || [], parsedRange.versionSegments || []);
    // If versions segments are equal, compare by pre-release segments
    if (comparisonResult === 0) {
        const versionPrereleaseSegments = parsedVersion.prereleaseSegments || [];
        const rangePrereleaseSegments = parsedRange.prereleaseSegments || [];
        if (!versionPrereleaseSegments.length && !rangePrereleaseSegments.length) {
            comparisonResult = 0;
        } else if (!versionPrereleaseSegments.length && rangePrereleaseSegments.length) {
            comparisonResult = 1;
        } else if (versionPrereleaseSegments.length && !rangePrereleaseSegments.length) {
            comparisonResult = -1;
        } else {
            comparisonResult = _compareVersionSegments(versionPrereleaseSegments, rangePrereleaseSegments);
        }
    }
    // Resolve check result according to comparison operator
    return operatorResMap[parsedRange.op]?.includes(comparisonResult);
}
function _doPreleaseCheck(parsedVersion, allParsedRanges) {
    if (parsedVersion.prerelease) {
        return allParsedRanges.some((r)=>r.prerelease && r.version === parsedVersion.version);
    }
    return true;
}
function _normalizeRange(range, options) {
    range = range.trim();
    range = replaceCaret(range, options);
    range = replaceTilde(range);
    range = replaceXRange(range, options);
    range = range.trim();
    return range;
}
function isX(id) {
    return !id || id.toLowerCase() === 'x' || id === '*';
}
function _parseVersion(versionString) {
    const match = versionString.match(VERSION_REGEXP);
    if (!match) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error(`Invalid version: ${versionString}`);
        return undefined;
    }
    const version = match.groups.version;
    const prerelease = match.groups.prerelease;
    const build = match.groups.build;
    const versionSegments = version.split('.');
    const prereleaseSegments = prerelease?.split('.');
    return {
        op: undefined,
        version,
        versionSegments,
        versionSegmentCount: versionSegments.length,
        prerelease,
        prereleaseSegments,
        prereleaseSegmentCount: prereleaseSegments ? prereleaseSegments.length : 0,
        build
    };
}
function _parseRange(rangeString) {
    if (!rangeString) {
        return {};
    }
    const match = rangeString.match(RANGE_REGEXP);
    if (!match) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error(`Invalid range: ${rangeString}`);
        return {
            invalid: true
        };
    }
    let op = match.groups.op;
    const version = match.groups.version;
    const prerelease = match.groups.prerelease;
    const build = match.groups.build;
    const versionSegments = version.split('.');
    const prereleaseSegments = prerelease?.split('.');
    if (op === '==') {
        op = '=';
    }
    return {
        op: op || '=',
        version,
        versionSegments,
        versionSegmentCount: versionSegments.length,
        prerelease,
        prereleaseSegments,
        prereleaseSegmentCount: prereleaseSegments ? prereleaseSegments.length : 0,
        build
    };
}
function _isWildcard(s) {
    return s === '*' || s === 'x' || s === 'X';
}
function _parseVersionString(v) {
    const n = parseInt(v, 10);
    return isNaN(n) ? v : n;
}
function _normalizeVersionType(a, b) {
    if (typeof a === typeof b) {
        if (typeof a === 'number') {
            return [
                a,
                b
            ];
        } else if (typeof a === 'string') {
            return [
                a,
                b
            ];
        } else {
            throw new Error('Version segments can only be strings or numbers');
        }
    } else {
        return [
            String(a),
            String(b)
        ];
    }
}
function _compareVersionStrings(v1, v2) {
    if (_isWildcard(v1) || _isWildcard(v2)) {
        return 0;
    }
    const [parsedV1, parsedV2] = _normalizeVersionType(_parseVersionString(v1), _parseVersionString(v2));
    if (parsedV1 > parsedV2) {
        return 1;
    } else if (parsedV1 < parsedV2) {
        return -1;
    }
    return 0;
}
function _compareVersionSegments(v1, v2) {
    for(let i = 0; i < Math.max(v1.length, v2.length); i++){
        const res = _compareVersionStrings(v1[i] || '0', v2[i] || '0');
        if (res !== 0) {
            return res;
        }
    }
    return 0;
}
////////////////////////////////////////////////////////////////////////////////
// The rest of this file is adapted from portions of https://github.com/npm/node-semver/tree/868d4bb
// License:
/*
 * The ISC License
 *
 * Copyright (c) Isaac Z. Schlueter and Contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
 * IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */ const LETTERDASHNUMBER = '[a-zA-Z0-9-]';
const NUMERICIDENTIFIER = '0|[1-9]\\d*';
const NONNUMERICIDENTIFIER = `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`;
const GTLT = '((?:<|>)?=?)';
const PRERELEASEIDENTIFIER = `(?:${NUMERICIDENTIFIER}|${NONNUMERICIDENTIFIER})`;
const PRERELEASE = `(?:-(${PRERELEASEIDENTIFIER}(?:\\.${PRERELEASEIDENTIFIER})*))`;
const BUILDIDENTIFIER = `${LETTERDASHNUMBER}+`;
const BUILD = `(?:\\+(${BUILDIDENTIFIER}(?:\\.${BUILDIDENTIFIER})*))`;
const XRANGEIDENTIFIER = `${NUMERICIDENTIFIER}|x|X|\\*`;
const XRANGEPLAIN = `[v=\\s]*(${XRANGEIDENTIFIER})` + `(?:\\.(${XRANGEIDENTIFIER})` + `(?:\\.(${XRANGEIDENTIFIER})` + `(?:${PRERELEASE})?${BUILD}?` + `)?)?`;
const XRANGE = `^${GTLT}\\s*${XRANGEPLAIN}$`;
const XRANGE_REGEXP = new RegExp(XRANGE);
const HYPHENRANGE = `^\\s*(${XRANGEPLAIN})` + `\\s+-\\s+` + `(${XRANGEPLAIN})` + `\\s*$`;
const HYPHENRANGE_REGEXP = new RegExp(HYPHENRANGE);
const LONETILDE = '(?:~>?)';
const TILDE = `^${LONETILDE}${XRANGEPLAIN}$`;
const TILDE_REGEXP = new RegExp(TILDE);
const LONECARET = '(?:\\^)';
const CARET = `^${LONECARET}${XRANGEPLAIN}$`;
const CARET_REGEXP = new RegExp(CARET);
// Borrowed from https://github.com/npm/node-semver/blob/868d4bbe3d318c52544f38d5f9977a1103e924c2/classes/range.js#L285
//
// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
function replaceTilde(comp) {
    const r = TILDE_REGEXP;
    return comp.replace(r, (_, M, m, p, pr)=>{
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            // ~1.2 == >=1.2.0 <1.3.0-0
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
            // ~1.2.3 == >=1.2.3 <1.3.0-0
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        return ret;
    });
}
// Borrowed from https://github.com/npm/node-semver/blob/868d4bbe3d318c52544f38d5f9977a1103e924c2/classes/range.js#L329
//
// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
function replaceCaret(comp, options) {
    const r = CARET_REGEXP;
    const z = options?.includePrerelease ? '-0' : '';
    return comp.replace(r, (_, M, m, p, pr)=>{
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            if (M === '0') {
                ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
                ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
        } else if (pr) {
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
        } else {
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
        }
        return ret;
    });
}
// Borrowed from https://github.com/npm/node-semver/blob/868d4bbe3d318c52544f38d5f9977a1103e924c2/classes/range.js#L390
function replaceXRange(comp, options) {
    const r = XRANGE_REGEXP;
    return comp.replace(r, (ret, gtlt, M, m, p, pr)=>{
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === '=' && anyX) {
            gtlt = '';
        }
        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options?.includePrerelease ? '-0' : '';
        if (xM) {
            if (gtlt === '>' || gtlt === '<') {
                // nothing is allowed
                ret = '<0.0.0-0';
            } else {
                // nothing is forbidden
                ret = '*';
            }
        } else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) {
                m = 0;
            }
            p = 0;
            if (gtlt === '>') {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                gtlt = '>=';
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                } else {
                    m = +m + 1;
                    p = 0;
                }
            } else if (gtlt === '<=') {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = '<';
                if (xm) {
                    M = +M + 1;
                } else {
                    m = +m + 1;
                }
            }
            if (gtlt === '<') {
                pr = '-0';
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        return ret;
    });
}
// Borrowed from https://github.com/npm/node-semver/blob/868d4bbe3d318c52544f38d5f9977a1103e924c2/classes/range.js#L488
//
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
function replaceHyphen(comp, options) {
    const r = HYPHENRANGE_REGEXP;
    return comp.replace(r, (_, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr)=>{
        if (isX(fM)) {
            from = '';
        } else if (isX(fm)) {
            from = `>=${fM}.0.0${options?.includePrerelease ? '-0' : ''}`;
        } else if (isX(fp)) {
            from = `>=${fM}.${fm}.0${options?.includePrerelease ? '-0' : ''}`;
        } else if (fpr) {
            from = `>=${from}`;
        } else {
            from = `>=${from}${options?.includePrerelease ? '-0' : ''}`;
        }
        if (isX(tM)) {
            to = '';
        } else if (isX(tm)) {
            to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
            to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
            to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (options?.includePrerelease) {
            to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
            to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
    });
} //# sourceMappingURL=semver.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/shimmer.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ // Default to complaining loudly when things don't go according to plan.
// eslint-disable-next-line no-console
__turbopack_context__.s([
    "default",
    ()=>shimmer,
    "massUnwrap",
    ()=>massUnwrap,
    "massWrap",
    ()=>massWrap,
    "unwrap",
    ()=>unwrap,
    "wrap",
    ()=>wrap
]);
let logger = console.error.bind(console);
// Sets a property on an object, preserving its enumerability.
// This function assumes that the property is already writable.
function defineProperty(obj, name, value) {
    const enumerable = !!obj[name] && Object.prototype.propertyIsEnumerable.call(obj, name);
    Object.defineProperty(obj, name, {
        configurable: true,
        enumerable,
        writable: true,
        value
    });
}
const wrap = (nodule, name, wrapper)=>{
    if (!nodule || !nodule[name]) {
        logger('no original function ' + String(name) + ' to wrap');
        return;
    }
    if (!wrapper) {
        logger('no wrapper function');
        logger(new Error().stack);
        return;
    }
    const original = nodule[name];
    if (typeof original !== 'function' || typeof wrapper !== 'function') {
        logger('original object and wrapper must be functions');
        return;
    }
    const wrapped = wrapper(original, name);
    defineProperty(wrapped, '__original', original);
    defineProperty(wrapped, '__unwrap', ()=>{
        if (nodule[name] === wrapped) {
            defineProperty(nodule, name, original);
        }
    });
    defineProperty(wrapped, '__wrapped', true);
    defineProperty(nodule, name, wrapped);
    return wrapped;
};
const massWrap = (nodules, names, wrapper)=>{
    if (!nodules) {
        logger('must provide one or more modules to patch');
        logger(new Error().stack);
        return;
    } else if (!Array.isArray(nodules)) {
        nodules = [
            nodules
        ];
    }
    if (!(names && Array.isArray(names))) {
        logger('must provide one or more functions to wrap on modules');
        return;
    }
    nodules.forEach((nodule)=>{
        names.forEach((name)=>{
            wrap(nodule, name, wrapper);
        });
    });
};
const unwrap = (nodule, name)=>{
    if (!nodule || !nodule[name]) {
        logger('no function to unwrap.');
        logger(new Error().stack);
        return;
    }
    const wrapped = nodule[name];
    if (!wrapped.__unwrap) {
        logger('no original to unwrap to -- has ' + String(name) + ' already been unwrapped?');
    } else {
        wrapped.__unwrap();
        return;
    }
};
const massUnwrap = (nodules, names)=>{
    if (!nodules) {
        logger('must provide one or more modules to patch');
        logger(new Error().stack);
        return;
    } else if (!Array.isArray(nodules)) {
        nodules = [
            nodules
        ];
    }
    if (!(names && Array.isArray(names))) {
        logger('must provide one or more functions to unwrap on modules');
        return;
    }
    nodules.forEach((nodule)=>{
        names.forEach((name)=>{
            unwrap(nodule, name);
        });
    });
};
function shimmer(options) {
    if (options && options.logger) {
        if (typeof options.logger !== 'function') {
            logger("new logger isn't a function, not replacing");
        } else {
            logger = options.logger;
        }
    }
}
shimmer.wrap = wrap;
shimmer.massWrap = massWrap;
shimmer.unwrap = unwrap;
shimmer.massUnwrap = massUnwrap; //# sourceMappingURL=shimmer.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/instrumentation.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "InstrumentationAbstract",
    ()=>InstrumentationAbstract
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/metrics-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$shimmer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/shimmer.js [instrumentation] (ecmascript)");
;
;
;
class InstrumentationAbstract {
    _config = {};
    _tracer;
    _meter;
    _logger;
    _diag;
    instrumentationName;
    instrumentationVersion;
    constructor(instrumentationName, instrumentationVersion, config){
        this.instrumentationName = instrumentationName;
        this.instrumentationVersion = instrumentationVersion;
        this.setConfig(config);
        this._diag = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].createComponentLogger({
            namespace: instrumentationName
        });
        this._tracer = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].getTracer(instrumentationName, instrumentationVersion);
        this._meter = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["metrics"].getMeter(instrumentationName, instrumentationVersion);
        this._logger = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["logs"].getLogger(instrumentationName, instrumentationVersion);
        this._updateMetricInstruments();
    }
    /* Api to wrap instrumented method */ _wrap = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$shimmer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["wrap"];
    /* Api to unwrap instrumented methods */ _unwrap = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$shimmer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["unwrap"];
    /* Api to mass wrap instrumented method */ _massWrap = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$shimmer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["massWrap"];
    /* Api to mass unwrap instrumented methods */ _massUnwrap = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$shimmer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["massUnwrap"];
    /* Returns meter */ get meter() {
        return this._meter;
    }
    /**
     * Sets MeterProvider to this plugin
     * @param meterProvider
     */ setMeterProvider(meterProvider) {
        this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
        this._updateMetricInstruments();
    }
    /* Returns logger */ get logger() {
        return this._logger;
    }
    /**
     * Sets LoggerProvider to this plugin
     * @param loggerProvider
     */ setLoggerProvider(loggerProvider) {
        this._logger = loggerProvider.getLogger(this.instrumentationName, this.instrumentationVersion);
    }
    /**
     * @experimental
     *
     * Get module definitions defined by {@link init}.
     * This can be used for experimental compile-time instrumentation.
     *
     * @returns an array of {@link InstrumentationModuleDefinition}
     */ getModuleDefinitions() {
        const initResult = this.init() ?? [];
        if (!Array.isArray(initResult)) {
            return [
                initResult
            ];
        }
        return initResult;
    }
    /**
     * Sets the new metric instruments with the current Meter.
     */ _updateMetricInstruments() {
        return;
    }
    /* Returns InstrumentationConfig */ getConfig() {
        return this._config;
    }
    /**
     * Sets InstrumentationConfig to this plugin
     * @param config
     */ setConfig(config) {
        // copy config first level properties to ensure they are immutable.
        // nested properties are not copied, thus are mutable from the outside.
        this._config = {
            enabled: true,
            ...config
        };
    }
    /**
     * Sets TraceProvider to this plugin
     * @param tracerProvider
     */ setTracerProvider(tracerProvider) {
        this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
    }
    /* Returns tracer */ get tracer() {
        return this._tracer;
    }
    /**
     * Execute span customization hook, if configured, and log any errors.
     * Any semantics of the trigger and info are defined by the specific instrumentation.
     * @param hookHandler The optional hook handler which the user has configured via instrumentation config
     * @param triggerName The name of the trigger for executing the hook for logging purposes
     * @param span The span to which the hook should be applied
     * @param info The info object to be passed to the hook, with useful data the hook may use
     */ _runSpanCustomizationHook(hookHandler, triggerName, span, info) {
        if (!hookHandler) {
            return;
        }
        try {
            hookHandler(span, info);
        } catch (e) {
            this._diag.error(`Error running span customization hook due to exception in handler`, {
                triggerName
            }, e);
        }
    }
} //# sourceMappingURL=instrumentation.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/ModuleNameTrie.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ModuleNameSeparator",
    ()=>ModuleNameSeparator,
    "ModuleNameTrie",
    ()=>ModuleNameTrie
]);
const ModuleNameSeparator = '/';
/**
 * Node in a `ModuleNameTrie`
 */ class ModuleNameTrieNode {
    hooks = [];
    children = new Map();
}
class ModuleNameTrie {
    _trie = new ModuleNameTrieNode();
    _counter = 0;
    /**
     * Insert a module hook into the trie
     *
     * @param {Hooked} hook Hook
     */ insert(hook) {
        let trieNode = this._trie;
        for (const moduleNamePart of hook.moduleName.split(ModuleNameSeparator)){
            let nextNode = trieNode.children.get(moduleNamePart);
            if (!nextNode) {
                nextNode = new ModuleNameTrieNode();
                trieNode.children.set(moduleNamePart, nextNode);
            }
            trieNode = nextNode;
        }
        trieNode.hooks.push({
            hook,
            insertedId: this._counter++
        });
    }
    /**
     * Search for matching hooks in the trie
     *
     * @param {string} moduleName Module name
     * @param {boolean} maintainInsertionOrder Whether to return the results in insertion order
     * @param {boolean} fullOnly Whether to return only full matches
     * @returns {Hooked[]} Matching hooks
     */ search(moduleName, { maintainInsertionOrder, fullOnly } = {}) {
        let trieNode = this._trie;
        const results = [];
        let foundFull = true;
        for (const moduleNamePart of moduleName.split(ModuleNameSeparator)){
            const nextNode = trieNode.children.get(moduleNamePart);
            if (!nextNode) {
                foundFull = false;
                break;
            }
            if (!fullOnly) {
                results.push(...nextNode.hooks);
            }
            trieNode = nextNode;
        }
        if (fullOnly && foundFull) {
            results.push(...trieNode.hooks);
        }
        if (results.length === 0) {
            return [];
        }
        if (results.length === 1) {
            return [
                results[0].hook
            ];
        }
        if (maintainInsertionOrder) {
            results.sort((a, b)=>a.insertedId - b.insertedId);
        }
        return results.map(({ hook })=>hook);
    }
} //# sourceMappingURL=ModuleNameTrie.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/RequireInTheMiddleSingleton.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "RequireInTheMiddleSingleton",
    ()=>RequireInTheMiddleSingleton
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$require$2d$in$2d$the$2d$middle__$5b$external$5d$__$28$require$2d$in$2d$the$2d$middle$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/require-in-the-middle [external] (require-in-the-middle, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$platform$2f$node$2f$ModuleNameTrie$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/ModuleNameTrie.js [instrumentation] (ecmascript)");
;
;
;
/**
 * Whether Mocha is running in this process
 * Inspired by https://github.com/AndreasPizsa/detect-mocha
 *
 * @type {boolean}
 */ const isMocha = [
    'afterEach',
    'after',
    'beforeEach',
    'before',
    'describe',
    'it'
].every((fn)=>{
    // @ts-expect-error TS7053: Element implicitly has an 'any' type
    return typeof /*TURBOPACK member replacement*/ __turbopack_context__.g[fn] === 'function';
});
class RequireInTheMiddleSingleton {
    _moduleNameTrie = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$platform$2f$node$2f$ModuleNameTrie$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ModuleNameTrie"]();
    static _instance;
    constructor(){
        this._initialize();
    }
    _initialize() {
        new __TURBOPACK__imported__module__$5b$externals$5d2f$require$2d$in$2d$the$2d$middle__$5b$external$5d$__$28$require$2d$in$2d$the$2d$middle$2c$__cjs$29$__["Hook"](// Intercept all `require` calls; we will filter the matching ones below
        null, {
            internals: true
        }, (exports, name, basedir)=>{
            // For internal files on Windows, `name` will use backslash as the path separator
            const normalizedModuleName = normalizePathSeparators(name);
            const matches = this._moduleNameTrie.search(normalizedModuleName, {
                maintainInsertionOrder: true,
                // For core modules (e.g. `fs`), do not match on sub-paths (e.g. `fs/promises').
                // This matches the behavior of `require-in-the-middle`.
                // `basedir` is always `undefined` for core modules.
                fullOnly: basedir === undefined
            });
            for (const { onRequire } of matches){
                exports = onRequire(exports, name, basedir);
            }
            return exports;
        });
    }
    /**
     * Register a hook with `require-in-the-middle`
     *
     * @param {string} moduleName Module name
     * @param {OnRequireFn} onRequire Hook function
     * @returns {Hooked} Registered hook
     */ register(moduleName, onRequire) {
        const hooked = {
            moduleName,
            onRequire
        };
        this._moduleNameTrie.insert(hooked);
        return hooked;
    }
    /**
     * Get the `RequireInTheMiddleSingleton` singleton
     *
     * @returns {RequireInTheMiddleSingleton} Singleton of `RequireInTheMiddleSingleton`
     */ static getInstance() {
        // Mocha runs all test suites in the same process
        // This prevents test suites from sharing a singleton
        if (isMocha) return new RequireInTheMiddleSingleton();
        return this._instance = this._instance ?? new RequireInTheMiddleSingleton();
    }
}
/**
 * Normalize the path separators to forward slash in a module name or path
 *
 * @param {string} moduleNameOrPath Module name or path
 * @returns {string} Normalized module name or path
 */ function normalizePathSeparators(moduleNameOrPath) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["sep"] !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$platform$2f$node$2f$ModuleNameTrie$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ModuleNameSeparator"] ? moduleNameOrPath.split(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["sep"]).join(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$platform$2f$node$2f$ModuleNameTrie$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ModuleNameSeparator"]) : moduleNameOrPath;
} //# sourceMappingURL=RequireInTheMiddleSingleton.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * function to execute patched function and being able to catch errors
 * @param execute - function to be executed
 * @param onFinish - callback to run when execute finishes
 */ __turbopack_context__.s([
    "isWrapped",
    ()=>isWrapped,
    "safeExecuteInTheMiddle",
    ()=>safeExecuteInTheMiddle,
    "safeExecuteInTheMiddleAsync",
    ()=>safeExecuteInTheMiddleAsync
]);
function safeExecuteInTheMiddle(execute, onFinish, preventThrowingError) {
    let error;
    let result;
    try {
        result = execute();
    } catch (e) {
        error = e;
    } finally{
        onFinish(error, result);
        if (error && !preventThrowingError) {
            // eslint-disable-next-line no-unsafe-finally
            throw error;
        }
        // eslint-disable-next-line no-unsafe-finally
        return result;
    }
}
async function safeExecuteInTheMiddleAsync(execute, onFinish, preventThrowingError) {
    let error;
    let result;
    try {
        result = await execute();
    } catch (e) {
        error = e;
    } finally{
        await onFinish(error, result);
        if (error && !preventThrowingError) {
            // eslint-disable-next-line no-unsafe-finally
            throw error;
        }
        // eslint-disable-next-line no-unsafe-finally
        return result;
    }
}
function isWrapped(func) {
    return typeof func === 'function' && typeof func.__original === 'function' && typeof func.__unwrap === 'function' && func.__wrapped === true;
} //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "InstrumentationBase",
    ()=>InstrumentationBase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/util [external] (util, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$semver$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/semver.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$shimmer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/shimmer.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$instrumentation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/instrumentation.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$platform$2f$node$2f$RequireInTheMiddleSingleton$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/RequireInTheMiddleSingleton.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$import$2d$in$2d$the$2d$middle__$5b$external$5d$__$28$import$2d$in$2d$the$2d$middle$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/import-in-the-middle [external] (import-in-the-middle, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$require$2d$in$2d$the$2d$middle__$5b$external$5d$__$28$require$2d$in$2d$the$2d$middle$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/require-in-the-middle [external] (require-in-the-middle, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/utils.js [instrumentation] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
class InstrumentationBase extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$instrumentation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentationAbstract"] {
    _modules;
    _hooks = [];
    _requireInTheMiddleSingleton = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$platform$2f$node$2f$RequireInTheMiddleSingleton$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["RequireInTheMiddleSingleton"].getInstance();
    _enabled = false;
    constructor(instrumentationName, instrumentationVersion, config){
        super(instrumentationName, instrumentationVersion, config);
        let modules = this.init();
        if (modules && !Array.isArray(modules)) {
            modules = [
                modules
            ];
        }
        this._modules = modules || [];
        if (this._config.enabled) {
            this.enable();
        }
    }
    _wrap = (moduleExports, name, wrapper)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isWrapped"])(moduleExports[name])) {
            this._unwrap(moduleExports, name);
        }
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__["types"].isProxy(moduleExports)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$shimmer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["wrap"])(moduleExports, name, wrapper);
        } else {
            const wrapped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$shimmer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["wrap"])(Object.assign({}, moduleExports), name, wrapper);
            Object.defineProperty(moduleExports, name, {
                value: wrapped
            });
            return wrapped;
        }
    };
    _unwrap = (moduleExports, name)=>{
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__["types"].isProxy(moduleExports)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$shimmer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["unwrap"])(moduleExports, name);
        } else {
            return Object.defineProperty(moduleExports, name, {
                value: moduleExports[name]
            });
        }
    };
    _massWrap = (moduleExportsArray, names, wrapper)=>{
        if (!moduleExportsArray) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error('must provide one or more modules to patch');
            return;
        } else if (!Array.isArray(moduleExportsArray)) {
            moduleExportsArray = [
                moduleExportsArray
            ];
        }
        if (!(names && Array.isArray(names))) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error('must provide one or more functions to wrap on modules');
            return;
        }
        moduleExportsArray.forEach((moduleExports)=>{
            names.forEach((name)=>{
                this._wrap(moduleExports, name, wrapper);
            });
        });
    };
    _massUnwrap = (moduleExportsArray, names)=>{
        if (!moduleExportsArray) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error('must provide one or more modules to patch');
            return;
        } else if (!Array.isArray(moduleExportsArray)) {
            moduleExportsArray = [
                moduleExportsArray
            ];
        }
        if (!(names && Array.isArray(names))) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error('must provide one or more functions to wrap on modules');
            return;
        }
        moduleExportsArray.forEach((moduleExports)=>{
            names.forEach((name)=>{
                this._unwrap(moduleExports, name);
            });
        });
    };
    _warnOnPreloadedModules() {
        this._modules.forEach((module)=>{
            const { name } = module;
            try {
                const resolvedModule = (()=>{
                    const e = new Error("Cannot find module as expression is too dynamic");
                    e.code = 'MODULE_NOT_FOUND';
                    throw e;
                })();
                if (__turbopack_context__.c[resolvedModule]) {
                    // Module is already cached, which means the instrumentation hook might not work
                    this._diag.warn(`Module ${name} has been loaded before ${this.instrumentationName} so it might not work, please initialize it before requiring ${name}`);
                }
            } catch  {
            // Module isn't available, we can simply skip
            }
        });
    }
    _extractPackageVersion(baseDir) {
        try {
            const json = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](baseDir, 'package.json'), {
                encoding: 'utf8'
            });
            const version = JSON.parse(json).version;
            return typeof version === 'string' ? version : undefined;
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('Failed extracting version', baseDir);
        }
        return undefined;
    }
    _onRequire(module, exports, name, baseDir) {
        if (!baseDir) {
            if (typeof module.patch === 'function') {
                module.moduleExports = exports;
                if (this._enabled) {
                    this._diag.debug('Applying instrumentation patch for nodejs core module on require hook', {
                        module: module.name
                    });
                    return module.patch(exports);
                }
            }
            return exports;
        }
        const version = this._extractPackageVersion(baseDir);
        module.moduleVersion = version;
        if (module.name === name) {
            // main module
            if (isSupported(module.supportedVersions, version, module.includePrerelease)) {
                if (typeof module.patch === 'function') {
                    module.moduleExports = exports;
                    if (this._enabled) {
                        this._diag.debug('Applying instrumentation patch for module on require hook', {
                            module: module.name,
                            version: module.moduleVersion,
                            baseDir
                        });
                        return module.patch(exports, module.moduleVersion);
                    }
                }
            }
            return exports;
        }
        // internal file
        const files = module.files ?? [];
        const normalizedName = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["normalize"](name);
        const supportedFileInstrumentations = files.filter((f)=>f.name === normalizedName && isSupported(f.supportedVersions, version, module.includePrerelease));
        return supportedFileInstrumentations.reduce((patchedExports, file)=>{
            file.moduleExports = patchedExports;
            if (this._enabled) {
                this._diag.debug('Applying instrumentation patch for nodejs module file on require hook', {
                    module: module.name,
                    version: module.moduleVersion,
                    fileName: file.name,
                    baseDir
                });
                // patch signature is not typed, so we cast it assuming it's correct
                return file.patch(patchedExports, module.moduleVersion);
            }
            return patchedExports;
        }, exports);
    }
    enable() {
        if (this._enabled) {
            return;
        }
        this._enabled = true;
        // already hooked, just call patch again
        if (this._hooks.length > 0) {
            for (const module of this._modules){
                if (typeof module.patch === 'function' && module.moduleExports) {
                    this._diag.debug('Applying instrumentation patch for nodejs module on instrumentation enabled', {
                        module: module.name,
                        version: module.moduleVersion
                    });
                    module.patch(module.moduleExports, module.moduleVersion);
                }
                for (const file of module.files){
                    if (file.moduleExports) {
                        this._diag.debug('Applying instrumentation patch for nodejs module file on instrumentation enabled', {
                            module: module.name,
                            version: module.moduleVersion,
                            fileName: file.name
                        });
                        file.patch(file.moduleExports, module.moduleVersion);
                    }
                }
            }
            return;
        }
        this._warnOnPreloadedModules();
        for (const module of this._modules){
            const hookFn = (exports, name, baseDir)=>{
                if (!baseDir && __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["isAbsolute"](name)) {
                    // Change IITM `name` and `baseDir` values to match what RITM returns.
                    // See "Comparing to RITM" on https://github.com/nodejs/import-in-the-middle/pull/241
                    // for an example of the differences.
                    const parsedPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["parse"](name);
                    name = parsedPath.name;
                    baseDir = parsedPath.dir;
                }
                return this._onRequire(module, exports, name, baseDir);
            };
            const onRequire = (exports, name, baseDir)=>{
                return this._onRequire(module, exports, name, baseDir);
            };
            // `RequireInTheMiddleSingleton` does not support absolute paths.
            // For an absolute paths, we must create a separate instance of the
            // require-in-the-middle `Hook`.
            const hook = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["isAbsolute"](module.name) ? new __TURBOPACK__imported__module__$5b$externals$5d2f$require$2d$in$2d$the$2d$middle__$5b$external$5d$__$28$require$2d$in$2d$the$2d$middle$2c$__cjs$29$__["Hook"]([
                module.name
            ], {
                internals: true
            }, onRequire) : this._requireInTheMiddleSingleton.register(module.name, onRequire);
            this._hooks.push(hook);
            const esmHook = new __TURBOPACK__imported__module__$5b$externals$5d2f$import$2d$in$2d$the$2d$middle__$5b$external$5d$__$28$import$2d$in$2d$the$2d$middle$2c$__cjs$29$__["Hook"]([
                module.name
            ], {
                internals: true
            }, hookFn);
            this._hooks.push(esmHook);
        }
    }
    disable() {
        if (!this._enabled) {
            return;
        }
        this._enabled = false;
        for (const module of this._modules){
            if (typeof module.unpatch === 'function' && module.moduleExports) {
                this._diag.debug('Removing instrumentation patch for nodejs module on instrumentation disabled', {
                    module: module.name,
                    version: module.moduleVersion
                });
                module.unpatch(module.moduleExports, module.moduleVersion);
            }
            for (const file of module.files){
                if (file.moduleExports) {
                    this._diag.debug('Removing instrumentation patch for nodejs module file on instrumentation disabled', {
                        module: module.name,
                        version: module.moduleVersion,
                        fileName: file.name
                    });
                    file.unpatch(file.moduleExports, module.moduleVersion);
                }
            }
        }
    }
    isEnabled() {
        return this._enabled;
    }
}
function isSupported(supportedVersions, version, includePrerelease) {
    if (typeof version === 'undefined') {
        // If we don't have the version, accept the wildcard case only
        return supportedVersions.includes('*');
    }
    return supportedVersions.some((supportedVersion)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$semver$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["satisfies"])(version, supportedVersion, {
            includePrerelease
        });
    });
} //# sourceMappingURL=instrumentation.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/instrumentationNodeModuleDefinition.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "InstrumentationNodeModuleDefinition",
    ()=>InstrumentationNodeModuleDefinition
]);
class InstrumentationNodeModuleDefinition {
    files;
    name;
    supportedVersions;
    patch;
    unpatch;
    constructor(name, supportedVersions, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patch, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unpatch, files){
        this.files = files || [];
        this.name = name;
        this.supportedVersions = supportedVersions;
        this.patch = patch;
        this.unpatch = unpatch;
    }
} //# sourceMappingURL=instrumentationNodeModuleDefinition.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/instrumentationNodeModuleFile.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "InstrumentationNodeModuleFile",
    ()=>InstrumentationNodeModuleFile
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
class InstrumentationNodeModuleFile {
    name;
    supportedVersions;
    patch;
    unpatch;
    constructor(name, supportedVersions, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patch, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unpatch){
        this.name = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["normalize"])(name);
        this.supportedVersions = supportedVersions;
        this.patch = patch;
        this.unpatch = unpatch;
    }
} //# sourceMappingURL=instrumentationNodeModuleFile.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/semconvStability.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "SemconvStability",
    ()=>SemconvStability,
    "semconvStabilityFromStr",
    ()=>semconvStabilityFromStr
]);
var SemconvStability;
(function(SemconvStability) {
    /** Emit only stable semantic conventions. */ SemconvStability[SemconvStability["STABLE"] = 1] = "STABLE";
    /** Emit only old semantic conventions. */ SemconvStability[SemconvStability["OLD"] = 2] = "OLD";
    /** Emit both stable and old semantic conventions. */ SemconvStability[SemconvStability["DUPLICATE"] = 3] = "DUPLICATE";
})(SemconvStability || (SemconvStability = {}));
function semconvStabilityFromStr(namespace, str) {
    let semconvStability = SemconvStability.OLD;
    // The same parsing of `str` as `getStringListFromEnv` from the core pkg.
    const entries = str?.split(',').map((v)=>v.trim()).filter((s)=>s !== '');
    for (const entry of entries ?? []){
        if (entry.toLowerCase() === namespace + '/dup') {
            // DUPLICATE takes highest precedence.
            semconvStability = SemconvStability.DUPLICATE;
            break;
        } else if (entry.toLowerCase() === namespace) {
            semconvStability = SemconvStability.STABLE;
        }
    }
    return semconvStability;
} //# sourceMappingURL=semconvStability.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InstrumentationBase",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$platform$2f$node$2f$instrumentation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentationBase"],
    "InstrumentationNodeModuleDefinition",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$instrumentationNodeModuleDefinition$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentationNodeModuleDefinition"],
    "InstrumentationNodeModuleFile",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$instrumentationNodeModuleFile$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentationNodeModuleFile"],
    "SemconvStability",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$semconvStability$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SemconvStability"],
    "isWrapped",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isWrapped"],
    "registerInstrumentations",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$autoLoader$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["registerInstrumentations"],
    "safeExecuteInTheMiddle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["safeExecuteInTheMiddle"],
    "safeExecuteInTheMiddleAsync",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["safeExecuteInTheMiddleAsync"],
    "semconvStabilityFromStr",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$semconvStability$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["semconvStabilityFromStr"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$autoLoader$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/autoLoader.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$platform$2f$node$2f$instrumentation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$instrumentationNodeModuleDefinition$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/instrumentationNodeModuleDefinition.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$instrumentationNodeModuleFile$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/instrumentationNodeModuleFile.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$semconvStability$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/semconvStability.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/platform/node/OTLPLogExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "OTLPLogExporter",
    ()=>OTLPLogExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$logs$2f$json$2f$logs$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/logs/json/logs.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-node-http-options.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-http-export-delegate.js [instrumentation] (ecmascript)");
;
;
;
class OTLPLogExporter extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterBase"] {
    constructor(config = {}){
        super((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpHttpExportDelegate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["convertLegacyHttpOptions"])(config, 'LOGS', 'v1/logs', {
            'Content-Type': 'application/json'
        }), __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$logs$2f$json$2f$logs$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["JsonLogsSerializer"]));
    }
} //# sourceMappingURL=OTLPLogExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OTLPLogExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$logs$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPLogExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPLogExporter"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$logs$2d$otlp$2d$http$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$logs$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPLogExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/platform/node/OTLPLogExporter.js [instrumentation] (ecmascript)");
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
;
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/legacy-node-configuration.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "CompressionAlgorithm",
    ()=>CompressionAlgorithm
]);
var CompressionAlgorithm;
(function(CompressionAlgorithm) {
    CompressionAlgorithm["NONE"] = "none";
    CompressionAlgorithm["GZIP"] = "gzip";
})(CompressionAlgorithm || (CompressionAlgorithm = {})); //# sourceMappingURL=legacy-node-configuration.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-network-export-delegate.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "createOtlpNetworkExportDelegate",
    ()=>createOtlpNetworkExportDelegate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$bounded$2d$queue$2d$export$2d$promise$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/bounded-queue-export-promise-handler.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-export-delegate.js [instrumentation] (ecmascript)");
;
;
function createOtlpNetworkExportDelegate(options, serializer, transport) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpExportDelegate"])({
        transport: transport,
        serializer,
        promiseHandler: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$bounded$2d$queue$2d$export$2d$promise$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createBoundedQueueExportPromiseHandler"])(options)
    }, {
        timeout: options.timeoutMillis
    });
} //# sourceMappingURL=otlp-network-export-delegate.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompressionAlgorithm",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$legacy$2d$node$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["CompressionAlgorithm"],
    "OTLPExporterBase",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterBase"],
    "OTLPExporterError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterError"],
    "createOtlpNetworkExportDelegate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$network$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpNetworkExportDelegate"],
    "getSharedConfigurationDefaults",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getSharedConfigurationDefaults"],
    "mergeOtlpSharedConfigurationWithDefaults",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["mergeOtlpSharedConfigurationWithDefaults"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/types.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-configuration.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$legacy$2d$node$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/legacy-node-configuration.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$network$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-network-export-delegate.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index-node-http.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
;
;
;
 //# sourceMappingURL=index-node-http.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index-node-http.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertLegacyHttpOptions",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["convertLegacyHttpOptions"],
    "createOtlpHttpExportDelegate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpHttpExportDelegate"],
    "getSharedConfigurationFromEnvironment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$env$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getSharedConfigurationFromEnvironment"],
    "httpAgentFactoryFromOptions",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["httpAgentFactoryFromOptions"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$index$2d$node$2d$http$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index-node-http.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$otlp$2d$node$2d$http$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-node-http-configuration.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-http-export-delegate.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$shared$2d$env$2d$configuration$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-env-configuration.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-node-http-options.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/version.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VERSION = void 0;
// this is autogenerated file, see scripts/version-update.js
exports.VERSION = '0.212.0'; //# sourceMappingURL=version.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/create-service-client-constructor.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createServiceClientConstructor = void 0;
const grpc = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/grpc-js/build/src/index.js [instrumentation] (ecmascript)");
/**
 * Creates a unary service client constructor that, when instantiated, does not serialize/deserialize anything.
 * Allows for passing in {@link Buffer} directly, serialization can be handled via protobufjs or custom implementations.
 *
 * @param path service path
 * @param name service name
 */ function createServiceClientConstructor(path, name) {
    const serviceDefinition = {
        export: {
            path: path,
            requestStream: false,
            responseStream: false,
            requestSerialize: (arg)=>{
                return arg;
            },
            requestDeserialize: (arg)=>{
                return arg;
            },
            responseSerialize: (arg)=>{
                return arg;
            },
            responseDeserialize: (arg)=>{
                return arg;
            }
        }
    };
    return grpc.makeGenericClientConstructor(serviceDefinition, name);
}
exports.createServiceClientConstructor = createServiceClientConstructor; //# sourceMappingURL=create-service-client-constructor.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/grpc-exporter-transport.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createOtlpGrpcExporterTransport = exports.GrpcExporterTransport = exports.createEmptyMetadata = exports.createSslCredentials = exports.createInsecureCredentials = void 0;
const version_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/version.js [instrumentation] (ecmascript)");
const DEFAULT_USER_AGENT = `OTel-OTLP-Exporter-JavaScript/${version_1.VERSION}`;
function createUserAgent(userAgent) {
    if (userAgent) {
        return `${userAgent} ${DEFAULT_USER_AGENT}`;
    }
    return DEFAULT_USER_AGENT;
}
// values taken from '@grpc/grpc-js` so that we don't need to require/import it.
const GRPC_COMPRESSION_NONE = 0;
const GRPC_COMPRESSION_GZIP = 2;
function toGrpcCompression(compression) {
    return compression === 'gzip' ? GRPC_COMPRESSION_GZIP : GRPC_COMPRESSION_NONE;
}
function createInsecureCredentials() {
    // Lazy-load so that we don't need to require/import '@grpc/grpc-js' before it can be wrapped by instrumentation.
    const { credentials } = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/grpc-js/build/src/index.js [instrumentation] (ecmascript)");
    return credentials.createInsecure();
}
exports.createInsecureCredentials = createInsecureCredentials;
function createSslCredentials(rootCert, privateKey, certChain) {
    // Lazy-load so that we don't need to require/import '@grpc/grpc-js' before it can be wrapped by instrumentation.
    const { credentials } = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/grpc-js/build/src/index.js [instrumentation] (ecmascript)");
    return credentials.createSsl(rootCert, privateKey, certChain);
}
exports.createSslCredentials = createSslCredentials;
function createEmptyMetadata() {
    // Lazy-load so that we don't need to require/import '@grpc/grpc-js' before it can be wrapped by instrumentation.
    const { Metadata } = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/grpc-js/build/src/index.js [instrumentation] (ecmascript)");
    return new Metadata();
}
exports.createEmptyMetadata = createEmptyMetadata;
class GrpcExporterTransport {
    _client;
    _metadata;
    _parameters;
    constructor(parameters){
        this._parameters = parameters;
    }
    shutdown() {
        this._client?.close();
    }
    send(data, timeoutMillis) {
        // We need to make a for gRPC
        const buffer = Buffer.from(data);
        if (this._client == null) {
            // Lazy require to ensure that grpc is not loaded before instrumentations can wrap it
            const { createServiceClientConstructor } = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/create-service-client-constructor.js [instrumentation] (ecmascript)");
            try {
                this._metadata = this._parameters.metadata();
            } catch (error) {
                return Promise.resolve({
                    status: 'failure',
                    error: error
                });
            }
            const clientConstructor = createServiceClientConstructor(this._parameters.grpcPath, this._parameters.grpcName);
            try {
                this._client = new clientConstructor(this._parameters.address, this._parameters.credentials(), {
                    'grpc.default_compression_algorithm': toGrpcCompression(this._parameters.compression),
                    'grpc.primary_user_agent': createUserAgent(this._parameters.userAgent)
                });
            } catch (error) {
                return Promise.resolve({
                    status: 'failure',
                    error: error
                });
            }
        }
        return new Promise((resolve)=>{
            const deadline = Date.now() + timeoutMillis;
            // this should never happen
            if (this._metadata == null) {
                return resolve({
                    error: new Error('metadata was null'),
                    status: 'failure'
                });
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore The gRPC client constructor is created on runtime, so we don't have any types for the resulting client.
            this._client.export(buffer, this._metadata, {
                deadline: deadline
            }, (err, response)=>{
                if (err) {
                    resolve({
                        status: 'failure',
                        error: err
                    });
                } else {
                    resolve({
                        data: response,
                        status: 'success'
                    });
                }
            });
        });
    }
}
exports.GrpcExporterTransport = GrpcExporterTransport;
function createOtlpGrpcExporterTransport(options) {
    return new GrpcExporterTransport(options);
}
exports.createOtlpGrpcExporterTransport = createOtlpGrpcExporterTransport; //# sourceMappingURL=grpc-exporter-transport.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/configuration/otlp-grpc-configuration.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getOtlpGrpcDefaultConfiguration = exports.mergeOtlpGrpcConfigurationWithDefaults = exports.validateAndNormalizeUrl = void 0;
const otlp_exporter_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index.js [instrumentation] (ecmascript)");
const grpc_exporter_transport_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/grpc-exporter-transport.js [instrumentation] (ecmascript)");
const url_1 = __turbopack_context__.r("[externals]/url [external] (url, cjs)");
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
function validateAndNormalizeUrl(url) {
    url = url.trim();
    const hasProtocol = url.match(/^([\w]{1,8}):\/\//);
    if (!hasProtocol) {
        url = `https://${url}`;
    }
    const target = new url_1.URL(url);
    if (target.protocol === 'unix:') {
        return url;
    }
    if (target.pathname && target.pathname !== '/') {
        api_1.diag.warn('URL path should not be set when using grpc, the path part of the URL will be ignored.');
    }
    if (target.protocol !== '' && !target.protocol?.match(/^(http)s?:$/)) {
        api_1.diag.warn('URL protocol should be http(s)://. Using http://.');
    }
    return target.host;
}
exports.validateAndNormalizeUrl = validateAndNormalizeUrl;
function overrideMetadataEntriesIfNotPresent(metadata, additionalMetadata) {
    for (const [key, value] of Object.entries(additionalMetadata.getMap())){
        // only override with env var data if the key has no values.
        // not using Metadata.merge() as it will keep both values.
        if (metadata.get(key).length < 1) {
            metadata.set(key, value);
        }
    }
}
function mergeOtlpGrpcConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    const rawUrl = userProvidedConfiguration.url ?? fallbackConfiguration.url ?? defaultConfiguration.url;
    return {
        ...(0, otlp_exporter_base_1.mergeOtlpSharedConfigurationWithDefaults)(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration),
        metadata: ()=>{
            const metadata = defaultConfiguration.metadata();
            overrideMetadataEntriesIfNotPresent(metadata, // clone to ensure we don't modify what the user gave us in case they hold on to the returned reference
            userProvidedConfiguration.metadata?.().clone() ?? (0, grpc_exporter_transport_1.createEmptyMetadata)());
            overrideMetadataEntriesIfNotPresent(metadata, fallbackConfiguration.metadata?.() ?? (0, grpc_exporter_transport_1.createEmptyMetadata)());
            return metadata;
        },
        url: validateAndNormalizeUrl(rawUrl),
        credentials: userProvidedConfiguration.credentials ?? fallbackConfiguration.credentials?.(rawUrl) ?? defaultConfiguration.credentials(rawUrl),
        userAgent: userProvidedConfiguration.userAgent
    };
}
exports.mergeOtlpGrpcConfigurationWithDefaults = mergeOtlpGrpcConfigurationWithDefaults;
function getOtlpGrpcDefaultConfiguration() {
    return {
        ...(0, otlp_exporter_base_1.getSharedConfigurationDefaults)(),
        metadata: ()=>(0, grpc_exporter_transport_1.createEmptyMetadata)(),
        url: 'http://localhost:4317',
        credentials: (url)=>{
            if (url.startsWith('http://')) {
                return ()=>(0, grpc_exporter_transport_1.createInsecureCredentials)();
            } else {
                return ()=>(0, grpc_exporter_transport_1.createSslCredentials)();
            }
        }
    };
}
exports.getOtlpGrpcDefaultConfiguration = getOtlpGrpcDefaultConfiguration; //# sourceMappingURL=otlp-grpc-configuration.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/configuration/otlp-grpc-env-configuration.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getOtlpGrpcConfigurationFromEnv = void 0;
const core_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
const grpc_exporter_transport_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/grpc-exporter-transport.js [instrumentation] (ecmascript)");
const node_http_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index-node-http.js [instrumentation] (ecmascript)");
const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
function fallbackIfNullishOrBlank(signalSpecific, nonSignalSpecific) {
    if (signalSpecific != null && signalSpecific !== '') {
        return signalSpecific;
    }
    if (nonSignalSpecific != null && nonSignalSpecific !== '') {
        return nonSignalSpecific;
    }
    return undefined;
}
function getMetadataFromEnv(signalIdentifier) {
    const signalSpecificRawHeaders = process.env[`OTEL_EXPORTER_OTLP_${signalIdentifier}_HEADERS`]?.trim();
    const nonSignalSpecificRawHeaders = process.env['OTEL_EXPORTER_OTLP_HEADERS']?.trim();
    const signalSpecificHeaders = (0, core_1.parseKeyPairsIntoRecord)(signalSpecificRawHeaders);
    const nonSignalSpecificHeaders = (0, core_1.parseKeyPairsIntoRecord)(nonSignalSpecificRawHeaders);
    if (Object.keys(signalSpecificHeaders).length === 0 && Object.keys(nonSignalSpecificHeaders).length === 0) {
        return undefined;
    }
    const mergeHeaders = Object.assign({}, nonSignalSpecificHeaders, signalSpecificHeaders);
    const metadata = (0, grpc_exporter_transport_1.createEmptyMetadata)();
    // for this to work, metadata MUST be empty - otherwise `Metadata#set()` will merge items.
    for (const [key, value] of Object.entries(mergeHeaders)){
        metadata.set(key, value);
    }
    return metadata;
}
function getMetadataProviderFromEnv(signalIdentifier) {
    const metadata = getMetadataFromEnv(signalIdentifier);
    if (metadata == null) {
        return undefined;
    }
    return ()=>metadata;
}
function getUrlFromEnv(signalIdentifier) {
    // This does not change the string beyond trimming on purpose.
    // Normally a user would just use a host and port for gRPC, but the OTLP Exporter specification requires us to
    // use the raw provided endpoint to derive credential settings. Therefore, we only normalize right when
    // we merge user-provided, env-provided and defaults together, and we have determined which credentials to use.
    //
    // Examples:
    // - example.test:4317 -> use secure credentials from environment (or provided via code)
    // - http://example.test:4317 -> use insecure credentials if nothing else is provided
    // - https://example.test:4317 -> use secure credentials from environment (or provided via code)
    const specificEndpoint = process.env[`OTEL_EXPORTER_OTLP_${signalIdentifier}_ENDPOINT`]?.trim();
    const nonSpecificEndpoint = process.env[`OTEL_EXPORTER_OTLP_ENDPOINT`]?.trim();
    return fallbackIfNullishOrBlank(specificEndpoint, nonSpecificEndpoint);
}
/**
 * Determines whether the env var for insecure credentials is set to {@code true}.
 *
 * It will allow the following values as {@code true}
 * - 'true'
 * - 'true   '
 * - '   true'
 * - 'TrUE'
 * - 'TRUE'
 *
 * It will not allow:
 * - 'true false'
 * - 'false true'
 * - 'true!'
 * - 'true,true'
 * - '1'
 * - ' '
 *
 * @param signalIdentifier
 */ function getInsecureSettingFromEnv(signalIdentifier) {
    const signalSpecificInsecureValue = process.env[`OTEL_EXPORTER_OTLP_${signalIdentifier}_INSECURE`]?.toLowerCase().trim();
    const nonSignalSpecificInsecureValue = process.env[`OTEL_EXPORTER_OTLP_INSECURE`]?.toLowerCase().trim();
    return fallbackIfNullishOrBlank(signalSpecificInsecureValue, nonSignalSpecificInsecureValue) === 'true';
}
function readFileFromEnv(signalSpecificEnvVar, nonSignalSpecificEnvVar, warningMessage) {
    const signalSpecificPath = process.env[signalSpecificEnvVar]?.trim();
    const nonSignalSpecificPath = process.env[nonSignalSpecificEnvVar]?.trim();
    const filePath = fallbackIfNullishOrBlank(signalSpecificPath, nonSignalSpecificPath);
    if (filePath != null) {
        try {
            return fs.readFileSync(path.resolve(process.cwd(), filePath));
        } catch  {
            api_1.diag.warn(warningMessage);
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
function getCredentialsFromEnvIgnoreInsecure(signalIdentifier) {
    const clientKey = getClientKeyFromEnv(signalIdentifier);
    const clientCertificate = getClientCertificateFromEnv(signalIdentifier);
    const rootCertificate = getRootCertificateFromEnv(signalIdentifier);
    // if the chain is not intact, @grpc/grpc-js will throw. This is fine when a user provides it in code, but env var
    // config is not allowed to throw, so we add this safeguard and try to make the best of it here.
    const clientChainIntact = clientKey != null && clientCertificate != null;
    if (rootCertificate != null && !clientChainIntact) {
        api_1.diag.warn('Client key and certificate must both be provided, but one was missing - attempting to create credentials from just the root certificate');
        return (0, grpc_exporter_transport_1.createSslCredentials)(getRootCertificateFromEnv(signalIdentifier));
    }
    return (0, grpc_exporter_transport_1.createSslCredentials)(rootCertificate, clientKey, clientCertificate);
}
function getCredentialsFromEnv(signalIdentifier) {
    if (getInsecureSettingFromEnv(signalIdentifier)) {
        return (0, grpc_exporter_transport_1.createInsecureCredentials)();
    }
    return getCredentialsFromEnvIgnoreInsecure(signalIdentifier);
}
function getOtlpGrpcConfigurationFromEnv(signalIdentifier) {
    return {
        ...(0, node_http_1.getSharedConfigurationFromEnvironment)(signalIdentifier),
        metadata: getMetadataProviderFromEnv(signalIdentifier),
        url: getUrlFromEnv(signalIdentifier),
        credentials: (finalResolvedUrl)=>{
            // Always assume insecure on http:// and secure on https://, the protocol always takes precedence over the insecure setting.
            // note: the spec does not make any exception for
            // - "localhost:4317". If the protocol is omitted, credentials are required unless insecure is set
            // - "unix://", as it's neither http:// nor https:// and therefore credentials are required unless insecure is set
            if (finalResolvedUrl.startsWith('http://')) {
                return ()=>{
                    return (0, grpc_exporter_transport_1.createInsecureCredentials)();
                };
            } else if (finalResolvedUrl.startsWith('https://')) {
                return ()=>{
                    return getCredentialsFromEnvIgnoreInsecure(signalIdentifier);
                };
            }
            // defer to env settings in this case
            return ()=>{
                return getCredentialsFromEnv(signalIdentifier);
            };
        }
    };
}
exports.getOtlpGrpcConfigurationFromEnv = getOtlpGrpcConfigurationFromEnv; //# sourceMappingURL=otlp-grpc-env-configuration.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/configuration/convert-legacy-otlp-grpc-options.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.convertLegacyOtlpGrpcOptions = void 0;
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const otlp_grpc_configuration_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/configuration/otlp-grpc-configuration.js [instrumentation] (ecmascript)");
const grpc_exporter_transport_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/grpc-exporter-transport.js [instrumentation] (ecmascript)");
const otlp_grpc_env_configuration_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/configuration/otlp-grpc-env-configuration.js [instrumentation] (ecmascript)");
/**
 * @deprecated
 * @param config
 * @param signalIdentifier
 */ function convertLegacyOtlpGrpcOptions(config, signalIdentifier) {
    if (config.headers) {
        api_1.diag.warn('Headers cannot be set when using grpc');
    }
    // keep credentials locally in case user updates the reference on the config object
    const userProvidedCredentials = config.credentials;
    return (0, otlp_grpc_configuration_1.mergeOtlpGrpcConfigurationWithDefaults)({
        url: config.url,
        metadata: ()=>{
            // metadata resolution strategy is merge, so we can return empty here, and it will not override the rest of the settings.
            return config.metadata ?? (0, grpc_exporter_transport_1.createEmptyMetadata)();
        },
        compression: config.compression,
        timeoutMillis: config.timeoutMillis,
        concurrencyLimit: config.concurrencyLimit,
        credentials: userProvidedCredentials != null ? ()=>userProvidedCredentials : undefined,
        userAgent: config.userAgent
    }, (0, otlp_grpc_env_configuration_1.getOtlpGrpcConfigurationFromEnv)(signalIdentifier), (0, otlp_grpc_configuration_1.getOtlpGrpcDefaultConfiguration)());
}
exports.convertLegacyOtlpGrpcOptions = convertLegacyOtlpGrpcOptions; //# sourceMappingURL=convert-legacy-otlp-grpc-options.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/otlp-grpc-export-delegate.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createOtlpGrpcExportDelegate = void 0;
const otlp_exporter_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index.js [instrumentation] (ecmascript)");
const grpc_exporter_transport_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/grpc-exporter-transport.js [instrumentation] (ecmascript)");
function createOtlpGrpcExportDelegate(options, serializer, grpcName, grpcPath) {
    return (0, otlp_exporter_base_1.createOtlpNetworkExportDelegate)(options, serializer, (0, grpc_exporter_transport_1.createOtlpGrpcExporterTransport)({
        address: options.url,
        compression: options.compression,
        credentials: options.credentials,
        metadata: options.metadata,
        userAgent: options.userAgent,
        grpcName,
        grpcPath
    }));
}
exports.createOtlpGrpcExportDelegate = createOtlpGrpcExportDelegate; //# sourceMappingURL=otlp-grpc-export-delegate.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createOtlpGrpcExportDelegate = exports.convertLegacyOtlpGrpcOptions = void 0;
var convert_legacy_otlp_grpc_options_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/configuration/convert-legacy-otlp-grpc-options.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "convertLegacyOtlpGrpcOptions", {
    enumerable: true,
    get: function() {
        return convert_legacy_otlp_grpc_options_1.convertLegacyOtlpGrpcOptions;
    }
});
var otlp_grpc_export_delegate_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/otlp-grpc-export-delegate.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "createOtlpGrpcExportDelegate", {
    enumerable: true,
    get: function() {
        return otlp_grpc_export_delegate_1.createOtlpGrpcExportDelegate;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@js-sdsl/ordered-map/dist/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrderedMap",
    ()=>OrderedMap
]);
var extendStatics = function(e, r) {
    extendStatics = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(e, r) {
        e.__proto__ = r;
    } || function(e, r) {
        for(var t in r)if (Object.prototype.hasOwnProperty.call(r, t)) e[t] = r[t];
    };
    return extendStatics(e, r);
};
function __extends(e, r) {
    if (typeof r !== "function" && r !== null) throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
    extendStatics(e, r);
    function __() {
        this.constructor = e;
    }
    e.prototype = r === null ? Object.create(r) : (__.prototype = r.prototype, new __);
}
function __generator(e, r) {
    var t = {
        label: 0,
        sent: function() {
            if (s[0] & 1) throw s[1];
            return s[1];
        },
        trys: [],
        ops: []
    }, i, n, s, h;
    return h = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
    }, typeof Symbol === "function" && (h[Symbol.iterator] = function() {
        return this;
    }), h;
    //TURBOPACK unreachable
    ;
    function verb(e) {
        return function(r) {
            return step([
                e,
                r
            ]);
        };
    }
    function step(a) {
        if (i) throw new TypeError("Generator is already executing.");
        while(h && (h = 0, a[0] && (t = 0)), t)try {
            if (i = 1, n && (s = a[0] & 2 ? n["return"] : a[0] ? n["throw"] || ((s = n["return"]) && s.call(n), 0) : n.next) && !(s = s.call(n, a[1])).done) return s;
            if (n = 0, s) a = [
                a[0] & 2,
                s.value
            ];
            switch(a[0]){
                case 0:
                case 1:
                    s = a;
                    break;
                case 4:
                    t.label++;
                    return {
                        value: a[1],
                        done: false
                    };
                case 5:
                    t.label++;
                    n = a[1];
                    a = [
                        0
                    ];
                    continue;
                case 7:
                    a = t.ops.pop();
                    t.trys.pop();
                    continue;
                default:
                    if (!(s = t.trys, s = s.length > 0 && s[s.length - 1]) && (a[0] === 6 || a[0] === 2)) {
                        t = 0;
                        continue;
                    }
                    if (a[0] === 3 && (!s || a[1] > s[0] && a[1] < s[3])) {
                        t.label = a[1];
                        break;
                    }
                    if (a[0] === 6 && t.label < s[1]) {
                        t.label = s[1];
                        s = a;
                        break;
                    }
                    if (s && t.label < s[2]) {
                        t.label = s[2];
                        t.ops.push(a);
                        break;
                    }
                    if (s[2]) t.ops.pop();
                    t.trys.pop();
                    continue;
            }
            a = r.call(e, t);
        } catch (e) {
            a = [
                6,
                e
            ];
            n = 0;
        } finally{
            i = s = 0;
        }
        if (a[0] & 5) throw a[1];
        return {
            value: a[0] ? a[1] : void 0,
            done: true
        };
    }
}
typeof SuppressedError === "function" ? SuppressedError : function(e, r, t) {
    var i = new Error(t);
    return i.name = "SuppressedError", i.error = e, i.suppressed = r, i;
};
var TreeNode = function() {
    function TreeNode(e, r, t) {
        if (t === void 0) {
            t = 1;
        }
        this.t = undefined;
        this.i = undefined;
        this.h = undefined;
        this.u = e;
        this.o = r;
        this.l = t;
    }
    TreeNode.prototype.v = function() {
        var e = this;
        var r = e.h.h === e;
        if (r && e.l === 1) {
            e = e.i;
        } else if (e.t) {
            e = e.t;
            while(e.i){
                e = e.i;
            }
        } else {
            if (r) {
                return e.h;
            }
            var t = e.h;
            while(t.t === e){
                e = t;
                t = e.h;
            }
            e = t;
        }
        return e;
    };
    TreeNode.prototype.p = function() {
        var e = this;
        if (e.i) {
            e = e.i;
            while(e.t){
                e = e.t;
            }
            return e;
        } else {
            var r = e.h;
            while(r.i === e){
                e = r;
                r = e.h;
            }
            if (e.i !== r) {
                return r;
            } else return e;
        }
    };
    TreeNode.prototype.T = function() {
        var e = this.h;
        var r = this.i;
        var t = r.t;
        if (e.h === this) e.h = r;
        else if (e.t === this) e.t = r;
        else e.i = r;
        r.h = e;
        r.t = this;
        this.h = r;
        this.i = t;
        if (t) t.h = this;
        return r;
    };
    TreeNode.prototype.I = function() {
        var e = this.h;
        var r = this.t;
        var t = r.i;
        if (e.h === this) e.h = r;
        else if (e.t === this) e.t = r;
        else e.i = r;
        r.h = e;
        r.i = this;
        this.h = r;
        this.t = t;
        if (t) t.h = this;
        return r;
    };
    return TreeNode;
}();
var TreeNodeEnableIndex = function(e) {
    __extends(TreeNodeEnableIndex, e);
    function TreeNodeEnableIndex() {
        var r = e !== null && e.apply(this, arguments) || this;
        r.O = 1;
        return r;
    }
    TreeNodeEnableIndex.prototype.T = function() {
        var r = e.prototype.T.call(this);
        this.M();
        r.M();
        return r;
    };
    TreeNodeEnableIndex.prototype.I = function() {
        var r = e.prototype.I.call(this);
        this.M();
        r.M();
        return r;
    };
    TreeNodeEnableIndex.prototype.M = function() {
        this.O = 1;
        if (this.t) {
            this.O += this.t.O;
        }
        if (this.i) {
            this.O += this.i.O;
        }
    };
    return TreeNodeEnableIndex;
}(TreeNode);
var ContainerIterator = function() {
    function ContainerIterator(e) {
        if (e === void 0) {
            e = 0;
        }
        this.iteratorType = e;
    }
    ContainerIterator.prototype.equals = function(e) {
        return this.C === e.C;
    };
    return ContainerIterator;
}();
var Base = function() {
    function Base() {
        this._ = 0;
    }
    Object.defineProperty(Base.prototype, "length", {
        get: function() {
            return this._;
        },
        enumerable: false,
        configurable: true
    });
    Base.prototype.size = function() {
        return this._;
    };
    Base.prototype.empty = function() {
        return this._ === 0;
    };
    return Base;
}();
var Container = function(e) {
    __extends(Container, e);
    function Container() {
        return e !== null && e.apply(this, arguments) || this;
    }
    return Container;
}(Base);
function throwIteratorAccessError() {
    throw new RangeError("Iterator access denied!");
}
var TreeContainer = function(e) {
    __extends(TreeContainer, e);
    function TreeContainer(r, t) {
        if (r === void 0) {
            r = function(e, r) {
                if (e < r) return -1;
                if (e > r) return 1;
                return 0;
            };
        }
        if (t === void 0) {
            t = false;
        }
        var i = e.call(this) || this;
        i.N = undefined;
        i.g = r;
        i.enableIndex = t;
        i.S = t ? TreeNodeEnableIndex : TreeNode;
        i.A = new i.S;
        return i;
    }
    TreeContainer.prototype.m = function(e, r) {
        var t = this.A;
        while(e){
            var i = this.g(e.u, r);
            if (i < 0) {
                e = e.i;
            } else if (i > 0) {
                t = e;
                e = e.t;
            } else return e;
        }
        return t;
    };
    TreeContainer.prototype.B = function(e, r) {
        var t = this.A;
        while(e){
            var i = this.g(e.u, r);
            if (i <= 0) {
                e = e.i;
            } else {
                t = e;
                e = e.t;
            }
        }
        return t;
    };
    TreeContainer.prototype.j = function(e, r) {
        var t = this.A;
        while(e){
            var i = this.g(e.u, r);
            if (i < 0) {
                t = e;
                e = e.i;
            } else if (i > 0) {
                e = e.t;
            } else return e;
        }
        return t;
    };
    TreeContainer.prototype.k = function(e, r) {
        var t = this.A;
        while(e){
            var i = this.g(e.u, r);
            if (i < 0) {
                t = e;
                e = e.i;
            } else {
                e = e.t;
            }
        }
        return t;
    };
    TreeContainer.prototype.R = function(e) {
        while(true){
            var r = e.h;
            if (r === this.A) return;
            if (e.l === 1) {
                e.l = 0;
                return;
            }
            if (e === r.t) {
                var t = r.i;
                if (t.l === 1) {
                    t.l = 0;
                    r.l = 1;
                    if (r === this.N) {
                        this.N = r.T();
                    } else r.T();
                } else {
                    if (t.i && t.i.l === 1) {
                        t.l = r.l;
                        r.l = 0;
                        t.i.l = 0;
                        if (r === this.N) {
                            this.N = r.T();
                        } else r.T();
                        return;
                    } else if (t.t && t.t.l === 1) {
                        t.l = 1;
                        t.t.l = 0;
                        t.I();
                    } else {
                        t.l = 1;
                        e = r;
                    }
                }
            } else {
                var t = r.t;
                if (t.l === 1) {
                    t.l = 0;
                    r.l = 1;
                    if (r === this.N) {
                        this.N = r.I();
                    } else r.I();
                } else {
                    if (t.t && t.t.l === 1) {
                        t.l = r.l;
                        r.l = 0;
                        t.t.l = 0;
                        if (r === this.N) {
                            this.N = r.I();
                        } else r.I();
                        return;
                    } else if (t.i && t.i.l === 1) {
                        t.l = 1;
                        t.i.l = 0;
                        t.T();
                    } else {
                        t.l = 1;
                        e = r;
                    }
                }
            }
        }
    };
    TreeContainer.prototype.G = function(e) {
        if (this._ === 1) {
            this.clear();
            return;
        }
        var r = e;
        while(r.t || r.i){
            if (r.i) {
                r = r.i;
                while(r.t)r = r.t;
            } else {
                r = r.t;
            }
            var t = e.u;
            e.u = r.u;
            r.u = t;
            var i = e.o;
            e.o = r.o;
            r.o = i;
            e = r;
        }
        if (this.A.t === r) {
            this.A.t = r.h;
        } else if (this.A.i === r) {
            this.A.i = r.h;
        }
        this.R(r);
        var n = r.h;
        if (r === n.t) {
            n.t = undefined;
        } else n.i = undefined;
        this._ -= 1;
        this.N.l = 0;
        if (this.enableIndex) {
            while(n !== this.A){
                n.O -= 1;
                n = n.h;
            }
        }
    };
    TreeContainer.prototype.P = function(e) {
        var r = typeof e === "number" ? e : undefined;
        var t = typeof e === "function" ? e : undefined;
        var i = typeof e === "undefined" ? [] : undefined;
        var n = 0;
        var s = this.N;
        var h = [];
        while(h.length || s){
            if (s) {
                h.push(s);
                s = s.t;
            } else {
                s = h.pop();
                if (n === r) return s;
                i && i.push(s);
                t && t(s, n, this);
                n += 1;
                s = s.i;
            }
        }
        return i;
    };
    TreeContainer.prototype.q = function(e) {
        while(true){
            var r = e.h;
            if (r.l === 0) return;
            var t = r.h;
            if (r === t.t) {
                var i = t.i;
                if (i && i.l === 1) {
                    i.l = r.l = 0;
                    if (t === this.N) return;
                    t.l = 1;
                    e = t;
                    continue;
                } else if (e === r.i) {
                    e.l = 0;
                    if (e.t) {
                        e.t.h = r;
                    }
                    if (e.i) {
                        e.i.h = t;
                    }
                    r.i = e.t;
                    t.t = e.i;
                    e.t = r;
                    e.i = t;
                    if (t === this.N) {
                        this.N = e;
                        this.A.h = e;
                    } else {
                        var n = t.h;
                        if (n.t === t) {
                            n.t = e;
                        } else n.i = e;
                    }
                    e.h = t.h;
                    r.h = e;
                    t.h = e;
                    t.l = 1;
                } else {
                    r.l = 0;
                    if (t === this.N) {
                        this.N = t.I();
                    } else t.I();
                    t.l = 1;
                    return;
                }
            } else {
                var i = t.t;
                if (i && i.l === 1) {
                    i.l = r.l = 0;
                    if (t === this.N) return;
                    t.l = 1;
                    e = t;
                    continue;
                } else if (e === r.t) {
                    e.l = 0;
                    if (e.t) {
                        e.t.h = t;
                    }
                    if (e.i) {
                        e.i.h = r;
                    }
                    t.i = e.t;
                    r.t = e.i;
                    e.t = t;
                    e.i = r;
                    if (t === this.N) {
                        this.N = e;
                        this.A.h = e;
                    } else {
                        var n = t.h;
                        if (n.t === t) {
                            n.t = e;
                        } else n.i = e;
                    }
                    e.h = t.h;
                    r.h = e;
                    t.h = e;
                    t.l = 1;
                } else {
                    r.l = 0;
                    if (t === this.N) {
                        this.N = t.T();
                    } else t.T();
                    t.l = 1;
                    return;
                }
            }
            if (this.enableIndex) {
                r.M();
                t.M();
                e.M();
            }
            return;
        }
    };
    TreeContainer.prototype.D = function(e, r, t) {
        if (this.N === undefined) {
            this._ += 1;
            this.N = new this.S(e, r, 0);
            this.N.h = this.A;
            this.A.h = this.A.t = this.A.i = this.N;
            return this._;
        }
        var i;
        var n = this.A.t;
        var s = this.g(n.u, e);
        if (s === 0) {
            n.o = r;
            return this._;
        } else if (s > 0) {
            n.t = new this.S(e, r);
            n.t.h = n;
            i = n.t;
            this.A.t = i;
        } else {
            var h = this.A.i;
            var a = this.g(h.u, e);
            if (a === 0) {
                h.o = r;
                return this._;
            } else if (a < 0) {
                h.i = new this.S(e, r);
                h.i.h = h;
                i = h.i;
                this.A.i = i;
            } else {
                if (t !== undefined) {
                    var u = t.C;
                    if (u !== this.A) {
                        var f = this.g(u.u, e);
                        if (f === 0) {
                            u.o = r;
                            return this._;
                        } else if (f > 0) {
                            var o = u.v();
                            var d = this.g(o.u, e);
                            if (d === 0) {
                                o.o = r;
                                return this._;
                            } else if (d < 0) {
                                i = new this.S(e, r);
                                if (o.i === undefined) {
                                    o.i = i;
                                    i.h = o;
                                } else {
                                    u.t = i;
                                    i.h = u;
                                }
                            }
                        }
                    }
                }
                if (i === undefined) {
                    i = this.N;
                    while(true){
                        var c = this.g(i.u, e);
                        if (c > 0) {
                            if (i.t === undefined) {
                                i.t = new this.S(e, r);
                                i.t.h = i;
                                i = i.t;
                                break;
                            }
                            i = i.t;
                        } else if (c < 0) {
                            if (i.i === undefined) {
                                i.i = new this.S(e, r);
                                i.i.h = i;
                                i = i.i;
                                break;
                            }
                            i = i.i;
                        } else {
                            i.o = r;
                            return this._;
                        }
                    }
                }
            }
        }
        if (this.enableIndex) {
            var l = i.h;
            while(l !== this.A){
                l.O += 1;
                l = l.h;
            }
        }
        this.q(i);
        this._ += 1;
        return this._;
    };
    TreeContainer.prototype.F = function(e, r) {
        while(e){
            var t = this.g(e.u, r);
            if (t < 0) {
                e = e.i;
            } else if (t > 0) {
                e = e.t;
            } else return e;
        }
        return e || this.A;
    };
    TreeContainer.prototype.clear = function() {
        this._ = 0;
        this.N = undefined;
        this.A.h = undefined;
        this.A.t = this.A.i = undefined;
    };
    TreeContainer.prototype.updateKeyByIterator = function(e, r) {
        var t = e.C;
        if (t === this.A) {
            throwIteratorAccessError();
        }
        if (this._ === 1) {
            t.u = r;
            return true;
        }
        var i = t.p().u;
        if (t === this.A.t) {
            if (this.g(i, r) > 0) {
                t.u = r;
                return true;
            }
            return false;
        }
        var n = t.v().u;
        if (t === this.A.i) {
            if (this.g(n, r) < 0) {
                t.u = r;
                return true;
            }
            return false;
        }
        if (this.g(n, r) >= 0 || this.g(i, r) <= 0) return false;
        t.u = r;
        return true;
    };
    TreeContainer.prototype.eraseElementByPos = function(e) {
        if (e < 0 || e > this._ - 1) {
            throw new RangeError;
        }
        var r = this.P(e);
        this.G(r);
        return this._;
    };
    TreeContainer.prototype.eraseElementByKey = function(e) {
        if (this._ === 0) return false;
        var r = this.F(this.N, e);
        if (r === this.A) return false;
        this.G(r);
        return true;
    };
    TreeContainer.prototype.eraseElementByIterator = function(e) {
        var r = e.C;
        if (r === this.A) {
            throwIteratorAccessError();
        }
        var t = r.i === undefined;
        var i = e.iteratorType === 0;
        if (i) {
            if (t) e.next();
        } else {
            if (!t || r.t === undefined) e.next();
        }
        this.G(r);
        return e;
    };
    TreeContainer.prototype.getHeight = function() {
        if (this._ === 0) return 0;
        function traversal(e) {
            if (!e) return 0;
            return Math.max(traversal(e.t), traversal(e.i)) + 1;
        }
        return traversal(this.N);
    };
    return TreeContainer;
}(Container);
var TreeIterator = function(e) {
    __extends(TreeIterator, e);
    function TreeIterator(r, t, i) {
        var n = e.call(this, i) || this;
        n.C = r;
        n.A = t;
        if (n.iteratorType === 0) {
            n.pre = function() {
                if (this.C === this.A.t) {
                    throwIteratorAccessError();
                }
                this.C = this.C.v();
                return this;
            };
            n.next = function() {
                if (this.C === this.A) {
                    throwIteratorAccessError();
                }
                this.C = this.C.p();
                return this;
            };
        } else {
            n.pre = function() {
                if (this.C === this.A.i) {
                    throwIteratorAccessError();
                }
                this.C = this.C.p();
                return this;
            };
            n.next = function() {
                if (this.C === this.A) {
                    throwIteratorAccessError();
                }
                this.C = this.C.v();
                return this;
            };
        }
        return n;
    }
    Object.defineProperty(TreeIterator.prototype, "index", {
        get: function() {
            var e = this.C;
            var r = this.A.h;
            if (e === this.A) {
                if (r) {
                    return r.O - 1;
                }
                return 0;
            }
            var t = 0;
            if (e.t) {
                t += e.t.O;
            }
            while(e !== r){
                var i = e.h;
                if (e === i.i) {
                    t += 1;
                    if (i.t) {
                        t += i.t.O;
                    }
                }
                e = i;
            }
            return t;
        },
        enumerable: false,
        configurable: true
    });
    TreeIterator.prototype.isAccessible = function() {
        return this.C !== this.A;
    };
    return TreeIterator;
}(ContainerIterator);
var OrderedMapIterator = function(e) {
    __extends(OrderedMapIterator, e);
    function OrderedMapIterator(r, t, i, n) {
        var s = e.call(this, r, t, n) || this;
        s.container = i;
        return s;
    }
    Object.defineProperty(OrderedMapIterator.prototype, "pointer", {
        get: function() {
            if (this.C === this.A) {
                throwIteratorAccessError();
            }
            var e = this;
            return new Proxy([], {
                get: function(r, t) {
                    if (t === "0") return e.C.u;
                    else if (t === "1") return e.C.o;
                    r[0] = e.C.u;
                    r[1] = e.C.o;
                    return r[t];
                },
                set: function(r, t, i) {
                    if (t !== "1") {
                        throw new TypeError("prop must be 1");
                    }
                    e.C.o = i;
                    return true;
                }
            });
        },
        enumerable: false,
        configurable: true
    });
    OrderedMapIterator.prototype.copy = function() {
        return new OrderedMapIterator(this.C, this.A, this.container, this.iteratorType);
    };
    return OrderedMapIterator;
}(TreeIterator);
var OrderedMap = function(e) {
    __extends(OrderedMap, e);
    function OrderedMap(r, t, i) {
        if (r === void 0) {
            r = [];
        }
        var n = e.call(this, t, i) || this;
        var s = n;
        r.forEach(function(e) {
            s.setElement(e[0], e[1]);
        });
        return n;
    }
    OrderedMap.prototype.begin = function() {
        return new OrderedMapIterator(this.A.t || this.A, this.A, this);
    };
    OrderedMap.prototype.end = function() {
        return new OrderedMapIterator(this.A, this.A, this);
    };
    OrderedMap.prototype.rBegin = function() {
        return new OrderedMapIterator(this.A.i || this.A, this.A, this, 1);
    };
    OrderedMap.prototype.rEnd = function() {
        return new OrderedMapIterator(this.A, this.A, this, 1);
    };
    OrderedMap.prototype.front = function() {
        if (this._ === 0) return;
        var e = this.A.t;
        return [
            e.u,
            e.o
        ];
    };
    OrderedMap.prototype.back = function() {
        if (this._ === 0) return;
        var e = this.A.i;
        return [
            e.u,
            e.o
        ];
    };
    OrderedMap.prototype.lowerBound = function(e) {
        var r = this.m(this.N, e);
        return new OrderedMapIterator(r, this.A, this);
    };
    OrderedMap.prototype.upperBound = function(e) {
        var r = this.B(this.N, e);
        return new OrderedMapIterator(r, this.A, this);
    };
    OrderedMap.prototype.reverseLowerBound = function(e) {
        var r = this.j(this.N, e);
        return new OrderedMapIterator(r, this.A, this);
    };
    OrderedMap.prototype.reverseUpperBound = function(e) {
        var r = this.k(this.N, e);
        return new OrderedMapIterator(r, this.A, this);
    };
    OrderedMap.prototype.forEach = function(e) {
        this.P(function(r, t, i) {
            e([
                r.u,
                r.o
            ], t, i);
        });
    };
    OrderedMap.prototype.setElement = function(e, r, t) {
        return this.D(e, r, t);
    };
    OrderedMap.prototype.getElementByPos = function(e) {
        if (e < 0 || e > this._ - 1) {
            throw new RangeError;
        }
        var r = this.P(e);
        return [
            r.u,
            r.o
        ];
    };
    OrderedMap.prototype.find = function(e) {
        var r = this.F(this.N, e);
        return new OrderedMapIterator(r, this.A, this);
    };
    OrderedMap.prototype.getElementByKey = function(e) {
        var r = this.F(this.N, e);
        return r.o;
    };
    OrderedMap.prototype.union = function(e) {
        var r = this;
        e.forEach(function(e) {
            r.setElement(e[0], e[1]);
        });
        return this._;
    };
    OrderedMap.prototype[Symbol.iterator] = function() {
        var e, r, t, i;
        return __generator(this, function(n) {
            switch(n.label){
                case 0:
                    e = this._;
                    r = this.P();
                    t = 0;
                    n.label = 1;
                case 1:
                    if (!(t < e)) return [
                        3,
                        4
                    ];
                    i = r[t];
                    return [
                        4,
                        [
                            i.u,
                            i.o
                        ]
                    ];
                case 2:
                    n.sent();
                    n.label = 3;
                case 3:
                    ++t;
                    return [
                        3,
                        1
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    };
    return OrderedMap;
}(TreeContainer);
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/lodash.camelcase/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as references for various `Number` constants. */ var INFINITY = 1 / 0;
/** `Object#toString` result references. */ var symbolTag = '[object Symbol]';
/** Used to match words composed of alphanumeric characters. */ var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
/** Used to match Latin Unicode letters (excluding mathematical operators). */ var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
/** Used to compose unicode character classes. */ var rsAstralRange = '\\ud800-\\udfff', rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23', rsComboSymbolsRange = '\\u20d0-\\u20f0', rsDingbatRange = '\\u2700-\\u27bf', rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff', rsMathOpRange = '\\xac\\xb1\\xd7\\xf7', rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf', rsPunctuationRange = '\\u2000-\\u206f', rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000', rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde', rsVarRange = '\\ufe0e\\ufe0f', rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
/** Used to compose unicode capture groups. */ var rsApos = "['\u2019]", rsAstral = '[' + rsAstralRange + ']', rsBreak = '[' + rsBreakRange + ']', rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']', rsDigits = '\\d+', rsDingbat = '[' + rsDingbatRange + ']', rsLower = '[' + rsLowerRange + ']', rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']', rsFitz = '\\ud83c[\\udffb-\\udfff]', rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')', rsNonAstral = '[^' + rsAstralRange + ']', rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}', rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]', rsUpper = '[' + rsUpperRange + ']', rsZWJ = '\\u200d';
/** Used to compose unicode regexes. */ var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')', rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')', rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?', rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?', reOptMod = rsModifier + '?', rsOptVar = '[' + rsVarRange + ']?', rsOptJoin = '(?:' + rsZWJ + '(?:' + [
    rsNonAstral,
    rsRegional,
    rsSurrPair
].join('|') + ')' + rsOptVar + reOptMod + ')*', rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = '(?:' + [
    rsDingbat,
    rsRegional,
    rsSurrPair
].join('|') + ')' + rsSeq, rsSymbol = '(?:' + [
    rsNonAstral + rsCombo + '?',
    rsCombo,
    rsRegional,
    rsSurrPair,
    rsAstral
].join('|') + ')';
/** Used to match apostrophes. */ var reApos = RegExp(rsApos, 'g');
/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */ var reComboMark = RegExp(rsCombo, 'g');
/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */ var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
/** Used to match complex or compound words. */ var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [
        rsBreak,
        rsUpper,
        '$'
    ].join('|') + ')',
    rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [
        rsBreak,
        rsUpper + rsLowerMisc,
        '$'
    ].join('|') + ')',
    rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr,
    rsUpper + '+' + rsOptUpperContr,
    rsDigits,
    rsEmoji
].join('|'), 'g');
/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */ var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');
/** Used to detect strings that need a more robust regexp to match words. */ var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
/** Used to map Latin Unicode letters to basic Latin letters. */ var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',
    '\xc1': 'A',
    '\xc2': 'A',
    '\xc3': 'A',
    '\xc4': 'A',
    '\xc5': 'A',
    '\xe0': 'a',
    '\xe1': 'a',
    '\xe2': 'a',
    '\xe3': 'a',
    '\xe4': 'a',
    '\xe5': 'a',
    '\xc7': 'C',
    '\xe7': 'c',
    '\xd0': 'D',
    '\xf0': 'd',
    '\xc8': 'E',
    '\xc9': 'E',
    '\xca': 'E',
    '\xcb': 'E',
    '\xe8': 'e',
    '\xe9': 'e',
    '\xea': 'e',
    '\xeb': 'e',
    '\xcc': 'I',
    '\xcd': 'I',
    '\xce': 'I',
    '\xcf': 'I',
    '\xec': 'i',
    '\xed': 'i',
    '\xee': 'i',
    '\xef': 'i',
    '\xd1': 'N',
    '\xf1': 'n',
    '\xd2': 'O',
    '\xd3': 'O',
    '\xd4': 'O',
    '\xd5': 'O',
    '\xd6': 'O',
    '\xd8': 'O',
    '\xf2': 'o',
    '\xf3': 'o',
    '\xf4': 'o',
    '\xf5': 'o',
    '\xf6': 'o',
    '\xf8': 'o',
    '\xd9': 'U',
    '\xda': 'U',
    '\xdb': 'U',
    '\xdc': 'U',
    '\xf9': 'u',
    '\xfa': 'u',
    '\xfb': 'u',
    '\xfc': 'u',
    '\xdd': 'Y',
    '\xfd': 'y',
    '\xff': 'y',
    '\xc6': 'Ae',
    '\xe6': 'ae',
    '\xde': 'Th',
    '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',
    '\u0102': 'A',
    '\u0104': 'A',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u0105': 'a',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010a': 'C',
    '\u010c': 'C',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010b': 'c',
    '\u010d': 'c',
    '\u010e': 'D',
    '\u0110': 'D',
    '\u010f': 'd',
    '\u0111': 'd',
    '\u0112': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u0118': 'E',
    '\u011a': 'E',
    '\u0113': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u0119': 'e',
    '\u011b': 'e',
    '\u011c': 'G',
    '\u011e': 'G',
    '\u0120': 'G',
    '\u0122': 'G',
    '\u011d': 'g',
    '\u011f': 'g',
    '\u0121': 'g',
    '\u0123': 'g',
    '\u0124': 'H',
    '\u0126': 'H',
    '\u0125': 'h',
    '\u0127': 'h',
    '\u0128': 'I',
    '\u012a': 'I',
    '\u012c': 'I',
    '\u012e': 'I',
    '\u0130': 'I',
    '\u0129': 'i',
    '\u012b': 'i',
    '\u012d': 'i',
    '\u012f': 'i',
    '\u0131': 'i',
    '\u0134': 'J',
    '\u0135': 'j',
    '\u0136': 'K',
    '\u0137': 'k',
    '\u0138': 'k',
    '\u0139': 'L',
    '\u013b': 'L',
    '\u013d': 'L',
    '\u013f': 'L',
    '\u0141': 'L',
    '\u013a': 'l',
    '\u013c': 'l',
    '\u013e': 'l',
    '\u0140': 'l',
    '\u0142': 'l',
    '\u0143': 'N',
    '\u0145': 'N',
    '\u0147': 'N',
    '\u014a': 'N',
    '\u0144': 'n',
    '\u0146': 'n',
    '\u0148': 'n',
    '\u014b': 'n',
    '\u014c': 'O',
    '\u014e': 'O',
    '\u0150': 'O',
    '\u014d': 'o',
    '\u014f': 'o',
    '\u0151': 'o',
    '\u0154': 'R',
    '\u0156': 'R',
    '\u0158': 'R',
    '\u0155': 'r',
    '\u0157': 'r',
    '\u0159': 'r',
    '\u015a': 'S',
    '\u015c': 'S',
    '\u015e': 'S',
    '\u0160': 'S',
    '\u015b': 's',
    '\u015d': 's',
    '\u015f': 's',
    '\u0161': 's',
    '\u0162': 'T',
    '\u0164': 'T',
    '\u0166': 'T',
    '\u0163': 't',
    '\u0165': 't',
    '\u0167': 't',
    '\u0168': 'U',
    '\u016a': 'U',
    '\u016c': 'U',
    '\u016e': 'U',
    '\u0170': 'U',
    '\u0172': 'U',
    '\u0169': 'u',
    '\u016b': 'u',
    '\u016d': 'u',
    '\u016f': 'u',
    '\u0171': 'u',
    '\u0173': 'u',
    '\u0174': 'W',
    '\u0175': 'w',
    '\u0176': 'Y',
    '\u0177': 'y',
    '\u0178': 'Y',
    '\u0179': 'Z',
    '\u017b': 'Z',
    '\u017d': 'Z',
    '\u017a': 'z',
    '\u017c': 'z',
    '\u017e': 'z',
    '\u0132': 'IJ',
    '\u0133': 'ij',
    '\u0152': 'Oe',
    '\u0153': 'oe',
    '\u0149': "'n",
    '\u017f': 'ss'
};
/** Detect free variable `global` from Node.js. */ var freeGlobal = ("TURBOPACK compile-time value", "object") == 'object' && /*TURBOPACK member replacement*/ __turbopack_context__.g && /*TURBOPACK member replacement*/ __turbopack_context__.g.Object === Object && /*TURBOPACK member replacement*/ __turbopack_context__.g;
/** Detect free variable `self`. */ var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */ var root = freeGlobal || freeSelf || Function('return this')();
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */ function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1, length = array ? array.length : 0;
    if (initAccum && length) {
        accumulator = array[++index];
    }
    while(++index < length){
        accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
}
/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */ function asciiToArray(string) {
    return string.split('');
}
/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */ function asciiWords(string) {
    return string.match(reAsciiWord) || [];
}
/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */ function basePropertyOf(object) {
    return function(key) {
        return object == null ? undefined : object[key];
    };
}
/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */ var deburrLetter = basePropertyOf(deburredLetters);
/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */ function hasUnicode(string) {
    return reHasUnicode.test(string);
}
/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */ function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
}
/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */ function stringToArray(string) {
    return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
}
/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */ function unicodeToArray(string) {
    return string.match(reUnicode) || [];
}
/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */ function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
}
/** Used for built-in method references. */ var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Built-in value references. */ var Symbol = root.Symbol;
/** Used to convert symbols to primitives and strings. */ var symbolProto = Symbol ? Symbol.prototype : undefined, symbolToString = symbolProto ? symbolProto.toString : undefined;
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */ function baseSlice(array, start, end) {
    var index = -1, length = array.length;
    if (start < 0) {
        start = -start > length ? 0 : length + start;
    }
    end = end > length ? length : end;
    if (end < 0) {
        end += length;
    }
    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);
    while(++index < length){
        result[index] = array[index + start];
    }
    return result;
}
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */ function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
        return value;
    }
    if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
    }
    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */ function castSlice(array, start, end) {
    var length = array.length;
    end = end === undefined ? length : end;
    return !start && end >= length ? array : baseSlice(array, start, end);
}
/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */ function createCaseFirst(methodName) {
    return function(string) {
        string = toString(string);
        var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;
        var chr = strSymbols ? strSymbols[0] : string.charAt(0);
        var trailing = strSymbols ? castSlice(strSymbols, 1).join('') : string.slice(1);
        return chr[methodName]() + trailing;
    };
}
/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */ function createCompounder(callback) {
    return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
    };
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */ function toString(value) {
    return value == null ? '' : baseToString(value);
}
/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */ var camelCase = createCompounder(function(result, word, index) {
    word = word.toLowerCase();
    return result + (index ? capitalize(word) : word);
});
/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */ function capitalize(string) {
    return upperFirst(toString(string).toLowerCase());
}
/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */ function deburr(string) {
    string = toString(string);
    return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}
/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */ var upperFirst = createCaseFirst('toUpperCase');
/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */ function words(string, pattern, guard) {
    string = toString(string);
    pattern = guard ? undefined : pattern;
    if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
    }
    return string.match(pattern) || [];
}
module.exports = camelCase;
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/aspromise/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = asPromise;
/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */ /**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */ function asPromise(fn, ctx /*, varargs */ ) {
    var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
    while(index < arguments.length)params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err /*, varargs */ ) {
            if (pending) {
                pending = false;
                if (err) reject(err);
                else {
                    var params = new Array(arguments.length - 1), offset = 0;
                    while(offset < params.length)params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/base64/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */ var base64 = exports;
/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */ base64.length = function length(string) {
    var p = string.length;
    if (!p) return 0;
    var n = 0;
    while(--p % 4 > 1 && string.charAt(p) === "=")++n;
    return Math.ceil(string.length * 3) / 4 - n;
};
// Base64 encoding table
var b64 = new Array(64);
// Base64 decoding table
var s64 = new Array(123);
// 65..90, 97..122, 48..57, 43, 47
for(var i = 0; i < 64;)s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */ base64.encode = function encode(buffer, start, end) {
    var parts = null, chunk = [];
    var i = 0, j = 0, t; // temporary
    while(start < end){
        var b = buffer[start++];
        switch(j){
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1) chunk[i++] = 61;
    }
    if (parts) {
        if (i) parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};
var invalidEncoding = "invalid encoding";
/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */ base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, t; // temporary
    for(var i = 0; i < string.length;){
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1) break;
        if ((c = s64[c]) === undefined) throw Error(invalidEncoding);
        switch(j){
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1) throw Error(invalidEncoding);
    return offset - start;
};
/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */ base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/eventemitter/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = EventEmitter;
/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */ function EventEmitter() {
    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */ this._listeners = {};
}
/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */ EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn: fn,
        ctx: ctx || this
    });
    return this;
};
/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */ EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined) this._listeners = {};
    else {
        if (fn === undefined) this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for(var i = 0; i < listeners.length;)if (listeners[i].fn === fn) listeners.splice(i, 1);
            else ++i;
        }
    }
    return this;
};
/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */ EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [], i = 1;
        for(; i < arguments.length;)args.push(arguments[i++]);
        for(i = 0; i < listeners.length;)listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/float/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = factory(factory);
/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */ /**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */ /**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */ /**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */ /**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */ /**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */ /**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */ /**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */ /**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */ // Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {
    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {
        var f32 = new Float32Array([
            -0
        ]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }
        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }
        /* istanbul ignore next */ exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */ exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }
        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }
        /* istanbul ignore next */ exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */ exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
    // float: ieee754
    })();
    else (function() {
        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign) val = -val;
            if (val === 0) writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val)) writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }
        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
            return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 // denormal
             ? sign * 1.401298464324817e-45 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
    })();
    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {
        var f64 = new Float64Array([
            -0
        ]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }
        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }
        /* istanbul ignore next */ exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */ exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }
        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }
        /* istanbul ignore next */ exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */ exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
    // double: ieee754
    })();
    else (function() {
        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign) val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) {
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) {
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024) exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }
        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 // denormal
             ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
    })();
    return exports;
}
// uint helpers
function writeUintLE(val, buf, pos) {
    buf[pos] = val & 255;
    buf[pos + 1] = val >>> 8 & 255;
    buf[pos + 2] = val >>> 16 & 255;
    buf[pos + 3] = val >>> 24;
}
function writeUintBE(val, buf, pos) {
    buf[pos] = val >>> 24;
    buf[pos + 1] = val >>> 16 & 255;
    buf[pos + 2] = val >>> 8 & 255;
    buf[pos + 3] = val & 255;
}
function readUintLE(buf, pos) {
    return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
}
function readUintBE(buf, pos) {
    return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
}
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/inquire/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = inquire;
/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */ function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/, "re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length)) return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/utf8/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */ var utf8 = exports;
/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */ utf8.length = function utf8_length(string) {
    var len = 0, c = 0;
    for(var i = 0; i < string.length; ++i){
        c = string.charCodeAt(i);
        if (c < 128) len += 1;
        else if (c < 2048) len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else len += 3;
    }
    return len;
};
/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */ utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1) return "";
    var parts = null, chunk = [], i = 0, t; // temporary
    while(start < end){
        t = buffer[start++];
        if (t < 128) chunk[i++] = t;
        else if (t > 191 && t < 224) chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i) parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};
/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */ utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset, c1, c2; // character 2
    for(var i = 0; i < string.length; ++i){
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6 | 192;
            buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18 | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12 | 224;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
        }
    }
    return offset - start;
};
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/pool/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = pool;
/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */ /**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */ /**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */ function pool(alloc, slice, size) {
    var SIZE = size || 8192;
    var MAX = SIZE >>> 1;
    var slab = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX) return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) offset = (offset | 7) + 1;
        return buf;
    };
}
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/codegen/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = codegen;
/**
 * Begins generating a function.
 * @memberof util
 * @param {string[]} functionParams Function parameter names
 * @param {string} [functionName] Function name if not anonymous
 * @returns {Codegen} Appender that appends code to the function's body
 */ function codegen(functionParams, functionName) {
    /* istanbul ignore if */ if (typeof functionParams === "string") {
        functionName = functionParams;
        functionParams = undefined;
    }
    var body = [];
    /**
     * Appends code to the function's body or finishes generation.
     * @typedef Codegen
     * @type {function}
     * @param {string|Object.<string,*>} [formatStringOrScope] Format string or, to finish the function, an object of additional scope variables, if any
     * @param {...*} [formatParams] Format parameters
     * @returns {Codegen|Function} Itself or the generated function if finished
     * @throws {Error} If format parameter counts do not match
     */ function Codegen(formatStringOrScope) {
        // note that explicit array handling below makes this ~50% faster
        // finish the function
        if (typeof formatStringOrScope !== "string") {
            var source = toString();
            if (codegen.verbose) console.log("codegen: " + source); // eslint-disable-line no-console
            source = "return " + source;
            if (formatStringOrScope) {
                var scopeKeys = Object.keys(formatStringOrScope), scopeParams = new Array(scopeKeys.length + 1), scopeValues = new Array(scopeKeys.length), scopeOffset = 0;
                while(scopeOffset < scopeKeys.length){
                    scopeParams[scopeOffset] = scopeKeys[scopeOffset];
                    scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
                }
                scopeParams[scopeOffset] = source;
                return Function.apply(null, scopeParams).apply(null, scopeValues); // eslint-disable-line no-new-func
            }
            return Function(source)(); // eslint-disable-line no-new-func
        }
        // otherwise append to body
        var formatParams = new Array(arguments.length - 1), formatOffset = 0;
        while(formatOffset < formatParams.length)formatParams[formatOffset] = arguments[++formatOffset];
        formatOffset = 0;
        formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace($0, $1) {
            var value = formatParams[formatOffset++];
            switch($1){
                case "d":
                case "f":
                    return String(Number(value));
                case "i":
                    return String(Math.floor(value));
                case "j":
                    return JSON.stringify(value);
                case "s":
                    return String(value);
            }
            return "%";
        });
        if (formatOffset !== formatParams.length) throw Error("parameter count mismatch");
        body.push(formatStringOrScope);
        return Codegen;
    }
    function toString(functionNameOverride) {
        return "function " + (functionNameOverride || functionName || "") + "(" + (functionParams && functionParams.join(",") || "") + "){\n  " + body.join("\n  ") + "\n}";
    }
    Codegen.toString = toString;
    return Codegen;
}
/**
 * Begins generating a function.
 * @memberof util
 * @function codegen
 * @param {string} [functionName] Function name if not anonymous
 * @returns {Codegen} Appender that appends code to the function's body
 * @variation 2
 */ /**
 * When set to `true`, codegen will log generated code to console. Useful for debugging.
 * @name util.codegen.verbose
 * @type {boolean}
 */ codegen.verbose = false;
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/fetch/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = fetch;
var asPromise = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/aspromise/index.js [instrumentation] (ecmascript)"), inquire = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/inquire/index.js [instrumentation] (ecmascript)");
var fs = inquire("fs");
/**
 * Node-style callback as used by {@link util.fetch}.
 * @typedef FetchCallback
 * @type {function}
 * @param {?Error} error Error, if any, otherwise `null`
 * @param {string} [contents] File contents, if there hasn't been an error
 * @returns {undefined}
 */ /**
 * Options as used by {@link util.fetch}.
 * @typedef FetchOptions
 * @type {Object}
 * @property {boolean} [binary=false] Whether expecting a binary response
 * @property {boolean} [xhr=false] If `true`, forces the use of XMLHttpRequest
 */ /**
 * Fetches the contents of a file.
 * @memberof util
 * @param {string} filename File path or url
 * @param {FetchOptions} options Fetch options
 * @param {FetchCallback} callback Callback function
 * @returns {undefined}
 */ function fetch(filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else if (!options) options = {};
    if (!callback) return asPromise(fetch, this, filename, options); // eslint-disable-line no-invalid-this
    // if a node-like filesystem is present, try it first but fall back to XHR if nothing is found.
    if (!options.xhr && fs && fs.readFile) return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
        return err && typeof XMLHttpRequest !== "undefined" ? fetch.xhr(filename, options, callback) : err ? callback(err) : callback(null, options.binary ? contents : contents.toString("utf8"));
    });
    // use the XHR version otherwise.
    return fetch.xhr(filename, options, callback);
}
/**
 * Fetches the contents of a file.
 * @name util.fetch
 * @function
 * @param {string} path File path or url
 * @param {FetchCallback} callback Callback function
 * @returns {undefined}
 * @variation 2
 */ /**
 * Fetches the contents of a file.
 * @name util.fetch
 * @function
 * @param {string} path File path or url
 * @param {FetchOptions} [options] Fetch options
 * @returns {Promise<string|Uint8Array>} Promise
 * @variation 3
 */ /**/ fetch.xhr = function fetch_xhr(filename, options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function fetchOnReadyStateChange() {
        if (xhr.readyState !== 4) return undefined;
        // local cors security errors return status 0 / empty string, too. afaik this cannot be
        // reliably distinguished from an actually empty file for security reasons. feel free
        // to send a pull request if you are aware of a solution.
        if (xhr.status !== 0 && xhr.status !== 200) return callback(Error("status " + xhr.status));
        // if binary data is expected, make sure that some sort of array is returned, even if
        // ArrayBuffers are not supported. the binary string fallback, however, is unsafe.
        if (options.binary) {
            var buffer = xhr.response;
            if (!buffer) {
                buffer = [];
                for(var i = 0; i < xhr.responseText.length; ++i)buffer.push(xhr.responseText.charCodeAt(i) & 255);
            }
            return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer) : buffer);
        }
        return callback(null, xhr.responseText);
    };
    if (options.binary) {
        // ref: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data#Receiving_binary_data_in_older_browsers
        if ("overrideMimeType" in xhr) xhr.overrideMimeType("text/plain; charset=x-user-defined");
        xhr.responseType = "arraybuffer";
    }
    xhr.open("GET", filename);
    xhr.send();
};
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@protobufjs/path/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * A minimal path module to resolve Unix, Windows and URL paths alike.
 * @memberof util
 * @namespace
 */ var path = exports;
var isAbsolute = /**
 * Tests if the specified path is absolute.
 * @param {string} path Path to test
 * @returns {boolean} `true` if path is absolute
 */ path.isAbsolute = function isAbsolute(path) {
    return /^(?:\/|\w+:)/.test(path);
};
var normalize = /**
 * Normalizes the specified path.
 * @param {string} path Path to normalize
 * @returns {string} Normalized path
 */ path.normalize = function normalize(path) {
    path = path.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
    var parts = path.split("/"), absolute = isAbsolute(path), prefix = "";
    if (absolute) prefix = parts.shift() + "/";
    for(var i = 0; i < parts.length;){
        if (parts[i] === "..") {
            if (i > 0 && parts[i - 1] !== "..") parts.splice(--i, 2);
            else if (absolute) parts.splice(i, 1);
            else ++i;
        } else if (parts[i] === ".") parts.splice(i, 1);
        else ++i;
    }
    return prefix + parts.join("/");
};
/**
 * Resolves the specified include path against the specified origin path.
 * @param {string} originPath Path to the origin file
 * @param {string} includePath Include path relative to origin path
 * @param {boolean} [alreadyNormalized=false] `true` if both paths are already known to be normalized
 * @returns {string} Path to the include file
 */ path.resolve = function resolve(originPath, includePath, alreadyNormalized) {
    if (!alreadyNormalized) includePath = normalize(includePath);
    if (isAbsolute(includePath)) return includePath;
    if (!alreadyNormalized) originPath = normalize(originPath);
    return (originPath = originPath.replace(/(?:\/|^)[^/]+$/, "")).length ? normalize(originPath + "/" + includePath) : includePath;
};
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/build/src/util.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license
 * Copyright 2018 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addCommonProtos = exports.loadProtosWithOptionsSync = exports.loadProtosWithOptions = void 0;
const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
const Protobuf = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/node_modules/protobufjs/index.js [instrumentation] (ecmascript)");
function addIncludePathResolver(root, includePaths) {
    const originalResolvePath = root.resolvePath;
    root.resolvePath = (origin, target)=>{
        if (path.isAbsolute(target)) {
            return target;
        }
        for (const directory of includePaths){
            const fullPath = path.join(directory, target);
            try {
                fs.accessSync(fullPath, fs.constants.R_OK);
                return fullPath;
            } catch (err) {
                continue;
            }
        }
        process.emitWarning(`${target} not found in any of the include paths ${includePaths}`);
        return originalResolvePath(origin, target);
    };
}
async function loadProtosWithOptions(filename, options) {
    const root = new Protobuf.Root();
    options = options || {};
    if (!!options.includeDirs) {
        if (!Array.isArray(options.includeDirs)) {
            return Promise.reject(new Error('The includeDirs option must be an array'));
        }
        addIncludePathResolver(root, options.includeDirs);
    }
    const loadedRoot = await root.load(filename, options);
    loadedRoot.resolveAll();
    return loadedRoot;
}
exports.loadProtosWithOptions = loadProtosWithOptions;
function loadProtosWithOptionsSync(filename, options) {
    const root = new Protobuf.Root();
    options = options || {};
    if (!!options.includeDirs) {
        if (!Array.isArray(options.includeDirs)) {
            throw new Error('The includeDirs option must be an array');
        }
        addIncludePathResolver(root, options.includeDirs);
    }
    const loadedRoot = root.loadSync(filename, options);
    loadedRoot.resolveAll();
    return loadedRoot;
}
exports.loadProtosWithOptionsSync = loadProtosWithOptionsSync;
/**
 * Load Google's well-known proto files that aren't exposed by Protobuf.js.
 */ function addCommonProtos() {
    // Protobuf.js exposes: any, duration, empty, field_mask, struct, timestamp,
    // and wrappers. compiler/plugin is excluded in Protobuf.js and here.
    // Using constant strings for compatibility with tools like Webpack
    const apiDescriptor = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/node_modules/protobufjs/google/protobuf/api.json (json)");
    const descriptorDescriptor = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/node_modules/protobufjs/google/protobuf/descriptor.json (json)");
    const sourceContextDescriptor = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/node_modules/protobufjs/google/protobuf/source_context.json (json)");
    const typeDescriptor = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/node_modules/protobufjs/google/protobuf/type.json (json)");
    Protobuf.common('api', apiDescriptor.nested.google.nested.protobuf.nested);
    Protobuf.common('descriptor', descriptorDescriptor.nested.google.nested.protobuf.nested);
    Protobuf.common('source_context', sourceContextDescriptor.nested.google.nested.protobuf.nested);
    Protobuf.common('type', typeDescriptor.nested.google.nested.protobuf.nested);
}
exports.addCommonProtos = addCommonProtos; //# sourceMappingURL=util.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license
 * Copyright 2018 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadFileDescriptorSetFromObject = exports.loadFileDescriptorSetFromBuffer = exports.fromJSON = exports.loadSync = exports.load = exports.IdempotencyLevel = exports.isAnyExtension = exports.Long = void 0;
const camelCase = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/lodash.camelcase/index.js [instrumentation] (ecmascript)");
const Protobuf = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/node_modules/protobufjs/index.js [instrumentation] (ecmascript)");
const descriptor = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/node_modules/protobufjs/ext/descriptor/index.js [instrumentation] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@grpc/proto-loader/build/src/util.js [instrumentation] (ecmascript)");
const Long = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/long/umd/index.js [instrumentation] (ecmascript)");
exports.Long = Long;
function isAnyExtension(obj) {
    return '@type' in obj && typeof obj['@type'] === 'string';
}
exports.isAnyExtension = isAnyExtension;
var IdempotencyLevel;
(function(IdempotencyLevel) {
    IdempotencyLevel["IDEMPOTENCY_UNKNOWN"] = "IDEMPOTENCY_UNKNOWN";
    IdempotencyLevel["NO_SIDE_EFFECTS"] = "NO_SIDE_EFFECTS";
    IdempotencyLevel["IDEMPOTENT"] = "IDEMPOTENT";
})(IdempotencyLevel = exports.IdempotencyLevel || (exports.IdempotencyLevel = {}));
const descriptorOptions = {
    longs: String,
    enums: String,
    bytes: String,
    defaults: true,
    oneofs: true,
    json: true
};
function joinName(baseName, name) {
    if (baseName === '') {
        return name;
    } else {
        return baseName + '.' + name;
    }
}
function isHandledReflectionObject(obj) {
    return obj instanceof Protobuf.Service || obj instanceof Protobuf.Type || obj instanceof Protobuf.Enum;
}
function isNamespaceBase(obj) {
    return obj instanceof Protobuf.Namespace || obj instanceof Protobuf.Root;
}
function getAllHandledReflectionObjects(obj, parentName) {
    const objName = joinName(parentName, obj.name);
    if (isHandledReflectionObject(obj)) {
        return [
            [
                objName,
                obj
            ]
        ];
    } else {
        if (isNamespaceBase(obj) && typeof obj.nested !== 'undefined') {
            return Object.keys(obj.nested).map((name)=>{
                return getAllHandledReflectionObjects(obj.nested[name], objName);
            }).reduce((accumulator, currentValue)=>accumulator.concat(currentValue), []);
        }
    }
    return [];
}
function createDeserializer(cls, options) {
    return function deserialize(argBuf) {
        return cls.toObject(cls.decode(argBuf), options);
    };
}
function createSerializer(cls) {
    return function serialize(arg) {
        if (Array.isArray(arg)) {
            throw new Error(`Failed to serialize message: expected object with ${cls.name} structure, got array instead`);
        }
        const message = cls.fromObject(arg);
        return cls.encode(message).finish();
    };
}
function mapMethodOptions(options) {
    return (options || []).reduce((obj, item)=>{
        for (const [key, value] of Object.entries(item)){
            switch(key){
                case 'uninterpreted_option':
                    obj.uninterpreted_option.push(item.uninterpreted_option);
                    break;
                default:
                    obj[key] = value;
            }
        }
        return obj;
    }, {
        deprecated: false,
        idempotency_level: IdempotencyLevel.IDEMPOTENCY_UNKNOWN,
        uninterpreted_option: []
    });
}
function createMethodDefinition(method, serviceName, options, fileDescriptors) {
    /* This is only ever called after the corresponding root.resolveAll(), so we
     * can assume that the resolved request and response types are non-null */ const requestType = method.resolvedRequestType;
    const responseType = method.resolvedResponseType;
    return {
        path: '/' + serviceName + '/' + method.name,
        requestStream: !!method.requestStream,
        responseStream: !!method.responseStream,
        requestSerialize: createSerializer(requestType),
        requestDeserialize: createDeserializer(requestType, options),
        responseSerialize: createSerializer(responseType),
        responseDeserialize: createDeserializer(responseType, options),
        // TODO(murgatroid99): Find a better way to handle this
        originalName: camelCase(method.name),
        requestType: createMessageDefinition(requestType, options, fileDescriptors),
        responseType: createMessageDefinition(responseType, options, fileDescriptors),
        options: mapMethodOptions(method.parsedOptions)
    };
}
function createServiceDefinition(service, name, options, fileDescriptors) {
    const def = {};
    for (const method of service.methodsArray){
        def[method.name] = createMethodDefinition(method, name, options, fileDescriptors);
    }
    return def;
}
function createMessageDefinition(message, options, fileDescriptors) {
    const messageDescriptor = message.toDescriptor('proto3');
    return {
        format: 'Protocol Buffer 3 DescriptorProto',
        type: messageDescriptor.$type.toObject(messageDescriptor, descriptorOptions),
        fileDescriptorProtos: fileDescriptors,
        serialize: createSerializer(message),
        deserialize: createDeserializer(message, options)
    };
}
function createEnumDefinition(enumType, fileDescriptors) {
    const enumDescriptor = enumType.toDescriptor('proto3');
    return {
        format: 'Protocol Buffer 3 EnumDescriptorProto',
        type: enumDescriptor.$type.toObject(enumDescriptor, descriptorOptions),
        fileDescriptorProtos: fileDescriptors
    };
}
/**
 * function createDefinition(obj: Protobuf.Service, name: string, options:
 * Options): ServiceDefinition; function createDefinition(obj: Protobuf.Type,
 * name: string, options: Options): MessageTypeDefinition; function
 * createDefinition(obj: Protobuf.Enum, name: string, options: Options):
 * EnumTypeDefinition;
 */ function createDefinition(obj, name, options, fileDescriptors) {
    if (obj instanceof Protobuf.Service) {
        return createServiceDefinition(obj, name, options, fileDescriptors);
    } else if (obj instanceof Protobuf.Type) {
        return createMessageDefinition(obj, options, fileDescriptors);
    } else if (obj instanceof Protobuf.Enum) {
        return createEnumDefinition(obj, fileDescriptors);
    } else {
        throw new Error('Type mismatch in reflection object handling');
    }
}
function createPackageDefinition(root, options) {
    const def = {};
    root.resolveAll();
    const descriptorList = root.toDescriptor('proto3').file;
    const bufferList = descriptorList.map((value)=>Buffer.from(descriptor.FileDescriptorProto.encode(value).finish()));
    for (const [name, obj] of getAllHandledReflectionObjects(root, '')){
        def[name] = createDefinition(obj, name, options, bufferList);
    }
    return def;
}
function createPackageDefinitionFromDescriptorSet(decodedDescriptorSet, options) {
    options = options || {};
    const root = Protobuf.Root.fromDescriptor(decodedDescriptorSet);
    root.resolveAll();
    return createPackageDefinition(root, options);
}
/**
 * Load a .proto file with the specified options.
 * @param filename One or multiple file paths to load. Can be an absolute path
 *     or relative to an include path.
 * @param options.keepCase Preserve field names. The default is to change them
 *     to camel case.
 * @param options.longs The type that should be used to represent `long` values.
 *     Valid options are `Number` and `String`. Defaults to a `Long` object type
 *     from a library.
 * @param options.enums The type that should be used to represent `enum` values.
 *     The only valid option is `String`. Defaults to the numeric value.
 * @param options.bytes The type that should be used to represent `bytes`
 *     values. Valid options are `Array` and `String`. The default is to use
 *     `Buffer`.
 * @param options.defaults Set default values on output objects. Defaults to
 *     `false`.
 * @param options.arrays Set empty arrays for missing array values even if
 *     `defaults` is `false`. Defaults to `false`.
 * @param options.objects Set empty objects for missing object values even if
 *     `defaults` is `false`. Defaults to `false`.
 * @param options.oneofs Set virtual oneof properties to the present field's
 *     name
 * @param options.json Represent Infinity and NaN as strings in float fields,
 *     and automatically decode google.protobuf.Any values.
 * @param options.includeDirs Paths to search for imported `.proto` files.
 */ function load(filename, options) {
    return (0, util_1.loadProtosWithOptions)(filename, options).then((loadedRoot)=>{
        return createPackageDefinition(loadedRoot, options);
    });
}
exports.load = load;
function loadSync(filename, options) {
    const loadedRoot = (0, util_1.loadProtosWithOptionsSync)(filename, options);
    return createPackageDefinition(loadedRoot, options);
}
exports.loadSync = loadSync;
function fromJSON(json, options) {
    options = options || {};
    const loadedRoot = Protobuf.Root.fromJSON(json);
    loadedRoot.resolveAll();
    return createPackageDefinition(loadedRoot, options);
}
exports.fromJSON = fromJSON;
function loadFileDescriptorSetFromBuffer(descriptorSet, options) {
    const decodedDescriptorSet = descriptor.FileDescriptorSet.decode(descriptorSet);
    return createPackageDefinitionFromDescriptorSet(decodedDescriptorSet, options);
}
exports.loadFileDescriptorSetFromBuffer = loadFileDescriptorSetFromBuffer;
function loadFileDescriptorSetFromObject(descriptorSet, options) {
    const decodedDescriptorSet = descriptor.FileDescriptorSet.fromObject(descriptorSet);
    return createPackageDefinitionFromDescriptorSet(decodedDescriptorSet, options);
}
exports.loadFileDescriptorSetFromObject = loadFileDescriptorSetFromObject;
(0, util_1.addCommonProtos)(); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/long/umd/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {

// GENERATED FILE. DO NOT EDIT.
(function(global, factory) {
    function preferDefault(exports1) {
        return exports1.default || exports1;
    }
    if (typeof define === "function" && define.amd) {
        ((r)=>r !== undefined && __turbopack_context__.v(r))(function() {
            var exports1 = {};
            factory(exports1);
            return preferDefault(exports1);
        }());
    } else if ("TURBOPACK compile-time truthy", 1) {
        factory(exports);
        if ("TURBOPACK compile-time truthy", 1) module.exports = preferDefault(exports);
    } else //TURBOPACK unreachable
    ;
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : /*TURBOPACK member replacement*/ __turbopack_context__.e, function(_exports) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.default = void 0;
    /**
     * @license
     * Copyright 2009 The Closure Library Authors
     * Copyright 2020 Daniel Wirtz / The long.js Authors.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * SPDX-License-Identifier: Apache-2.0
     */ // WebAssembly optimizations to do native i64 multiplication and divide
    var wasm = null;
    try {
        wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
            // \0asm
            0,
            97,
            115,
            109,
            // version 1
            1,
            0,
            0,
            0,
            // section "type"
            1,
            13,
            2,
            // 0, () => i32
            96,
            0,
            1,
            127,
            // 1, (i32, i32, i32, i32) => i32
            96,
            4,
            127,
            127,
            127,
            127,
            1,
            127,
            // section "function"
            3,
            7,
            6,
            // 0, type 0
            0,
            // 1, type 1
            1,
            // 2, type 1
            1,
            // 3, type 1
            1,
            // 4, type 1
            1,
            // 5, type 1
            1,
            // section "global"
            6,
            6,
            1,
            // 0, "high", mutable i32
            127,
            1,
            65,
            0,
            11,
            // section "export"
            7,
            50,
            6,
            // 0, "mul"
            3,
            109,
            117,
            108,
            0,
            1,
            // 1, "div_s"
            5,
            100,
            105,
            118,
            95,
            115,
            0,
            2,
            // 2, "div_u"
            5,
            100,
            105,
            118,
            95,
            117,
            0,
            3,
            // 3, "rem_s"
            5,
            114,
            101,
            109,
            95,
            115,
            0,
            4,
            // 4, "rem_u"
            5,
            114,
            101,
            109,
            95,
            117,
            0,
            5,
            // 5, "get_high"
            8,
            103,
            101,
            116,
            95,
            104,
            105,
            103,
            104,
            0,
            0,
            // section "code"
            10,
            191,
            1,
            6,
            // 0, "get_high"
            4,
            0,
            35,
            0,
            11,
            // 1, "mul"
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            126,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11,
            // 2, "div_s"
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            127,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11,
            // 3, "div_u"
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            128,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11,
            // 4, "rem_s"
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            129,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11,
            // 5, "rem_u"
            36,
            1,
            1,
            126,
            32,
            0,
            173,
            32,
            1,
            173,
            66,
            32,
            134,
            132,
            32,
            2,
            173,
            32,
            3,
            173,
            66,
            32,
            134,
            132,
            130,
            34,
            4,
            66,
            32,
            135,
            167,
            36,
            0,
            32,
            4,
            167,
            11
        ])), {}).exports;
    } catch  {
    // no wasm support :(
    }
    /**
     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
     *  See the from* functions below for more convenient ways of constructing Longs.
     * @exports Long
     * @class A Long class for representing a 64 bit two's-complement integer value.
     * @param {number} low The low (signed) 32 bits of the long
     * @param {number} high The high (signed) 32 bits of the long
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @constructor
     */ function Long(low, high, unsigned) {
        /**
       * The low 32 bits as a signed value.
       * @type {number}
       */ this.low = low | 0;
        /**
       * The high 32 bits as a signed value.
       * @type {number}
       */ this.high = high | 0;
        /**
       * Whether unsigned or not.
       * @type {boolean}
       */ this.unsigned = !!unsigned;
    }
    // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.
    /**
     * An indicator used to reliably determine if an object is a Long or not.
     * @type {boolean}
     * @const
     * @private
     */ Long.prototype.__isLong__;
    Object.defineProperty(Long.prototype, "__isLong__", {
        value: true
    });
    /**
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @inner
     */ function isLong(obj) {
        return (obj && obj["__isLong__"]) === true;
    }
    /**
     * @function
     * @param {*} value number
     * @returns {number}
     * @inner
     */ function ctz32(value) {
        var c = Math.clz32(value & -value);
        return value ? 31 - c : c;
    }
    /**
     * Tests if the specified object is a Long.
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     */ Long.isLong = isLong;
    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @inner
     */ var INT_CACHE = {};
    /**
     * A cache of the Long representations of small unsigned integer values.
     * @type {!Object}
     * @inner
     */ var UINT_CACHE = {};
    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */ function fromInt(value, unsigned) {
        var obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = 0 <= value && value < 256) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, 0, true);
            if (cache) UINT_CACHE[value] = obj;
            return obj;
        } else {
            value |= 0;
            if (cache = -128 <= value && value < 128) {
                cachedObj = INT_CACHE[value];
                if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false);
            if (cache) INT_CACHE[value] = obj;
            return obj;
        }
    }
    /**
     * Returns a Long representing the given 32 bit integer value.
     * @function
     * @param {number} value The 32 bit integer in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {!Long} The corresponding Long value
     */ Long.fromInt = fromInt;
    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */ function fromNumber(value, unsigned) {
        if (isNaN(value)) return unsigned ? UZERO : ZERO;
        if (unsigned) {
            if (value < 0) return UZERO;
            if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
        } else {
            if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
        }
        if (value < 0) return fromNumber(-value, unsigned).neg();
        return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }
    /**
     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @function
     * @param {number} value The number in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {!Long} The corresponding Long value
     */ Long.fromNumber = fromNumber;
    /**
     * @param {number} lowBits
     * @param {number} highBits
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */ function fromBits(lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    }
    /**
     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @function
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {!Long} The corresponding Long value
     */ Long.fromBits = fromBits;
    /**
     * @function
     * @param {number} base
     * @param {number} exponent
     * @returns {number}
     * @inner
     */ var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)
    /**
     * @param {string} str
     * @param {(boolean|number)=} unsigned
     * @param {number=} radix
     * @returns {!Long}
     * @inner
     */ function fromString(str, unsigned, radix) {
        if (str.length === 0) throw Error("empty string");
        if (typeof unsigned === "number") {
            // For goog.math.long compatibility
            radix = unsigned;
            unsigned = false;
        } else {
            unsigned = !!unsigned;
        }
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return unsigned ? UZERO : ZERO;
        radix = radix || 10;
        if (radix < 2 || 36 < radix) throw RangeError("radix");
        var p;
        if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
        else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg();
        }
        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 8));
        var result = ZERO;
        for(var i = 0; i < str.length; i += 8){
            var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
            } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    }
    /**
     * Returns a Long representation of the given string, written using the specified radix.
     * @function
     * @param {string} str The textual representation of the Long
     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @returns {!Long} The corresponding Long value
     */ Long.fromString = fromString;
    /**
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */ function fromValue(val, unsigned) {
        if (typeof val === "number") return fromNumber(val, unsigned);
        if (typeof val === "string") return fromString(val, unsigned);
        // Throws for non-objects, converts non-instanceof Long:
        return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
    }
    /**
     * Converts the specified value to a Long using the appropriate from* function for its type.
     * @function
     * @param {!Long|number|bigint|string|!{low: number, high: number, unsigned: boolean}} val Value
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {!Long}
     */ Long.fromValue = fromValue;
    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.
    /**
     * @type {number}
     * @const
     * @inner
     */ var TWO_PWR_16_DBL = 1 << 16;
    /**
     * @type {number}
     * @const
     * @inner
     */ var TWO_PWR_24_DBL = 1 << 24;
    /**
     * @type {number}
     * @const
     * @inner
     */ var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
    /**
     * @type {number}
     * @const
     * @inner
     */ var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
    /**
     * @type {number}
     * @const
     * @inner
     */ var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
    /**
     * @type {!Long}
     * @const
     * @inner
     */ var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
    /**
     * @type {!Long}
     * @inner
     */ var ZERO = fromInt(0);
    /**
     * Signed zero.
     * @type {!Long}
     */ Long.ZERO = ZERO;
    /**
     * @type {!Long}
     * @inner
     */ var UZERO = fromInt(0, true);
    /**
     * Unsigned zero.
     * @type {!Long}
     */ Long.UZERO = UZERO;
    /**
     * @type {!Long}
     * @inner
     */ var ONE = fromInt(1);
    /**
     * Signed one.
     * @type {!Long}
     */ Long.ONE = ONE;
    /**
     * @type {!Long}
     * @inner
     */ var UONE = fromInt(1, true);
    /**
     * Unsigned one.
     * @type {!Long}
     */ Long.UONE = UONE;
    /**
     * @type {!Long}
     * @inner
     */ var NEG_ONE = fromInt(-1);
    /**
     * Signed negative one.
     * @type {!Long}
     */ Long.NEG_ONE = NEG_ONE;
    /**
     * @type {!Long}
     * @inner
     */ var MAX_VALUE = fromBits(0xffffffff | 0, 0x7fffffff | 0, false);
    /**
     * Maximum signed value.
     * @type {!Long}
     */ Long.MAX_VALUE = MAX_VALUE;
    /**
     * @type {!Long}
     * @inner
     */ var MAX_UNSIGNED_VALUE = fromBits(0xffffffff | 0, 0xffffffff | 0, true);
    /**
     * Maximum unsigned value.
     * @type {!Long}
     */ Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
    /**
     * @type {!Long}
     * @inner
     */ var MIN_VALUE = fromBits(0, 0x80000000 | 0, false);
    /**
     * Minimum signed value.
     * @type {!Long}
     */ Long.MIN_VALUE = MIN_VALUE;
    /**
     * @alias Long.prototype
     * @inner
     */ var LongPrototype = Long.prototype;
    /**
     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
     * @this {!Long}
     * @returns {number}
     */ LongPrototype.toInt = function toInt() {
        return this.unsigned ? this.low >>> 0 : this.low;
    };
    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @this {!Long}
     * @returns {number}
     */ LongPrototype.toNumber = function toNumber() {
        if (this.unsigned) return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };
    /**
     * Converts the Long to a string written in the specified radix.
     * @this {!Long}
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     */ LongPrototype.toString = function toString(radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix) throw RangeError("radix");
        if (this.isZero()) return "0";
        if (this.isNegative()) {
            // Unsigned Longs are never negative
            if (this.eq(MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            } else return "-" + this.neg().toString(radix);
        }
        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
        var result = "";
        while(true){
            var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) return digits + result;
            else {
                while(digits.length < 6)digits = "0" + digits;
                result = "" + digits + result;
            }
        }
    };
    /**
     * Gets the high 32 bits as a signed integer.
     * @this {!Long}
     * @returns {number} Signed high bits
     */ LongPrototype.getHighBits = function getHighBits() {
        return this.high;
    };
    /**
     * Gets the high 32 bits as an unsigned integer.
     * @this {!Long}
     * @returns {number} Unsigned high bits
     */ LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
        return this.high >>> 0;
    };
    /**
     * Gets the low 32 bits as a signed integer.
     * @this {!Long}
     * @returns {number} Signed low bits
     */ LongPrototype.getLowBits = function getLowBits() {
        return this.low;
    };
    /**
     * Gets the low 32 bits as an unsigned integer.
     * @this {!Long}
     * @returns {number} Unsigned low bits
     */ LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
        return this.low >>> 0;
    };
    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     * @this {!Long}
     * @returns {number}
     */ LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
        if (this.isNegative()) // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for(var bit = 31; bit > 0; bit--)if ((val & 1 << bit) != 0) break;
        return this.high != 0 ? bit + 33 : bit + 1;
    };
    /**
     * Tests if this Long can be safely represented as a JavaScript number.
     * @this {!Long}
     * @returns {boolean}
     */ LongPrototype.isSafeInteger = function isSafeInteger() {
        // 2^53-1 is the maximum safe value
        var top11Bits = this.high >> 21;
        // [0, 2^53-1]
        if (!top11Bits) return true;
        // > 2^53-1
        if (this.unsigned) return false;
        // [-2^53, -1] except -2^53
        return top11Bits === -1 && !(this.low === 0 && this.high === -0x200000);
    };
    /**
     * Tests if this Long's value equals zero.
     * @this {!Long}
     * @returns {boolean}
     */ LongPrototype.isZero = function isZero() {
        return this.high === 0 && this.low === 0;
    };
    /**
     * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
     * @returns {boolean}
     */ LongPrototype.eqz = LongPrototype.isZero;
    /**
     * Tests if this Long's value is negative.
     * @this {!Long}
     * @returns {boolean}
     */ LongPrototype.isNegative = function isNegative() {
        return !this.unsigned && this.high < 0;
    };
    /**
     * Tests if this Long's value is positive or zero.
     * @this {!Long}
     * @returns {boolean}
     */ LongPrototype.isPositive = function isPositive() {
        return this.unsigned || this.high >= 0;
    };
    /**
     * Tests if this Long's value is odd.
     * @this {!Long}
     * @returns {boolean}
     */ LongPrototype.isOdd = function isOdd() {
        return (this.low & 1) === 1;
    };
    /**
     * Tests if this Long's value is even.
     * @this {!Long}
     * @returns {boolean}
     */ LongPrototype.isEven = function isEven() {
        return (this.low & 1) === 0;
    };
    /**
     * Tests if this Long's value equals the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.equals = function equals(other) {
        if (!isLong(other)) other = fromValue(other);
        if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1) return false;
        return this.high === other.high && this.low === other.low;
    };
    /**
     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.eq = LongPrototype.equals;
    /**
     * Tests if this Long's value differs from the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.notEquals = function notEquals(other) {
        return !this.eq(/* validates */ other);
    };
    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.neq = LongPrototype.notEquals;
    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.ne = LongPrototype.notEquals;
    /**
     * Tests if this Long's value is less than the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.lessThan = function lessThan(other) {
        return this.comp(/* validates */ other) < 0;
    };
    /**
     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.lt = LongPrototype.lessThan;
    /**
     * Tests if this Long's value is less than or equal the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
        return this.comp(/* validates */ other) <= 0;
    };
    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.lte = LongPrototype.lessThanOrEqual;
    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.le = LongPrototype.lessThanOrEqual;
    /**
     * Tests if this Long's value is greater than the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.greaterThan = function greaterThan(other) {
        return this.comp(/* validates */ other) > 0;
    };
    /**
     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.gt = LongPrototype.greaterThan;
    /**
     * Tests if this Long's value is greater than or equal the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
        return this.comp(/* validates */ other) >= 0;
    };
    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.gte = LongPrototype.greaterThanOrEqual;
    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */ LongPrototype.ge = LongPrototype.greaterThanOrEqual;
    /**
     * Compares this Long's value with the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */ LongPrototype.compare = function compare(other) {
        if (!isLong(other)) other = fromValue(other);
        if (this.eq(other)) return 0;
        var thisNeg = this.isNegative(), otherNeg = other.isNegative();
        if (thisNeg && !otherNeg) return -1;
        if (!thisNeg && otherNeg) return 1;
        // At this point the sign bits are the same
        if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
        // Both are positive if at least one is unsigned
        return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    };
    /**
     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */ LongPrototype.comp = LongPrototype.compare;
    /**
     * Negates this Long's value.
     * @this {!Long}
     * @returns {!Long} Negated Long
     */ LongPrototype.negate = function negate() {
        if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
        return this.not().add(ONE);
    };
    /**
     * Negates this Long's value. This is an alias of {@link Long#negate}.
     * @function
     * @returns {!Long} Negated Long
     */ LongPrototype.neg = LongPrototype.negate;
    /**
     * Returns the sum of this and the specified Long.
     * @this {!Long}
     * @param {!Long|number|bigint|string} addend Addend
     * @returns {!Long} Sum
     */ LongPrototype.add = function add(addend) {
        if (!isLong(addend)) addend = fromValue(addend);
        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xffff;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xffff;
        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xffff;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xffff;
        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xffff;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c48 += a48 + b48;
        c48 &= 0xffff;
        return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    /**
     * Returns the difference of this and the specified Long.
     * @this {!Long}
     * @param {!Long|number|bigint|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */ LongPrototype.subtract = function subtract(subtrahend) {
        if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };
    /**
     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
     * @function
     * @param {!Long|number|bigint|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */ LongPrototype.sub = LongPrototype.subtract;
    /**
     * Returns the product of this and the specified Long.
     * @this {!Long}
     * @param {!Long|number|bigint|string} multiplier Multiplier
     * @returns {!Long} Product
     */ LongPrototype.multiply = function multiply(multiplier) {
        if (this.isZero()) return this;
        if (!isLong(multiplier)) multiplier = fromValue(multiplier);
        // use wasm support if present
        if (wasm) {
            var low = wasm["mul"](this.low, this.high, multiplier.low, multiplier.high);
            return fromBits(low, wasm["get_high"](), this.unsigned);
        }
        if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
        if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
        if (this.isNegative()) {
            if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
            else return this.neg().mul(multiplier).neg();
        } else if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();
        // If both longs are small, use float multiplication
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xffff;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xffff;
        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xffff;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xffff;
        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xffff;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xffff;
        return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    /**
     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
     * @function
     * @param {!Long|number|bigint|string} multiplier Multiplier
     * @returns {!Long} Product
     */ LongPrototype.mul = LongPrototype.multiply;
    /**
     * Returns this Long divided by the specified. The result is signed if this Long is signed or
     *  unsigned if this Long is unsigned.
     * @this {!Long}
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Quotient
     */ LongPrototype.divide = function divide(divisor) {
        if (!isLong(divisor)) divisor = fromValue(divisor);
        if (divisor.isZero()) throw Error("division by zero");
        // use wasm support if present
        if (wasm) {
            // guard against signed division overflow: the largest
            // negative number / -1 would be 1 larger than the largest
            // positive number, due to two's complement.
            if (!this.unsigned && this.high === -0x80000000 && divisor.low === -1 && divisor.high === -1) {
                // be consistent with non-wasm code path
                return this;
            }
            var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(this.low, this.high, divisor.low, divisor.high);
            return fromBits(low, wasm["get_high"](), this.unsigned);
        }
        if (this.isZero()) return this.unsigned ? UZERO : ZERO;
        var approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE)) return ONE;
                else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1);
                    approx = halfThis.div(divisor).shl(1);
                    if (approx.eq(ZERO)) {
                        return divisor.isNegative() ? ONE : NEG_ONE;
                    } else {
                        rem = this.sub(divisor.mul(approx));
                        res = approx.add(rem.div(divisor));
                        return res;
                    }
                }
            } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative()) return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
            res = ZERO;
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned) divisor = divisor.toUnsigned();
            if (divisor.gt(this)) return UZERO;
            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
            res = UZERO;
        }
        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while(rem.gte(divisor)){
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
            while(approxRem.isNegative() || approxRem.gt(rem)){
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }
            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero()) approxRes = ONE;
            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };
    /**
     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
     * @function
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Quotient
     */ LongPrototype.div = LongPrototype.divide;
    /**
     * Returns this Long modulo the specified.
     * @this {!Long}
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Remainder
     */ LongPrototype.modulo = function modulo(divisor) {
        if (!isLong(divisor)) divisor = fromValue(divisor);
        // use wasm support if present
        if (wasm) {
            var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(this.low, this.high, divisor.low, divisor.high);
            return fromBits(low, wasm["get_high"](), this.unsigned);
        }
        return this.sub(this.div(divisor).mul(divisor));
    };
    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Remainder
     */ LongPrototype.mod = LongPrototype.modulo;
    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Remainder
     */ LongPrototype.rem = LongPrototype.modulo;
    /**
     * Returns the bitwise NOT of this Long.
     * @this {!Long}
     * @returns {!Long}
     */ LongPrototype.not = function not() {
        return fromBits(~this.low, ~this.high, this.unsigned);
    };
    /**
     * Returns count leading zeros of this Long.
     * @this {!Long}
     * @returns {!number}
     */ LongPrototype.countLeadingZeros = function countLeadingZeros() {
        return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
    };
    /**
     * Returns count leading zeros. This is an alias of {@link Long#countLeadingZeros}.
     * @function
     * @param {!Long}
     * @returns {!number}
     */ LongPrototype.clz = LongPrototype.countLeadingZeros;
    /**
     * Returns count trailing zeros of this Long.
     * @this {!Long}
     * @returns {!number}
     */ LongPrototype.countTrailingZeros = function countTrailingZeros() {
        return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
    };
    /**
     * Returns count trailing zeros. This is an alias of {@link Long#countTrailingZeros}.
     * @function
     * @param {!Long}
     * @returns {!number}
     */ LongPrototype.ctz = LongPrototype.countTrailingZeros;
    /**
     * Returns the bitwise AND of this Long and the specified.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other Long
     * @returns {!Long}
     */ LongPrototype.and = function and(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };
    /**
     * Returns the bitwise OR of this Long and the specified.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other Long
     * @returns {!Long}
     */ LongPrototype.or = function or(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };
    /**
     * Returns the bitwise XOR of this Long and the given one.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other Long
     * @returns {!Long}
     */ LongPrototype.xor = function xor(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };
    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */ LongPrototype.shiftLeft = function shiftLeft(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        else if (numBits < 32) return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
        else return fromBits(0, this.low << numBits - 32, this.unsigned);
    };
    /**
     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */ LongPrototype.shl = LongPrototype.shiftLeft;
    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */ LongPrototype.shiftRight = function shiftRight(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        else if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
        else return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    };
    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */ LongPrototype.shr = LongPrototype.shiftRight;
    /**
     * Returns this Long with bits logically shifted to the right by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */ LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
        if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
        return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
    };
    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */ LongPrototype.shru = LongPrototype.shiftRightUnsigned;
    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */ LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
    /**
     * Returns this Long with bits rotated to the left by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Rotated Long
     */ LongPrototype.rotateLeft = function rotateLeft(numBits) {
        var b;
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
        if (numBits < 32) {
            b = 32 - numBits;
            return fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned);
        }
        numBits -= 32;
        b = 32 - numBits;
        return fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned);
    };
    /**
     * Returns this Long with bits rotated to the left by the given amount. This is an alias of {@link Long#rotateLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Rotated Long
     */ LongPrototype.rotl = LongPrototype.rotateLeft;
    /**
     * Returns this Long with bits rotated to the right by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Rotated Long
     */ LongPrototype.rotateRight = function rotateRight(numBits) {
        var b;
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;
        if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
        if (numBits < 32) {
            b = 32 - numBits;
            return fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned);
        }
        numBits -= 32;
        b = 32 - numBits;
        return fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned);
    };
    /**
     * Returns this Long with bits rotated to the right by the given amount. This is an alias of {@link Long#rotateRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Rotated Long
     */ LongPrototype.rotr = LongPrototype.rotateRight;
    /**
     * Converts this Long to signed.
     * @this {!Long}
     * @returns {!Long} Signed long
     */ LongPrototype.toSigned = function toSigned() {
        if (!this.unsigned) return this;
        return fromBits(this.low, this.high, false);
    };
    /**
     * Converts this Long to unsigned.
     * @this {!Long}
     * @returns {!Long} Unsigned long
     */ LongPrototype.toUnsigned = function toUnsigned() {
        if (this.unsigned) return this;
        return fromBits(this.low, this.high, true);
    };
    /**
     * Converts this Long to its byte representation.
     * @param {boolean=} le Whether little or big endian, defaults to big endian
     * @this {!Long}
     * @returns {!Array.<number>} Byte representation
     */ LongPrototype.toBytes = function toBytes(le) {
        return le ? this.toBytesLE() : this.toBytesBE();
    };
    /**
     * Converts this Long to its little endian byte representation.
     * @this {!Long}
     * @returns {!Array.<number>} Little endian byte representation
     */ LongPrototype.toBytesLE = function toBytesLE() {
        var hi = this.high, lo = this.low;
        return [
            lo & 0xff,
            lo >>> 8 & 0xff,
            lo >>> 16 & 0xff,
            lo >>> 24,
            hi & 0xff,
            hi >>> 8 & 0xff,
            hi >>> 16 & 0xff,
            hi >>> 24
        ];
    };
    /**
     * Converts this Long to its big endian byte representation.
     * @this {!Long}
     * @returns {!Array.<number>} Big endian byte representation
     */ LongPrototype.toBytesBE = function toBytesBE() {
        var hi = this.high, lo = this.low;
        return [
            hi >>> 24,
            hi >>> 16 & 0xff,
            hi >>> 8 & 0xff,
            hi & 0xff,
            lo >>> 24,
            lo >>> 16 & 0xff,
            lo >>> 8 & 0xff,
            lo & 0xff
        ];
    };
    /**
     * Creates a Long from its byte representation.
     * @param {!Array.<number>} bytes Byte representation
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @param {boolean=} le Whether little or big endian, defaults to big endian
     * @returns {Long} The corresponding Long value
     */ Long.fromBytes = function fromBytes(bytes, unsigned, le) {
        return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
    };
    /**
     * Creates a Long from its little endian byte representation.
     * @param {!Array.<number>} bytes Little endian byte representation
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {Long} The corresponding Long value
     */ Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
        return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
    };
    /**
     * Creates a Long from its big endian byte representation.
     * @param {!Array.<number>} bytes Big endian byte representation
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {Long} The corresponding Long value
     */ Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
        return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
    };
    // Support conversion to/from BigInt where available
    if (typeof BigInt === "function") {
        /**
       * Returns a Long representing the given big integer.
       * @function
       * @param {number} value The big integer value
       * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
       * @returns {!Long} The corresponding Long value
       */ Long.fromBigInt = function fromBigInt(value, unsigned) {
            var lowBits = Number(BigInt.asIntN(32, value));
            var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
            return fromBits(lowBits, highBits, unsigned);
        };
        // Override
        Long.fromValue = function fromValueWithBigInt(value, unsigned) {
            if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
            return fromValue(value, unsigned);
        };
        /**
       * Converts the Long to its big integer representation.
       * @this {!Long}
       * @returns {bigint}
       */ LongPrototype.toBigInt = function toBigInt() {
            var lowBigInt = BigInt(this.low >>> 0);
            var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
            return highBigInt << BigInt(32) | lowBigInt;
        };
    }
    var _default = _exports.default = Long;
});
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-grpc/build/src/OTLPLogExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPLogExporter = void 0;
const otlp_grpc_exporter_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/index.js [instrumentation] (ecmascript)");
const otlp_transformer_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/index.js [instrumentation] (ecmascript)");
const otlp_exporter_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index.js [instrumentation] (ecmascript)");
/**
 * OTLP Logs Exporter for Node
 */ class OTLPLogExporter extends otlp_exporter_base_1.OTLPExporterBase {
    constructor(config = {}){
        super((0, otlp_grpc_exporter_base_1.createOtlpGrpcExportDelegate)((0, otlp_grpc_exporter_base_1.convertLegacyOtlpGrpcOptions)(config, 'LOGS'), otlp_transformer_1.ProtobufLogsSerializer, 'LogsExportService', '/opentelemetry.proto.collector.logs.v1.LogsService/Export'));
    }
}
exports.OTLPLogExporter = OTLPLogExporter; //# sourceMappingURL=OTLPLogExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-grpc/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPLogExporter = void 0;
var OTLPLogExporter_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-grpc/build/src/OTLPLogExporter.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "OTLPLogExporter", {
    enumerable: true,
    get: function() {
        return OTLPLogExporter_1.OTLPLogExporter;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-proto/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-proto/build/esm/platform/node/OTLPLogExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "OTLPLogExporter",
    ()=>OTLPLogExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$logs$2f$protobuf$2f$logs$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/logs/protobuf/logs.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-node-http-options.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-http-export-delegate.js [instrumentation] (ecmascript)");
;
;
;
class OTLPLogExporter extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterBase"] {
    constructor(config = {}){
        super((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpHttpExportDelegate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["convertLegacyHttpOptions"])(config, 'LOGS', 'v1/logs', {
            'Content-Type': 'application/x-protobuf'
        }), __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$logs$2f$protobuf$2f$logs$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ProtobufLogsSerializer"]));
    }
} //# sourceMappingURL=OTLPLogExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-proto/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OTLPLogExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$logs$2d$otlp$2d$proto$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPLogExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPLogExporter"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$logs$2d$otlp$2d$proto$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-proto/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$logs$2d$otlp$2d$proto$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPLogExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-proto/build/esm/platform/node/OTLPLogExporter.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-prometheus/build/src/PrometheusSerializer.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PrometheusSerializer = void 0;
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const sdk_metrics_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/index.js [instrumentation] (ecmascript)");
const core_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
const semantic_conventions_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [instrumentation] (ecmascript)");
// This is currently listed as experimental.
const ATTR_OTEL_SCOPE_SCHEMA_URL = 'otel.scope.schema_url';
function escapeString(str) {
    return str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
}
/**
 * String Attribute values are converted directly to Prometheus attribute values.
 * Non-string values are represented as JSON-encoded strings.
 *
 * `undefined` is converted to an empty string.
 */ function escapeAttributeValue(str = '') {
    if (typeof str !== 'string') {
        str = JSON.stringify(str);
    }
    return escapeString(str).replace(/"/g, '\\"');
}
const invalidCharacterRegex = /[^a-z0-9_]/gi;
const multipleUnderscoreRegex = /_{2,}/g;
/**
 * Ensures metric names are valid Prometheus metric names by removing
 * characters allowed by OpenTelemetry but disallowed by Prometheus.
 *
 * https://prometheus.io/docs/concepts/data_model/#metric-names-and-attributes
 *
 * 1. Names must match `[a-zA-Z_:][a-zA-Z0-9_:]*`
 *
 * 2. Colons are reserved for user defined recording rules.
 * They should not be used by exporters or direct instrumentation.
 *
 * OpenTelemetry metric names are already validated in the Meter when they are created,
 * and they match the format `[a-zA-Z][a-zA-Z0-9_.\-]*` which is very close to a valid
 * prometheus metric name, so we only need to strip characters valid in OpenTelemetry
 * but not valid in prometheus and replace them with '_'.
 *
 * @param name name to be sanitized
 */ function sanitizePrometheusMetricName(name) {
    // replace all invalid characters with '_'
    return name.replace(invalidCharacterRegex, '_').replace(multipleUnderscoreRegex, '_');
}
/**
 * @private
 *
 * Helper method which assists in enforcing the naming conventions for metric
 * names in Prometheus
 * @param name the name of the metric
 * @param type the kind of metric
 * @returns string
 */ function enforcePrometheusNamingConvention(name, data) {
    // Prometheus requires that metrics of the Counter kind have "_total" suffix
    if (!name.endsWith('_total') && data.dataPointType === sdk_metrics_1.DataPointType.SUM && data.isMonotonic) {
        name = name + '_total';
    }
    return name;
}
function valueString(value) {
    if (value === Infinity) {
        return '+Inf';
    } else if (value === -Infinity) {
        return '-Inf';
    } else {
        // Handle finite numbers and NaN.
        return `${value}`;
    }
}
function toPrometheusType(metricData) {
    switch(metricData.dataPointType){
        case sdk_metrics_1.DataPointType.SUM:
            if (metricData.isMonotonic) {
                return 'counter';
            }
            return 'gauge';
        case sdk_metrics_1.DataPointType.GAUGE:
            return 'gauge';
        case sdk_metrics_1.DataPointType.HISTOGRAM:
            return 'histogram';
        default:
            return 'untyped';
    }
}
function stringify(metricName, attributes, value, timestamp, additionalAttributes) {
    let hasAttribute = false;
    let attributesStr = '';
    for (const [key, val] of Object.entries(attributes)){
        const sanitizedAttributeName = sanitizePrometheusMetricName(key);
        hasAttribute = true;
        attributesStr += `${attributesStr.length > 0 ? ',' : ''}${sanitizedAttributeName}="${escapeAttributeValue(val)}"`;
    }
    if (additionalAttributes) {
        for (const [key, val] of Object.entries(additionalAttributes)){
            const sanitizedAttributeName = sanitizePrometheusMetricName(key);
            hasAttribute = true;
            attributesStr += `${attributesStr.length > 0 ? ',' : ''}${sanitizedAttributeName}="${escapeAttributeValue(val)}"`;
        }
    }
    if (hasAttribute) {
        metricName += `{${attributesStr}}`;
    }
    return `${metricName} ${valueString(value)}${timestamp !== undefined ? ' ' + String(timestamp) : ''}\n`;
}
const NO_REGISTERED_METRICS = '# no registered metrics';
class PrometheusSerializer {
    _prefix;
    _appendTimestamp;
    _additionalAttributes;
    _withResourceConstantLabels;
    _withoutScopeInfo;
    _withoutTargetInfo;
    constructor(prefix, appendTimestamp = false, withResourceConstantLabels, withoutTargetInfo, withoutScopeInfo){
        if (prefix) {
            this._prefix = prefix + '_';
        }
        this._appendTimestamp = appendTimestamp;
        this._withResourceConstantLabels = withResourceConstantLabels;
        this._withoutScopeInfo = !!withoutScopeInfo;
        this._withoutTargetInfo = !!withoutTargetInfo;
    }
    serialize(resourceMetrics) {
        let str = '';
        this._additionalAttributes = this._filterResourceConstantLabels(resourceMetrics.resource.attributes, this._withResourceConstantLabels);
        for (const scopeMetrics of resourceMetrics.scopeMetrics){
            str += this._serializeScopeMetrics(scopeMetrics);
        }
        if (str === '') {
            str += NO_REGISTERED_METRICS;
        }
        return this._serializeResource(resourceMetrics.resource) + str;
    }
    _filterResourceConstantLabels(attributes, pattern) {
        if (pattern) {
            const filteredAttributes = {};
            for (const [key, value] of Object.entries(attributes)){
                if (key.match(pattern)) {
                    filteredAttributes[key] = value;
                }
            }
            return filteredAttributes;
        }
        return;
    }
    _serializeScopeMetrics(scopeMetrics) {
        let str = '';
        for (const metric of scopeMetrics.metrics){
            str += this._serializeMetricData(metric, scopeMetrics.scope) + '\n';
        }
        return str;
    }
    _serializeMetricData(metricData, scope) {
        let name = sanitizePrometheusMetricName(escapeString(metricData.descriptor.name));
        if (this._prefix) {
            name = `${this._prefix}${name}`;
        }
        const dataPointType = metricData.dataPointType;
        name = enforcePrometheusNamingConvention(name, metricData);
        const help = `# HELP ${name} ${escapeString(metricData.descriptor.description || 'description missing')}`;
        const unit = metricData.descriptor.unit ? `\n# UNIT ${name} ${escapeString(metricData.descriptor.unit)}` : '';
        const type = `# TYPE ${name} ${toPrometheusType(metricData)}`;
        let additionalAttributes;
        if (this._withoutScopeInfo) {
            additionalAttributes = this._additionalAttributes;
        } else {
            const scopeInfo = {
                [semantic_conventions_1.ATTR_OTEL_SCOPE_NAME]: scope.name
            };
            if (scope.schemaUrl) {
                scopeInfo[ATTR_OTEL_SCOPE_SCHEMA_URL] = scope.schemaUrl;
            }
            if (scope.version) {
                scopeInfo[semantic_conventions_1.ATTR_OTEL_SCOPE_VERSION] = scope.version;
            }
            additionalAttributes = Object.assign(scopeInfo, this._additionalAttributes);
        }
        let results = '';
        switch(dataPointType){
            case sdk_metrics_1.DataPointType.SUM:
            case sdk_metrics_1.DataPointType.GAUGE:
                {
                    results = metricData.dataPoints.map((it)=>this._serializeSingularDataPoint(name, metricData, it, additionalAttributes)).join('');
                    break;
                }
            case sdk_metrics_1.DataPointType.HISTOGRAM:
                {
                    results = metricData.dataPoints.map((it)=>this._serializeHistogramDataPoint(name, metricData, it, additionalAttributes)).join('');
                    break;
                }
            default:
                {
                    api_1.diag.error(`Unrecognizable DataPointType: ${dataPointType} for metric "${name}"`);
                }
        }
        return `${help}${unit}\n${type}\n${results}`.trim();
    }
    _serializeSingularDataPoint(name, data, dataPoint, additionalAttributes) {
        let results = '';
        name = enforcePrometheusNamingConvention(name, data);
        const { value, attributes } = dataPoint;
        const timestamp = (0, core_1.hrTimeToMilliseconds)(dataPoint.endTime);
        results += stringify(name, attributes, value, this._appendTimestamp ? timestamp : undefined, additionalAttributes);
        return results;
    }
    _serializeHistogramDataPoint(name, data, dataPoint, additionalAttributes) {
        let results = '';
        name = enforcePrometheusNamingConvention(name, data);
        const attributes = dataPoint.attributes;
        const histogram = dataPoint.value;
        const timestamp = (0, core_1.hrTimeToMilliseconds)(dataPoint.endTime);
        /** Histogram["bucket"] is not typed with `number` */ for (const key of [
            'count',
            'sum'
        ]){
            const value = histogram[key];
            if (value != null) results += stringify(name + '_' + key, attributes, value, this._appendTimestamp ? timestamp : undefined, additionalAttributes);
        }
        let cumulativeSum = 0;
        const countEntries = histogram.buckets.counts.entries();
        let infiniteBoundaryDefined = false;
        for (const [idx, val] of countEntries){
            cumulativeSum += val;
            const upperBound = histogram.buckets.boundaries[idx];
            /** HistogramAggregator is producing different boundary output -
             * in one case not including infinity values, in other -
             * full, e.g. [0, 100] and [0, 100, Infinity]
             * we should consider that in export, if Infinity is defined, use it
             * as boundary
             */ if (upperBound === undefined && infiniteBoundaryDefined) {
                break;
            }
            if (upperBound === Infinity) {
                infiniteBoundaryDefined = true;
            }
            results += stringify(name + '_bucket', attributes, cumulativeSum, this._appendTimestamp ? timestamp : undefined, Object.assign({}, additionalAttributes, {
                le: upperBound === undefined || upperBound === Infinity ? '+Inf' : String(upperBound)
            }));
        }
        return results;
    }
    _serializeResource(resource) {
        if (this._withoutTargetInfo === true) {
            return '';
        }
        const name = 'target_info';
        const help = `# HELP ${name} Target metadata`;
        const type = `# TYPE ${name} gauge`;
        const results = stringify(name, resource.attributes, 1).trim();
        return `${help}\n${type}\n${results}\n`;
    }
}
exports.PrometheusSerializer = PrometheusSerializer; //# sourceMappingURL=PrometheusSerializer.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-prometheus/build/src/PrometheusExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PrometheusExporter = void 0;
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const core_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
const sdk_metrics_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/index.js [instrumentation] (ecmascript)");
const http_1 = __turbopack_context__.r("[externals]/http [external] (http, cjs)");
const PrometheusSerializer_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-prometheus/build/src/PrometheusSerializer.js [instrumentation] (ecmascript)");
/** Node.js v8.x compat */ const url_1 = __turbopack_context__.r("[externals]/url [external] (url, cjs)");
class PrometheusExporter extends sdk_metrics_1.MetricReader {
    static DEFAULT_OPTIONS = {
        host: undefined,
        port: 9464,
        endpoint: '/metrics',
        prefix: '',
        appendTimestamp: false,
        withResourceConstantLabels: undefined,
        withoutScopeInfo: false,
        withoutTargetInfo: false
    };
    _host;
    _port;
    _baseUrl;
    _endpoint;
    _server;
    _prefix;
    _appendTimestamp;
    _serializer;
    _startServerPromise;
    // This will be required when histogram is implemented. Leaving here so it is not forgotten
    // Histogram cannot have a attribute named 'le'
    // private static readonly RESERVED_HISTOGRAM_LABEL = 'le';
    /**
     * Constructor
     * @param config Exporter configuration
     * @param callback Callback to be called after a server was started
     */ constructor(config = {}, callback = ()=>{}){
        super({
            aggregationSelector: (_instrumentType)=>{
                return {
                    type: sdk_metrics_1.AggregationType.DEFAULT
                };
            },
            aggregationTemporalitySelector: (_instrumentType)=>sdk_metrics_1.AggregationTemporality.CUMULATIVE,
            metricProducers: config.metricProducers
        });
        this._host = config.host || process.env.OTEL_EXPORTER_PROMETHEUS_HOST || PrometheusExporter.DEFAULT_OPTIONS.host;
        this._port = config.port || Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) || PrometheusExporter.DEFAULT_OPTIONS.port;
        this._prefix = config.prefix || PrometheusExporter.DEFAULT_OPTIONS.prefix;
        this._appendTimestamp = typeof config.appendTimestamp === 'boolean' ? config.appendTimestamp : PrometheusExporter.DEFAULT_OPTIONS.appendTimestamp;
        const _withResourceConstantLabels = config.withResourceConstantLabels || PrometheusExporter.DEFAULT_OPTIONS.withResourceConstantLabels;
        const _withoutScopeInfo = config.withoutScopeInfo || PrometheusExporter.DEFAULT_OPTIONS.withoutScopeInfo;
        const _withoutTargetInfo = config.withoutTargetInfo || PrometheusExporter.DEFAULT_OPTIONS.withoutTargetInfo;
        // unref to prevent prometheus exporter from holding the process open on exit
        this._server = (0, http_1.createServer)(this._requestHandler).unref();
        this._serializer = new PrometheusSerializer_1.PrometheusSerializer(this._prefix, this._appendTimestamp, _withResourceConstantLabels, _withoutTargetInfo, _withoutScopeInfo);
        this._baseUrl = `http://${this._host}:${this._port}/`;
        this._endpoint = (config.endpoint || PrometheusExporter.DEFAULT_OPTIONS.endpoint).replace(/^([^/])/, '/$1');
        if (config.preventServerStart !== true) {
            this.startServer().then(callback, (err)=>{
                api_1.diag.error(err);
                callback(err);
            });
        } else if (callback) {
            // Do not invoke callback immediately to avoid zalgo problem.
            queueMicrotask(callback);
        }
    }
    async onForceFlush() {
    /** do nothing */ }
    /**
     * Shuts down the export server and clears the registry
     */ onShutdown() {
        return this.stopServer();
    }
    /**
     * Stops the Prometheus export server
     */ stopServer() {
        if (!this._server) {
            api_1.diag.debug('Prometheus stopServer() was called but server was never started.');
            return Promise.resolve();
        } else {
            return new Promise((resolve)=>{
                this._server.close((err)=>{
                    if (!err) {
                        api_1.diag.debug('Prometheus exporter was stopped');
                    } else {
                        if (err.code !== 'ERR_SERVER_NOT_RUNNING') {
                            (0, core_1.globalErrorHandler)(err);
                        }
                    }
                    resolve();
                });
            });
        }
    }
    /**
     * Starts the Prometheus export server
     */ startServer() {
        this._startServerPromise ??= new Promise((resolve, reject)=>{
            this._server.once('error', reject);
            this._server.listen({
                port: this._port,
                host: this._host
            }, ()=>{
                api_1.diag.debug(`Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`);
                resolve();
            });
        });
        return this._startServerPromise;
    }
    /**
     * Request handler that responds with the current state of metrics
     * @param _request Incoming HTTP request of server instance
     * @param response HTTP response object used to response to request
     */ getMetricsRequestHandler(_request, response) {
        this._exportMetrics(response);
    }
    /**
     * Request handler used by http library to respond to incoming requests
     * for the current state of metrics by the Prometheus backend.
     *
     * @param request Incoming HTTP request to export server
     * @param response HTTP response object used to respond to request
     */ _requestHandler = (request, response)=>{
        if (request.url != null && new url_1.URL(request.url, this._baseUrl).pathname === this._endpoint) {
            this._exportMetrics(response);
        } else {
            this._notFound(response);
        }
    };
    /**
     * Responds to incoming message with current state of all metrics.
     */ _exportMetrics = (response)=>{
        response.statusCode = 200;
        response.setHeader('content-type', 'text/plain');
        this.collect().then((collectionResult)=>{
            const { resourceMetrics, errors } = collectionResult;
            if (errors.length) {
                api_1.diag.error('PrometheusExporter: metrics collection errors', ...errors);
            }
            response.end(this._serializer.serialize(resourceMetrics));
        }, (err)=>{
            response.end(`# failed to export metrics: ${err}`);
        });
    };
    /**
     * Responds with 404 status code to all requests that do not match the configured endpoint.
     */ _notFound = (response)=>{
        response.statusCode = 404;
        response.end();
    };
}
exports.PrometheusExporter = PrometheusExporter; //# sourceMappingURL=PrometheusExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-prometheus/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PrometheusSerializer = exports.PrometheusExporter = void 0;
var PrometheusExporter_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-prometheus/build/src/PrometheusExporter.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "PrometheusExporter", {
    enumerable: true,
    get: function() {
        return PrometheusExporter_1.PrometheusExporter;
    }
});
var PrometheusSerializer_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-prometheus/build/src/PrometheusSerializer.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "PrometheusSerializer", {
    enumerable: true,
    get: function() {
        return PrometheusSerializer_1.PrometheusSerializer;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-proto/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-proto/build/esm/platform/node/OTLPTraceExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$trace$2f$protobuf$2f$trace$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/trace/protobuf/trace.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-http-export-delegate.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-node-http-options.js [instrumentation] (ecmascript)");
;
;
;
class OTLPTraceExporter extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterBase"] {
    constructor(config = {}){
        super((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpHttpExportDelegate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["convertLegacyHttpOptions"])(config, 'TRACES', 'v1/traces', {
            'Content-Type': 'application/x-protobuf'
        }), __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$trace$2f$protobuf$2f$trace$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ProtobufTraceSerializer"]));
    }
} //# sourceMappingURL=OTLPTraceExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-proto/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OTLPTraceExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$trace$2d$otlp$2d$proto$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPTraceExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPTraceExporter"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$trace$2d$otlp$2d$proto$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-proto/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$trace$2d$otlp$2d$proto$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPTraceExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-proto/build/esm/platform/node/OTLPTraceExporter.js [instrumentation] (ecmascript)");
}),
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-grpc/build/src/OTLPTraceExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPTraceExporter = void 0;
const otlp_grpc_exporter_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/index.js [instrumentation] (ecmascript)");
const otlp_transformer_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/index.js [instrumentation] (ecmascript)");
const otlp_exporter_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/index.js [instrumentation] (ecmascript)");
/**
 * OTLP Trace Exporter for Node
 */ class OTLPTraceExporter extends otlp_exporter_base_1.OTLPExporterBase {
    constructor(config = {}){
        super((0, otlp_grpc_exporter_base_1.createOtlpGrpcExportDelegate)((0, otlp_grpc_exporter_base_1.convertLegacyOtlpGrpcOptions)(config, 'TRACES'), otlp_transformer_1.ProtobufTraceSerializer, 'TraceExportService', '/opentelemetry.proto.collector.trace.v1.TraceService/Export'));
    }
}
exports.OTLPTraceExporter = OTLPTraceExporter; //# sourceMappingURL=OTLPTraceExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-grpc/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPTraceExporter = void 0;
var OTLPTraceExporter_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-grpc/build/src/OTLPTraceExporter.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "OTLPTraceExporter", {
    enumerable: true,
    get: function() {
        return OTLPTraceExporter_1.OTLPTraceExporter;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/platform/node/util.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "prepareSend",
    ()=>prepareSend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$http__$5b$external$5d$__$28$http$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/http [external] (http, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$https__$5b$external$5d$__$28$https$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/https [external] (https, cjs)");
;
;
;
;
function prepareSend(urlStr, headers) {
    const url = new URL(urlStr);
    const reqOpts = Object.assign({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
    /**
     * Send spans to the remote Zipkin service.
     */ return function send(zipkinSpans, done) {
        if (zipkinSpans.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug('Zipkin send with empty spans');
            return done({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS
            });
        }
        const { request } = url.protocol === 'http:' ? __TURBOPACK__imported__module__$5b$externals$5d2f$http__$5b$external$5d$__$28$http$2c$__cjs$29$__ : __TURBOPACK__imported__module__$5b$externals$5d2f$https__$5b$external$5d$__$28$https$2c$__cjs$29$__;
        const req = request(url, reqOpts, (res)=>{
            let rawData = '';
            res.on('data', (chunk)=>{
                rawData += chunk;
            });
            res.on('end', ()=>{
                const statusCode = res.statusCode || 0;
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug(`Zipkin response status code: ${statusCode}, body: ${rawData}`);
                // Consider 2xx and 3xx as success.
                if (statusCode < 400) {
                    return done({
                        code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS
                    });
                // Consider 4xx as failed non-retryable.
                } else {
                    return done({
                        code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                        error: new Error(`Got unexpected status code from zipkin: ${statusCode}`)
                    });
                }
            });
        });
        req.on('error', (error)=>{
            return done({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                error
            });
        });
        // Issue request to remote service
        const payload = JSON.stringify(zipkinSpans);
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug(`Zipkin request payload: ${payload}`);
        req.write(payload, 'utf8');
        req.end();
    };
} //# sourceMappingURL=util.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/types.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * When present, kind clarifies timestamp, duration and remoteEndpoint. When
 * absent, the span is local or incomplete. Unlike client and server, there
 * is no direct critical path latency relationship between producer and
 * consumer spans.
 * `CLIENT`
 *   timestamp is the moment a request was sent to the server.
 *   duration is the delay until a response or an error was received.
 *   remoteEndpoint is the server.
 * `SERVER`
 *   timestamp is the moment a client request was received.
 *   duration is the delay until a response was sent or an error.
 *   remoteEndpoint is the client.
 * `PRODUCER`
 *   timestamp is the moment a message was sent to a destination.
 *   duration is the delay sending the message, such as batching.
 *   remoteEndpoint is the broker.
 * `CONSUMER`
 *   timestamp is the moment a message was received from an origin.
 *   duration is the delay consuming the message, such as from backlog.
 *   remoteEndpoint - Represents the broker. Leave serviceName absent if unknown.
 */ __turbopack_context__.s([
    "SpanKind",
    ()=>SpanKind
]);
var SpanKind;
(function(SpanKind) {
    SpanKind["CLIENT"] = "CLIENT";
    SpanKind["SERVER"] = "SERVER";
    SpanKind["CONSUMER"] = "CONSUMER";
    SpanKind["PRODUCER"] = "PRODUCER";
})(SpanKind || (SpanKind = {})); //# sourceMappingURL=types.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/transform.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "_toZipkinAnnotations",
    ()=>_toZipkinAnnotations,
    "_toZipkinTags",
    ()=>_toZipkinTags,
    "defaultStatusCodeTagName",
    ()=>defaultStatusCodeTagName,
    "defaultStatusErrorTagName",
    ()=>defaultStatusErrorTagName,
    "toZipkinSpan",
    ()=>toZipkinSpan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$span_kind$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/span_kind.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$status$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/status.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/time.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/types.js [instrumentation] (ecmascript)");
;
;
;
const ZIPKIN_SPAN_KIND_MAPPING = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$span_kind$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanKind"].CLIENT]: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanKind"].CLIENT,
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$span_kind$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanKind"].SERVER]: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanKind"].SERVER,
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$span_kind$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanKind"].CONSUMER]: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanKind"].CONSUMER,
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$span_kind$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanKind"].PRODUCER]: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanKind"].PRODUCER,
    // When absent, the span is local.
    [__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$span_kind$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanKind"].INTERNAL]: undefined
};
const defaultStatusCodeTagName = 'otel.status_code';
const defaultStatusErrorTagName = 'error';
function toZipkinSpan(span, serviceName, statusCodeTagName, statusErrorTagName) {
    const zipkinSpan = {
        traceId: span.spanContext().traceId,
        parentId: span.parentSpanContext?.spanId,
        name: span.name,
        id: span.spanContext().spanId,
        kind: ZIPKIN_SPAN_KIND_MAPPING[span.kind],
        timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMicroseconds"])(span.startTime),
        duration: Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMicroseconds"])(span.duration)),
        localEndpoint: {
            serviceName
        },
        tags: _toZipkinTags(span, statusCodeTagName, statusErrorTagName),
        annotations: span.events.length ? _toZipkinAnnotations(span.events) : undefined
    };
    return zipkinSpan;
}
function _toZipkinTags({ attributes, resource, status, droppedAttributesCount, droppedEventsCount, droppedLinksCount }, statusCodeTagName, statusErrorTagName) {
    const tags = {};
    for (const key of Object.keys(attributes)){
        tags[key] = String(attributes[key]);
    }
    if (status.code !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$status$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanStatusCode"].UNSET) {
        tags[statusCodeTagName] = String(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$status$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanStatusCode"][status.code]);
    }
    if (status.code === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$status$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SpanStatusCode"].ERROR && status.message) {
        tags[statusErrorTagName] = status.message;
    }
    /* Add droppedAttributesCount as a tag */ if (droppedAttributesCount) {
        tags['otel.dropped_attributes_count'] = String(droppedAttributesCount);
    }
    /* Add droppedEventsCount as a tag */ if (droppedEventsCount) {
        tags['otel.dropped_events_count'] = String(droppedEventsCount);
    }
    /* Add droppedLinksCount as a tag */ if (droppedLinksCount) {
        tags['otel.dropped_links_count'] = String(droppedLinksCount);
    }
    Object.keys(resource.attributes).forEach((name)=>tags[name] = String(resource.attributes[name]));
    return tags;
}
function _toZipkinAnnotations(events) {
    return events.map((event)=>({
            timestamp: Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMicroseconds"])(event.time)),
            value: event.name
        }));
} //# sourceMappingURL=transform.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prepareGetHeaders",
    ()=>prepareGetHeaders
]);
function prepareGetHeaders(getExportRequestHeaders) {
    return function() {
        return getExportRequestHeaders();
    };
} //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/zipkin.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ZipkinExporter",
    ()=>ZipkinExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/environment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$platform$2f$node$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/platform/node/util.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$transform$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/transform.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_attributes.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/utils.js [instrumentation] (ecmascript)");
;
;
;
;
;
;
class ZipkinExporter {
    DEFAULT_SERVICE_NAME = 'OpenTelemetry Service';
    _statusCodeTagName;
    _statusDescriptionTagName;
    _urlStr;
    _send;
    _getHeaders;
    _serviceName;
    _isShutdown;
    _sendingPromises = [];
    constructor(config = {}){
        this._urlStr = config.url || ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])('OTEL_EXPORTER_ZIPKIN_ENDPOINT') ?? 'http://localhost:9411/api/v2/spans');
        this._send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$platform$2f$node$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["prepareSend"])(this._urlStr, config.headers);
        this._serviceName = config.serviceName;
        this._statusCodeTagName = config.statusCodeTagName || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$transform$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["defaultStatusCodeTagName"];
        this._statusDescriptionTagName = config.statusDescriptionTagName || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$transform$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["defaultStatusErrorTagName"];
        this._isShutdown = false;
        if (typeof config.getExportRequestHeaders === 'function') {
            this._getHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["prepareGetHeaders"])(config.getExportRequestHeaders);
        } else {
            // noop
            this._beforeSend = function() {};
        }
    }
    /**
     * Export spans.
     */ export(spans, resultCallback) {
        const serviceName = String(this._serviceName || spans[0].resource.attributes[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_SERVICE_NAME"]] || this.DEFAULT_SERVICE_NAME);
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug('Zipkin exporter export');
        if (this._isShutdown) {
            setTimeout(()=>resultCallback({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED,
                    error: new Error('Exporter has been shutdown')
                }));
            return;
        }
        const promise = new Promise((resolve)=>{
            this._sendSpans(spans, serviceName, (result)=>{
                resolve();
                resultCallback(result);
            });
        });
        this._sendingPromises.push(promise);
        const popPromise = ()=>{
            const index = this._sendingPromises.indexOf(promise);
            void this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
    }
    /**
     * Shutdown exporter. Noop operation in this exporter.
     */ shutdown() {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug('Zipkin exporter shutdown');
        this._isShutdown = true;
        return this.forceFlush();
    }
    /**
     * Exports any pending spans in exporter
     */ forceFlush() {
        return new Promise((resolve, reject)=>{
            Promise.all(this._sendingPromises).then(()=>{
                resolve();
            }, reject);
        });
    }
    /**
     * if user defines getExportRequestHeaders in config then this will be called
     * every time before send, otherwise it will be replaced with noop in
     * constructor
     * @default noop
     */ _beforeSend() {
        if (this._getHeaders) {
            this._send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$platform$2f$node$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["prepareSend"])(this._urlStr, this._getHeaders());
        }
    }
    /**
     * Transform spans and sends to Zipkin service.
     */ _sendSpans(spans, serviceName, done) {
        const zipkinSpans = spans.map((span)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$transform$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["toZipkinSpan"])(span, String(span.attributes[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_SERVICE_NAME"]] || span.resource.attributes[__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$semantic$2d$conventions$2f$build$2f$esm$2f$stable_attributes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ATTR_SERVICE_NAME"]] || serviceName), this._statusCodeTagName, this._statusDescriptionTagName));
        this._beforeSend();
        return this._send(zipkinSpans, (result)=>{
            if (done) {
                return done(result);
            }
        });
    }
} //# sourceMappingURL=zipkin.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZipkinExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$zipkin$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ZipkinExporter"],
    "prepareSend",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$platform$2f$node$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["prepareSend"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$platform$2f$node$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/platform/node/util.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$zipkin$2f$build$2f$esm$2f$zipkin$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/zipkin.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/common.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "B3_DEBUG_FLAG_KEY",
    ()=>B3_DEBUG_FLAG_KEY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2f$context$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/context/context.js [instrumentation] (ecmascript)");
;
const B3_DEBUG_FLAG_KEY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2f$context$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createContextKey"])('OpenTelemetry Context Key B3 Debug Flag'); //# sourceMappingURL=common.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/constants.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ /** B3 single-header key */ __turbopack_context__.s([
    "B3_CONTEXT_HEADER",
    ()=>B3_CONTEXT_HEADER,
    "X_B3_FLAGS",
    ()=>X_B3_FLAGS,
    "X_B3_PARENT_SPAN_ID",
    ()=>X_B3_PARENT_SPAN_ID,
    "X_B3_SAMPLED",
    ()=>X_B3_SAMPLED,
    "X_B3_SPAN_ID",
    ()=>X_B3_SPAN_ID,
    "X_B3_TRACE_ID",
    ()=>X_B3_TRACE_ID
]);
const B3_CONTEXT_HEADER = 'b3';
const X_B3_TRACE_ID = 'x-b3-traceid';
const X_B3_SPAN_ID = 'x-b3-spanid';
const X_B3_SAMPLED = 'x-b3-sampled';
const X_B3_PARENT_SPAN_ID = 'x-b3-parentspanid';
const X_B3_FLAGS = 'x-b3-flags'; //# sourceMappingURL=constants.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/B3MultiPropagator.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "B3MultiPropagator",
    ()=>B3MultiPropagator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$common$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/common.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/constants.js [instrumentation] (ecmascript)");
;
;
;
;
const VALID_SAMPLED_VALUES = new Set([
    true,
    'true',
    'True',
    '1',
    1
]);
const VALID_UNSAMPLED_VALUES = new Set([
    false,
    'false',
    'False',
    '0',
    0
]);
function isValidSampledValue(sampled) {
    return sampled === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].SAMPLED || sampled === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].NONE;
}
function parseHeader(header) {
    return Array.isArray(header) ? header[0] : header;
}
function getHeaderValue(carrier, getter, key) {
    const header = getter.get(carrier, key);
    return parseHeader(header);
}
function getTraceId(carrier, getter) {
    const traceId = getHeaderValue(carrier, getter, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_TRACE_ID"]);
    if (typeof traceId === 'string') {
        return traceId.padStart(32, '0');
    }
    return '';
}
function getSpanId(carrier, getter) {
    const spanId = getHeaderValue(carrier, getter, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_SPAN_ID"]);
    if (typeof spanId === 'string') {
        return spanId;
    }
    return '';
}
function getDebug(carrier, getter) {
    const debug = getHeaderValue(carrier, getter, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_FLAGS"]);
    return debug === '1' ? '1' : undefined;
}
function getTraceFlags(carrier, getter) {
    const traceFlags = getHeaderValue(carrier, getter, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_SAMPLED"]);
    const debug = getDebug(carrier, getter);
    if (debug === '1' || VALID_SAMPLED_VALUES.has(traceFlags)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].SAMPLED;
    }
    if (traceFlags === undefined || VALID_UNSAMPLED_VALUES.has(traceFlags)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].NONE;
    }
    // This indicates to isValidSampledValue that this is not valid
    return;
}
class B3MultiPropagator {
    inject(context, carrier, setter) {
        const spanContext = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].getSpanContext(context);
        if (!spanContext || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isSpanContextValid"])(spanContext) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isTracingSuppressed"])(context)) return;
        const debug = context.getValue(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$common$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3_DEBUG_FLAG_KEY"]);
        setter.set(carrier, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_TRACE_ID"], spanContext.traceId);
        setter.set(carrier, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_SPAN_ID"], spanContext.spanId);
        // According to the B3 spec, if the debug flag is set,
        // the sampled flag shouldn't be propagated as well.
        if (debug === '1') {
            setter.set(carrier, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_FLAGS"], debug);
        } else if (spanContext.traceFlags !== undefined) {
            // We set the header only if there is an existing sampling decision.
            // Otherwise we will omit it => Absent.
            setter.set(carrier, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_SAMPLED"], (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].SAMPLED & spanContext.traceFlags) === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].SAMPLED ? '1' : '0');
        }
    }
    extract(context, carrier, getter) {
        const traceId = getTraceId(carrier, getter);
        const spanId = getSpanId(carrier, getter);
        const traceFlags = getTraceFlags(carrier, getter);
        const debug = getDebug(carrier, getter);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isValidTraceId"])(traceId) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isValidSpanId"])(spanId) && isValidSampledValue(traceFlags)) {
            context = context.setValue(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$common$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3_DEBUG_FLAG_KEY"], debug);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].setSpanContext(context, {
                traceId,
                spanId,
                isRemote: true,
                traceFlags
            });
        }
        return context;
    }
    fields() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_TRACE_ID"],
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_SPAN_ID"],
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_FLAGS"],
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_SAMPLED"],
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_PARENT_SPAN_ID"]
        ];
    }
} //# sourceMappingURL=B3MultiPropagator.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/B3SinglePropagator.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "B3SinglePropagator",
    ()=>B3SinglePropagator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$common$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/common.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/constants.js [instrumentation] (ecmascript)");
;
;
;
;
const B3_CONTEXT_REGEX = /((?:[0-9a-f]{16}){1,2})-([0-9a-f]{16})(?:-([01d](?![0-9a-f])))?(?:-([0-9a-f]{16}))?/;
const PADDING = '0'.repeat(16);
const SAMPLED_VALUES = new Set([
    'd',
    '1'
]);
const DEBUG_STATE = 'd';
function convertToTraceId128(traceId) {
    return traceId.length === 32 ? traceId : `${PADDING}${traceId}`;
}
function convertToTraceFlags(samplingState) {
    if (samplingState && SAMPLED_VALUES.has(samplingState)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].SAMPLED;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].NONE;
}
class B3SinglePropagator {
    inject(context, carrier, setter) {
        const spanContext = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].getSpanContext(context);
        if (!spanContext || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isSpanContextValid"])(spanContext) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isTracingSuppressed"])(context)) return;
        const samplingState = context.getValue(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$common$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3_DEBUG_FLAG_KEY"]) || spanContext.traceFlags & 0x1;
        const value = `${spanContext.traceId}-${spanContext.spanId}-${samplingState}`;
        setter.set(carrier, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3_CONTEXT_HEADER"], value);
    }
    extract(context, carrier, getter) {
        const header = getter.get(carrier, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3_CONTEXT_HEADER"]);
        const b3Context = Array.isArray(header) ? header[0] : header;
        if (typeof b3Context !== 'string') return context;
        const match = b3Context.match(B3_CONTEXT_REGEX);
        if (!match) return context;
        const [, extractedTraceId, spanId, samplingState] = match;
        const traceId = convertToTraceId128(extractedTraceId);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isValidTraceId"])(traceId) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$spancontext$2d$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isValidSpanId"])(spanId)) return context;
        const traceFlags = convertToTraceFlags(samplingState);
        if (samplingState === DEBUG_STATE) {
            context = context.setValue(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$common$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3_DEBUG_FLAG_KEY"], samplingState);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].setSpanContext(context, {
            traceId,
            spanId,
            isRemote: true,
            traceFlags
        });
    }
    fields() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3_CONTEXT_HEADER"]
        ];
    }
} //# sourceMappingURL=B3SinglePropagator.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/types.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ /** Enumeration of B3 inject encodings */ __turbopack_context__.s([
    "B3InjectEncoding",
    ()=>B3InjectEncoding
]);
var B3InjectEncoding;
(function(B3InjectEncoding) {
    B3InjectEncoding[B3InjectEncoding["SINGLE_HEADER"] = 0] = "SINGLE_HEADER";
    B3InjectEncoding[B3InjectEncoding["MULTI_HEADER"] = 1] = "MULTI_HEADER";
})(B3InjectEncoding || (B3InjectEncoding = {})); //# sourceMappingURL=types.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/B3Propagator.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "B3Propagator",
    ()=>B3Propagator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$B3MultiPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/B3MultiPropagator.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$B3SinglePropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/B3SinglePropagator.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/constants.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/types.js [instrumentation] (ecmascript)");
;
;
;
;
;
class B3Propagator {
    _b3MultiPropagator = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$B3MultiPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3MultiPropagator"]();
    _b3SinglePropagator = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$B3SinglePropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3SinglePropagator"]();
    _inject;
    _fields;
    constructor(config = {}){
        if (config.injectEncoding === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3InjectEncoding"].MULTI_HEADER) {
            this._inject = this._b3MultiPropagator.inject;
            this._fields = this._b3MultiPropagator.fields();
        } else {
            this._inject = this._b3SinglePropagator.inject;
            this._fields = this._b3SinglePropagator.fields();
        }
    }
    inject(context, carrier, setter) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isTracingSuppressed"])(context)) {
            return;
        }
        this._inject(context, carrier, setter);
    }
    extract(context, carrier, getter) {
        const header = getter.get(carrier, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3_CONTEXT_HEADER"]);
        const b3Context = Array.isArray(header) ? header[0] : header;
        if (b3Context) {
            return this._b3SinglePropagator.extract(context, carrier, getter);
        } else {
            return this._b3MultiPropagator.extract(context, carrier, getter);
        }
    }
    fields() {
        return this._fields;
    }
} //# sourceMappingURL=B3Propagator.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "B3InjectEncoding",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3InjectEncoding"],
    "B3Propagator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$B3Propagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3Propagator"],
    "B3_CONTEXT_HEADER",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["B3_CONTEXT_HEADER"],
    "X_B3_FLAGS",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_FLAGS"],
    "X_B3_PARENT_SPAN_ID",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_PARENT_SPAN_ID"],
    "X_B3_SAMPLED",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_SAMPLED"],
    "X_B3_SPAN_ID",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_SPAN_ID"],
    "X_B3_TRACE_ID",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["X_B3_TRACE_ID"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$B3Propagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/B3Propagator.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$constants$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/constants.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$b3$2f$build$2f$esm$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/types.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-jaeger/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-jaeger/build/esm/JaegerPropagator.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "JaegerPropagator",
    ()=>JaegerPropagator,
    "UBER_BAGGAGE_HEADER_PREFIX",
    ()=>UBER_BAGGAGE_HEADER_PREFIX,
    "UBER_TRACE_ID_HEADER",
    ()=>UBER_TRACE_ID_HEADER
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$propagation$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/propagation-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js [instrumentation] (ecmascript)");
;
;
const UBER_TRACE_ID_HEADER = 'uber-trace-id';
const UBER_BAGGAGE_HEADER_PREFIX = 'uberctx';
class JaegerPropagator {
    _jaegerTraceHeader;
    _jaegerBaggageHeaderPrefix;
    constructor(config){
        if (typeof config === 'string') {
            this._jaegerTraceHeader = config;
            this._jaegerBaggageHeaderPrefix = UBER_BAGGAGE_HEADER_PREFIX;
        } else {
            this._jaegerTraceHeader = config?.customTraceHeader || UBER_TRACE_ID_HEADER;
            this._jaegerBaggageHeaderPrefix = config?.customBaggageHeaderPrefix || UBER_BAGGAGE_HEADER_PREFIX;
        }
    }
    inject(context, carrier, setter) {
        const spanContext = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].getSpanContext(context);
        const baggage = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$propagation$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["propagation"].getBaggage(context);
        if (spanContext && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$trace$2f$suppress$2d$tracing$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isTracingSuppressed"])(context) === false) {
            const traceFlags = `0${(spanContext.traceFlags || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2f$trace_flags$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TraceFlags"].NONE).toString(16)}`;
            setter.set(carrier, this._jaegerTraceHeader, `${spanContext.traceId}:${spanContext.spanId}:0:${traceFlags}`);
        }
        if (baggage) {
            for (const [key, entry] of baggage.getAllEntries()){
                setter.set(carrier, `${this._jaegerBaggageHeaderPrefix}-${key}`, encodeURIComponent(entry.value));
            }
        }
    }
    extract(context, carrier, getter) {
        const uberTraceIdHeader = getter.get(carrier, this._jaegerTraceHeader);
        const uberTraceId = Array.isArray(uberTraceIdHeader) ? uberTraceIdHeader[0] : uberTraceIdHeader;
        const baggageValues = getter.keys(carrier).filter((key)=>key.startsWith(`${this._jaegerBaggageHeaderPrefix}-`)).map((key)=>{
            const value = getter.get(carrier, key);
            return {
                key: key.substring(this._jaegerBaggageHeaderPrefix.length + 1),
                value: Array.isArray(value) ? value[0] : value
            };
        });
        let newContext = context;
        // if the trace id header is present and valid, inject it into the context
        if (typeof uberTraceId === 'string') {
            const spanContext = deserializeSpanContext(uberTraceId);
            if (spanContext) {
                newContext = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["trace"].setSpanContext(newContext, spanContext);
            }
        }
        if (baggageValues.length === 0) return newContext;
        // if baggage values are present, inject it into the current baggage
        let currentBaggage = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$propagation$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["propagation"].getBaggage(context) ?? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$propagation$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["propagation"].createBaggage();
        for (const baggageEntry of baggageValues){
            if (baggageEntry.value === undefined) continue;
            currentBaggage = currentBaggage.setEntry(baggageEntry.key, {
                value: decodeURIComponent(baggageEntry.value)
            });
        }
        newContext = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$propagation$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["propagation"].setBaggage(newContext, currentBaggage);
        return newContext;
    }
    fields() {
        return [
            this._jaegerTraceHeader
        ];
    }
}
const VALID_HEX_RE = /^[0-9a-f]{1,2}$/i;
/**
 * @param {string} serializedString - a serialized span context.
 * @return {SpanContext} - returns a span context represented by the serializedString.
 **/ function deserializeSpanContext(serializedString) {
    const headers = decodeURIComponent(serializedString).split(':');
    if (headers.length !== 4) {
        return null;
    }
    const [_traceId, _spanId, , flags] = headers;
    const traceId = _traceId.padStart(32, '0');
    const spanId = _spanId.padStart(16, '0');
    const traceFlags = VALID_HEX_RE.test(flags) ? parseInt(flags, 16) & 1 : 1;
    return {
        traceId,
        spanId,
        isRemote: true,
        traceFlags
    };
} //# sourceMappingURL=JaegerPropagator.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-jaeger/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JaegerPropagator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$jaeger$2f$build$2f$esm$2f$JaegerPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["JaegerPropagator"],
    "UBER_BAGGAGE_HEADER_PREFIX",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$jaeger$2f$build$2f$esm$2f$JaegerPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["UBER_BAGGAGE_HEADER_PREFIX"],
    "UBER_TRACE_ID_HEADER",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$jaeger$2f$build$2f$esm$2f$JaegerPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["UBER_TRACE_ID_HEADER"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$jaeger$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-jaeger/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$propagator$2d$jaeger$2f$build$2f$esm$2f$JaegerPropagator$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-jaeger/build/esm/JaegerPropagator.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterOptions.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "AggregationTemporalityPreference",
    ()=>AggregationTemporalityPreference
]);
var AggregationTemporalityPreference;
(function(AggregationTemporalityPreference) {
    AggregationTemporalityPreference[AggregationTemporalityPreference["DELTA"] = 0] = "DELTA";
    AggregationTemporalityPreference[AggregationTemporalityPreference["CUMULATIVE"] = 1] = "CUMULATIVE";
    AggregationTemporalityPreference[AggregationTemporalityPreference["LOWMEMORY"] = 2] = "LOWMEMORY";
})(AggregationTemporalityPreference || (AggregationTemporalityPreference = {})); //# sourceMappingURL=OTLPMetricExporterOptions.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterBase.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "CumulativeTemporalitySelector",
    ()=>CumulativeTemporalitySelector,
    "DeltaTemporalitySelector",
    ()=>DeltaTemporalitySelector,
    "LowMemoryTemporalitySelector",
    ()=>LowMemoryTemporalitySelector,
    "OTLPMetricExporterBase",
    ()=>OTLPMetricExporterBase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/platform/node/environment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationTemporality.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AggregationOption.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterOptions$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterOptions.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
;
;
;
;
const CumulativeTemporalitySelector = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporality"].CUMULATIVE;
const DeltaTemporalitySelector = (instrumentType)=>{
    switch(instrumentType){
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].COUNTER:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_COUNTER:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].GAUGE:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].HISTOGRAM:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_GAUGE:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporality"].DELTA;
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].UP_DOWN_COUNTER:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_UP_DOWN_COUNTER:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporality"].CUMULATIVE;
    }
};
const LowMemoryTemporalitySelector = (instrumentType)=>{
    switch(instrumentType){
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].COUNTER:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].HISTOGRAM:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporality"].DELTA;
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].GAUGE:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].UP_DOWN_COUNTER:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_UP_DOWN_COUNTER:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_COUNTER:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_GAUGE:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporality"].CUMULATIVE;
    }
};
function chooseTemporalitySelectorFromEnvironment() {
    const configuredTemporality = ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$platform$2f$node$2f$environment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getStringFromEnv"])('OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE') ?? 'cumulative').toLowerCase();
    if (configuredTemporality === 'cumulative') {
        return CumulativeTemporalitySelector;
    }
    if (configuredTemporality === 'delta') {
        return DeltaTemporalitySelector;
    }
    if (configuredTemporality === 'lowmemory') {
        return LowMemoryTemporalitySelector;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '${configuredTemporality}', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.`);
    return CumulativeTemporalitySelector;
}
function chooseTemporalitySelector(temporalityPreference) {
    // Directly passed preference has priority.
    if (temporalityPreference != null) {
        if (temporalityPreference === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterOptions$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporalityPreference"].DELTA) {
            return DeltaTemporalitySelector;
        } else if (temporalityPreference === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterOptions$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporalityPreference"].LOWMEMORY) {
            return LowMemoryTemporalitySelector;
        }
        return CumulativeTemporalitySelector;
    }
    return chooseTemporalitySelectorFromEnvironment();
}
const DEFAULT_AGGREGATION = Object.freeze({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationType"].DEFAULT
});
function chooseAggregationSelector(config) {
    return config?.aggregationPreference ?? (()=>DEFAULT_AGGREGATION);
}
class OTLPMetricExporterBase extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$OTLPExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPExporterBase"] {
    _aggregationTemporalitySelector;
    _aggregationSelector;
    constructor(delegate, config){
        super(delegate);
        this._aggregationSelector = chooseAggregationSelector(config);
        this._aggregationTemporalitySelector = chooseTemporalitySelector(config?.temporalityPreference);
    }
    selectAggregation(instrumentType) {
        return this._aggregationSelector(instrumentType);
    }
    selectAggregationTemporality(instrumentType) {
        return this._aggregationTemporalitySelector(instrumentType);
    }
} //# sourceMappingURL=OTLPMetricExporterBase.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/platform/node/OTLPMetricExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "OTLPMetricExporter",
    ()=>OTLPMetricExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterBase.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$metrics$2f$json$2f$metrics$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/metrics/json/metrics.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-node-http-options.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-http-export-delegate.js [instrumentation] (ecmascript)");
;
;
;
class OTLPMetricExporter extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPMetricExporterBase"] {
    constructor(config){
        super((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpHttpExportDelegate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["convertLegacyHttpOptions"])(config ?? {}, 'METRICS', 'v1/metrics', {
            'Content-Type': 'application/json'
        }), __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$metrics$2f$json$2f$metrics$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["JsonMetricsSerializer"]), config);
    }
} //# sourceMappingURL=OTLPMetricExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AggregationTemporalityPreference",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterOptions$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporalityPreference"],
    "CumulativeTemporalitySelector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["CumulativeTemporalitySelector"],
    "DeltaTemporalitySelector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DeltaTemporalitySelector"],
    "LowMemoryTemporalitySelector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["LowMemoryTemporalitySelector"],
    "OTLPMetricExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPMetricExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPMetricExporter"],
    "OTLPMetricExporterBase",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPMetricExporterBase"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPMetricExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/platform/node/OTLPMetricExporter.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterOptions$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterOptions.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterBase.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-grpc/build/src/OTLPMetricExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPMetricExporter = void 0;
const exporter_metrics_otlp_http_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/index.js [instrumentation] (ecmascript)");
const otlp_grpc_exporter_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-grpc-exporter-base/build/src/index.js [instrumentation] (ecmascript)");
const otlp_transformer_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/index.js [instrumentation] (ecmascript)");
/**
 * OTLP-gRPC metric exporter
 */ class OTLPMetricExporter extends exporter_metrics_otlp_http_1.OTLPMetricExporterBase {
    constructor(config){
        super((0, otlp_grpc_exporter_base_1.createOtlpGrpcExportDelegate)((0, otlp_grpc_exporter_base_1.convertLegacyOtlpGrpcOptions)(config ?? {}, 'METRICS'), otlp_transformer_1.ProtobufMetricsSerializer, 'MetricsExportService', '/opentelemetry.proto.collector.metrics.v1.MetricsService/Export'), config);
    }
}
exports.OTLPMetricExporter = OTLPMetricExporter; //# sourceMappingURL=OTLPMetricExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-grpc/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPMetricExporter = void 0;
var OTLPMetricExporter_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-grpc/build/src/OTLPMetricExporter.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "OTLPMetricExporter", {
    enumerable: true,
    get: function() {
        return OTLPMetricExporter_1.OTLPMetricExporter;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/esm/platform/node/OTLPMetricExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "OTLPMetricExporter",
    ()=>OTLPMetricExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterBase.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$metrics$2f$protobuf$2f$metrics$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-transformer/build/esm/metrics/protobuf/metrics.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-node-http-options.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-http-export-delegate.js [instrumentation] (ecmascript)");
;
;
;
class OTLPMetricExporter extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$OTLPMetricExporterBase$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPMetricExporterBase"] {
    constructor(config){
        super((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$otlp$2d$http$2d$export$2d$delegate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createOtlpHttpExportDelegate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$exporter$2d$base$2f$build$2f$esm$2f$configuration$2f$convert$2d$legacy$2d$node$2d$http$2d$options$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["convertLegacyHttpOptions"])(config ?? {}, 'METRICS', 'v1/metrics', {
            'Content-Type': 'application/x-protobuf'
        }), __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$otlp$2d$transformer$2f$build$2f$esm$2f$metrics$2f$protobuf$2f$metrics$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ProtobufMetricsSerializer"]), config);
    }
} //# sourceMappingURL=OTLPMetricExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OTLPMetricExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$proto$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPMetricExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["OTLPMetricExporter"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$proto$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$proto$2f$build$2f$esm$2f$platform$2f$node$2f$OTLPMetricExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/esm/platform/node/OTLPMetricExporter.js [instrumentation] (ecmascript)");
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-node/build/src/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBatchLogRecordProcessorFromEnv = exports.getBatchLogRecordProcessorConfigFromEnv = exports.getLoggerProviderConfigFromEnv = exports.getOtlpMetricExporterFromEnv = exports.getPeriodicExportingMetricReaderFromEnv = exports.getNonNegativeNumberFromEnv = exports.getKeyListFromObjectArray = exports.setupPropagator = exports.setupDefaultContextManager = exports.setupContextManager = exports.getPropagatorFromConfiguration = exports.getPropagatorFromEnv = exports.getSpanProcessorsFromEnv = exports.getOtlpProtocolFromEnv = exports.getResourceDetectorsFromEnv = void 0;
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const core_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
const exporter_trace_otlp_proto_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-proto/build/esm/index.js [instrumentation] (ecmascript)");
const exporter_trace_otlp_http_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/index.js [instrumentation] (ecmascript)");
const exporter_trace_otlp_grpc_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-trace-otlp-grpc/build/src/index.js [instrumentation] (ecmascript)");
const exporter_zipkin_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-zipkin/build/esm/index.js [instrumentation] (ecmascript)");
const resources_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/index.js [instrumentation] (ecmascript)");
const sdk_trace_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-base/build/esm/index.js [instrumentation] (ecmascript)");
const propagator_b3_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-b3/build/esm/index.js [instrumentation] (ecmascript)");
const propagator_jaeger_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/propagator-jaeger/build/esm/index.js [instrumentation] (ecmascript)");
const context_async_hooks_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/context-async-hooks/build/src/index.js [instrumentation] (ecmascript)");
const sdk_metrics_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/index.js [instrumentation] (ecmascript)");
const exporter_metrics_otlp_grpc_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-grpc/build/src/index.js [instrumentation] (ecmascript)");
const exporter_metrics_otlp_http_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/index.js [instrumentation] (ecmascript)");
const exporter_metrics_otlp_proto_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/esm/index.js [instrumentation] (ecmascript)");
const sdk_logs_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/index.js [instrumentation] (ecmascript)");
const RESOURCE_DETECTOR_ENVIRONMENT = 'env';
const RESOURCE_DETECTOR_HOST = 'host';
const RESOURCE_DETECTOR_OS = 'os';
const RESOURCE_DETECTOR_PROCESS = 'process';
const RESOURCE_DETECTOR_SERVICE_INSTANCE_ID = 'serviceinstance';
function getResourceDetectorsFromEnv() {
    // When updating this list, make sure to also update the section `resourceDetectors` on README.
    const resourceDetectors = new Map([
        [
            RESOURCE_DETECTOR_HOST,
            resources_1.hostDetector
        ],
        [
            RESOURCE_DETECTOR_OS,
            resources_1.osDetector
        ],
        [
            RESOURCE_DETECTOR_SERVICE_INSTANCE_ID,
            resources_1.serviceInstanceIdDetector
        ],
        [
            RESOURCE_DETECTOR_PROCESS,
            resources_1.processDetector
        ],
        [
            RESOURCE_DETECTOR_ENVIRONMENT,
            resources_1.envDetector
        ]
    ]);
    const resourceDetectorsFromEnv = (0, core_1.getStringListFromEnv)('OTEL_NODE_RESOURCE_DETECTORS') ?? [
        'all'
    ];
    if (resourceDetectorsFromEnv.includes('all')) {
        return [
            ...resourceDetectors.values()
        ].flat();
    }
    if (resourceDetectorsFromEnv.includes('none')) {
        return [];
    }
    return resourceDetectorsFromEnv.flatMap((detector)=>{
        const resourceDetector = resourceDetectors.get(detector);
        if (!resourceDetector) {
            api_1.diag.warn(`Invalid resource detector "${detector}" specified in the environment variable OTEL_NODE_RESOURCE_DETECTORS`);
        }
        return resourceDetector || [];
    });
}
exports.getResourceDetectorsFromEnv = getResourceDetectorsFromEnv;
function getOtlpProtocolFromEnv() {
    return (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_TRACES_PROTOCOL') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_PROTOCOL') ?? 'http/protobuf';
}
exports.getOtlpProtocolFromEnv = getOtlpProtocolFromEnv;
function getOtlpExporterFromEnv() {
    const protocol = getOtlpProtocolFromEnv();
    switch(protocol){
        case 'grpc':
            return new exporter_trace_otlp_grpc_1.OTLPTraceExporter();
        case 'http/json':
            return new exporter_trace_otlp_http_1.OTLPTraceExporter();
        case 'http/protobuf':
            return new exporter_trace_otlp_proto_1.OTLPTraceExporter();
        default:
            api_1.diag.warn(`Unsupported OTLP traces protocol: ${protocol}. Using http/protobuf.`);
            return new exporter_trace_otlp_proto_1.OTLPTraceExporter();
    }
}
function getSpanProcessorsFromEnv() {
    const exportersMap = new Map([
        [
            'otlp',
            ()=>getOtlpExporterFromEnv()
        ],
        [
            'zipkin',
            ()=>new exporter_zipkin_1.ZipkinExporter()
        ],
        [
            'console',
            ()=>new sdk_trace_base_1.ConsoleSpanExporter()
        ]
    ]);
    const exporters = [];
    const processors = [];
    let traceExportersList = Array.from(new Set((0, core_1.getStringListFromEnv)('OTEL_TRACES_EXPORTER'))).filter((s)=>s !== 'null');
    if (traceExportersList[0] === 'none') {
        api_1.diag.warn('OTEL_TRACES_EXPORTER contains "none". SDK will not be initialized.');
        return [];
    }
    if (traceExportersList.length === 0) {
        api_1.diag.debug('OTEL_TRACES_EXPORTER is empty. Using default otlp exporter.');
        traceExportersList = [
            'otlp'
        ];
    } else if (traceExportersList.length > 1 && traceExportersList.includes('none')) {
        api_1.diag.warn('OTEL_TRACES_EXPORTER contains "none" along with other exporters. Using default otlp exporter.');
        traceExportersList = [
            'otlp'
        ];
    }
    for (const name of traceExportersList){
        const exporter = exportersMap.get(name)?.();
        if (exporter) {
            exporters.push(exporter);
        } else {
            api_1.diag.warn(`Unrecognized OTEL_TRACES_EXPORTER value: ${name}.`);
        }
    }
    for (const exp of exporters){
        if (exp instanceof sdk_trace_base_1.ConsoleSpanExporter) {
            processors.push(new sdk_trace_base_1.SimpleSpanProcessor(exp));
        } else {
            processors.push(new sdk_trace_base_1.BatchSpanProcessor(exp));
        }
    }
    if (exporters.length === 0) {
        api_1.diag.warn('Unable to set up trace exporter(s) due to invalid exporter and/or protocol values.');
    }
    return processors;
}
exports.getSpanProcessorsFromEnv = getSpanProcessorsFromEnv;
/**
 * Get a propagator as defined by environment variables
 */ function getPropagatorFromEnv() {
    // Empty and undefined MUST be treated equal.
    const propagatorsEnvVarValue = (0, core_1.getStringListFromEnv)('OTEL_PROPAGATORS');
    if (propagatorsEnvVarValue == null) {
        // return undefined to fall back to default
        return undefined;
    }
    if (propagatorsEnvVarValue.includes('none')) {
        return null;
    }
    // Implementation note: this only contains specification required propagators that are actually hosted in this repo.
    // Any other propagators (like aws, aws-lambda, should go into `@opentelemetry/auto-configuration-propagators` instead).
    const propagatorsFactory = new Map([
        [
            'tracecontext',
            ()=>new core_1.W3CTraceContextPropagator()
        ],
        [
            'baggage',
            ()=>new core_1.W3CBaggagePropagator()
        ],
        [
            'b3',
            ()=>new propagator_b3_1.B3Propagator()
        ],
        [
            'b3multi',
            ()=>new propagator_b3_1.B3Propagator({
                    injectEncoding: propagator_b3_1.B3InjectEncoding.MULTI_HEADER
                })
        ],
        [
            'jaeger',
            ()=>new propagator_jaeger_1.JaegerPropagator()
        ]
    ]);
    // Values MUST be deduplicated in order to register a Propagator only once.
    const uniquePropagatorNames = Array.from(new Set(propagatorsEnvVarValue));
    const validPropagators = [];
    uniquePropagatorNames.forEach((name)=>{
        const propagator = propagatorsFactory.get(name)?.();
        if (!propagator) {
            api_1.diag.warn(`Propagator "${name}" requested through environment variable is unavailable.`);
            return;
        }
        validPropagators.push(propagator);
    });
    if (validPropagators.length === 0) {
        // null to signal that the default should **not** be used in its place.
        return null;
    } else if (uniquePropagatorNames.length === 1) {
        return validPropagators[0];
    } else {
        return new core_1.CompositePropagator({
            propagators: validPropagators
        });
    }
}
exports.getPropagatorFromEnv = getPropagatorFromEnv;
/**
 * Get a propagator as defined by configuration model from configuration
 */ function getPropagatorFromConfiguration(config) {
    const propagatorsValue = getKeyListFromObjectArray(config.propagator?.composite);
    if (propagatorsValue == null) {
        // return undefined to fall back to default
        return undefined;
    }
    if (propagatorsValue.includes('none')) {
        return null;
    }
    // Implementation note: this only contains specification required propagators that are actually hosted in this repo.
    // Any other propagators (like aws, aws-lambda, should go into `@opentelemetry/auto-configuration-propagators` instead).
    const propagatorsFactory = new Map([
        [
            'tracecontext',
            ()=>new core_1.W3CTraceContextPropagator()
        ],
        [
            'baggage',
            ()=>new core_1.W3CBaggagePropagator()
        ],
        [
            'b3',
            ()=>new propagator_b3_1.B3Propagator()
        ],
        [
            'b3multi',
            ()=>new propagator_b3_1.B3Propagator({
                    injectEncoding: propagator_b3_1.B3InjectEncoding.MULTI_HEADER
                })
        ],
        [
            'jaeger',
            ()=>new propagator_jaeger_1.JaegerPropagator()
        ]
    ]);
    // Values MUST be deduplicated in order to register a Propagator only once.
    const uniquePropagatorNames = Array.from(new Set(propagatorsValue));
    const validPropagators = [];
    uniquePropagatorNames.forEach((name)=>{
        const propagator = propagatorsFactory.get(name)?.();
        if (!propagator) {
            api_1.diag.warn(`Propagator "${name}" requested through configuration is unavailable.`);
            return;
        }
        validPropagators.push(propagator);
    });
    if (validPropagators.length === 0) {
        // null to signal that the default should **not** be used in its place.
        return null;
    } else if (uniquePropagatorNames.length === 1) {
        return validPropagators[0];
    } else {
        return new core_1.CompositePropagator({
            propagators: validPropagators
        });
    }
}
exports.getPropagatorFromConfiguration = getPropagatorFromConfiguration;
function setupContextManager(contextManager) {
    // null means 'do not register'
    if (contextManager === null) {
        return;
    }
    // undefined means 'register default'
    if (contextManager === undefined) {
        const defaultContextManager = new context_async_hooks_1.AsyncLocalStorageContextManager();
        defaultContextManager.enable();
        api_1.context.setGlobalContextManager(defaultContextManager);
        return;
    }
    contextManager.enable();
    api_1.context.setGlobalContextManager(contextManager);
}
exports.setupContextManager = setupContextManager;
function setupDefaultContextManager() {
    const defaultContextManager = new context_async_hooks_1.AsyncLocalStorageContextManager();
    defaultContextManager.enable();
    api_1.context.setGlobalContextManager(defaultContextManager);
}
exports.setupDefaultContextManager = setupDefaultContextManager;
function setupPropagator(propagator) {
    // null means 'do not register'
    if (propagator === null) {
        return;
    }
    // undefined means 'register default'
    if (propagator === undefined) {
        api_1.propagation.setGlobalPropagator(new core_1.CompositePropagator({
            propagators: [
                new core_1.W3CTraceContextPropagator(),
                new core_1.W3CBaggagePropagator()
            ]
        }));
        return;
    }
    api_1.propagation.setGlobalPropagator(propagator);
}
exports.setupPropagator = setupPropagator;
function getKeyListFromObjectArray(obj) {
    if (!obj || obj.length === 0) {
        return undefined;
    }
    return obj.map((item)=>Object.keys(item)).reduce((prev, curr)=>prev.concat(curr), []);
}
exports.getKeyListFromObjectArray = getKeyListFromObjectArray;
function getNonNegativeNumberFromEnv(envVarName) {
    const value = (0, core_1.getNumberFromEnv)(envVarName);
    if (value != null && value <= 0) {
        api_1.diag.warn(`${envVarName} (${value}) is invalid, expected number greater than 0, using default.`);
        return undefined;
    }
    return value;
}
exports.getNonNegativeNumberFromEnv = getNonNegativeNumberFromEnv;
function getPeriodicExportingMetricReaderFromEnv(exporter) {
    const defaultTimeoutMillis = 30000;
    const defaultIntervalMillis = 60000;
    const rawExportIntervalMillis = getNonNegativeNumberFromEnv('OTEL_METRIC_EXPORT_INTERVAL');
    const rawExportTimeoutMillis = getNonNegativeNumberFromEnv('OTEL_METRIC_EXPORT_TIMEOUT');
    // Apply defaults
    const exportIntervalMillis = rawExportIntervalMillis ?? defaultIntervalMillis;
    let exportTimeoutMillis = rawExportTimeoutMillis ?? defaultTimeoutMillis;
    // Ensure timeout doesn't exceed interval
    if (exportTimeoutMillis > exportIntervalMillis) {
        // determine which env vars were set and which ones defaulted for logging purposes
        const timeoutSource = rawExportTimeoutMillis != null ? rawExportTimeoutMillis.toString() : `${defaultTimeoutMillis}, default`;
        const intervalSource = rawExportIntervalMillis != null ? rawExportIntervalMillis.toString() : `${defaultIntervalMillis}, default`;
        const bothSetByUser = rawExportTimeoutMillis != null && rawExportIntervalMillis != null;
        const logMessage = `OTEL_METRIC_EXPORT_TIMEOUT (${timeoutSource}) is greater than OTEL_METRIC_EXPORT_INTERVAL (${intervalSource}). Clamping timeout to interval value.`;
        // only bother users if they explicitly set both values.
        if (bothSetByUser) {
            api_1.diag.warn(logMessage);
        } else {
            api_1.diag.info(logMessage);
        }
        exportTimeoutMillis = exportIntervalMillis;
    }
    return new sdk_metrics_1.PeriodicExportingMetricReader({
        exportTimeoutMillis,
        exportIntervalMillis,
        exporter
    });
}
exports.getPeriodicExportingMetricReaderFromEnv = getPeriodicExportingMetricReaderFromEnv;
function getOtlpMetricExporterFromEnv() {
    const protocol = ((0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_PROTOCOL') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_PROTOCOL'))?.trim() || 'http/protobuf'; // Using || to also fall back on empty string
    switch(protocol){
        case 'grpc':
            return new exporter_metrics_otlp_grpc_1.OTLPMetricExporter();
        case 'http/json':
            return new exporter_metrics_otlp_http_1.OTLPMetricExporter();
        case 'http/protobuf':
            return new exporter_metrics_otlp_proto_1.OTLPMetricExporter();
    }
    api_1.diag.warn(`Unsupported OTLP metrics protocol: "${protocol}". Using http/protobuf.`);
    return new exporter_metrics_otlp_proto_1.OTLPMetricExporter();
}
exports.getOtlpMetricExporterFromEnv = getOtlpMetricExporterFromEnv;
/**
 * Get LoggerProviderConfig from environment variables.
 */ function getLoggerProviderConfigFromEnv() {
    return {
        logRecordLimits: {
            attributeCountLimit: getNonNegativeNumberFromEnv('OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT') ?? getNonNegativeNumberFromEnv('OTEL_ATTRIBUTE_COUNT_LIMIT'),
            attributeValueLengthLimit: getNonNegativeNumberFromEnv('OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT') ?? getNonNegativeNumberFromEnv('OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT')
        }
    };
}
exports.getLoggerProviderConfigFromEnv = getLoggerProviderConfigFromEnv;
/**
 * Get configuration for BatchLogRecordProcessor from environment variables.
 */ function getBatchLogRecordProcessorConfigFromEnv() {
    return {
        maxQueueSize: getNonNegativeNumberFromEnv('OTEL_BLRP_MAX_QUEUE_SIZE'),
        scheduledDelayMillis: getNonNegativeNumberFromEnv('OTEL_BLRP_SCHEDULE_DELAY'),
        exportTimeoutMillis: getNonNegativeNumberFromEnv('OTEL_BLRP_EXPORT_TIMEOUT'),
        maxExportBatchSize: getNonNegativeNumberFromEnv('OTEL_BLRP_MAX_EXPORT_BATCH_SIZE')
    };
}
exports.getBatchLogRecordProcessorConfigFromEnv = getBatchLogRecordProcessorConfigFromEnv;
function getBatchLogRecordProcessorFromEnv(exporter) {
    return new sdk_logs_1.BatchLogRecordProcessor(exporter, getBatchLogRecordProcessorConfigFromEnv());
}
exports.getBatchLogRecordProcessorFromEnv = getBatchLogRecordProcessorFromEnv; //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-node/build/src/sdk.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NodeSDK = void 0;
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const api_logs_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api-logs/build/esm/index.js [instrumentation] (ecmascript)");
const instrumentation_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/index.js [instrumentation] (ecmascript)");
const resources_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/index.js [instrumentation] (ecmascript)");
const sdk_logs_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/index.js [instrumentation] (ecmascript)");
const exporter_logs_otlp_http_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/index.js [instrumentation] (ecmascript)");
const exporter_logs_otlp_grpc_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-grpc/build/src/index.js [instrumentation] (ecmascript)");
const exporter_logs_otlp_proto_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-logs-otlp-proto/build/esm/index.js [instrumentation] (ecmascript)");
const exporter_prometheus_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/exporter-prometheus/build/src/index.js [instrumentation] (ecmascript)");
const sdk_metrics_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/index.js [instrumentation] (ecmascript)");
const sdk_trace_base_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-base/build/esm/index.js [instrumentation] (ecmascript)");
const sdk_trace_node_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-node/build/src/index.js [instrumentation] (ecmascript)");
const semantic_conventions_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [instrumentation] (ecmascript)");
const core_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
const utils_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-node/build/src/utils.js [instrumentation] (ecmascript)");
/**
 *
 * @returns MetricReader[] if appropriate environment variables are configured
 */ function getMetricReadersFromEnv() {
    const metricReaders = [];
    const enabledExporters = Array.from(new Set((0, core_1.getStringListFromEnv)('OTEL_METRICS_EXPORTER') ?? []));
    if (enabledExporters.length === 0) {
        api_1.diag.debug('OTEL_METRICS_EXPORTER is empty. Using default otlp exporter.');
        enabledExporters.push('otlp');
    }
    if (enabledExporters.includes('none')) {
        api_1.diag.info(`OTEL_METRICS_EXPORTER contains "none". Metric provider will not be initialized.`);
        return metricReaders;
    }
    enabledExporters.forEach((exporter)=>{
        if (exporter === 'otlp') {
            metricReaders.push((0, utils_1.getPeriodicExportingMetricReaderFromEnv)((0, utils_1.getOtlpMetricExporterFromEnv)()));
        } else if (exporter === 'console') {
            metricReaders.push(new sdk_metrics_1.PeriodicExportingMetricReader({
                exporter: new sdk_metrics_1.ConsoleMetricExporter()
            }));
        } else if (exporter === 'prometheus') {
            metricReaders.push(new exporter_prometheus_1.PrometheusExporter());
        } else {
            api_1.diag.warn(`Unsupported OTEL_METRICS_EXPORTER value: "${exporter}". Supported values are: otlp, console, prometheus, none.`);
        }
    });
    return metricReaders;
}
/**
 * A setup helper for the OpenTelemetry SDKs (logs, metrics, traces).
 * <p> After successful setup using {@link NodeSDK#start()}, use `@opentelemetry/api` to obtain the registered components.
 * <p> Use the shutdown handler {@link NodeSDK#shutdown()} to ensure your telemetry is exported before the process exits.
 *
 * @example <caption> Register SDK by using environment variables </caption>
 *    const nodeSdk = new NodeSDK(); // providing no options uses OTEL_* environment variables for SDK setup.
 *    nodeSdk.start(); // registers all configured SDK components
 * @example <caption> Override environment variable config with your own components </caption>
 *    const nodeSdk = new NodeSDK({
 *      // override the list of metric reader with your own options and ignore environment variable config
 *      // explore the docs of other options to learn more!
 *      metricReaders: [ new PeriodicExportingMetricReader({
 *        exporter: new OTLPMetricsExporter()
 *        })]
 *    });
 *    nodeSdk.start(); // registers all configured SDK components
 */ class NodeSDK {
    _tracerProviderConfig;
    _loggerProviderConfig;
    _meterProviderConfig;
    _instrumentations;
    _resource;
    _resourceDetectors;
    _autoDetectResources;
    _tracerProvider;
    _loggerProvider;
    _meterProvider;
    _serviceName;
    _configuration;
    _disabled;
    /**
     * Create a new NodeJS SDK instance
     */ constructor(configuration = {}){
        if ((0, core_1.getBooleanFromEnv)('OTEL_SDK_DISABLED')) {
            this._disabled = true;
        // Functions with possible side-effects are set
        // to no-op via the _disabled flag
        }
        const logLevel = (0, core_1.getStringFromEnv)('OTEL_LOG_LEVEL');
        if (logLevel != null) {
            api_1.diag.setLogger(new api_1.DiagConsoleLogger(), {
                logLevel: (0, core_1.diagLogLevelFromString)(logLevel)
            });
        }
        this._configuration = configuration;
        this._resource = configuration.resource ?? (0, resources_1.defaultResource)();
        this._autoDetectResources = configuration.autoDetectResources ?? true;
        if (!this._autoDetectResources) {
            this._resourceDetectors = [];
        } else if (configuration.resourceDetectors != null) {
            this._resourceDetectors = configuration.resourceDetectors;
        } else if ((0, core_1.getStringFromEnv)('OTEL_NODE_RESOURCE_DETECTORS')) {
            this._resourceDetectors = (0, utils_1.getResourceDetectorsFromEnv)();
        } else {
            this._resourceDetectors = [
                resources_1.envDetector,
                resources_1.processDetector,
                resources_1.hostDetector
            ];
        }
        this._serviceName = configuration.serviceName;
        // If a tracer provider can be created from manual configuration, create it
        if (configuration.traceExporter || configuration.spanProcessor || configuration.spanProcessors) {
            const tracerProviderConfig = {};
            if (configuration.sampler) {
                tracerProviderConfig.sampler = configuration.sampler;
            }
            if (configuration.spanLimits) {
                tracerProviderConfig.spanLimits = configuration.spanLimits;
            }
            if (configuration.idGenerator) {
                tracerProviderConfig.idGenerator = configuration.idGenerator;
            }
            if (configuration.spanProcessor) {
                api_1.diag.warn("The 'spanProcessor' option is deprecated. Please use 'spanProcessors' instead.");
            }
            const spanProcessor = configuration.spanProcessor ?? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new sdk_trace_base_1.BatchSpanProcessor(configuration.traceExporter);
            const spanProcessors = configuration.spanProcessors ?? [
                spanProcessor
            ];
            this._tracerProviderConfig = {
                tracerConfig: tracerProviderConfig,
                spanProcessors
            };
        }
        if (configuration.logRecordProcessors) {
            this._loggerProviderConfig = {
                logRecordProcessors: configuration.logRecordProcessors
            };
        } else if (configuration.logRecordProcessor) {
            this._loggerProviderConfig = {
                logRecordProcessors: [
                    configuration.logRecordProcessor
                ]
            };
            api_1.diag.warn("The 'logRecordProcessor' option is deprecated. Please use 'logRecordProcessors' instead.");
        } else {
            this.configureLoggerProviderFromEnv();
        }
        if (configuration.metricReaders) {
            this._meterProviderConfig = {
                readers: configuration.metricReaders,
                views: configuration.views
            };
        } else if (configuration.metricReader) {
            this._meterProviderConfig = {
                readers: [
                    configuration.metricReader
                ],
                views: configuration.views
            };
            api_1.diag.warn("The 'metricReader' option is deprecated. Please use 'metricReaders' instead.");
        } else {
            this._meterProviderConfig = {
                readers: getMetricReadersFromEnv(),
                views: configuration.views
            };
        }
        this._instrumentations = configuration.instrumentations?.flat() ?? [];
    }
    /**
     * Call this method to construct SDK components and register them with the OpenTelemetry API.
     */ start() {
        if (this._disabled) {
            return;
        }
        (0, instrumentation_1.registerInstrumentations)({
            instrumentations: this._instrumentations
        });
        (0, utils_1.setupContextManager)(this._configuration?.contextManager);
        (0, utils_1.setupPropagator)(this._configuration?.textMapPropagator === null ? null // null means don't set, so we cannot fall back to env config.
         : this._configuration?.textMapPropagator ?? (0, utils_1.getPropagatorFromEnv)());
        if (this._autoDetectResources) {
            const internalConfig = {
                detectors: this._resourceDetectors
            };
            this._resource = this._resource.merge((0, resources_1.detectResources)(internalConfig));
        }
        this._resource = this._serviceName === undefined ? this._resource : this._resource.merge((0, resources_1.resourceFromAttributes)({
            [semantic_conventions_1.ATTR_SERVICE_NAME]: this._serviceName
        }));
        const spanProcessors = this._tracerProviderConfig ? this._tracerProviderConfig.spanProcessors : (0, utils_1.getSpanProcessorsFromEnv)();
        // Only register if there is a span processor
        if (spanProcessors.length > 0) {
            this._tracerProvider = new sdk_trace_node_1.NodeTracerProvider({
                ...this._configuration,
                resource: this._resource,
                spanProcessors
            });
            api_1.trace.setGlobalTracerProvider(this._tracerProvider);
        }
        if (this._loggerProviderConfig) {
            const loggerProvider = new sdk_logs_1.LoggerProvider({
                ...(0, utils_1.getLoggerProviderConfigFromEnv)(),
                resource: this._resource,
                processors: this._loggerProviderConfig.logRecordProcessors
            });
            this._loggerProvider = loggerProvider;
            api_logs_1.logs.setGlobalLoggerProvider(loggerProvider);
        }
        if (this._meterProviderConfig?.readers && // only register if there is a reader, otherwise we waste compute/memory.
        this._meterProviderConfig.readers.length > 0) {
            const meterProvider = new sdk_metrics_1.MeterProvider({
                resource: this._resource,
                views: this._meterProviderConfig?.views ?? [],
                readers: this._meterProviderConfig.readers
            });
            this._meterProvider = meterProvider;
            api_1.metrics.setGlobalMeterProvider(meterProvider);
            // TODO: This is a workaround to fix https://github.com/open-telemetry/opentelemetry-js/issues/3609
            // If the MeterProvider is not yet registered when instrumentations are registered, all metrics are dropped.
            // This code is obsolete once https://github.com/open-telemetry/opentelemetry-js/issues/3622 is implemented.
            for (const instrumentation of this._instrumentations){
                instrumentation.setMeterProvider(api_1.metrics.getMeterProvider());
            }
        }
    }
    shutdown() {
        const promises = [];
        if (this._tracerProvider) {
            promises.push(this._tracerProvider.shutdown());
        }
        if (this._loggerProvider) {
            promises.push(this._loggerProvider.shutdown());
        }
        if (this._meterProvider) {
            promises.push(this._meterProvider.shutdown());
        }
        return Promise.all(promises)// return void instead of the array from Promise.all
        .then(()=>{});
    }
    configureLoggerProviderFromEnv() {
        const enabledExporters = Array.from(new Set((0, core_1.getStringListFromEnv)('OTEL_LOGS_EXPORTER') ?? []));
        if (enabledExporters.length === 0) {
            api_1.diag.debug('OTEL_LOGS_EXPORTER is empty. Using default otlp exporter.');
            enabledExporters.push('otlp');
        }
        if (enabledExporters.includes('none')) {
            api_1.diag.info(`OTEL_LOGS_EXPORTER contains "none". Logger provider will not be initialized.`);
            return;
        }
        const exporters = [];
        enabledExporters.forEach((exporter)=>{
            if (exporter === 'otlp') {
                const protocol = ((0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_LOGS_PROTOCOL') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_PROTOCOL'))?.trim() || 'http/protobuf'; // Using || to also fall back on empty string
                switch(protocol){
                    case 'grpc':
                        exporters.push(new exporter_logs_otlp_grpc_1.OTLPLogExporter());
                        break;
                    case 'http/json':
                        exporters.push(new exporter_logs_otlp_http_1.OTLPLogExporter());
                        break;
                    case 'http/protobuf':
                        exporters.push(new exporter_logs_otlp_proto_1.OTLPLogExporter());
                        break;
                    default:
                        api_1.diag.warn(`Unsupported OTLP logs protocol: "${protocol}". Using http/protobuf.`);
                        exporters.push(new exporter_logs_otlp_proto_1.OTLPLogExporter());
                }
            } else if (exporter === 'console') {
                exporters.push(new sdk_logs_1.ConsoleLogRecordExporter());
            } else {
                api_1.diag.warn(`Unsupported OTEL_LOGS_EXPORTER value: "${exporter}". Supported values are: otlp, console, none.`);
            }
        });
        if (exporters.length > 0) {
            this._loggerProviderConfig = {
                logRecordProcessors: exporters.map((exporter)=>{
                    if (exporter instanceof sdk_logs_1.ConsoleLogRecordExporter) {
                        return new sdk_logs_1.SimpleLogRecordProcessor(exporter);
                    } else {
                        return (0, utils_1.getBatchLogRecordProcessorFromEnv)(exporter);
                    }
                })
            };
        }
    }
}
exports.NodeSDK = NodeSDK; //# sourceMappingURL=sdk.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-node/build/src/start.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startNodeSDK = void 0;
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
 */ const configuration_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/index.js [instrumentation] (ecmascript)");
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const utils_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-node/build/src/utils.js [instrumentation] (ecmascript)");
const instrumentation_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/instrumentation/build/esm/index.js [instrumentation] (ecmascript)");
/**
 * @experimental Function to start the OpenTelemetry Node SDK
 * @param sdkOptions
 */ function startNodeSDK(sdkOptions) {
    const configFactory = (0, configuration_1.createConfigFactory)();
    const config = configFactory.getConfigModel();
    if (config.disabled) {
        api_1.diag.info('OpenTelemetry SDK is disabled');
        return NOOP_SDK;
    }
    if (config.log_level != null) {
        api_1.diag.setLogger(new api_1.DiagConsoleLogger(), {
            logLevel: config.log_level
        });
    }
    (0, instrumentation_1.registerInstrumentations)({
        instrumentations: sdkOptions?.instrumentations?.flat() ?? []
    });
    (0, utils_1.setupDefaultContextManager)();
    (0, utils_1.setupPropagator)(sdkOptions?.textMapPropagator === null ? null // null means don't set.
     : sdkOptions?.textMapPropagator ?? (0, utils_1.getPropagatorFromConfiguration)(config));
    const shutdownFn = async ()=>{
        const promises = [];
        await Promise.all(promises);
    };
    return {
        shutdown: shutdownFn
    };
}
exports.startNodeSDK = startNodeSDK;
const NOOP_SDK = {
    shutdown: async ()=>{}
}; //# sourceMappingURL=start.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-node/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startNodeSDK = exports.NodeSDK = exports.tracing = exports.resources = exports.node = exports.metrics = exports.logs = exports.core = exports.contextBase = exports.api = void 0;
// This is a meta-package, and these exist in to re-export *all* items from
// the individual packages as individual _namespaces_, so wildcard exports are
// appropriate here. Otherwise, it'd be a pain to enumerate and keep things
// in-sync with all the upstream packages.
/* eslint-disable no-restricted-syntax */ exports.api = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
exports.contextBase = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
exports.core = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
exports.logs = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-logs/build/esm/index.js [instrumentation] (ecmascript)");
exports.metrics = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/index.js [instrumentation] (ecmascript)");
exports.node = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-node/build/src/index.js [instrumentation] (ecmascript)");
exports.resources = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/index.js [instrumentation] (ecmascript)");
exports.tracing = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-trace-base/build/esm/index.js [instrumentation] (ecmascript)");
/* eslint-enable no-restricted-syntax */ var sdk_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-node/build/src/sdk.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "NodeSDK", {
    enumerable: true,
    get: function() {
        return sdk_1.NodeSDK;
    }
});
var start_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-node/build/src/start.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "startNodeSDK", {
    enumerable: true,
    get: function() {
        return start_1.startNodeSDK;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/configModel.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializeDefaultConfiguration = void 0;
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
function initializeDefaultConfiguration() {
    const config = {
        disabled: false,
        log_level: api_1.DiagLogLevel.INFO,
        resource: {},
        attribute_limits: {
            attribute_count_limit: 128
        }
    };
    return config;
}
exports.initializeDefaultConfiguration = initializeDefaultConfiguration; //# sourceMappingURL=configModel.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/meterProviderModel.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InstrumentType = exports.ExporterDefaultHistogramAggregation = exports.ExporterTemporalityPreference = exports.ExperimentalPrometheusTranslationStrategy = exports.ExemplarFilter = exports.initializeDefaultMeterProviderConfiguration = void 0;
function initializeDefaultMeterProviderConfiguration() {
    return {
        readers: [],
        views: [],
        exemplar_filter: ExemplarFilter.TraceBased
    };
}
exports.initializeDefaultMeterProviderConfiguration = initializeDefaultMeterProviderConfiguration;
var ExemplarFilter;
(function(ExemplarFilter) {
    ExemplarFilter["AlwaysOff"] = "always_off";
    ExemplarFilter["AlwaysOn"] = "always_on";
    ExemplarFilter["TraceBased"] = "trace_based";
})(ExemplarFilter = exports.ExemplarFilter || (exports.ExemplarFilter = {}));
var ExperimentalPrometheusTranslationStrategy;
(function(ExperimentalPrometheusTranslationStrategy) {
    ExperimentalPrometheusTranslationStrategy["UnderscoreEscapingWithSuffixes"] = "underscore_escaping_with_suffixes";
    ExperimentalPrometheusTranslationStrategy["UnderscoreEscapingWithoutSuffixes"] = "underscore_escaping_without_suffixes";
    ExperimentalPrometheusTranslationStrategy["NoUtf8EscapingWithSuffixes"] = "no_utf8_escaping_with_suffixes";
    ExperimentalPrometheusTranslationStrategy["NoTranslation"] = "no_translation";
})(ExperimentalPrometheusTranslationStrategy = exports.ExperimentalPrometheusTranslationStrategy || (exports.ExperimentalPrometheusTranslationStrategy = {}));
var ExporterTemporalityPreference;
(function(ExporterTemporalityPreference) {
    ExporterTemporalityPreference["Cumulative"] = "cumulative";
    ExporterTemporalityPreference["Delta"] = "delta";
    ExporterTemporalityPreference["LowMemory"] = "low_memory";
})(ExporterTemporalityPreference = exports.ExporterTemporalityPreference || (exports.ExporterTemporalityPreference = {}));
var ExporterDefaultHistogramAggregation;
(function(ExporterDefaultHistogramAggregation) {
    ExporterDefaultHistogramAggregation["Base2ExponentialBucketHistogram"] = "base2_exponential_bucket_histogram";
    ExporterDefaultHistogramAggregation["ExplicitBucketHistogram"] = "explicit_bucket_histogram";
})(ExporterDefaultHistogramAggregation = exports.ExporterDefaultHistogramAggregation || (exports.ExporterDefaultHistogramAggregation = {}));
var InstrumentType;
(function(InstrumentType) {
    InstrumentType["Counter"] = "counter";
    InstrumentType["Gauge"] = "gauge";
    InstrumentType["Histogram"] = "histogram";
    InstrumentType["ObservableCounter"] = "observable_counter";
    InstrumentType["ObservableGauge"] = "observable_gauge";
    InstrumentType["ObservableUpDownCounter"] = "observable_up_down_counter";
    InstrumentType["UpDownCounter"] = "up_down_counter";
})(InstrumentType = exports.InstrumentType || (exports.InstrumentType = {})); //# sourceMappingURL=meterProviderModel.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/commonModel.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SeverityNumber = exports.OtlpHttpEncoding = void 0;
var OtlpHttpEncoding;
(function(OtlpHttpEncoding) {
    OtlpHttpEncoding["JSON"] = "json";
    OtlpHttpEncoding["Protobuf"] = "protobuf";
})(OtlpHttpEncoding = exports.OtlpHttpEncoding || (exports.OtlpHttpEncoding = {}));
var SeverityNumber;
(function(SeverityNumber) {
    SeverityNumber["DEBUG"] = "debug";
    SeverityNumber["DEBUG2"] = "debug2";
    SeverityNumber["DEBUG3"] = "debug3";
    SeverityNumber["DEBUG4"] = "debug4";
    SeverityNumber["ERROR"] = "error";
    SeverityNumber["ERROR2"] = "error2";
    SeverityNumber["ERROR3"] = "error3";
    SeverityNumber["ERROR4"] = "error4";
    SeverityNumber["FATAL"] = "fatal";
    SeverityNumber["FATAL2"] = "fatal2";
    SeverityNumber["FATAL3"] = "fatal3";
    SeverityNumber["FATAL4"] = "fatal4";
    SeverityNumber["INFO"] = "info";
    SeverityNumber["INFO2"] = "info2";
    SeverityNumber["INFO3"] = "info3";
    SeverityNumber["INFO4"] = "info4";
    SeverityNumber["TRACE"] = "trace";
    SeverityNumber["TRACE2"] = "trace2";
    SeverityNumber["TRACE3"] = "trace3";
    SeverityNumber["TRACE4"] = "trace4";
    SeverityNumber["WARN"] = "warn";
    SeverityNumber["WARN2"] = "warn2";
    SeverityNumber["WARN3"] = "warn3";
    SeverityNumber["WARN4"] = "warn4";
})(SeverityNumber = exports.SeverityNumber || (exports.SeverityNumber = {})); //# sourceMappingURL=commonModel.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/tracerProviderModel.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializeDefaultTracerProviderConfiguration = void 0;
function initializeDefaultTracerProviderConfiguration() {
    return {
        processors: [],
        limits: {
            attribute_count_limit: 128,
            event_count_limit: 128,
            link_count_limit: 128,
            event_attribute_count_limit: 128,
            link_attribute_count_limit: 128
        },
        sampler: {
            parent_based: {
                root: {
                    always_on: undefined
                },
                remote_parent_sampled: {
                    always_on: undefined
                },
                remote_parent_not_sampled: {
                    always_off: undefined
                },
                local_parent_sampled: {
                    always_on: undefined
                },
                local_parent_not_sampled: {
                    always_off: undefined
                }
            }
        }
    };
}
exports.initializeDefaultTracerProviderConfiguration = initializeDefaultTracerProviderConfiguration; //# sourceMappingURL=tracerProviderModel.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/loggerProviderModel.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initializeDefaultLoggerProviderConfiguration = void 0;
function initializeDefaultLoggerProviderConfiguration() {
    return {
        processors: [],
        limits: {
            attribute_count_limit: 128
        },
        'logger_configurator/development': {}
    };
}
exports.initializeDefaultLoggerProviderConfiguration = initializeDefaultLoggerProviderConfiguration; //# sourceMappingURL=loggerProviderModel.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHttpTlsConfig = exports.getGrpcTlsConfig = exports.envVariableSubstitution = exports.getStringListFromConfigFile = exports.getStringFromConfigFile = exports.getNumberListFromConfigFile = exports.getNumberFromConfigFile = exports.getBooleanListFromConfigFile = exports.getBooleanFromConfigFile = void 0;
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
 */ const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const core_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
const util_1 = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
/**
 * Retrieves a boolean value from a configuration file parameter.
 * - Trims leading and trailing whitespace and ignores casing.
 * - Returns `undefined` if the value is empty, unset, or contains only whitespace.
 * - Returns `undefined` and a warning for values that cannot be mapped to a boolean.
 *
 * @param {unknown} value - The value from the config file.
 * @returns {boolean} - The boolean value or `false` if the environment variable is unset empty, unset, or contains only whitespace.
 */ function getBooleanFromConfigFile(value) {
    const raw = envVariableSubstitution(value)?.trim().toLowerCase();
    if (raw === 'true') {
        return true;
    } else if (raw === 'false') {
        return false;
    } else if (raw == null || raw === '') {
        return undefined;
    } else {
        api_1.diag.warn(`Unknown value ${(0, util_1.inspect)(raw)}, expected 'true' or 'false'`);
        return undefined;
    }
}
exports.getBooleanFromConfigFile = getBooleanFromConfigFile;
/**
 * Retrieves a list of booleans from a configuration file parameter.
 * - Uses ',' as the delimiter.
 * - Trims leading and trailing whitespace from each entry.
 * - Excludes empty entries.
 * - Returns `undefined` if the variable is empty or contains only whitespace.
 * - Returns an empty array if all entries are empty or whitespace.
 *
 * @param {unknown} value - The value from the config file.
 * @returns {boolean[] | undefined} - The list of strings or `undefined`.
 */ function getBooleanListFromConfigFile(value) {
    const list = getStringFromConfigFile(value)?.split(',');
    if (list) {
        const filteredList = [];
        for(let i = 0; i < list.length; i++){
            const element = getBooleanFromConfigFile(list[i]);
            if (element != null) {
                filteredList.push(element);
            }
        }
        return filteredList;
    }
    return list;
}
exports.getBooleanListFromConfigFile = getBooleanListFromConfigFile;
/**
 * Retrieves a number from a configuration file parameter.
 * - Returns `undefined` if the environment variable is empty, unset, or contains only whitespace.
 * - Returns `undefined` and a warning if is not a number.
 * - Returns a number in all other cases.
 *
 * @param {unknown} value - The value from the config file.
 * @returns {number | undefined} - The number value or `undefined`.
 */ function getNumberFromConfigFile(value) {
    const raw = envVariableSubstitution(value)?.trim();
    if (raw == null || raw.trim() === '') {
        return undefined;
    }
    const n = Number(raw);
    if (isNaN(n)) {
        api_1.diag.warn(`Unknown value ${(0, util_1.inspect)(raw)}, expected a number`);
        return undefined;
    }
    return n;
}
exports.getNumberFromConfigFile = getNumberFromConfigFile;
/**
 * Retrieves a list of numbers from a configuration file parameter.
 * - Uses ',' as the delimiter.
 * - Trims leading and trailing whitespace from each entry.
 * - Excludes empty entries.
 * - Returns `undefined` if the variable is empty or contains only whitespace.
 * - Returns an empty array if all entries are empty or whitespace.
 *
 * @param {unknown} value - The value from the config file.
 * @returns {number[] | undefined} - The list of numbers or `undefined`.
 */ function getNumberListFromConfigFile(value) {
    const list = getStringFromConfigFile(value)?.split(',');
    if (list) {
        const filteredList = [];
        for(let i = 0; i < list.length; i++){
            const element = getNumberFromConfigFile(list[i]);
            if (element || element === 0) {
                filteredList.push(element);
            }
        }
        return filteredList;
    }
    return list;
}
exports.getNumberListFromConfigFile = getNumberListFromConfigFile;
/**
 * Retrieves a string from a configuration file parameter.
 * - Returns `undefined` if the variable is empty, unset, or contains only whitespace.
 *
 * @param {unknown} value - The value from the config file.
 * @returns {string | undefined} - The string value or `undefined`.
 */ function getStringFromConfigFile(value) {
    const raw = envVariableSubstitution(value)?.trim();
    if (value == null || raw === '') {
        return undefined;
    }
    return raw;
}
exports.getStringFromConfigFile = getStringFromConfigFile;
/**
 * Retrieves a list of strings from a configuration file parameter.
 * - Uses ',' as the delimiter.
 * - Trims leading and trailing whitespace from each entry.
 * - Excludes empty entries.
 * - Returns `undefined` if the variable is empty or contains only whitespace.
 * - Returns an empty array if all entries are empty or whitespace.
 *
 * @param {unknown} value - The value from the config file.
 * @returns {string[] | undefined} - The list of strings or `undefined`.
 */ function getStringListFromConfigFile(value) {
    value = envVariableSubstitution(value);
    return getStringFromConfigFile(value)?.split(',').map((v)=>v.trim()).filter((s)=>s !== '');
}
exports.getStringListFromConfigFile = getStringListFromConfigFile;
function envVariableSubstitution(value) {
    if (value == null) {
        return undefined;
    }
    const matches = String(value).match(/\$\{[a-zA-Z0-9,=/_:.-]*\}/g);
    if (matches) {
        let stringValue = String(value);
        for (const match of matches){
            const v = match.substring(2, match.length - 1).split(':-');
            const defaultValue = v.length === 2 ? v[1] : '';
            const replacement = (0, core_1.getStringFromEnv)(v[0]) || defaultValue;
            stringValue = stringValue.replace(match, replacement);
        }
        return stringValue;
    }
    return String(value);
}
exports.envVariableSubstitution = envVariableSubstitution;
function getGrpcTlsConfig(certificateFile, clientKeyFile, clientCertificateFile, insecure) {
    if (certificateFile || clientKeyFile || clientCertificateFile) {
        const tls = {};
        if (certificateFile) {
            tls.ca_file = certificateFile;
        }
        if (clientKeyFile) {
            tls.key_file = clientKeyFile;
        }
        if (clientCertificateFile) {
            tls.cert_file = clientCertificateFile;
        }
        if (insecure !== undefined) {
            tls.insecure = insecure;
        }
        return tls;
    }
    return undefined;
}
exports.getGrpcTlsConfig = getGrpcTlsConfig;
function getHttpTlsConfig(certificateFile, clientKeyFile, clientCertificateFile) {
    if (certificateFile || clientKeyFile || clientCertificateFile) {
        const tls = {};
        if (certificateFile) {
            tls.ca_file = certificateFile;
        }
        if (clientKeyFile) {
            tls.key_file = clientKeyFile;
        }
        if (clientCertificateFile) {
            tls.cert_file = clientCertificateFile;
        }
        return tls;
    }
    return undefined;
}
exports.getHttpTlsConfig = getHttpTlsConfig; //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/EnvironmentConfigFactory.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setLoggerProvider = exports.setMeterProvider = exports.setTracerProvider = exports.setPropagators = exports.setAttributeLimits = exports.setResources = exports.EnvironmentConfigFactory = void 0;
const configModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/configModel.js [instrumentation] (ecmascript)");
const core_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
const meterProviderModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/meterProviderModel.js [instrumentation] (ecmascript)");
const commonModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/commonModel.js [instrumentation] (ecmascript)");
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
const tracerProviderModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/tracerProviderModel.js [instrumentation] (ecmascript)");
const loggerProviderModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/loggerProviderModel.js [instrumentation] (ecmascript)");
const utils_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/utils.js [instrumentation] (ecmascript)");
/**
 * EnvironmentConfigProvider provides a configuration based on environment variables.
 */ class EnvironmentConfigFactory {
    _config;
    constructor(){
        this._config = (0, configModel_1.initializeDefaultConfiguration)();
        this._config.disabled = (0, core_1.getBooleanFromEnv)('OTEL_SDK_DISABLED');
        const logLevel = (0, core_1.diagLogLevelFromString)((0, core_1.getStringFromEnv)('OTEL_LOG_LEVEL'));
        if (logLevel) {
            this._config.log_level = logLevel;
        }
        const nodeResourceDetectors = (0, core_1.getStringListFromEnv)('OTEL_NODE_RESOURCE_DETECTORS');
        if (nodeResourceDetectors) {
            this._config.node_resource_detectors = nodeResourceDetectors;
        }
        setResources(this._config);
        setAttributeLimits(this._config);
        setPropagators(this._config);
        setTracerProvider(this._config);
        setMeterProvider(this._config);
        setLoggerProvider(this._config);
    }
    getConfigModel() {
        return this._config;
    }
}
exports.EnvironmentConfigFactory = EnvironmentConfigFactory;
function setResources(config) {
    if (config.resource == null) {
        config.resource = {};
    }
    const resourceAttrList = (0, core_1.getStringFromEnv)('OTEL_RESOURCE_ATTRIBUTES');
    const list = (0, core_1.getStringListFromEnv)('OTEL_RESOURCE_ATTRIBUTES');
    const serviceName = (0, core_1.getStringFromEnv)('OTEL_SERVICE_NAME');
    if (serviceName) {
        config.resource.attributes = [
            {
                name: 'service.name',
                value: serviceName,
                type: 'string'
            }
        ];
    }
    if (list && list.length > 0) {
        config.resource.attributes_list = resourceAttrList;
        if (config.resource.attributes == null) {
            config.resource.attributes = [];
        }
        for(let i = 0; i < list.length; i++){
            const element = list[i].split('=');
            if (element[0] !== 'service.name' || element[0] === 'service.name' && serviceName === undefined) {
                config.resource.attributes.push({
                    name: element[0],
                    value: element[1],
                    type: 'string'
                });
            }
        }
    }
}
exports.setResources = setResources;
function setAttributeLimits(config) {
    const attributeValueLengthLimit = (0, core_1.getNumberFromEnv)('OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT');
    if (attributeValueLengthLimit && attributeValueLengthLimit > 0) {
        if (config.attribute_limits == null) {
            config.attribute_limits = {
                attribute_count_limit: 128
            };
        }
        config.attribute_limits.attribute_value_length_limit = attributeValueLengthLimit;
    }
    const attributeCountLimit = (0, core_1.getNumberFromEnv)('OTEL_ATTRIBUTE_COUNT_LIMIT');
    if (attributeCountLimit) {
        if (config.attribute_limits == null) {
            config.attribute_limits = {
                attribute_count_limit: attributeCountLimit
            };
        } else {
            config.attribute_limits.attribute_count_limit = attributeCountLimit;
        }
    }
}
exports.setAttributeLimits = setAttributeLimits;
function setPropagators(config) {
    if (config.propagator == null) {
        config.propagator = {};
    }
    const composite = (0, core_1.getStringListFromEnv)('OTEL_PROPAGATORS');
    if (composite && composite.length > 0) {
        config.propagator.composite = [];
        for(let i = 0; i < composite.length; i++){
            config.propagator.composite.push({
                [composite[i]]: null
            });
        }
    }
    const compositeList = (0, core_1.getStringFromEnv)('OTEL_PROPAGATORS');
    if (compositeList) {
        config.propagator.composite_list = compositeList;
    }
}
exports.setPropagators = setPropagators;
function setTracerProvider(config) {
    const exportersType = Array.from(new Set((0, core_1.getStringListFromEnv)('OTEL_TRACES_EXPORTER')));
    if (exportersType.length === 0) {
        return;
    }
    if (exportersType.includes('none')) {
        api_1.diag.info(`OTEL_TRACES_EXPORTER contains "none". Tracer provider will not be initialized.`);
        return;
    }
    config.tracer_provider = (0, tracerProviderModel_1.initializeDefaultTracerProviderConfiguration)();
    const attributeValueLengthLimit = (0, core_1.getNumberFromEnv)('OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT');
    if (attributeValueLengthLimit) {
        config.tracer_provider.limits.attribute_value_length_limit = attributeValueLengthLimit;
    }
    const attributeCountLimit = (0, core_1.getNumberFromEnv)('OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT');
    if (attributeCountLimit) {
        config.tracer_provider.limits.attribute_count_limit = attributeCountLimit;
    }
    const eventCountLimit = (0, core_1.getNumberFromEnv)('OTEL_SPAN_EVENT_COUNT_LIMIT');
    if (eventCountLimit) {
        config.tracer_provider.limits.event_count_limit = eventCountLimit;
    }
    const linkCountLimit = (0, core_1.getNumberFromEnv)('OTEL_SPAN_LINK_COUNT_LIMIT');
    if (linkCountLimit) {
        config.tracer_provider.limits.link_count_limit = linkCountLimit;
    }
    const eventAttributeCountLimit = (0, core_1.getNumberFromEnv)('OTEL_EVENT_ATTRIBUTE_COUNT_LIMIT');
    if (eventAttributeCountLimit) {
        config.tracer_provider.limits.event_attribute_count_limit = eventAttributeCountLimit;
    }
    const linkAttributeCountLimit = (0, core_1.getNumberFromEnv)('OTEL_LINK_ATTRIBUTE_COUNT_LIMIT');
    if (linkAttributeCountLimit) {
        config.tracer_provider.limits.link_attribute_count_limit = linkAttributeCountLimit;
    }
    const batch = {
        exporter: {}
    };
    const scheduleDelay = (0, core_1.getNumberFromEnv)('OTEL_BSP_SCHEDULE_DELAY') ?? 5000;
    if (scheduleDelay) {
        batch.schedule_delay = scheduleDelay;
    }
    const exportTimeout = (0, core_1.getNumberFromEnv)('OTEL_BSP_EXPORT_TIMEOUT') ?? 30000;
    if (exportTimeout) {
        batch.export_timeout = exportTimeout;
    }
    const maxQueueSize = (0, core_1.getNumberFromEnv)('OTEL_BSP_MAX_QUEUE_SIZE') ?? 2048;
    if (maxQueueSize) {
        batch.max_queue_size = maxQueueSize;
    }
    const maxExportBatchSize = (0, core_1.getNumberFromEnv)('OTEL_BSP_MAX_EXPORT_BATCH_SIZE') ?? 512;
    if (maxExportBatchSize) {
        batch.max_export_batch_size = maxExportBatchSize;
    }
    for(let i = 0; i < exportersType.length; i++){
        const exporterType = exportersType[i];
        const batchInfo = {
            ...batch
        };
        if (exporterType === 'console') {
            config.tracer_provider.processors.push({
                simple: {
                    exporter: {
                        console: {}
                    }
                }
            });
        } else {
            // 'otlp' and default
            const protocol = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_TRACES_PROTOCOL') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_PROTOCOL') ?? 'http/protobuf';
            const certificateFile = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_CERTIFICATE');
            const clientKeyFile = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_CLIENT_KEY');
            const clientCertificateFile = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE');
            const compression = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_TRACES_COMPRESSION') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_COMPRESSION');
            const timeout = (0, core_1.getNumberFromEnv)('OTEL_EXPORTER_OTLP_TRACES_TIMEOUT') ?? (0, core_1.getNumberFromEnv)('OTEL_EXPORTER_OTLP_TIMEOUT') ?? 10000;
            const headersList = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_TRACES_HEADERS') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_HEADERS');
            if (protocol === 'grpc') {
                delete batchInfo.exporter.otlp_http;
                batchInfo.exporter.otlp_grpc = {};
                const endpoint = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_TRACES_ENDPOINT') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_ENDPOINT') ?? 'http://localhost:4317';
                if (endpoint) {
                    batchInfo.exporter.otlp_grpc.endpoint = endpoint;
                }
                const tls = (0, utils_1.getGrpcTlsConfig)(certificateFile, clientKeyFile, clientCertificateFile);
                if (tls) {
                    batchInfo.exporter.otlp_grpc.tls = tls;
                }
                if (compression) {
                    batchInfo.exporter.otlp_grpc.compression = compression;
                }
                if (timeout) {
                    batchInfo.exporter.otlp_grpc.timeout = timeout;
                }
                if (headersList) {
                    batchInfo.exporter.otlp_grpc.headers_list = headersList;
                }
            } else {
                if (batchInfo.exporter.otlp_http == null) {
                    batchInfo.exporter.otlp_http = {};
                }
                const endpoint = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_TRACES_ENDPOINT') ?? ((0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_ENDPOINT') ? `${(0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_ENDPOINT')}/v1/traces` : 'http://localhost:4318/v1/traces');
                if (endpoint) {
                    batchInfo.exporter.otlp_http.endpoint = endpoint;
                }
                const tls = (0, utils_1.getHttpTlsConfig)(certificateFile, clientKeyFile, clientCertificateFile);
                if (tls) {
                    batchInfo.exporter.otlp_http.tls = tls;
                }
                if (compression) {
                    batchInfo.exporter.otlp_http.compression = compression;
                }
                if (timeout) {
                    batchInfo.exporter.otlp_http.timeout = timeout;
                }
                if (headersList) {
                    batchInfo.exporter.otlp_http.headers_list = headersList;
                }
                if (protocol === 'http/json') {
                    batchInfo.exporter.otlp_http.encoding = commonModel_1.OtlpHttpEncoding.JSON;
                } else if (protocol === 'http/protobuf') {
                    batchInfo.exporter.otlp_http.encoding = commonModel_1.OtlpHttpEncoding.Protobuf;
                }
            }
            config.tracer_provider.processors.push({
                batch: batchInfo
            });
        }
    }
}
exports.setTracerProvider = setTracerProvider;
function setMeterProvider(config) {
    const exportersType = Array.from(new Set((0, core_1.getStringListFromEnv)('OTEL_METRICS_EXPORTER')));
    if (exportersType.length === 0) {
        return;
    }
    if (exportersType.includes('none')) {
        api_1.diag.info(`OTEL_METRICS_EXPORTER contains "none". Meter provider will not be initialized.`);
        return;
    }
    config.meter_provider = (0, meterProviderModel_1.initializeDefaultMeterProviderConfiguration)();
    const readerPeriodic = {
        exporter: {}
    };
    const interval = (0, core_1.getNumberFromEnv)('OTEL_METRIC_EXPORT_INTERVAL') ?? 60000;
    if (interval) {
        readerPeriodic.interval = interval;
    }
    for(let i = 0; i < exportersType.length; i++){
        const exporterType = exportersType[i];
        if (exporterType === 'prometheus') {
            // Prometheus uses a pull reader
            const pullReader = {
                exporter: {
                    'prometheus/development': {
                        host: (0, core_1.getStringFromEnv)('OTEL_EXPORTER_PROMETHEUS_HOST') ?? 'localhost',
                        port: (0, core_1.getNumberFromEnv)('OTEL_EXPORTER_PROMETHEUS_PORT') ?? 9464,
                        without_scope_info: false,
                        without_target_info: false
                    }
                }
            };
            config.meter_provider.readers.push({
                pull: pullReader
            });
            continue;
        }
        const readerPeriodicInfo = {
            ...readerPeriodic
        };
        const timeout = (0, core_1.getNumberFromEnv)('OTEL_METRIC_EXPORT_TIMEOUT') ?? 30000;
        if (timeout) {
            readerPeriodicInfo.timeout = timeout;
        }
        if (exporterType === 'console') {
            readerPeriodicInfo.exporter = {
                console: {}
            };
        } else {
            // 'otlp' and default
            const protocol = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_PROTOCOL') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_PROTOCOL') ?? 'http/protobuf';
            const certificateFile = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_CERTIFICATE') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_CERTIFICATE');
            const clientKeyFile = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_CLIENT_KEY');
            const clientCertificateFile = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE');
            const compression = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_COMPRESSION') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_COMPRESSION');
            const timeoutExporter = (0, core_1.getNumberFromEnv)('OTEL_EXPORTER_OTLP_METRICS_TIMEOUT') ?? (0, core_1.getNumberFromEnv)('OTEL_EXPORTER_OTLP_TIMEOUT') ?? 10000;
            const headersList = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_HEADERS') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_HEADERS');
            const temporalityPreference = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE') ?? 'cumulative';
            const defaultHistogramAggregation = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_DEFAULT_HISTOGRAM_AGGREGATION') ?? 'explicit_bucket_histogram';
            if (protocol === 'grpc') {
                delete readerPeriodicInfo.exporter.otlp_http;
                readerPeriodicInfo.exporter.otlp_grpc = {};
                const endpoint = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_ENDPOINT') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_ENDPOINT') ?? 'http://localhost:4317';
                if (endpoint) {
                    readerPeriodicInfo.exporter.otlp_grpc.endpoint = endpoint;
                }
                const tls = (0, utils_1.getGrpcTlsConfig)(certificateFile, clientKeyFile, clientCertificateFile);
                if (tls) {
                    readerPeriodicInfo.exporter.otlp_grpc.tls = tls;
                }
                if (compression) {
                    readerPeriodicInfo.exporter.otlp_grpc.compression = compression;
                }
                if (timeoutExporter) {
                    readerPeriodicInfo.exporter.otlp_grpc.timeout = timeoutExporter;
                }
                if (headersList) {
                    readerPeriodicInfo.exporter.otlp_grpc.headers_list = headersList;
                }
                if (temporalityPreference) {
                    switch(temporalityPreference){
                        case 'cumulative':
                            readerPeriodicInfo.exporter.otlp_grpc.temporality_preference = meterProviderModel_1.ExporterTemporalityPreference.Cumulative;
                            break;
                        case 'delta':
                            readerPeriodicInfo.exporter.otlp_grpc.temporality_preference = meterProviderModel_1.ExporterTemporalityPreference.Delta;
                            break;
                        case 'low_memory':
                            readerPeriodicInfo.exporter.otlp_grpc.temporality_preference = meterProviderModel_1.ExporterTemporalityPreference.LowMemory;
                            break;
                        default:
                            readerPeriodicInfo.exporter.otlp_grpc.temporality_preference = meterProviderModel_1.ExporterTemporalityPreference.Cumulative;
                            break;
                    }
                }
                if (defaultHistogramAggregation) {
                    switch(defaultHistogramAggregation){
                        case 'explicit_bucket_histogram':
                            readerPeriodicInfo.exporter.otlp_grpc.default_histogram_aggregation = meterProviderModel_1.ExporterDefaultHistogramAggregation.ExplicitBucketHistogram;
                            break;
                        case 'base2_exponential_bucket_histogram':
                            readerPeriodicInfo.exporter.otlp_grpc.default_histogram_aggregation = meterProviderModel_1.ExporterDefaultHistogramAggregation.Base2ExponentialBucketHistogram;
                            break;
                        default:
                            readerPeriodicInfo.exporter.otlp_grpc.default_histogram_aggregation = meterProviderModel_1.ExporterDefaultHistogramAggregation.ExplicitBucketHistogram;
                            break;
                    }
                }
            } else {
                if (readerPeriodicInfo.exporter.otlp_http == null) {
                    readerPeriodicInfo.exporter.otlp_http = {};
                }
                const endpoint = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_METRICS_ENDPOINT') ?? ((0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_ENDPOINT') ? `${(0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_ENDPOINT')}/v1/metrics` : 'http://localhost:4318/v1/metrics');
                if (endpoint) {
                    readerPeriodicInfo.exporter.otlp_http.endpoint = endpoint;
                }
                const tls = (0, utils_1.getHttpTlsConfig)(certificateFile, clientKeyFile, clientCertificateFile);
                if (tls) {
                    readerPeriodicInfo.exporter.otlp_http.tls = tls;
                }
                if (compression) {
                    readerPeriodicInfo.exporter.otlp_http.compression = compression;
                }
                if (timeoutExporter) {
                    readerPeriodicInfo.exporter.otlp_http.timeout = timeoutExporter;
                }
                if (headersList) {
                    readerPeriodicInfo.exporter.otlp_http.headers_list = headersList;
                }
                if (temporalityPreference) {
                    switch(temporalityPreference){
                        case 'cumulative':
                            readerPeriodicInfo.exporter.otlp_http.temporality_preference = meterProviderModel_1.ExporterTemporalityPreference.Cumulative;
                            break;
                        case 'delta':
                            readerPeriodicInfo.exporter.otlp_http.temporality_preference = meterProviderModel_1.ExporterTemporalityPreference.Delta;
                            break;
                        case 'low_memory':
                            readerPeriodicInfo.exporter.otlp_http.temporality_preference = meterProviderModel_1.ExporterTemporalityPreference.LowMemory;
                            break;
                        default:
                            readerPeriodicInfo.exporter.otlp_http.temporality_preference = meterProviderModel_1.ExporterTemporalityPreference.Cumulative;
                            break;
                    }
                }
                if (defaultHistogramAggregation) {
                    switch(defaultHistogramAggregation){
                        case 'explicit_bucket_histogram':
                            readerPeriodicInfo.exporter.otlp_http.default_histogram_aggregation = meterProviderModel_1.ExporterDefaultHistogramAggregation.ExplicitBucketHistogram;
                            break;
                        case 'base2_exponential_bucket_histogram':
                            readerPeriodicInfo.exporter.otlp_http.default_histogram_aggregation = meterProviderModel_1.ExporterDefaultHistogramAggregation.Base2ExponentialBucketHistogram;
                            break;
                        default:
                            readerPeriodicInfo.exporter.otlp_http.default_histogram_aggregation = meterProviderModel_1.ExporterDefaultHistogramAggregation.ExplicitBucketHistogram;
                            break;
                    }
                }
                if (protocol === 'http/json') {
                    readerPeriodicInfo.exporter.otlp_http.encoding = commonModel_1.OtlpHttpEncoding.JSON;
                } else if (protocol === 'http/protobuf') {
                    readerPeriodicInfo.exporter.otlp_http.encoding = commonModel_1.OtlpHttpEncoding.Protobuf;
                }
            }
        }
        config.meter_provider.readers.push({
            periodic: readerPeriodicInfo
        });
    }
    const exemplarFilter = (0, core_1.getStringFromEnv)('OTEL_METRICS_EXEMPLAR_FILTER') ?? 'trace_based';
    if (exemplarFilter) {
        switch(exemplarFilter){
            case 'trace_based':
                config.meter_provider.exemplar_filter = meterProviderModel_1.ExemplarFilter.TraceBased;
                break;
            case 'always_on':
                config.meter_provider.exemplar_filter = meterProviderModel_1.ExemplarFilter.AlwaysOn;
                break;
            case 'always_off':
                config.meter_provider.exemplar_filter = meterProviderModel_1.ExemplarFilter.AlwaysOff;
                break;
            default:
                config.meter_provider.exemplar_filter = meterProviderModel_1.ExemplarFilter.TraceBased;
                break;
        }
    }
}
exports.setMeterProvider = setMeterProvider;
function setLoggerProvider(config) {
    const exportersType = Array.from(new Set((0, core_1.getStringListFromEnv)('OTEL_LOGS_EXPORTER')));
    if (exportersType.length === 0) {
        return;
    }
    if (exportersType.includes('none')) {
        api_1.diag.info(`OTEL_LOGS_EXPORTER contains "none". Logger provider will not be initialized.`);
        return;
    }
    config.logger_provider = (0, loggerProviderModel_1.initializeDefaultLoggerProviderConfiguration)();
    const attributeValueLengthLimit = (0, core_1.getNumberFromEnv)('OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT');
    const attributeCountLimit = (0, core_1.getNumberFromEnv)('OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT');
    if (attributeValueLengthLimit || attributeCountLimit) {
        if (attributeValueLengthLimit) {
            config.logger_provider.limits.attribute_value_length_limit = attributeValueLengthLimit;
        }
        if (attributeCountLimit) {
            config.logger_provider.limits.attribute_count_limit = attributeCountLimit;
        }
    }
    const batch = {
        exporter: {}
    };
    const scheduleDelay = (0, core_1.getNumberFromEnv)('OTEL_BLRP_SCHEDULE_DELAY') ?? 1000;
    if (scheduleDelay) {
        batch.schedule_delay = scheduleDelay;
    }
    const exportTimeout = (0, core_1.getNumberFromEnv)('OTEL_BLRP_EXPORT_TIMEOUT') ?? 30000;
    if (exportTimeout) {
        batch.export_timeout = exportTimeout;
    }
    const maxQueueSize = (0, core_1.getNumberFromEnv)('OTEL_BLRP_MAX_QUEUE_SIZE') ?? 2048;
    if (maxQueueSize) {
        batch.max_queue_size = maxQueueSize;
    }
    const maxExportBatchSize = (0, core_1.getNumberFromEnv)('OTEL_BLRP_MAX_EXPORT_BATCH_SIZE') ?? 512;
    if (maxExportBatchSize) {
        batch.max_export_batch_size = maxExportBatchSize;
    }
    for(let i = 0; i < exportersType.length; i++){
        const exporterType = exportersType[i];
        const batchInfo = {
            ...batch
        };
        if (exporterType === 'console') {
            config.logger_provider.processors.push({
                simple: {
                    exporter: {
                        console: {}
                    }
                }
            });
        } else {
            // 'otlp' and default
            const protocol = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_LOGS_PROTOCOL') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_PROTOCOL') ?? 'http/protobuf';
            const certificateFile = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_LOGS_CERTIFICATE') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_CERTIFICATE');
            const clientKeyFile = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_LOGS_CLIENT_KEY') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_CLIENT_KEY');
            const clientCertificateFile = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_LOGS_CLIENT_CERTIFICATE') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE');
            const compression = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_LOGS_COMPRESSION') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_COMPRESSION');
            const timeout = (0, core_1.getNumberFromEnv)('OTEL_EXPORTER_OTLP_LOGS_TIMEOUT') ?? (0, core_1.getNumberFromEnv)('OTEL_EXPORTER_OTLP_TIMEOUT') ?? 10000;
            const headersList = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_LOGS_HEADERS') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_HEADERS');
            if (protocol === 'grpc') {
                delete batchInfo.exporter.otlp_http;
                batchInfo.exporter.otlp_grpc = {};
                const endpoint = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_LOGS_ENDPOINT') ?? (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_ENDPOINT') ?? 'http://localhost:4317';
                if (endpoint) {
                    batchInfo.exporter.otlp_grpc.endpoint = endpoint;
                }
                const tls = (0, utils_1.getGrpcTlsConfig)(certificateFile, clientKeyFile, clientCertificateFile);
                if (tls) {
                    batchInfo.exporter.otlp_grpc.tls = tls;
                }
                if (compression) {
                    batchInfo.exporter.otlp_grpc.compression = compression;
                }
                if (timeout) {
                    batchInfo.exporter.otlp_grpc.timeout = timeout;
                }
                if (headersList) {
                    batchInfo.exporter.otlp_grpc.headers_list = headersList;
                }
            } else {
                if (batchInfo.exporter.otlp_http == null) {
                    batchInfo.exporter.otlp_http = {};
                }
                const endpoint = (0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_LOGS_ENDPOINT') ?? ((0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_ENDPOINT') ? `${(0, core_1.getStringFromEnv)('OTEL_EXPORTER_OTLP_ENDPOINT')}/v1/logs` : 'http://localhost:4318/v1/logs');
                if (endpoint) {
                    batchInfo.exporter.otlp_http.endpoint = endpoint;
                }
                const tls = (0, utils_1.getHttpTlsConfig)(certificateFile, clientKeyFile, clientCertificateFile);
                if (tls) {
                    batchInfo.exporter.otlp_http.tls = tls;
                }
                if (compression) {
                    batchInfo.exporter.otlp_http.compression = compression;
                }
                if (timeout) {
                    batchInfo.exporter.otlp_http.timeout = timeout;
                }
                if (headersList) {
                    batchInfo.exporter.otlp_http.headers_list = headersList;
                }
                if (protocol === 'http/json') {
                    batchInfo.exporter.otlp_http.encoding = commonModel_1.OtlpHttpEncoding.JSON;
                } else if (protocol === 'http/protobuf') {
                    batchInfo.exporter.otlp_http.encoding = commonModel_1.OtlpHttpEncoding.Protobuf;
                }
            }
            config.logger_provider.processors.push({
                batch: batchInfo
            });
        }
    }
}
exports.setLoggerProvider = setLoggerProvider; //# sourceMappingURL=EnvironmentConfigFactory.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/FileConfigFactory.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setLoggerProvider = exports.getSeverity = exports.setMeterProvider = exports.getTemporalityPreference = exports.setTracerProvider = exports.setPropagator = exports.setAttributeLimits = exports.setResourceAttributes = exports.parseConfigFile = exports.hasValidConfigFile = exports.FileConfigFactory = void 0;
const core_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript)");
const configModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/configModel.js [instrumentation] (ecmascript)");
const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const yaml = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/yaml/dist/index.js [instrumentation] (ecmascript)");
const utils_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/utils.js [instrumentation] (ecmascript)");
const commonModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/commonModel.js [instrumentation] (ecmascript)");
const tracerProviderModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/tracerProviderModel.js [instrumentation] (ecmascript)");
const loggerProviderModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/loggerProviderModel.js [instrumentation] (ecmascript)");
const meterProviderModel_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/models/meterProviderModel.js [instrumentation] (ecmascript)");
const api_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/index.js [instrumentation] (ecmascript)");
class FileConfigFactory {
    _config;
    constructor(){
        this._config = (0, configModel_1.initializeDefaultConfiguration)();
        parseConfigFile(this._config);
    }
    getConfigModel() {
        return this._config;
    }
}
exports.FileConfigFactory = FileConfigFactory;
function hasValidConfigFile() {
    const configFile = (0, core_1.getStringFromEnv)('OTEL_EXPERIMENTAL_CONFIG_FILE');
    if (configFile) {
        if (!(configFile.endsWith('.yaml') || configFile.endsWith('.yml')) || !fs.existsSync(configFile)) {
            api_1.diag.warn(`Config file ${configFile} set on OTEL_EXPERIMENTAL_CONFIG_FILE is not valid`);
            return false;
        }
        return true;
    }
    return false;
}
exports.hasValidConfigFile = hasValidConfigFile;
function parseConfigFile(config) {
    const supportedFileVersions = [
        '1.0-rc.3'
    ];
    const configFile = (0, core_1.getStringFromEnv)('OTEL_EXPERIMENTAL_CONFIG_FILE') || '';
    const file = fs.readFileSync(configFile, 'utf8');
    const parsedContent = yaml.parse(file);
    if (parsedContent['file_format'] && supportedFileVersions.includes(parsedContent['file_format'])) {
        const disabled = (0, utils_1.getBooleanFromConfigFile)(parsedContent['disabled']);
        if (disabled !== undefined) {
            config.disabled = disabled;
        }
        const logLevel = (0, utils_1.getNumberFromConfigFile)((0, core_1.diagLogLevelFromString)(parsedContent['log_level']));
        if (logLevel) {
            config.log_level = logLevel;
        }
        if (parsedContent['resource']) {
            if (config.resource == null) {
                config.resource = {};
            }
            const schemaUrl = (0, utils_1.getStringFromConfigFile)(parsedContent['resource']?.['schema_url']);
            if (schemaUrl) {
                config.resource.schema_url = schemaUrl;
            }
        }
        setResourceAttributes(config, parsedContent['resource']?.['attributes'], parsedContent['resource']?.['attributes_list']);
        setAttributeLimits(config, parsedContent['attribute_limits']);
        setPropagator(config, parsedContent['propagator']);
        setTracerProvider(config, parsedContent['tracer_provider']);
        setMeterProvider(config, parsedContent['meter_provider']);
        setLoggerProvider(config, parsedContent['logger_provider']);
    } else {
        api_1.diag.warn(`Unsupported File Format: ${parsedContent['file_format']}. It must be one of the following: ${supportedFileVersions}`);
    }
}
exports.parseConfigFile = parseConfigFile;
function setResourceAttributes(config, attributes, attributeList) {
    if (attributes || attributeList) {
        const addedKeys = [];
        if (config.resource == null) {
            config.resource = {};
        }
        if ((0, utils_1.getStringFromConfigFile)(attributeList)) {
            config.resource.attributes_list = (0, utils_1.getStringFromConfigFile)(attributeList);
        }
        const list = (0, utils_1.getStringListFromConfigFile)(attributeList);
        if (list && list.length > 0 || attributes && attributes.length > 0) {
            config.resource.attributes = [];
            if (attributes) {
                for(let i = 0; i < attributes.length; i++){
                    const att = attributes[i];
                    let value = att['value'];
                    switch(att['type']){
                        case 'bool':
                            value = (0, utils_1.getBooleanFromConfigFile)(value);
                            break;
                        case 'bool_array':
                            value = (0, utils_1.getBooleanListFromConfigFile)(value);
                            break;
                        case 'int':
                        case 'double':
                            value = (0, utils_1.getNumberFromConfigFile)(value);
                            break;
                        case 'int_array':
                        case 'double_array':
                            value = (0, utils_1.getNumberListFromConfigFile)(value);
                            break;
                        case 'string_array':
                            value = (0, utils_1.getStringListFromConfigFile)(value);
                            break;
                        default:
                            value = (0, utils_1.getStringFromConfigFile)(value);
                            break;
                    }
                    const key = (0, utils_1.getStringFromConfigFile)(att['name']) ?? '';
                    config.resource.attributes.push({
                        name: key,
                        value: value,
                        type: att['type'] ?? 'string'
                    });
                    addedKeys.push(key);
                }
            }
            if (list) {
                for(let i = 0; i < list.length; i++){
                    const element = list[i].split('=');
                    if (!addedKeys.includes(element[0])) {
                        config.resource.attributes.push({
                            name: element[0],
                            value: element[1],
                            type: 'string'
                        });
                    }
                }
            }
        }
    }
}
exports.setResourceAttributes = setResourceAttributes;
function setAttributeLimits(config, attrLimits) {
    if (attrLimits) {
        if (config.attribute_limits == null) {
            config.attribute_limits = {
                attribute_count_limit: 128
            };
        }
        const lengthLimit = (0, utils_1.getNumberFromConfigFile)(attrLimits['attribute_value_length_limit']);
        if (lengthLimit) {
            config.attribute_limits.attribute_value_length_limit = lengthLimit;
        }
        const countLimit = (0, utils_1.getNumberFromConfigFile)(attrLimits['attribute_count_limit']);
        if (countLimit) {
            config.attribute_limits.attribute_count_limit = countLimit;
        }
    }
}
exports.setAttributeLimits = setAttributeLimits;
function setPropagator(config, propagator) {
    if (propagator && (propagator.composite || propagator.composite_list)) {
        const auxList = [];
        const composite = [];
        if (propagator.composite) {
            for(let i = 0; i < propagator.composite.length; i++){
                const key = Object.keys(propagator.composite[i])[0];
                auxList.push(key);
                composite.push({
                    [key]: null
                });
            }
        }
        const compositeList = (0, utils_1.getStringListFromConfigFile)(propagator['composite_list']);
        if (compositeList) {
            for(let i = 0; i < compositeList.length; i++){
                if (!auxList.includes(compositeList[i])) {
                    composite.push({
                        [compositeList[i]]: null
                    });
                }
            }
        }
        if (composite.length > 0) {
            if (config.propagator == null) {
                config.propagator = {};
            }
            config.propagator.composite = composite;
        }
        const compositeListString = (0, utils_1.getStringFromConfigFile)(propagator['composite_list']);
        if (compositeListString) {
            config.propagator.composite_list = compositeListString;
        } else if (auxList.length > 0) {
            // Generate composite_list from the composite entries
            config.propagator.composite_list = auxList.join(',');
        }
    }
}
exports.setPropagator = setPropagator;
function getConfigHeaders(h) {
    if (h) {
        const headers = [];
        for(let i = 0; i < h.length; i++){
            const element = h[i];
            headers.push({
                name: element['name'],
                value: element['value']
            });
        }
        if (headers.length > 0) {
            return headers;
        }
    }
    return null;
}
var ProviderType;
(function(ProviderType) {
    ProviderType[ProviderType["TRACER"] = 0] = "TRACER";
    ProviderType[ProviderType["METER"] = 1] = "METER";
    ProviderType[ProviderType["LOGGER"] = 2] = "LOGGER";
})(ProviderType || (ProviderType = {}));
function parseConfigSpanOrLogRecordExporter(exporter, providerType) {
    const exporterType = Object.keys(exporter)[0];
    let parsedExporter = {};
    let e;
    let certFile;
    let clientCertFile;
    let clientKeyFile;
    let compression;
    let headers;
    let headersList;
    let insecure;
    let endpoint;
    switch(providerType){
        case ProviderType.TRACER:
            endpoint = 'http://localhost:4318/v1/traces';
            parsedExporter = parsedExporter;
            break;
        case ProviderType.LOGGER:
            endpoint = 'http://localhost:4318/v1/logs';
            parsedExporter = parsedExporter;
            break;
    }
    switch(exporterType){
        case 'otlp_http':
            e = exporter['otlp_http'];
            if (e) {
                parsedExporter = {
                    otlp_http: {
                        endpoint: (0, utils_1.getStringFromConfigFile)(e['endpoint']) ?? endpoint,
                        timeout: (0, utils_1.getNumberFromConfigFile)(e['timeout']) ?? 10000,
                        encoding: (0, utils_1.getStringFromConfigFile)(e['encoding']) === 'json' ? commonModel_1.OtlpHttpEncoding.JSON : commonModel_1.OtlpHttpEncoding.Protobuf
                    }
                };
                compression = (0, utils_1.getStringFromConfigFile)(e['compression']);
                if (compression && parsedExporter.otlp_http) {
                    parsedExporter.otlp_http.compression = compression;
                }
                headersList = (0, utils_1.getStringFromConfigFile)(e['headers_list']);
                if (headersList && parsedExporter.otlp_http) {
                    parsedExporter.otlp_http.headers_list = headersList;
                }
                headers = getConfigHeaders(e['headers']);
                if (headers && parsedExporter.otlp_http) {
                    parsedExporter.otlp_http.headers = headers;
                }
                if (e['tls']) {
                    certFile = (0, utils_1.getStringFromConfigFile)(e['tls']['ca_file']);
                    clientCertFile = (0, utils_1.getStringFromConfigFile)(e['tls']['cert_file']);
                    clientKeyFile = (0, utils_1.getStringFromConfigFile)(e['tls']['key_file']);
                    const tls = (0, utils_1.getHttpTlsConfig)(certFile, clientKeyFile, clientCertFile);
                    if (tls) {
                        parsedExporter.otlp_http.tls = tls;
                    }
                }
            }
            break;
        case 'otlp_grpc':
            e = exporter['otlp_grpc'];
            if (e) {
                parsedExporter = {
                    otlp_grpc: {
                        endpoint: (0, utils_1.getStringFromConfigFile)(e['endpoint']) ?? 'http://localhost:4317',
                        timeout: (0, utils_1.getNumberFromConfigFile)(e['timeout']) ?? 10000
                    }
                };
                compression = (0, utils_1.getStringFromConfigFile)(e['compression']);
                if (compression && parsedExporter.otlp_grpc) {
                    parsedExporter.otlp_grpc.compression = compression;
                }
                headersList = (0, utils_1.getStringFromConfigFile)(e['headers_list']);
                if (headersList && parsedExporter.otlp_grpc) {
                    parsedExporter.otlp_grpc.headers_list = headersList;
                }
                headers = getConfigHeaders(e['headers']);
                if (headers && parsedExporter.otlp_grpc) {
                    parsedExporter.otlp_grpc.headers = headers;
                }
                if (e['tls']) {
                    certFile = (0, utils_1.getStringFromConfigFile)(e['tls']['ca_file']);
                    clientCertFile = (0, utils_1.getStringFromConfigFile)(e['tls']['cert_file']);
                    clientKeyFile = (0, utils_1.getStringFromConfigFile)(e['tls']['key_file']);
                    insecure = (0, utils_1.getBooleanFromConfigFile)(e['tls']['insecure']);
                    const tls = (0, utils_1.getGrpcTlsConfig)(certFile, clientKeyFile, clientCertFile, insecure);
                    if (tls) {
                        parsedExporter.otlp_grpc.tls = tls;
                    }
                }
            }
            break;
        case 'otlp_file/development':
            e = exporter['otlp_file/development'];
            if (e) {
                parsedExporter = {
                    'otlp_file/development': {
                        output_stream: (0, utils_1.getStringFromConfigFile)(e['output_stream']) ?? 'stdout'
                    }
                };
            }
            break;
        case 'console':
            parsedExporter = {
                console: {}
            };
            break;
    }
    return parsedExporter;
}
function setTracerProvider(config, tracerProvider) {
    if (tracerProvider && tracerProvider.processors?.length > 0) {
        config.tracer_provider = (0, tracerProviderModel_1.initializeDefaultTracerProviderConfiguration)();
        // Limits
        if (tracerProvider['limits']) {
            const attributeValueLengthLimit = (0, utils_1.getNumberFromConfigFile)(tracerProvider['limits']['attribute_value_length_limit']);
            if (attributeValueLengthLimit) {
                config.tracer_provider.limits.attribute_value_length_limit = attributeValueLengthLimit;
            }
            const attributeCountLimit = (0, utils_1.getNumberFromConfigFile)(tracerProvider['limits']['attribute_count_limit']);
            if (attributeCountLimit) {
                config.tracer_provider.limits.attribute_count_limit = attributeCountLimit;
            }
            const eventCountLimit = (0, utils_1.getNumberFromConfigFile)(tracerProvider['limits']['event_count_limit']);
            if (eventCountLimit) {
                config.tracer_provider.limits.event_count_limit = eventCountLimit;
            }
            const linkCountLimit = (0, utils_1.getNumberFromConfigFile)(tracerProvider['limits']['link_count_limit']);
            if (linkCountLimit) {
                config.tracer_provider.limits.link_count_limit = linkCountLimit;
            }
            const eventAttributeCountLimit = (0, utils_1.getNumberFromConfigFile)(tracerProvider['limits']['event_attribute_count_limit']);
            if (eventAttributeCountLimit) {
                config.tracer_provider.limits.event_attribute_count_limit = eventAttributeCountLimit;
            }
            const linkAttributeCountLimit = (0, utils_1.getNumberFromConfigFile)(tracerProvider['limits']['link_attribute_count_limit']);
            if (linkAttributeCountLimit) {
                config.tracer_provider.limits.link_attribute_count_limit = linkAttributeCountLimit;
            }
        }
        // Processors
        for(let i = 0; i < tracerProvider['processors'].length; i++){
            const processorType = Object.keys(tracerProvider['processors'][i])[0];
            if (processorType === 'batch') {
                const element = tracerProvider['processors'][i]['batch'];
                if (element) {
                    const parsedExporter = parseConfigSpanOrLogRecordExporter(element['exporter'], ProviderType.TRACER);
                    const batchConfig = {
                        batch: {
                            schedule_delay: (0, utils_1.getNumberFromConfigFile)(element['schedule_delay']) ?? 5000,
                            export_timeout: (0, utils_1.getNumberFromConfigFile)(element['export_timeout']) ?? 30000,
                            max_queue_size: (0, utils_1.getNumberFromConfigFile)(element['max_queue_size']) ?? 2048,
                            max_export_batch_size: (0, utils_1.getNumberFromConfigFile)(element['max_export_batch_size']) ?? 512,
                            exporter: parsedExporter
                        }
                    };
                    config.tracer_provider.processors.push(batchConfig);
                }
            } else if (processorType === 'simple') {
                const element = tracerProvider['processors'][i]['simple'];
                if (element) {
                    const parsedExporter = parseConfigSpanOrLogRecordExporter(element['exporter'], ProviderType.TRACER);
                    const simpleConfig = {
                        simple: {
                            exporter: parsedExporter
                        }
                    };
                    config.tracer_provider.processors.push(simpleConfig);
                }
            }
        }
    } else if (tracerProvider && (tracerProvider.processors == null || tracerProvider.processors.length === 0)) {
        api_1.diag.warn('TracerProvider must have at least one processor configured');
    }
}
exports.setTracerProvider = setTracerProvider;
function getCardinalityLimits(limits) {
    if (limits == null) {
        limits = {};
    }
    const defaultLimit = (0, utils_1.getNumberFromConfigFile)(limits['default']) ?? 2000;
    return {
        default: defaultLimit,
        counter: (0, utils_1.getNumberFromConfigFile)(limits['counter']) ?? defaultLimit,
        gauge: (0, utils_1.getNumberFromConfigFile)(limits['gauge']) ?? defaultLimit,
        histogram: (0, utils_1.getNumberFromConfigFile)(limits['histogram']) ?? defaultLimit,
        observable_counter: (0, utils_1.getNumberFromConfigFile)(limits['observable_counter']) ?? defaultLimit,
        observable_gauge: (0, utils_1.getNumberFromConfigFile)(limits['observable_gauge']) ?? defaultLimit,
        observable_up_down_counter: (0, utils_1.getNumberFromConfigFile)(limits['observable_up_down_counter']) ?? defaultLimit,
        up_down_counter: (0, utils_1.getNumberFromConfigFile)(limits['up_down_counter']) ?? defaultLimit
    };
}
function getProducers(producers) {
    const parsedProducers = [];
    if (producers) {
        for(let j = 0; j < producers.length; j++){
            const producer = producers[j];
            if (Object.keys(producer)[0] === 'opencensus') {
                parsedProducers.push({
                    opencensus: {}
                });
            }
        }
    }
    return parsedProducers;
}
function getTemporalityPreference(temporalityPreference) {
    const temporalityPreferenceType = (0, utils_1.getStringFromConfigFile)(temporalityPreference);
    switch(temporalityPreferenceType){
        case 'cumulative':
            return meterProviderModel_1.ExporterTemporalityPreference.Cumulative;
        case 'delta':
            return meterProviderModel_1.ExporterTemporalityPreference.Delta;
        case 'low_memory':
            return meterProviderModel_1.ExporterTemporalityPreference.LowMemory;
        default:
            return meterProviderModel_1.ExporterTemporalityPreference.Cumulative;
    }
}
exports.getTemporalityPreference = getTemporalityPreference;
function getDefaultHistogramAggregation(defaultHistogramAggregation) {
    const defaultHistogramAggregationType = (0, utils_1.getStringFromConfigFile)(defaultHistogramAggregation);
    switch(defaultHistogramAggregationType){
        case 'explicit_bucket_histogram':
            return meterProviderModel_1.ExporterDefaultHistogramAggregation.ExplicitBucketHistogram;
        case 'base2_exponential_bucket_histogram':
            return meterProviderModel_1.ExporterDefaultHistogramAggregation.Base2ExponentialBucketHistogram;
        default:
            return meterProviderModel_1.ExporterDefaultHistogramAggregation.ExplicitBucketHistogram;
    }
}
function parseMetricExporter(exporter) {
    const exporterType = Object.keys(exporter)[0];
    let parsedExporter = {};
    let e;
    let certFile;
    let clientCertFile;
    let clientKeyFile;
    let compression;
    let headers;
    let headersList;
    let insecure;
    switch(exporterType){
        case 'otlp_http':
            e = exporter['otlp_http'];
            if (e) {
                parsedExporter = {
                    otlp_http: {
                        endpoint: (0, utils_1.getStringFromConfigFile)(e['endpoint']) ?? 'http://localhost:4318/v1/metrics',
                        timeout: (0, utils_1.getNumberFromConfigFile)(e['timeout']) ?? 10000,
                        encoding: (0, utils_1.getStringFromConfigFile)(e['encoding']) === 'json' ? commonModel_1.OtlpHttpEncoding.JSON : commonModel_1.OtlpHttpEncoding.Protobuf,
                        temporality_preference: getTemporalityPreference(e['temporality_preference']),
                        default_histogram_aggregation: getDefaultHistogramAggregation(e['default_histogram_aggregation'])
                    }
                };
                compression = (0, utils_1.getStringFromConfigFile)(e['compression']);
                if (compression && parsedExporter.otlp_http) {
                    parsedExporter.otlp_http.compression = compression;
                }
                headersList = (0, utils_1.getStringFromConfigFile)(e['headers_list']);
                if (headersList && parsedExporter.otlp_http) {
                    parsedExporter.otlp_http.headers_list = headersList;
                }
                headers = getConfigHeaders(e['headers']);
                if (headers && parsedExporter.otlp_http) {
                    parsedExporter.otlp_http.headers = headers;
                }
                if (e['tls']) {
                    certFile = (0, utils_1.getStringFromConfigFile)(e['tls']['ca_file']);
                    clientCertFile = (0, utils_1.getStringFromConfigFile)(e['tls']['cert_file']);
                    clientKeyFile = (0, utils_1.getStringFromConfigFile)(e['tls']['key_file']);
                    const tls = (0, utils_1.getHttpTlsConfig)(certFile, clientKeyFile, clientCertFile);
                    if (tls) {
                        parsedExporter.otlp_http.tls = tls;
                    }
                }
            }
            break;
        case 'otlp_grpc':
            e = exporter['otlp_grpc'];
            if (e) {
                parsedExporter = {
                    otlp_grpc: {
                        endpoint: (0, utils_1.getStringFromConfigFile)(e['endpoint']) ?? 'http://localhost:4317',
                        timeout: (0, utils_1.getNumberFromConfigFile)(e['timeout']) ?? 10000,
                        temporality_preference: getTemporalityPreference(e['temporality_preference']),
                        default_histogram_aggregation: getDefaultHistogramAggregation(e['default_histogram_aggregation'])
                    }
                };
                compression = (0, utils_1.getStringFromConfigFile)(e['compression']);
                if (compression && parsedExporter.otlp_grpc) {
                    parsedExporter.otlp_grpc.compression = compression;
                }
                headersList = (0, utils_1.getStringFromConfigFile)(e['headers_list']);
                if (headersList && parsedExporter.otlp_grpc) {
                    parsedExporter.otlp_grpc.headers_list = headersList;
                }
                headers = getConfigHeaders(e['headers']);
                if (headers && parsedExporter.otlp_grpc) {
                    parsedExporter.otlp_grpc.headers = headers;
                }
                if (e['tls']) {
                    certFile = (0, utils_1.getStringFromConfigFile)(e['tls']['ca_file']);
                    clientCertFile = (0, utils_1.getStringFromConfigFile)(e['tls']['cert_file']);
                    clientKeyFile = (0, utils_1.getStringFromConfigFile)(e['tls']['key_file']);
                    insecure = (0, utils_1.getBooleanFromConfigFile)(e['tls']['insecure']);
                    const tls = (0, utils_1.getGrpcTlsConfig)(certFile, clientKeyFile, clientCertFile, insecure);
                    if (tls) {
                        parsedExporter.otlp_grpc.tls = tls;
                    }
                }
            }
            break;
        case 'otlp_file/development':
            e = exporter['otlp_file/development'];
            if (e) {
                parsedExporter = {
                    'otlp_file/development': {
                        output_stream: (0, utils_1.getStringFromConfigFile)(e['output_stream']) ?? 'stdout',
                        temporality_preference: getTemporalityPreference(e['temporality_preference']),
                        default_histogram_aggregation: getDefaultHistogramAggregation(e['default_histogram_aggregation'])
                    }
                };
            }
            break;
        case 'console':
            e = exporter['console'];
            if (e) {
                parsedExporter = {
                    console: {
                        temporality_preference: getTemporalityPreference(e['temporality_preference']),
                        default_histogram_aggregation: getDefaultHistogramAggregation(e['default_histogram_aggregation'])
                    }
                };
            }
            break;
    }
    return parsedExporter;
}
function setMeterProvider(config, meterProvider) {
    if (meterProvider && meterProvider.readers?.length > 0) {
        config.meter_provider = (0, meterProviderModel_1.initializeDefaultMeterProviderConfiguration)();
        const exemplarFilter = (0, utils_1.getStringFromConfigFile)(meterProvider['exemplar_filter']);
        if (exemplarFilter) {
            switch(exemplarFilter){
                case 'trace_based':
                    config.meter_provider.exemplar_filter = meterProviderModel_1.ExemplarFilter.TraceBased;
                    break;
                case 'always_on':
                    config.meter_provider.exemplar_filter = meterProviderModel_1.ExemplarFilter.AlwaysOn;
                    break;
                case 'always_off':
                    config.meter_provider.exemplar_filter = meterProviderModel_1.ExemplarFilter.AlwaysOff;
                    break;
                default:
                    config.meter_provider.exemplar_filter = meterProviderModel_1.ExemplarFilter.TraceBased;
                    break;
            }
        }
        for(let i = 0; i < meterProvider.readers.length; i++){
            const readerType = Object.keys(meterProvider['readers'][i])[0];
            if (readerType === 'pull') {
                const element = meterProvider['readers'][i]['pull'];
                if (element) {
                    const exporter = {
                        'prometheus/development': {
                            host: (0, utils_1.getStringFromConfigFile)(element['exporter']['prometheus/development']['host']) ?? 'localhost',
                            port: (0, utils_1.getNumberFromConfigFile)(element['exporter']['prometheus/development']['port']) ?? 9464,
                            without_scope_info: (0, utils_1.getBooleanFromConfigFile)(element['exporter']['prometheus/development']['without_scope_info']) ?? false,
                            without_target_info: (0, utils_1.getBooleanFromConfigFile)(element['exporter']['prometheus/development']['without_target_info']) ?? false
                        }
                    };
                    if (element['exporter']['prometheus/development']['with_resource_constant_labels']) {
                        exporter['prometheus/development'].with_resource_constant_labels = {
                            included: (0, utils_1.getStringListFromConfigFile)(element['exporter']['prometheus/development']['with_resource_constant_labels']?.['included']) ?? [],
                            excluded: (0, utils_1.getStringListFromConfigFile)(element['exporter']['prometheus/development']['with_resource_constant_labels']?.['excluded']) ?? []
                        };
                    }
                    if (element['exporter']['prometheus/development']['translation_strategy']) {
                        const ts = (0, utils_1.getStringFromConfigFile)(element['exporter']['prometheus/development']['translation_strategy']);
                        switch(ts){
                            case 'underscore_escaping_with_suffixes':
                                exporter['prometheus/development'].translation_strategy = meterProviderModel_1.ExperimentalPrometheusTranslationStrategy.UnderscoreEscapingWithSuffixes;
                                break;
                            case 'underscore_escaping_without_suffixes':
                                exporter['prometheus/development'].translation_strategy = meterProviderModel_1.ExperimentalPrometheusTranslationStrategy.UnderscoreEscapingWithoutSuffixes;
                                break;
                            case 'no_utf8_escaping_with_suffixes':
                                exporter['prometheus/development'].translation_strategy = meterProviderModel_1.ExperimentalPrometheusTranslationStrategy.NoUtf8EscapingWithSuffixes;
                                break;
                            case 'no_translation':
                                exporter['prometheus/development'].translation_strategy = meterProviderModel_1.ExperimentalPrometheusTranslationStrategy.NoTranslation;
                                break;
                        }
                    }
                    const pullReader = {
                        pull: {
                            exporter: exporter,
                            cardinality_limits: getCardinalityLimits(element['cardinality_limits'])
                        }
                    };
                    const p = getProducers(element['producers']);
                    if (p.length > 0 && pullReader.pull) {
                        pullReader.pull.producers = p;
                    }
                    config.meter_provider.readers.push(pullReader);
                }
            } else if (readerType === 'periodic') {
                const element = meterProvider['readers'][i]['periodic'];
                if (element) {
                    const parsedExporter = parseMetricExporter(element['exporter']);
                    const periodicReader = {
                        periodic: {
                            exporter: parsedExporter,
                            cardinality_limits: getCardinalityLimits(element['cardinality_limits']),
                            interval: (0, utils_1.getNumberFromConfigFile)(element['interval']) ?? 60000,
                            timeout: (0, utils_1.getNumberFromConfigFile)(element['timeout']) ?? 30000
                        }
                    };
                    const p = getProducers(element['producers']);
                    if (p.length > 0 && periodicReader.periodic) {
                        periodicReader.periodic.producers = p;
                    }
                    config.meter_provider.readers.push(periodicReader);
                }
            }
        }
        if (meterProvider['views'] && meterProvider['views'].length > 0) {
            config.meter_provider.views = [];
            for(let j = 0; j < meterProvider['views'].length; j++){
                const element = meterProvider['views'][j];
                const view = {};
                if (element['selector']) {
                    const selector = {};
                    const instrumentName = (0, utils_1.getStringFromConfigFile)(element['selector']['instrument_name']);
                    if (instrumentName) {
                        selector.instrument_name = instrumentName;
                    }
                    const unit = (0, utils_1.getStringFromConfigFile)(element['selector']['unit']);
                    if (unit) {
                        selector.unit = unit;
                    }
                    const meterName = (0, utils_1.getStringFromConfigFile)(element['selector']['meter_name']);
                    if (meterName) {
                        selector.meter_name = meterName;
                    }
                    const meterVersion = (0, utils_1.getStringFromConfigFile)(element['selector']['meter_version']);
                    if (meterVersion) {
                        selector.meter_version = meterVersion;
                    }
                    const meterSchemaUrl = (0, utils_1.getStringFromConfigFile)(element['selector']['meter_schema_url']);
                    if (meterSchemaUrl) {
                        selector.meter_schema_url = meterSchemaUrl;
                    }
                    const instrumentType = (0, utils_1.getStringFromConfigFile)(element['selector']['instrument_type']);
                    if (instrumentType) {
                        switch(instrumentType){
                            case 'counter':
                                selector.instrument_type = meterProviderModel_1.InstrumentType.Counter;
                                break;
                            case 'gauge':
                                selector.instrument_type = meterProviderModel_1.InstrumentType.Gauge;
                                break;
                            case 'histogram':
                                selector.instrument_type = meterProviderModel_1.InstrumentType.Histogram;
                                break;
                            case 'observable_counter':
                                selector.instrument_type = meterProviderModel_1.InstrumentType.ObservableCounter;
                                break;
                            case 'observable_gauge':
                                selector.instrument_type = meterProviderModel_1.InstrumentType.ObservableGauge;
                                break;
                            case 'observable_up_down_counter':
                                selector.instrument_type = meterProviderModel_1.InstrumentType.ObservableUpDownCounter;
                                break;
                            case 'up_down_counter':
                                selector.instrument_type = meterProviderModel_1.InstrumentType.UpDownCounter;
                                break;
                        }
                    }
                    if (Object.keys(selector).length > 0) {
                        view.selector = selector;
                    }
                }
                if (element['stream']) {
                    const stream = {};
                    const name = (0, utils_1.getStringFromConfigFile)(element['stream']['name']);
                    if (name) {
                        stream.name = name;
                    }
                    const description = (0, utils_1.getStringFromConfigFile)(element['stream']['description']);
                    if (description) {
                        stream.description = description;
                    }
                    const aggregationCardinalityLimit = (0, utils_1.getNumberFromConfigFile)(element['stream']['aggregation_cardinality_limit']);
                    if (aggregationCardinalityLimit) {
                        stream.aggregation_cardinality_limit = aggregationCardinalityLimit;
                    }
                    if (element['stream']['attribute_keys']) {
                        stream.attribute_keys = {
                            included: (0, utils_1.getStringListFromConfigFile)(element['stream']['attribute_keys']['included']) ?? [],
                            excluded: (0, utils_1.getStringListFromConfigFile)(element['stream']['attribute_keys']['excluded']) ?? []
                        };
                    }
                    const rawAgg = element['stream']['aggregation'];
                    if (rawAgg) {
                        const aggregation = {};
                        if (rawAgg['default']) {
                            aggregation.default = {};
                        }
                        if (rawAgg['drop']) {
                            aggregation.drop = {};
                        }
                        if (rawAgg['last_value']) {
                            aggregation.last_value = {};
                        }
                        if (rawAgg['sum']) {
                            aggregation.sum = {};
                        }
                        if (rawAgg['explicit_bucket_histogram']) {
                            aggregation.explicit_bucket_histogram = {
                                boundaries: (0, utils_1.getNumberListFromConfigFile)(rawAgg['explicit_bucket_histogram']['boundaries']) ?? [
                                    0,
                                    5,
                                    10,
                                    25,
                                    50,
                                    75,
                                    100,
                                    250,
                                    500,
                                    750,
                                    1000,
                                    2500,
                                    5000,
                                    7500,
                                    10000
                                ],
                                record_min_max: (0, utils_1.getBooleanFromConfigFile)(rawAgg['explicit_bucket_histogram']['record_min_max']) === false ? false : true
                            };
                        }
                        if (rawAgg['base2_exponential_bucket_histogram']) {
                            aggregation.base2_exponential_bucket_histogram = {
                                record_min_max: (0, utils_1.getBooleanFromConfigFile)(rawAgg['base2_exponential_bucket_histogram']['record_min_max']) === false ? false : true
                            };
                            const maxScale = (0, utils_1.getNumberFromConfigFile)(rawAgg['base2_exponential_bucket_histogram']['max_scale']);
                            if (maxScale) {
                                aggregation.base2_exponential_bucket_histogram.max_scale = maxScale;
                            }
                            const maxSize = (0, utils_1.getNumberFromConfigFile)(rawAgg['base2_exponential_bucket_histogram']['max_size']);
                            if (maxSize) {
                                aggregation.base2_exponential_bucket_histogram.max_size = maxSize;
                            }
                        }
                        stream.aggregation = aggregation;
                    }
                    if (Object.keys(stream).length > 0) {
                        view.stream = stream;
                    }
                }
                config.meter_provider.views.push(view);
            }
        }
    } else if (meterProvider && (meterProvider.readers == null || meterProvider.readers.length === 0)) {
        api_1.diag.warn('MeterProvider must have at least one reader configured');
    }
}
exports.setMeterProvider = setMeterProvider;
function getSeverity(severity) {
    const severityType = (0, utils_1.getStringFromConfigFile)(severity);
    switch(severityType){
        case 'debug':
            return commonModel_1.SeverityNumber.DEBUG;
        case 'debug2':
            return commonModel_1.SeverityNumber.DEBUG2;
        case 'debug3':
            return commonModel_1.SeverityNumber.DEBUG3;
        case 'debug4':
            return commonModel_1.SeverityNumber.DEBUG4;
        case 'info':
            return commonModel_1.SeverityNumber.INFO;
        case 'info2':
            return commonModel_1.SeverityNumber.INFO2;
        case 'info3':
            return commonModel_1.SeverityNumber.INFO3;
        case 'info4':
            return commonModel_1.SeverityNumber.INFO4;
        case 'warn':
            return commonModel_1.SeverityNumber.WARN;
        case 'warn2':
            return commonModel_1.SeverityNumber.WARN2;
        case 'warn3':
            return commonModel_1.SeverityNumber.WARN3;
        case 'warn4':
            return commonModel_1.SeverityNumber.WARN4;
        case 'error':
            return commonModel_1.SeverityNumber.ERROR;
        case 'error2':
            return commonModel_1.SeverityNumber.ERROR2;
        case 'error3':
            return commonModel_1.SeverityNumber.ERROR3;
        case 'error4':
            return commonModel_1.SeverityNumber.ERROR4;
        case 'fatal':
            return commonModel_1.SeverityNumber.FATAL;
        case 'fatal2':
            return commonModel_1.SeverityNumber.FATAL2;
        case 'fatal3':
            return commonModel_1.SeverityNumber.FATAL3;
        case 'fatal4':
            return commonModel_1.SeverityNumber.FATAL4;
        case 'trace':
            return commonModel_1.SeverityNumber.TRACE;
        case 'trace2':
            return commonModel_1.SeverityNumber.TRACE2;
        case 'trace3':
            return commonModel_1.SeverityNumber.TRACE3;
        case 'trace4':
            return commonModel_1.SeverityNumber.TRACE4;
        default:
            return undefined;
    }
}
exports.getSeverity = getSeverity;
function setLoggerProvider(config, loggerProvider) {
    if (loggerProvider && loggerProvider.processors?.length > 0) {
        config.logger_provider = (0, loggerProviderModel_1.initializeDefaultLoggerProviderConfiguration)();
        // Limits
        if (loggerProvider['limits']) {
            const attributeValueLengthLimit = (0, utils_1.getNumberFromConfigFile)(loggerProvider['limits']['attribute_value_length_limit']);
            const attributeCountLimit = (0, utils_1.getNumberFromConfigFile)(loggerProvider['limits']['attribute_count_limit']);
            if (attributeValueLengthLimit || attributeCountLimit) {
                if (attributeValueLengthLimit) {
                    config.logger_provider.limits.attribute_value_length_limit = attributeValueLengthLimit;
                }
                if (attributeCountLimit) {
                    config.logger_provider.limits.attribute_count_limit = attributeCountLimit;
                }
            }
        }
        // Processors
        for(let i = 0; i < loggerProvider['processors'].length; i++){
            const processorType = Object.keys(loggerProvider['processors'][i])[0];
            if (processorType === 'batch') {
                const element = loggerProvider['processors'][i]['batch'];
                if (element) {
                    const parsedExporter = parseConfigSpanOrLogRecordExporter(element['exporter'], ProviderType.LOGGER);
                    const batchConfig = {
                        batch: {
                            schedule_delay: (0, utils_1.getNumberFromConfigFile)(element['schedule_delay']) ?? 1000,
                            export_timeout: (0, utils_1.getNumberFromConfigFile)(element['export_timeout']) ?? 30000,
                            max_queue_size: (0, utils_1.getNumberFromConfigFile)(element['max_queue_size']) ?? 2048,
                            max_export_batch_size: (0, utils_1.getNumberFromConfigFile)(element['max_export_batch_size']) ?? 512,
                            exporter: parsedExporter
                        }
                    };
                    config.logger_provider.processors.push(batchConfig);
                }
            } else if (processorType === 'simple') {
                const element = loggerProvider['processors'][i]['simple'];
                if (element) {
                    const parsedExporter = parseConfigSpanOrLogRecordExporter(element['exporter'], ProviderType.LOGGER);
                    const simpleConfig = {
                        simple: {
                            exporter: parsedExporter
                        }
                    };
                    config.logger_provider.processors.push(simpleConfig);
                }
            }
        }
        // logger_configurator/development
        if (loggerProvider['logger_configurator/development']) {
            const defaultConfigDisabled = (0, utils_1.getBooleanFromConfigFile)(loggerProvider['logger_configurator/development']['default_config']?.['enabled']);
            if (defaultConfigDisabled || defaultConfigDisabled === false) {
                config.logger_provider['logger_configurator/development'] = {
                    default_config: {
                        enabled: defaultConfigDisabled
                    }
                };
            }
            if (loggerProvider['logger_configurator/development'].loggers && loggerProvider['logger_configurator/development'].loggers.length > 0) {
                const loggers = [];
                for(let i = 0; i < loggerProvider['logger_configurator/development'].loggers.length; i++){
                    const logger = loggerProvider['logger_configurator/development'].loggers[i];
                    let enabled = false;
                    let traceBased;
                    let minSeverity;
                    if (logger['config']) {
                        enabled = (0, utils_1.getBooleanFromConfigFile)(logger['config']['enabled']) ?? false;
                        traceBased = (0, utils_1.getBooleanFromConfigFile)(logger['config']['trace_based']);
                        if (logger['config']['minimum_severity']) {
                            minSeverity = getSeverity(logger['config']['minimum_severity']);
                        }
                    }
                    const name = (0, utils_1.getStringFromConfigFile)(logger['name']);
                    if (name) {
                        const loggerNew = {
                            name: name,
                            config: {
                                enabled: enabled
                            }
                        };
                        if (traceBased !== undefined) {
                            loggerNew.config.trace_based = traceBased;
                        }
                        if (minSeverity !== undefined) {
                            loggerNew.config.minimum_severity = minSeverity;
                        }
                        loggers.push(loggerNew);
                    }
                }
                if (config.logger_provider['logger_configurator/development'] == null) {
                    config.logger_provider['logger_configurator/development'] = {};
                }
                config.logger_provider['logger_configurator/development'].loggers = loggers;
            }
        }
    } else if (loggerProvider && (loggerProvider.processors == null || loggerProvider.processors.length === 0)) {
        api_1.diag.warn('LoggerProvider must have at least one processor configured');
    }
}
exports.setLoggerProvider = setLoggerProvider; //# sourceMappingURL=FileConfigFactory.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/ConfigFactory.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createConfigFactory = void 0;
const EnvironmentConfigFactory_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/EnvironmentConfigFactory.js [instrumentation] (ecmascript)");
const FileConfigFactory_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/FileConfigFactory.js [instrumentation] (ecmascript)");
function createConfigFactory() {
    if ((0, FileConfigFactory_1.hasValidConfigFile)()) {
        return new FileConfigFactory_1.FileConfigFactory();
    }
    return new EnvironmentConfigFactory_1.EnvironmentConfigFactory();
}
exports.createConfigFactory = createConfigFactory; //# sourceMappingURL=ConfigFactory.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/index.js [instrumentation] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createConfigFactory = void 0;
var ConfigFactory_1 = __turbopack_context__.r("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/configuration/build/src/ConfigFactory.js [instrumentation] (ecmascript)");
Object.defineProperty(exports, "createConfigFactory", {
    enumerable: true,
    get: function() {
        return ConfigFactory_1.createConfigFactory;
    }
}); //# sourceMappingURL=index.js.map
}),
];

//# sourceMappingURL=095e5_72350932._.js.map