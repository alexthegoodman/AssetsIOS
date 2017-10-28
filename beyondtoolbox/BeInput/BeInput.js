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
    Dimensions,
    TextInput
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");

export default class BeInput extends Component {

    constructor() {

        super();

        this.state = {}

    }

    componentDidMount() {

        let self = this;

        this.formatPhone        = this.formatPhone.bind(this);
        
    }

    // input masks
    formatPhone(phone) {
        let cleanNum = phone;
        cleanNum = cleanNum.split('-').join('');
        cleanNum = cleanNum.split('.').join('');
        if (cleanNum.length == 7) {
            phone = phoneFormatter.format(cleanNum, "NNN-NNNN");
        } else if (cleanNum.length == 10) {
            phone = phoneFormatter.format(cleanNum, "NNN-NNN-NNNN");
        }
        return phone;
    }

    render() {

        let { placeholder, keyboardType, autoCapitalize, autoCorrect, secureTextEntry } = this.props;

        console.info('BeInput render ', placeholder, keyboardType, autoCapitalize, autoCorrect, secureTextEntry)

        return (
            <TextInput 
                style={styles.textInput}
                placeholder={placeholder}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                secureTextEntry={secureTextEntry}
            />
        );
    }

}