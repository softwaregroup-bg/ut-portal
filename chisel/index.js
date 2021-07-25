// @ts-check
import objectEditor from './editor';
import objectBrowse from './subject.object.browse';
import objectOpen from './subject.object.open';
import objectNew from './subject.object.new';
import merge from 'ut-function.merge';

import {capital} from './lib';

export default ({
    joi,
    subject,
    object,
    objectTitle = capital(object),
    keyField = `${object}Id`,
    nameField = `${object}Name`,
    tenantField = 'businessUnitId',
    properties = {},
    cards = {},
    methods: {
        fetch: fetchMethod = `${subject}.${object}.fetch`,
        add: addMethod = `${subject}.${object}.add`,
        delete: deleteMethod = `${subject}.${object}.delete`,
        get: getMethod = `${subject}.${object}.get`,
        edit: editMethod = `${subject}.${object}.edit`
    } = {},
    browser = {
        navigator: undefined,
        resultSet: undefined,
        fetch: undefined,
        delete: undefined
    },
    layouts = {},
    editor = undefined
}) => {
    properties = merge({
        [keyField]: {title: 'key', validation: joi && joi.any()},
        [tenantField]: {title: 'Tenant', validation: joi && joi.any()},
        [nameField]: {title: `${capital(object)} Name`, filter: true, sort: true, validation: joi && joi.string().required().min(1)}
    }, properties);
    cards = merge({
        edit: {title: object, className: 'p-lg-6 p-xl-4', properties: [nameField]}
    }, cards);
    return {
        components: () => [
            objectEditor({...editor, subject, object, objectTitle, keyField, properties, cards, layouts, addMethod, getMethod, editMethod}),
            objectBrowse({...browser, fetchMethod, deleteMethod, subject, object, objectTitle, keyField, nameField, tenantField, properties, cards, layouts}),
            objectOpen({subject, object}),
            objectNew({subject, object})
        ],
        mock({
            objects: instances = [
                {[keyField]: 101, ...tenantField && {[tenantField]: 100}, [nameField]: 'Acacia'},
                {[keyField]: 102, ...tenantField && {[tenantField]: 100}, [nameField]: 'Banksia'},
                {[keyField]: 103, ...tenantField && {[tenantField]: 100}, [nameField]: 'Cedar'},
                {[keyField]: 104, ...tenantField && {[tenantField]: 100}, [nameField]: 'Dogwood'},
                {[keyField]: 105, ...tenantField && {[tenantField]: 100}, [nameField]: 'Elm'},
                {[keyField]: 106, ...tenantField && {[tenantField]: 100}, [nameField]: 'Fig'},
                {[keyField]: 107, ...tenantField && {[tenantField]: 100}, [nameField]: 'Gum'},
                {[keyField]: 108, ...tenantField && {[tenantField]: 100}, [nameField]: 'Hazel'},
                {[keyField]: 109, ...tenantField && {[tenantField]: 100}, [nameField]: 'Ivy'},
                {[keyField]: 110, ...tenantField && {[tenantField]: 100}, [nameField]: 'Juniper'},
                {[keyField]: 111, ...tenantField && {[tenantField]: 100}, [nameField]: 'Kauri'},
                {[keyField]: 112, ...tenantField && {[tenantField]: 100}, [nameField]: 'Larch'},
                {[keyField]: 113, ...tenantField && {[tenantField]: 100}, [nameField]: 'Maple'},
                {[keyField]: 114, ...tenantField && {[tenantField]: 100}, [nameField]: 'Narra'},
                {[keyField]: 115, ...tenantField && {[tenantField]: 100}, [nameField]: 'Oak'},
                {[keyField]: 116, ...tenantField && {[tenantField]: 100}, [nameField]: 'Pine'},
                {[keyField]: 117, ...tenantField && {[tenantField]: 100}, [nameField]: 'Quercus'},
                {[keyField]: 118, ...tenantField && {[tenantField]: 100}, [nameField]: 'Rowan'},
                {[keyField]: 119, ...tenantField && {[tenantField]: 100}, [nameField]: 'Sycamore'},
                {[keyField]: 120, ...tenantField && {[tenantField]: 100}, [nameField]: 'Tamarind'},
                {[keyField]: 121, ...tenantField && {[tenantField]: 100}, [nameField]: 'Unedo'},
                {[keyField]: 122, ...tenantField && {[tenantField]: 100}, [nameField]: 'Viburnum'},
                {[keyField]: 123, ...tenantField && {[tenantField]: 100}, [nameField]: 'Willow'},
                {[keyField]: 124, ...tenantField && {[tenantField]: 100}, [nameField]: 'Xanthorrhoea'},
                {[keyField]: 125, ...tenantField && {[tenantField]: 100}, [nameField]: 'Yew'},
                {[keyField]: 126, ...tenantField && {[tenantField]: 100}, [nameField]: 'Zelkova'}
            ],
            fetch = null
        } = {}) {
            const byKey = criteria => instance => String(instance[keyField]) === String(criteria[keyField]);
            const find = criteria => instances.find(byKey(criteria));
            const compare = ({field, dir, smaller = {ASC: -1, DESC: 1}[dir]}) => function compare(a, b) {
                if (a[field] < b[field]) return smaller;
                if (a[field] > b[field]) return -smaller;
                return 0;
            };
            const filter = async criteria => {
                const condition = criteria && criteria[object] && Object.entries(criteria[object]);
                let result = !condition ? instances : instances.filter(
                    instance => condition.every(
                        ([name, value]) => value === undefined || instance[name] === value || String(instance[name]).toLowerCase().includes(String(value).toLowerCase())
                    )
                );
                if (Array.isArray(criteria.orderBy) && criteria.orderBy.length) result = result.sort(compare(criteria.orderBy[0]));
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
                [getMethod]: criteria => ({[object]: find(criteria)}),
                [addMethod](instance) {
                    const result = {
                        ...instance[object],
                        [tenantField]: 100,
                        [keyField]: ++maxId
                    };
                    instances.push(result);
                    return result;
                },
                [editMethod](edited) {
                    const result = find({[keyField]: edited[object][keyField]});
                    return result && {
                        [object]: Object.assign(result, edited[object])
                    };
                },
                [deleteMethod](deleted) {
                    const result = [];
                    for (const item of deleted[keyField]) {
                        const found = instances.findIndex(byKey({[keyField]: item.value}));
                        result.push(found >= 0 ? result[found] : null);
                        if (found >= 0) instances.splice(found, 1);
                    }
                    return result;
                }
            };
        }
    };
};
