module.exports = () => function utPortal() {
    return {
        config: require('./config'),
        test: () => [
            ...require('./test/steps'),
            ...require('./test/jobs')
        ]
    };
};
