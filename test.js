const tarkine = require('./src/index')

const output = tarkine.renderFile("./test.html", {
    username: "madhan",
    html: "<span>html code</span>",
    status: true,
    islogin: true,
    array: [1, 2, 3],
    object: {
        username: "key",
        age: 10000
    },
})

console.log(output)
