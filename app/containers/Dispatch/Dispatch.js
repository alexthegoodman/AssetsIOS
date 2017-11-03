import React, { Component }  from 'react';
import { connect }                      from 'react-redux';
import { bindActionCreators }           from 'redux';
import * as userActions                 from '../../redux/modules/user';
import * as browseActions                 from '../../redux/modules/browse';
import * as interfacesActions                 from '../../redux/modules/interfaces';

import ApiClient                        from '../../api/client';

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
    ( dispatch ) => bindActionCreators(Object.assign({}, interfacesActions, userActions), dispatch)
)

export default class Dispatch extends Component {

    // static propTypes = {};

    constructor(props) {

        super(props);

        this.state = {}

        console.info('dispatch constructor');
        
    }
    
    componentDidMount() {

        console.info('dispatch componentDidMount');

        let self = this;

        // load up first screen / child
        AsyncStorage.getItem('userHash', (err, userRes) => {

            console.info('get userHash 1', err, userRes, self.props, self.context);
            
            if (!userRes || userRes == null) {
                self.props.fetchUserFailureAction(userRes);
                self.props.navigation.navigate('Login')
            } else {
                self.props.fetchUserSuccessAction(userRes);
                // problem is not naving, not the setup, but when you are both naving on a certain setup
                self.props.navigation.navigate('BrowseRoutes')
            }

            setTimeout(() => {
                self.props.showContentAction();
            }, 700)
            
        });

    }

    render() {
        
        // let {  } = this.state;

        // Dispatch sends you where you belong
        // Ideally Dispatch is instant, or there's a good splash screen transition

        return (
            <View style={styles.body}>
                <StatusBar barStyle="light-content" />
            </View>
        )

    }

}
