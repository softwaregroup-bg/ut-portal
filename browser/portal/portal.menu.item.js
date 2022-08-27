// @ts-check

/** @type { import("../..").handlerFactory } */
module.exports = ({
    config: {
        pages
    } = {}
}) => ({
    async 'portal.menu.item'(params) {
        let {id, title, component: _, ...rest} = params;
        const component = typeof params === 'function' ? params : params.component;
        let page;
        try {
            page = await component({});
        } catch (e) {
            if (title) title = '💥' + title;
            page = {
                title: '💥' + component.name,
                component: null,
                disabled: true
            };
            // eslint-disable-next-line no-process-env
            if (process.env.NODE_ENV !== 'production') {
                this.log?.warn?.(`Menu item ${component.name} returned error ${e.message}`);
            }
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
