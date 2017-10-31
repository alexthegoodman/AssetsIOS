import React, { Component, PropTypes }  from 'react';
import { connect }                      from 'react-redux';
import { bindActionCreators }           from 'redux';
import * as userActions                 from '../../redux/modules/user';
import { routerActions }                from 'react-router-redux';
import ApiClient                        from '../../helpers/ApiClient';

import {
    StyleSheet,
    Text,
    View,
    Navigator,
    AsyncStorage,
    Linking,
    StatusBar
} from 'react-native';

import Login             from '../Login/Login';

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const DeviceInfo                    = require('react-native-device-info');
const JefNode                       = require('json-easy-filter').JefNode;
//const Orientation                   = require('react-native-orientation');

@connect(
    ( state ) => ({
        userHash: state.user.userHash,
        userData: state.user.userData
    }),
    ( dispatch ) => bindActionCreators(Object.assign({}, userActions, routerActions), dispatch)
)

export default class App extends Component {

    // static propTypes = {};

    constructor(props) {

        super(props);

        this.state = {}

        console.info('app constructor');
        
    }
    
    componentDidMount() {

        console.info('app componentDidMount');

        let self = this;

        Orientation.lockToPortrait();

        // load up first screen / child
        AsyncStorage.getItem('userHash', (err, userRes) => {

            console.info('get userHash', err, userRes);
            
            if (!userRes || userRes == null) {
                this.props.push('/login/');
            } else {
                self.props.fetchUserSuccessAction(userRes);
                // don't redirect if already at browse
                this.props.push('/browse/');
            }
            
        });

    }

    render() {
        
        // let {  } = this.state;

        return (
            <View style={styles.body}>
                <StatusBar barStyle="light-content" />
                {this.props.children}
            </View>
        )

    }

}
