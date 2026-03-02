module.exports = [
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/index.js [instrumentation] (ecmascript) <locals>", ((__turbopack_context__) => {
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
;
;
;
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationTemporality.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * AggregationTemporality indicates the way additive quantities are expressed.
 */ __turbopack_context__.s([
    "AggregationTemporality",
    ()=>AggregationTemporality
]);
var AggregationTemporality;
(function(AggregationTemporality) {
    AggregationTemporality[AggregationTemporality["DELTA"] = 0] = "DELTA";
    AggregationTemporality[AggregationTemporality["CUMULATIVE"] = 1] = "CUMULATIVE";
})(AggregationTemporality || (AggregationTemporality = {})); //# sourceMappingURL=AggregationTemporality.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * Supported types of metric instruments.
 */ __turbopack_context__.s([
    "DataPointType",
    ()=>DataPointType,
    "InstrumentType",
    ()=>InstrumentType
]);
var InstrumentType;
(function(InstrumentType) {
    InstrumentType["COUNTER"] = "COUNTER";
    InstrumentType["GAUGE"] = "GAUGE";
    InstrumentType["HISTOGRAM"] = "HISTOGRAM";
    InstrumentType["UP_DOWN_COUNTER"] = "UP_DOWN_COUNTER";
    InstrumentType["OBSERVABLE_COUNTER"] = "OBSERVABLE_COUNTER";
    InstrumentType["OBSERVABLE_GAUGE"] = "OBSERVABLE_GAUGE";
    InstrumentType["OBSERVABLE_UP_DOWN_COUNTER"] = "OBSERVABLE_UP_DOWN_COUNTER";
})(InstrumentType || (InstrumentType = {}));
var DataPointType;
(function(DataPointType) {
    /**
     * A histogram data point contains a histogram statistics of collected
     * values with a list of explicit bucket boundaries and statistics such
     * as min, max, count, and sum of all collected values.
     */ DataPointType[DataPointType["HISTOGRAM"] = 0] = "HISTOGRAM";
    /**
     * An exponential histogram data point contains a histogram statistics of
     * collected values where bucket boundaries are automatically calculated
     * using an exponential function, and statistics such as min, max, count,
     * and sum of all collected values.
     */ DataPointType[DataPointType["EXPONENTIAL_HISTOGRAM"] = 1] = "EXPONENTIAL_HISTOGRAM";
    /**
     * A gauge metric data point has only a single numeric value.
     */ DataPointType[DataPointType["GAUGE"] = 2] = "GAUGE";
    /**
     * A sum metric data point has a single numeric value and a
     * monotonicity-indicator.
     */ DataPointType[DataPointType["SUM"] = 3] = "SUM";
})(DataPointType || (DataPointType = {})); //# sourceMappingURL=MetricData.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * Converting the unordered attributes into unique identifier string.
 * @param attributes user provided unordered Attributes.
 */ __turbopack_context__.s([
    "TimeoutError",
    ()=>TimeoutError,
    "binarySearchUB",
    ()=>binarySearchUB,
    "callWithTimeout",
    ()=>callWithTimeout,
    "equalsCaseInsensitive",
    ()=>equalsCaseInsensitive,
    "hashAttributes",
    ()=>hashAttributes,
    "instrumentationScopeId",
    ()=>instrumentationScopeId,
    "setEquals",
    ()=>setEquals
]);
function hashAttributes(attributes) {
    let keys = Object.keys(attributes);
    if (keys.length === 0) return '';
    // Return a string that is stable on key orders.
    keys = keys.sort();
    return JSON.stringify(keys.map((key)=>[
            key,
            attributes[key]
        ]));
}
function instrumentationScopeId(instrumentationScope) {
    return `${instrumentationScope.name}:${instrumentationScope.version ?? ''}:${instrumentationScope.schemaUrl ?? ''}`;
}
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
}
function setEquals(lhs, rhs) {
    if (lhs.size !== rhs.size) {
        return false;
    }
    for (const item of lhs){
        if (!rhs.has(item)) {
            return false;
        }
    }
    return true;
}
function binarySearchUB(arr, value) {
    let lo = 0;
    let hi = arr.length - 1;
    let ret = arr.length;
    while(hi >= lo){
        const mid = lo + Math.trunc((hi - lo) / 2);
        if (arr[mid] < value) {
            lo = mid + 1;
        } else {
            ret = mid;
            hi = mid - 1;
        }
    }
    return ret;
}
function equalsCaseInsensitive(lhs, rhs) {
    return lhs.toLowerCase() === rhs.toLowerCase();
} //# sourceMappingURL=utils.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/types.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ /** The kind of aggregator. */ __turbopack_context__.s([
    "AggregatorKind",
    ()=>AggregatorKind
]);
var AggregatorKind;
(function(AggregatorKind) {
    AggregatorKind[AggregatorKind["DROP"] = 0] = "DROP";
    AggregatorKind[AggregatorKind["SUM"] = 1] = "SUM";
    AggregatorKind[AggregatorKind["LAST_VALUE"] = 2] = "LAST_VALUE";
    AggregatorKind[AggregatorKind["HISTOGRAM"] = 3] = "HISTOGRAM";
    AggregatorKind[AggregatorKind["EXPONENTIAL_HISTOGRAM"] = 4] = "EXPONENTIAL_HISTOGRAM";
})(AggregatorKind || (AggregatorKind = {})); //# sourceMappingURL=types.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/Sum.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "SumAccumulation",
    ()=>SumAccumulation,
    "SumAggregator",
    ()=>SumAggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/types.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js [instrumentation] (ecmascript)");
;
;
class SumAccumulation {
    startTime;
    monotonic;
    _current;
    reset;
    constructor(startTime, monotonic, current = 0, reset = false){
        this.startTime = startTime;
        this.monotonic = monotonic;
        this._current = current;
        this.reset = reset;
    }
    record(value) {
        if (this.monotonic && value < 0) {
            return;
        }
        this._current += value;
    }
    setStartTime(startTime) {
        this.startTime = startTime;
    }
    toPointValue() {
        return this._current;
    }
}
class SumAggregator {
    kind = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregatorKind"].SUM;
    monotonic;
    constructor(monotonic){
        this.monotonic = monotonic;
    }
    createAccumulation(startTime) {
        return new SumAccumulation(startTime, this.monotonic);
    }
    /**
     * Returns the result of the merge of the given accumulations.
     */ merge(previous, delta) {
        const prevPv = previous.toPointValue();
        const deltaPv = delta.toPointValue();
        if (delta.reset) {
            return new SumAccumulation(delta.startTime, this.monotonic, deltaPv, delta.reset);
        }
        return new SumAccumulation(previous.startTime, this.monotonic, prevPv + deltaPv);
    }
    /**
     * Returns a new DELTA aggregation by comparing two cumulative measurements.
     */ diff(previous, current) {
        const prevPv = previous.toPointValue();
        const currPv = current.toPointValue();
        /**
         * If the SumAggregator is a monotonic one and the previous point value is
         * greater than the current one, a reset is deemed to be happened.
         * Return the current point value to prevent the value from been reset.
         */ if (this.monotonic && prevPv > currPv) {
            return new SumAccumulation(current.startTime, this.monotonic, currPv, true);
        }
        return new SumAccumulation(current.startTime, this.monotonic, currPv - prevPv);
    }
    toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
        return {
            descriptor,
            aggregationTemporality,
            dataPointType: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DataPointType"].SUM,
            dataPoints: accumulationByAttributes.map(([attributes, accumulation])=>{
                return {
                    attributes,
                    startTime: accumulation.startTime,
                    endTime,
                    value: accumulation.toPointValue()
                };
            }),
            isMonotonic: this.monotonic
        };
    }
} //# sourceMappingURL=Sum.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/Drop.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "DropAggregator",
    ()=>DropAggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/types.js [instrumentation] (ecmascript)");
;
class DropAggregator {
    kind = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregatorKind"].DROP;
    createAccumulation() {
        return undefined;
    }
    merge(_previous, _delta) {
        return undefined;
    }
    diff(_previous, _current) {
        return undefined;
    }
    toMetricData(_descriptor, _aggregationTemporality, _accumulationByAttributes, _endTime) {
        return undefined;
    }
} //# sourceMappingURL=Drop.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/LastValue.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "LastValueAccumulation",
    ()=>LastValueAccumulation,
    "LastValueAggregator",
    ()=>LastValueAggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/types.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/time.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js [instrumentation] (ecmascript)");
;
;
;
class LastValueAccumulation {
    startTime;
    _current;
    sampleTime;
    constructor(startTime, current = 0, sampleTime = [
        0,
        0
    ]){
        this.startTime = startTime;
        this._current = current;
        this.sampleTime = sampleTime;
    }
    record(value) {
        this._current = value;
        this.sampleTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["millisToHrTime"])(Date.now());
    }
    setStartTime(startTime) {
        this.startTime = startTime;
    }
    toPointValue() {
        return this._current;
    }
}
class LastValueAggregator {
    kind = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregatorKind"].LAST_VALUE;
    createAccumulation(startTime) {
        return new LastValueAccumulation(startTime);
    }
    /**
     * Returns the result of the merge of the given accumulations.
     *
     * Return the newly captured (delta) accumulation for LastValueAggregator.
     */ merge(previous, delta) {
        // nanoseconds may lose precisions.
        const latestAccumulation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMicroseconds"])(delta.sampleTime) >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMicroseconds"])(previous.sampleTime) ? delta : previous;
        return new LastValueAccumulation(previous.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
    }
    /**
     * Returns a new DELTA aggregation by comparing two cumulative measurements.
     *
     * A delta aggregation is not meaningful to LastValueAggregator, just return
     * the newly captured (delta) accumulation for LastValueAggregator.
     */ diff(previous, current) {
        // nanoseconds may lose precisions.
        const latestAccumulation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMicroseconds"])(current.sampleTime) >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hrTimeToMicroseconds"])(previous.sampleTime) ? current : previous;
        return new LastValueAccumulation(current.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
    }
    toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
        return {
            descriptor,
            aggregationTemporality,
            dataPointType: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DataPointType"].GAUGE,
            dataPoints: accumulationByAttributes.map(([attributes, accumulation])=>{
                return {
                    attributes,
                    startTime: accumulation.startTime,
                    endTime,
                    value: accumulation.toPointValue()
                };
            })
        };
    }
} //# sourceMappingURL=LastValue.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/Histogram.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "HistogramAccumulation",
    ()=>HistogramAccumulation,
    "HistogramAggregator",
    ()=>HistogramAggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/types.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)");
