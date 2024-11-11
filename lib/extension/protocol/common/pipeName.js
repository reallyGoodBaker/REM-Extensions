"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipeName = exports.getPipeName = void 0;
const PIP_NAMES = {
    win32: `\\\\?\\pipe\\rem\\`,
    linux: '/tmp/rem/',
};
const getPipeName = (platform) => {
    return PIP_NAMES[platform];
};
exports.getPipeName = getPipeName;
const pipeName = () => {
    return (0, exports.getPipeName)(process.platform) || PIP_NAMES.linux;
};
exports.pipeName = pipeName;
