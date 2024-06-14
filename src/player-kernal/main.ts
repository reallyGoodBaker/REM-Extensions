import { ipc, whenReady, Socket, provide, output } from 'extension'
import { RtAudio, RtAudioFormat } from 'audify'

let pcmReciever: Socket | null = null
let audio: RtAudio = new RtAudio()
let renderBuffer: Buffer[] = []

const sampleRate = 48000
const channels = 2
const bufferSize = 4096

async function createAudio() {
    if (audio) {
        audio.closeStream()
        audio = new RtAudio()
    }

    const { label } = await output.device()
    const device = audio?.getDevices().find(({ name }) => name === label)

    if (!device) {
        return
    }

    audio?.openStream(
        {
            deviceId: device.id,
            nChannels: channels,
        },
        null,
        RtAudioFormat.RTAUDIO_FLOAT32,
        sampleRate,
        bufferSize,
        'mainStream',
        null,
        null,
    )

    const writeBlank = () => {
        const buffer = Buffer.alloc(bufferSize * channels * 4).fill(0)
        audio.write(buffer)
    }

    audio.setFrameOutputCallback(() => {
        const buffer = renderBuffer.shift()
        console.log(performance.now())

        buffer
            ? audio.write(buffer)
            : writeBlank()
    })

    audio.start()
    writeBlank()
}

whenReady(async () => {
    pcmReciever = ipc.registerPcmStreamReceiver(buffer => {
        if (audio.isStreamRunning()) {
            renderBuffer.push(buffer)
        }
    })

    await createAudio()
})

provide('beforeDisable', () => {
    if (pcmReciever) {
        pcmReciever.close()
    }

    audio.closeStream()
})