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

        return (
            <View style={[styles.bodyHeader, { backgroundColor: backgroundColor } ]}>
                
                <BlurView blurType="dark" blurAmount={5} style={[styles.bodyHeaderBlur, { width: width }]} />

                <View style={styles.bodyHeaderContain}>
                    <View style={styles.leftCtrls}>
                        {leftCtrls}
                    </View>
                    <Text style={styles.bodyHeaderText}>{title}</Text>
                    <View style={styles.rightCtrls}>
                        {rightCtrls}
                    </View>
                </View>
                
            </View>
        );
    }

}