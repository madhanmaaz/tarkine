<p align="center">
    <img src="https://raw.githubusercontent.com/madhanmaaz/tarkine/master/logo.webp" height="300">
</p>
<p align="center">
Tarkine - A lightweight and high-performance template engine for Node.js, designed for speed and simplicity.
</p>

[![npm version](https://img.shields.io/npm/v/tarkine.svg)](https://www.npmjs.com/package/tarkine)
[![Downloads](https://img.shields.io/npm/dm/tarkine.svg)](https://www.npmjs.com/package/tarkine)
[![License](https://img.shields.io/npm/l/tarkine.svg)](https://github.com/madhanmaaz/tarkine/blob/master/LICENSE)
[![VSCode](https://img.shields.io/badge/vscode-extension-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=madhanmaaz.tarkine-vscode-extension)

## Installation
```bash
npm install tarkine
```

### Usage
```js
const Tarkine = require('tarkine');

const output = Tarkine.renderFile("./template.tark", {
    username: "John Doe",
    html: "<span>Some HTML</span>",
    status: true
});

console.log(output);
```

### Usage in expressjs:
```js
const Tarkine = require("tarkine") // import
const express = require("express")
const app = express()


app.set("view engine", Tarkine.ext) // .tark files
app.engine(Tarkine.ext, Tarkine.renderFile)

app.get("/", (req, res) => {
    res.render("index", {
        username: "tarkine"
    })
})

app.listen(3000)
```

### Usage in hono:
```js
import { Hono } from "hono"
import { honoRenderer } from "tarkine"

const app = new Hono()

app.use(honoRenderer({
    views: "./views"
}))

app.get("/", (c) => {
    c.render("index", {
        username: "tarkine"
    })
})
```

## Syntax
- Comments
```js
{{# This is a comment }}
```

- Expression
```js
{{ variable }} // Escaped output
{{- variable }} // Unescaped output
```

- Conditionals
```js
<!-- condition -->
{{:if status }}
  // content
{{:else if status == 0 }}
  // content
{{:else}}
  // content
{{/if}}
```

- Loops
```js
<!-- loops -->
{{:for value, index in array }}
  // content
{{/for}}

{{:for value, key in object }}
  // content
{{/for}}
```

- Includes
```js
{{- include("./header", { links: ["home", "code", "about"] }) }}
```

- Code Execution
```js
{{~
  // JavaScript code here
}}
```

- Conditionals Void Attributes
```js
<div>
    <button disabled="isLoggedIn">Login</button>
    <button disabled="isLoggedIn === true">Login</button>
</div>
```

- Macros
```js
{{:macro button(text, ...classes) }}
  <button class="{{ classes.join(' ') }}">{{ text }}</button>
{{/macro}}

{{- button("Login", "btn", "is-primary") }}
```

- Layouts (Extend & Slot)
  - Define layout:
  ```html
  <!-- layout.tark -->
  <!DOCTYPE html>
  <html>
    <head>{{- head }}</head>
    <body>{{- body }}</body>
  </html>
  ```

  - Use layout:
  ```html
  {{:extends "./layout"}}
    {{:slot "head"}}
      <title>Page Title</title>
    {{/slot}}

    {{:slot "body"}}
      <main><h1>Hello Layout</h1></main>
    {{/slot}}
  {{/extends}}
  ```

### Add Custom Data
- Global data can be registered and used across all templates:
```js
const Tarkine = require('tarkine')

Tarkine.store.set("default", { 
  siteName: 'My Website',
  description: "...."
})
```

- Access in template:
```html
<title>{{ $.default.siteName }}</title>
```

# Browser support
```html
<script src="https://cdn.jsdelivr.net/npm/tarkine@latest/src/browser.min.js"></script>
<script>
  const output = Tarkine.render("<h1>{{ name }}</h1>", { name: "Tarkine" })
  console.log(output)
</script>
```

# VSCode Extension Support
- [Tarkine VS code extension](https://marketplace.visualstudio.com/items?itemName=madhanmaaz.tarkine-vscode-extension) 
