import { BrowserWindow, screen, ipcMain } from "electron"

const { width, height } = screen.getPrimaryDisplay().bounds

export function onReady(bw: BrowserWindow) {
    bw.setAlwaysOnTop(true, 'screen-saver')
    bw.setVisibleOnAllWorkspaces(true)

    bw.setBounds({
        x: width / 2 - 300,
        y: height - 140
    })

    let dragMode = false
    ipcMain.on('dragMode', () => {
        // let last = screen.getCursorScreenPoint()
        // const looper = () => setImmediate(() => {
        //     const [ x, y ] = bw.getPosition()
        //     const current = screen.getCursorScreenPoint()
        //     bw.setPosition(x + current.x - last.x, y + current.y - last.y)
        //     last = current

        //     if (!dragMode) return
        //     looper()
        // })

        // looper()
    })

    ipcMain.on('exitDragMode', () => {
        dragMode = false
    })
}

export function onClose() {
    ipcMain.removeAllListeners('dragMode')
    ipcMain.removeAllListeners('exitDragMode')
}