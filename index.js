import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Store         from './containers/store';
import App           from './containers/App/App';
import Login          from './containers/Login/Login';

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

