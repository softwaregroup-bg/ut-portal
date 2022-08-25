/** @type { import("ut-run").validationLib } */
module.exports = ({
    joi,
    lib: {
        stringRequired
    }
}) => ({
    component: joi.object().keys({
        componentId: stringRequired.max(100),
        componentConfig: joi.object()
    }),
    componentId: stringRequired.max(100)
});
