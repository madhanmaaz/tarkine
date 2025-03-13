let store = {
    uppercase(str) {
        if (typeof str !== "string") return str
        return str.toUpperCase()
    },
    lowercase(str) {
        if (typeof str !== "string") return str
        return str.toLowerCase()
    },
    capitalize(str) {
        if (typeof str !== 'string') return str
        return str.charAt(0).toUpperCase() + str.slice(1)
    },
    isEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    },
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    randomStr(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        return Array.from({ length }, () => chars.charAt(
            Math.floor(Math.random() * chars.length))
        ).join('')
    },
    randomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        return chars.charAt(Math.floor(Math.random() * chars.length))
    },
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        const seconds = String(d.getSeconds()).padStart(2, '0')

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
    },
    formatTime(date) {
        const d = new Date(date)
        const hours = d.getHours().toString().padStart(2, '0')
        const minutes = d.getMinutes().toString().padStart(2, '0')
        const seconds = d.getSeconds().toString().padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    },
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    truncate(str, length, ending = '...') {
        return str.length > length
            ? str.substring(0, length - ending.length) + ending
            : str
    },
    slugify(str) {
        return str.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
    },
    currency(amount, currency = 'USD', locale = 'en-US') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount)
    },
    pluralize(count, singular, plural) {
        return count === 1
            ? singular
            : (plural || singular + 's')
    },
    timeSince(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000)
        let interval = seconds / 31536000
        if (interval > 1) return Math.floor(interval) + " years ago"
        interval = seconds / 2592000
        if (interval > 1) return Math.floor(interval) + " months ago"
        interval = seconds / 86400
        if (interval > 1) return Math.floor(interval) + " days ago"
        interval = seconds / 3600
        if (interval > 1) return Math.floor(interval) + " hours ago"
        interval = seconds / 60
        if (interval > 1) return Math.floor(interval) + " minutes ago"
        return Math.floor(seconds) + " seconds ago"
    }
}

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