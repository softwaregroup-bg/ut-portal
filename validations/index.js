/** @type { import("ut-run").validationSet } */
module.exports = function validation() {
    return [
        require('ut-function.common-joi'),
        require('./component'),
        require('./portal.component.delete'),
        require('./portal.component.edit'),
        require('./portal.component.get')
    ];
};
