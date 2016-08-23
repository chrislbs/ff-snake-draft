'use strict';

import { Map, List, fromJS } from 'immutable';
import * as ActionTypes from '../actions';

/********************************
 * Players Reducer
 *******************************/
export function players(
    state = fromJS({
        fetching: false,
        all: []
    }),
    action
) {
    switch(action.type) {
        // GET_ALL_PLAYERS Methods
        case ActionTypes.GET_ALL_PLAYERS:
            return state.set('fetching', true);

        case ActionTypes.GET_ALL_PLAYERS_SUCCESS:
            return state.set('fetching', false)
                .set('all', fromJS(action.response));

        case ActionTypes.GET_ALL_PLAYERS_FAILURE:
            return state.merge({
                fetching: false,
                error: action.error
            });

        // CREATE_PLAYER Methods
        case ActionTypes.CREATE_PLAYER:
            return state.set('fetching', true);

        case ActionTypes.CREATE_PLAYER_SUCCESS:
            // Add the new player to the list of all players
            return state.set('fetching', false)
                .update('all', all => all.push(fromJS(action.response)));

        case ActionTypes.CREATE_PLAYER_FAILURE:
            return state.merge({
                fetching: false,
                error: action.error
            });

        // GET_PLAYER Methods
        case ActionTypes.GET_PLAYER:
            return state.set('fetching', true);

        case ActionTypes.GET_PLAYER_SUCCESS:
            return state.set('fetching', false)
                .set('active', fromJS(action.response));

        case ActionTypes.GET_PLAYER_FAILURE:
            return state.merge({
                fetching: false,
                error: action.error
            });

        // DELETE_PLAYER Methods
        case ActionTypes.DELETE_PLAYER:
            return state.set('fetching', true);

        case ActionTypes.DELETE_PLAYER_SUCCESS:
            const idx = state.get('all').findIndex(p => p.get('id') === action.response.id);

            // If the deleted player is in the list of all players, remove him/her. Otherwise just turn off the
            // fetching flag
            return idx === -1 ?
                state.set('fetching', false)
                    : state.set('fetching', false).deleteIn(['all', idx]);

        case ActionTypes.DELETE_PLAYER_FAILURE:
            return state.merge({
                fetching: false,
                error: action.error
            });

        default:
            return state;
    }
}
