module.exports = {
    ext: "html",
    openDelimiter: "{{",
    closeDelimiter: "}}",
    caches: {
        __store: Object.create(null),
        set(key, value) {
            this.__store[key] = value
            return value
        },
        get(key) {
            return this.__store[key]
        },
        reset() {
            this.__store = {}
            return this.__store
        }
    },
    escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },
    createErrorSnippet(template, errLine) {
        const lines = template.split('\n')

        return lines.map((line, index) => {
            index = index + 1
            const tag = errLine == (index) ? '>>' : '  '
            return `${tag} ${index}| ${line}`
        }).slice(
            Math.max(0, errLine - 5),
            Math.min(lines.length, errLine + 5)
        ).join('\n')
    },
    throwError(name, error, fileName, template, line) {
        const errSnippet = this.createErrorSnippet(template, line)
        const err = new Error(
            `${error.message}\nFILE: ${!fileName ? "CODE" : fileName}\n${errSnippet}\n`
        )
        err.name = name
        return err
    }
}