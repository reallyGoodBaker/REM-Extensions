type RemoveNotGetter<T> = {
    [K in keyof T as K extends `get${string}` ? K : never]: T[K];
};
type RemoveGetPrefix<T> = keyof T extends `get${infer U}` ? U : never;
export type DataViewTypes = RemoveGetPrefix<RemoveNotGetter<DataView>>;
export type StructDataTypes = DataViewTypes | `byte${number}` | 'string';
export interface StructDescriptor {
    layout(): StructDataTypes[];
}
export interface Mem {
    get(): any[];
    getBytes(): ArrayBuffer;
    set(buffer: ArrayBuffer): void;
    setUint8Array(u8arr: Uint8Array): void;
    setArray(obj: any[]): void;
}
export declare function sizeof(struct: StructDescriptor): number;
export declare function malloc(struct: StructDescriptor): Mem;
export {};