;
;
;
function createNewEmptyCheckpoint(boundaries) {
    const counts = boundaries.map(()=>0);
    counts.push(0);
    return {
        buckets: {
            boundaries,
            counts
        },
        sum: 0,
        count: 0,
        hasMinMax: false,
        min: Infinity,
        max: -Infinity
    };
}
class HistogramAccumulation {
    startTime;
    _boundaries;
    _recordMinMax;
    _current;
    constructor(startTime, boundaries, recordMinMax = true, current = createNewEmptyCheckpoint(boundaries)){
        this.startTime = startTime;
        this._boundaries = boundaries;
        this._recordMinMax = recordMinMax;
        this._current = current;
    }
    record(value) {
        // NaN does not fall into any bucket, is not zero and should not be counted,
        // NaN is never greater than max nor less than min, therefore return as there's nothing for us to do.
        if (Number.isNaN(value)) {
            return;
        }
        this._current.count += 1;
        this._current.sum += value;
        if (this._recordMinMax) {
            this._current.min = Math.min(value, this._current.min);
            this._current.max = Math.max(value, this._current.max);
            this._current.hasMinMax = true;
        }
        const idx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["binarySearchUB"])(this._boundaries, value);
        this._current.buckets.counts[idx] += 1;
    }
    setStartTime(startTime) {
        this.startTime = startTime;
    }
    toPointValue() {
        return this._current;
    }
}
class HistogramAggregator {
    kind = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregatorKind"].HISTOGRAM;
    _boundaries;
    _recordMinMax;
    /**
     * @param _boundaries sorted upper bounds of recorded values.
     * @param _recordMinMax If set to true, min and max will be recorded. Otherwise, min and max will not be recorded.
     */ constructor(boundaries, recordMinMax){
        this._boundaries = boundaries;
        this._recordMinMax = recordMinMax;
    }
    createAccumulation(startTime) {
        return new HistogramAccumulation(startTime, this._boundaries, this._recordMinMax);
    }
    /**
     * Return the result of the merge of two histogram accumulations. As long as one Aggregator
     * instance produces all Accumulations with constant boundaries we don't need to worry about
     * merging accumulations with different boundaries.
     */ merge(previous, delta) {
        const previousValue = previous.toPointValue();
        const deltaValue = delta.toPointValue();
        const previousCounts = previousValue.buckets.counts;
        const deltaCounts = deltaValue.buckets.counts;
        const mergedCounts = new Array(previousCounts.length);
        for(let idx = 0; idx < previousCounts.length; idx++){
            mergedCounts[idx] = previousCounts[idx] + deltaCounts[idx];
        }
        let min = Infinity;
        let max = -Infinity;
        if (this._recordMinMax) {
            if (previousValue.hasMinMax && deltaValue.hasMinMax) {
                min = Math.min(previousValue.min, deltaValue.min);
                max = Math.max(previousValue.max, deltaValue.max);
            } else if (previousValue.hasMinMax) {
                min = previousValue.min;
                max = previousValue.max;
            } else if (deltaValue.hasMinMax) {
                min = deltaValue.min;
                max = deltaValue.max;
            }
        }
        return new HistogramAccumulation(previous.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
            buckets: {
                boundaries: previousValue.buckets.boundaries,
                counts: mergedCounts
            },
            count: previousValue.count + deltaValue.count,
            sum: previousValue.sum + deltaValue.sum,
            hasMinMax: this._recordMinMax && (previousValue.hasMinMax || deltaValue.hasMinMax),
            min: min,
            max: max
        });
    }
    /**
     * Returns a new DELTA aggregation by comparing two cumulative measurements.
     */ diff(previous, current) {
        const previousValue = previous.toPointValue();
        const currentValue = current.toPointValue();
        const previousCounts = previousValue.buckets.counts;
        const currentCounts = currentValue.buckets.counts;
        const diffedCounts = new Array(previousCounts.length);
        for(let idx = 0; idx < previousCounts.length; idx++){
            diffedCounts[idx] = currentCounts[idx] - previousCounts[idx];
        }
        return new HistogramAccumulation(current.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
            buckets: {
                boundaries: previousValue.buckets.boundaries,
                counts: diffedCounts
            },
            count: currentValue.count - previousValue.count,
            sum: currentValue.sum - previousValue.sum,
            hasMinMax: false,
            min: Infinity,
            max: -Infinity
        });
    }
    toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
        return {
            descriptor,
            aggregationTemporality,
            dataPointType: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DataPointType"].HISTOGRAM,
            dataPoints: accumulationByAttributes.map(([attributes, accumulation])=>{
                const pointValue = accumulation.toPointValue();
                // determine if instrument allows negative values.
                const allowsNegativeValues = descriptor.type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].GAUGE || descriptor.type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].UP_DOWN_COUNTER || descriptor.type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_GAUGE || descriptor.type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_UP_DOWN_COUNTER;
                return {
                    attributes,
                    startTime: accumulation.startTime,
                    endTime,
                    value: {
                        min: pointValue.hasMinMax ? pointValue.min : undefined,
                        max: pointValue.hasMinMax ? pointValue.max : undefined,
                        sum: !allowsNegativeValues ? pointValue.sum : undefined,
                        buckets: pointValue.buckets,
                        count: pointValue.count
                    }
                };
            })
        };
    }
} //# sourceMappingURL=Histogram.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/Buckets.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "Buckets",
    ()=>Buckets
]);
class Buckets {
    backing;
    indexBase;
    indexStart;
    indexEnd;
    /**
     * The term index refers to the number of the exponential histogram bucket
     * used to determine its boundaries. The lower boundary of a bucket is
     * determined by base ** index and the upper boundary of a bucket is
     * determined by base ** (index + 1). index values are signed to account
     * for values less than or equal to 1.
     *
     * indexBase is the index of the 0th position in the
     * backing array, i.e., backing[0] is the count
     * in the bucket with index `indexBase`.
     *
     * indexStart is the smallest index value represented
     * in the backing array.
     *
     * indexEnd is the largest index value represented in
     * the backing array.
     */ constructor(backing = new BucketsBacking(), indexBase = 0, indexStart = 0, indexEnd = 0){
        this.backing = backing;
        this.indexBase = indexBase;
        this.indexStart = indexStart;
        this.indexEnd = indexEnd;
    }
    /**
     * Offset is the bucket index of the smallest entry in the counts array
     * @returns {number}
     */ get offset() {
        return this.indexStart;
    }
    /**
     * Buckets is a view into the backing array.
     * @returns {number}
     */ get length() {
        if (this.backing.length === 0) {
            return 0;
        }
        if (this.indexEnd === this.indexStart && this.at(0) === 0) {
            return 0;
        }
        return this.indexEnd - this.indexStart + 1;
    }
    /**
     * An array of counts, where count[i] carries the count
     * of the bucket at index (offset+i).  count[i] is the count of
     * values greater than base^(offset+i) and less than or equal to
     * base^(offset+i+1).
     * @returns {number} The logical counts based on the backing array
     */ counts() {
        return Array.from({
            length: this.length
        }, (_, i)=>this.at(i));
    }
    /**
     * At returns the count of the bucket at a position in the logical
     * array of counts.
     * @param position
     * @returns {number}
     */ at(position) {
        const bias = this.indexBase - this.indexStart;
        if (position < bias) {
            position += this.backing.length;
        }
        position -= bias;
        return this.backing.countAt(position);
    }
    /**
     * incrementBucket increments the backing array index by `increment`
     * @param bucketIndex
     * @param increment
     */ incrementBucket(bucketIndex, increment) {
        this.backing.increment(bucketIndex, increment);
    }
    /**
     * decrementBucket decrements the backing array index by `decrement`
     * if decrement is greater than the current value, it's set to 0.
     * @param bucketIndex
     * @param decrement
     */ decrementBucket(bucketIndex, decrement) {
        this.backing.decrement(bucketIndex, decrement);
    }
    /**
     * trim removes leading and / or trailing zero buckets (which can occur
     * after diffing two histos) and rotates the backing array so that the
     * smallest non-zero index is in the 0th position of the backing array
     */ trim() {
        for(let i = 0; i < this.length; i++){
            if (this.at(i) !== 0) {
                this.indexStart += i;
                break;
            } else if (i === this.length - 1) {
                //the entire array is zeroed out
                this.indexStart = this.indexEnd = this.indexBase = 0;
                return;
            }
        }
        for(let i = this.length - 1; i >= 0; i--){
            if (this.at(i) !== 0) {
                this.indexEnd -= this.length - i - 1;
                break;
            }
        }
        this._rotate();
    }
    /**
     * downscale first rotates, then collapses 2**`by`-to-1 buckets.
     * @param by
     */ downscale(by) {
        this._rotate();
        const size = 1 + this.indexEnd - this.indexStart;
        const each = 1 << by;
        let inpos = 0;
        let outpos = 0;
        for(let pos = this.indexStart; pos <= this.indexEnd;){
            let mod = pos % each;
            if (mod < 0) {
                mod += each;
            }
            for(let i = mod; i < each && inpos < size; i++){
                this._relocateBucket(outpos, inpos);
                inpos++;
                pos++;
            }
            outpos++;
        }
        this.indexStart >>= by;
        this.indexEnd >>= by;
        this.indexBase = this.indexStart;
    }
    /**
     * Clone returns a deep copy of Buckets
     * @returns {Buckets}
     */ clone() {
        return new Buckets(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd);
    }
    /**
     * _rotate shifts the backing array contents so that indexStart ==
     * indexBase to simplify the downscale logic.
     */ _rotate() {
        const bias = this.indexBase - this.indexStart;
        if (bias === 0) {
            return;
        } else if (bias > 0) {
            this.backing.reverse(0, this.backing.length);
            this.backing.reverse(0, bias);
            this.backing.reverse(bias, this.backing.length);
        } else {
            // negative bias, this can happen when diffing two histograms
            this.backing.reverse(0, this.backing.length);
            this.backing.reverse(0, this.backing.length + bias);
        }
        this.indexBase = this.indexStart;
    }
    /**
     * _relocateBucket adds the count in counts[src] to counts[dest] and
     * resets count[src] to zero.
     */ _relocateBucket(dest, src) {
        if (dest === src) {
            return;
        }
        this.incrementBucket(dest, this.backing.emptyBucket(src));
    }
}
/**
 * BucketsBacking holds the raw buckets and some utility methods to
 * manage them.
 */ class BucketsBacking {
    _counts;
    constructor(counts = [
        0
    ]){
        this._counts = counts;
    }
    /**
     * length returns the physical size of the backing array, which
     * is >= buckets.length()
     */ get length() {
        return this._counts.length;
    }
    /**
     * countAt returns the count in a specific bucket
     */ countAt(pos) {
        return this._counts[pos];
    }
    /**
     * growTo grows a backing array and copies old entries
     * into their correct new positions.
     */ growTo(newSize, oldPositiveLimit, newPositiveLimit) {
        const tmp = new Array(newSize).fill(0);
        tmp.splice(newPositiveLimit, this._counts.length - oldPositiveLimit, ...this._counts.slice(oldPositiveLimit));
        tmp.splice(0, oldPositiveLimit, ...this._counts.slice(0, oldPositiveLimit));
        this._counts = tmp;
    }
    /**
     * reverse the items in the backing array in the range [from, limit).
     */ reverse(from, limit) {
        const num = Math.floor((from + limit) / 2) - from;
        for(let i = 0; i < num; i++){
            const tmp = this._counts[from + i];
            this._counts[from + i] = this._counts[limit - i - 1];
            this._counts[limit - i - 1] = tmp;
        }
    }
    /**
     * emptyBucket empties the count from a bucket, for
     * moving into another.
     */ emptyBucket(src) {
        const tmp = this._counts[src];
        this._counts[src] = 0;
        return tmp;
    }
    /**
     * increments a bucket by `increment`
     */ increment(bucketIndex, increment) {
        this._counts[bucketIndex] += increment;
    }
    /**
     * decrements a bucket by `decrement`
     */ decrement(bucketIndex, decrement) {
        if (this._counts[bucketIndex] >= decrement) {
            this._counts[bucketIndex] -= decrement;
        } else {
            // this should not happen, but we're being defensive against
            // negative counts.
            this._counts[bucketIndex] = 0;
        }
    }
    /**
     * clone returns a deep copy of BucketsBacking
     */ clone() {
        return new BucketsBacking([
            ...this._counts
        ]);
    }
} //# sourceMappingURL=Buckets.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/ieee754.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * The functions and constants in this file allow us to interact
 * with the internal representation of an IEEE 64-bit floating point
 * number. We need to work with all 64-bits, thus, care needs to be
 * taken when working with Javascript's bitwise operators (<<, >>, &,
 * |, etc) as they truncate operands to 32-bits. In order to work around
 * this we work with the 64-bits as two 32-bit halves, perform bitwise
 * operations on them independently, and combine the results (if needed).
 */ __turbopack_context__.s([
    "MAX_NORMAL_EXPONENT",
    ()=>MAX_NORMAL_EXPONENT,
    "MIN_NORMAL_EXPONENT",
    ()=>MIN_NORMAL_EXPONENT,
    "MIN_VALUE",
    ()=>MIN_VALUE,
    "SIGNIFICAND_WIDTH",
    ()=>SIGNIFICAND_WIDTH,
    "getNormalBase2",
    ()=>getNormalBase2,
    "getSignificand",
    ()=>getSignificand
]);
const SIGNIFICAND_WIDTH = 52;
/**
 * EXPONENT_MASK is set to 1 for the hi 32-bits of an IEEE 754
 * floating point exponent: 0x7ff00000.
 */ const EXPONENT_MASK = 0x7ff00000;
/**
 * SIGNIFICAND_MASK is the mask for the significand portion of the hi 32-bits
 * of an IEEE 754 double-precision floating-point value: 0xfffff
 */ const SIGNIFICAND_MASK = 0xfffff;
/**
 * EXPONENT_BIAS is the exponent bias specified for encoding
 * the IEEE 754 double-precision floating point exponent: 1023
 */ const EXPONENT_BIAS = 1023;
const MIN_NORMAL_EXPONENT = -EXPONENT_BIAS + 1;
const MAX_NORMAL_EXPONENT = EXPONENT_BIAS;
const MIN_VALUE = Math.pow(2, -1022);
function getNormalBase2(value) {
    const dv = new DataView(new ArrayBuffer(8));
    dv.setFloat64(0, value);
    // access the raw 64-bit float as 32-bit uints
    const hiBits = dv.getUint32(0);
    const expBits = (hiBits & EXPONENT_MASK) >> 20;
    return expBits - EXPONENT_BIAS;
}
function getSignificand(value) {
    const dv = new DataView(new ArrayBuffer(8));
    dv.setFloat64(0, value);
    // access the raw 64-bit float as two 32-bit uints
    const hiBits = dv.getUint32(0);
    const loBits = dv.getUint32(4);
    // extract the significand bits from the hi bits and left shift 32 places note:
    // we can't use the native << operator as it will truncate the result to 32-bits
    const significandHiBits = (hiBits & SIGNIFICAND_MASK) * Math.pow(2, 32);
    // combine the hi and lo bits and return
    return significandHiBits + loBits;
} //# sourceMappingURL=ieee754.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/util.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * Note: other languages provide this as a built in function. This is
 * a naive, but functionally correct implementation. This is used sparingly,
 * when creating a new mapping in a running application.
 *
 * ldexp returns frac × 2**exp. With the following special cases:
 *   ldexp(±0, exp) = ±0
 *   ldexp(±Inf, exp) = ±Inf
 *   ldexp(NaN, exp) = NaN
 * @param frac
 * @param exp
 * @returns {number}
 */ __turbopack_context__.s([
    "ldexp",
    ()=>ldexp,
    "nextGreaterSquare",
    ()=>nextGreaterSquare
]);
function ldexp(frac, exp) {
    if (frac === 0 || frac === Number.POSITIVE_INFINITY || frac === Number.NEGATIVE_INFINITY || Number.isNaN(frac)) {
        return frac;
    }
    return frac * Math.pow(2, exp);
}
function nextGreaterSquare(v) {
    // The following expression computes the least power-of-two
    // that is >= v.  There are a number of tricky ways to
    // do this, see https://stackoverflow.com/questions/466204/rounding-up-to-next-power-of-2
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
} //# sourceMappingURL=util.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/types.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MappingError",
    ()=>MappingError
]);
class MappingError extends Error {
} //# sourceMappingURL=types.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/ExponentMapping.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ExponentMapping",
    ()=>ExponentMapping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/ieee754.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/util.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/types.js [instrumentation] (ecmascript)");
;
;
;
class ExponentMapping {
    _shift;
    constructor(scale){
        this._shift = -scale;
    }
    /**
     * Maps positive floating point values to indexes corresponding to scale
     * @param value
     * @returns {number} index for provided value at the current scale
     */ mapToIndex(value) {
        if (value < __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MIN_VALUE"]) {
            return this._minNormalLowerBoundaryIndex();
        }
        const exp = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getNormalBase2"](value);
        // In case the value is an exact power of two, compute a
        // correction of -1. Note, we are using a custom _rightShift
        // to accommodate a 52-bit argument, which the native bitwise
        // operators do not support
        const correction = this._rightShift(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getSignificand"](value) - 1, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SIGNIFICAND_WIDTH"]);
        return exp + correction >> this._shift;
    }
    /**
     * Returns the lower bucket boundary for the given index for scale
     *
     * @param index
     * @returns {number}
     */ lowerBoundary(index) {
        const minIndex = this._minNormalLowerBoundaryIndex();
        if (index < minIndex) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MappingError"](`underflow: ${index} is < minimum lower boundary: ${minIndex}`);
        }
        const maxIndex = this._maxNormalLowerBoundaryIndex();
        if (index > maxIndex) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MappingError"](`overflow: ${index} is > maximum lower boundary: ${maxIndex}`);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ldexp"](1, index << this._shift);
    }
    /**
     * The scale used by this mapping
     * @returns {number}
     */ get scale() {
        if (this._shift === 0) {
            return 0;
        }
        return -this._shift;
    }
    _minNormalLowerBoundaryIndex() {
        let index = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MIN_NORMAL_EXPONENT"] >> this._shift;
        if (this._shift < 2) {
            index--;
        }
        return index;
    }
    _maxNormalLowerBoundaryIndex() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MAX_NORMAL_EXPONENT"] >> this._shift;
    }
    _rightShift(value, shift) {
        return Math.floor(value * Math.pow(2, -shift));
    }
} //# sourceMappingURL=ExponentMapping.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/LogarithmMapping.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "LogarithmMapping",
    ()=>LogarithmMapping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/ieee754.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/util.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/types.js [instrumentation] (ecmascript)");
;
;
;
class LogarithmMapping {
    _scale;
    _scaleFactor;
    _inverseFactor;
    constructor(scale){
        this._scale = scale;
        this._scaleFactor = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ldexp"](Math.LOG2E, scale);
        this._inverseFactor = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ldexp"](Math.LN2, -scale);
    }
    /**
     * Maps positive floating point values to indexes corresponding to scale
     * @param value
     * @returns {number} index for provided value at the current scale
     */ mapToIndex(value) {
        if (value <= __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MIN_VALUE"]) {
            return this._minNormalLowerBoundaryIndex() - 1;
        }
        // exact power of two special case
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getSignificand"](value) === 0) {
            const exp = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getNormalBase2"](value);
            return (exp << this._scale) - 1;
        }
        // non-power of two cases. use Math.floor to round the scaled logarithm
        const index = Math.floor(Math.log(value) * this._scaleFactor);
        const maxIndex = this._maxNormalLowerBoundaryIndex();
        if (index >= maxIndex) {
            return maxIndex;
        }
        return index;
    }
    /**
     * Returns the lower bucket boundary for the given index for scale
     *
     * @param index
     * @returns {number}
     */ lowerBoundary(index) {
        const maxIndex = this._maxNormalLowerBoundaryIndex();
        if (index >= maxIndex) {
            if (index === maxIndex) {
                return 2 * Math.exp((index - (1 << this._scale)) / this._scaleFactor);
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MappingError"](`overflow: ${index} is > maximum lower boundary: ${maxIndex}`);
        }
        const minIndex = this._minNormalLowerBoundaryIndex();
        if (index <= minIndex) {
            if (index === minIndex) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MIN_VALUE"];
            } else if (index === minIndex - 1) {
                return Math.exp((index + (1 << this._scale)) / this._scaleFactor) / 2;
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MappingError"](`overflow: ${index} is < minimum lower boundary: ${minIndex}`);
        }
        return Math.exp(index * this._inverseFactor);
    }
    /**
     * The scale used by this mapping
     * @returns {number}
     */ get scale() {
        return this._scale;
    }
    _minNormalLowerBoundaryIndex() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MIN_NORMAL_EXPONENT"] << this._scale;
    }
    _maxNormalLowerBoundaryIndex() {
        return (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ieee754$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MAX_NORMAL_EXPONENT"] + 1 << this._scale) - 1;
    }
} //# sourceMappingURL=LogarithmMapping.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/getMapping.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "getMapping",
    ()=>getMapping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ExponentMapping$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/ExponentMapping.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$LogarithmMapping$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/LogarithmMapping.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/types.js [instrumentation] (ecmascript)");
