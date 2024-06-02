import { TextField, ToggleField } from "../@lib/rem-extension/ui/settings.js"

const lyricsExtensionSettings = {
    currentFontSize: 'x-large',
    nextFontSize: 'larger',
    showRomaLyric: false,
    showTranslatedLyric: false,
}

export async function onSetting(safeStore) {
    const settings = await safeStore.get()
    if (!settings) {
        safeStore.set(lyricsExtensionSettings)
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

export async function onSetSetting(store, name, value) {
    const data = await store.get()
    data[name] = value
    store.set(data)
}

export async function onGetSetting(store, name) {
    return (await store.get())[name]
}