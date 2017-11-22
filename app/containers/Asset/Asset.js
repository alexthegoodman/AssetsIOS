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

//const Orientation                   = require('react-native-orientation');

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
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, userActions), dispatch)
)

export default class Project extends Component {

    constructor() {

        super();

        this.goBack = this.goBack.bind(this);

        this.state = {
            commentViewHeight: ((height - 250) - 50) - 80,
            assetContentHeight: 250,
            thumbnailWidth: 1,
            thumbnailHeight: 1,
            //orientation: 'PORTRAIT',
            viewing: false
        }

    }

    _orientationDidChange(orientation) {
        // this.setState({
        //     orientation: orientation
        // });
    }

    componentDidMount() {

        let self = this;
        let assetId     = this.props.navigation.state.params.assetId;
        let thisAsset   = this.props.currentProject['phaseImagesData'][assetId];

        console.info('thisAsset', this.refs.assetRank.state);

        /// 150 simpleheader
        let xHeight = 80;
        if (DeviceInfo.getModel() == 'iPhone X') {
          xHeight = 150; // extra for nav bar
        }

        this.setState({ commentViewHeight: ((height - this.state.assetContentHeight) - this.refs.assetRank.state.rankHeight) - xHeight });

        Image.getSize(thisAsset['image_url'], (width, height) => {
            this.setState({ thumbnailWidth: width, thumbnailHeight: height });
        });

        //Orientation.addOrientationListener(this._orientationDidChange.bind(this));

    }

    goBack() {
        this.props.navigation.goBack();
    }

    render() {

        let { projectUsers, userProjects, gotProjects, currentPhaseData, currentPhase, gotPhase, currentProject, navigation } = this.props;

        let assetId     = navigation.state.params.assetId;
        let thisAsset   = currentProject['phaseImagesData'][assetId];

        // console.info(currentProject['phaseImagesData'], assetId, this.state.orientation);

        let thumbnailPerc   =  this.state.thumbnailWidth / this.state.thumbnailHeight;

        let thumbnailHeight = (this.state.assetContentHeight - 50);
        let thumbnailWidth  = thumbnailPerc * thumbnailHeight;

        let thumbnailStyles = { width: thumbnailWidth, height: thumbnailHeight }, containStyles = { width: thumbnailWidth, height: thumbnailHeight };

        // if (this.state.viewing && this.state.orientation == 'LANDSCAPE') {
        //     thumbnailStyles = { width: thumbnailHeight, height: thumbnailWidth };
        //     containStyles = { width: height, height: width, transform: [{ rotate: '90deg' }] };
        // }

        let xHeight = 80, xPadding = 0, xTop = 20;
        if (DeviceInfo.getModel() == 'iPhone X') {
          xHeight = 110;
          xPadding = 30;
          xTop = 50;
        }

        return (
            <View style={styles.body}>
                <Image style={{ zIndex: 1, position: 'absolute', width: width, height: xHeight }} source={{ uri: thisAsset['image_url'] }} />

                <View style={[styles.body, { zIndex: 4 }]}>
                    <SimpleHeader
                        title={thisAsset['image_name']}
                        leftCtrls={(
                            <TouchableHighlight onPress={this.goBack} style={styles.headerLink}
                            activeOpacity={1} underlayColor="rgba(255,255,255,0.1)">
                                <View style={styles.inlineContain}>
                                    <Back1 width={35} height={35} color="white" />
                                    {/*<Text style={styles.headerLinkText}>Back</Text>*/}
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
                                {/*<Lightbox
                                        onOpen={() => this.setState({ viewing: true })}
                                        onClose={() => this.setState({ viewing: false })}
                                        backgroundColor="rgba(0, 0, 0, 0.7)"
                                        underlayColor="rgba(255, 255, 255, 0.3)">*/}
                                    <ScrollView style={[styles.assetThumbnail, containStyles ]}
                                        automaticallyAdjustContentInsets={false}
                                        bounces={false}
                                        centerContent={true}
                                        decelerationRate={0.95}
                                        maximumZoomScale={10} minimumZoomScale={1} zoomScale={1.5}>
                                        <Image
                                            style={[styles.assetThumbnail, thumbnailStyles ]}
                                            resizeMode="contain"
                                            source={{ uri: thisAsset['image_url'] }}
                                        />
                                    </ScrollView>
                               {/*</Lightbox>*/}
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

            </View>
        );
    }

}
