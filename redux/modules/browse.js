const FETCH_PROJECTS               = 'browse/FETCH_PROJECTS';
const FETCH_PROJECTS_SUCCESS       = 'browse/FETCH_PROJECTS_SUCCESS';
const FETCH_PROJECTS_FAILURE       = 'browse/FETCH_PROJECTS_FAILURE';

const FETCH_PROJECTS_EMPTY       = 'browse/FETCH_PROJECTS_EMPTY';

const FETCH_PROJECT_USERS               = 'browse/FETCH_PROJECT_USERS';
const FETCH_PROJECT_USERS_SUCCESS       = 'browse/FETCH_PROJECT_USERS_SUCCESS';
const FETCH_PROJECT_USERS_FAILURE       = 'browse/FETCH_PROJECT_USERS_FAILURE';

const FETCH_PROJECT_COMMENTS               = 'browse/FETCH_PROJECT_COMMENTS';
const FETCH_PROJECT_COMMENTS_SUCCESS       = 'browse/FETCH_PROJECT_COMMENTS_SUCCESS';
const FETCH_PROJECT_COMMENTS_FAILURE       = 'browse/FETCH_PROJECT_COMMENTS_FAILURE';

const FETCH_ASSET_COMMENT               = 'browse/FETCH_ASSET_COMMENT';
const FETCH_ASSET_COMMENT_SUCCESS       = 'browse/FETCH_ASSET_COMMENT_SUCCESS';
const FETCH_ASSET_COMMENT_FAILURE       = 'browse/FETCH_ASSET_COMMENT_FAILURE';

const LIKE_ASSET_COMMENT_SUCCESS       = 'browse/LIKE_ASSET_COMMENT_SUCCESS';
const LIKE_ASSET_COMMENT_FAILURE       = 'browse/LIKE_ASSET_COMMENT_FAILURE';

const FETCH_PHASE_SUCCESS = 'browse/FETCH_PHASE_SUCCESS';
const FETCH_PHASE_FAILURE = 'browse/FETCH_PHASE_FAILURE';

const SET_CURRENT_PROJECT_SUCCESS = 'browse/SET_CURRENT_PROJECT_SUCCESS';
const SET_CURRENT_PROJECT_FAILURE = 'browse/SET_CURRENT_PROJECT_FAILURE';

const initialState = {
    userProjects: {},
    projectUsers: {},
    projectComments: {},
    gotProjects: false,
    gotProjectUsers: false,
    gotProjectComments: {},
	gotPhase: false,
    currentPhase: {},
    currentPhaseData: {},
    currentProject: {},
    setProject: false
};

import update from 'immutability-helper';
export default function reducer(state = initialState, action = {}) {
    
    switch (action.type) {

    	case FETCH_PROJECTS_SUCCESS:

    		const { userProjects, gotProjects } = action;

    		return {
                ...state,
                userProjects: userProjects,
                gotProjects: gotProjects
            };

    	case FETCH_PROJECTS_FAILURE:

    		// consider add general in-app alert
    		// and pop it up here

    		return {
                ...state,
                gotProjects: action.gotProjects
            };

        case FETCH_PROJECTS_EMPTY:

            return {
                ...state,
                userProjects: action.userProjects,
                gotProjects: action.gotProjects
            };

        case FETCH_PROJECT_USERS_SUCCESS:

            const { projectUsers, gotProjectUsers } = action;

            return {
                ...state,
                projectUsers: projectUsers,
                gotProjectUsers: gotProjectUsers
            };
		case FETCH_PROJECT_USERS_FAILURE:

            return {
                ...state,
                gotProjectUsers: action.gotProjectUsers
            };
		case FETCH_PROJECT_COMMENTS_SUCCESS:

            const { projectComments, gotProjectComments, projectId } = action;

			return update(state, {
                projectComments: {
                    [projectId]: { $set: projectComments }
                },
                gotProjectComments: {
                    [projectId]: { $set: gotProjectComments }
                }
            });

        case FETCH_PROJECT_COMMENTS_FAILURE:

			return update(state, {
                gotProjectComments: {
                    [action.projectId]: { $set: action.gotProjectComments }
                }
            });

        case FETCH_ASSET_COMMENT_SUCCESS:

            const { commentData, assetId } = action;
 			return update(state, {
                projectComments: {
                    [state.currentPhase.projectId]: {
                        [assetId]: { $set: commentData }
                    }
                }
            });
		case FETCH_ASSET_COMMENT_FAILURE:

            return state;

		case FETCH_PHASE_SUCCESS:

            console.info(action);

            return update(state, {
                gotPhase: { $set: true },
                currentPhase: {
                    projectId: { $set: action.projectId },
                    phaseId: { $set: action.phaseId }, 
                    phaseImagesList: { $set: action.phaseImagesList },
                    phaseList: { $set: action.phaseList },
                    inView: { $set: false }
                },
                currentPhaseData: { $set: action.phaseData }
            });

        case FETCH_PHASE_FAILURE:

            let nextState = $.extend({}, state);
            nextState.gotPhase = false;

            return nextState;

        case SET_CURRENT_PROJECT_SUCCESS:

            return update(state, {
                currentProject: { $set: action.currentProject },
                setProject: { $set: action.setProject }
            });

        case SET_CURRENT_PROJECT_FAILURE:

            return update(state, {
                setProject: { $set: action.setProject }
            });

		default:
            return state;

    }
}

