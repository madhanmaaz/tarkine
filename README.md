<p align="center">
    <img src="https://raw.githubusercontent.com/madhanmaaz/SaturJs/master/banner.jpg">
</p>

<p align="center">Tarkine is a powerful and flexible template engine for Node.js applications. It provides a simple syntax for creating dynamic HTML templates with various features like comments, escaping, conditionals, loops, includes, blocks, and code execution.</p>

[![npm version](https://img.shields.io/npm/v/tarkine.svg)](https://www.npmjs.com/package/tarkine)
[![Downloads](https://img.shields.io/npm/dm/tarkine.svg)](https://www.npmjs.com/package/tarkine)
[![License](https://img.shields.io/npm/l/tarkine.svg)](https://github.com/yourusername/tarkine/blob/main/LICENSE)

## Installation
```bash
npm install tarkine
```

### Usage
```js
const tarkine = require('tarkine');

const output = tarkine.renderFile("./template.html", {
    username: "John Doe",
    html: "<span>Some HTML</span>",
    status: true,
    array: [1, 2, 3],
    object: {
        username: "johndoe",
        age: 30
    },
});

console.log(output);
```

### Usage in expressjs:
```js
const tarkine = require("tarkine") // import
const express = require("express")
const app = express()


app.set("view engine", "html")
app.engine("html", tarkine.renderFile)

app.get("/", (req, res) => {
    res.render("index", {
        username: "tarkine"
    })
})

app.listen(3000)
```

## Syntax
- Comments
```js
{{# This is a comment }}
```

- Escaping
```js
{{ variable }} // Escaped output
{{- variable }} // Unescaped output
{{= variable }} // Fully escaped output (including includes)
```

- Conditionals
```js
{{ if(condition) }}
  // content
{{ else if(otherCondition) }}
  // content
{{ else }}
  // content
{{/}}
```

- Loops
```js
{{ for(value, index in array) }}
  // content
{{/}}

{{ for(value, key in object) }}
  // content
{{/}}
```

- Includes
```js
{{ include("./partial", { data: "value" }) }}
```

- Blocks
```js
{{define blockName(param1, param2) }}
  // block content
{{/}}

{{ blockName(arg1, arg2) }}
```

- Code Execution
```js
{{~
  // JavaScript code here
}}
```

- Attributes
```js
<div>
    <button disabled="isLoggedIn">Login</button>
    <button disabled="isLoggedIn === true">Login</button>
</div>
```