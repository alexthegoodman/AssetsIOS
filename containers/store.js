global.__DEVELOPMENT__  = true;
global.__DEVTOOLS__     = false;

import React, {Component} 						from 'react';
import { applyMiddleware, combineReducers } 	from 'redux';
import { Provider } 							from 'react-redux';
import createStore                              from '../redux/create';
import ApiClient                                from '../helpers/ApiClient';
import getRoutes                                from './routes';

// get react-router-native straight from master
import { Link, nativeHistory, Route, Router, StackRoute } 		from 'react-router-native';
import { ConnectedRouter, syncHistoryWithStore }    from 'react-router-redux';
//import createHistory 								from 'history/createMemoryHistory';
//const newHistory 									= createHistory();

const client                = new ApiClient();
const store                 = createStore(nativeHistory, client, window.__data);

const history               = syncHistoryWithStore(nativeHistory, store);
console.info(history)
// nativeHistory.push('/');

//const DevTools 		= require('./DevTools/DevTools');

// subscribe to all redux updates, intercept routing
store.subscribe(function fetcher() {

    let state = store.getState();
    let currentPath = state.routing.locationBeforeTransitions.pathname;
    let segments = currentPath.split('/');

    console.info('Redux update', currentPath, state);

});

export default class Store extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router history={nativeHistory}>
					{getRoutes(store)}
				</Router>
			    {/*<DevTools />*/}
			</Provider>
		);
	}
}






