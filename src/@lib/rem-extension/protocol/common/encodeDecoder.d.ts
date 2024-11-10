export interface EncodeDecoder<V> {
    encode(data: V): Uint8Array | Buffer;
    decode(data: Uint8Array | Buffer): V;
}
export declare function encodeDecoder<V>(encoder: (data: V) => Buffer, decoder: (data: Buffer) => V): EncodeDecoder<V>;
export declare function messageEncode(type: number, uri: string, data: Buffer): Buffer;
export declare function messageDecode(data: Buffer): {
    type: number;
    uri: string;
    payload: Buffer;
};
