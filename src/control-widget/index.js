const {
    whenReady, win, provide
} = require('extension/index')

let winId

const setup = async () => {
    winId = await win.openWindow('minimal-player', {
        width: 380,
        height: 140,
        alwaysOnTop: true,
        // visualEffectState: 'active',
        frame: false,
        // backgroundMaterial: 'none',
        transparent: true,
        maximizable: false,
        resizable: false,
        skipTaskbar: true,
    })
}

whenReady(setup)

provide('beforeDisable', () => {
    win.closeWindow(winId)
})