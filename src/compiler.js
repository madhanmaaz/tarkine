const helpers = require("./helpers")

function handleDirective(type, content) {
    switch (type) {
        case ":macro": {
            return `function ${content} {const __out = [];`
        }

        case "/macro": {
            return `return __out.join('');}`
        }

        case ":extends": {
            return `__out.push(include(${content}, (function () {const __slots = {};`
        }

        case "/extends": {
            return `return __slots;})()));`
        }

        case ":slot": {
            return `__slots[${content}] = (function (){const __out = [];`
        }

        case "/slot": {
            return `return __out.join('');})();`
        }

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
    const regex = /\{\{(#|-|~|\/if|\/for|\/macro|\/extends|\/slot|:if|:else|:for|:macro|:extends|:slot)?\s*([\s\S]*?)\s*\}\}/g
    const code = ['const __out = [];']
    let cursor = 0
    let line = 1
    let match

    while ((match = regex.exec(template)) !== null) {
        const beforeMatch = template.slice(cursor, match.index)
        if (beforeMatch) {
            code.push(`__out.push(${JSON.stringify(beforeMatch)});`)
        }

        const type = match[1] ? match[1].trim() : match[1]
        const content = match[2].trim()

        // debug line mark
        line += (beforeMatch.match(/\n/g) || []).length
        code.push(`__err.l = ${line};`)

        const directiveCode = handleDirective(type, content)
        if (directiveCode) {
            code.push(directiveCode)
        }

        if (match[0].includes("\n")) {
            line += (match[0].match(/\n/g) || []).length
        }

        cursor = regex.lastIndex
    }

    code.push(`__out.push(${JSON.stringify(template.slice(cursor))}); return __out.join('');`)
    return `const __err = { l: 0 }; try { ${code.join('')} } catch(e) {__err.e = e.message; return __err;}`
}

function compile(template) {
    return generate(helpers.alterVoidAttributes(template))
}

module.exports = {
    compile
}