;
;
;
const MIN_SCALE = -10;
const MAX_SCALE = 20;
const PREBUILT_MAPPINGS = Array.from({
    length: 31
}, (_, i)=>{
    if (i > 10) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$LogarithmMapping$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["LogarithmMapping"](i - 10);
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$ExponentMapping$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExponentMapping"](i - 10);
});
function getMapping(scale) {
    if (scale > MAX_SCALE || scale < MIN_SCALE) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MappingError"](`expected scale >= ${MIN_SCALE} && <= ${MAX_SCALE}, got: ${scale}`);
    }
    // mappings are offset by 10. scale -10 is at position 0 and scale 20 is at 30
    return PREBUILT_MAPPINGS[scale + 10];
} //# sourceMappingURL=getMapping.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/ExponentialHistogram.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ExponentialHistogramAccumulation",
    ()=>ExponentialHistogramAccumulation,
    "ExponentialHistogramAggregator",
    ()=>ExponentialHistogramAggregator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/types.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$Buckets$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/Buckets.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$getMapping$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/getMapping.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/util.js [instrumentation] (ecmascript)");
;
;
;
;
;
;
// HighLow is a utility class used for computing a common scale for
// two exponential histogram accumulations
class HighLow {
    static combine(h1, h2) {
        return new HighLow(Math.min(h1.low, h2.low), Math.max(h1.high, h2.high));
    }
    low;
    high;
    constructor(low, high){
        this.low = low;
        this.high = high;
    }
}
const MAX_SCALE = 20;
const DEFAULT_MAX_SIZE = 160;
const MIN_MAX_SIZE = 2;
class ExponentialHistogramAccumulation {
    startTime;
    _maxSize;
    _recordMinMax;
    _sum;
    _count;
    _zeroCount;
    _min;
    _max;
    _positive;
    _negative;
    _mapping;
    constructor(startTime, maxSize = DEFAULT_MAX_SIZE, recordMinMax = true, sum = 0, count = 0, zeroCount = 0, min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY, positive = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$Buckets$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["Buckets"](), negative = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$Buckets$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["Buckets"](), mapping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$getMapping$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getMapping"])(MAX_SCALE)){
        this.startTime = startTime;
        this._maxSize = maxSize;
        this._recordMinMax = recordMinMax;
        this._sum = sum;
        this._count = count;
        this._zeroCount = zeroCount;
        this._min = min;
        this._max = max;
        this._positive = positive;
        this._negative = negative;
        this._mapping = mapping;
        if (this._maxSize < MIN_MAX_SIZE) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Exponential Histogram Max Size set to ${this._maxSize}, \
                changing to the minimum size of: ${MIN_MAX_SIZE}`);
            this._maxSize = MIN_MAX_SIZE;
        }
    }
    /**
     * record updates a histogram with a single count
     * @param {Number} value
     */ record(value) {
        this.updateByIncrement(value, 1);
    }
    /**
     * Sets the start time for this accumulation
     * @param {HrTime} startTime
     */ setStartTime(startTime) {
        this.startTime = startTime;
    }
    /**
     * Returns the datapoint representation of this accumulation
     * @param {HrTime} startTime
     */ toPointValue() {
        return {
            hasMinMax: this._recordMinMax,
            min: this.min,
            max: this.max,
            sum: this.sum,
            positive: {
                offset: this.positive.offset,
                bucketCounts: this.positive.counts()
            },
            negative: {
                offset: this.negative.offset,
                bucketCounts: this.negative.counts()
            },
            count: this.count,
            scale: this.scale,
            zeroCount: this.zeroCount
        };
    }
    /**
     * @returns {Number} The sum of values recorded by this accumulation
     */ get sum() {
        return this._sum;
    }
    /**
     * @returns {Number} The minimum value recorded by this accumulation
     */ get min() {
        return this._min;
    }
    /**
     * @returns {Number} The maximum value recorded by this accumulation
     */ get max() {
        return this._max;
    }
    /**
     * @returns {Number} The count of values recorded by this accumulation
     */ get count() {
        return this._count;
    }
    /**
     * @returns {Number} The number of 0 values recorded by this accumulation
     */ get zeroCount() {
        return this._zeroCount;
    }
    /**
     * @returns {Number} The scale used by this accumulation
     */ get scale() {
        if (this._count === this._zeroCount) {
            // all zeros! scale doesn't matter, use zero
            return 0;
        }
        return this._mapping.scale;
    }
    /**
     * positive holds the positive values
     * @returns {Buckets}
     */ get positive() {
        return this._positive;
    }
    /**
     * negative holds the negative values by their absolute value
     * @returns {Buckets}
     */ get negative() {
        return this._negative;
    }
    /**
     * updateByIncr supports updating a histogram with a non-negative
     * increment.
     * @param value
     * @param increment
     */ updateByIncrement(value, increment) {
        // NaN does not fall into any bucket, is not zero and should not be counted,
        // NaN is never greater than max nor less than min, therefore return as there's nothing for us to do.
        if (Number.isNaN(value)) {
            return;
        }
        if (value > this._max) {
            this._max = value;
        }
        if (value < this._min) {
            this._min = value;
        }
        this._count += increment;
        if (value === 0) {
            this._zeroCount += increment;
            return;
        }
        this._sum += value * increment;
        if (value > 0) {
            this._updateBuckets(this._positive, value, increment);
        } else {
            this._updateBuckets(this._negative, -value, increment);
        }
    }
    /**
     * merge combines data from previous value into self
     * @param {ExponentialHistogramAccumulation} previous
     */ merge(previous) {
        if (this._count === 0) {
            this._min = previous.min;
            this._max = previous.max;
        } else if (previous.count !== 0) {
            if (previous.min < this.min) {
                this._min = previous.min;
            }
            if (previous.max > this.max) {
                this._max = previous.max;
            }
        }
        this.startTime = previous.startTime;
        this._sum += previous.sum;
        this._count += previous.count;
        this._zeroCount += previous.zeroCount;
        const minScale = this._minScale(previous);
        this._downscale(this.scale - minScale);
        this._mergeBuckets(this.positive, previous, previous.positive, minScale);
        this._mergeBuckets(this.negative, previous, previous.negative, minScale);
    }
    /**
     * diff subtracts other from self
     * @param {ExponentialHistogramAccumulation} other
     */ diff(other) {
        this._min = Infinity;
        this._max = -Infinity;
        this._sum -= other.sum;
        this._count -= other.count;
        this._zeroCount -= other.zeroCount;
        const minScale = this._minScale(other);
        this._downscale(this.scale - minScale);
        this._diffBuckets(this.positive, other, other.positive, minScale);
        this._diffBuckets(this.negative, other, other.negative, minScale);
    }
    /**
     * clone returns a deep copy of self
     * @returns {ExponentialHistogramAccumulation}
     */ clone() {
        return new ExponentialHistogramAccumulation(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping);
    }
    /**
     * _updateBuckets maps the incoming value to a bucket index for the current
     * scale. If the bucket index is outside of the range of the backing array,
     * it will rescale the backing array and update the mapping for the new scale.
     */ _updateBuckets(buckets, value, increment) {
        let index = this._mapping.mapToIndex(value);
        // rescale the mapping if needed
        let rescalingNeeded = false;
        let high = 0;
        let low = 0;
        if (buckets.length === 0) {
            buckets.indexStart = index;
            buckets.indexEnd = buckets.indexStart;
            buckets.indexBase = buckets.indexStart;
        } else if (index < buckets.indexStart && buckets.indexEnd - index >= this._maxSize) {
            rescalingNeeded = true;
            low = index;
            high = buckets.indexEnd;
        } else if (index > buckets.indexEnd && index - buckets.indexStart >= this._maxSize) {
            rescalingNeeded = true;
            low = buckets.indexStart;
            high = index;
        }
        // rescale and compute index at new scale
        if (rescalingNeeded) {
            const change = this._changeScale(high, low);
            this._downscale(change);
            index = this._mapping.mapToIndex(value);
        }
        this._incrementIndexBy(buckets, index, increment);
    }
    /**
     * _incrementIndexBy increments the count of the bucket specified by `index`.
     * If the index is outside of the range [buckets.indexStart, buckets.indexEnd]
     * the boundaries of the backing array will be adjusted and more buckets will
     * be added if needed.
     */ _incrementIndexBy(buckets, index, increment) {
        if (increment === 0) {
            // nothing to do for a zero increment, can happen during a merge operation
            return;
        }
        if (buckets.length === 0) {
            buckets.indexStart = buckets.indexEnd = buckets.indexBase = index;
        }
        if (index < buckets.indexStart) {
            const span = buckets.indexEnd - index;
            if (span >= buckets.backing.length) {
                this._grow(buckets, span + 1);
            }
            buckets.indexStart = index;
        } else if (index > buckets.indexEnd) {
            const span = index - buckets.indexStart;
            if (span >= buckets.backing.length) {
                this._grow(buckets, span + 1);
            }
            buckets.indexEnd = index;
        }
        let bucketIndex = index - buckets.indexBase;
        if (bucketIndex < 0) {
            bucketIndex += buckets.backing.length;
        }
        buckets.incrementBucket(bucketIndex, increment);
    }
    /**
     * grow resizes the backing array by doubling in size up to maxSize.
     * This extends the array with a bunch of zeros and copies the
     * existing counts to the same position.
     */ _grow(buckets, needed) {
        const size = buckets.backing.length;
        const bias = buckets.indexBase - buckets.indexStart;
        const oldPositiveLimit = size - bias;
        let newSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$util$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["nextGreaterSquare"])(needed);
        if (newSize > this._maxSize) {
            newSize = this._maxSize;
        }
        const newPositiveLimit = newSize - bias;
        buckets.backing.growTo(newSize, oldPositiveLimit, newPositiveLimit);
    }
    /**
     * _changeScale computes how much downscaling is needed by shifting the
     * high and low values until they are separated by no more than size.
     */ _changeScale(high, low) {
        let change = 0;
        while(high - low >= this._maxSize){
            high >>= 1;
            low >>= 1;
            change++;
        }
        return change;
    }
    /**
     * _downscale subtracts `change` from the current mapping scale.
     */ _downscale(change) {
        if (change === 0) {
            return;
        }
        if (change < 0) {
            // Note: this should be impossible. If we get here it's because
            // there is a bug in the implementation.
            throw new Error(`impossible change of scale: ${this.scale}`);
        }
        const newScale = this._mapping.scale - change;
        this._positive.downscale(change);
        this._negative.downscale(change);
        this._mapping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$exponential$2d$histogram$2f$mapping$2f$getMapping$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getMapping"])(newScale);
    }
    /**
     * _minScale is used by diff and merge to compute an ideal combined scale
     */ _minScale(other) {
        const minScale = Math.min(this.scale, other.scale);
        const highLowPos = HighLow.combine(this._highLowAtScale(this.positive, this.scale, minScale), this._highLowAtScale(other.positive, other.scale, minScale));
        const highLowNeg = HighLow.combine(this._highLowAtScale(this.negative, this.scale, minScale), this._highLowAtScale(other.negative, other.scale, minScale));
        return Math.min(minScale - this._changeScale(highLowPos.high, highLowPos.low), minScale - this._changeScale(highLowNeg.high, highLowNeg.low));
    }
    /**
     * _highLowAtScale is used by diff and merge to compute an ideal combined scale.
     */ _highLowAtScale(buckets, currentScale, newScale) {
        if (buckets.length === 0) {
            return new HighLow(0, -1);
        }
        const shift = currentScale - newScale;
        return new HighLow(buckets.indexStart >> shift, buckets.indexEnd >> shift);
    }
    /**
     * _mergeBuckets translates index values from another histogram and
     * adds the values into the corresponding buckets of this histogram.
     */ _mergeBuckets(ours, other, theirs, scale) {
        const theirOffset = theirs.offset;
        const theirChange = other.scale - scale;
        for(let i = 0; i < theirs.length; i++){
            this._incrementIndexBy(ours, theirOffset + i >> theirChange, theirs.at(i));
        }
    }
    /**
     * _diffBuckets translates index values from another histogram and
     * subtracts the values in the corresponding buckets of this histogram.
     */ _diffBuckets(ours, other, theirs, scale) {
        const theirOffset = theirs.offset;
        const theirChange = other.scale - scale;
        for(let i = 0; i < theirs.length; i++){
            const ourIndex = theirOffset + i >> theirChange;
            let bucketIndex = ourIndex - ours.indexBase;
            if (bucketIndex < 0) {
                bucketIndex += ours.backing.length;
            }
            ours.decrementBucket(bucketIndex, theirs.at(i));
        }
        ours.trim();
    }
}
class ExponentialHistogramAggregator {
    kind = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$types$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregatorKind"].EXPONENTIAL_HISTOGRAM;
    _maxSize;
    _recordMinMax;
    /**
     * @param _maxSize Maximum number of buckets for each of the positive
     *    and negative ranges, exclusive of the zero-bucket.
     * @param _recordMinMax If set to true, min and max will be recorded.
     *    Otherwise, min and max will not be recorded.
     */ constructor(maxSize, recordMinMax){
        this._maxSize = maxSize;
        this._recordMinMax = recordMinMax;
    }
    createAccumulation(startTime) {
        return new ExponentialHistogramAccumulation(startTime, this._maxSize, this._recordMinMax);
    }
    /**
     * Return the result of the merge of two exponential histogram accumulations.
     */ merge(previous, delta) {
        const result = delta.clone();
        result.merge(previous);
        return result;
    }
    /**
     * Returns a new DELTA aggregation by comparing two cumulative measurements.
     */ diff(previous, current) {
        const result = current.clone();
        result.diff(previous);
        return result;
    }
    toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
        return {
            descriptor,
            aggregationTemporality,
            dataPointType: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DataPointType"].EXPONENTIAL_HISTOGRAM,
            dataPoints: accumulationByAttributes.map(([attributes, accumulation])=>{
                const pointValue = accumulation.toPointValue();
                // determine if instrument allows negative values.
                const allowsNegativeValues = descriptor.type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].GAUGE || descriptor.type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].UP_DOWN_COUNTER || descriptor.type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_GAUGE || descriptor.type === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_UP_DOWN_COUNTER;
                return {
                    attributes,
                    startTime: accumulation.startTime,
                    endTime,
                    value: {
                        min: pointValue.hasMinMax ? pointValue.min : undefined,
                        max: pointValue.hasMinMax ? pointValue.max : undefined,
                        sum: !allowsNegativeValues ? pointValue.sum : undefined,
                        positive: {
                            offset: pointValue.positive.offset,
                            bucketCounts: pointValue.positive.bucketCounts
                        },
                        negative: {
                            offset: pointValue.negative.offset,
                            bucketCounts: pointValue.negative.bucketCounts
                        },
                        count: pointValue.count,
                        scale: pointValue.scale,
                        zeroCount: pointValue.zeroCount
                    }
                };
            })
        };
    }
} //# sourceMappingURL=ExponentialHistogram.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/Aggregation.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "DEFAULT_AGGREGATION",
    ()=>DEFAULT_AGGREGATION,
    "DROP_AGGREGATION",
    ()=>DROP_AGGREGATION,
    "DefaultAggregation",
    ()=>DefaultAggregation,
    "DropAggregation",
    ()=>DropAggregation,
    "EXPONENTIAL_HISTOGRAM_AGGREGATION",
    ()=>EXPONENTIAL_HISTOGRAM_AGGREGATION,
    "ExplicitBucketHistogramAggregation",
    ()=>ExplicitBucketHistogramAggregation,
    "ExponentialHistogramAggregation",
    ()=>ExponentialHistogramAggregation,
    "HISTOGRAM_AGGREGATION",
    ()=>HISTOGRAM_AGGREGATION,
    "HistogramAggregation",
    ()=>HistogramAggregation,
    "LAST_VALUE_AGGREGATION",
    ()=>LAST_VALUE_AGGREGATION,
    "LastValueAggregation",
    ()=>LastValueAggregation,
    "SUM_AGGREGATION",
    ()=>SUM_AGGREGATION,
    "SumAggregation",
    ()=>SumAggregation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$Sum$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/Sum.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$Drop$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/Drop.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$LastValue$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/LastValue.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$Histogram$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/Histogram.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$ExponentialHistogram$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/ExponentialHistogram.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js [instrumentation] (ecmascript)");
;
;
;
/**
 * The default drop aggregation.
 */ class DropAggregation {
    static DEFAULT_INSTANCE = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$Drop$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DropAggregator"]();
    createAggregator(_instrument) {
        return DropAggregation.DEFAULT_INSTANCE;
    }
}
;
/**
 * The default sum aggregation.
 */ class SumAggregation {
    static MONOTONIC_INSTANCE = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$Sum$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SumAggregator"](true);
    static NON_MONOTONIC_INSTANCE = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$Sum$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SumAggregator"](false);
    createAggregator(instrument) {
        switch(instrument.type){
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].COUNTER:
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_COUNTER:
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].HISTOGRAM:
                {
                    return SumAggregation.MONOTONIC_INSTANCE;
                }
            default:
                {
                    return SumAggregation.NON_MONOTONIC_INSTANCE;
                }
        }
    }
}
;
/**
 * The default last value aggregation.
 */ class LastValueAggregation {
    static DEFAULT_INSTANCE = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$LastValue$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["LastValueAggregator"]();
    createAggregator(_instrument) {
        return LastValueAggregation.DEFAULT_INSTANCE;
    }
}
;
/**
 * The default histogram aggregation.

 */ class HistogramAggregation {
    static DEFAULT_INSTANCE = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$Histogram$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["HistogramAggregator"]([
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
    ], true);
    createAggregator(_instrument) {
        return HistogramAggregation.DEFAULT_INSTANCE;
    }
}
;
class ExplicitBucketHistogramAggregation {
    _boundaries;
    _recordMinMax;
    /**
     * @param boundaries the bucket boundaries of the histogram aggregation
     * @param _recordMinMax If set to true, min and max will be recorded. Otherwise, min and max will not be recorded.
     */ constructor(boundaries, recordMinMax = true){
        if (boundaries == null) {
            throw new Error('ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array');
        }
        // Copy the boundaries array for modification.
        boundaries = boundaries.concat();
        // We need to an ordered set to be able to correctly compute count for each
        // boundary since we'll iterate on each in order.
        boundaries = boundaries.sort((a, b)=>a - b);
        // Remove all Infinity from the boundaries.
        const minusInfinityIndex = boundaries.lastIndexOf(-Infinity);
        let infinityIndex = boundaries.indexOf(Infinity);
        if (infinityIndex === -1) {
            infinityIndex = undefined;
        }
        this._boundaries = boundaries.slice(minusInfinityIndex + 1, infinityIndex);
        this._recordMinMax = recordMinMax;
    }
    createAggregator(_instrument) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$Histogram$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["HistogramAggregator"](this._boundaries, this._recordMinMax);
    }
}
class ExponentialHistogramAggregation {
    _maxSize;
    _recordMinMax;
    constructor(maxSize = 160, recordMinMax = true){
        this._maxSize = maxSize;
        this._recordMinMax = recordMinMax;
    }
    createAggregator(_instrument) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$aggregator$2f$ExponentialHistogram$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExponentialHistogramAggregator"](this._maxSize, this._recordMinMax);
    }
}
class DefaultAggregation {
    _resolve(instrument) {
        // cast to unknown to disable complaints on the (unreachable) fallback.
        switch(instrument.type){
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].COUNTER:
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].UP_DOWN_COUNTER:
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_COUNTER:
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_UP_DOWN_COUNTER:
                {
                    return SUM_AGGREGATION;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].GAUGE:
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_GAUGE:
                {
                    return LAST_VALUE_AGGREGATION;
                }
            case __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].HISTOGRAM:
                {
                    if (instrument.advice.explicitBucketBoundaries) {
                        return new ExplicitBucketHistogramAggregation(instrument.advice.explicitBucketBoundaries);
                    }
                    return HISTOGRAM_AGGREGATION;
                }
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Unable to recognize instrument type: ${instrument.type}`);
        return DROP_AGGREGATION;
    }
    createAggregator(instrument) {
        return this._resolve(instrument).createAggregator(instrument);
    }
}
const DROP_AGGREGATION = new DropAggregation();
const SUM_AGGREGATION = new SumAggregation();
const LAST_VALUE_AGGREGATION = new LastValueAggregation();
const HISTOGRAM_AGGREGATION = new HistogramAggregation();
const EXPONENTIAL_HISTOGRAM_AGGREGATION = new ExponentialHistogramAggregation();
const DEFAULT_AGGREGATION = new DefaultAggregation(); //# sourceMappingURL=Aggregation.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AggregationOption.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "AggregationType",
    ()=>AggregationType,
    "toAggregation",
    ()=>toAggregation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Aggregation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/Aggregation.js [instrumentation] (ecmascript)");
