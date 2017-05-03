import React from 'react';
import { StackRoute, Route } from 'react-router-native';
// //import { loadCookieAction } from '../client/redux/modules/login';
// //import Cookies              from 'js-cookie';

import App  from './App/App';
import Home from './Home/Home';
import Browse from './Browse/Browse';
import Project from './Project/Project';
import PhasePicker from './PhasePicker/PhasePicker';
import Asset from './Asset/Asset';

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

            <Route path="phasePicker" component={PhasePicker} />

            <Route path="asset/:assetId" component={Asset} />

        </StackRoute>
    );

};
