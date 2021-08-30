module.exports = () => ({
    // environments
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
            pages: joi.object().pattern(/\w*\.\w*\.\w*/, joi.object().keys({
                icon: joi.string(),
                title: joi.string()
            }))
        })
    })
});
