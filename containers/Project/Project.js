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

import Back1      from '../../svgComponents/svg/Back1';
import Grid       from '../../svgComponents/svg/Grid';
import Hamburger  from '../../svgComponents/svg/Hamburger';
import Check     from '../../svgComponents/svg/Check';
import Check2     from '../../svgComponents/svg/Check2';
import Check3     from '../../svgComponents/svg/Check3';

@connect(
    ( state ) => ({
        projectUsers: state.browse.projectUsers,
        userProjects: state.browse.userProjects,
        gotProjects: state.browse.gotProjects,
        currentPhaseData: state.browse.currentPhaseData,
        currentPhase: state.browse.currentPhase,
        gotPhase: state.browse.gotPhase
    }),
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, routerActions), dispatch)
)

export default class Project extends Component {

    constructor() {

        super();

        this.goBack             = this.goBack.bind(this);
        this.toggleAsset        = this.toggleAsset.bind(this);
        this.openMenu           = this.openMenu.bind(this);
        this.setCurrentView     = this.setCurrentView.bind(this);

        this.state = {
            thisProject: false,
            currentView: 'Compare',
            viewMenuOpen: false,
            currentLayout: 'Tall',
            layoutMenuOpen: false,
            selectedAssets: {}
        }

    }

    componentDidMount() {

        let self = this;

        let thisProject = new JefNode(self.props.userProjects).filter(function(node) {
            if (node.key == 'project_id' && node.value == self.props.routeParams.projectId) {
                return node.parent.value;
            }
        });

        thisProject = thisProject[0];

        this.setState({
            thisProject: thisProject
        })

        let projectId   = thisProject['project_id'];
        let phaseId     = thisProject['phaseId'];

        console.info('Project componentDidMount', projectId);

        if (this.props.routeParams.phaseId) {
            phaseId = this.props.routeParams.phaseId;
        }

        this.props.fetchPhaseSuccessAction(projectId, phaseId, thisProject['phaseImagesList'], thisProject['phaseList'], thisProject['phaseImagesData']);

    }

    goBack() { 
        this.props.push('/browse/');
    }

    toggleAsset(assetId) {

        let selectedAssets = this.state.selectedAssets;

        if (typeof selectedAssets[assetId] != 'undefined' && selectedAssets[assetId]) {
            delete selectedAssets[assetId];
        } else {
            if (Object.keys(selectedAssets).length == 4) {
                let it = Object.keys(selectedAssets)[0];
                delete selectedAssets[it];
            }
            selectedAssets[assetId] = assetId;
        }

        this.setState({
            selectedAssets: selectedAssets
        });
        
    }

    generateItem(type, layout, image, i) {

        let rowCount = 5, tileMargin = 50;
        let totalMargin = (rowCount + 1) * tileMargin, tileWidth = (width - totalMargin) / rowCount;

        let focus = false;
        if (i == 0) {
            focus = true;
        }

        if (typeof image['image_rank'] == 'string') {
            image['image_rank'] = JSON.parse(image['image_rank']);
        }

        let assetDescrip = image['image_descrip'];
        if (typeof assetDescrip != 'undefined' && assetDescrip.length > 50) {
            assetDescrip = assetDescrip.substr(0, 50);
            assetDescrip += '...';
        }

        if (type == 'grid') {
            let key = 'assetsGrid' + image['image_id'];
            return (
                <TouchableOpacity style={[styles.gridTile, { width: tileWidth } ]} key={key} 
                    activeOpacity={1} underlayColor="#F2F2F2" 
                    tvParallaxProperties={hoverProps} hasTVPreferredFocus={focus}>
                    <View style={styles.tileContain} shadowColor="#000000" shadowOffset={{width: 0, height: 0}} shadowOpacity={0.4} shadowRadius={8}>
                         <Image style={styles.tileBackground} resizeMode="cover" source={{ uri: image['image_url'] }}>
                            <Text style={styles.tileName}>{image['image_name']}</Text>
                            <Text style={styles.tileDescription}>{assetDescrip}</Text>
                        </Image>
                    </View>
                </TouchableOpacity>
            );
        } else if (type == 'slide') {
            
            let key = 'assetsSlide' + image['image_id'];
            let slideWidth  = width;
            let slideHeight = height - 170;
            let extraStyles;
            if (layout == 'Tall') {
                slideHeight -= 100;
                extraStyles = { width: slideWidth, height: slideHeight, marginTop: 50 };
            } else if (layout == 'Wide') {
                slideWidth  -= 200;
                //slideHeight -= 50;
                extraStyles = { width: slideWidth, height: slideHeight, paddingRight: 0, marginRight: 0 };
            }
            
            return (
                <TouchableHighlight tvParallaxProperties={fullscreenHoverProps} activeOpacity={1} style={[styles.slideTile, extraStyles ]} key={key}>
                    <View style={styles.slideContain}>
                        <View style={[styles.tileImage, { width: (slideWidth * 0.7), height: slideHeight } ]} 
                            activeOpacity={1} underlayColor="#F2F2F2" 
                            tvParallaxProperties={smallHoverProps} hasTVPreferredFocus={focus}>
                            <View style={styles.imageContain}>
                                 <Image style={styles.imageBackground} width={(slideWidth * 0.7) - 50} shadowColor="#000000" shadowOffset={{width: 0, height: 0}} shadowOpacity={0.4} shadowRadius={8} resizeMode="contain" source={{ uri: image['image_url'] }} />
                            </View>
                        </View>
                        <View style={[styles.slideTileInfo, { width: (slideWidth * 0.3) - 50, height: slideHeight } ]}>
                            <Text style={styles.slideTileName}>{image['image_name']}</Text>
                            <Text style={styles.slideTileDescription}>{assetDescrip}</Text>
                            <AssetRank assetData={image} projectUsers={this.props.projectUsers} />
                        </View>
                    </View>
                </TouchableHighlight>
            );
        } else if (type == 'selection') {
            let key = 'assetsSelection' + image['image_id'];
            let checkmark;
            if (typeof this.state.selectedAssets[image['image_id']] != 'undefined' && this.state.selectedAssets[image['image_id']]) {
                checkmark = (
                    <View style={styles.checkmarkIcon}><Check2 width={24} height={24} color="white" /></View>
                );
            }
            return (
                <TouchableHighlight onPress={() => this.toggleAsset(image['image_id'])} key={key} style={[styles.selectionTile, { width: 275 } ]} 
                    activeOpacity={1} underlayColor="#F2F2F2" 
                    tvParallaxProperties={hoverProps} hasTVPreferredFocus={focus}>
                    <View style={styles.selectionContain} shadowColor="#000000" shadowOffset={{width: 0, height: 0}} shadowOpacity={0.4} shadowRadius={8}>
                        {checkmark}
                        <Image style={styles.selectionBackground} resizeMode="cover" source={{ uri: image['image_url'] }} />
                    </View>
                </TouchableHighlight>
            );
        }

    }