;
var AggregationType;
(function(AggregationType) {
    AggregationType[AggregationType["DEFAULT"] = 0] = "DEFAULT";
    AggregationType[AggregationType["DROP"] = 1] = "DROP";
    AggregationType[AggregationType["SUM"] = 2] = "SUM";
    AggregationType[AggregationType["LAST_VALUE"] = 3] = "LAST_VALUE";
    AggregationType[AggregationType["EXPLICIT_BUCKET_HISTOGRAM"] = 4] = "EXPLICIT_BUCKET_HISTOGRAM";
    AggregationType[AggregationType["EXPONENTIAL_HISTOGRAM"] = 5] = "EXPONENTIAL_HISTOGRAM";
})(AggregationType || (AggregationType = {}));
function toAggregation(option) {
    switch(option.type){
        case AggregationType.DEFAULT:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Aggregation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DEFAULT_AGGREGATION"];
        case AggregationType.DROP:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Aggregation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DROP_AGGREGATION"];
        case AggregationType.SUM:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Aggregation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SUM_AGGREGATION"];
        case AggregationType.LAST_VALUE:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Aggregation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["LAST_VALUE_AGGREGATION"];
        case AggregationType.EXPONENTIAL_HISTOGRAM:
            {
                const expOption = option;
                return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Aggregation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExponentialHistogramAggregation"](expOption.options?.maxSize, expOption.options?.recordMinMax);
            }
        case AggregationType.EXPLICIT_BUCKET_HISTOGRAM:
            {
                const expOption = option;
                if (expOption.options == null) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Aggregation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["HISTOGRAM_AGGREGATION"];
                } else {
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Aggregation$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExplicitBucketHistogramAggregation"](expOption.options?.boundaries, expOption.options?.recordMinMax);
                }
            }
        default:
            throw new Error('Unsupported Aggregation');
    }
} //# sourceMappingURL=AggregationOption.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationSelector.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "DEFAULT_AGGREGATION_SELECTOR",
    ()=>DEFAULT_AGGREGATION_SELECTOR,
    "DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR",
    ()=>DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationTemporality.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AggregationOption.js [instrumentation] (ecmascript)");
;
;
const DEFAULT_AGGREGATION_SELECTOR = (_instrumentType)=>{
    return {
        type: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationType"].DEFAULT
    };
};
const DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = (_instrumentType)=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporality"].CUMULATIVE; //# sourceMappingURL=AggregationSelector.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricReader.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MetricReader",
    ()=>MetricReader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationSelector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationSelector.js [instrumentation] (ecmascript)");
;
;
;
class MetricReader {
    // Tracks the shutdown state.
    // TODO: use BindOncePromise here once a new version of @opentelemetry/core is available.
    _shutdown = false;
    // Additional MetricProducers which will be combined with the SDK's output
    _metricProducers;
    // MetricProducer used by this instance which produces metrics from the SDK
    _sdkMetricProducer;
    _aggregationTemporalitySelector;
    _aggregationSelector;
    _cardinalitySelector;
    constructor(options){
        this._aggregationSelector = options?.aggregationSelector ?? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationSelector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DEFAULT_AGGREGATION_SELECTOR"];
        this._aggregationTemporalitySelector = options?.aggregationTemporalitySelector ?? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationSelector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR"];
        this._metricProducers = options?.metricProducers ?? [];
        this._cardinalitySelector = options?.cardinalitySelector;
    }
    setMetricProducer(metricProducer) {
        if (this._sdkMetricProducer) {
            throw new Error('MetricReader can not be bound to a MeterProvider again.');
        }
        this._sdkMetricProducer = metricProducer;
        this.onInitialized();
    }
    selectAggregation(instrumentType) {
        return this._aggregationSelector(instrumentType);
    }
    selectAggregationTemporality(instrumentType) {
        return this._aggregationTemporalitySelector(instrumentType);
    }
    selectCardinalityLimit(instrumentType) {
        return this._cardinalitySelector ? this._cardinalitySelector(instrumentType) : 2000; // default value if no selector is provided
    }
    /**
     * Handle once the SDK has initialized this {@link MetricReader}
     * Overriding this method is optional.
     */ onInitialized() {
    // Default implementation is empty.
    }
    async collect(options) {
        if (this._sdkMetricProducer === undefined) {
            throw new Error('MetricReader is not bound to a MetricProducer');
        }
        // Subsequent invocations to collect are not allowed. SDKs SHOULD return some failure for these calls.
        if (this._shutdown) {
            throw new Error('MetricReader is shutdown');
        }
        const [sdkCollectionResults, ...additionalCollectionResults] = await Promise.all([
            this._sdkMetricProducer.collect({
                timeoutMillis: options?.timeoutMillis
            }),
            ...this._metricProducers.map((producer)=>producer.collect({
                    timeoutMillis: options?.timeoutMillis
                }))
        ]);
        // Merge the results, keeping the SDK's Resource
        const errors = sdkCollectionResults.errors.concat(additionalCollectionResults.flatMap((result)=>result.errors));
        const resource = sdkCollectionResults.resourceMetrics.resource;
        const scopeMetrics = sdkCollectionResults.resourceMetrics.scopeMetrics.concat(additionalCollectionResults.flatMap((result)=>result.resourceMetrics.scopeMetrics));
        return {
            resourceMetrics: {
                resource,
                scopeMetrics
            },
            errors
        };
    }
    async shutdown(options) {
        // Do not call shutdown again if it has already been called.
        if (this._shutdown) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error('Cannot call shutdown twice.');
            return;
        }
        // No timeout if timeoutMillis is undefined or null.
        if (options?.timeoutMillis == null) {
            await this.onShutdown();
        } else {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["callWithTimeout"])(this.onShutdown(), options.timeoutMillis);
        }
        this._shutdown = true;
    }
    async forceFlush(options) {
        if (this._shutdown) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('Cannot forceFlush on already shutdown MetricReader.');
            return;
        }
        // No timeout if timeoutMillis is undefined or null.
        if (options?.timeoutMillis == null) {
            await this.onForceFlush();
            return;
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["callWithTimeout"])(this.onForceFlush(), options.timeoutMillis);
    }
} //# sourceMappingURL=MetricReader.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/PeriodicExportingMetricReader.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "PeriodicExportingMetricReader",
    ()=>PeriodicExportingMetricReader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricReader$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricReader.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)");
;
;
;
;
class PeriodicExportingMetricReader extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricReader$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MetricReader"] {
    _interval;
    _exporter;
    _exportInterval;
    _exportTimeout;
    constructor(options){
        const { exporter, exportIntervalMillis = 60000, metricProducers } = options;
        let { exportTimeoutMillis = 30000 } = options;
        super({
            aggregationSelector: exporter.selectAggregation?.bind(exporter),
            aggregationTemporalitySelector: exporter.selectAggregationTemporality?.bind(exporter),
            metricProducers
        });
        if (exportIntervalMillis <= 0) {
            throw Error('exportIntervalMillis must be greater than 0');
        }
        if (exportTimeoutMillis <= 0) {
            throw Error('exportTimeoutMillis must be greater than 0');
        }
        if (exportIntervalMillis < exportTimeoutMillis) {
            if ('exportIntervalMillis' in options && 'exportTimeoutMillis' in options) {
                // An invalid combination of values was explicitly provided.
                throw Error('exportIntervalMillis must be greater than or equal to exportTimeoutMillis');
            } else {
                // An invalid combination of value was implicitly provided.
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].info(`Timeout of ${exportTimeoutMillis} exceeds the interval of ${exportIntervalMillis}. Clamping timeout to interval duration.`);
                exportTimeoutMillis = exportIntervalMillis;
            }
        }
        this._exportInterval = exportIntervalMillis;
        this._exportTimeout = exportTimeoutMillis;
        this._exporter = exporter;
    }
    async _runOnce() {
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["callWithTimeout"])(this._doRun(), this._exportTimeout);
        } catch (err) {
            if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TimeoutError"]) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error('Export took longer than %s milliseconds and timed out.', this._exportTimeout);
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"])(err);
        }
    }
    async _doRun() {
        const { resourceMetrics, errors } = await this.collect({
            timeoutMillis: this._exportTimeout
        });
        if (errors.length > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error('PeriodicExportingMetricReader: metrics collection errors', ...errors);
        }
        if (resourceMetrics.resource.asyncAttributesPending) {
            try {
                await resourceMetrics.resource.waitForAsyncAttributes?.();
            } catch (e) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug('Error while resolving async portion of resource: ', e);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$global$2d$error$2d$handler$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["globalErrorHandler"])(e);
            }
        }
        if (resourceMetrics.scopeMetrics.length === 0) {
            return;
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__["internal"]._export(this._exporter, resourceMetrics);
        if (result.code !== __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS) {
            throw new Error(`PeriodicExportingMetricReader: metrics export failed (error ${result.error})`);
        }
    }
    onInitialized() {
        // start running the interval as soon as this reader is initialized and keep handle for shutdown.
        this._interval = setInterval(()=>{
            // this._runOnce never rejects. Using void operator to suppress @typescript-eslint/no-floating-promises.
            void this._runOnce();
        }, this._exportInterval);
        // depending on runtime, this may be a 'number' or NodeJS.Timeout
        if (typeof this._interval !== 'number') {
            this._interval.unref();
        }
    }
    async onForceFlush() {
        await this._runOnce();
        await this._exporter.forceFlush();
    }
    async onShutdown() {
        if (this._interval) {
            clearInterval(this._interval);
        }
        await this.onForceFlush();
        await this._exporter.shutdown();
    }
} //# sourceMappingURL=PeriodicExportingMetricReader.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/InMemoryMetricExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "InMemoryMetricExporter",
    ()=>InMemoryMetricExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
