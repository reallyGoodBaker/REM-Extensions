export declare class Song {
    id: number;
    name: string;
    artist: string[];
    album: string;
    duration: number;
    uri: string;
    isFavorite: boolean;
    constructor(id: number, name: string, artist: string[], album: string, duration: number, uri: string, isFavorite: boolean);
    static encode(song: Song): Buffer;
    static decode(encoded: Buffer): Song;
}
export declare const songEncoderDecoder: import("./encodeDecoder").EncodeDecoder<Song>;
