const { buildSource } = require('./lib/buildSource')
const { getAppDataPath } = require('appdata-path')
const { join } = require('path')
const fs = require('fs')
const fsp = require('fs/promises')
const index = require('../index.json')

const remPath = (...paths) => {
    return join(getAppDataPath('rem'), ...paths)
}

async function buildSourceAndSyncFiles() {
    await buildSource(false)

    const { default: cpy } = await import('cpy')
    const EXTENSION_ROOT = remPath('Data', 'Extensions')
    const targets = []
    if (process.argv.length > 2) {
        targets.push(...process.argv.slice(2))
    } else {
        targets.push(...await fsp.readdir(EXTENSION_ROOT))
    }

    targets.forEach(async dest => {
        if (!index.includes(dest)) {
            return
        }

        const source = join(__dirname, '../build', dest)
        const destPath = join(EXTENSION_ROOT, dest)

        if (fs.existsSync(destPath))
            await fsp.rm(destPath, { recursive: true })

        cpy(`${source}/**`, destPath)
    })
}

buildSourceAndSyncFiles()