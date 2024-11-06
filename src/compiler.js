const helpers = require("./helpers")
const attributeModifier = require("./attributeModifier")

const delimiterPattern = helpers.escapeRegExp(helpers.openDelimiter) +
    "\\s*([~#-=/]|define\\s*|for\\s*\\(|if\\s*\\(|else)?\\s*([\\s\\S]*?)\\s*" +
    helpers.escapeRegExp(helpers.closeDelimiter)

const timeStore = {
    ifStart: false,
    forStart: false,
    defineStart: false,
    resetStore() {
        this.ifStart = false
        this.forStart = false
        this.defineStart = false
    }
}

function handleDirective(type, content) {
    switch (type) {
        case '/': {// close brackets
            if (timeStore.ifStart || timeStore.forStart) {
                timeStore.ifStart = false
                timeStore.forStart = false
                return "}\n;"
            }

            if (timeStore.defineStart) {
                timeStore.defineStart = false
                return "return function __includeRenderer__() {return __out;};}\n;"
            }
        }

        // define block
        case "define":
            timeStore.defineStart = true
            return `function ${content} {\nlet __out ='';\n`

        // loops
        case "for (":
        case "for(": {
            timeStore.forStart = true
            const [variables, data] = content.slice(0, -1).split(" in ")
            const [key, value] = variables.split(",")

            return `for(const [${value || '_'}, ${key}] of $$formatLoop(${data})){\n`
        }

        // conditions
        case "if(":
        case "if (":
            timeStore.ifStart = true
            return `if(${content}{\n`
        case "else":
            timeStore.ifStart = true
            return content.startsWith("if") ? `} else ${content}{\n` : "} else {\n"

        case '#': // comment
            return ''

        case '~': // Code (for direct JavaScript execution)
            return `${content};\n`

        case "-": // No-escape HTML output
            return `__out += $$display(${content});\n`

        case '=': // Fully escaped HTML output
            return `__out += $$escapeHTML(${content});\n`

        default: // escaped HTML output
            return `__out += $$displayX(${content});\n`
    }
}

function generate(template, errorStore) {
    const regex = new RegExp(delimiterPattern, 'g')
    let code = 'let __out = "";'
    let cursor = 0
    let line = 1
    let match

    while ((match = regex.exec(template)) !== null) {
        const beforeMatch = template.slice(cursor, match.index)
        if (beforeMatch) {
            code += `__out += ${JSON.stringify(beforeMatch)};\n`
        }

        line += (beforeMatch.match(/\n/g) || []).length

        const type = match[1] ? match[1].trim() : match[1]
        const content = match[2].trim()

        code += `__err.l = ${line};\n`
        errorStore.line = line

        const directiveCode = handleDirective(type, content)
        if (directiveCode) {
            code += directiveCode
        }

        cursor = regex.lastIndex
    }

    code += `__out += ${JSON.stringify(template.slice(cursor))};\nreturn __out;`

    return `
    const __err = { l: 0 }; 
    try { ${code} } 
    catch(error) {
        __err.error = error;
        __err.template = ${JSON.stringify(template)}
        return __err; 
    }`
}

function compile(template) {
    const errorStore = { line: 0 }
    timeStore.resetStore()

    try {
        return generate(attributeModifier.modify(template), errorStore)
    } catch (error) {
        throw helpers.throwError("TemplateCompileError", error, filePath, template, errorStore.line)
    }
}

module.exports = {
    compile
}