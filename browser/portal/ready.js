// @ts-check
const {createElement} = require('react');
const {render} = require('react-dom');
const {renderToString} = require('react-dom/server');
const {createHashHistory, createMemoryHistory} = require('history');

const App = require('ut-front-devextreme/core/App');

/** @type { import("../../handlers").handlerFactory } */
module.exports = ({
    import: {
        portalParamsGet
    },
    lib: {
        store
    }
}) => ({
    async ready() {
        const {menu, ...params} = await portalParamsGet({});

        this.history = (typeof window !== 'undefined') ? createHashHistory() : createMemoryHistory();
        this.store = store(
            Object.assign({}, ...await this.fireEvent('reducer', {}, 'asyncMap')),
            this.history,
            {portal: {menu}}
        );
        // @ts-ignore
        const container = createElement(App, {...params, store: this.store, history: this.history});
        if (typeof document !== 'undefined') {
            render(container, document.getElementById('root'));
        } else {
            console.log(renderToString(container)); // eslint-disable-line
        }
    }
});
