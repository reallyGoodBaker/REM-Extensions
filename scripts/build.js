const { buildSource, getPlugins } = require('./lib/buildSource')
const { tar } = require('./lib/compress')

async function build() {
    await buildSource(false)
    const plugins = await getPlugins()

    plugins.forEach(tar)
}

build()