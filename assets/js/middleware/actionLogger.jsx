'use strict';

export const ACTION_LOG_KEY = 'REDUX_ACTIONS';
export const ACTION_LOG_LIMIT = 150;

// If an action has this symbol as a key and its relative value is true, it will be excluded from the action log
export const EXCLUDE_ACTION_LOG = Symbol('Exclude Action');

export function initActionLogger(initial_actions=[]) {
    window.localStorage.setItem(ACTION_LOG_KEY, JSON.stringify(initial_actions));
}

// A redux middleware that saves all of a users actions for the current session, so that they can be replayed
// at a later time.
export default store => next => action => {
    // Don't include excluded actions
    if (action[EXCLUDE_ACTION_LOG]) {
        return next(action);
    }

    // Load the saved list and append the new action to it
    let actions = JSON.parse(window.localStorage.getItem(ACTION_LOG_KEY) || []);
    actions.push(action);

    // We only want to store up to the ACTION_LOG_LIMIT number of actions
    const slice_idx = actions.length > ACTION_LOG_LIMIT ? -(ACTION_LOG_LIMIT - 1) : 0;

    // Write the new list of actions to local storage
    window.localStorage.setItem(ACTION_LOG_KEY, JSON.stringify(actions.slice(slice_idx)));

    return next(action);
}
