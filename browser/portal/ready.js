// @ts-check
const {createElement} = require('react');
const {render} = require('react-dom');
const {renderToString} = require('react-dom/server');

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

        this.store = store(
            await this.fireEvent('reducer', {}, 'asyncMap'),
            {portal: {menu}}
        );
        // @ts-ignore
        const container = createElement(App, {...params, store: this.store});
        if (typeof document !== 'undefined') {
            render(container, document.getElementById('root'));
        } else {
            console.log(renderToString(container)); // eslint-disable-line
        }
    }
});
