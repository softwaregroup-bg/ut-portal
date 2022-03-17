// @ts-check

/** @type { import("../../handlers").handlerFactory } */
module.exports = ({
    config: {
        pages
    } = {}
}) => ({
    async 'portal.menu.item'(params, $meta) {
        let {id, title, component: _, ...rest} = params;
        const component = typeof params === 'function' ? params : params.component;
        let page;
        try {
            page = await component({});
        } catch (e) {
            this.error(e, $meta);
            if (title) title = '💥' + title;
            page = {
                title: '💥' + component.name,
                component: null,
                disabled: true
            };
            // eslint-disable-next-line no-process-env
            if (process.env.NODE_ENV !== 'production') page.component = () => {};
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
