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

        let { title, leftCtrls, rightCtrls, background, blurType } = this.props;
        
        let backgroundColor = 'transparent';
        if (typeof background != 'undefined') {
            backgroundColor = background;
        }

        let blurViewType = "dark";
        if (typeof blurType != 'undefined') {
            blurViewType = blurType;
        }

        return (
            <View style={[styles.heroHeader, { backgroundColor: backgroundColor } ]}>
                
                <BlurView blurType={blurViewType} blurAmount={5} style={[styles.heroHeaderBlur, { width: width }]} />

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