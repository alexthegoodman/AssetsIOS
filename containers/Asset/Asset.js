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
const Lightbox                      = require('react-native-lightbox');

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
            commentViewHeight: ((height - 250) - 50) - 80,
            assetContentHeight: 250,
            thumbnailWidth: 1,
            thumbnailHeight: 1
        }

    }

    componentDidMount() {

        let self = this;
        let assetId     = this.props.routeParams.assetId;
        let thisAsset   = this.props.currentProject['phaseImagesData'][assetId];

        console.info('thisAsset', this.refs.assetRank.state);

        /// 150 simpleheader
        this.setState({ commentViewHeight: ((height - this.state.assetContentHeight) - this.refs.assetRank.state.rankHeight) - 80 });

        Image.getSize(thisAsset['image_url'], (width, height) => {
            this.setState({ thumbnailWidth: width, thumbnailHeight: height });
        });

    }

    goBack() { 
        this.props.goBack();
    }

    render() {

        let { projectUsers, userProjects, gotProjects, currentPhaseData, currentPhase, gotPhase, currentProject, routeParams } = this.props;

        let assetId     = routeParams.assetId;
        let thisAsset   = currentProject['phaseImagesData'][assetId];

        console.info(currentProject['phaseImagesData'], assetId);

        let thumbnailPerc   =  this.state.thumbnailWidth / this.state.thumbnailHeight;
        
        let thumbnailHeight = (this.state.assetContentHeight - 50);
        let thumbnailWidth  = thumbnailPerc * thumbnailHeight;

        return (
            <View style={styles.body}>
                <SimpleHeader
                    title={thisAsset['image_name']}
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
                        <View style={[styles.thumbnailContain, { width: thumbnailWidth, height: thumbnailHeight }]} shadowColor="#000000" shadowOffset={{width: 0, height: 0}} shadowOpacity={0.3} shadowRadius={10}>
                            <Lightbox>
                                <ScrollView style={[styles.assetThumbnail, { width: thumbnailWidth, height: thumbnailHeight } ]}
                                    automaticallyAdjustContentInsets={false}
                                    bounces={false}
                                    centerContent={true}
                                    decelerationRate={0.95}
                                    maximumZoomScale={10} minimumZoomScale={1} zoomScale={1.5}>
                                    <Image 
                                        style={[styles.assetThumbnail, { width: thumbnailWidth, height: thumbnailHeight } ]} 
                                        resizeMode="contain" 
                                        source={{ uri: thisAsset['image_url'] }} 
                                    />
                                </ScrollView>
                            </Lightbox>
                        </View>
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
