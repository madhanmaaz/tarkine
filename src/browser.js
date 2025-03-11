const dataFormatter = require("./dataFormatter")
const registers = require("./registers")
const compiler = require("./compiler")
const helpers = require("./helpers")

function render(template, data = {}, callback) {
    const dataOptions = {
        ...data,
        $: registers.regStore,
        include: (filePath, data) => {
            if (typeof callback !== "function") return ''
            return callback(filePath, data)
        },
    }

    let func = helpers.caches.get(template)
    if (func == undefined) {
        func = new Function(
            Object.keys(dataOptions).join(','),
            compiler.compile(template)
        )

        helpers.caches.set(template, func)
    }

    return func.call(
        dataFormatter,
        ...Object.values(dataOptions)
    )
}

module.exports = {
    render,
    compile: compiler.compile,
    register: registers.register,
    resetCache: helpers.caches.reset,
}