;
class InMemoryMetricExporter {
    _shutdown = false;
    _aggregationTemporality;
    _metrics = [];
    constructor(aggregationTemporality){
        this._aggregationTemporality = aggregationTemporality;
    }
    /**
     * @inheritedDoc
     */ export(metrics, resultCallback) {
        // Avoid storing metrics when exporter is shutdown
        if (this._shutdown) {
            setTimeout(()=>resultCallback({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED
                }), 0);
            return;
        }
        this._metrics.push(metrics);
        setTimeout(()=>resultCallback({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS
            }), 0);
    }
    /**
     * Returns all the collected resource metrics
     * @returns ResourceMetrics[]
     */ getMetrics() {
        return this._metrics;
    }
    forceFlush() {
        return Promise.resolve();
    }
    reset() {
        this._metrics = [];
    }
    selectAggregationTemporality(_instrumentType) {
        return this._aggregationTemporality;
    }
    shutdown() {
        this._shutdown = true;
        return Promise.resolve();
    }
} //# sourceMappingURL=InMemoryMetricExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/ConsoleMetricExporter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ConsoleMetricExporter",
    ()=>ConsoleMetricExporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/ExportResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationSelector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationSelector.js [instrumentation] (ecmascript)");
;
;
class ConsoleMetricExporter {
    _shutdown = false;
    _temporalitySelector;
    constructor(options){
        this._temporalitySelector = options?.temporalitySelector ?? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationSelector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR"];
    }
    export(metrics, resultCallback) {
        if (this._shutdown) {
            // If the exporter is shutting down, by spec, we need to return FAILED as export result
            resultCallback({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].FAILED
            });
            return;
        }
        return ConsoleMetricExporter._sendMetrics(metrics, resultCallback);
    }
    forceFlush() {
        return Promise.resolve();
    }
    selectAggregationTemporality(_instrumentType) {
        return this._temporalitySelector(_instrumentType);
    }
    shutdown() {
        this._shutdown = true;
        return Promise.resolve();
    }
    static _sendMetrics(metrics, done) {
        for (const scopeMetrics of metrics.scopeMetrics){
            for (const metric of scopeMetrics.metrics){
                console.dir({
                    descriptor: metric.descriptor,
                    dataPointType: metric.dataPointType,
                    dataPoints: metric.dataPoints
                }, {
                    depth: null
                });
            }
        }
        done({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$ExportResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExportResultCode"].SUCCESS
        });
    }
} //# sourceMappingURL=ConsoleMetricExporter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/ViewRegistry.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ViewRegistry",
    ()=>ViewRegistry
]);
class ViewRegistry {
    _registeredViews = [];
    addView(view) {
        this._registeredViews.push(view);
    }
    findViews(instrument, meter) {
        const views = this._registeredViews.filter((registeredView)=>{
            return this._matchInstrument(registeredView.instrumentSelector, instrument) && this._matchMeter(registeredView.meterSelector, meter);
        });
        return views;
    }
    _matchInstrument(selector, instrument) {
        return (selector.getType() === undefined || instrument.type === selector.getType()) && selector.getNameFilter().match(instrument.name) && selector.getUnitFilter().match(instrument.unit);
    }
    _matchMeter(selector, meter) {
        return selector.getNameFilter().match(meter.name) && (meter.version === undefined || selector.getVersionFilter().match(meter.version)) && (meter.schemaUrl === undefined || selector.getSchemaUrlFilter().match(meter.schemaUrl));
    }
} //# sourceMappingURL=ViewRegistry.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/InstrumentDescriptor.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "createInstrumentDescriptor",
    ()=>createInstrumentDescriptor,
    "createInstrumentDescriptorWithView",
    ()=>createInstrumentDescriptorWithView,
    "isDescriptorCompatibleWith",
    ()=>isDescriptorCompatibleWith,
    "isValidName",
    ()=>isValidName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2f$Metric$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/metrics/Metric.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)");
;
;
function createInstrumentDescriptor(name, type, options) {
    if (!isValidName(name)) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`Invalid metric name: "${name}". The metric name should be a ASCII string with a length no greater than 255 characters.`);
    }
    return {
        name,
        type,
        description: options?.description ?? '',
        unit: options?.unit ?? '',
        valueType: options?.valueType ?? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2f$Metric$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ValueType"].DOUBLE,
        advice: options?.advice ?? {}
    };
}
function createInstrumentDescriptorWithView(view, instrument) {
    return {
        name: view.name ?? instrument.name,
        description: view.description ?? instrument.description,
        type: instrument.type,
        unit: instrument.unit,
        valueType: instrument.valueType,
        advice: instrument.advice
    };
}
function isDescriptorCompatibleWith(descriptor, otherDescriptor) {
    // Names are case-insensitive strings.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["equalsCaseInsensitive"])(descriptor.name, otherDescriptor.name) && descriptor.unit === otherDescriptor.unit && descriptor.type === otherDescriptor.type && descriptor.valueType === otherDescriptor.valueType;
}
// ASCII string with a length no greater than 255 characters.
// NB: the first character counted separately from the rest.
const NAME_REGEXP = /^[a-z][a-z0-9_.\-/]{0,254}$/i;
function isValidName(name) {
    return NAME_REGEXP.test(name);
} //# sourceMappingURL=InstrumentDescriptor.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/Instruments.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "CounterInstrument",
    ()=>CounterInstrument,
    "GaugeInstrument",
    ()=>GaugeInstrument,
    "HistogramInstrument",
    ()=>HistogramInstrument,
    "ObservableCounterInstrument",
    ()=>ObservableCounterInstrument,
    "ObservableGaugeInstrument",
    ()=>ObservableGaugeInstrument,
    "ObservableInstrument",
    ()=>ObservableInstrument,
    "ObservableUpDownCounterInstrument",
    ()=>ObservableUpDownCounterInstrument,
    "SyncInstrument",
    ()=>SyncInstrument,
    "UpDownCounterInstrument",
    ()=>UpDownCounterInstrument,
    "isObservableInstrument",
    ()=>isObservableInstrument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/context-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2f$Metric$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/metrics/Metric.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/time.js [instrumentation] (ecmascript)");
;
;
class SyncInstrument {
    _writableMetricStorage;
    _descriptor;
    constructor(writableMetricStorage, descriptor){
        this._writableMetricStorage = writableMetricStorage;
        this._descriptor = descriptor;
    }
    _record(value, attributes = {}, context = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$context$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["context"].active()) {
        if (typeof value !== 'number') {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`non-number value provided to metric ${this._descriptor.name}: ${value}`);
            return;
        }
        if (this._descriptor.valueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2f$Metric$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ValueType"].INT && !Number.isInteger(value)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`INT value type cannot accept a floating-point value for ${this._descriptor.name}, ignoring the fractional digits.`);
            value = Math.trunc(value);
            // ignore non-finite values.
            if (!Number.isInteger(value)) {
                return;
            }
        }
        this._writableMetricStorage.record(value, attributes, context, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["millisToHrTime"])(Date.now()));
    }
}
class UpDownCounterInstrument extends SyncInstrument {
    /**
     * Increment value of counter by the input. Inputs may be negative.
     */ add(value, attributes, ctx) {
        this._record(value, attributes, ctx);
    }
}
class CounterInstrument extends SyncInstrument {
    /**
     * Increment value of counter by the input. Inputs may not be negative.
     */ add(value, attributes, ctx) {
        if (value < 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`negative value provided to counter ${this._descriptor.name}: ${value}`);
            return;
        }
        this._record(value, attributes, ctx);
    }
}
class GaugeInstrument extends SyncInstrument {
    /**
     * Records a measurement.
     */ record(value, attributes, ctx) {
        this._record(value, attributes, ctx);
    }
}
class HistogramInstrument extends SyncInstrument {
    /**
     * Records a measurement. Value of the measurement must not be negative.
     */ record(value, attributes, ctx) {
        if (value < 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`negative value provided to histogram ${this._descriptor.name}: ${value}`);
            return;
        }
        this._record(value, attributes, ctx);
    }
}
class ObservableInstrument {
    /** @internal */ _metricStorages;
    /** @internal */ _descriptor;
    _observableRegistry;
    constructor(descriptor, metricStorages, observableRegistry){
        this._descriptor = descriptor;
        this._metricStorages = metricStorages;
        this._observableRegistry = observableRegistry;
    }
    /**
     * @see {Observable.addCallback}
     */ addCallback(callback) {
        this._observableRegistry.addCallback(callback, this);
    }
    /**
     * @see {Observable.removeCallback}
     */ removeCallback(callback) {
        this._observableRegistry.removeCallback(callback, this);
    }
}
class ObservableCounterInstrument extends ObservableInstrument {
}
class ObservableGaugeInstrument extends ObservableInstrument {
}
class ObservableUpDownCounterInstrument extends ObservableInstrument {
}
function isObservableInstrument(it) {
    return it instanceof ObservableInstrument;
} //# sourceMappingURL=Instruments.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/Meter.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "Meter",
    ()=>Meter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/InstrumentDescriptor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/Instruments.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js [instrumentation] (ecmascript)");
;
;
;
class Meter {
    _meterSharedState;
    constructor(meterSharedState){
        this._meterSharedState = meterSharedState;
    }
    /**
     * Create a {@link Gauge} instrument.
     */ createGauge(name, options) {
        const descriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentDescriptor"])(name, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].GAUGE, options);
        const storage = this._meterSharedState.registerMetricStorage(descriptor);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["GaugeInstrument"](storage, descriptor);
    }
    /**
     * Create a {@link Histogram} instrument.
     */ createHistogram(name, options) {
        const descriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentDescriptor"])(name, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].HISTOGRAM, options);
        const storage = this._meterSharedState.registerMetricStorage(descriptor);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["HistogramInstrument"](storage, descriptor);
    }
    /**
     * Create a {@link Counter} instrument.
     */ createCounter(name, options) {
        const descriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentDescriptor"])(name, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].COUNTER, options);
        const storage = this._meterSharedState.registerMetricStorage(descriptor);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["CounterInstrument"](storage, descriptor);
    }
    /**
     * Create a {@link UpDownCounter} instrument.
     */ createUpDownCounter(name, options) {
        const descriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentDescriptor"])(name, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].UP_DOWN_COUNTER, options);
        const storage = this._meterSharedState.registerMetricStorage(descriptor);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["UpDownCounterInstrument"](storage, descriptor);
    }
    /**
     * Create a {@link ObservableGauge} instrument.
     */ createObservableGauge(name, options) {
        const descriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentDescriptor"])(name, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_GAUGE, options);
        const storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ObservableGaugeInstrument"](descriptor, storages, this._meterSharedState.observableRegistry);
    }
    /**
     * Create a {@link ObservableCounter} instrument.
     */ createObservableCounter(name, options) {
        const descriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentDescriptor"])(name, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_COUNTER, options);
        const storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ObservableCounterInstrument"](descriptor, storages, this._meterSharedState.observableRegistry);
    }
    /**
     * Create a {@link ObservableUpDownCounter} instrument.
     */ createObservableUpDownCounter(name, options) {
        const descriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentDescriptor"])(name, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"].OBSERVABLE_UP_DOWN_COUNTER, options);
        const storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ObservableUpDownCounterInstrument"](descriptor, storages, this._meterSharedState.observableRegistry);
    }
    /**
     * @see {@link Meter.addBatchObservableCallback}
     */ addBatchObservableCallback(callback, observables) {
        this._meterSharedState.observableRegistry.addBatchCallback(callback, observables);
    }
    /**
     * @see {@link Meter.removeBatchObservableCallback}
     */ removeBatchObservableCallback(callback, observables) {
        this._meterSharedState.observableRegistry.removeBatchCallback(callback, observables);
    }
} //# sourceMappingURL=Meter.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricStorage.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MetricStorage",
    ()=>MetricStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/InstrumentDescriptor.js [instrumentation] (ecmascript)");
;
class MetricStorage {
    _instrumentDescriptor;
    constructor(instrumentDescriptor){
        this._instrumentDescriptor = instrumentDescriptor;
    }
    getInstrumentDescriptor() {
        return this._instrumentDescriptor;
    }
    updateDescription(description) {
        this._instrumentDescriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentDescriptor"])(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
            description: description,
            valueType: this._instrumentDescriptor.valueType,
            unit: this._instrumentDescriptor.unit,
            advice: this._instrumentDescriptor.advice
        });
    }
} //# sourceMappingURL=MetricStorage.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/HashMap.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "AttributeHashMap",
    ()=>AttributeHashMap,
    "HashMap",
    ()=>HashMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)");
