import { BrowserWindow, screen, ipcMain } from "electron"

const { width, height } = screen.getPrimaryDisplay().bounds

export function onReady(bw: BrowserWindow) {
    bw.setAlwaysOnTop(true, 'screen-saver')
    bw.setVisibleOnAllWorkspaces(true)
    bw.setBounds({
        x: width / 2 - 360,
        y: height - 140
    })

    ipcMain.handle('desktop-lyrics-lock', (_, setTo) => {
        if (typeof setTo === 'boolean') {
            return bw.setIgnoreMouseEvents(setTo)
        }
    })
}

export function onClose() {
    ipcMain.removeHandler('desktop-lyrics-lock')
}