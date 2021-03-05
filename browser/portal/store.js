const {combineReducers, createStore} = require('redux');
const front = require('ut-front-devextreme/core/reducers');
const {connectRouter} = require('connected-react-router');

const {REDUCE} = require('./actionTypes');

const pages = (state = {}, {type, payload, reducer}) => {
    if (type !== REDUCE) return state;
    return reducer({state, payload});
};

const tabMenu = (state = {tabs: []}) => {
    return state;
};

/** @type { import("../../handlers").libFactory } */
module.exports = ({
    lib: {
        middleware
    }
}) => ({
    store(reducers, history, preloadedState) {
        return createStore(
            combineReducers({
                router: connectRouter(history),
                pages,
                tabMenu, // TODO! remove after ut-front-react is gone
                ...front,
                ...reducers
            }),
            preloadedState,
            middleware(history)
        );
    }
});
