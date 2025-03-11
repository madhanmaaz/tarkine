const path = require("path")
const fs = require("fs")

const dataFormatter = require("./dataFormatter")
const registers = require("./registers")
const compiler = require("./compiler")
const helpers = require("./helpers")

function alterFilePath(filePath) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        return path.resolve(path.join(filePath, `/index.${helpers.ext}`))
    }

    return filePath = !path.extname(filePath)
        ? `${filePath}.${helpers.ext}`
        : filePath
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
        $: registers.regStore,
        include: include.bind(null, '')
    }

    const func = new Function(
        Object.keys(dataOptions).join(','),
        compiler.compile(template)
    )

    return func.call(dataFormatter, ...Object.values(dataOptions))
}

function renderFile(filePath, data = {}) {
    const dataOptions = {
        ...data,
        $: registers.regStore,
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

    return func.call(dataFormatter, ...Object.values(dataOptions))
}

module.exports = {
    render,
    renderFile,
    register: registers.register,
    compile: compiler.compile,
    resetCache: helpers.caches.reset,
}