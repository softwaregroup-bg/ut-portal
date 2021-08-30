// @ts-check

/** @type { import("../../handlers").handlerFactory } */
module.exports = ({
    config: {
        pages
    } = {}
}) => ({
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
        const name = component.name.split('/').pop();
        return {
            path: `/${name}${id ? '/' + id : ''}`,
            params: {id},
            ...page,
            ...pages?.[name],
            ...title && {title}
        };
    }
});
