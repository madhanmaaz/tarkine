const Tarkine = require('../')

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
    text: "this is text"
}

// register global data
Tarkine.store.set("isString", (value) => {
    return typeof value === "string"
})

const output = Tarkine.renderFile("./example.tark", data)
console.log(output)