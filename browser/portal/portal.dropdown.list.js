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
    const children = result.reduce((prev, item) => 'parent' in item ? ({
        ...prev,
        [item.parent]: (prev[item.parent] || []).concat(item)
    }) : prev, {});
    result.forEach(item => {
        item.children = children[item.key];
    });
    return result.filter(item => item.parent == null);
};

/** @type { import("../../handlers").handlerFactory } */
module.exports = ({
    utMethod
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
                    method => utMethod(method)({}, $meta)
                )
            )
        ) : {};
        Object.entries(result).forEach(([name, value]) => {
            if (name.endsWith('Tree')) {
                result[name + 'Nodes'] = nodes(value);
            }
        });
        return result;
    }
});
