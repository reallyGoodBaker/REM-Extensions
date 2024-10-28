import { TextField } from 'extension/ui/index'

const defaultSettings = {
    colorCurrent: 'gold',
    colorNext: 'aquamarine',
    fontSize: 'x-large',
}

const i18nZhCN = {
    colorCurrent: '正在播放的歌词颜色',
    colorNext: '未播放的歌词颜色',
    fontSize: '歌词字体大小',
}

export const onSetting: UIExports.OnSetting = async settings => {
    return Object.entries(defaultSettings)
        .map(([ k, v ]) => TextField((i18nZhCN as any)[k], v, k))
}

export const onSetSetting: UIExports.OnSetSetting = async (store, name, value) =>
    store.set({ ...await store.get(), [name]: value })

export const onGetSetting: UIExports.OnGetSetting = async (store, name) =>
    (await store.get())[name]