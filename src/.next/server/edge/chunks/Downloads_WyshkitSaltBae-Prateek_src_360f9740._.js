(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/Downloads_WyshkitSaltBae-Prateek_src_360f9740._.js",
"[project]/Downloads/WyshkitSaltBae-Prateek/src/instrumentation.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
}),
"[project]/Downloads/WyshkitSaltBae-Prateek/src/edge-wrapper.js { MODULE => \"[project]/Downloads/WyshkitSaltBae-Prateek/src/instrumentation.ts [instrumentation-edge] (ecmascript)\" } [instrumentation-edge] (ecmascript)", ((__turbopack_context__, module, exports) => {

self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i("[project]/Downloads/WyshkitSaltBae-Prateek/src/instrumentation.ts [instrumentation-edge] (ecmascript)"));
modProm.catch(()=>{});
self._ENTRIES["middleware_instrumentation"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=Downloads_WyshkitSaltBae-Prateek_src_360f9740._.js.map