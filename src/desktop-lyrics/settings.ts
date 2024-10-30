import { fromObject } from 'extension/ui/index'

const defaultSettings = {
    colorCurrent: 'gold',
    colorNext: 'aquamarine',
    fontSize: 'x-large',
    lock: false,
}

const i18nZhCN = {
    colorCurrent: '正在播放的歌词颜色',
    colorNext: '未播放的歌词颜色',
    fontSize: '歌词字体大小',
    lock: '歌词锁定',
}

export const onSetting: UIExports.OnSetting = async settings =>
    fromObject(await settings.get(defaultSettings), i18nZhCN)

export const onSetSetting: UIExports.OnSetSetting = async (store, name, value) =>
    store.set({ ...await store.get(defaultSettings), [name]: value })

export const onGetSetting: UIExports.OnGetSetting = async (store, name) =>
    (await store.get(defaultSettings))[name]