// @ts-check
const {isImmutable, fromJS} = require('immutable');

/**
 * Convert action.params to plain js when action.params is immutable
 */
const cloneParams = (params) => {
    if (isImmutable(params)) {
        return params.toJS(); // no need to clone as toJS returns a new instance
    } else if (params instanceof Array) {
        return params.slice();
    } else {
        return Object.assign({}, params);
    }
};

/** @type { import("../../handlers").libFactory } */
module.exports = ({
    utMethod
}) => ({
    middleware() {
        const route = store => next => async action => {
            if (action.type !== 'portal.route.find') return next(action);
            const {path} = action;
            if (typeof path !== 'string' || !path.includes('/')) return next(action);
            const [, method, ...params] = path.split('/');
            if (!method) return next(action);
            next({
                type: 'front.tab.show',
                component: utMethod('component/' + method),
                params,
                title: method,
                path
            });
        };

        const rpc = store => next => action => {
            if (action.method) {
                let importMethodParams = {};
                const $meta = fromJS({$http: {mtid: ((action.mtid === 'notification' && 'notification') || 'request')}});
                let methodParams = fromJS(cloneParams(action.params))
                    .mergeDeep($meta);

                if (action.$http) {
                    methodParams = methodParams.mergeDeep(fromJS({$http: action.$http}));
                }

                if (action.requestTimeout) {
                    importMethodParams = Object.assign({}, importMethodParams, {timeout: action.requestTimeout});
                }
                action.methodRequestState = 'requested';
                next(action);

                if (action.abort) {
                    action.methodRequestState = 'finished';
                    return next(action);
                }

                return utMethod(action.method, importMethodParams)(methodParams.toJS())
                    .then(result => {
                        action.result = result;
                        return result;
                    })
                    .catch(error => {
                        // Display a friendlier message on connection lost
                        if (error.type === 'PortHTTP.Generic' && error.message === 'Unexpected end of JSON input') {
                            error.message = 'Network connection lost';
                            error.print = 'Network connection lost';
                        }
                        action.error = error;
                        return error;
                    })
                    .then(() => {
                        action.methodRequestState = 'finished';
                        return next(action);
                    });
            }
            return next(action);
        };

        return [route, rpc];
    }
});
