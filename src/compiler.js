const helpers = require("./helpers")

function handleDirective(type, content) {
    switch (type) {
        case "/if": // close bracket
        case "/for":
            return '}'

        case ":for": {// loop
            const [variables, data] = content.split(" in ")
            const [value, key = '__index'] = variables.split(",")

            return `for(const [${key}, ${value}] of __loop(${data})){`
        }

        case ":if": // conditions
            return `if(${content}){`

        case ":else":
            return content.startsWith("if ")
                ? `} else if(${content.slice(3)}){`
                : "} else {"

        case '#': // comment
            return ''

        case '-': // No-escape HTML output
            return `__out.push(${content});`

        case "~":  // Code (for direct JavaScript execution)
            return `${content};`

        default: // escaped HTML output
            return `__out.push(__show(${content}));`
    }
}

function generate(template) {
    const regex = /\{\{\s*(#|-|~|\/if|\/for|:if|:else|:for)?\s*([\s\S]*?)\s*\}\}/g
    let code = 'const __out = [];'
    let cursor = 0
    let line = 1
    let match

    while ((match = regex.exec(template)) !== null) {
        const beforeMatch = template.slice(cursor, match.index)
        if (beforeMatch) {
            code += `__out.push(${JSON.stringify(beforeMatch)});`
        }

        const type = match[1] ? match[1].trim() : match[1]
        const content = match[2].trim()

        // debug line mark
        line += (beforeMatch.match(/\n/g) || []).length
        code += `__err.l = ${line};`

        const directiveCode = handleDirective(type, content)
        if (directiveCode) {
            code += directiveCode
        }

        if (match[0].includes("\n")) {
            line += (match[0].match(/\n/g) || []).length
        }

        cursor = regex.lastIndex
    }

    code += `__out.push(${JSON.stringify(template.slice(cursor))}); return __out.join('');`
    return `const __err = { l: 0 }; try { ${code} } catch(e) {__err.e = e.message; return __err;}`
}

function compile(template) {
    return generate(helpers.alterVoidAttributes(template))
}

module.exports = {
    compile
}