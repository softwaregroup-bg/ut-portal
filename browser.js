module.exports = () => function utPortal() {
    return {
        browser: () => [
            require('./browser/portal'),
            require('./browser/ui'),
            require('./browser/handle')
        ]
    };
};
