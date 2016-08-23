'use strict';

import { CALL_API } from '../middleware/api';

export const GET_ALL_PLAYERS = 'GET_ALL_PLAYERS';
export const GET_ALL_PLAYERS_SUCCESS = 'GET_ALL_PLAYERS_SUCCESS';
export const GET_ALL_PLAYERS_FAILURE = 'GET_ALL_PLAYERS_FAILURE';

export function getAllPlayers() {
    return {
        [CALL_API]: {
            endpoint: '/players/',
            types: [GET_ALL_PLAYERS, GET_ALL_PLAYERS_SUCCESS, GET_ALL_PLAYERS_FAILURE]
        }
    };
};

export const CREATE_PLAYER = 'CREATE_PLAYER';
export const CREATE_PLAYER_SUCCESS = 'CREATE_PLAYER_SUCCESS';
export const CREATE_PLAYER_FAILURE = 'CREATE_PLAYER_FAILURE';

export function createPlayer(name, birthday) {
    return {
        [CALL_API]: {
            endpoint: '/players/',
            types: [CREATE_PLAYER, CREATE_PLAYER_SUCCESS, CREATE_PLAYER_FAILURE],
            method: 'POST',
            data: {
                name,
                birthday
            }
        }
    };
};

export const GET_PLAYER = 'GET_PLAYER';
export const GET_PLAYER_SUCCESS = 'GET_PLAYER_SUCCESS';
export const GET_PLAYER_FAILURE = 'GET_PLAYER_FAILURE';

export function getPlayer(id) {
    return {
        [CALL_API]: {
            endpoint: `/players/${id}/?`,
            types: [GET_PLAYER, GET_PLAYER_SUCCESS, GET_PLAYER_FAILURE]
        }
    };
};

export const DELETE_PLAYER = 'DELETE_PLAYER';
export const DELETE_PLAYER_SUCCESS = 'DELETE_PLAYER_SUCCESS';
export const DELETE_PLAYER_FAILURE = 'DELETE_PLAYER_FAILURE';

export function deletePlayer(id) {
    return {
        [CALL_API]: {
            endpoint: `/players/${id}/`,
            types: [DELETE_PLAYER, DELETE_PLAYER_SUCCESS, DELETE_PLAYER_FAILURE],
            method: 'DELETE'
        }
    };
};
