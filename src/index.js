const path = require("path")
const fs = require("fs")

const dataFormatter = require("./dataFormatter")
const compiler = require("./compiler")
const helpers = require("./helpers")
let registers = {}

function register(obj) {
    if (typeof obj !== "object" || obj === null) {
        console.warn("Warning: register expects a non-null object")
        return
    }

    registers = { ...registers, ...obj }
}

function alterFilePath(filePath) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        return path.resolve(path.join(filePath, `/index.${helpers.ext}`))
    }

    return filePath = !path.extname(filePath) ? `${filePath}.${helpers.ext}` : filePath
}

function include(parentFilePath, includeReference, data = {}) {
    const filePath = alterFilePath(path.resolve(path.dirname(parentFilePath), includeReference))

    if (!fs.existsSync(filePath)) {
        throw helpers.throwError("IncludeError", new Error(`File not found: ${includeReference}`), parentFilePath, '', 0)
    }

    return function __includeRenderer__() {
        return renderFile(filePath, data)
    }
}

function render(template, data = {}, callback) {
    const dataOptions = {
        ...registers,
        ...data,
        include: include.bind(null, ''),
        ...dataFormatter,
    }

    const func = new Function(Object.keys(dataOptions).join(','), compiler.compile(template, ''))
    const output = func(...Object.values(dataOptions))

    if (typeof callback === "function") {
        if (typeof output === "string") {
            callback(null, output)
        } else {
            callback(
                helpers.throwError("RenderError", output.error, '', output.template, output.l),
                null
            )
        }

        return
    }

    if (typeof output === "string") {
        return output
    }

    throw helpers.throwError("RenderError", output.error, '', output.template, output.l)
}

function renderFile(filePath, data = {}, callback) {
    filePath = alterFilePath(filePath)
    const dataOptions = {
        ...registers,
        ...data,
        include: include.bind(null, filePath),
        ...dataFormatter,
    }

    let func = helpers.caches.get(filePath)
    if (!func) {
        const template = fs.readFileSync(filePath, "utf-8")
        func = new Function(Object.keys(dataOptions).join(','), compiler.compile(template, filePath))
        helpers.caches.set(filePath, func)
    }

    const output = func(...Object.values(dataOptions))

    if (typeof callback === "function") {
        if (typeof output === "string") {
            callback(null, output)
        } else {
            callback(
                helpers.throwError("RenderError", output.error, filePath, output.template, output.l),
                null
            )
        }

        return
    }

    if (typeof output === "string") {
        return output
    }

    throw helpers.throwError("RenderError", output.error, '', output.template, output.l)
}

module.exports = {
    render,
    renderFile,
    register,
    compile: compiler.compile,
    resetCache: helpers.caches.reset,
}