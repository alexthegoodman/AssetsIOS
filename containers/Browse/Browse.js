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

import SimpleHeader             from '../../components/SimpleHeader/SimpleHeader';

import Back1       from '../../svgComponents/svg/Back1';

@connect(
    ( state ) => ({
        userHash: state.user.userHash,
        userData: state.user.userData,
        userProjects: state.browse.userProjects,
        gotProjects: state.browse.gotProjects
    }),
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, routerActions), dispatch)
)

export default class Browse extends Component {

    constructor() {

        super();

        this.viewProject = this.viewProject.bind(this);
        this.logOut = this.logOut.bind(this);

        this.state = {}

    }

    componentDidMount() {

        let self = this;

        console.info('Browse componentDidMount', this.props.userHash);

        let browseInfo = {
            userHash: this.props.userHash
        }

        client.get('/browse/', browseInfo).then(
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

                    client.get('/browse/users', browseInfo).then(
                        (data) => {

                            console.log('/browse/users', data);
                            
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
        this.props.push('/project/' + projId);
    }

    logOut() {
        AsyncStorage.removeItem('userHash', (err, res) => {
            this.props.push('/home/');
        });
    }

    render() {

        let { userProjects, gotProjects } = this.props;

        console.info('Home', gotProjects, userProjects, Object.keys(userProjects).length);

        let listProjects, rowCount = 3, tileMargin = 70, blurImage;
        // let totalMargin = (rowCount + 1) * tileMargin, tileWidth = (width - totalMargin) / rowCount;
        if (Object.keys(userProjects).length > 0 && gotProjects) { 
            
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

                    return (
                        <View style={[styles.tileBox, { width: width } ]} key={'project' + projId}>
                            <TouchableHighlight onPress={() => this.viewProject(projId)} data-project-id={projId} style={[styles.gridTile]} 
                            activeOpacity={1} underlayColor="#F2F2F2">
                                <View style={styles.tileContain}>
                                    <Image 
                                        style={styles.tileThumbnail} 
                                        resizeMode="cover" 
                                        source={{ uri: project['phaseImagesData'][0]['image_url'] }} 
                                    />
                                    <View style={styles.tileInfo}>
                                        <Text style={styles.tileTitle}>{project['project_name']}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            {/*<Text style={styles.tileName}>{project['project_name']}</Text>*/}
                        </View>
                    )

                }
            });

        }

        return (
            <View style={styles.body}>
                <Image style={{ zIndex: 1, position: 'absolute', width: width, height: 80 }} source={{ uri: blurImage }} />
                
                <View style={[styles.body, { zIndex: 4 }]}>
                    <SimpleHeader
                        title={'Browse'}
                        leftCtrls={(
                            <TouchableHighlight onPress={this.logOut} style={styles.headerLink} 
                            activeOpacity={1} underlayColor="rgba(255,255,255,0.1)">
                                <View style={styles.inlineContain}>
                                    <View style={styles.headerLinkIcon}><Back1 width={35} height={35} color="white" /></View>
                                    <Text style={styles.headerLinkText}>Log Out</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                        rightCtrls={(<View></View>)}
                    />
                    {/*<Image style={[styles.bodyBack, { height: height, width: width }]} resizeMode="cover" source={require('../../img/backs/browseBack.jpg')}>*/}
                        <ScrollView style={{ height: height, width: width }} contentContainerStyle={styles.gridContain} horizontal={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}}>
                            {listProjects}
                        </ScrollView>
                    {/*</Image>*/}
                </View>
                
            </View>
        );
    }

}
