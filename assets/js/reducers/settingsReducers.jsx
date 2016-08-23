'use strict';

import { Map, fromJS } from 'immutable';
import * as ActionTypes from '../actions';

export function settings(
    state = fromJS({
        env: 'dev',
        debug: false
    }),
    action
) {
    switch(action.type) {
        case ActionTypes.TOGGLE_DEBUG:
            return state.update('debug', false, x => !x);
        default:
            return state;
    }
}
