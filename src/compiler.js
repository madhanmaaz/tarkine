const helpers = require("./helpers")

function handleDirective(type, content) {
    switch (type) {
        case '/if':
        case '/for':
            return "};"

        // loop
        case ":for": {
            const [variables, data] = content.slice(1, -1).split(" in ")
            const [value, index = '__index'] = variables.split(",").map(v => v.trim())
            return `for(const [${index}, ${value}] of this.formatLoop(${data})){`
        }

        // condition
        case ":if":
            return `if${content}{`

        case ":else":
            return content.startsWith("if") ? `} else ${content}{` : "} else {"

        case '#': // comment
            return ''

        case '~': // Code (for direct JavaScript execution)
            return `${content};`

        case "-": // No-escape HTML output
            return `this.out += ${content};`

        case '=': // Fully escaped HTML output
            return `this.out += this.escapeF(${content});`

        default: // escaped HTML output
            return `this.out += this.show(${content});`
    }
}

function generate(template) {
    const regexPattren = /\{\{\s*(~|#|=|-|\/if|\/for|:for|:if|:else)?\s*([\s\S]*?)\s*\}\}/g
    let code = "this.out = '';"
    let cursor = 0
    let match

    while ((match = regexPattren.exec(template)) !== null) {
        const beforeMatch = template.slice(cursor, match.index)
        if (beforeMatch) {
            code += `this.out += ${JSON.stringify(beforeMatch)};`
        }

        const type = match[1] ? match[1].trim() : match[1]
        const content = match[2].trim()
        const directiveCode = handleDirective(type, content)
        if (directiveCode) {
            code += directiveCode
        }

        cursor = regexPattren.lastIndex
    }

    code += `this.out += ${JSON.stringify(template.slice(cursor))}; return this.out;`
    return code
}

function compile(template) {
    return generate(helpers.replaceVoidAttributes(template))
}

module.exports = {
    compile
}