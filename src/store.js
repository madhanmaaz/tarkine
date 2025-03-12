// store.js

let store = {}

module.exports = {
    set(key, value) {
        if (typeof key !== "string") {
            throw new TypeError("Key must be a string.")
        }

        store[key] = value
    },
    get(key) {
        return store[key]
    },
    delete(key) {
        delete store[key]
    },
    getAll() {
        return store
    },
    deleteAll() {
        store = {}
    },
}