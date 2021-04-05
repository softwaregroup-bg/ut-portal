// @ts-check
/** @type { import("../../handlers").handlerSet } */
module.exports = function portal() {
    return [
        require('./middleware'),
        require('./portal.menu.item'),
        require('./start'),
        require('./ready')
    ];
};
