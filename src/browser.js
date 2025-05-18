const compiler = require("./compiler")
const helpers = require("./helpers")
const store = require("./store")

const emptyInclude = () => ''

function render(template, data = {}, includeCallback) {
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

    const include = typeof includeCallback === "function"
        ? includeCallback
        : emptyInclude

    const output = func(
        store.getAll(),
        helpers.__show,
        helpers.__loop,
        include,
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

    return output
}

module.exports = {
    render,
    store,
    ext: helpers.ext,
    compile: compiler.compile,
    resetCache: helpers.caches.clear,
}