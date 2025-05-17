module.exports = {
    ext: "tark",
    caches: new Map(),
    alterVoidAttributes(template) {
        const openingTagPattern = /<(?!!\/)([^\/!\s>][^>]*)>/g
        const voidPattern = /\s+(checked|disabled|readonly|required|autofocus|multiple|selected|hidden|open|ismap|defer|async|novalidate|formnovalidate|allowfullscreen|itemscope|reversed|autoplay|controls|loop|muted|default)\s*=\s*"([^"]*?)"/gi

        return template.replace(openingTagPattern, (tag) => {
            return tag.replace(voidPattern, (match, attr, value) => {
                return ` {{:if(${value})}}${attr}{{/if}}`
            })
        })
    },
    createErrorSnippet(template, errLine) {
        const lines = template.split('\n')

        return lines.map((line, index) => {
            const current = index + 1
            const tag = errLine == current ? '>>' : '  '
            return `${tag} ${current}| ${line}`
        }).slice(
            Math.max(errLine - 3, 0),
            Math.min(lines.length, errLine + 3)
        ).join('\n')
    },
    throwError(name, filePath, message, line, template) {
        const err = new Error()
        err.name = name
        err.message = `${message}\nSOURCE: ${filePath ? filePath : "CODE"}\n${this.createErrorSnippet(template, line)}\n`
        throw err
    },
    __show(data) {
        // Return an empty string if the data is null, undefined or false.
        if (data == null || data === false) return ''
        const escapeChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        }

        return String(data).replace(/[&<>"']/g, char => escapeChars[char])
    },
    __loop(data) {
        if (!data || typeof data !== "object") {
            throw new TypeError(`Expected array or object for loops, but received ${typeof data}`)
        }

        return Array.isArray(data)
            ? data.map((value, index) => [index, value])
            : Object.entries(data)
    }
}