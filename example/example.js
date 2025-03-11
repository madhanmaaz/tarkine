const tarkine = require('../src/index')

const data = {
    username: "madhan",
    html: "<span>html code</span>",
    status: true,
    islogin: true,
    array: [1, 2, 3],
    object: {
        username: "key",
        age: 10000
    },
}

const output = tarkine.renderFile("./example.html", data)
console.log(output)