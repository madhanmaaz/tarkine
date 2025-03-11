// registers

const regStore = {}

module.exports = {
    regStore,
    register(obj) {
        if (typeof obj !== "object" || obj === null) {
            console.warn("Warning: register expects a object.")
            return
        }

        Object.assign(regStore, obj)
    },
}