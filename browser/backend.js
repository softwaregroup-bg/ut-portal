/** @type { import("..").handlerSet } */
module.exports = function backend() {
    return [
        () => ({
            namespace: ['backend/portal']
        })
    ];
};
