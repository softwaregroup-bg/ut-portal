module.exports = () => function utPortal() {
    return {
        config: require('./browserConfig'),
        browser: () => [
            require('./browser/backend'),
            require('./browser/portal'),
            require('./browser/ui'),
            require('./browser/handle')
        ]
    };
};
