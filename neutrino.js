const utBrowser = require('ut-webpack/preset');
module.exports = ({mains = {}} = {}) => ({
    options: {
        mains
    },
    use: [utBrowser({
        csp: {
            nonceEnabled: {
                'style-src': false
            },
            policy: {
                'script-src': ["'unsafe-eval'"],
                'style-src': ["'unsafe-inline'", "'self'"]
            }
        },
        split: [
            'ut-core',
            'ut-audit',
            'ut-history',
            'ut-user',
            'ut-customer',
            'ut-document',
            'ut-transfer',
            'ut-rule',
            'ut-agent',
            'ut-ledger',
            'ut-bulk-payment',
            'ut-aml',
            'ut-atm',
            'ut-card',
            'ut-pos',
            'ut-iso',
            'ut-report',
            'ut-mirrors'
        ]
    })]
});
