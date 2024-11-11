"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = lookup;
exports.registerProvider = registerProvider;
exports.unregisterProvider = unregisterProvider;
const net = require("net");
const fs = require("fs");
const pipeName_1 = require("../common/pipeName");
const provider_1 = require("../common/provider");
const encodeDecoder_1 = require("../common/encodeDecoder");
const pack = (type, payload) => JSON.stringify({ type, payload });
async function lookup(conf) {
    const { promise, resolve } = (0, provider_1.promiseResolvers)();
    const socket = net.connect((0, pipeName_1.pipeName)() + 'provider.registry');
    socket.on('data', buf => {
        resolve(JSON.parse(buf.toString()));
        socket.end();
    });
    socket.write(pack('lookup', conf));
    return promise;
}
async function registerOnNet(desc) {
    const { promise, resolve, reject } = (0, provider_1.promiseResolvers)();
    const sock = net.connect((0, pipeName_1.pipeName)() + 'provider.registry')
        .on('data', buf => {
        resolve(JSON.parse(buf.toString()));
        sock.end();
    })
        .on('error', reject);
    sock.write(pack('register', desc));
    return promise;
}
async function handleConsume(buffer, sock, provider) {
    const { type, uri, payload } = (0, encodeDecoder_1.messageDecode)(buffer);
    switch (type) {
        case 0:
            sock.write((0, encodeDecoder_1.messageEncode)(5, uri, await provider.read(uri)));
            break;
        case 1:
            await provider.write(uri, payload);
            break;
        case 2:
            await provider.delete(uri);
            break;
    }
}
async function registerProvider(desc, provider) {
    await registerOnNet(desc);
    net.createServer(sock => {
        sock.on('data', buf => handleConsume(buf, sock, provider));
    }).listen((0, pipeName_1.pipeName)() + desc.pipeName);
}
function unregisterProvider(desc) {
    const { promise, resolve, reject } = (0, provider_1.promiseResolvers)();
    const sock = net.connect((0, pipeName_1.pipeName)() + 'provider.registry')
        .on('data', () => {
        sock.end();
        if (fs.existsSync((0, pipeName_1.pipeName)() + desc.pipeName)) {
            fs.unlinkSync((0, pipeName_1.pipeName)() + desc.pipeName);
        }
        resolve();
    })
        .on('error', reject);
    sock.write(pack('unregister', { name: desc.name }));
    return promise;
}
