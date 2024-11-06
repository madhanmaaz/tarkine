const voidAttributes = [
    "checked", "disabled", "readonly", "required",
    "autofocus", "multiple", "selected", "hidden",
    "open", "ismap", "defer", "async", "novalidate",
    "formnovalidate", "allowfullscreen", "itemscope",
    "reversed", "autoplay", "controls", "loop", "muted", "default"
]

// Build a regex pattern to match void attributes
const voidAttributesPattern = new RegExp(
    `\\s+(${voidAttributes.join('|')})\\s*=\\s*"([^"]*?)"`,
    'gi'
)

function replaceVoidAttributes(html) {
    return html.replace(voidAttributesPattern, (match, attr, value) => {
        return ` {{ if(${value}) }}${attr}{{/}}`
    })
}

function modify(template) {
    template = replaceVoidAttributes(template)
    return template
}

module.exports = {
    modify
}
