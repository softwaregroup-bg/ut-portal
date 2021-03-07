// @ts-check
const {createElement} = require('react');
const {render} = require('react-dom');
const {renderToString} = require('react-dom/server');

const App = require('ut-front-devextreme/core/App');

const {REDUCE} = require('./actionTypes');

const pages = (state = {}, {type, payload, reducer}) => {
    if (type !== REDUCE) return state;
    return reducer({state, payload});
};

const tabMenu = (state = {tabs: []}) => {
    return state;
};

/** @type { import("../../handlers").handlerFactory } */
module.exports = ({
    import: {
        portalParamsGet,
        handleDispatchSet
    },
    lib: {
        middleware
    }
}) => ({
    async ready() {
        const {menu, ...params} = await portalParamsGet({});
        const reducers = Object.assign({}, ...await this.fireEvent('reducer', {}, 'asyncMap'), {pages, tabMenu});

        // @ts-ignore
        const container = createElement(App, {
            ...params,
            state: {
                portal: {menu}
            },
            reducers,
            middleware: middleware(),
            onDispatcher: handleDispatchSet
        });
        if (typeof document !== 'undefined') {
            render(container, document.getElementById('root'));
        } else {
            console.log(renderToString(container)); // eslint-disable-line
        }
    }
});
