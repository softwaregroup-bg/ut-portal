// @ts-check
/** @type { import("../../handlers").handlerFactory } */
module.exports = () => ({
    async 'portal.store.get'() {
        return this.store;
    }
});
