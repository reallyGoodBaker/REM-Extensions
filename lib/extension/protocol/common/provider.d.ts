export interface Provider {
    read(uri: string): Promise<Buffer>;
    write(uri: string, value: Buffer): Promise<void>;
    delete(uri: string): Promise<void>;
}
export declare function promiseResolvers<T>(): {
    promise: Promise<T>;
    resolve: (value: void) => void;
    reject: (reason: any) => void;
};
export type LookupConfig = Partial<ProviderDescritpor>;
export interface ProviderDescritpor {
    readonly name: string;
    readonly pipeName: string;
    readonly category: string;
}
