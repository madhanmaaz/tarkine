module.exports = {
    ext: "html",
    caches: new Map(),
    replaceVoidAttributes(html) {
        const voidAttributesPattern = /\s+(checked|disabled|readonly|required|autofocus|multiple|selected|hidden|open|ismap|defer|async|novalidate|formnovalidate|allowfullscreen|itemscope|reversed|autoplay|controls|loop|muted|default)\s*=\s*"([^"]*?)"/g
        return html.replace(voidAttributesPattern, (match, attr, value) => {
            return ` {{:if(${value})}}${attr}{{/if}}`
        })
    }
}