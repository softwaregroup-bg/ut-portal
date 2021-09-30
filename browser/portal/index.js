// @ts-check
/** @type { import("../..").handlerSet } */
module.exports = function portal() {
    return [
        require('./middleware'),
        require('./portal.menu.item'),
        require('./portal.tab.item'),
        require('./portal.dropdown.list'),
        require('./start'),
        require('./ready')
    ];
};
