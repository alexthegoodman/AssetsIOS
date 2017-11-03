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
    TouchableHighlight,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");

import LinearGradient     from 'react-native-linear-gradient';
import Entypo                   from 'react-native-vector-icons/Entypo';


export default class InviteButton extends Component {

    constructor() {

        super();

        this.state = {}

    }

    componentDidMount() {

        let self = this;

        //console.info('InviteButton componentDidMount');
        
    }

    render() {

        //let {  } = this.props;

        let colors = ['#F26A7E', '#CF5B6A'];

        return (
            <LinearGradient colors={colors} style={[styles.inviteButton]}>
                
                <View colors={colors} style={styles.gradientContainer}>
                    <Entypo
                        name={'plus'}
                        size={32}
                        style={{ color: 'white' }}
                    />
                </View>
                
            </LinearGradient>
        );
    }

}