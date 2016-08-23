'use strict';

import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory, hashHistory } from 'react-router';
import api from  '../middleware/api';
import localStore from '../middleware/localStore';
import actionLogger, { initActionLogger } from '../middleware/actionLogger';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import { fromJS } from 'immutable';

// For IE 9 and lower we need to use hashHistory. All other browsers should support browserHistory
const reduxRouterMiddleware = routerMiddleware(window.IEVersion && window.IEVersion < 10 ? hashHistory : browserHistory);

// Initialize the action logger
initActionLogger();

// Compose a store creator for dev
const createStoreDev = applyMiddleware(
    reduxRouterMiddleware, // Connects redux-router data to the Redux store
    thunk, // Middleware that allows for Asynchronous redux actions
    api, // Provides an interface for creating actions that make AJAX requests to an API
    localStore, // Provides an interface for creating actions that store state in the localStore
    actionLogger, // Keeps track of actions so we can rerun a user's entire session
    createLogger() // Logs each action and relevant info for debugging
)(createStore);

// Compose a store creator for prod
const createStoreProd = applyMiddleware(
    reduxRouterMiddleware,
    thunk,
    api,
    localStore,
    actionLogger
)(createStore);

export default function configureStore(env = 'dev') {
    if (env === 'prod') {
        return createStoreProd(rootReducer, {settings: fromJS({env})});
    } else {
        return createStoreDev(rootReducer, {settings: fromJS({env})});
    }
}
