"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeDecoder = encodeDecoder;
exports.messageEncode = messageEncode;
exports.messageDecode = messageDecode;
function encodeDecoder(encoder, decoder) {
    return {
        encode: encoder,
        decode: decoder,
    };
}
function messageEncode(type, uri, data) {
    return Buffer.concat([
        Buffer.from([type]),
        Buffer.from(uri + '\0', 'utf8'),
        data,
    ]);
}
function messageDecode(data) {
    const type = data[0];
    const uriEnd = data.indexOf(0, 1);
    const uri = data.subarray(1, uriEnd).toString('utf8');
    const payload = data.subarray(uriEnd + 1);
    return { type, uri, payload };
}
