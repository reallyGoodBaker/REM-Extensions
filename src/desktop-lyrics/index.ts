import { ipc, provide, whenReady, win } from 'extension'
import https from 'node:https'
import { Socket } from 'net'

const NETEASE_API = 'https://bot-neteaseapi.rgb39.top/'

async function request(url: string): Promise<any> {
    const { promise, resolve, reject } = Promise.withResolvers()
    https.get(url, res => {
        let buf = Buffer.alloc(0)
        res.on('data', chunk => {
            buf = Buffer.concat([ buf, chunk ])
        })

        res.on('end', () => {
            try {
                resolve(buf)
            } catch (error) {
                reject(error)
            }
        })

        res.on('error', err => reject(err))
    })

    return promise
}

ipc.server('lyric', async (sock: Socket) => {
    sock.on('data', async buf => {
        const id = buf.toString('utf-8')
        try {
            const lyrics = await request(`${NETEASE_API}lyric?id=${id}`)
            return sock.write(lyrics)
        } catch {
            return sock.write('null')
        }
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

