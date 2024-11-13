export interface EncodeDecoder<V> {
    encode(data: V): Uint8Array;
    decode(data: Uint8Array): V;
}
export declare function encodeDecoder<V>(encoder: (data: V) => Uint8Array, decoder: (data: Uint8Array) => V): EncodeDecoder<V>;
export declare const noneEncodeDecoder: EncodeDecoder<any>;
export declare enum MessageType {
    READ = 0,
    WRITE = 1,
    DELETE = 2,
    RETURN = 3
}
export interface Message {
    type: MessageType;
    uri: string;
    payload: Buffer;
}
export declare function messageEncode({ type, uri, payload }: Message): Buffer;
export declare function messageDecode(data: Buffer): Message;
