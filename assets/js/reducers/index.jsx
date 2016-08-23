'use strict';

import * as ExampleReducers from './exampleReducers';
import * as SettingsReducers from './settingsReducers';
import { routerReducer as router } from 'react-router-redux';
import { combineReducers } from 'redux';

const appReducers = combineReducers(Object.assign(
    {},
    ExampleReducers,
    SettingsReducers,
    { router }
));

export default appReducers;
