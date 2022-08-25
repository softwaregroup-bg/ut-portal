/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi,
    lib: {
        componentId,
        component
    }
}) => ({
    'portal.component.get'() {
        return {
            description: 'Component get',
            params: joi.object().keys({componentId}),
            result: joi.object().keys({
                component: component.allow(null)
            })
        };
    }
});
