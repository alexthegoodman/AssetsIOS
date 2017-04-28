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
    Image,
    Dimensions,
    ScrollView
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

@connect(
    ( state ) => ({
        userHash: state.user.userHash,
        projectComments: state.browse.projectComments,
        gotProjectComments: state.browse.gotProjectComments,
        projId: state.browse.currentPhase.projectId
    }),
    ( dispatch ) => bindActionCreators(Object.assign({}, browseActions, routerActions), dispatch)
)

export default class AssetComments extends Component {

    constructor(props) {
        
        super(props);

        this.state = { 
            text: '',
            likes: {},
            showAllComments: false
        };

        this.buildComment       = this.buildComment.bind(this);
        this.postComment        = this.postComment.bind(this);
        // this.likeComment        = this.likeComment.bind(this);
        // this.showFewerComments  = this.showFewerComments.bind(this);
        // this.showAllComments    = this.showAllComments.bind(this);
        
    }

    componentDidMount() {
        
    }

    postComment(e) {

        e.preventDefault();

        if (this.state.text == '') {

            alert('No comment inserted!');
        
        } else {

            

            // post via socket
            this.context.socket.emit('setComment',
                {
                    ProjectId:      this.props.projId,
                    ImageId:        this.props.assetData['image_id'], 
                    CommentText:    $commentDOM.html(), 
                    CommentAuthor:  this.props.userHash 
                }
            );

            // clear field
            this.setState( { text: '' } );

        }

    }

    buildComment(comment, commentCount, imageId) {

        console.info('buildComment', comment, commentCount)

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
        let showComments = Object.keys(imageComments).length - 3;
        let moreComment = '', commentClass = '';

        if (showComments > 0 && !this.state.showAllComments) {
            
            // if (commentCount == showComments) {
            //     moreComment = <a data-call="moreComments">Show More Comments</a>
            // }

            if (commentCount <= showComments) {
                commentClass = styles.hiddenCommentItem;
            }
            
        }

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

            console.info('html', commentHtml)

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

    // likeComment(e) {

    //     e.preventDefault();

    //     const { likeAssetCommentSuccessAction, likeAssetCommentFailureAction } = this.props;
    //     let userHash    = this.props.userHash;
    //     let state       = this.state;
    //     let nextState   = $.extend({}, state);
    //     let commentId   = $(e.target).attr('data-comm-id');
    //     let imgId       = $(e.target).attr('data-image-id');
    //     let projectId   = this.props.projId;

    //     //console.info('likeComment', userHash, commentId);

    //     if ($(e.target).hasClass('empty')) {
            
    //         //nextState['likes'][commentId] = userHash;

    //         //this.setState(nextState);

    //         likeAssetCommentSuccessAction(commentId, imgId, projectId, userHash);

    //         this.context.socket.emit('likeComment', { 
    //             'CommentId':    commentId,
    //             'UserHash':       userHash
    //         } );
        
    //     } else {
    //         console.info('unlike');
    //     }

    // }

    // showFewerComments() {
    //     this.setState({ showAllComments: false });
    // }

    // showAllComments() {
    //     this.setState({ showAllComments: true });
    // }

    render() {

        let { assetData, userHash, projId, projectUsers, projectComments, gotProjectComments } = this.props;

        let commentList, commentCount = 0, commentPlaceholder;
        let imageId         = assetData['image_id'];
        let buildComment    = this.buildComment;

        console.info(projectComments, imageId, projId, projectComments[projId], projectComments[projId][imageId]);

        projectComments = projectComments[projId];

        if (gotProjectComments) {
            if (typeof projectComments != 'undefined') {
                if (typeof projectComments[imageId] != 'undefined' && Object.keys(projectComments[imageId]).length > 0) {

                    let imageComments = Object.keys(projectComments[imageId]).map(x => projectComments[imageId][x]);

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

        let commentsCtrl;
        // if (commentCount > 3) {
        //     if (this.state.showAllComments) {
        //         commentsCtrl = <a className="comment-ctrl" onClick={this.showFewerComments} data-call="fewerComments">Show Fewer Comments</a>
        //     } else {
        //         commentsCtrl = <a className="comment-ctrl" onClick={this.showAllComments} data-call="allComments">Show All Comments</a>
        //     }
        // }

        return (

            <View style={styles.assetComments}>
                <View style={[styles.commentsCtrl, { width: width } ]}>{commentsCtrl}</View>
                <ScrollView style={[styles.commentList, { width: width, height: this.props.commentViewHeight } ]} horizontal={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}}>{commentList}</ScrollView>
                <View style={[styles.commentForm, { width: width } ]}>

                </View>
            </View>

        );
    }
}
