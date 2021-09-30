const {capital} = require('./lib');

module.exports = ({
    subject,
    object,
    subjectObject,
    objectTitle,
    methods: {
        fetch,
        get,
        add,
        edit,
        delete: remove,
        report
    }
}) => function subjectObjectStep() {
    return Object.fromEntries([
        [fetch, 'Fetch'],
        [get, 'Get'],
        [add, 'Add'],
        [edit, 'Update'],
        [remove, 'Delete'],
        [report, 'Report']
    ].map(([method, verb]) => [
        `steps.${method}`,
        function(params, name = `${subject}${capital(object)}${verb}`) {
            return {
                name,
                method,
                params,
                result(result, assert) {
                    assert.matchSnapshot(result, `Successful ${objectTitle} ${verb}`);
                }
            };
        }
    ]));
};
