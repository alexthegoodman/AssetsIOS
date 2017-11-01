// index file. pulls in routes.js

global.__DEVELOPMENT__  = true;
global.__DEVTOOLS__     = false;

import React, {Component} 						from 'react';
import { applyMiddleware, combineReducers } 	from 'redux';
import { Provider, connect } 							from 'react-redux';
import createStore                              from '../redux/create';
import ApiClient                                from '../helpers/ApiClient';
import Routes                                from './routes';

import browse             from '../redux/modules/browse';
import user               from '../redux/modules/user';

import {
    Text,
    View
} from 'react-native';

import { addNavigationHelpers } from 'react-navigation';

console.info(Routes.router.getActionForPathAndParams('Login'))

const initialState = Routes.router.getStateForAction(Routes.router.getActionForPathAndParams('Login'));

const navReducer = (state = initialState, action) => {
	const nextState = Routes.router.getStateForAction(action, state);
	return nextState || state;
};

// Integrate React Navigation with Redux
// no need to ever edit this file except the appReducer
const appReducer = combineReducers({
	nav: navReducer,
	browse,
	user
});

class NavStore extends React.Component {
	render() {
		return (
			<Routes navigation={addNavigationHelpers({
				dispatch: this.props.dispatch,
				state: this.props.nav,
			})} />
		);
	}
}

const mapStateToProps = (state) => ({
	nav: state.nav
});

const StoreContain = connect(mapStateToProps)(NavStore);

const client 	= new ApiClient();
const store  	= createStore(appReducer, client, window.__data);

// // subscribe to all redux updates, intercept routing
// store.subscribe(function fetcher() {

//     let state = store.getState();
//     // let currentPath = state.routing.locationBeforeTransitions.pathname;
//     // let segments = currentPath.split('/');

//     console.info('Redux update', state);

// });

export default class Store extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<StoreContain />
			</Provider>
		);
	}
}
