import { BrowserWindow, screen } from "electron"

const { width, height } = screen.getPrimaryDisplay().bounds

export function onReady(bw: BrowserWindow) {
    bw.setAlwaysOnTop(true, 'screen-saver')
    bw.setVisibleOnAllWorkspaces(true)

    bw.setBounds({
        x: width / 2 - 230,
        y: height - 120
    })
}