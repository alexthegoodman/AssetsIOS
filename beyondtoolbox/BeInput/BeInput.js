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

        this.focus              = this.focus.bind(this);
        this.formatPhone        = this.formatPhone.bind(this);
        
    }

    focus() {
        this.refs[this.props.inputName].focus();
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

        // props are either passed down straight thry BeInput, or up from BeForm then thru BeInput
        let { inputName, placeholder, keyboardType, autoCapitalize, autoCorrect, secureTextEntry } = this.props;
        let { placeholderTextColor, selectionColor, onChangeText, value, returnKeyType, onSubmitEditing, onFocus } = this.props;

        // console.info('BeInput render ', inputName, placeholder, keyboardType, autoCapitalize, autoCorrect, secureTextEntry);
        // console.info('Render global', placeholderTextColor, selectionColor, onChangeText, value, returnKeyType, onSubmitEditing, onFocus)

        return (
            <TextInput 
                ref={inputName}
                style={styles.textInput}
            
                placeholder={placeholder}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                secureTextEntry={secureTextEntry}
                placeholderTextColor={placeholderTextColor}
                selectionColor={selectionColor}
                onChangeText={onChangeText}
                value={value}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                onFocus={onFocus}
            />
        );
    }

}