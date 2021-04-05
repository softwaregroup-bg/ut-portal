// @ts-check

/** @type { import("../../handlers").handlerFactory } */
module.exports = () => ({
    async 'portal.menu.item'(params) {
        const {id, title} = params;
        const component = typeof params === 'function' ? params : params.component;
        let page;
        try {
            page = await component({});
        } catch (e) {
            page = {
                title: component.name,
                disabled: true
            };
        }
        return {
            path: '/' + component.name.split('/').pop() + (id ? '/' + id : ''),
            params: {id},
            ...page,
            ...title && {title}
        };
    }
});
