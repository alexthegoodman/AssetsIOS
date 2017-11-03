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

export default class PhasePicker extends Component {

    constructor() {

        super();

        this.goBack = this.goBack.bind(this);
        this.setPhase = this.setPhase.bind(this);

        this.state = {}

    }

    componentDidMount() {
        
    }

    goBack() { 
        this.props.navigation.goBack();
    }

    setPhase(phaseId) {

        let self = this;
        let projectId = this.props.currentProject['project_id'];

        let phaseInfo = {
            userHash: this.props.userHash
        }

        client.get('/get/phase/' + projectId + '/' + phaseId + '/', phaseInfo).then(
            (data) => {

                console.info('/get/phase/' + projectId + '/' + phaseId + '/', data);
                
                if (typeof data['PhaseImagesData'] != 'undefined' &&
                    data['PhaseImagesData'] != false) {
                    
                    this.props.fetchPhaseSuccessAction(projectId, phaseId, data['PhaseImagesList'], this.props.userProjects[projectId].phaseList, data['PhaseImagesData']);
                    
                    this.props.setCurrentPhaseSuccessAction(data['PhaseId'], data['PhaseImagesData'], data['PhaseImagesList'], data['PhaseName']);

                    api.refreshPhaseComments(self.props.userHash, projectId, data['PhaseImagesList']);

                    this.props.navigation.goBack();

                } else {
                    console.error('PhaseImagesData error 2b', data);
                    this.props.fetchPhaseFailureAction();
                }
                
            }, (err) => {
                console.log('PhaseImagesData error 1b', err);
                this.props.fetchPhaseFailureAction();
            }
        );
    }
    
    render() {

        let { userProjects, gotProjects, routeParams, currentPhase, currentPhaseData, gotPhase, currentProject } = this.props;

        let phaseCount = 0;
        let listPhases = currentProject.phaseList.map( phase => {

            phaseCount++;
            
            return (
                <View style={[styles.listBox, { width: width } ]} key={'phase' + phaseCount}>
                    <TouchableHighlight style={[styles.listTile, { width: width } ]} 
                        activeOpacity={1} underlayColor="#F2F2F2" onPress={() => this.setPhase(phase)}>
                        <View style={styles.listTileContain}>
                            <View style={[styles.listTileInfo, { height: 50 } ]}>
                                <Text style={styles.listTileTitle}>Phase {phaseCount}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            );

        });

        return (
            <View style={[styles.body, { backgroundColor: 'white' }]}>
                <View style={[styles.body, { zIndex: 4 }]}>

                    <SimpleHeader
                        background="#F26A7E"
                        title="Pick Phase"
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

                    <ScrollView contentContainerStyle={styles.projectContain} horizontal={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}}>
                        {listPhases}
                    </ScrollView>

                </View>
            </View>
        );
    }

}