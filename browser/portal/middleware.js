// @ts-check
const merge = require('ut-function.merge');

const cloneParams = (params) => {
    if (params instanceof Array) {
        return params.slice();
    } else {
        return Object.assign({}, params);
    }
};

/** @type { import("../../handlers").libFactory } */
module.exports = ({
    utMethod,
    utMeta
}) => ({
    middleware() {
        const route = store => next => action => {
            if (action.type !== 'portal.route.find') return next(action);
            const {pathname: path, searchParams} = new URL('ut-portal:' + action.path);
            if (typeof path !== 'string' || !path.includes('/')) return next(action);
            const [, method, ...rest] = path.split('/');
            if (!method) return next(action);
            next({
                type: 'front.tab.show',
                tab: utMethod('component/' + method),
                ...rest.length > 0 && {
                    params: {
                        ...Object.fromEntries(searchParams.entries()),
                        id: rest.join('/')
                    }
                },
                title: method,
                path
            });
        };

        const closeLegacyTab = store => next => action => {
            if (String(action.type) !== 'Symbol(REMOVE_TAB)') return next(action);
            const data = store.getState()?.portal?.tabs?.find?.(({path}) => path === action.pathname);
            return next(data ? {
                type: 'front.tab.close',
                data
            } : action);
        };

        const rpc = store => next => action => {
            if (action.method) {
                let importMethodParams = {};
                const methodParams = merge(
                    cloneParams(action.params), {
                        $http: {
                            mtid: action.mtid === 'notification' ? 'notification' : 'request'
                        }
                    }
                );

                if (action.$http) {
                    merge(methodParams, {$http: action.$http});
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

                return utMethod(action.method, importMethodParams)(methodParams, utMeta())
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

        return [route, closeLegacyTab, rpc];
    }
});
