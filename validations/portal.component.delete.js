/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi,
    lib: {
        componentId,
        component
    }
}) => ({
    'portal.component.delete'() {
        return {
            description: 'Component delete',
            params: joi.object().keys({componentId: joi.array().items(componentId)}),
            result: joi.object().keys({
                component: joi.array().items(component.optional()).required()
            })
        };
    }
});
