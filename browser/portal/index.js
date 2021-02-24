// @ts-check
/** @type { import("../../handlers").handlerSet } */
module.exports = function portal() {
    return [
        require('./middleware'),
        require('./store'),
        require('./start'),
        require('./ready'),
        require('./portal.store.get'),
        require('./portal.tab.show')
    ];
};
