const cloneParams = (params) => {
    if (params instanceof Array) {
        return params.slice();
    } else {
        return Object.assign({}, params);
    }
};

/** @type { import("../..").libFactory } */
module.exports = ({
    utMethod,
    utMeta,
    lib: {
        resetCache
    }
}) => ({
    middleware() {
        const route = _store => next => action => {
            if (action.type !== 'portal.route.find') return next(action);
            const {pathname: path, searchParams} = new URL('ut-portal:' + action.path);
            if (typeof path !== 'string' || !path.includes('/')) return next(action);
            const [, method, ...rest] = path.split('/');
            if (!method) return next(action);
            next({
                type: 'front.tab.show',
                tab: utMethod('component/' + method),
                params: {
                    ...Object.fromEntries(searchParams.entries()),
                    ...rest.length > 0 && {id: rest.join('/')}
                },
                title: method,
                path: action.path
            });
        };

        const page = _store => next => action => (action.type === 'portal.component.get')
            ? utMethod('component/' + action.page)(action.params || {}, utMeta()).then(result => result?.component ? result.component(action.params || {}) : result)
            : next(action);

        const closeLegacyTab = store => next => action => {
            if (String(action.type) !== 'Symbol(REMOVE_TAB)') return next(action);
            const data = store.getState()?.portal?.tabs?.find?.(({path}) => path === action.pathname);
            return next(data ? {
                type: 'front.tab.close',
                data
            } : action);
        };

        const resetCacheOnLogout = _ => next => action => {
            if (String(action.type) === 'Symbol(LOGOUT)') resetCache();
            return next(action);
        };

        const rpc = _store => next => action => {
            if (action.method) {
                action.methodRequestState = 'requested';
                next(action);

                if (action.abort) {
                    action.methodRequestState = 'finished';
                    return next(action);
                }

                return utMethod(action.method, {
                    timeout: action.requestTimeout
                })(cloneParams(action.params), utMeta())
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

        return [route, page, closeLegacyTab, rpc, resetCacheOnLogout];
    }
});
