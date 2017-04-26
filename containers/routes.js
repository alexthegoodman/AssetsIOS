import React from 'react';
import { StackRoute, Route } from 'react-router-native';
// //import { loadCookieAction } from '../client/redux/modules/login';
// //import Cookies              from 'js-cookie';

import App  from './App/App';
import Home from './Home/Home';
import Browse from './Browse/Browse';
import Project from './Project/Project';

export default (store) => {

    // consider all fetching right here rather than App?
    const validate = (nextState, replace, cb) => {

        //store.dispatch(loadCookieAction());

        console.info('validate routing');

        cb();
    
    }; 

    return (
        <StackRoute onEnter={validate} path="/" component={App}>

            <Route path="home" component={Home} />

            <Route path="browse" component={Browse} />

            <Route path="project/:projectId" component={Project} />

        </StackRoute>
    );

};
