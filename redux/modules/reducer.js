import { combineReducers }              from 'redux';
import { routerReducer }                from 'react-router-redux';
//import multireducer                     from 'multireducer';
//import {reducer as reduxAsyncConnect}   from 'redux-async-connect';
//import {reducer as form}				  from 'redux-form';

import browse             from './browse';
import user               from './user';

export default combineReducers({
    routing: routerReducer,
    browse,
    user
    //reduxAsyncConnect,
    // multireducer: multireducer({
    //     reducerA: reducerA,
    //     reducerB: reducerB
    // })
});
