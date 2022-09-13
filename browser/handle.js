const {REDUCE} = require('./portal/actionTypes');
const template = require('ut-function.template');
module.exports = (...params) => class handle extends require('ut-port-script')(...params) {
    get defaults() {
        return {
            logLevel: 'warn',
            namespace: ['handle'],
            imports: [/\.handle$/]
        };
    }

    request(event, ...rest) {
        if (event && typeof event.persist === 'function') {
            event = Object.create(null, {
                target: {
                    configurable: false,
                    enumerable: false,
                    value: event.target,
                    writable: false
                }
            });
        }
        return super.request(event, ...rest);
    }

    action(...args) {
        const [[action, actionParams]] = args;
        if (typeof action.action === 'function') return action.action(actionParams);
        if ((action.type || 'tab') === 'tab') {
            return this.dispatch({
                tab: this.bus.importMethod(`component/${template(action.action, actionParams)}`),
                params: action.params && JSON.parse(template(JSON.stringify(action.params), actionParams, {}, 'json')),
                type: 'front.tab.show'
            });
        }
        return false;
    }

    tab(...args) {
        if (typeof args[0] === 'function') {
            return this.dispatch({type: 'front.tab.show', tab: args[0]});
        } else {
            return this.dispatch({
                ...(Array.isArray(args[0])) ? {
                    tab: args[0][0],
                    params: args[0][1]
                } : args[0],
                type: 'front.tab.show'
            });
        }
    }

    exec(...args) {
        const $meta = args && args.length > 1 && args[args.length - 1];
        const method = ($meta && $meta.method);
        switch (method) {
            case 'handle.dispatch.set':
                this.dispatch = args[0];
                return true;
            case 'handle.tab.show': return this.tab(...args);
            case 'handle.error.open':
                return this.dispatch({
                    type: 'front.error.open',
                    error: args[0]
                });
            case 'handle.action': return this.action(...args);
            default:
        }
        const reducer = method && this.findHandler(method + 'Reduce');
        return this.dispatch(async(dispatch, _) => {
            const payload = await super.exec(...arguments);
            if (reducer) dispatch({type: REDUCE, reducer, payload});
            return payload;
        });
    }
};
