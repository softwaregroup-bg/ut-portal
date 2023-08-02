let cache = {};

/** @type { import("../..").libFactory } */
module.exports = () => ({
    setCache(key, value) {
        cache[key] = value;
    },
    getCache(key) {
        return cache[key];
    },
    resetCache() {
        cache = {};
    }
});
