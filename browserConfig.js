module.exports = () => ({
    // environments
    common: {
        portal: {
            help: {
                default: '/a/help',
                module: {
                    policy: 'ut-user',
                    bulk: 'ut-bulk-payment'
                }
            }
        }
    },
    dev: {
        portal: {
            customization: true
        }
    },
    storybook: {
        browser: true,
        portal: {
            customization: true,
            render: false
        }
    },
    validation: ({joi}) => joi.object({
        browser: joi.boolean(),
        portal: joi.object({
            render: joi.boolean(),
            customization: joi.boolean(),
            registrationPage: joi.string(),
            loginPage: joi.string(),
            favicon: joi.string(),
            title: joi.string(),
            theme: joi.object(),
            portalName: joi.string().allow(''),
            devTool: joi.boolean(),
            pages: joi.object().pattern(/\w*\.\w*\.\w*/, joi.object().keys({
                icon: joi.string(),
                title: joi.string()
            })),
            help: joi.object({
                default: joi.string(),
                module: joi.object()
            }).pattern(joi.string(), joi.string()),
            ui: [
                joi.object(),
                joi.boolean()
            ],
            handle: [
                joi.object(),
                joi.boolean()
            ]
        })
    })
});
