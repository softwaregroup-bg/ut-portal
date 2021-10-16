const trees = require('./trees');

module.exports = ({
    object,
    subjectObject,
    keyField,
    nameField,
    tenantField,
    methods: {
        fetch: fetchMethod,
        get: getMethod,
        add,
        edit,
        delete: remove,
        report: reportMethod
    }
}) =>
    /** @type { import("ut-run").handlerFactory<{}, {}, {}> } */
    function subjectObjectMock({
        lib: {
            [subjectObject]: {
                objects: instances = trees({keyField, nameField, tenantField}),
                fetch = null,
                get = null,
                report = null
            } = {}
        },
        config: {
            mock
        } = {}
    } = {}) {
        if (mock !== true && !mock?.[subjectObject]) return {};
        const byKey = criteria => instance => String(instance[keyField]) === String(criteria[keyField]);
        const find = async criteria => {
            await new Promise((resolve, reject) => setTimeout(resolve, 100));
            return instances.find(byKey(criteria));
        };
        const compare = ({field, dir, smaller = {ASC: -1, DESC: 1}[dir]}) => function compare(a, b) {
            if (a[field] < b[field]) return smaller;
            if (a[field] > b[field]) return -smaller;
            return 0;
        };
        const filter = async criteria => {
            const condition = criteria && criteria[object] && Object.entries(criteria[object]);
            const result = !condition ? instances : instances.filter(
                instance => condition.every(
                    ([name, value]) => value === undefined || instance[name] === value || String(instance[name]).toLowerCase().includes(String(value).toLowerCase())
                )
            );
            if (Array.isArray(criteria.orderBy) && criteria.orderBy.length) result.sort(compare(criteria.orderBy[0]));
            await new Promise((resolve, reject) => setTimeout(resolve, 100));
            return Promise.resolve({
                [object]: result.slice((criteria.paging.pageNumber - 1) * criteria.paging.pageSize, criteria.paging.pageNumber * criteria.paging.pageSize),
                pagination: {
                    recordsTotal: result.length
                }
            });
        };
        let maxId = instances.reduce((max, instance) => Math.max(max, Number(instance[keyField])), 0);
        return {
            [fetchMethod]: fetch ? fetch(filter) : filter,
            [getMethod]: get ? get(find) : async criteria => ({[object]: await find(criteria)}),
            [add](instance) {
                maxId += 1;
                const result = {
                    ...instance[object],
                    [tenantField]: 100,
                    [keyField]: maxId
                };
                instances.push(result);
                return result;
            },
            async [edit](edited) {
                const result = await find({[keyField]: edited[object][keyField]});
                return result && {
                    [object]: Object.assign(result, edited[object])
                };
            },
            [remove](deleted) {
                const result = [];
                for (const item of deleted[keyField]) {
                    const found = instances.findIndex(byKey({[keyField]: item}));
                    result.push(found >= 0 ? result[found] : null);
                    if (found >= 0) instances.splice(found, 1);
                }
                return result;
            },
            [reportMethod]: report ? report(filter) : filter
        };
    };
