// @ts-check

/** @type { import("../../handlers").handlerFactory } */
module.exports = () => ({
    async 'portal.tab.item'(params) {
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
            Component: await page.component({id}),
            title: title || page.title
        };
    }
});
