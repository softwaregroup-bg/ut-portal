// @ts-check

/** @type { import("../..").handlerFactory } */
module.exports = ({
    import: {
        backend$portalComponentGet,
        backend$portalComponentEdit,
        backend$portalComponentDelete
    }
}) => {
    const cache = {}; // TODO implement ut-cache for browser
    const memo = async(set, id) => {
        if (id in cache) return cache[id];
        const value = await set();
        cache[id] = value;
        return value;
    };
    return {
        'portal.component.get': (componentId, $meta) =>
            memo(() => backend$portalComponentGet(componentId, $meta), componentId),
        'portal.component.edit': (component, $meta) =>
            memo(() => backend$portalComponentEdit(component, $meta), component.component.componentId),
        'portal.component.delete': (criteria, $meta) => {
            criteria.componentId.forEach(componentId => delete cache[componentId]);
            return backend$portalComponentDelete(criteria, $meta);
        }
    };
};