export function fetchProjectsSuccessAction(userProjects) {
    return {
        type:           FETCH_PROJECTS_SUCCESS,
        userProjects:   userProjects,
        gotProjects:    true
    };
}

export function fetchProjectsFailureAction() {
    return {
        type:           FETCH_PROJECTS_FAILURE,
        gotProjects:    false
    };
}

export function fetchProjectsEmptyAction() {
    return {
        type:           FETCH_PROJECTS_EMPTY,
        userProjects:   {},
        gotProjects:    true
    };
}

export function fetchProjectUsersSuccessAction(projectUsers) {
    return {
        type:           FETCH_PROJECT_USERS_SUCCESS,
        projectUsers:   projectUsers,
        gotProjectUsers: true
    };
}

export function fetchProjectUsersFailureAction() {
    return {
        type:               FETCH_PROJECT_USERS_FAILURE,
        gotProjectUsers:    false
    };
}

export function fetchProjectCommentsSuccessAction(projectComments, projectId) {
    return {
        type:               FETCH_PROJECT_COMMENTS_SUCCESS,
        projectComments:    projectComments,
        gotProjectComments: true,
        projectId:          projectId
    };
}

export function fetchProjectCommentsFailureAction(projectId) {
    return {
        type:                   FETCH_PROJECT_COMMENTS_FAILURE,
        gotProjectComments:     false,
        projectId:              projectId
    };
}

export function fetchAssetCommentSuccessAction(commentData, assetId, projectId) {
    return {
        type:           FETCH_ASSET_COMMENT_SUCCESS,
        commentData:    commentData,
        assetId:        assetId,
        projectId:      projectId
    };
}

export function fetchAssetCommentFailureAction() {
    return {
        type:   FETCH_ASSET_COMMENT_FAILURE
    };
}

export function likeAssetCommentSuccessAction(commentId, assetId, projectId, userHash) {
    return {
        type:           LIKE_ASSET_COMMENT_SUCCESS,
        commentId:      commentId,
        assetId:        assetId,
        projectId:      projectId,
        userHash:         userHash
    };
}

export function likeAssetCommentFailureAction() {
    return {
        type:   LIKE_ASSET_COMMENT_FAILURE
    };
}

export function fetchPhaseSuccessAction(projectId, phaseId, phaseImagesList, phaseList, phaseData) {
    return {
        type:           FETCH_PHASE_SUCCESS,
        gotPhase:       true,
        projectId:      projectId,
        phaseId:        phaseId, 
        phaseImagesList: phaseImagesList, 
        phaseList:      phaseList, 
        phaseData:      phaseData
    }
}

export function fetchPhaseFailureAction() {
    return {
        type:   FETCH_PHASE_FAILURE,
        gotPhase: false
    }
}

export function setCurrentProjectSuccessAction(currentProject) {
    return {
        type:           SET_CURRENT_PROJECT_SUCCESS,
        currentProject:   currentProject,
        setProject:    true
    };
}

export function setCurrentProjectFailureAction() {
    return {
        type:           SET_CURRENT_PROJECT_FAILURE,
        setProject:    false
    };
}
