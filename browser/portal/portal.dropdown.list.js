const parentField = 'parent';
const keyField = 'value';

const nodes = result => {
    result = result.map(({
        [keyField]: key,
        [parentField]: parent,
        ...item
    }) => ({
        ...item,
        data: item,
        ...parent && {parent},
        key: key != null ? String(key) : key
    }));
    const children = result.reduce((prev, item) => item.parent ? ({
        ...prev,
        [item.parent]: (prev[item.parent] || []).concat(item)
    }) : prev, {});
    result.forEach(item => {
        item.children = children[item.key];
    });
    return result.filter(item => item.parent == null);
};

/** @type { import("../..").handlerFactory } */
module.exports = ({
    utMethod,
    lib: {
        getCache,
        setCache
    }
}) => ({
    async 'portal.dropdown.list'(names, $meta) {
        const result = names?.length ? Object.assign(
            {},
            ...await Promise.all(
                Array.from(
                    new Set(
                        names.map(name => name.split('.')[0] + '.dropdown.list')
                    )
                ).map(
                    method => {
                        let api = getCache(method);
                        if (!api) {
                            api = utMethod(method)({}, $meta);
                            setCache(method, api);
                        }
                        return api;
                    }
                )
            )
        ) : {};
        Object.entries(result).forEach(([name, value]) => {
            if (name.endsWith('Tree')) {
                const key = name + 'Nodes';
                result[key] = getCache(key);
                if (!result[key]) {
                    result[key] = nodes(value);
                    setCache(key, result[key]);
                }
            }
        });
        return result;
    },
    'portal.dropdown.nodes'(msg, $meta) {
        return nodes(msg);
    }
});
