import net from 'net'

interface InvokerServer {
    on(channel: string, listener: (...args: any[]) => void): void
    handle(channel: string, listener: (...args: any[]) => void): void
}

interface Win {
    beforeClose: () => void,
    init: (winId: number) => void,
}

declare global {
    interface Window {
        readonly win: Win
        readonly contextBridge: Electron.ContextBridge
        readonly ipcRenderer: Electron.IpcRenderer
        readonly webFrame: Electron.WebFrame
        readonly webUtils: Electron.WebUtils

        readonly server: (name: string, listener?: (socket: net.Socket) => void) => void
        readonly connect: (name: string) => net.Socket
        readonly invoke: (socket: net.Socket, data: string | Uint8Array) => Promise<any>
        readonly subscribe: (type: string, receiver?: (val: any) => void) => net.Socket
        readonly unlink: (name: string) => void

        readonly invoker: InvokerServer
    }
}