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
    Image,
    Dimensions
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");
const DeviceInfo                    = require('react-native-device-info');

const { BlurView, VibrancyView } = require('react-native-blur');

export default class SimpleHeader extends Component {

    constructor() {

        super();

        this.state = {}

    }

    componentDidMount() {

        let self = this;

        console.info('SimpleHeader componentDidMount');

    }

    render() {

        let { title, leftCtrls, rightCtrls, background } = this.props;

        let backgroundColor = 'transparent';
        if (typeof background != 'undefined') {
            backgroundColor = background;
        }

        let xHeight = 80, xPadding = 0, xTop = 20;
        if (DeviceInfo.getModel() == 'iPhone X') {
          xHeight = 110;
          xPadding = 30;
          xTop = 50;
        }

        return (
            <View style={[styles.bodyHeader, { backgroundColor: backgroundColor, height: xHeight } ]}>

                <BlurView blurType="dark" blurAmount={5} style={[styles.bodyHeaderBlur, { width: width, height: xHeight }]} />

                <View style={[styles.bodyHeaderContain, { height: xHeight, paddingTop: xPadding }]}>
                    <View style={[styles.leftCtrls, { top: xTop }]}>
                        {leftCtrls}
                    </View>
                    <Text style={styles.bodyHeaderText}>{title}</Text>
                    <View style={[styles.rightCtrls, { top: xTop }]}>
                        {rightCtrls}
                    </View>
                </View>

            </View>
        );
    }

}
