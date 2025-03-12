const path = require("path")
const fs = require("fs")

const dataFormatter = require("./dataFormatter")
const compiler = require("./compiler")
const helpers = require("./helpers")
const store = require("./store")

function alterFilePath(filePath) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        return path.resolve(path.join(filePath, `/index.${helpers.ext}`))
    }

    return path.extname(filePath)
        ? filePath
        : path.format({
            dir: path.dirname(filePath),
            name: path.basename(filePath),
            ext: `.${helpers.ext}`
        })
}

function include(parentFilePath, includeReference, data = {}) {
    const filePath = alterFilePath(path.resolve(path.dirname(parentFilePath), includeReference))

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
    }

    return function __includeRenderer__() {
        return renderFile(filePath, data)
    }
}

function render(template, data = {}) {
    const dataOptions = {
        ...data,
        $: store.getAll(),
        include: include.bind(null, '')
    }

    let func = helpers.caches.get(template)
    if (!func) {
        func = new Function(
            Object.keys(dataOptions).join(','),
            compiler.compile(template)
        )
        helpers.caches.set(template, func)
    }

    return func.call(dataFormatter, ...Object.values(dataOptions))
}

function renderFile(filePath, data = {}, callback) {
    const dataOptions = {
        ...data,
        $: store.getAll(),
        include: include.bind(null, filePath)
    }

    let func = helpers.caches.get(filePath)
    if (!func) {
        const template = fs.readFileSync(filePath, "utf-8")
        func = new Function(
            Object.keys(dataOptions).join(','),
            compiler.compile(template)
        )
        helpers.caches.set(filePath, func)
    }

    const output = func.call(dataFormatter, ...Object.values(dataOptions))
    if (typeof callback === "function") {
        return callback(null, output)
    }

    return output
}

module.exports = {
    render,
    renderFile,
    store,
    compile: compiler.compile,
    resetCache: helpers.caches.clear,
}