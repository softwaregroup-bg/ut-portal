const uuid = require('uuid');

/** @type { import("../../handlers").test } */
module.exports = function test() {
    return {
        portal: function(test, bus, run, ports) {
            const componentId = uuid.v4();
            const componentConfig = {test: true};
            return run(test, bus, [{
                method: 'portal.component.get',
                params: {componentId},
                result(result, assert) {
                    assert.match(result.component, null, 'component not found');
                }
            }, {
                method: 'portal.component.edit',
                params: {component: {componentId, componentConfig}},
                result(result, assert) {
                    assert.match(result.component, {componentId, componentConfig}, 'set configuration');
                }
            }, {
                method: 'portal.component.get',
                params: {componentId},
                result(result, assert) {
                    assert.match(result.component, {componentId, componentConfig}, 'get configuration');
                }
            }, {
                method: 'portal.component.delete',
                params: {componentId: [componentId]},
                result(result, assert) {
                    assert.match(result.component, [{componentId}], 'delete configuration');
                }
            }, {
                method: 'portal.component.get',
                params: {componentId},
                result(result, assert) {
                    assert.match(result.component, null, 'ensure deletion');
                }
            }]);
        }
    };
};
