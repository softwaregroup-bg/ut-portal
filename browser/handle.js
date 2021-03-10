const {REDUCE} = require('./portal/actionTypes');

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

    exec(...params) {
        const $meta = params && params.length > 1 && params[params.length - 1];
        const method = ($meta && $meta.method);
        switch (method) {
            case 'handle.dispatch.set':
                this.dispatch = params[0];
                return true;
            case 'handle.tab.show':
                if (typeof params[0] === 'function') {
                    return this.dispatch({type: 'front.tab.show', component: params[0]});
                } else {
                    return this.dispatch({
                        ...(Array.isArray(params[0])) ? {
                            component: params[0][0],
                            params: params[0][1]
                        } : params[0],
                        type: 'front.tab.show'
                    });
                }
        }
        const reducer = method && this.findHandler(method + 'Reduce');
        return this.dispatch(async(dispatch, getState) => {
            const payload = await super.exec(...arguments);
            if (reducer) dispatch({type: REDUCE, reducer, payload});
        });
    }
};
