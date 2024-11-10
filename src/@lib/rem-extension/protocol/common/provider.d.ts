export interface Provider {
    create(uri: string, value: Buffer): Promise<void>;
    read(uri: string): Promise<Buffer>;
    update(uri: string, value: Buffer): Promise<void>;
    delete(uri: string): Promise<void>;
}
export declare function promiseResolvers<T>(): {
    promise: Promise<T>;
    resolve: (value: void) => void;
    reject: (reason: any) => void;
};
