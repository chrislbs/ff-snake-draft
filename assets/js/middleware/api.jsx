'use strict';

import 'isomorphic-fetch';
import { buildProps } from '../utils';
import { EXCLUDE_ACTION_LOG } from './actionLogger';

const API_ROOT = '/api/v1';

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// Use this action type for making action logs without all of the response data
export const API_ACTION_TYPE = 'API_ACTION_TYPE';

/*********************************************************************************************************************
 * A Redux middleware that interprets actions with the CALL_API symbol as a key. It performs the API call and
 * orchestrates three asynchronous redux actions that represent the possible state changes from making an AJAX request.
 *
 *      --- Fetching ---
 *      First the middleware dispatches a fetching action to indicate that an AJAX request has
 *      been made and we are waiting for a response from the server.
 *
 *      --- Success Response ---
 *      If we receive a success code from the AJAX request the middleware fires a success action that includes the json
 *      data returned from the API.
 *
 *      --- Failure Response ---
 *      If we receive a failure code from the AJAX request the middleware fires a failure action that includes json data
 *      with any relevant error messages returned from the API.
 *
 * The value associated with the symbol('CALL_API') key should always follow the following format:
 *
 *      {
 *          "endpoint": "/api/path/appended/to/API_ROOT/",
 *          "types": [FETCH_ACTION_KEY, SUCCESS_ACTION_KEY, FAILURE_ACTION_KEY],
 *          "method": "GET, POST, PUT... ", (Optional - defaults to GET)
 *          "data": <json-data-to-pass-to-API-endpoint>
 *      }
 *********************************************************************************************************************/
export default store => next => action => {
    const callAPI = action[CALL_API]; 

    // Just fire the passed action if this isn't an API call
    if (typeof callAPI === 'undefined') {
        return next(action);
    }

    let { endpoint } = callAPI;
    const { types, method, data } = callAPI;

    function actionWith(data) {
        let finalAction = Object.assign({}, action, data);
        delete finalAction[CALL_API];
        return finalAction;
    }

    // If a type was passed outside of the CALL_API symbol, fire an action without API params
    if (action.type) {
        next(actionWith({}));
    }

    // Fire the API_ACTION_TYPE so we can log this api request without all of the response data
    next({[CALL_API]: callAPI, type: API_ACTION_TYPE});

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState());
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.');
    }

    if (method && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) === -1) {
        throw new Error('Method must be one of: GET, POST, PUT, DELETE');
    }

    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types in this order [request_sent, request_success, request_failure]');
    }

    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.');
    } 

    const [requestType, successType, failureType] = types;

    // Dispatch the request_sent action. Make sure to include the EXCLUDE_ACTION_LOG key so this action is not stored, because
    // the initial action should trigger this middleware anyway.
    next(actionWith({ type: requestType, [EXCLUDE_ACTION_LOG]: true }));

    // Build the url for the API endpoint
    let fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;

    // Add query string if this is a GET request and data is passed
    fullUrl = (!method || method === 'GET') && data ?
        fullUrl + '?' + buildProps(data) :
        fullUrl;

    // Build the options object for the request
    const options = Object.assign({}, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }, // Only include body if data is passed and this is a POST or PUT method
        data && ['POST', 'PUT'].indexOf(method) >= 0 ? {
            body: JSON.stringify(Object.assign({}, data, {debug: store.getState()['settings'].get('debug', false)}))
        } : {}, // Only include method if it is passed. Defaults to GET
        method ? {
            method
        } : {}
    );

    function tryFetch() {
        return fetch(fullUrl, options)
            .then(response => {
                console.log('raw response: ', response);

                if (!response.ok) {
                    return Promise.reject(response);
                }

                // Check if this is a json response
                if (response.headers.get('Content-Type') === 'application/json') {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(response => {
                console.log('parsed response: ', response, fullUrl, options);
                next(actionWith({
                     response,
                     type: successType,
                     [EXCLUDE_ACTION_LOG]: true
                }));
            });
    }

    function handleFetchError(attempt=1) {
        return (error) => {

            console.log('error: ', error);

            error.json().then((response) => {
                console.log(`error from api request <${fullUrl}>: `, response);
                next(actionWith({
                    type: failureType,
                    error: response
                }));
            }).catch((error) => {
                console.log(`unhandled error from api request <${fullUrl}>: `, error);
                next(actionWith({
                    type: failureType,
                    error: error
                }));
            });
        };
    }

    tryFetch();
    //tryFetch().catch(handleFetchError());
}