;
class HashMap {
    _valueMap = new Map();
    _keyMap = new Map();
    _hash;
    constructor(hash){
        this._hash = hash;
    }
    get(key, hashCode) {
        hashCode ??= this._hash(key);
        return this._valueMap.get(hashCode);
    }
    getOrDefault(key, defaultFactory) {
        const hash = this._hash(key);
        if (this._valueMap.has(hash)) {
            return this._valueMap.get(hash);
        }
        const val = defaultFactory();
        if (!this._keyMap.has(hash)) {
            this._keyMap.set(hash, key);
        }
        this._valueMap.set(hash, val);
        return val;
    }
    set(key, value, hashCode) {
        hashCode ??= this._hash(key);
        if (!this._keyMap.has(hashCode)) {
            this._keyMap.set(hashCode, key);
        }
        this._valueMap.set(hashCode, value);
    }
    has(key, hashCode) {
        hashCode ??= this._hash(key);
        return this._valueMap.has(hashCode);
    }
    *keys() {
        const keyIterator = this._keyMap.entries();
        let next = keyIterator.next();
        while(next.done !== true){
            yield [
                next.value[1],
                next.value[0]
            ];
            next = keyIterator.next();
        }
    }
    *entries() {
        const valueIterator = this._valueMap.entries();
        let next = valueIterator.next();
        while(next.done !== true){
            // next.value[0] here can not be undefined
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            yield [
                this._keyMap.get(next.value[0]),
                next.value[1],
                next.value[0]
            ];
            next = valueIterator.next();
        }
    }
    get size() {
        return this._valueMap.size;
    }
}
class AttributeHashMap extends HashMap {
    constructor(){
        super(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hashAttributes"]);
    }
} //# sourceMappingURL=HashMap.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/DeltaMetricProcessor.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "DeltaMetricProcessor",
    ()=>DeltaMetricProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/HashMap.js [instrumentation] (ecmascript)");
;
;
class DeltaMetricProcessor {
    _activeCollectionStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AttributeHashMap"]();
    // TODO: find a reasonable mean to clean the memo;
    // https://github.com/open-telemetry/opentelemetry-specification/pull/2208
    _cumulativeMemoStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AttributeHashMap"]();
    _cardinalityLimit;
    _overflowAttributes = {
        'otel.metric.overflow': true
    };
    _overflowHashCode;
    _aggregator;
    constructor(aggregator, aggregationCardinalityLimit){
        this._aggregator = aggregator;
        this._cardinalityLimit = (aggregationCardinalityLimit ?? 2000) - 1;
        this._overflowHashCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["hashAttributes"])(this._overflowAttributes);
    }
    record(value, attributes, _context, collectionTime) {
        let accumulation = this._activeCollectionStorage.get(attributes);
        if (!accumulation) {
            if (this._activeCollectionStorage.size >= this._cardinalityLimit) {
                const overflowAccumulation = this._activeCollectionStorage.getOrDefault(this._overflowAttributes, ()=>this._aggregator.createAccumulation(collectionTime));
                overflowAccumulation?.record(value);
                return;
            }
            accumulation = this._aggregator.createAccumulation(collectionTime);
            this._activeCollectionStorage.set(attributes, accumulation);
        }
        accumulation?.record(value);
    }
    batchCumulate(measurements, collectionTime) {
        Array.from(measurements.entries()).forEach(([attributes, value, hashCode])=>{
            const accumulation = this._aggregator.createAccumulation(collectionTime);
            accumulation?.record(value);
            let delta = accumulation;
            // Diff with recorded cumulative memo.
            if (this._cumulativeMemoStorage.has(attributes, hashCode)) {
                // has() returned true, previous is present.
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const previous = this._cumulativeMemoStorage.get(attributes, hashCode);
                delta = this._aggregator.diff(previous, accumulation);
            } else {
                // If the cardinality limit is reached, we need to change the attributes
                if (this._cumulativeMemoStorage.size >= this._cardinalityLimit) {
                    attributes = this._overflowAttributes;
                    hashCode = this._overflowHashCode;
                    if (this._cumulativeMemoStorage.has(attributes, hashCode)) {
                        // has() returned true, previous is present.
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const previous = this._cumulativeMemoStorage.get(attributes, hashCode);
                        delta = this._aggregator.diff(previous, accumulation);
                    }
                }
            }
            // Merge with uncollected active delta.
            if (this._activeCollectionStorage.has(attributes, hashCode)) {
                // has() returned true, active is present.
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const active = this._activeCollectionStorage.get(attributes, hashCode);
                delta = this._aggregator.merge(active, delta);
            }
            // Save the current record and the delta record.
            this._cumulativeMemoStorage.set(attributes, accumulation, hashCode);
            this._activeCollectionStorage.set(attributes, delta, hashCode);
        });
    }
    /**
     * Returns a collection of delta metrics. Start time is the when first
     * time event collected.
     */ collect() {
        const unreportedDelta = this._activeCollectionStorage;
        this._activeCollectionStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AttributeHashMap"]();
        return unreportedDelta;
    }
} //# sourceMappingURL=DeltaMetricProcessor.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/TemporalMetricProcessor.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "TemporalMetricProcessor",
    ()=>TemporalMetricProcessor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationTemporality.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/HashMap.js [instrumentation] (ecmascript)");
;
;
class TemporalMetricProcessor {
    _aggregator;
    _unreportedAccumulations = new Map();
    _reportHistory = new Map();
    constructor(aggregator, collectorHandles){
        this._aggregator = aggregator;
        collectorHandles.forEach((handle)=>{
            this._unreportedAccumulations.set(handle, []);
        });
    }
    /**
     * Builds the {@link MetricData} streams to report against a specific MetricCollector.
     * @param collector The information of the MetricCollector.
     * @param collectors The registered collectors.
     * @param instrumentDescriptor The instrumentation descriptor that these metrics generated with.
     * @param currentAccumulations The current accumulation of metric data from instruments.
     * @param collectionTime The current collection timestamp.
     * @returns The {@link MetricData} points or `null`.
     */ buildMetrics(collector, instrumentDescriptor, currentAccumulations, collectionTime) {
        this._stashAccumulations(currentAccumulations);
        const unreportedAccumulations = this._getMergedUnreportedAccumulations(collector);
        let result = unreportedAccumulations;
        let aggregationTemporality;
        // Check our last report time.
        if (this._reportHistory.has(collector)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const last = this._reportHistory.get(collector);
            const lastCollectionTime = last.collectionTime;
            aggregationTemporality = last.aggregationTemporality;
            // Use aggregation temporality + instrument to determine if we do a merge or a diff of
            // previous. We have the following four scenarios:
            // 1. Cumulative Aggregation (temporality) + Delta recording (sync instrument).
            //    Here we merge with our last record to get a cumulative aggregation.
            // 2. Cumulative Aggregation + Cumulative recording (async instrument).
            //    Cumulative records are converted to delta recording with DeltaMetricProcessor.
            //    Here we merge with our last record to get a cumulative aggregation.
            // 3. Delta Aggregation + Delta recording
            //    Calibrate the startTime of metric streams to be the reader's lastCollectionTime.
            // 4. Delta Aggregation + Cumulative recording.
            //    Cumulative records are converted to delta recording with DeltaMetricProcessor.
            //    Calibrate the startTime of metric streams to be the reader's lastCollectionTime.
            if (aggregationTemporality === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporality"].CUMULATIVE) {
                // We need to make sure the current delta recording gets merged into the previous cumulative
                // for the next cumulative recording.
                result = TemporalMetricProcessor.merge(last.accumulations, unreportedAccumulations, this._aggregator);
            } else {
                result = TemporalMetricProcessor.calibrateStartTime(last.accumulations, unreportedAccumulations, lastCollectionTime);
            }
        } else {
            // Call into user code to select aggregation temporality for the instrument.
            aggregationTemporality = collector.selectAggregationTemporality(instrumentDescriptor.type);
        }
        // Update last reported (cumulative) accumulation.
        this._reportHistory.set(collector, {
            accumulations: result,
            collectionTime,
            aggregationTemporality
        });
        const accumulationRecords = AttributesMapToAccumulationRecords(result);
        // do not convert to metric data if there is nothing to convert.
        if (accumulationRecords.length === 0) {
            return undefined;
        }
        return this._aggregator.toMetricData(instrumentDescriptor, aggregationTemporality, accumulationRecords, /* endTime */ collectionTime);
    }
    _stashAccumulations(currentAccumulation) {
        const registeredCollectors = this._unreportedAccumulations.keys();
        for (const collector of registeredCollectors){
            let stash = this._unreportedAccumulations.get(collector);
            if (stash === undefined) {
                stash = [];
                this._unreportedAccumulations.set(collector, stash);
            }
            stash.push(currentAccumulation);
        }
    }
    _getMergedUnreportedAccumulations(collector) {
        let result = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AttributeHashMap"]();
        const unreportedList = this._unreportedAccumulations.get(collector);
        this._unreportedAccumulations.set(collector, []);
        if (unreportedList === undefined) {
            return result;
        }
        for (const it of unreportedList){
            result = TemporalMetricProcessor.merge(result, it, this._aggregator);
        }
        return result;
    }
    static merge(last, current, aggregator) {
        const result = last;
        const iterator = current.entries();
        let next = iterator.next();
        while(next.done !== true){
            const [key, record, hash] = next.value;
            if (last.has(key, hash)) {
                const lastAccumulation = last.get(key, hash);
                // last.has() returned true, lastAccumulation is present.
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const accumulation = aggregator.merge(lastAccumulation, record);
                result.set(key, accumulation, hash);
            } else {
                result.set(key, record, hash);
            }
            next = iterator.next();
        }
        return result;
    }
    /**
     * Calibrate the reported metric streams' startTime to lastCollectionTime. Leaves
     * the new stream to be the initial observation time unchanged.
     */ static calibrateStartTime(last, current, lastCollectionTime) {
        for (const [key, hash] of last.keys()){
            const currentAccumulation = current.get(key, hash);
            currentAccumulation?.setStartTime(lastCollectionTime);
        }
        return current;
    }
}
// TypeScript complains about converting 3 elements tuple to AccumulationRecord<T>.
function AttributesMapToAccumulationRecords(map) {
    return Array.from(map.entries());
} //# sourceMappingURL=TemporalMetricProcessor.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/AsyncMetricStorage.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "AsyncMetricStorage",
    ()=>AsyncMetricStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricStorage.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$DeltaMetricProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/DeltaMetricProcessor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$TemporalMetricProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/TemporalMetricProcessor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/HashMap.js [instrumentation] (ecmascript)");
;
;
;
;
class AsyncMetricStorage extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MetricStorage"] {
    _aggregationCardinalityLimit;
    _deltaMetricStorage;
    _temporalMetricStorage;
    _attributesProcessor;
    constructor(_instrumentDescriptor, aggregator, attributesProcessor, collectorHandles, aggregationCardinalityLimit){
        super(_instrumentDescriptor);
        this._aggregationCardinalityLimit = aggregationCardinalityLimit;
        this._deltaMetricStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$DeltaMetricProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DeltaMetricProcessor"](aggregator, this._aggregationCardinalityLimit);
        this._temporalMetricStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$TemporalMetricProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TemporalMetricProcessor"](aggregator, collectorHandles);
        this._attributesProcessor = attributesProcessor;
    }
    record(measurements, observationTime) {
        const processed = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AttributeHashMap"]();
        Array.from(measurements.entries()).forEach(([attributes, value])=>{
            processed.set(this._attributesProcessor.process(attributes), value);
        });
        this._deltaMetricStorage.batchCumulate(processed, observationTime);
    }
    /**
     * Collects the metrics from this storage. The ObservableCallback is invoked
     * during the collection.
     *
     * Note: This is a stateful operation and may reset any interval-related
     * state for the MetricCollector.
     */ collect(collector, collectionTime) {
        const accumulations = this._deltaMetricStorage.collect();
        return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
    }
} //# sourceMappingURL=AsyncMetricStorage.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/RegistrationConflicts.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "getConflictResolutionRecipe",
    ()=>getConflictResolutionRecipe,
    "getDescriptionResolutionRecipe",
    ()=>getDescriptionResolutionRecipe,
    "getIncompatibilityDetails",
    ()=>getIncompatibilityDetails,
    "getTypeConflictResolutionRecipe",
    ()=>getTypeConflictResolutionRecipe,
    "getUnitConflictResolutionRecipe",
    ()=>getUnitConflictResolutionRecipe,
    "getValueTypeConflictResolutionRecipe",
    ()=>getValueTypeConflictResolutionRecipe
]);
function getIncompatibilityDetails(existing, otherDescriptor) {
    let incompatibility = '';
    if (existing.unit !== otherDescriptor.unit) {
        incompatibility += `\t- Unit '${existing.unit}' does not match '${otherDescriptor.unit}'\n`;
    }
    if (existing.type !== otherDescriptor.type) {
        incompatibility += `\t- Type '${existing.type}' does not match '${otherDescriptor.type}'\n`;
    }
    if (existing.valueType !== otherDescriptor.valueType) {
        incompatibility += `\t- Value Type '${existing.valueType}' does not match '${otherDescriptor.valueType}'\n`;
    }
    if (existing.description !== otherDescriptor.description) {
        incompatibility += `\t- Description '${existing.description}' does not match '${otherDescriptor.description}'\n`;
    }
    return incompatibility;
}
function getValueTypeConflictResolutionRecipe(existing, otherDescriptor) {
    return `\t- use valueType '${existing.valueType}' on instrument creation or use an instrument name other than '${otherDescriptor.name}'`;
}
function getUnitConflictResolutionRecipe(existing, otherDescriptor) {
    return `\t- use unit '${existing.unit}' on instrument creation or use an instrument name other than '${otherDescriptor.name}'`;
}
function getTypeConflictResolutionRecipe(existing, otherDescriptor) {
    const selector = {
        name: otherDescriptor.name,
        type: otherDescriptor.type,
        unit: otherDescriptor.unit
    };
    const selectorString = JSON.stringify(selector);
    return `\t- create a new view with a name other than '${existing.name}' and InstrumentSelector '${selectorString}'`;
}
function getDescriptionResolutionRecipe(existing, otherDescriptor) {
    const selector = {
        name: otherDescriptor.name,
        type: otherDescriptor.type,
        unit: otherDescriptor.unit
    };
    const selectorString = JSON.stringify(selector);
    return `\t- create a new view with a name other than '${existing.name}' and InstrumentSelector '${selectorString}'
    \t- OR - create a new view with the name ${existing.name} and description '${existing.description}' and InstrumentSelector ${selectorString}
    \t- OR - create a new view with the name ${otherDescriptor.name} and description '${existing.description}' and InstrumentSelector ${selectorString}`;
}
function getConflictResolutionRecipe(existing, otherDescriptor) {
    // Conflicts that cannot be solved via views.
    if (existing.valueType !== otherDescriptor.valueType) {
        return getValueTypeConflictResolutionRecipe(existing, otherDescriptor);
    }
    if (existing.unit !== otherDescriptor.unit) {
        return getUnitConflictResolutionRecipe(existing, otherDescriptor);
    }
    // Conflicts that can be solved via views.
    if (existing.type !== otherDescriptor.type) {
        // this will automatically solve possible description conflicts.
        return getTypeConflictResolutionRecipe(existing, otherDescriptor);
    }
    if (existing.description !== otherDescriptor.description) {
        return getDescriptionResolutionRecipe(existing, otherDescriptor);
    }
    return '';
} //# sourceMappingURL=RegistrationConflicts.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricStorageRegistry.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MetricStorageRegistry",
    ()=>MetricStorageRegistry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/InstrumentDescriptor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$RegistrationConflicts$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/RegistrationConflicts.js [instrumentation] (ecmascript)");
