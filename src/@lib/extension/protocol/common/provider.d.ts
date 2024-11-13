export interface Provider {
    read(uri: string): Promise<Buffer>;
    write(uri: string, value: Buffer): Promise<void> | void;
    delete(uri: string): Promise<void> | void;
}
export declare function promiseResolvers<T>(): {
    promise: Promise<T>;
    resolve: (value: void) => void;
    reject: (reason: any) => void;
};
export type LookupConfig = Partial<ProviderDescritpor>;
type ProviderCategories = 'song' | 'album' | 'artist' | 'playlist' | 'genre' | 'tag' | 'user' | 'playlist';
export type ProviderCategory = `provider.${ProviderCategories}` | 'default';
export interface ProviderDescritpor {
    readonly name: string;
    readonly category: ProviderCategory;
}
export {};
