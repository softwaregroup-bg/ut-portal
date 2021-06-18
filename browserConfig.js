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
            loginPage: joi.string()
        })
    })
});
