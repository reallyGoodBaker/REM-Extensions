const fs = require('fs')
const path = require('path')
const matcher = /import[\s\S]+?from\s+?((?:'extension.*?')|(?:"extension.*?")|(?:`extension.*?`))/g

function addSuffix(filePath) {
    if (filePath.endsWith('.js')) {
        return filePath
    }

    const br = filePath[filePath.length - 1]
    return filePath.slice(0, -1) + '.js' + br
}

function rewriteImport(root, name) {
    const filePath = path.join(root, name)
    const str = fs.readFileSync(filePath).toString()
    const relativePath = path.relative(filePath, root)

    const rewrited = str.replace(matcher, ($0, $1) => {
        return $0.replace(
            $1,
            addSuffix(
                $1.replace(
                    'extension',
                    path.join(relativePath, '../node_modules/extension'))
            )
        ).replaceAll('\\', '/')
    })

    fs.writeFileSync(filePath, rewrited)
}

function rewritePlugin(root, name) {
    return {
        name: 'rewrite-import',
        writeBundle: {
			sequential: true,
			order: 'post',
			async handler() {
                rewriteImport(root, name)
			}
		}
    }
}

module.exports = {
    rewriteImport, rewritePlugin,
}