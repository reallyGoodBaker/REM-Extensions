"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = lookup;
exports.registerInMain = registerInMain;
exports.register = register;
exports.setupRegistry = setupRegistry;
const net = require("net");
const pipeName_1 = require("../common/pipeName");
const registry = new Set();
function findFromRegistry(name) {
    for (const record of registry) {
        if (record.name === name) {
            return record;
        }
    }
    return null;
}
function lookup(conf) {
    const providers = [];
    for (const record of registry) {
        const { category, pipeName, name } = record;
        if (pipeName === conf.pipeName) {
            return [record];
        }
        if (conf.name && name.includes(conf.name)) {
            providers.push(record);
            continue;
        }
        if (conf.category && category === conf.category) {
            providers.push(record);
        }
    }
    return providers;
}
const defaultConfig = {
    name: 'default',
    category: 'default',
};
function registerInMain(pipeName, provider, conf = defaultConfig) {
    const record = {
        pipeName, provider,
        ...conf,
        ...defaultConfig
    };
    registry.add(record);
}
function register(desc) {
    registry.add(desc);
}
function setupRegistry() {
    net.createServer(sock => {
        sock.on('data', buf => {
            const request = JSON.parse(buf.toString());
            const { type, payload } = request;
            if (type === 'lookup') {
                const lookupConf = payload;
                const providers = lookup(lookupConf);
                sock.write(JSON.stringify(providers));
            }
            else if (type === 'register') {
                register(payload);
                sock.write('{}');
            }
            else if (type === 'unregister') {
                const { name } = payload;
                const record = findFromRegistry(name);
                if (record) {
                    registry.delete(record);
                }
                sock.write('{}');
            }
            sock.end();
        });
    }).listen((0, pipeName_1.pipeName)() + 'provider.registry');
}
