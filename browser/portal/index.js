// @ts-check
/** @type { import("../../handlers").handlerSet } */
module.exports = function portal() {
    return [
        require('./middleware'),
        require('./portal.menu.item'),
        require('./portal.dropdown.list'),
        require('./start'),
        require('./ready')
    ];
};
