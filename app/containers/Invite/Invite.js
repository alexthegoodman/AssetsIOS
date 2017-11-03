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
import HeroHeader             from '../../components/HeroHeader/HeroHeader';
import ShareLink             from '../../components/ShareLink/ShareLink';
import EmailLink             from '../../components/EmailLink/EmailLink';

import Back1      from '../../svgComponents/svg/Back1';
import Ionicons          from 'react-native-vector-icons/Ionicons';

@connect(
    ( state ) => ({
        userHash: state.user.userHash,
        projectUsers: state.browse.projectUsers,
        userProjects: state.browse.userProjects,
        gotProjects: state.browse.gotProjects,
        currentPhaseData: state.browse.currentPhaseData,
        currentPhase: state.browse.currentPhase,
        gotPhase: state.browse.gotPhase,
        currentProject: state.browse.currentProject,
        projectSelection: state.interfaces.projectSelection
    }),
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, userActions), dispatch)
)

export default class Invite extends Component {

    constructor() {

        super();

        this.goBack = this.goBack.bind(this);

        this.state = {}

    }

    componentDidMount() {
        
    }

    goBack() { 
        this.props.navigation.goBack();
    }
    
    render() {

        let { userProjects, gotProjects, routeParams, currentPhase, currentPhaseData, gotPhase, currentProject, projectSelection } = this.props;

        // let projectId = currentPhase.projectId;
        // let shareHash = currentProject.shareHash;

        //console.info('Invite', currentProject, currentPhase, projectId, shareHash)

        let projectPickerLabel, shareComp;
        if (projectSelection) {
            shareComp = (
                <View style={styles.settingsBlock}>
                    <Text style={styles.blockLabel}>SHARE PROJECT:</Text>
                    <ShareLink
                        projectId={projectSelection}
                        shareHash={userProjects[projectSelection]['shareHash']}
                    />
                </View>
            )
            projectPickerLabel = userProjects[projectSelection]['project_name'];
        } else {
            projectPickerLabel = 'Pick Project';
        }

        return (
            <View style={[styles.body, { backgroundColor: 'white' }]}>
                <View style={[styles.body, { zIndex: 4 }]}>

                    <HeroHeader
                        background="#CF5B6A"
                        title="Invite"
                        blurType="light"
                        leftCtrls={(<View style={styles.inlineContain}></View>)}
                        rightCtrls={(
                            <View style={styles.inlineContain}></View>
                        )}
                    />
                    <View style={[styles.heroShadow, { width: width } ]} 
                    shadowColor="#000000" shadowOffset={{width: 0, height: 1}} shadowOpacity={0.3} shadowRadius={9}></View>

                    <ScrollView style={[styles.settingsList, { height: height, width: width }]} contentContainerStyle={styles.projectContain} 
                    horizontal={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}}>
                        
                        <View style={styles.settingsBlock}>
                            <Text style={styles.blockLabel}>PICK PROJECT:</Text>
                            <TouchableHighlight onPress={() => { this.props.navigation.navigate('ProjectPicker') }} 
                            style={[styles.settingsLink, styles.inviteSettingsLink, { width: width }]} 
                            activeOpacity={1} underlayColor="rgba(0,0,0,0.07)">
                                <View style={styles.inlineContain}>
                                    <Text style={styles.settingsLinkText}>{projectPickerLabel}</Text>
                                    <View style={[styles.settingsLinkIcon, styles.rightLinkIcon]}>
                                        <Ionicons
                                            style={styles.arrowIcon}
                                            name={'ios-arrow-forward'}
                                            size={28}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>

                        {/*<EmailLink />*/}

                        
                            {shareComp}
                        

                    </ScrollView>

                </View>
            </View>
        );
    }

}