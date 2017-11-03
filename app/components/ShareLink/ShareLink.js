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
    Dimensions,
    Share
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");

import Ionicons          from 'react-native-vector-icons/Ionicons';

export default class ShareLink extends Component {

    constructor() {

        super();

        this.shareLink = this.shareLink.bind(this);

        this.state = {}

    }

    componentDidMount() {

        let self = this;

        //console.info('InviteButton componentDidMount');
        
    }

    shareLink(shareLink) {
        Share.share({
            message: 'Collaborate internally and with your client\'s team',
            title: 'Join our project on Assets',
            url: shareLink
        })
    }

    render() {

        let { projectId, shareHash } = this.props;

        let shareLink = 'https://assets-beta.herokuapp.com' + '/public/project/' + projectId + '/' + shareHash;

        return (
            <View style={styles.shareLinkContainer}>
                <View style={styles.linkContainer}>
                    <Text style={styles.shareLink} numberOfLines={1}>{shareLink}</Text>
                </View>
                <TouchableOpacity onPress={ () => this.shareLink(shareLink) } style={[styles.shareLinkBtn]} 
                activeOpacity={0.8} underlayColor="rgba(255,255,255,0.1)">
                    <Ionicons
                        style={styles.shareLinkBtnContain}
                        name={'ios-share-alt'}
                        size={32}
                    />
                </TouchableOpacity>
            </View>
        );
    }

}