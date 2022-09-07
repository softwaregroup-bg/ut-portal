
// @ts-check

/** @type { import("../..").handlerFactory } */
module.exports = ({
    import: {
        coreComponentGet,
        coreComponentEdit,
        coreComponentDelete
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
        'portal.customization.get': (componentId, $meta) =>
            memo(() => coreComponentGet(componentId, $meta), componentId),
        'portal.customization.edit': (component, $meta) =>
            memo(() => coreComponentEdit(component, $meta), component.component.componentId),
        'portal.customization.delete': (criteria, $meta) => {
            criteria.componentId.forEach(componentId => delete cache[componentId]);
            return coreComponentDelete(criteria, $meta);
        }
    };
};
