// @ts-check
/** @type { import("../../handlers").handlerFactory } */
module.exports = () => ({
    'portal.tab.show'(params) {
        return this.store.dispatch({
            ...(typeof params === 'function') ? {
                component: params,
                title: params.title || params.name
            } : (Array.isArray(params)) ? {
                component: params[0],
                title: params[1]
            } : params,
            type: 'front.tab.show'
        });
    }
});
