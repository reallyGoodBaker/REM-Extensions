const { buildSource } = require('./lib/buildSource')
const cliProgress = require('cli-progress')

const progressBar = new cliProgress.SingleBar({
    format: 'Progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: '\u2588', // █ 符号
    barIncompleteChar: '\u2591', // ░ 符号
    hideCursor: true, // 隐藏光标
})

buildSource(false, (done, total) => {
    // if (done === 1) {
    //     progressBar.start(total, 1)
    //     return
    // }

    // progressBar.update(done)

    // if (done === total) {
    //     progressBar.stop()
    //     return
    // }
})