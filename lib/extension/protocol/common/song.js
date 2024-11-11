"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.songEncoderDecoder = exports.Song = void 0;
const encodeDecoder_1 = require("./encodeDecoder");
class Song {
    id;
    name;
    artist;
    album;
    duration;
    uri;
    isFavorite;
    constructor(id, name, artist, album, duration, uri, isFavorite) {
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.album = album;
        this.duration = duration;
        this.uri = uri;
        this.isFavorite = isFavorite;
    }
    static encode(song) {
        const artistStr = song.artist.join('\0');
        const encoded = Buffer.alloc(128);
        let offset = 0;
        encoded.writeInt32LE(song.id);
        encoded.writeUint16LE(song.name.length, offset += 4);
        encoded.writeUint16LE(artistStr.length, offset += 2);
        encoded.writeUint16LE(song.album.length, offset += 2);
        encoded.writeUint16LE(song.uri.length, offset += 2);
        encoded.writeUint32LE(song.duration, offset += 2);
        encoded.writeUInt8(song.isFavorite ? 1 : 0, offset += 4);
        encoded.write(song.name, offset += 1, 'utf8');
        encoded.write(artistStr, offset += song.name.length + 1, 'utf8');
        encoded.write(song.album, offset += artistStr.length + 1, 'utf8');
        encoded.write(song.uri, offset += song.album.length + 1, 'utf8');
        return encoded;
    }
    static decode(encoded) {
        let offset = 0;
        const id = encoded.readInt32LE(0);
        const nameLength = encoded.readUInt16LE(offset += 4);
        const artistLength = encoded.readUInt16LE(offset += 2);
        const albumLength = encoded.readUInt16LE(offset += 2);
        const uriLength = encoded.readUInt16LE(offset += 2);
        const duration = encoded.readUInt32LE(offset += 2);
        const isFavorite = encoded.readUInt8(offset += 4) === 1;
        const name = encoded.toString('utf8', offset += 1, offset += 1 + nameLength);
        const artist = encoded.toString('utf8', offset += nameLength + 1, offset += nameLength + 1 + artistLength).split('\0');
        const album = encoded.toString('utf8', offset += artistLength + 1, offset += artistLength + 1 + albumLength);
        const uri = encoded.toString('utf8', offset += albumLength + 1, offset += albumLength + 1 + uriLength);
        return new Song(id, name, artist, album, duration, uri, isFavorite);
    }
}
exports.Song = Song;
exports.songEncoderDecoder = (0, encodeDecoder_1.encodeDecoder)(Song.encode, Song.decode);
