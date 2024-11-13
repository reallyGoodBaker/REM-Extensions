import { StructDescriptor } from "./struct";
export declare class Song {
    id: number;
    name: string;
    artist: string[];
    album: string;
    duration: number;
    uri: string;
    isFavorite: boolean;
    constructor(id: number, name: string, artist: string[], album: string, duration: number, uri: string, isFavorite: boolean);
    static struct: StructDescriptor;
    static encode({ id, name, artist, album, duration, uri, isFavorite }: Song): Uint8Array;
    static decode(encoded: Uint8Array): Song;
}
export declare const songEncodeDecoder: import("../encodeDecoder").EncodeDecoder<Song>;
