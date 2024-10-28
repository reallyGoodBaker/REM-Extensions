const { subscribe, connect } = window
const player = connect('player-controller')
const lyricServer = connect('lyric')

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

function getLineIndex(lrc: Lyric[], time: number): [number, number] {
    const lrclen = lrc.length

    if (time >= lrc.at(-1)!.time) {
        return [ lrclen - 2, lrclen - 1 ]
    }

    let prev: Lyric = lrc[0]
    for (let i = 1; i < lrclen; i++) {
        const cur = lrc[i]

        if (cur.time > time) {
            return [ i - 1, i ]
        }

        prev = cur
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

            const [ $, m, s, rad ] = /(\d+):(\d+)\.(\d+)/g.exec(time.slice(1)) as string[]
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

function renderLines(time: number) {
    if (!lrc) return
    const [ l1, l2 ] = getLineIndex(lrc, time)
    if (lrc && l1 % 2) {
        lineBottom.classList.add('focus')
        lineTop.classList.remove('focus')
        lineBottom.innerText = lrc[l1].lyric
        lineTop!.innerText = lrc[l2].lyric
    } else {
        lineTop.classList.add('focus')
        lineBottom.classList.remove('focus')
        lineTop.innerText = lrc![l1].lyric
        lineBottom.innerText = lrc![l2].lyric
    }
}


subscribe('player', loadLyrics)
subscribe('playstate', ([ ,,, current ]) => {
    renderLines(current * 1000)
})

loadLyrics()

