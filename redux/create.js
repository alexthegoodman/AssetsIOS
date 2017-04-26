import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import { routerMiddleware } from 'react-router-redux';
//import promiseMiddleware from 'redux-promise';
//import thunk             from 'redux-thunk';

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

// overrides Redux's createStore
export default function createStore(history, client, data) {

    // Sync dispatched route actions to the history
    const reduxRouterMiddleware = routerMiddleware(history);

    const middleware = [createMiddleware(client), reduxRouterMiddleware];

    // Set up dev tools
    let finalCreateStore;
    if (__DEVELOPMENT__ && __DEVTOOLS__) {

        const { persistState } = require('redux-devtools');
       // const DevTools = require('../containers/DevTools/DevTools');
        
        finalCreateStore = compose(

            applyMiddleware(...middleware),
           // window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        
        )(_createStore);
        
    } else {
    
        finalCreateStore = applyMiddleware(...middleware)(_createStore);
    
    }

    const reducer = require('./modules/reducer').default;

    const store = finalCreateStore(reducer, data);

    // if (__DEVELOPMENT__ && module.hot) {
    //     module.hot.accept('./modules/reducer', () => {
    //         store.replaceReducer(require('./modules/reducer'));
    //     });
    // }

    return store;

}
