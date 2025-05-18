const path = require("path")
const fs = require("fs")

const compiler = require("./compiler")
const helpers = require("./helpers")
const store = require("./store")

function alterFilePath(filePath) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        return path.resolve(path.join(filePath, `/index.${helpers.ext}`))
    }

    return path.extname(filePath)
        ? filePath
        : `${filePath}.${helpers.ext}`
}

function include(parentFilePath, includeReference, data) {
    const filePath = alterFilePath(path.resolve(path.dirname(parentFilePath), includeReference))

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
    }

    return renderFile(filePath, data)
}

function render(template, data = {}, callback) {
    let func = helpers.caches.get(template)
    if (!func) {
        try {
            func = new Function(
                `$,__show,__loop,include,{${Object.keys(data)}}`,
                compiler.compile(template)
            )

            helpers.caches.set(template, func)
        } catch (error) {
            throw new Error(`CompileError: ${error.message}\nSOURCE: CODE`)
        }
    }

    const output = func(
        store.getAll(),
        helpers.__show,
        helpers.__loop,
        include.bind(null, ''),
        data
    )

    if (typeof output !== "string") {
        helpers.throwError(
            "RenderError",
            null,
            output.e,
            output.l,
            template
        )
    }

    if (typeof callback === "function") {
        return callback(null, output)
    }

    return output
}

function renderFile(filePath, data = {}, callback) {
    let func = helpers.caches.get(filePath)
    if (!func) {
        const template = fs.readFileSync(filePath, "utf-8")

        try {
            func = new Function(
                `$,__show,__loop,include,{${Object.keys(data)}}`,
                compiler.compile(template)
            )

            helpers.caches.set(filePath, func)
        } catch (error) {
            throw new Error(`CompileError: ${error.message}\nSOURCE: ${filePath}`)
        }
    }

    const output = func(
        store.getAll(),
        helpers.__show,
        helpers.__loop,
        include.bind(null, filePath),
        data
    )

    if (typeof output !== "string") {
        const template = fs.readFileSync(filePath, "utf-8")
        helpers.throwError(
            "RenderError",
            filePath,
            output.e,
            output.l,
            template
        )
    }

    if (typeof callback === "function") {
        return callback(null, output)
    }

    return output
}

module.exports = {
    render,
    renderFile,
    store,
    ext: helpers.ext,
    compile: compiler.compile,
    caches: helpers.caches,
    resetCache: helpers.caches.clear,
}