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
    ScrollView,
    Keyboard
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");

import Down       from '../../svgComponents/svg/Down';

export default class AssetRank extends Component {

    constructor() {

        super();

        this.toggleRankings = this.toggleRankings.bind(this);

        this.state = {
            rankOpen: false,
            rankHeight: 50
        }

    }

    componentDidMount() {

        let self = this;

        console.info('AssetRank componentDidMount');
        
    }

    toggleRankings() {

        Keyboard.dismiss();

        if (this.state.rankOpen) {
            this.setState({
                rankOpen: false,
                rankHeight: 50
            })
        } else {
            this.setState({
                rankOpen: true,
                rankHeight: height - 250
            })
        }

    }

    render() {

        let { assetData, projectUsers } = this.props;
        
        // inspired by web app AssetRank
        let rankData = JSON.parse(assetData['image_rank']);
        let total = 0, count = 0, average, averageRank, rankList, firstname, lastname, thisUser, thisUserHash;
        
        for (let kee in rankData[0]) {
            if (rankData[0][kee] != 0) {
                
                count++;
                
                total += parseInt(rankData[0][kee]);

            }
        }
        
        average = Math.round(total / count);
        if (!isNaN(average)) {
            averageRank = <View style={styles.averageRank}><View style={styles.averageCircle}><Text style={styles.averageRankValue}>{average}</Text></View><Text style={styles.averageRankLabel}>Average Rating</Text></View>
        } else {
            averageRank = <View style={styles.noRankingsNote}><Text style={styles.noRankingsNoteText}>No Rankings</Text></View>
        }
        
        let listRankData = Object.keys(rankData[0]).map(x => rankData[0][x]);
        count = -1;
        rankList = listRankData.map( rank => {

            count++;
            if (rank != 0) {
            
                firstname = '';
                lastname = '';

                thisUserHash = Object.keys(rankData[0])[count];

                thisUser = new JefNode(projectUsers).filter(function(node) {
                    if (node.key == 'id' && node.value == thisUserHash) {
                        return node.parent.value;
                    }
                });

                // user may have been invited, not joined
                if (typeof thisUser[0] != 'undefined') {
                    firstname = thisUser[0]['firstname'];
                    lastname = thisUser[0]['lastname'];
                }

                let fullName = firstname + ' ' + lastname;
                if (fullName.length > 30) {
                    fullName = fullName.substr(0, 30) + '...';
                }

                return <View key={'rankItem' + thisUserHash + assetData['image_id']} style={styles.userRank}><View style={styles.rankContain}><Text style={styles.rankValue}>{rank}</Text></View><Text style={styles.rankName}>{fullName}</Text></View>;
            
            }
        });

        return (
            <View style={[styles.assetRankBody, { height: this.state.rankHeight } ]}>
                <TouchableHighlight activeOpacity={1} underlayColor="#E5E5E5" onPress={this.toggleRankings} style={styles.averageRank}>
                    <View style={[styles.averageRankContain, {width:width}]}>
                        {averageRank}
                        <View style={styles.averageRankIcon}><Down width={20} height={20} color="#595959" /></View>
                    </View>
                </TouchableHighlight>
                <ScrollView style={[styles.rankList, { height: this.state.rankHeight - 50 } ]}
                    horizontal={false} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false} 
                    contentInset={{top: 0, left: 0, bottom: 0, right: 0}} contentOffset={{x: 0, y: 0}}>
                    {rankList}
                </ScrollView>
            </View>
        );
    }

}