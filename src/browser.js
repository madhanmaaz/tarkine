const dataFormatter = require("./dataFormatter")
const compiler = require("./compiler")
const helpers = require("./helpers")
const store = require("./store")

function render(template, data = {}, callback) {
    const dataOptions = {
        ...data,
        $: store.getAll(),
        include: (filePath, data) => {
            if (typeof callback !== "function") return ''
            return callback(filePath, data)
        },
    }

    let func = helpers.caches.get(template)
    if (!func) {
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
    store,
    compile: compiler.compile,
    resetCache: helpers.caches.clear,
}