declare const PIP_NAMES: {
    win32: string;
    linux: string;
};
export declare const getPipeName: (platform: keyof typeof PIP_NAMES) => string;
export declare const pipeName: () => string;
export {};
