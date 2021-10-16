// @ts-check
const merge = require('ut-function.merge');

const {capital} = require('./lib');

const subjectObjectStep = require('./subjectObjectStep');
const subjectObjectValidation = require('./subjectObjectValidation');
const subjectObjectMock = require('./subjectObjectMock');

const defaults = (joi, {
    subject,
    object,
    subjectObject = `${subject}${capital(object)}`,
    objectTitle = capital(object),
    keyField = `${object}Id`,
    nameField = `${object}.${object}Name`,
    descriptionField = `${object}Description`,
    tenantField = 'businessUnitId',
    ...rest
}) => merge({
    cards: {
        edit: {title: object, properties: [nameField, descriptionField]}
    },
    schema: {
        properties: {
            [object]: {
                properties: {
                    [keyField]: {title: 'key', validation: joi && joi.any()},
                    [tenantField]: {title: 'Tenant', validation: joi && joi.any()},
                    [nameField.split('.').pop()]: {title: `${capital(object)} Name`, filter: true, sort: true, validation: joi && joi.string().required().min(1)},
                    [descriptionField]: {title: `${capital(object)} Description`, filter: true, editor: {type: 'text'}}
                }
            }
        }
    },
    methods: {
        fetch: `${subject}.${object}.fetch`,
        add: `${subject}.${object}.add`,
        delete: `${subject}.${object}.delete`,
        get: `${subject}.${object}.get`,
        edit: `${subject}.${object}.edit`,
        report: `${subject}.${object}.report`
    },
    report: {
        title: `${objectTitle} Report`
    },
    browser: {
        title: rest.cards?.browse?.title || `${objectTitle} list`,
        create: [{
            title: 'Create'
        }]
    },
    filter: {},
    layouts: {},
    reports: {},
    editor: {}
}, {
    subject,
    object,
    subjectObject,
    objectTitle,
    keyField,
    nameField,
    descriptionField,
    tenantField,
    ...rest
});

const mapObjects = (ut, objects, mapper) => [].concat(objects).map(item => defaults(ut.joi, item(ut))).map(mapper);

module.exports.backendMock = (objects, lib) => ({
    browser: () => [
        function backend(ut) {
            return [].concat(lib, mapObjects(ut, objects, subjectObjectMock)).filter(Boolean);
        }
    ]
});

module.exports.orchestratorMock = (objects, lib) => [
    function mock(ut) {
        return [].concat(lib, mapObjects(ut, objects, subjectObjectMock)).filter(Boolean);
    }
];

module.exports.steps = (objects, lib) => [
    function steps(ut) {
        return [].concat(lib, mapObjects(ut, objects, subjectObjectStep)).filter(Boolean);
    }
];

module.exports.validation = (objects, lib) => [
    function validation(ut) {
        return [].concat(
            require('ut-function.common-joi'),
            lib,
            mapObjects(ut, objects, subjectObjectValidation)
        ).filter(Boolean);
    }
];

module.exports.component = (objects, lib) => [
    function component(ut) {
        const Edit = require('./Edit').default;
        const subjectObjectBrowse = require('./subject.object.browse').default;
        const subjectObjectOpen = require('./subject.object.open').default;
        const subjectObjectNew = require('./subject.object.new').default;
        const subjectObjectReport = require('./subject.object.report').default;
        return [].concat(
            lib,
            mapObjects(ut, objects, params => [
                Edit(params),
                subjectObjectBrowse(params),
                subjectObjectOpen(params),
                subjectObjectNew(params),
                subjectObjectReport(params)
            ]).flat(1)
        ).filter(Boolean);
    }
];
