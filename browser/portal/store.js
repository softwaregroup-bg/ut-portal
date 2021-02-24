const {combineReducers, createStore} = require('redux');
const {routerReducer: routing} = require('react-router-redux');
const front = require('ut-front-devextreme/core/reducers');

const {REDUCE} = require('./actionTypes');

const pages = (state = {}, {type, payload, reducer}) => {
    if (type !== REDUCE) return state;
    return reducer({state, payload});
};

/** @type { import("../../handlers").libFactory } */
module.exports = ({
    lib: {
        middleware
    }
}) => ({
    store(reducers, preloadedState) {
        return createStore(
            combineReducers({
                routing,
                pages,
                ...front,
                ...reducers
            }),
            preloadedState,
            middleware()
        );
    }
});
