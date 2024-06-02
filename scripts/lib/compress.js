const compressing = require('compressing')
const fs = require('fs')
const path = require('path')

const dist = path.join(__dirname, '../../dist')
const build = path.join(__dirname, '../../build')

async function tar(name) {
    if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist)
    }

    await compressing.tar.compressDir(
        path.join(build, name),
        path.join(dist, name + '.tar')
    )
}

module.exports = {
    tar,
}