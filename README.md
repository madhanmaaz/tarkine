<p align="center">
    <img src="https://raw.githubusercontent.com/madhanmaaz/tarkine/master/logo.webp" height="300">
</p>
<p align="center">
Tarkine - A lightweight and high-performance template engine for Node.js, designed for speed and simplicity.
</p>

[![npm version](https://img.shields.io/npm/v/tarkine.svg)](https://www.npmjs.com/package/tarkine)
[![Downloads](https://img.shields.io/npm/dm/tarkine.svg)](https://www.npmjs.com/package/tarkine)
[![License](https://img.shields.io/npm/l/tarkine.svg)](https://github.com/yourusername/tarkine/blob/main/LICENSE)

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


### Add Custom Data
- Global data can be registered and used across all templates:
```js
const Tarkine = require('tarkine')

Tarkine.store.set("default", { 
  siteName: 'My Website',
  description: "...."
})


// access: <title>{{ $.default.siteName }}</title>
```

### Build-in helpers
```js
{{ $.uppercase("...") }}
{{ $.capitalize("...") }}
{{ $.lowercase("...") }}
{{ $.randomNum(1, 100) }}
{{ $.randomStr(10) }}
{{ $.randomChar() }}
{{ $.formatDate('2024-01-01', 'MM/DD/YYYY') }}
{{ $.formatTime('2024-01-01T15:30:00') }}
{{ $.timeSince('2023-01-01T00:00:00Z') }}
{{ $.truncate('This is a long sentence that needs truncation', 20) }}
{{ $.slugify('Hello World! This is a test') }}
{{ $.currency(1234.56) }}
{{ $.currency(1234.56, 'EUR', 'de-DE') }}
{{ $.pluralize(1, 'apple', 'apples') }}
{{ $.formatBytes(1024) }}
{{ $.isEmail('test@example.com') }}
```

# Browser support
```html
<script src="https://cdn.jsdelivr.net/npm/tarkine@1.0.2/src/browser.min.js"></script>
<script>
  const output = Tarkine.render("<h1>{{ name }}</h1>", { name: "Tarkine" })
  console.log(output)
</script>
```
