import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Store         from './app/store';
import App           from './app/containers/App/App';
import Login          from './app/containers/Login/Login';

// hide react native warnings
console.disableYellowBox = true;

export default class AssetsIOS extends Component {
    
    constructor() {
        super();
    }

    render() {
        return (
            <Store />
        );
        
    }

}

AppRegistry.registerComponent('AssetsIOS', () => AssetsIOS);