;
;
;
class MetricStorageRegistry {
    _sharedRegistry = new Map();
    _perCollectorRegistry = new Map();
    static create() {
        return new MetricStorageRegistry();
    }
    getStorages(collector) {
        let storages = [];
        for (const metricStorages of this._sharedRegistry.values()){
            storages = storages.concat(metricStorages);
        }
        const perCollectorStorages = this._perCollectorRegistry.get(collector);
        if (perCollectorStorages != null) {
            for (const metricStorages of perCollectorStorages.values()){
                storages = storages.concat(metricStorages);
            }
        }
        return storages;
    }
    register(storage) {
        this._registerStorage(storage, this._sharedRegistry);
    }
    registerForCollector(collector, storage) {
        let storageMap = this._perCollectorRegistry.get(collector);
        if (storageMap == null) {
            storageMap = new Map();
            this._perCollectorRegistry.set(collector, storageMap);
        }
        this._registerStorage(storage, storageMap);
    }
    findOrUpdateCompatibleStorage(expectedDescriptor) {
        const storages = this._sharedRegistry.get(expectedDescriptor.name);
        if (storages === undefined) {
            return null;
        }
        // If the descriptor is compatible, the type of their metric storage
        // (either SyncMetricStorage or AsyncMetricStorage) must be compatible.
        return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
    }
    findOrUpdateCompatibleCollectorStorage(collector, expectedDescriptor) {
        const storageMap = this._perCollectorRegistry.get(collector);
        if (storageMap === undefined) {
            return null;
        }
        const storages = storageMap.get(expectedDescriptor.name);
        if (storages === undefined) {
            return null;
        }
        // If the descriptor is compatible, the type of their metric storage
        // (either SyncMetricStorage or AsyncMetricStorage) must be compatible.
        return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
    }
    _registerStorage(storage, storageMap) {
        const descriptor = storage.getInstrumentDescriptor();
        const storages = storageMap.get(descriptor.name);
        if (storages === undefined) {
            storageMap.set(descriptor.name, [
                storage
            ]);
            return;
        }
        storages.push(storage);
    }
    _findOrUpdateCompatibleStorage(expectedDescriptor, existingStorages) {
        let compatibleStorage = null;
        for (const existingStorage of existingStorages){
            const existingDescriptor = existingStorage.getInstrumentDescriptor();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isDescriptorCompatibleWith"])(existingDescriptor, expectedDescriptor)) {
                // Use the longer description if it does not match.
                if (existingDescriptor.description !== expectedDescriptor.description) {
                    if (expectedDescriptor.description.length > existingDescriptor.description.length) {
                        existingStorage.updateDescription(expectedDescriptor.description);
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('A view or instrument with the name ', expectedDescriptor.name, ' has already been registered, but has a different description and is incompatible with another registered view.\n', 'Details:\n', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$RegistrationConflicts$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getIncompatibilityDetails"])(existingDescriptor, expectedDescriptor), 'The longer description will be used.\nTo resolve the conflict:', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$RegistrationConflicts$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getConflictResolutionRecipe"])(existingDescriptor, expectedDescriptor));
                }
                // Storage is fully compatible. There will never be more than one pre-existing fully compatible storage.
                compatibleStorage = existingStorage;
            } else {
                // The implementation SHOULD warn about duplicate instrument registration
                // conflicts after applying View configuration.
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('A view or instrument with the name ', expectedDescriptor.name, ' has already been registered and is incompatible with another registered view.\n', 'Details:\n', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$RegistrationConflicts$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getIncompatibilityDetails"])(existingDescriptor, expectedDescriptor), 'To resolve the conflict:\n', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$RegistrationConflicts$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["getConflictResolutionRecipe"])(existingDescriptor, expectedDescriptor));
            }
        }
        return compatibleStorage;
    }
} //# sourceMappingURL=MetricStorageRegistry.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MultiWritableMetricStorage.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 * Internal interface.
 */ __turbopack_context__.s([
    "MultiMetricStorage",
    ()=>MultiMetricStorage
]);
class MultiMetricStorage {
    _backingStorages;
    constructor(backingStorages){
        this._backingStorages = backingStorages;
    }
    record(value, attributes, context, recordTime) {
        this._backingStorages.forEach((it)=>{
            it.record(value, attributes, context, recordTime);
        });
    }
} //# sourceMappingURL=MultiWritableMetricStorage.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/ObservableResult.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "BatchObservableResultImpl",
    ()=>BatchObservableResultImpl,
    "ObservableResultImpl",
    ()=>ObservableResultImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2f$Metric$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/metrics/Metric.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/HashMap.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/Instruments.js [instrumentation] (ecmascript)");
;
;
;
class ObservableResultImpl {
    /**
     * @internal
     */ _buffer = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AttributeHashMap"]();
    _instrumentName;
    _valueType;
    constructor(instrumentName, valueType){
        this._instrumentName = instrumentName;
        this._valueType = valueType;
    }
    /**
     * Observe a measurement of the value associated with the given attributes.
     */ observe(value, attributes = {}) {
        if (typeof value !== 'number') {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`non-number value provided to metric ${this._instrumentName}: ${value}`);
            return;
        }
        if (this._valueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2f$Metric$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ValueType"].INT && !Number.isInteger(value)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`INT value type cannot accept a floating-point value for ${this._instrumentName}, ignoring the fractional digits.`);
            value = Math.trunc(value);
            // ignore non-finite values.
            if (!Number.isInteger(value)) {
                return;
            }
        }
        this._buffer.set(attributes, value);
    }
}
class BatchObservableResultImpl {
    /**
     * @internal
     */ _buffer = new Map();
    /**
     * Observe a measurement of the value associated with the given attributes.
     */ observe(metric, value, attributes = {}) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isObservableInstrument"])(metric)) {
            return;
        }
        let map = this._buffer.get(metric);
        if (map == null) {
            map = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$HashMap$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AttributeHashMap"]();
            this._buffer.set(metric, map);
        }
        if (typeof value !== 'number') {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`non-number value provided to metric ${metric._descriptor.name}: ${value}`);
            return;
        }
        if (metric._descriptor.valueType === __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2f$Metric$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ValueType"].INT && !Number.isInteger(value)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn(`INT value type cannot accept a floating-point value for ${metric._descriptor.name}, ignoring the fractional digits.`);
            value = Math.trunc(value);
            // ignore non-finite values.
            if (!Number.isInteger(value)) {
                return;
            }
        }
        map.set(attributes, value);
    }
} //# sourceMappingURL=ObservableResult.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/ObservableRegistry.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "ObservableRegistry",
    ()=>ObservableRegistry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/Instruments.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$ObservableResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/ObservableResult.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)");
;
;
;
;
class ObservableRegistry {
    _callbacks = [];
    _batchCallbacks = [];
    addCallback(callback, instrument) {
        const idx = this._findCallback(callback, instrument);
        if (idx >= 0) {
            return;
        }
        this._callbacks.push({
            callback,
            instrument
        });
    }
    removeCallback(callback, instrument) {
        const idx = this._findCallback(callback, instrument);
        if (idx < 0) {
            return;
        }
        this._callbacks.splice(idx, 1);
    }
    addBatchCallback(callback, instruments) {
        // Create a set of unique instruments.
        const observableInstruments = new Set(instruments.filter(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isObservableInstrument"]));
        if (observableInstruments.size === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].error('BatchObservableCallback is not associated with valid instruments', instruments);
            return;
        }
        const idx = this._findBatchCallback(callback, observableInstruments);
        if (idx >= 0) {
            return;
        }
        this._batchCallbacks.push({
            callback,
            instruments: observableInstruments
        });
    }
    removeBatchCallback(callback, instruments) {
        // Create a set of unique instruments.
        const observableInstruments = new Set(instruments.filter(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Instruments$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["isObservableInstrument"]));
        const idx = this._findBatchCallback(callback, observableInstruments);
        if (idx < 0) {
            return;
        }
        this._batchCallbacks.splice(idx, 1);
    }
    /**
     * @returns a promise of rejected reasons for invoking callbacks.
     */ async observe(collectionTime, timeoutMillis) {
        const callbackFutures = this._observeCallbacks(collectionTime, timeoutMillis);
        const batchCallbackFutures = this._observeBatchCallbacks(collectionTime, timeoutMillis);
        const results = await Promise.allSettled([
            ...callbackFutures,
            ...batchCallbackFutures
        ]);
        const rejections = results.filter((result)=>result.status === 'rejected').map((result)=>result.reason);
        return rejections;
    }
    _observeCallbacks(observationTime, timeoutMillis) {
        return this._callbacks.map(async ({ callback, instrument })=>{
            const observableResult = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$ObservableResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ObservableResultImpl"](instrument._descriptor.name, instrument._descriptor.valueType);
            let callPromise = Promise.resolve(callback(observableResult));
            if (timeoutMillis != null) {
                callPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["callWithTimeout"])(callPromise, timeoutMillis);
            }
            await callPromise;
            instrument._metricStorages.forEach((metricStorage)=>{
                metricStorage.record(observableResult._buffer, observationTime);
            });
        });
    }
    _observeBatchCallbacks(observationTime, timeoutMillis) {
        return this._batchCallbacks.map(async ({ callback, instruments })=>{
            const observableResult = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$ObservableResult$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["BatchObservableResultImpl"]();
            let callPromise = Promise.resolve(callback(observableResult));
            if (timeoutMillis != null) {
                callPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["callWithTimeout"])(callPromise, timeoutMillis);
            }
            await callPromise;
            instruments.forEach((instrument)=>{
                const buffer = observableResult._buffer.get(instrument);
                if (buffer == null) {
                    return;
                }
                instrument._metricStorages.forEach((metricStorage)=>{
                    metricStorage.record(buffer, observationTime);
                });
            });
        });
    }
    _findCallback(callback, instrument) {
        return this._callbacks.findIndex((record)=>{
            return record.callback === callback && record.instrument === instrument;
        });
    }
    _findBatchCallback(callback, instruments) {
        return this._batchCallbacks.findIndex((record)=>{
            return record.callback === callback && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["setEquals"])(record.instruments, instruments);
        });
    }
} //# sourceMappingURL=ObservableRegistry.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/SyncMetricStorage.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "SyncMetricStorage",
    ()=>SyncMetricStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricStorage.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$DeltaMetricProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/DeltaMetricProcessor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$TemporalMetricProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/TemporalMetricProcessor.js [instrumentation] (ecmascript)");
;
;
;
class SyncMetricStorage extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MetricStorage"] {
    _aggregationCardinalityLimit;
    _deltaMetricStorage;
    _temporalMetricStorage;
    _attributesProcessor;
    constructor(instrumentDescriptor, aggregator, attributesProcessor, collectorHandles, aggregationCardinalityLimit){
        super(instrumentDescriptor);
        this._aggregationCardinalityLimit = aggregationCardinalityLimit;
        this._deltaMetricStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$DeltaMetricProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DeltaMetricProcessor"](aggregator, this._aggregationCardinalityLimit);
        this._temporalMetricStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$TemporalMetricProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TemporalMetricProcessor"](aggregator, collectorHandles);
        this._attributesProcessor = attributesProcessor;
    }
    record(value, attributes, context, recordTime) {
        attributes = this._attributesProcessor.process(attributes, context);
        this._deltaMetricStorage.record(value, attributes, context, recordTime);
    }
    /**
     * Collects the metrics from this storage.
     *
     * Note: This is a stateful operation and may reset any interval-related
     * state for the MetricCollector.
     */ collect(collector, collectionTime) {
        const accumulations = this._deltaMetricStorage.collect();
        return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
    }
} //# sourceMappingURL=SyncMetricStorage.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AttributesProcessor.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "createAllowListAttributesProcessor",
    ()=>createAllowListAttributesProcessor,
    "createDenyListAttributesProcessor",
    ()=>createDenyListAttributesProcessor,
    "createMultiAttributesProcessor",
    ()=>createMultiAttributesProcessor,
    "createNoopAttributesProcessor",
    ()=>createNoopAttributesProcessor
]);
class NoopAttributesProcessor {
    process(incoming, _context) {
        return incoming;
    }
}
class MultiAttributesProcessor {
    _processors;
    constructor(processors){
        this._processors = processors;
    }
    process(incoming, context) {
        let filteredAttributes = incoming;
        for (const processor of this._processors){
            filteredAttributes = processor.process(filteredAttributes, context);
        }
        return filteredAttributes;
    }
}
class AllowListProcessor {
    _allowedAttributeNames;
    constructor(allowedAttributeNames){
        this._allowedAttributeNames = allowedAttributeNames;
    }
    process(incoming, _context) {
        const filteredAttributes = {};
        Object.keys(incoming).forEach((attributeName)=>{
            if (this._allowedAttributeNames.includes(attributeName)) {
                filteredAttributes[attributeName] = incoming[attributeName];
            }
        });
        return filteredAttributes;
    }
}
class DenyListProcessor {
    _deniedAttributeNames;
    constructor(deniedAttributeNames){
        this._deniedAttributeNames = deniedAttributeNames;
    }
    process(incoming, _context) {
        const filteredAttributes = {};
        Object.keys(incoming).forEach((attributeName)=>{
            if (!this._deniedAttributeNames.includes(attributeName)) {
                filteredAttributes[attributeName] = incoming[attributeName];
            }
        });
        return filteredAttributes;
    }
}
function createNoopAttributesProcessor() {
    return NOOP;
}
function createMultiAttributesProcessor(processors) {
    return new MultiAttributesProcessor(processors);
}
function createAllowListAttributesProcessor(attributeAllowList) {
    return new AllowListProcessor(attributeAllowList);
}
function createDenyListAttributesProcessor(attributeDenyList) {
    return new DenyListProcessor(attributeDenyList);
}
const NOOP = new NoopAttributesProcessor(); //# sourceMappingURL=AttributesProcessor.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MeterSharedState.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MeterSharedState",
    ()=>MeterSharedState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/InstrumentDescriptor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Meter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/Meter.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$AsyncMetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/AsyncMetricStorage.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MetricStorageRegistry$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricStorageRegistry.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MultiWritableMetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MultiWritableMetricStorage.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$ObservableRegistry$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/ObservableRegistry.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$SyncMetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/SyncMetricStorage.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AttributesProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AttributesProcessor.js [instrumentation] (ecmascript)");
;
;
;
;
;
;
;
;
class MeterSharedState {
    metricStorageRegistry = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MetricStorageRegistry$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MetricStorageRegistry"]();
    observableRegistry = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$ObservableRegistry$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ObservableRegistry"]();
    meter;
    _meterProviderSharedState;
    _instrumentationScope;
    constructor(meterProviderSharedState, instrumentationScope){
        this.meter = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$Meter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["Meter"](this);
        this._meterProviderSharedState = meterProviderSharedState;
        this._instrumentationScope = instrumentationScope;
    }
    registerMetricStorage(descriptor) {
        const storages = this._registerMetricStorage(descriptor, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$SyncMetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["SyncMetricStorage"]);
        if (storages.length === 1) {
            return storages[0];
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MultiWritableMetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MultiMetricStorage"](storages);
    }
    registerAsyncMetricStorage(descriptor) {
        const storages = this._registerMetricStorage(descriptor, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$AsyncMetricStorage$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AsyncMetricStorage"]);
        return storages;
    }
    /**
     * @param collector opaque handle of {@link MetricCollector} which initiated the collection.
     * @param collectionTime the HrTime at which the collection was initiated.
     * @param options options for collection.
     * @returns the list of metric data collected.
     */ async collect(collector, collectionTime, options) {
        /**
         * 1. Call all observable callbacks first.
         * 2. Collect metric result for the collector.
         */ const errors = await this.observableRegistry.observe(collectionTime, options?.timeoutMillis);
        const storages = this.metricStorageRegistry.getStorages(collector);
        // prevent more allocations if there are no storages.
        if (storages.length === 0) {
            return null;
        }
        const metricDataList = [];
        storages.forEach((metricStorage)=>{
            const metricData = metricStorage.collect(collector, collectionTime);
            if (metricData != null) {
                metricDataList.push(metricData);
            }
        });
        // skip this scope if no data was collected (storage created, but no data observed)
        if (metricDataList.length === 0) {
            return {
                errors
            };
        }
        return {
            scopeMetrics: {
                scope: this._instrumentationScope,
                metrics: metricDataList
            },
            errors
        };
    }
    _registerMetricStorage(descriptor, MetricStorageType) {
        const views = this._meterProviderSharedState.viewRegistry.findViews(descriptor, this._instrumentationScope);
        let storages = views.map((view)=>{
            const viewDescriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$InstrumentDescriptor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createInstrumentDescriptorWithView"])(view, descriptor);
            const compatibleStorage = this.metricStorageRegistry.findOrUpdateCompatibleStorage(viewDescriptor);
            if (compatibleStorage != null) {
                return compatibleStorage;
            }
            const aggregator = view.aggregation.createAggregator(viewDescriptor);
            const viewStorage = new MetricStorageType(viewDescriptor, aggregator, view.attributesProcessor, this._meterProviderSharedState.metricCollectors, view.aggregationCardinalityLimit);
            this.metricStorageRegistry.register(viewStorage);
            return viewStorage;
        });
        // Fallback to the per-collector aggregations if no view is configured for the instrument.
        if (storages.length === 0) {
            const perCollectorAggregations = this._meterProviderSharedState.selectAggregations(descriptor.type);
            const collectorStorages = perCollectorAggregations.map(([collector, aggregation])=>{
                const compatibleStorage = this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(collector, descriptor);
                if (compatibleStorage != null) {
                    return compatibleStorage;
                }
                const aggregator = aggregation.createAggregator(descriptor);
                const cardinalityLimit = collector.selectCardinalityLimit(descriptor.type);
                const storage = new MetricStorageType(descriptor, aggregator, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AttributesProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createNoopAttributesProcessor"])(), [
                    collector
                ], cardinalityLimit);
                this.metricStorageRegistry.registerForCollector(collector, storage);
                return storage;
            });
            storages = storages.concat(collectorStorages);
        }
        return storages;
    }
} //# sourceMappingURL=MeterSharedState.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MeterProviderSharedState.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MeterProviderSharedState",
    ()=>MeterProviderSharedState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$ViewRegistry$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/ViewRegistry.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MeterSharedState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MeterSharedState.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AggregationOption.js [instrumentation] (ecmascript)");
;
;
;
;
class MeterProviderSharedState {
    viewRegistry = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$ViewRegistry$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ViewRegistry"]();
    metricCollectors = [];
    meterSharedStates = new Map();
    resource;
    constructor(resource){
        this.resource = resource;
    }
    getMeterSharedState(instrumentationScope) {
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["instrumentationScopeId"])(instrumentationScope);
        let meterSharedState = this.meterSharedStates.get(id);
        if (meterSharedState == null) {
            meterSharedState = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MeterSharedState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MeterSharedState"](this, instrumentationScope);
            this.meterSharedStates.set(id, meterSharedState);
        }
        return meterSharedState;
    }
    selectAggregations(instrumentType) {
        const result = [];
        for (const collector of this.metricCollectors){
            result.push([
                collector,
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["toAggregation"])(collector.selectAggregation(instrumentType))
            ]);
        }
        return result;
    }
} //# sourceMappingURL=MeterProviderSharedState.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricCollector.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MetricCollector",
    ()=>MetricCollector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/core/build/esm/common/time.js [instrumentation] (ecmascript)");
