const script = require('ut-port-script');
module.exports = (...params) => class ui extends script(...params) {
    get defaults() {
        return {
            logLevel: 'trace',
            namespace: ['portal', 'component'],
            imports: [/\.portal$/, /\.component$/, 'portal', 'component']
        };
    }
};
