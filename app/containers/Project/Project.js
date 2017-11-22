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

import SimpleHeader             from '../../components/SimpleHeader/SimpleHeader';
import CompareAssets            from '../../components/CompareAssets/CompareAssets';
import AssetRank                from '../../components/AssetRank/AssetRank';

import Back1      from '../../svgComponents/svg/Back1';
import Grid       from '../../svgComponents/svg/Grid';
import Hamburger  from '../../svgComponents/svg/Hamburger';
import Check      from '../../svgComponents/svg/Check';
import Check2     from '../../svgComponents/svg/Check2';
import Check3     from '../../svgComponents/svg/Check3';

@connect(
    ( state ) => ({
        userHash: state.user.userHash,
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

        this.goBack             = this.goBack.bind(this);
        this.viewAsset          = this.viewAsset.bind(this);
        //this.refreshPhaseComments = this.refreshPhaseComments.bind(this);

        this.state = {}

    }

    componentDidMount() {

        let self = this;

        // should pre-load?

        console.info('Project mount', self.props)

        let thisProject = new JefNode(self.props.userProjects).filter(function(node) {
            if (node.key == 'project_id' && node.value == self.props.navigation.state.params.projectId) {
                return node.parent.value;
            }
        });

        thisProject = thisProject[0];

        // this.setState({
        //     thisProject: thisProject
        // })

        this.props.setCurrentProjectSuccessAction(thisProject);

        let projectId           = thisProject['project_id'];
        let phaseId             = thisProject['phaseId'];
        let phaseImagesList     = thisProject['phaseImagesList'];

        // if (typeof phaseImagesList == 'array') {
        //     phaseImagesList = $.extend({}, phaseImagesList);
        // }

        console.info('Project componentDidMount', projectId);

        if (this.props.navigation.state.params.phaseId) {
            phaseId = this.props.navigation.state.params.phaseId;
        }

        this.props.fetchPhaseSuccessAction(projectId, phaseId, thisProject['phaseImagesList'], thisProject['phaseList'], thisProject['phaseImagesData']);

        // load comment data for each image
        api.refreshPhaseComments(self.props.userHash, projectId, phaseImagesList);

    }

    goBack() {
        this.props.navigation.goBack();
    }

    viewAsset(assetId) {
        this.props.navigation.navigate('Asset', { assetId: assetId });
    }

    generateItem(type, layout, image, i) {

        let focus = false;
        if (i == 0) {
            focus = true;
        }

        if (typeof image['image_rank'] == 'string') {
            image['image_rank'] = JSON.parse(image['image_rank']);
        }

        let assetDescrip = image['image_descrip'], descripComp, titleTop = { top: 17 };
        if (typeof assetDescrip != 'undefined' && assetDescrip.length > 1) {

            titleTop = {};

            if (assetDescrip.length > 50) {
                assetDescrip = assetDescrip.substr(0, 50);
                assetDescrip += '...';
            }

            descripComp = <Text style={styles.tileDescription}>{assetDescrip}</Text>

        }

        let itemWidth = width - 50;

        let key = 'assetsGrid' + image['image_id'];
        return (
            <View style={[styles.tileBox, { width: itemWidth, left: 25 } ]} key={'asset' + image['image_id']}
                shadowColor="#000000" shadowOffset={{width: 0, height: 0}} shadowOpacity={0.2} shadowRadius={14}>
                <View style={styles.tileGridThing}>
                    <TouchableHighlight style={[styles.gridTile, { width: width } ]} key={key}
                        activeOpacity={1} underlayColor="#F2F2F2" onPress={() => this.viewAsset(image['image_id'])}>
                        <View style={styles.tileContain}>
                            <Text style={[styles.loadingLabel, { width: itemWidth }]}>Loading...</Text>
                            <Image
                                style={[styles.tileThumbnail, { width: itemWidth }]}
                                resizeMode="cover"
                                source={{ uri: image['image_url'] }}
                            />
                            <View style={[styles.thumbnailContain, { width: itemWidth }]}></View>
                            <View style={styles.tileInfo}>
                                <Text style={[styles.tileTitle, titleTop]}>{image['image_name']}</Text>
                                {descripComp}
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );

    }

    render() {

        let { userProjects, gotProjects, navigation, currentPhase, currentPhaseData, gotPhase, currentProject } = this.props;
        let { currentView, viewMenuOpen, layoutMenuOpen, currentLayout, selectedAssets } = this.state;

        //console.info('Project', gotProjects, userProjects, navigation, this.props);

        let gridAssets, slideAssets, compareAssets, projName, blurImage, currentPhaseLabel;
        if (currentProject && gotPhase) {

            projName        = currentProject['project_name'];
            let projAuthor      = currentProject['project_author'];
            let projUsersJoined = currentProject['users_joined'];
            let shareHash       = currentProject['shareHash'];
            let phaseList       = currentProject['phaseList'];
            // override with sel phase
            let phaseId         = currentProject['phaseId'];
            let phaseImagesList = currentProject['phaseImagesList'];

            let newPhaseData    = deepcopy(currentPhaseData);
            let phaseData       = Object.keys(newPhaseData).map(x => newPhaseData[x]);

            // phaseData = this.orderByRank(phaseData, userId);

            this.phaseDataLength = phaseData.length;
            this.total      = 0;
            this.itemCount  = 0;

            let projCount = 0;
            phaseData.map( asset => {
                projCount++;
                if (projCount == 1) {
                    blurImage = asset['image_url'];
                }
            });

            let m = -1;
            gridAssets = phaseData.map( asset => {
                m++;
                return this.generateItem('grid', currentLayout, asset, m);
            });

            for (var i = 0; i < currentPhase['phaseList'].length; i++) {
                if (currentPhase['phaseList'][i] == currentPhase['phaseId']) {
                    currentPhaseLabel = 'Phase ' + (i+1);
                }
            }

        }

        let xHeight = 80, xPadding = 0;
        if (DeviceInfo.getModel() == 'iPhone X') {
          xHeight = 110;
          xPadding = 30;
        }

        return (
            <View style={styles.body}>
                <Image style={{ zIndex: 1, position: 'absolute', width: width, height: xHeight }} source={{ uri: blurImage }} />

                <View style={[styles.body, { zIndex: 4 }]}>
                    <SimpleHeader
                        title={projName}
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
                            <TouchableHighlight onPress={() => this.props.navigation.navigate('PhasePicker')} style={styles.headerLink}
                            activeOpacity={1} underlayColor="rgba(255,255,255,0.1)">
                                <View style={styles.inlineContain}>
                                    <Text style={styles.headerLinkText}>{currentPhaseLabel}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />

                    <ScrollView style={[styles.browseList, { height: height, width: width }]} contentContainerStyle={styles.projectContain} horizontal={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}}>
                        {gridAssets}
                        {/*{slideAssets}
                        {compareAssets}*/}
                    </ScrollView>
                </View>
            </View>
        );
    }

}
