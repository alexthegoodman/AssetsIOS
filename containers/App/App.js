import React, { Component }  from 'react';
import { connect }                      from 'react-redux';
import { bindActionCreators }           from 'redux';
import * as userActions                 from '../../redux/modules/user';
import * as browseActions                 from '../../redux/modules/browse';

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
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, userActions), dispatch)
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

        //Orientation.lockToPortrait();

        // load up first screen / child
        AsyncStorage.getItem('userHash', (err, userRes) => {

            console.info('get userHash', err, userRes, self.props, self.context);
            
            if (!userRes || userRes == null) {
                //self.props.push('/login');
            } else {
                self.props.fetchUserSuccessAction(userRes);
                // don't redirect if already at browse
                //self.props.push('/browse/');
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
