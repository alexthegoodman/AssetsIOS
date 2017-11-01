import React, { Component }  from 'react';
import { connect }                      from 'react-redux';
import { bindActionCreators }           from 'redux';
import * as userActions                 from '../../redux/modules/user';
import * as browseActions                 from '../../redux/modules/browse';

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
    Image,
    Dimensions,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");
const Entities                      = require('html-entities').XmlEntities;
const entities                      = new Entities();
const dateFormat                    = require('dateformat');

import HTMLView from 'react-native-htmlview';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';

@connect(
    ( state ) => ({
        userHash: state.user.userHash,
        projectComments: state.browse.projectComments,
        gotProjectComments: state.browse.gotProjectComments,
        projId: state.browse.currentPhase.projectId,
        currentProject: state.browse.currentProject
    }),
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, userActions), dispatch)
)

export default class AssetComments extends Component {

    constructor(props) {
        
        super(props);

        this.state = { 
            text: '',
            likes: {},
            showAllComments: false,
            buttonText: 'Post'
        };

        this.buildComment       = this.buildComment.bind(this);
        this.postComment        = this.postComment.bind(this);
        // this.likeComment        = this.likeComment.bind(this);
        // this.showFewerComments  = this.showFewerComments.bind(this);
        // this.showAllComments    = this.showAllComments.bind(this);
        
    }

    componentDidMount() {
        
    }

    postComment() {

        if (this.state.text == '') {

            alert('No comment inserted!');
        
        } else {

            Keyboard.dismiss();

            let phaseImagesList = this.props.currentProject['phaseImagesList'];

            let commentInfo = {
                userHash:       this.props.userHash,
                projectId:      this.props.projId,
                imageId:        this.props.assetData['image_id'],
                commentText:    '<p>' + this.state.text + '</p>',
                commentAuthor:  this.props.userHash
            }

            // post by api, upon res the get and refresh
            client.get('/project/set/comment', commentInfo, 'POST').then(
                (data) => {

                    console.log('/project/set/comment', data, commentInfo);
                        
                    if (typeof data['CommentSet'] != 'undefined' &&
                        data['CommentSet'] != false) {

                        // refresh comments
                        if (Object.keys(phaseImagesList).length > 0) {

                            let getInfo = {
                                userHash: this.props.userHash,
                                phaseImagesList: JSON.stringify(phaseImagesList)
                            }

                            client.get('/browse/comments', getInfo).then(
                                (data) => {

                                    console.info('browse/comments', data, getInfo);
                                    
                                    if (typeof data['ProjectComments'] != 'undefined' &&
                                        data['ProjectComments'] != false) {

                                        this.setState({
                                            buttonText: 'Post'
                                        });

                                        this.props.fetchProjectCommentsSuccessAction(data['ProjectComments'], this.props.projId);
                                    } else {
                                        this.props.fetchProjectCommentsFailureAction(this.props.projId);
                                    }
                                    
                                }, (err) => {
                                    //console.log(err);
                                    this.props.fetchProjectCommentsFailureAction(this.props.projId);
                                }
                            );
                        }

                    } else {
                        alert('Comment could not posted! Error 2.');
                    }
                    
                }, (err) => {
                    console.log(err);
                    alert('Comment could not posted! Error 1.');
                }
            );

            this.setState({
                text: '',
                buttonText: 'Posting'
            });

        }

    }

