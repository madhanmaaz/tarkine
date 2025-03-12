<p align="center">
    <img src="https://raw.githubusercontent.com/madhanmaaz/tarkine/master/banner.jpg">
</p>

<p align="center">Tarkine is a template engine for Node.js applications. It provides a simple syntax for creating dynamic HTML templates with various features like global store, comments, escaping, conditionals, loops, includes, and code execution.</p>

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
{{:if (condition) }}
  // content
{{:else if(otherCondition) }}
  // content
{{:else}}
  // content
{{/if}}
```

- Loops
```js
{{:for (value, index in array) }}
  // content
{{/for}}

{{:for (value, key in object) }}
  // content
{{/for}}
```

- Includes
```js
{{ include("./partial", { data: "value" }) }}
```

- Code Execution
```js
{{~
  // JavaScript code here
}}
```

- Void Attributes
```js
<div>
    <button disabled="isLoggedIn">Login</button>
    <button disabled="isLoggedIn === true">Login</button>
</div>
```

### Add Custom Data
- Global data can be registered and used across all templates:
```js
const tarkine = require('tarkine')

tarkine.store.set("default", { 
  siteName: 'My Website',
  description: "Global data can be registered and used across all templates."
})


// access: <title>{{ $.default.siteName }}</title>
```