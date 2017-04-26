import React, { Component, PropTypes }  from 'react';
import { connect }                      from 'react-redux';
import { bindActionCreators }           from 'redux';
import * as browseActions               from '../../redux/modules/browse';
import { routerActions }                from 'react-router-redux';
import ApiClient                        from '../../helpers/ApiClient';

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

        let { title, leftCtrls, rightCtrls } = this.props;
        
        return (
            <View style={styles.bodyHeader}>
                
                <BlurView blurType="dark" blurAmount={30} style={[styles.bodyHeaderBlur, { width: width }]} />

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