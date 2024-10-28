import { ipc, provide, whenReady, win } from 'extension'
import { lyric } from 'NeteaseCloudMusicApi'
import { Socket } from 'net'

ipc.server('lyric', async (sock: Socket) => {
    sock.on('data', async buf => {
        const id = buf.toString('utf-8')
        const lyrics = await lyric({ id })

        if (lyrics.status !== 200) {
            return sock.write('null')
        }

        return sock.write(JSON.stringify(lyrics!.body))
    })
})

let winId: string

whenReady(async () => {
    winId = await win.openWindow('desktop-lyrics', {
        width: 460,
        height: 120,
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        maximizable: false,
        skipTaskbar: true,
        resizable: false,
        minHeight: 120,
        minWidth: 380,
    })
})

provide('beforeDisable', () => win.closeWindow(winId))

