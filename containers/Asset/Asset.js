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
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Dimensions,
    ScrollView,
    AlertIOS
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const DeviceInfo                    = require('react-native-device-info');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");

import SimpleHeader             from '../../components/SimpleHeader/SimpleHeader';
import CompareAssets            from '../../components/CompareAssets/CompareAssets';
import AssetRank                from '../../components/AssetRank/AssetRank';
import AssetComments            from '../../components/AssetComments/AssetComments';

import Back1      from '../../svgComponents/svg/Back1';

@connect(
    ( state ) => ({
        projectUsers: state.browse.projectUsers,
        userProjects: state.browse.userProjects,
        gotProjects: state.browse.gotProjects,
        currentPhaseData: state.browse.currentPhaseData,
        currentPhase: state.browse.currentPhase,
        gotPhase: state.browse.gotPhase,
        currentProject: state.browse.currentProject
    }),
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, routerActions), dispatch)
)

export default class Project extends Component {

    constructor() {

        super();

        this.goBack = this.goBack.bind(this);

        this.state = {
            commentViewHeight: ((height - 250) - 50) - 120,
            assetContentHeight: 250
        }

    }

    componentDidMount() {

        let self = this;

        console.info('thisAsset', this.refs.assetRank.state);

        /// 150 simpleheader
        this.setState({ commentViewHeight: ((height - this.state.assetContentHeight) - this.refs.assetRank.state.rankHeight) - 120 });

    }

    goBack() { 
        this.props.goBack();
    }

    render() {

        let { projectUsers, userProjects, gotProjects, currentPhaseData, currentPhase, gotPhase, currentProject, routeParams } = this.props;

        let assetId     = routeParams.assetId;
        let thisAsset   = currentProject['phaseImagesData'][assetId];

        return (
            <View style={styles.body}>
                <SimpleHeader
                    title="Asset"
                    leftCtrls={(
                        <TouchableHighlight onPress={this.goBack} style={styles.headerLink} 
                        activeOpacity={1} underlayColor="rgba(255,255,255,0.1)">
                            <View style={styles.inlineContain}>
                                <Back1 width={35} height={35} color="white" />
                                <Text style={styles.headerLinkText}>Back</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                    rightCtrls={(
                        <View style={styles.inlineContain}></View>
                    )}
                />

                <View style={[styles.assetContent, { width: width, height: this.state.assetContentHeight } ]}>
                    <View style={styles.assetContentContain}>
                        <Image 
                            style={[styles.assetThumbnail, { width: width - 50, height: this.state.assetContentHeight } ]} 
                            resizeMode="contain" 
                            source={{ uri: thisAsset['image_url'] }} 
                            shadowColor="#000000" shadowOffset={{width: 0, height: 0}} shadowOpacity={0.3} shadowRadius={10}
                        />
                    </View>
                </View>

                <View style={styles.assetRank}>
                    <AssetRank ref="assetRank" assetData={thisAsset} projectUsers={projectUsers} />
                </View>

                <View style={[styles.assetCommentsContain, { height: this.state.commentViewHeight } ]}>
                    <AssetComments assetData={thisAsset} projectUsers={projectUsers} commentViewHeight={this.state.commentViewHeight} />
                </View>

            </View>
        );
    }

}
