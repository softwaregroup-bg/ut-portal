// @ts-check
const thunk = require('redux-thunk').default;
const {isImmutable, fromJS} = require('immutable');
const {composeWithDevTools} = require('redux-devtools-extension');
const {routerMiddleware} = require('connected-react-router');
const {middleware: front} = require('ut-front-devextreme/core');

const {REDUCE} = require('./actionTypes');
const {applyMiddleware} = require('redux');

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

const composeEnhancers = composeWithDevTools({
    serialize: true,
    actionSanitizer: action => {
        // @ts-ignore
        if (action.type === REDUCE && action.reducer) {
            return {
                ...action,
                // @ts-ignore
                type: `handler ${action.reducer.name}`
            };
        } else if (typeof action.type === 'symbol') {
            const actionCopy = {
                ...action
            }; // Don't change the original action
            actionCopy.type = action.type.toString(); // DevTools doesn't work with Symbols
            return actionCopy;
        }
        return action;
    }
});

/** @type { import("../../handlers").libFactory } */
module.exports = ({
    utMethod
}) => ({
    middleware(history) {
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

        return composeEnhancers(applyMiddleware(thunk, front, route, rpc, routerMiddleware(history)));
    }
});
