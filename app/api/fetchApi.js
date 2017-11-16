// import * as global              from '../redux/modules/global';
import * as browse                  from '../redux/modules/browse';
import * as interfaces              from '../redux/modules/interfaces';
import * as user                    from '../redux/modules/user';

import ApiClient            from './client';
const client                = new ApiClient();

export default class FetchApi {

    constructor(store) {
        console.info('init FetchApi', store)
        // makes standardized call and also updates system in standard way,
        // allows consistent updates from any location in the app, and edit all api calls in 1 spot
        this.store = store;
    }

    refreshPhaseComments(userHash, projectId, phaseImagesList) {

        console.info('-api- refreshPhaseComments', userHash, projectId, phaseImagesList)

        let self = this;
        let store = this.store;

        // load comment data for each image
        if (Object.keys(phaseImagesList).length > 0) {

            let browseInfo = {
                userHash: userHash,
                phaseImagesList: JSON.stringify(phaseImagesList)
            }

            client.get('/get/comments', browseInfo).then(
                (data) => {

                    console.info('get/comments', data, browseInfo);

                    if (typeof data['ProjectComments'] != 'undefined' &&
                        data['ProjectComments'] != false) {
                        store.dispatch(browse.fetchProjectCommentsSuccessAction(data['ProjectComments'], projectId));
                    } else {
                        store.dispatch(browse.fetchProjectCommentsFailureAction(projectId));
                    }

                }, (err) => {
                    //console.log(err);
                    store.dispatch(browse.fetchProjectCommentsFailureAction(projectId));
                }
            );
        }
    }

    // ATTN - should also return promise, return the api data
    // see about try in promise or promise in try
    // fetchUsers(userHashes) {

    //     let store = this.store;

    //     try {

    //         store.dispatch(users.startGetUsers());

    //         let privateHash = '47LlOpPJ5YmgDS6ctuGz0ChqQFVbeTR2';

    //         let userInfo = {
    //             privateHash:    privateHash,
    //             hashType:       'public',
    //             userHashes:     JSON.stringify(userHashes),
    //             filter:         false,
    //             sort:           false,
    //             search:         false
    //         }

    //         client.get('/get/users/', userInfo).then(
    //             (userData) => {

    //             if (userData['success']) {

    //                 console.info('/get/users/', userData);

    //                 store.dispatch(users.successGetUsers(userData['returnUserData']));

    //             } else {
    //                 throw ['Users Read Error 212', userData, userInfo];
    //             }

    //         }).catch((err) => {
    //             throw ['Users Read Error 211', err];
    //         });

    //     } catch (err) {
    //         console.error(err);
    //         // this.context.mixpanel.track('web request error', { time: new Date(), errorData: err });
    //         store.dispatch(users.failureGetUsers());
    //     }

    // }
}

// simply use sockets to listen and run fetch functions? on('refreshReplies')->fetchReplies
// never socket.emit on client, simply use for instant updates. api call to comment, call emits a refresh to all clients.
// this way, sockets get out of the way and only need to exist here in Index
// all client. calls must be made in new /api/
// /api/ holds fetch, update, edit, etc client.calls and the redux calls
// allows api.call(stuff) which both calls the api and then updates the system, 1 line.
// also clean like /models/, standarixed logging, available throughout the app for re-use
