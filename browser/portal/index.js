// @ts-check
/** @type { import("../../handlers").handlerSet } */
module.exports = function portal() {
    return [
        require('./middleware'),
        require('./start'),
        require('./ready')
    ];
};
