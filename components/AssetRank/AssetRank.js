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
    Dimensions
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");

export default class AssetRank extends Component {

    constructor() {

        super();

        this.state = {
            rankHeight: 50
        }

    }

    componentDidMount() {

        let self = this;

        console.info('AssetRank componentDidMount');
        
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
            averageRank = <View style={styles.averageRank}><View style={styles.averageCircle}><Text style={styles.averageRankValue}>{average}</Text></View><Text style={styles.averageRankLabel}>Average</Text></View>
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
                if (fullName.length > 15) {
                    fullName = fullName.substr(0, 15) + '...';
                }

                return <View key={'rankItem' + thisUserHash + assetData['image_id']} style={styles.userRank}><View style={styles.rankContain}><Text style={styles.rankValue}>{rank}</Text></View><Text style={styles.rankName}>{fullName}</Text></View>;
            
            }
        });

        return (
            <View style={[styles.assetRankBody, { height: 50 } ]}>
                <View style={styles.averageRank}>
                    {averageRank}
                </View>
                <View style={styles.rankList}>
                    {rankList}
                </View>
            </View>
        );
    }

}