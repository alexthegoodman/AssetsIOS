import React, { Component }  from 'react';
import { connect }                      from 'react-redux';
import { bindActionCreators }           from 'redux';
import * as userActions                 from '../../redux/modules/user';
import * as browseActions                 from '../../redux/modules/browse';

import ApiClient                        from '../../api/client';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NavigatorIOS,
    AsyncStorage,
    Linking,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Dimensions,
    TextInput,
    StatusBar
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const DeviceInfo                    = require('react-native-device-info');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");
const { BlurView, VibrancyView }    = require('react-native-blur');

// import BeForm               from '../../beyondtoolbox/BeForm/BeForm';
// import BeInput              from '../../beyondtoolbox/BeInput/BeInput';

// @connect(
//     ( state ) => ({
//         userHash: state.user.userHash,
//         userData: state.user.userData
//     }),
//     ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, userActions), dispatch)
// )

export default class Home extends Component {

    constructor() {

        super();

    }

    componentDidMount() {

        let self = this;

        console.info('Home', self.props)

    }

    render() {


        return (
            <View style={styles.homeBody}>
                <Text>Home</Text>
            </View>
        );
    }

}
