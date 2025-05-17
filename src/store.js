let store = {}

module.exports = {
    set(key, value) {
        store[key] = value
    },
    get(key) {
        return store[key]
    },
    getAll() {
        return store
    },
    delete(key) {
        delete store[key]
    },
    clear() {
        store = {}
    }
}