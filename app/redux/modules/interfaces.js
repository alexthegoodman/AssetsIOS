const SHOW_CONTENT = 'browse/SHOW_CONTENT';
const HIDE_CONTENT = 'browse/HIDE_CONTENT';

const PICK_PROJECT = 'browse/PICK_PROJECT';

const initialState = {
    showContent: false,
    projectSelection: false
};

import update from 'immutability-helper';
export default function reducer(state = initialState, action = {}) {
    
    switch (action.type) {

        case SHOW_CONTENT:

            return update(state, {
                showContent: { $set: true }
            });

        case HIDE_CONTENT:

            return update(state, {
                showContent: { $set: false }
            });

        case PICK_PROJECT:

            return update(state, {
                projectSelection: { $set: action.projectId }
            });

		default:
            return state;

    }
}

export function showContentAction() {
    return {
        type:   SHOW_CONTENT
    }
}

export function hideContentAction() {
    return {
        type:   HIDE_CONTENT
    }
}

export function pickProjectAction(projectId) {
    return {
        type:   PICK_PROJECT,
        projectId: projectId
    }
}
