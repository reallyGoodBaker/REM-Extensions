const resolve = require('@rollup/plugin-node-resolve')
const typescript = require('@rollup/plugin-typescript')
const commonjs = require('@rollup/plugin-commonjs')
const fs = require('fs/promises')
const path = require('path')
const { rollup } = require('rollup')
const Bundler = require('parcel-bundler')
const { existsSync } = require('fs')

async function getManifest(folder) {
    return JSON.parse(
        await fs.readFile(path.join(folder, 'manifest.json'))
    )
}

const requires = [
    'name', 'ver', 'components', 'id'
]

function checkRequires(manifest) {
    const keys = Object.keys(manifest)
    if (new Set(keys.concat(requires)).size !== keys.length) {
        throw new Error('Manifest is missing required fields')
    }

    if (typeof manifest.name !== 'string') {
        throw new Error('Manifest name is not a string')
    }

    if (typeof manifest.ver !== 'string') {
        throw new Error('Manifest version is not a string')
    }

    if (!Array.isArray(manifest.components)) {
        throw new Error('Manifest components is not an string array')
    }

    if (typeof manifest.id !== 'string') {
        throw new Error('Manifest id is not a string')
    }
}

let plugins
async function getPlugins() {
    if (plugins) {
        return plugins
    }
    return plugins = JSON.parse(await fs.readFile(path.join(__dirname, '../../index.json')))
}

function getPath(filename) {
    if (existsSync(filename)) {
        return filename
    }

    const tsPath = filename.replace('.js', '.ts')
    if (existsSync(tsPath)) {
        return tsPath
    }

    return filename
}

async function tasks(sourcemap=true) {
    const cpy = await import('cpy')

    /**@type {any[]}*/
    const plugins = await getPlugins()
    const tasks = []
    for (const plugin of plugins) {
        const src = path.join(__dirname, '../../src', plugin)
        const manifest = await getManifest(src)

        checkRequires(manifest)
        
        const buildDest = path.join(__dirname, '../../build', plugin)
        const { entry, uiEntry, settings, windows, components } = manifest

        await fs.rm(buildDest, { recursive: true, force: true })
        await cpy.default([src + '/**/*.json'], buildDest)
        await cpy.default([src + '/node_modules/**/*'], path.join(buildDest, 'node_modules'))

        if (entry) {
            tasks.push({
                input: getPath(path.join(src, entry)),
                output: {
                    file: path.join(buildDest, `${entry}`),
                    format: 'cjs',
                    sourcemap
                },
                plugins: [
                    typescript(),
                ],
            })
        }

        if (uiEntry) {
            tasks.push({
                input: getPath(path.join(src, uiEntry)),
                output: {
                    file: path.join(buildDest, `${uiEntry}`),
                    format: 'esm',
                    sourcemap
                },
                plugins: [
                    typescript(),
                ],
            })   
        }

        if (settings) {
            tasks.push({
                input: getPath(path.join(src, settings)),
                output: {
                    file: path.join(buildDest, `${settings}`),
                    format: 'esm',
                    sourcemap
                },
                plugins: [
                    typescript(),
                ],
            })   
        }

        if (windows) {
            if (!components.includes('new_window')) {
                console.warn(`Did you forget to add 'new_window' to the components?`)
            } else {
                for (const [ _, { main, renderer } ] of Object.entries(windows)) {
                    main && tasks.push({
                        input: getPath(path.join(src, main)),
                        output: {
                            file: path.join(buildDest, `${main}`),
                            format: 'cjs',
                            sourcemap
                        },
                        plugins: [
                            typescript(),
                        ]
                    })

                    const name = path.basename(renderer)
                    const dir = path.dirname(renderer)

                    const bundler = new Bundler([ path.join(src, renderer) ], {
                        logLevel: 3,
                        watch: false,
                        outDir: path.join(buildDest, dir),
                        outFile: name,
                        cache: false,
                        hmr: false,
                        autoInstall: false,
                        target: 'electron',
                        sourceMaps: sourcemap,
                        publicUrl: './',
                    })

                    await bundler.bundle()
                }
            }
        }
    }

    return tasks
}

/**
 * @param {boolean} sourcemap 
 * @param {(done: number, total: number) => void} cb 
 */
async function buildSource(sourcemap=true, cb=Function.prototype) {
    let i = 0
    const _tasks = await tasks(sourcemap)
    for (const task of _tasks) {
        const build = await rollup(task)
        await build.write(task.output)
        build.close()
        cb.call(undefined, ++i, _tasks.length)
    }
}

module.exports = {
    tasks, buildSource, getPlugins,
}