'use strict';

import { Map, List, fromJS } from 'immutable';
import * as ActionTypes from '../actions';

/********************************
 * Users Reducer
 *******************************/
export function users(
    state = fromJS({
        fetching: false,
        all: []
    }),
    action
) {
    switch(action.type) {
        // GET_USERS Methods
        case ActionTypes.GET_ALL_USERS:
            return state.set('fetching', true);

        case ActionTypes.GET_ALL_USERS_SUCCESS:
            return state.set('fetching', false)
                .set('all', fromJS(action.response));

        case ActionTypes.GET_ALL_USERS_FAILURE:
            return state.merge({
                fetching: false,
                error: action.error
            });

        // CREATE_USER Methods
        case ActionTypes.CREATE_USER:
            return state.set('fetching', true);

        case ActionTypes.CREATE_USER_SUCCESS:
            // Add the new user to the list of all users
            return state.set('fetching', false)
                .update('all', all => all.push(fromJS(action.response)));

        case ActionTypes.CREATE_USER_FAILURE:
            return state.merge({
                fetching: false,
                error: action.error
            });

        default:
            return state;
    }
}
