// @ts-check

/** @type { import("../..").handlerFactory } */
module.exports = ({
    utMethod
}) => ({
    async 'portal.dropdown.list'(names, $meta) {
        return names?.length ? Object.assign(
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
    }
});
