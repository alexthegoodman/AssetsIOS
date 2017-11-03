import React, { Component }  from 'react';
import { connect }                      from 'react-redux';
import { bindActionCreators }           from 'redux';
import * as interfacesActions                 from '../../redux/modules/interfaces';
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
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, interfacesActions), dispatch)
)

export default class ProjectPicker extends Component {

    constructor() {

        super();

        this.goBack = this.goBack.bind(this);
        this.pickProject = this.pickProject.bind(this);

        this.state = {}

    }

    componentDidMount() {
        
    }

    goBack() { 
        this.props.navigation.goBack();
    }

    pickProject(projectId) {

        let self = this;
        
        self.props.pickProjectAction(projectId);

        self.props.navigation.goBack();

    }
    
    render() {

        let { userProjects, gotProjects, routeParams, currentPhase, currentPhaseData, gotPhase, currentProject } = this.props;

        let newProjects = deepcopy(userProjects);
            newProjects = Object.keys(newProjects).map(x => newProjects[x]);
            newProjects.reverse();

        let projectCount = 0;
        let listPhases = newProjects.map( project => {
            if (project['finished'] == '1') {
                projectCount++;
                
                return (
                    <View style={[styles.listBox, { width: width } ]} key={'project' + projectCount}>
                        <TouchableHighlight style={[styles.listTile, { width: width } ]} 
                            activeOpacity={1} underlayColor="#F2F2F2" onPress={() => this.pickProject(project['project_id'])}>
                            <View style={styles.listTileContain}>
                                <View style={[styles.listTileInfo, { height: 50 } ]}>
                                    <Text style={styles.listTileTitle}>{project['project_name']}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                );
            } else {
                return;
            }
        });

        return (
            <View style={[styles.body, { backgroundColor: 'white' }]}>
                <View style={[styles.body, { zIndex: 4 }]}>

                    <SimpleHeader
                        background="#F26A7E"
                        title="Pick Project"
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