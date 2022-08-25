module.exports = require('ut-run').microservice(
    module,
    require,
    () => function utPortal() {
        return {
            config: require('./config'),
            adapter: () => [
                require('./api/sql/schema'),
                require('./api/sql/seed'),
                require('./errors')
            ],
            orchestrator: () => [
                require('./errors'),
                require('./api/portal'),
                require('ut-dispatch-db')(['portal'], ['utPortal.portal'], ['utPortal.validation'])
            ],
            gateway: () => [
                require('./errors'),
                require('./validations')
            ],
            test: () => [
                ...require('./test/steps'),
                ...require('./test/ui'),
                ...require('./test/jobs')
            ]
        };
    }
);
