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
    ScrollView,
    AlertIOS
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const DeviceInfo                    = require('react-native-device-info');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");

import HeroHeader             from '../../components/HeroHeader/HeroHeader';

import Back1       from '../../svgComponents/svg/Back1';

@connect(
    ( state ) => ({
        userHash: state.user.userHash,
        userData: state.user.userData,
        userProjects: state.browse.userProjects,
        gotProjects: state.browse.gotProjects
    }),
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, userActions), dispatch)
)

export default class Browse extends Component {

    constructor() {

        super();

        this.viewProject = this.viewProject.bind(this);

        this.state = {}

    }

    componentDidMount() {

        let self = this;

        console.info('Browse componentDidMount', this.props.userHash);

        let browseInfo = {
            userHash: this.props.userHash
        }

        client.get('/get/projects/', browseInfo).then(
            (data) => {
                if (typeof data['UserProjects'] == 'undefined') {
                    console.info('undefined response');
                    this.props.fetchProjectsFailureAction();
                } else if (data['UserProjects'] == false) {
                    console.info('false response');
                    this.props.fetchProjectsEmptyAction();
                } else if (Object.keys(data['UserProjects']).length > 0) {
                    console.info('fetchProjectsSuccessAction', data['UserProjects']);

                    this.props.fetchProjectsSuccessAction(data['UserProjects']);

                    // ideal spot to fetch specific phases?

                    client.get('/get/users', browseInfo).then(
                        (data) => {

                            console.log('/get/users', data);
                            
                            if (typeof data['ProjectUsers'] != 'undefined' &&
                                data['ProjectUsers'] != false) {

                                this.props.fetchProjectUsersSuccessAction(data['ProjectUsers']);

                                // let thisUser = new JefNode(data['ProjectUsers']).filter(function(node) {
                                //     if (node.key == 'userHash' && node.value == userHash) {
                                //         return node.parent.value;
                                //     }
                                // });

                                // this.props.setUserId(thisUser[0]['id']);

                                // ATTN: hot live reload go to page
                                //this.props.push('/project/420');
                                // this.props.push('/asset/424');

                            } else {
                                this.props.fetchProjectUsersFailureAction();
                            }

                        }, (err) => {
                            console.log(err);
                            this.props.fetchProjectUsersFailureAction();
                        }
                    );

                } else {
                    console.info('empty response');
                }
            }, (err) => {
                console.log(err);
            }
        );

    }

    viewProject(projId) {
        console.info('viewProject', projId)
        this.props.navigation.navigate('Project', { projectId: projId });
    }

    render() {

        let { userProjects, gotProjects } = this.props;

        //console.info('Home', gotProjects, userProjects, Object.keys(userProjects).length);

        let listProjects, rowCount = 3, tileMargin = 70, blurImage;
        // let totalMargin = (rowCount + 1) * tileMargin, tileWidth = (width - totalMargin) / rowCount;
        if (gotProjects) {

            if (Object.keys(userProjects).length > 0) {

                let newProjects = deepcopy(userProjects);
                newProjects = Object.keys(newProjects).map(x => newProjects[x]);
                newProjects.reverse();
                projCount = 0;

                listProjects = newProjects.map( project => {
                    if (project['finished'] == '1') {

                        projCount++;
                        project['phaseImagesData'] = Object.keys(project['phaseImagesData']).map(x => project['phaseImagesData'][x]);

                        let projId = project['project_id'];
                        let description = project['project_descrip'];
                        if (description.length > 30) {
                            description = description.substr(0, 30) + '...';
                        }

                        let focus = false;
                        if (projCount == 1) {
                            focus = true;
                            blurImage = project['phaseImagesData'][0]['image_url'];
                        }

                        let itemWidth = width - 50;

                        return (
                            <View style={[styles.tileBox, { width: itemWidth, left: 25 } ]} key={'project' + projId}
                                shadowColor="#000000" shadowOffset={{width: 0, height: 0}} shadowOpacity={0.2} shadowRadius={14}>
                                <View style={styles.tileGridThing}>
                                    <TouchableHighlight onPress={() => this.viewProject(projId)} data-project-id={projId} style={[styles.gridTile]}
                                    activeOpacity={1} underlayColor="#F2F2F2">
                                        <View style={styles.tileContain}>
                                            <Image
                                                style={[styles.tileThumbnail, { width: itemWidth }]}
                                                resizeMode="cover"
                                                source={{ uri: project['phaseImagesData'][0]['image_url'] }}
                                            />
                                            <View style={[styles.thumbnailContain, { width: itemWidth }]}></View>
                                            <View style={styles.tileInfo}>
                                                <Text style={[styles.tileTitle, styles.projectTitle]}>{project['project_name']}</Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                {/*<Text style={styles.tileName}>{project['project_name']}</Text>*/}
                            </View>
                        )

                    }
                });

            } else {
                listProjects = <View style={styles.noticeContain}><Text style={styles.noticeText}>You haven't joined or created any projects yet!</Text></View>
            }

        }

        return (
            <View style={styles.body}>
                <Image style={[styles.heroHeaderBlur, { zIndex: 1, position: 'absolute', width: width }]} source={{ uri: blurImage }} resizeMode="cover" />

                <View style={[styles.body, { zIndex: 4 }]}>
                    <HeroHeader
                        title={'Browse'}
                        blurType="dark"
                        leftCtrls={(
                            <View></View>
                        )}
                        rightCtrls={(<View></View>)}
                    />
                    <View style={[styles.heroShadow, { width: width } ]}
                    shadowColor="#000000" shadowOffset={{width: 0, height: 1}} shadowOpacity={0.3} shadowRadius={9}></View>
                    <ScrollView style={[styles.browseList, { height: height, width: width }]} contentContainerStyle={styles.gridContain} horizontal={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}}>
                        {listProjects}
                    </ScrollView>
                </View>

            </View>
        );
    }

}
