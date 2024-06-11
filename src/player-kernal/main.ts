import { ipc, whenReady, Socket, provide, output } from 'extension'
import { RtAudio, RtAudioFormat } from 'audify'

let pcmReciever: Socket | null = null
let audio: RtAudio = new RtAudio()

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
            nChannels: 2,
        },
        null,
        RtAudioFormat.RTAUDIO_FLOAT32,
        48000,
        8192,
        'mainStream',
        null,
        null,
    )

    audio.start()
}

whenReady(async () => {
    pcmReciever = ipc.subscribePcm('pcm', buffer => {
        if (audio.isStreamRunning()) {
            audio.write(buffer)
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