import { TextField, ToggleField } from "extension/ui/index"

const lyricsExtensionSettings = {
    currentFontSize: 'x-large',
    nextFontSize: 'larger',
    showRomaLyric: false,
    showTranslatedLyric: false,
}

/**@type {UIExports.OnSetting}*/
export async function onSetting(store) {
    const settings = await store.get()
    if (!settings) {
        store.set(lyricsExtensionSettings)
    } else {
        Object.assign(lyricsExtensionSettings, settings)
    }

    return [
        TextField(
            '当前歌词字体大小',
            lyricsExtensionSettings.currentFontSize,
            'currentFontSize'
        ),
        TextField(
            '下一句歌词字体大小',
            lyricsExtensionSettings.nextFontSize,
            'nextFontSize'
        ),
        ToggleField(
            '显示罗马音',
            lyricsExtensionSettings.showRomaLyric,
            'showRomaLyric'
        ),
        ToggleField(
            '显示中文翻译',
            lyricsExtensionSettings.showTranslatedLyric,
            'showTranslatedLyric'
        )
    ]
}

/**
 * @type {UIExports.OnSetSetting}
 */
export async function onSetSetting(store, name, value) {
    const data = await store.get()
    data[name] = value
    store.set(data)
}

/**
 * @type {UIExports.OnGetSetting}
 */
export async function onGetSetting(store, name) {
    return (await store.get())[name]
}