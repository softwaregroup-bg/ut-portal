// @ts-check
import Edit from './Edit';
import subjectObjectBrowse from './subject.object.browse';
import subjectObjectOpen from './subject.object.open';
import subjectObjectNew from './subject.object.new';
import subjectObjectReport from './subject.object.report';
import merge from 'ut-function.merge';
import trees from './trees';

import {capital} from './lib';

export default ({
    joi,
    subject,
    object,
    objectTitle = capital(object),
    keyField = `${object}Id`,
    nameField = `${object}Name`,
    descriptionField = `${object}Description`,
    tenantField = 'businessUnitId',
    properties = {},
    cards = {},
    methods: {
        fetch: fetchMethod = `${subject}.${object}.fetch`,
        add: addMethod = `${subject}.${object}.add`,
        delete: deleteMethod = `${subject}.${object}.delete`,
        get: getMethod = `${subject}.${object}.get`,
        edit: editMethod = `${subject}.${object}.edit`,
        report: reportMethod = `${subject}.${object}.report`
    } = {},
    browser = {
        navigator: undefined,
        resultSet: undefined,
        fetch: undefined,
        delete: undefined
    },
    report = {
        title: `${objectTitle} Report`
    },
    layouts = {},
    reports = {},
    editor = undefined
}) => {
    properties = merge({
        [keyField]: {title: 'key', validation: joi && joi.any()},
        [tenantField]: {title: 'Tenant', validation: joi && joi.any()},
        [nameField]: {title: `${capital(object)} Name`, filter: true, sort: true, validation: joi && joi.string().required().min(1)},
        [descriptionField]: {title: `${capital(object)} Description`, filter: true, editor: {type: 'text'}}
    }, properties);
    cards = merge({
        edit: {title: object, properties: [nameField, descriptionField]}
    }, cards);
    return {
        /** @type { import("..").pageSet<{}, {}> } */
        components: () => [
            Edit({...editor, subject, object, objectTitle, keyField, properties, cards, layouts, addMethod, getMethod, editMethod}),
            subjectObjectBrowse({...browser, fetchMethod, deleteMethod, subject, object, objectTitle, keyField, nameField, tenantField, properties, cards, layouts}),
            subjectObjectOpen({subject, object}),
            subjectObjectNew({subject, object}),
            subjectObjectReport({...report, subject, object, reports, properties, cards})
        ],
        mock({
            objects: instances = trees({keyField, nameField, tenantField}),
            fetch = null,
            report = null
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
                        const found = instances.findIndex(byKey({[keyField]: item}));
                        result.push(found >= 0 ? result[found] : null);
                        if (found >= 0) instances.splice(found, 1);
                    }
                    return result;
                },
                [reportMethod]: report ? report(filter) : filter
            };
        }
    };
};