;
class MetricCollector {
    _sharedState;
    _metricReader;
    constructor(sharedState, metricReader){
        this._sharedState = sharedState;
        this._metricReader = metricReader;
    }
    async collect(options) {
        const collectionTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$core$2f$build$2f$esm$2f$common$2f$time$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["millisToHrTime"])(Date.now());
        const scopeMetrics = [];
        const errors = [];
        const meterCollectionPromises = Array.from(this._sharedState.meterSharedStates.values()).map(async (meterSharedState)=>{
            const current = await meterSharedState.collect(this, collectionTime, options);
            // only add scope metrics if available
            if (current?.scopeMetrics != null) {
                scopeMetrics.push(current.scopeMetrics);
            }
            // only add errors if available
            if (current?.errors != null) {
                errors.push(...current.errors);
            }
        });
        await Promise.all(meterCollectionPromises);
        return {
            resourceMetrics: {
                resource: this._sharedState.resource,
                scopeMetrics: scopeMetrics
            },
            errors: errors
        };
    }
    /**
     * Delegates for MetricReader.forceFlush.
     */ async forceFlush(options) {
        await this._metricReader.forceFlush(options);
    }
    /**
     * Delegates for MetricReader.shutdown.
     */ async shutdown(options) {
        await this._metricReader.shutdown(options);
    }
    selectAggregationTemporality(instrumentType) {
        return this._metricReader.selectAggregationTemporality(instrumentType);
    }
    selectAggregation(instrumentType) {
        return this._metricReader.selectAggregation(instrumentType);
    }
    /**
     * Select the cardinality limit for the given {@link InstrumentType} for this
     * collector.
     */ selectCardinalityLimit(instrumentType) {
        return this._metricReader.selectCardinalityLimit?.(instrumentType) ?? 2000;
    }
} //# sourceMappingURL=MetricCollector.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/Predicate.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
 */ // https://tc39.es/proposal-regex-escaping
// escape ^ $ \ .  + ? ( ) [ ] { } |
// do not need to escape * as we interpret it as wildcard
__turbopack_context__.s([
    "ExactPredicate",
    ()=>ExactPredicate,
    "PatternPredicate",
    ()=>PatternPredicate
]);
const ESCAPE = /[\^$\\.+?()[\]{}|]/g;
class PatternPredicate {
    _matchAll;
    _regexp;
    constructor(pattern){
        if (pattern === '*') {
            this._matchAll = true;
            this._regexp = /.*/;
        } else {
            this._matchAll = false;
            this._regexp = new RegExp(PatternPredicate.escapePattern(pattern));
        }
    }
    match(str) {
        if (this._matchAll) {
            return true;
        }
        return this._regexp.test(str);
    }
    static escapePattern(pattern) {
        return `^${pattern.replace(ESCAPE, '\\$&').replace('*', '.*')}$`;
    }
    static hasWildcard(pattern) {
        return pattern.includes('*');
    }
}
class ExactPredicate {
    _matchAll;
    _pattern;
    constructor(pattern){
        this._matchAll = pattern === undefined;
        this._pattern = pattern;
    }
    match(str) {
        if (this._matchAll) {
            return true;
        }
        if (str === this._pattern) {
            return true;
        }
        return false;
    }
} //# sourceMappingURL=Predicate.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/InstrumentSelector.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "InstrumentSelector",
    ()=>InstrumentSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Predicate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/Predicate.js [instrumentation] (ecmascript)");
;
class InstrumentSelector {
    _nameFilter;
    _type;
    _unitFilter;
    constructor(criteria){
        this._nameFilter = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Predicate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["PatternPredicate"](criteria?.name ?? '*');
        this._type = criteria?.type;
        this._unitFilter = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Predicate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExactPredicate"](criteria?.unit);
    }
    getType() {
        return this._type;
    }
    getNameFilter() {
        return this._nameFilter;
    }
    getUnitFilter() {
        return this._unitFilter;
    }
} //# sourceMappingURL=InstrumentSelector.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/MeterSelector.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MeterSelector",
    ()=>MeterSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Predicate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/Predicate.js [instrumentation] (ecmascript)");
;
class MeterSelector {
    _nameFilter;
    _versionFilter;
    _schemaUrlFilter;
    constructor(criteria){
        this._nameFilter = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Predicate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExactPredicate"](criteria?.name);
        this._versionFilter = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Predicate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExactPredicate"](criteria?.version);
        this._schemaUrlFilter = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Predicate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ExactPredicate"](criteria?.schemaUrl);
    }
    getNameFilter() {
        return this._nameFilter;
    }
    /**
     * TODO: semver filter? no spec yet.
     */ getVersionFilter() {
        return this._versionFilter;
    }
    getSchemaUrlFilter() {
        return this._schemaUrlFilter;
    }
} //# sourceMappingURL=MeterSelector.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/View.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "View",
    ()=>View
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Predicate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/Predicate.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AttributesProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AttributesProcessor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$InstrumentSelector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/InstrumentSelector.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$MeterSelector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/MeterSelector.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AggregationOption.js [instrumentation] (ecmascript)");
;
;
;
;
;
function isSelectorNotProvided(options) {
    return options.instrumentName == null && options.instrumentType == null && options.instrumentUnit == null && options.meterName == null && options.meterVersion == null && options.meterSchemaUrl == null;
}
function validateViewOptions(viewOptions) {
    // If no criteria is provided, the SDK SHOULD treat it as an error.
    // It is recommended that the SDK implementations fail fast.
    if (isSelectorNotProvided(viewOptions)) {
        throw new Error('Cannot create view with no selector arguments supplied');
    }
    // the SDK SHOULD NOT allow Views with a specified name to be declared with instrument selectors that
    // may select more than one instrument (e.g. wild card instrument name) in the same Meter.
    if (viewOptions.name != null && (viewOptions?.instrumentName == null || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$Predicate$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["PatternPredicate"].hasWildcard(viewOptions.instrumentName))) {
        throw new Error('Views with a specified name must be declared with an instrument selector that selects at most one instrument per meter.');
    }
}
class View {
    name;
    description;
    aggregation;
    attributesProcessor;
    instrumentSelector;
    meterSelector;
    aggregationCardinalityLimit;
    /**
     * Create a new {@link View} instance.
     *
     * Parameters can be categorized as two types:
     *  Instrument selection criteria: Used to describe the instrument(s) this view will be applied to.
     *  Will be treated as additive (the Instrument has to meet all the provided criteria to be selected).
     *
     *  Metric stream altering: Alter the metric stream of instruments selected by instrument selection criteria.
     *
     * @param viewOptions {@link ViewOptions} for altering the metric stream and instrument selection.
     * @param viewOptions.name
     * Alters the metric stream:
     *  This will be used as the name of the metrics stream.
     *  If not provided, the original Instrument name will be used.
     * @param viewOptions.description
     * Alters the metric stream:
     *  This will be used as the description of the metrics stream.
     *  If not provided, the original Instrument description will be used by default.
     * @param viewOptions.attributesProcessors
     * Alters the metric stream:
     *  If provided, the attributes will be modified as defined by the added processors.
     *  If not provided, all attribute keys will be used by default.
     * @param viewOptions.aggregationCardinalityLimit
     * Alters the metric stream:
     *  Sets a limit on the number of unique attribute combinations (cardinality) that can be aggregated.
     *  If not provided, the default limit of 2000 will be used.
     * @param viewOptions.aggregation
     * Alters the metric stream:
     *  Alters the {@link Aggregation} of the metric stream.
     * @param viewOptions.instrumentName
     * Instrument selection criteria:
     *  Original name of the Instrument(s) with wildcard support.
     * @param viewOptions.instrumentType
     * Instrument selection criteria:
     *  The original type of the Instrument(s).
     * @param viewOptions.instrumentUnit
     * Instrument selection criteria:
     *  The unit of the Instrument(s).
     * @param viewOptions.meterName
     * Instrument selection criteria:
     *  The name of the Meter. No wildcard support, name must match the meter exactly.
     * @param viewOptions.meterVersion
     * Instrument selection criteria:
     *  The version of the Meter. No wildcard support, version must match exactly.
     * @param viewOptions.meterSchemaUrl
     * Instrument selection criteria:
     *  The schema URL of the Meter. No wildcard support, schema URL must match exactly.
     *
     * @example
     * // Create a view that changes the Instrument 'my.instrument' to use to an
     * // ExplicitBucketHistogramAggregation with the boundaries [20, 30, 40]
     * new View({
     *   aggregation: new ExplicitBucketHistogramAggregation([20, 30, 40]),
     *   instrumentName: 'my.instrument'
     * })
     */ constructor(viewOptions){
        validateViewOptions(viewOptions);
        // Create multi-processor if attributesProcessors are defined.
        if (viewOptions.attributesProcessors != null) {
            this.attributesProcessor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AttributesProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createMultiAttributesProcessor"])(viewOptions.attributesProcessors);
        } else {
            this.attributesProcessor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AttributesProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createNoopAttributesProcessor"])();
        }
        this.name = viewOptions.name;
        this.description = viewOptions.description;
        this.aggregation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["toAggregation"])(viewOptions.aggregation ?? {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationType"].DEFAULT
        });
        this.instrumentSelector = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$InstrumentSelector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentSelector"]({
            name: viewOptions.instrumentName,
            type: viewOptions.instrumentType,
            unit: viewOptions.instrumentUnit
        });
        this.meterSelector = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$MeterSelector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MeterSelector"]({
            name: viewOptions.meterName,
            version: viewOptions.meterVersion,
            schemaUrl: viewOptions.meterSchemaUrl
        });
        this.aggregationCardinalityLimit = viewOptions.aggregationCardinalityLimit;
    }
} //# sourceMappingURL=View.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/MeterProvider.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
    "MeterProvider",
    ()=>MeterProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2f$NoopMeter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/api/build/esm/metrics/NoopMeter.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MeterProviderSharedState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MeterProviderSharedState.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MetricCollector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricCollector.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$View$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/View.js [instrumentation] (ecmascript)");
;
;
;
;
;
class MeterProvider {
    _sharedState;
    _shutdown = false;
    constructor(options){
        this._sharedState = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MeterProviderSharedState$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MeterProviderSharedState"](options?.resource ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["defaultResource"])());
        if (options?.views != null && options.views.length > 0) {
            for (const viewOption of options.views){
                this._sharedState.viewRegistry.addView(new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$View$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["View"](viewOption));
            }
        }
        if (options?.readers != null && options.readers.length > 0) {
            for (const metricReader of options.readers){
                const collector = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$state$2f$MetricCollector$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MetricCollector"](this._sharedState, metricReader);
                metricReader.setMetricProducer(collector);
                this._sharedState.metricCollectors.push(collector);
            }
        }
    }
    /**
     * Get a meter with the configuration of the MeterProvider.
     */ getMeter(name, version = '', options = {}) {
        // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/sdk.md#meter-creation
        if (this._shutdown) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('A shutdown MeterProvider cannot provide a Meter');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$metrics$2f$NoopMeter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createNoopMeter"])();
        }
        return this._sharedState.getMeterSharedState({
            name,
            version,
            schemaUrl: options.schemaUrl
        }).meter;
    }
    /**
     * Shut down the MeterProvider and all registered
     * MetricReaders.
     *
     * Returns a promise which is resolved when all flushes are complete.
     */ async shutdown(options) {
        if (this._shutdown) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('shutdown may only be called once per MeterProvider');
            return;
        }
        this._shutdown = true;
        await Promise.all(this._sharedState.metricCollectors.map((collector)=>{
            return collector.shutdown(options);
        }));
    }
    /**
     * Notifies all registered MetricReaders to flush any buffered data.
     *
     * Returns a promise which is resolved when all flushes are complete.
     */ async forceFlush(options) {
        // do not flush after shutdown
        if (this._shutdown) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].warn('invalid attempt to force flush after MeterProvider shutdown');
            return;
        }
        await Promise.all(this._sharedState.metricCollectors.map((collector)=>{
            return collector.forceFlush(options);
        }));
    }
} //# sourceMappingURL=MeterProvider.js.map
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/index.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AggregationTemporality",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationTemporality"],
    "AggregationType",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["AggregationType"],
    "ConsoleMetricExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$ConsoleMetricExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["ConsoleMetricExporter"],
    "DataPointType",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["DataPointType"],
    "InMemoryMetricExporter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$InMemoryMetricExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InMemoryMetricExporter"],
    "InstrumentType",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["InstrumentType"],
    "MeterProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$MeterProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MeterProvider"],
    "MetricReader",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricReader$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["MetricReader"],
    "PeriodicExportingMetricReader",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$PeriodicExportingMetricReader$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["PeriodicExportingMetricReader"],
    "TimeoutError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["TimeoutError"],
    "createAllowListAttributesProcessor",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AttributesProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createAllowListAttributesProcessor"],
    "createDenyListAttributesProcessor",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AttributesProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["createDenyListAttributesProcessor"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$AggregationTemporality$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationTemporality.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricData$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$MetricReader$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricReader.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$PeriodicExportingMetricReader$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/PeriodicExportingMetricReader.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$InMemoryMetricExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/InMemoryMetricExporter.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$ConsoleMetricExporter$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/export/ConsoleMetricExporter.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$MeterProvider$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/MeterProvider.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AggregationOption$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AggregationOption.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$view$2f$AttributesProcessor$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/view/AttributesProcessor.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WyshkitSaltBae$2d$Prateek$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$utils$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js [instrumentation] (ecmascript)");
}),
];

//# sourceMappingURL=095e5_%40opentelemetry_sdk-metrics_build_esm_2bf57f2e._.js.map