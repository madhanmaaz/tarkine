function isIncluder(data) {
    return typeof data === "function" && data.name === "__includeRenderer__"
}

function escapeHTML(data) {
    // Return an empty string if the data is null, undefined or false.
    if (data == null || data === false) return ''

    if (isIncluder(data)) {
        data = data()
    }

    const escapeChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }

    return String(data).replace(/[&<>"']/g, char => escapeChars[char])
}

module.exports = {
    escapeF: escapeHTML,
    show(data) {
        if (isIncluder(data)) {
            return data()
        }

        return escapeHTML(data)
    },
    formatLoop(data) {
        if (!data || typeof data !== "object") {
            throw new TypeError(`Expected array or object for loops, but received ${typeof data}`)
        }

        return Array.isArray(data)
            ? data.map((value, index) => [index, value])
            : Object.entries(data)
    }
}