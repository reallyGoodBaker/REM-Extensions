import { notification, whenReady, threads, provide } from 'extension'
import { lookup, unregisterProvider } from 'extension/protocol/node/provider'

function notify(message: unknown) {
    const notificationId = `thread-${Math.random()}`
    notification.send({
        channel: notificationId,
        title: (message instanceof Error) ? '错误' : '提示',
        message: String(message),
        timeout: -1,
    })
}

whenReady(async () => {
    const port = await threads.createThread('songs')
    port.addEventListener('message', ev => {
        notify(ev.data)
    })
    port.addEventListener('messageerror', ev => {
        notify(ev.data)
    })

    console.log(await lookup({ category: 'provider.songs' }))
})

provide('beforeDisable', () => {
    threads.killThread('songs')
    unregisterProvider('fsMediaCenter.songs')
})