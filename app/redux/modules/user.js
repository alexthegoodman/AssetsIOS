const FETCH_USER_SUCCESS = 'browse/FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'browse/FETCH_USER_FAILURE';

const initialState = {
    userHash: 0,
    userData: {}
};

import update from 'immutability-helper';
export default function reducer(state = initialState, action = {}) {
    
    switch (action.type) {

        case FETCH_USER_SUCCESS:

            return update(state, {
                userHash: { $set: action.userHash }
            });

        case FETCH_USER_FAILURE:

            return update(state, {
                userHash: { $set: -1 }
            });

		default:
            return state;

    }
}

export function fetchUserSuccessAction(userHash) {
    return {
        type:   FETCH_USER_SUCCESS,
        userHash: userHash
    }
}

export function fetchUserFailureAction() {
    return {
        type:   FETCH_USER_FAILURE
    }
}
