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

        // GET_USER Methods
        case ActionTypes.GET_USER:
            return state.set('fetching', true);

        case ActionTypes.GET_USER_SUCCESS:
            return state.set('fetching', false)
                .set('active', fromJS(action.response));

        case ActionTypes.GET_USER_FAILURE:
            return state.merge({
                fetching: false,
                error: action.error
            });

        // DELETE_USER Methods
        case ActionTypes.DELETE_USER:
            return state.set('fetching', true);

        case ActionTypes.DELETE_USER_SUCCESS:
            console.log('action: ', action);
            const idx = state.get('all').findIndex(p => p.get('id') === action.response.id);

            // If the deleted user is in the list of all users, remove him/her. Otherwise just turn off the
            // fetching flag
            return idx === -1 ?
                state.set('fetching', false)
                    : state.set('fetching', false).deleteIn(['all', idx]);

        case ActionTypes.DELETE_USER_FAILURE:
            return state.merge({
                fetching: false,
                error: action.error
            });

        default:
            return state;
    }
}
