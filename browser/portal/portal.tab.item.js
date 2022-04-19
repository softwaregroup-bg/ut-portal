// @ts-check

/** @type { import("../../handlers").handlerFactory } */
module.exports = ({
    config: {
        pages
    } = {}
}) => ({
    async 'portal.tab.item'(params) {
        const {id, title} = params;
        const component = typeof params === 'function' ? params : params.component;
        let page;
        try {
            page = await component({});
        } catch (e) {
            page = {
                title: component.name,
                disabled: true,
                component: null
            };
        }
        const name = component.name.split('/').pop();
        return {
            path: `/${name}${id ? '/' + id : ''}`,
            params: {id},
            Component: await page?.component({id}),
            ...pages?.[name],
            title: title || page.title
        };
    }
});
