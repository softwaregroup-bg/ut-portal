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

    async ready() {
        this.store = await this.bus.importMethod('portal.store.get')({});
    }

    exec(...params) {
        const $meta = params && params.length > 1 && params[params.length - 1];
        const method = ($meta && $meta.method);
        const reducer = method && this.findHandler(method + 'Reduce');
        this.store.dispatch(async(dispatch, getState) => {
            const payload = await super.exec(...arguments);
            if (reducer) dispatch({type: REDUCE, reducer, payload});
        });
    }
};
