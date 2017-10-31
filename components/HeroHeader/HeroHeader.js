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

export default class HeroHeader extends Component {

    constructor() {

        super();

        this.state = {}

    }

    componentDidMount() {

        let self = this;

        console.info('HeroHeader componentDidMount');
        
    }

    render() {

        let { title, leftCtrls, rightCtrls, background } = this.props;
        
        let backgroundColor = 'transparent';
        if (typeof background != 'undefined') {
            backgroundColor = background;
        }

        return (
            <View style={[styles.heroHeader, { backgroundColor: backgroundColor } ]}>
                
                <BlurView blurType="dark" blurAmount={30} style={[styles.heroHeaderBlur, { width: width }]} />

                <View style={styles.heroHeaderContain}>
                    <View style={styles.heroLeftCtrls}>
                        {leftCtrls}
                    </View>
                    <Text style={styles.heroHeaderText}>{title}</Text>
                    <View style={styles.herooRightCtrls}>
                        {rightCtrls}
                    </View>
                </View>
                
            </View>
        );
    }

}