let cache = {};
const lib = {
    setCache(key, value) {
        cache[key] = value;
    },
    getCache(key) {
        return cache[key];
    },
    deleteCache(key) {
        delete cache[key];
    },
    resetCache() {
        cache = {};
    }
};
/** @type { import("../..").libFactory } */
module.exports = () => ({
    ...lib,
    'portal.cache.get': (msg, $meta) => {
        return lib.getCache(msg.key);
    },
    'portal.cache.set': (msg, $meta) => {
        lib.setCache(msg.key, msg.value);
        return true;
    },
    'portal.cache.delete': (msg, $meta) => {
        lib.deleteCache(msg.key);
        return true;
    },
    'portal.cache.reset': (msg, $meta) => {
        lib.resetCache();
        return true;
    }
});
