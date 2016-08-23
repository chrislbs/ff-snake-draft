'use strict';

import { CALL_API } from '../middleware/api';

export const GET_ALL_USERS = 'GET_ALL_USERS';
export const GET_ALL_USERS_SUCCESS = 'GET_ALL_USERS_SUCCESS';
export const GET_ALL_USERS_FAILURE = 'GET_ALL_USERS_FAILURE';

export function getAllUsers() {
    return {
        [CALL_API]: {
            endpoint: '/users/',
            types: [GET_ALL_USERS, GET_ALL_USERS_SUCCESS, GET_ALL_USERS_FAILURE]
        }
    };
};

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export function createUser(username, age) {
    return {
        [CALL_API]: {
            endpoint: '/users/',
            types: [CREATE_USER, CREATE_USER_SUCCESS, CREATE_USER_FAILURE],
            method: 'POST',
            data: {
                username,
                age
            }
        }
    };
};
