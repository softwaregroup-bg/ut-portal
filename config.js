module.exports = () => ({
    // test types
    integration: {
        test: true
    },
    unit: {
        test: true
    },
    validation: ({joi}) => joi.object({
        test: joi.boolean()
    })
});
