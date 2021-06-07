// @ts-check
import objectEditor from './editor';
import objectBrowse from './subject.object.browse';
import objectOpen from './subject.object.open';
import objectNew from './subject.object.new';

export default ({
    joi,
    subject,
    object,
    keyField = `${object}Id`,
    fetch = `${subject}.${object}.fetch`,
    add = `${subject}.${object}.add`,
    remove = `${subject}.${object}.delete`,
    get = `${subject}.${object}.get`,
    edit = `${subject}.${object}.edit`,
    fields,
    cards,
    browser = {
        navigator: true
    },
    editor = {
        cards: {
            edit: cards.edit
        }
    }
}) => {
    fields = {
        [keyField]: {title: 'key', validation: joi && joi.any()},
        tenant: {title: 'tenant', validation: joi && joi.any()},
        name: {title: 'Name'},
        ...fields
    };
    cards = {
        edit: {title: object, className: 'p-lg-6 p-xl-4', fields: ['name']},
        ...cards
    };
    return {
        components: () => [
            objectEditor({...editor, subject, object, keyField, fields}),
            objectBrowse({...browser, subject, object, keyField, fields, cards}),
            objectOpen({subject, object}),
            objectNew({subject, object})
        ],
        mock({
            objects: instances = [
                {[keyField]: 101, tenant: 100, name: 'Acacia'},
                {[keyField]: 102, tenant: 100, name: 'Banksia'},
                {[keyField]: 103, tenant: 100, name: 'Cedar'},
                {[keyField]: 104, tenant: 100, name: 'Dogwood'},
                {[keyField]: 105, tenant: 100, name: 'Elm'},
                {[keyField]: 106, tenant: 100, name: 'Fig'},
                {[keyField]: 107, tenant: 100, name: 'Gum'},
                {[keyField]: 108, tenant: 100, name: 'Hazel'},
                {[keyField]: 109, tenant: 100, name: 'Ivy'},
                {[keyField]: 110, tenant: 100, name: 'Juniper'},
                {[keyField]: 111, tenant: 100, name: 'Kauri'},
                {[keyField]: 112, tenant: 100, name: 'Larch'},
                {[keyField]: 113, tenant: 100, name: 'Maple'},
                {[keyField]: 114, tenant: 100, name: 'Narra'},
                {[keyField]: 115, tenant: 100, name: 'Oak'},
                {[keyField]: 116, tenant: 100, name: 'Pine'},
                {[keyField]: 117, tenant: 100, name: 'Quercus'},
                {[keyField]: 118, tenant: 100, name: 'Rowan'},
                {[keyField]: 119, tenant: 100, name: 'Sycamore'},
                {[keyField]: 120, tenant: 100, name: 'Tamarind'},
                {[keyField]: 121, tenant: 100, name: 'Unedo'},
                {[keyField]: 122, tenant: 100, name: 'Viburnum'},
                {[keyField]: 123, tenant: 100, name: 'Willow'},
                {[keyField]: 124, tenant: 100, name: 'Xanthorrhoea'},
                {[keyField]: 125, tenant: 100, name: 'Yew'},
                {[keyField]: 126, tenant: 100, name: 'Zelkova'}
            ]
        } = {}) {
            const byKey = criteria => instance => String(instance[keyField]) === String(criteria[keyField]);
            const find = criteria => instances.find(byKey(criteria));
            const filter = criteria => {
                const condition = Object.entries(criteria);
                return instances.filter(
                    instance => condition.every(
                        ([name, value]) => instance[name] === value || String(instance[name]).toLowerCase().includes(String(value).toLowerCase())
                    )
                );
            };
            let maxId = instances.reduce((max, instance) => Math.max(max, Number(instance[keyField])), 0);
            return {
                [fetch]: filter,
                [get]: find,
                [add](instance) {
                    const result = {
                        ...instance,
                        tenant: 1,
                        [keyField]: ++maxId
                    };
                    instances.push(result);
                    return result;
                },
                [edit](edited) {
                    const result = find({[keyField]: edited[keyField]});
                    return result && Object.assign(result, edited);
                },
                [remove](deleted) {
                    const result = [];
                    for (const item of deleted) {
                        const found = instances.findIndex(byKey({[keyField]: item[keyField]}));
                        result.push(found >= 0 ? result[found] : null);
                        if (found >= 0) instances.splice(found, 1);
                    }
                    return result;
                }
            };
        }
    };
};