    buildComment(comment, commentCount, imageId) {

        // console.info('buildComment', comment, commentCount)

        //let userLikes = false;
        let userHash = this.props.userHash;

        let thisId = this.props.projId;
        let theseComments = this.props.projectComments[thisId];

        for (let kee in comment['likers']) {
            if (comment['likers'][kee]['meta_value'] == userHash) {
                userLikes = true;
            }
        }

        if (typeof this.state['likes'][comment['comment_id']] != 'undefined' && 
            this.state['likes'][comment['comment_id']] == userHash) {
            userLikes = true;
        }

        // if (typeof this.state['dislikes'][comment['comment_id']] != 'undefined' && 
        //     this.state['dislikes'][comment['comment_id']] == userHash) {
        //     userLikes = false;
        // }

        let commentHeart;
        // if (userLikes) {
        //     var commentHeart = <i onClick={this.likeComment} data-image-id={imageId} data-comm-id={comment['comment_id']} className="ic ic-heart full"></i>
        // } else {
        //     var commentHeart = <i onClick={this.likeComment} data-image-id={imageId} data-comm-id={comment['comment_id']} className="ic ic-heart empty"></i>
        // }

        //let imageId = this.props.assetData['image_id'];
        let imageComments = Object.keys(theseComments[imageId]).map(x => theseComments[imageId][x]);
        let showComments = 3;
        let moreComment = '', commentClass = '';

        // if (showComments > 0 && !this.state.showAllComments) {
        //     if (commentCount > showComments) {
        //         commentClass = styles.hiddenCommentItem;
        //     }
        // }

        if (typeof comment['comment_text'] != 'undefined') {

            let authorFirst     = entities.decode(comment['comment_author_first']);
            let authorLast      = entities.decode(comment['comment_author_last']);
            let commentText     = entities.decode(comment['comment_text']);
            commentText         = commentText.split('<br />');
            
            let commentHtml = '';
            for(var i=0,l=commentText.length;i<l;i++){
                commentHtml += '<p>' + commentText[i] + '</p>';
            }

            let commentDate     = 'Just Now';
            if (comment['comment_date'] != '') {
                commentDate     = new Date(entities.decode(comment['comment_date']));
            }

            return (
                <View style={[styles.commentItem, commentClass, { width: width }]} key={'comment' + comment['comment_id']}>
                    
                    <View style={styles.commentMeta}>
                        <Text style={styles.commentTitle}>{authorFirst} {authorLast}</Text>
                        <Text style={styles.commentDate}>{dateFormat(commentDate, 'fullDate')}</Text>
                    </View>

                    <HTMLView
                        value={commentHtml}
                        stylesheet={styles}
                        style={styles.commentContent}
                    />

                    {commentHeart}

                </View>
            );

        }

    }

    render() {

        let { assetData, userHash, projId, projectUsers, projectComments, gotProjectComments } = this.props;

        let commentList, commentCount = 0, commentPlaceholder;
        let imageId         = assetData['image_id'];
        let buildComment    = this.buildComment;

        // console.info(projectComments, imageId, projId, projectComments[projId], projectComments[projId][imageId]);

        projectComments = projectComments[projId];

        if (gotProjectComments) {
            if (typeof projectComments != 'undefined') {
                if (typeof projectComments[imageId] != 'undefined' && Object.keys(projectComments[imageId]).length > 0) {

                    let imageComments = Object.keys(projectComments[imageId]).map(x => projectComments[imageId][x]);

                    imageComments.reverse();

                    commentList = imageComments.map( comment => {

                        commentCount++;
                        
                        return buildComment(comment, commentCount, imageId);

                    });

                    commentPlaceholder = 'Continue the discussion!';

                } else {
                    commentList = <View style={[styles.commentList, styles.noComments, { width: width } ]}><Text style={styles.noCommentsText}>Start the conversation!</Text></View>
                    commentPlaceholder = 'Start the conversation!';
                }

            }
        } else {
            commentPlaceholder = 'Loading comments...';
        }

        let commentsCtrl = <Text style={styles.commentsCtrlText}>Pull to load more...</Text>;

        return (

            <View style={styles.assetComments}>
                
                {/*<KeyboardAvoidingView behavior="position" style={[styles.feedbackAvoidingView, { width: width }]}>*/}
                    <InvertibleScrollView style={[styles.commentList, { width: width, height: this.props.commentViewHeight } ]} 
                        horizontal={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} 
                        contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}} inverted>
                        <View style={[styles.formSpacer, {width:width}]}></View>
                        {commentList}
                        {/*<View style={[styles.commentsCtrl, { width: width } ]}>{commentsCtrl}</View>*/}
                    </InvertibleScrollView>
                {/*</KeyboardAvoidingView>*/}

                <View style={[styles.commentFormContain, {width:width}]}>
                    <View style={[styles.commentForm, { width: width } ]}>
                        <TextInput
                            multiline
                            ref="commentInput"
                            style={[styles.commentFormInput, {width: width - 110}]}
                            onChangeText={(text) => {this.setState({text})}}
                            value={this.state.text}
                            secureTextEntry={true}
                            placeholder="Write your message..."
                            placeholderTextColor="#9B9B9B"
                            autoCapitalize="none"
                            selectionColor="#e25147"
                            returnKeyType="done"
                            onSubmitEditing={this.postComment}
                        />
                        <TouchableHighlight 
                            onPress={this.postComment} style={[styles.formBtn]} 
                            activeOpacity={1} underlayColor="#F2F2F2">
                            <Text style={styles.formBtnText}>{this.state.buttonText}</Text>
                        </TouchableHighlight>
                    </View>
                    <KeyboardSpacer topSpacing={0} />
                </View>
                
            </View>

        );
    }
}
