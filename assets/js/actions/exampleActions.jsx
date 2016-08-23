'use strict';

import { CALL_API } from '../middleware/api';

export const GET_EXAMPLE_DATA = 'GET_EXAMPLE_DATA';
export const GET_EXAMPLE_DATA_SUCCESS = 'GET_EXAMPLE_DATA_SUCCESS';
export const GET_EXAMPLE_DATA_FAILURE = 'GET_EXAMPLE_DATA_FAILURE';

export function getExampleData(args) {
    return {
        [CALL_API]: {
            endpoint: '/example/',
            types: [GET_EXAMPLE_DATA, GET_EXAMPLE_DATA_SUCCESS, GET_EXAMPLE_DATA_FAILURE],
            method: 'POST',
            data: args
        }
    };
};
