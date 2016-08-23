'use strict';

import * as ExampleReducers from './exampleReducers';
import * as UserReducers from './userReducers';
import * as PlayerReducers from './playerReducers';
import * as SettingsReducers from './settingsReducers';
import { routerReducer as router } from 'react-router-redux';
import { combineReducers } from 'redux';

const appReducers = combineReducers(Object.assign(
    {},
    ExampleReducers,
    UserReducers,
    PlayerReducers,
    SettingsReducers,
    { router }
));

export default appReducers;
