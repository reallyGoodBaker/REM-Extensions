import { ipcRenderer } from "electron"

const { subscribe, connect } = window
const player = connect('player-controller')
const lyricServer = connect('lyric')
const settings = connect('settings')

interface Lyric {
    time: number
    lyric: string
}

let lrc: Lyric[] | null
let romalrc: Lyric[] | null
let tlrc: Lyric[] | null

async function loadLyrics() {
    const audioData = await player.invoke('.audioData')
    const {
        lrc: l, romalrc: r, tlrc: t
    } = await lyricServer.invoke(audioData.id + '')

    lrc = parseLrc(l?.lyric)
    romalrc = parseLrc(r?.lyric)
    tlrc = parseLrc(t?.lyric)
}

function getLineIndex(lrc: Lyric[], time: number): [ number, number? ] {
    const lrclen = lrc.length

    if (time >= lrc.at(-1)!.time) {
        return [ lrclen - 1 ]
    }

    for (let i = 1; i < lrclen; i++) {
        const cur = lrc[i]

        if (cur.time > time) {
            return [ i - 1, i ]
        }
    }

    return [ lrclen - 2, lrclen - 1 ]
}

function parseLrc(lrcstr: string): Lyric[] | null {
    if (!lrcstr) {
        return null
    }

    return lrcstr.split('\n').map(
        line => {
            const [ time, lyric ] = line.split(']')
            if (!time || !lyric) {
                return {
                    time: 0,
                    lyric: ''
                }
            }

            const [ _, m, s, rad ] = /(\d+):(\d+)\.(\d+)/g.exec(time.slice(1)) as string[]
            return {
                time: Number(s) * 1000 + Number(m) * 60 * 1000 + Number(rad),
                lyric
            }
        }
    ).filter(
        line => line.lyric.trim()
    )
}

const lineTop = document.getElementById('top') as HTMLDivElement
const lineBottom = document.getElementById('bottom') as HTMLDivElement
const setLock = lock()

async function renderLines(time: number) {
    if (!lrc) return
    const [ l1, l2 ] = getLineIndex(lrc, time)
    let current, next
    if (lrc && l1 % 2) {
        current = lineBottom
        next = lineTop
    } else {
        current = lineTop
        next = lineBottom
    }

    current.classList.add('focus')
    next.classList.remove('focus')
    current.innerText = lrc![l1].lyric
    next.innerText = l2 ? lrc![l2].lyric : ' '

    const { colorCurrent, colorNext, fontSize, lock } = JSON.parse(await settings.invoke('["get"]'))
    current.style.color = colorCurrent
    next.style.color = colorNext
    current.style.fontSize = fontSize
    next.style.fontSize = fontSize

    if (setLock(lock)) {
        document.body.classList[!lock ? 'add' : 'remove']('unlock')   
    }
}

function lock() {
    let lockState = true
    return (newState: boolean) => {
        if (newState !== lockState) {
            ipcRenderer.invoke('desktop-lyrics-lock', lockState = newState)
            return true
        }

        return false
    }
}

subscribe('player', loadLyrics)
subscribe('playstate', ([ ,,, current ]) => {
    renderLines(current * 1000)
})

loadLyrics()