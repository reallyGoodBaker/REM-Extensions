import { TextField, NumberField } from 'extension/ui/index'

export const onSetting: UIExports.OnSetting = () => {
    return [
        TextField('写着玩的'),
        NumberField('也是写着玩的')
    ]
}