const test = {
    sqlStandard: true
};

const key = ({componentId}) => ({
    id: String(componentId),
    segment: 'portal.component'
});

module.exports = () => ({
    // environments
    common: {
        portalDispatch: {
            import: {
                'db/portal.component.edit': {cache: {key}},
                'db/portal.component.delete': {cache: {key}},
                'db/portal.component.get': {cache: {key}}
            }
        }
    },
    dev: {
        sqlStandard: true
    },
    test,
    jenkins: test,
    uat: {
        sqlStandard: true
    },
    // methods
    kustomize: {
        adapter: true,
        orchestrator: true,
        gateway: true
    },
    types: {
        adapter: true,
        gateway: true
    },
    doc: {
        gateway: true
    },
    // test types
    unit: {
        adapter: true,
        orchestrator: true,
        gateway: true,
        test: true
    },
    integration: {
        adapter: true,
        orchestrator: true,
        gateway: true,
        test: true
    },
    // overlays
    db: {
        adapter: true
    },
    microservice: {
        adapter: true,
        orchestrator: true,
        gateway: true
    },
    api: {
        gateway: true
    },
    validation: ({joi}) => joi.object({
        adapter: joi.boolean(),
        orchestrator: joi.boolean(),
        gateway: joi.boolean(),
        test: joi.boolean(),
        sql: joi.object({
            exclude: joi.any()
        }),
        sqlStandard: joi.boolean(),
        portalDispatch: [
            joi.boolean(),
            joi.object()
        ]
    })
});
