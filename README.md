<p align="center">
    <img src="https://raw.githubusercontent.com/madhanmaaz/tarkine/master/banner.jpg">
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

### Add Custom Registers
- Global data can be registered and used across all templates:
```js
const tarkine = require('tarkine')

tarkine.register({ 
  siteName: 'My Website'
})
```

### Built-in Registers

#### Text Manipulation
- Capitalizes the first letter of a string.

```html
<p>{{ capitalize('hello world') }}</p> <!-- Output: "Hello world" -->
```

- Converts a string to uppercase.

```html
<p>{{ uppercase('hello') }}</p> <!-- Output: "HELLO" -->
```

- Converts a string to lowercase.

```html
<p>{{ lowercase('HELLO') }}</p> <!-- Output: "hello" -->
```

#### Random Values

- Generates a random number between the given min and max values.

```html
<p>Random number: {{ randomNum(1, 100) }}</p> <!-- Output: Random number between 1 and 100 -->
```

- Generates a random alphanumeric string of a given length.

```html
<p>Random string: {{ randomStr(10) }}</p> <!-- Output: Random string of 10 characters -->
```

- Generates a random character from the alphabet.

```html
<p>Random character: {{ randomChar() }}</p> <!-- Output: A random letter -->
```

#### Date and Time Formatting

- Formats a date according to the provided format.

```html
<p>Formatted date: {{ formatDate('2024-01-01', 'MM/DD/YYYY') }}</p> <!-- Output: "01/01/2024" -->
```

- Formats a time to HH:mm:ss.

```html
<p>Formatted time: {{ formatTime('2024-01-01T15:30:00') }}</p> <!-- Output: "15:30:00" -->
```

- Displays the time elapsed since a given date (e.g., "2 days ago").

```html
<p>{{ timeSince('2023-01-01T00:00:00Z') }}</p> <!-- Output: "X days ago" -->
```

#### Text Processing

- Truncates a string to a specified length.

```html
<p>{{ truncate('This is a long sentence that needs truncation', 20) }}</p> <!-- Output: "This is a long se..." -->
```

- Converts a string into a URL-friendly slug.

```html
<p>{{ slugify('Hello World! This is a test') }}</p> <!-- Output: "hello-world-this-is-a-test" -->
```

#### Currency Formatting

- Formats a number as a currency (USD by default).

```html
<p>{{ currency(1234.56) }}</p> <!-- Output: "$1,234.56" -->
```

- Formats a number as a currency in a different locale and currency.

```html
<p>{{ currency(1234.56, 'EUR', 'de-DE') }}</p> <!-- Output: "1.234,56 €" -->
```

#### Pluralization

- Returns the singular or plural form based on the count.

```html
<p>{{ pluralize(1, 'apple', 'apples') }}</p> <!-- Output: "apple" -->
<p>{{ pluralize(2, 'apple', 'apples') }}</p> <!-- Output: "apples" -->
```

#### File Size Formatting

- Converts a number of bytes to a human-readable file size (KB, MB, GB, etc.).

```html
<p>{{ formatBytes(1024) }}</p> <!-- Output: "1 KB" -->
```

#### Email Validation

- Checks if an email address is valid.

```html
<p>{{ isEmail('test@example.com') }}</p> <!-- Output: true -->
```