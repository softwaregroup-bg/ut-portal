// @ts-check
/** @type { import("../..").handlerSet } */
module.exports = function portal() {
    return [
        require('./middleware'),
        require('./portal.menu.item'),
        require('./portal.menu.help'),
        require('./portal.tab.item'),
        require('./portal.customization'),
        require('./portal.dropdown.list'),
        require('./portal.dialog.confirm'),
        require('./start'),
        require('./ready')
    ];
};
