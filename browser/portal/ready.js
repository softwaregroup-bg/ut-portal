// @ts-check
const {createElement} = require('react');
const {render} = require('react-dom');
const {renderToString} = require('react-dom/server');
const merge = require('ut-function.merge');
const app = require('ut-prime/core/App');
const App = app.default || app; // for vite

const {REDUCE} = require('./actionTypes');

const pages = (state = {}, {type, payload, reducer}) => {
    if (type !== REDUCE) return state;
    return reducer({state, payload});
};

const tabMenu = (state = {tabs: [], active: {}}, {type, payload}) => {
    if (type !== '@@router/LOCATION_CHANGE') return state;
    return {
        ...state,
        active: {
            pathname: payload.location.pathname + payload.location.search
        }
    };
};

/** @type { import("../..").handlerFactory } */
module.exports = ({
    utMeta,
    config: {render: shouldRender, ...config} = {},
    import: {
        portalParamsGet,
        handleDispatchSet
    },
    lib: {
        middleware
    },
    config: {
        customization,
        theme,
        portalName,
        devTool
    } = {}
}) => ({
    async ready() {
        const reducers = Object.assign({}, ...await this.fireEvent('reducer', {}, 'asyncMap'), {pages, tabMenu});

        // @ts-ignore
        const container = ({menu, rightMenu, rightMenuItems, portal, state, ...appParams} = {}) => createElement(App, {
            ...config,
            ...appParams,
            state: {
                portal: {menu, rightMenu, rightMenuItems, ...portal},
                ...state
            },
            reducers,
            middleware: middleware(),
            onDispatcher: dispatch => {
                handleDispatchSet(dispatch);
                this.fireEvent('component.dispatch.ready', {dispatch}, 'asyncMap');
            }
        });
        this.container = container;

        if (shouldRender !== undefined && !shouldRender) return;
        const params = merge(await portalParamsGet({}, utMeta()), {
            customization,
            theme,
            portalName,
            devTool
        });
        // @ts-ignore
        if (typeof document !== 'undefined') {
            render(this.container(params), document.getElementById('root'));
        } else {
            console.log(renderToString(this.container(params))); // eslint-disable-line
        }
    }
});
