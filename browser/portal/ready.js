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
    config = {},
    import: {
        portalParamsGet,
        handleDispatchSet
    },
    lib: {
        middleware
    }
}) => ({
    async ready() {
        const reducers = Object.assign({}, ...await this.fireEvent('reducer', {}, 'asyncMap'), {pages, tabMenu});

        // @ts-ignore
        const container = ({menu, rightMenu, rightMenuItems, state, ...params} = {}) => createElement(App, {
            ...params,
            state: {
                portal: {menu, rightMenu, rightMenuItems},
                ...state
            },
            reducers,
            middleware: middleware(),
            onDispatcher: handleDispatchSet
        });
        this.container = container;

        if (config.render !== undefined && !config.render) return;
        // @ts-ignore
        if (typeof document !== 'undefined') {
            render(this.container(await portalParamsGet({})), document.getElementById('root'));
        } else {
            console.log(renderToString(this.container(await portalParamsGet({})))); // eslint-disable-line
        }
    }
});
