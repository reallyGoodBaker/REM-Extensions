"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseResolvers = promiseResolvers;
function promiseResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return {
        //@ts-ignore
        promise,
        resolve,
        reject,
    };
}
