module.exports = () => ({
    // environments
    common: {
        portal: {
            help: {
                module: {
                    policy: 'ut-user',
                    bulk: 'ut-bulk-payment'
                }
            }
        }
    },
    storybook: {
        browser: true,
        portal: {
            render: false
        }
    },
    validation: ({joi}) => joi.object({
        browser: joi.boolean(),
        portal: joi.object({
            render: joi.boolean(),
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
            }).pattern(joi.string(), joi.string())
        })
    })
});
