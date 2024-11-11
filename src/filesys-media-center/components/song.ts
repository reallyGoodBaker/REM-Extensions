import { Provider } from 'extension/protocol/common/provider'
import { songEncoderDecoder } from 'extension/protocol/common/song'
import { ProviderDescritpor } from 'extension/protocol/common/provider'
import { registerProvider } from 'extension/protocol/node/provider'

const providerDescriptor: ProviderDescritpor = {
    name: 'fsMediaCenter.songs',
    pipeName: 'fsMediaCenter.songs',
    category: 'provider.songs'
}

class SongProvider implements Provider {
    async read(uri: string): Promise<Buffer> {
        console.log('read', uri)
        return Buffer.alloc(0)
    }
    async write(uri: string, value: Buffer): Promise<void> {
        console.log('write', uri, songEncoderDecoder.decode(value))
    }
    async delete(uri: string): Promise<void> {
        console.log('delete', uri)
    }
}

registerProvider(
    providerDescriptor,
    new SongProvider()
)