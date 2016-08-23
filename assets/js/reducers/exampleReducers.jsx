'use strict';

import { Map, List, fromJS } from 'immutable';
import * as ActionTypes from '../actions';

/********************************
 * Exmample Reducer
 *******************************/
export function example(
    state = fromJS({
        fetching: false
    }),
    action
) {
    switch(action.type) {
        case ActionTypes.GET_EXAMPLE_DATA:
            return state.set('fetching', true);
        case ActionTypes.GET_EXAMPLE_DATA_SUCCESS:
            return state.set('fetching', false)
                .set('data', fromJS(action.response));
        case ActionTypes.GET_EXAMPLE_DATA_FAILURE:
            return state.merge({
                fetching: false,
                error: action.error
            });
        default:
            return state;
    }
}
