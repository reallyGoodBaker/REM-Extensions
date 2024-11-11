import { notification, whenReady, threads, provide, timeout } from 'extension'
import { ProviderDescritpor } from 'extension/protocol/common/provider'
import { lookup, unregisterProvider } from 'extension/protocol/node/provider'

const providerDescritpor: ProviderDescritpor = {
    category: 'provider.songs',
    name: 'fsMediaCenter.songs',
    pipeName: 'fsMediaCenter.songs',
}

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

    timeout(async () => {
        console.log(await lookup({ category: providerDescritpor.category }))
    }, 1000)
})

provide('beforeDisable', () => {
    threads.killThread('songs')
    unregisterProvider(providerDescritpor)
})