    openMenu(menu) {
        if (menu == 'view') {
            // this.setState({
            //     viewMenuOpen: true,
            //     layoutMenuOpen: false
            // });
            AlertIOS.alert(
                'Pick View',
                'Sliding and comparing have their own ideal circumstances.',
                [
                    {text: 'Slide', onPress: () => this.setCurrentView('Slide') },
                    {text: 'Compare', onPress: () => this.setCurrentView('Compare') },
                ],
            );
        } else if (menu == 'layout') {
            // this.setState({
            //     viewMenuOpen: false,
            //     layoutMenuOpen: true
            // });
            AlertIOS.alert(
                'Pick Layout',
                'Each layout is ideal for different image shapes.',
                [
                    {text: 'Tall', onPress: () => this.setCurrentLayout('Tall') },
                    {text: 'Wide', onPress: () => this.setCurrentLayout('Wide') },
                ],
            );
        }
    }

    setCurrentView(sel) {
        this.setState({
            viewMenuOpen: false,
            layoutMenuOpen: false,
            currentView: sel
        });
    }

    setCurrentLayout(sel) {
        this.setState({
            viewMenuOpen: false,
            layoutMenuOpen: false,
            currentLayout: sel
        });
    }

    render() {

        let { userProjects, gotProjects, routeParams, currentPhase, currentPhaseData, gotPhase } = this.props;
        let { currentView, viewMenuOpen, layoutMenuOpen, currentLayout, selectedAssets } = this.state;

        console.info('Project', gotProjects, userProjects, routeParams.projectId, this.props);

        let gridAssets, slideAssets, compareAssets, thisProject = this.state.thisProject, projName, blurImage; 
        if (thisProject && gotPhase) {
            
            projName        = thisProject['project_name'];
            let projAuthor      = thisProject['project_author'];
            let projUsersJoined = thisProject['users_joined'];
            let shareHash       = thisProject['shareHash'];
            let phaseList       = thisProject['phaseList'];
            // override with sel phase
            let phaseId         = thisProject['phaseId'];
            let phaseImagesList = thisProject['phaseImagesList'];

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

            if (currentView == 'Slide') {
                let x = -1;
                slideAssets = phaseData.map( asset => {
                    x++;
                    return this.generateItem('slide', currentLayout, asset, x);
                });
            } else if (currentView == 'Compare') {
                let n = -1;
                let selectionAssets = phaseData.map( asset => {
                    n++;
                    return this.generateItem('selection', currentLayout, asset, n);
                });
                compareAssets = (
                    <View style={styles.compareAssets}>
                        <CompareAssets 
                            thisProject={thisProject}
                            phaseData={phaseData}
                            selectedAssets={selectedAssets}
                            layout={currentLayout}
                        />
                        <ScrollView style={[styles.selectionStrip, { width: width } ]} horizontal={true} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}}>
                            {selectionAssets}
                        </ScrollView>
                    </View>
                );
            } else {
                let m = -1;
                gridAssets = phaseData.map( asset => {
                    m++;
                    return this.generateItem('grid', currentLayout, asset, m);
                });
            }

        }

        // dropdown comp?
        let showViewMenu;
        // if (viewMenuOpen) {
        //     showViewMenu = (
        //         <View style={styles.viewMenuContain}>
        //             <TouchableHighlight onPress={() => this.setCurrentView('Slide')} style={styles.bodyLink} 
        //             activeOpacity={1} underlayColor="rgba(255,255,255,0.1)"
        //             tvParallaxProperties={{ enabled: false }} hasTVPreferredFocus={false}>
        //                 <Text>Slide</Text>
        //             </TouchableHighlight>
        //             <TouchableHighlight onPress={() => this.setCurrentView('Compare')} style={styles.bodyLink} 
        //             activeOpacity={1} underlayColor="rgba(255,255,255,0.1)"
        //             tvParallaxProperties={{ enabled: false }} hasTVPreferredFocus={false}>
        //                 <Text>Compare</Text>
        //             </TouchableHighlight>
        //         </View>
        //     );
        // }

        let viewMenu = (
            <View style={styles.viewMenu}>
                <TouchableHighlight onPress={() => this.openMenu('view')} style={styles.headerLink} 
                activeOpacity={1} underlayColor="rgba(255,255,255,0.1)"
                tvParallaxProperties={smallHoverProps} hasTVPreferredFocus={false}>
                    <View style={styles.inlineContain}>
                        <View style={styles.headerLinkIcon}><Hamburger width={35} height={35} color="white" /></View>
                        <Text style={styles.headerLinkText}>{currentView}</Text>
                    </View>
                </TouchableHighlight>
                {showViewMenu}
            </View>
        );

        let showLayoutMenu;
        // if (layoutMenuOpen) {
        //     showLayoutMenu = (
        //         <View style={styles.viewMenuContain}>
        //             <TouchableHighlight onPress={() => this.setCurrentLayout('Tall')} style={styles.bodyLink} 
        //             activeOpacity={1} underlayColor="rgba(255,255,255,0.1)"
        //             tvParallaxProperties={{ enabled: false }} hasTVPreferredFocus={false}>
        //                 <Text>Tall</Text>
        //             </TouchableHighlight>
        //             <TouchableHighlight onPress={() => this.setCurrentLayout('Wide')} style={styles.bodyLink} 
        //             activeOpacity={1} underlayColor="rgba(255,255,255,0.1)"
        //             tvParallaxProperties={{ enabled: false }} hasTVPreferredFocus={false}>
        //                 <Text>Wide</Text>
        //             </TouchableHighlight>
        //         </View>
        //     );
        // }

        let layoutMenu = (
            <View style={styles.layoutMenu}>
                <TouchableHighlight onPress={() => this.openMenu('layout')} style={styles.headerLink} 
                activeOpacity={1} underlayColor="rgba(255,255,255,0.1)"
                tvParallaxProperties={smallHoverProps} hasTVPreferredFocus={false}>
                    <View style={styles.inlineContain}>
                        <View style={styles.headerLinkIcon}><Grid width={35} height={35} color="white" /></View>
                        <Text style={styles.headerLinkText}>{currentLayout}</Text>
                    </View>
                </TouchableHighlight>
                {showLayoutMenu}
            </View>
        );

        let scrollHorizontal = true;
        if (currentView == 'Slide' && currentLayout == 'Tall') {
            scrollHorizontal = false;
        }

        return (
            <View style={styles.body}>
                <Image style={{ zIndex: 1, position: 'absolute', width: width, height: 170 }} source={{ uri: blurImage }} />
                
                <View style={[styles.body, { zIndex: 4 }]}>
                    <SimpleHeader
                        title={projName}
                        leftCtrls={(
                            <TouchableHighlight onPress={this.goBack} style={styles.headerLink} 
                            activeOpacity={1} underlayColor="rgba(255,255,255,0.1)" 
                            tvParallaxProperties={smallHoverProps} hasTVPreferredFocus={false}>
                                <View style={styles.inlineContain}>
                                    <Back1 width={50} height={50} color="white" />
                                    <Text style={styles.headerLinkText}>Back to Projects</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                        rightCtrls={(
                            <View style={styles.inlineContain}>
                                {viewMenu}
                                {layoutMenu}
                            </View>
                        )}
                    />

                    <ScrollView contentContainerStyle={styles.projectContain} horizontal={scrollHorizontal} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}}>
                        {gridAssets}
                        {slideAssets}
                        {compareAssets}
                    </ScrollView>
                </View>
            </View>
        );
    }

}
