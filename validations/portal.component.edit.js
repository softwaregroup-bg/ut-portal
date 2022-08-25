/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi,
    lib: {
        component
    }
}) => ({
    'portal.component.edit': () => ({
        description: 'Set component configuration',
        params: joi.object().keys({
            component
        }).required(),
        result: joi.object().keys({
            component
        }).required()
    })
});
