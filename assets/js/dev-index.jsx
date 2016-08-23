'use strict';

import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { Router, browserHistory, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';

const store = configureStore();

const historyType = window.IEVersion && window.IEVersion < 10 ? hashHistory : browserHistory;

const history = syncHistoryWithStore(historyType, store, {selectLocationState: state => state.router});

render(
    <Provider store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </Provider>,
    document.getElementById('react-root')
);
