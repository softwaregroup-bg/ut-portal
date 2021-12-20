// @ts-check

/** @type { import("../..").handlerFactory } */
module.exports = ({
    config: {
        pages
    } = {}
}) => ({
    async 'portal.menu.item'(params) {
        const {id, title, ...rest} = params;
        if ('component' in rest) delete rest.component;
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
        let query = '';
        if (Object.keys(rest).length) {
            const queryParams = new URLSearchParams(rest);
            queryParams.sort();
            query = '?' + queryParams;
        }
        return {
            path: `/${name}${id ? '/' + id : ''}${query}`,
            params: {id, ...rest},
            ...page,
            ...pages?.[name],
            ...title && {title}
        };
    }
});
