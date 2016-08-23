'use strict';

// Action key that carries LOCAL_STORE call info interpreted by this Redux middleware.
export const LOCAL_STORE = Symbol('Local Store');

// A Redux middleware that interprets actions with LOCAL_STORE info specified.
// Performs the action and saves the new state object in the browsers local storage (if supported).
export default store => next => action => {
    const localStoreParams = action[LOCAL_STORE];
    if (typeof localStoreParams === 'undefined') {
        return next(action);
    }

    let { path, immutable } = localStoreParams;

    if (!path) {
        throw new Error('A redux state path is required to store a state object in localStorage');
    }

    immutable = immutable || false;

    let result = next(action);

    let newState = store.getState()[path];

    if (newState) {
        if (immutable) {
            newState = newState.toJS();
        }

        window.localStorage.setItem(path, JSON.stringify(newState));
    } else {
        window.localStorage.removeItem(path);
    }

    return result;
}
