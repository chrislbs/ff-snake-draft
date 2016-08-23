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

export const GET_USER = 'GET_USER';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

export function getUser(id) {
    return {
        [CALL_API]: {
            endpoint: `/users/${id}/?`,
            types: [GET_USER, GET_USER_SUCCESS, GET_USER_FAILURE]
        }
    };
};

export const DELETE_USER = 'DELETE_USER';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export function deleteUser(id) {
    return {
        [CALL_API]: {
            endpoint: `/users/${id}/`,
            types: [DELETE_USER, DELETE_USER_SUCCESS, DELETE_USER_FAILURE],
            method: 'DELETE',
            data: {
                id
            }
        }
    };
};
