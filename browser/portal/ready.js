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

const tabMenu = (state = {tabs: [], active: {}}, {type, payload}) => {
    if (type !== '@@router/LOCATION_CHANGE') return state;
    return {
        ...state,
        active: {
            pathname: payload.location.pathname + payload.location.search
        }
    };
};

/** @type { import("../../handlers").handlerFactory } */
module.exports = ({
    utMeta,
    config: {render: shouldRender, ...config} = {},
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
            ...config,
            ...params,
            state: {
                portal: {menu, rightMenu, rightMenuItems},
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
        // @ts-ignore
        if (typeof document !== 'undefined') {
            render(this.container(await portalParamsGet({}, utMeta())), document.getElementById('root'));
        } else {
            console.log(renderToString(this.container(await portalParamsGet({}, utMeta())))); // eslint-disable-line
        }
    }
});
