module.exports = {
    ext: "html",
    caches: {
        __store: new Map(),
        set(key, value) {
            this.__store.set(key, value)
            return value
        },
        get(key) {
            return this.__store.get(key)
        },
        reset() {
            this.__store.clear()
            return this.__store
        }
    },
    replaceVoidAttributes(html) {
        const voidAttributesPattern = /\s+(checked|disabled|readonly|required|autofocus|multiple|selected|hidden|open|ismap|defer|async|novalidate|formnovalidate|allowfullscreen|itemscope|reversed|autoplay|controls|loop|muted|default)\s*=\s*"([^"]*?)"/g
        return html.replace(voidAttributesPattern, (match, attr, value) => {
            return ` {{:if(${value}) }}${attr}{{/}}`
        })
    }
}