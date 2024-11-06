function isArray(data) {
    return typeof data === "object" && Array.isArray(data)
}

function isObject(data) {
    return typeof data === "object" && !Array.isArray(data)
}

function isIncluder(value) {
    return typeof value === "function" && value.name === "__includeRenderer__"
}

function escapeHTML(value) {
    // Return an empty string if the value is null, undefined or false.
    if (value == null || value === false) return ''

    if (isIncluder(value)) {
        value = value()
    }

    const escapeChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }

    return String(value).replace(/[&<>"']/g, char => escapeChars[char])
}

module.exports = {
    $$escapeHTML: escapeHTML,
    $$display(value) {
        if (isIncluder(value)) {
            return value()
        }

        if (typeof value === "object") {
            return JSON.stringify(value)
        }

        return value
    },
    $$displayX(value) {
        if (isIncluder(value)) {
            return value()
        }

        if (typeof value === "object") {
            return escapeHTML(JSON.stringify(value))
        }

        return escapeHTML(value)
    },
    $$formatLoop(data) {
        if (isArray(data)) {
            return Object.entries(data).map(e => {
                e[0] = parseInt(e[0])
                return e
            })
        } else if (isObject(data)) {
            return Object.entries(data)
        } else {
            throw new TypeError(`Expected array or object for loops, but received ${typeof data}`)
        }
    },
}