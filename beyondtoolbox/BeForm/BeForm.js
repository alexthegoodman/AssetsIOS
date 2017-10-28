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

import BeInput              from '../../beyondtoolbox/BeInput/BeInput';



// BeForm allows easy global properties, input masks, validation, navigation, and more in a fast package


export default class BeForm extends Component {

    constructor() {

        super();

        this.checkStateEmpty    = this.checkStateEmpty.bind(this);
        this.prevInput          = this.prevInput.bind(this);
        this.nextInput          = this.nextInput.bind(this);
        this.closeAll           = this.closeAll.bind(this);
        this.updateText         = this.updateText.bind(this);
        this.getTransformedChildren = this.getTransformedChildren.bind(this);

        this.state = {
            currentInput: 0,
            textInputs: {}
        }

    }

    componentDidMount() {

        let self = this;
        
    }

    checkStateEmpty(fields) {
        for (let key in fields) {
            if (!this.state[fields[key]]) {
                return false;
            }
        }
        return true;
    }
    
    prevInput() {
        let prevInput = parseInt(this.state.currentInput) - 1;
        if (typeof this.refs[this.props.ref + prevInput] != 'undefined') {
            this.refs[this.props.ref + prevInput].focus();
        }
    }
    nextInput() {
        let nextInput = parseInt(this.state.currentInput) + 1;
        if (typeof this.refs[this.props.ref + nextInput] != 'undefined') {
            this.refs[this.props.ref + nextInput].focus();
        }
    }

    closeAll() {
        Keyboard.dismiss();
    }

    updateText(inputRef, text) {
        
        let self = this;
        let deepState = deepcopy(self.state);
        deepState.textInputs[inputRef] = text;

        self.setState(deepState);

    }

    // apply global properties certain children
    getTransformedChildren() {
        
        let self = this;
        let { name, textInputStyle, placeholderTextColor, selectionColor } = self.props;
        let n = 0;

        return React.Children.map(self.props.children, child => {
            // if child is of type ProductsDetail, clone it so you can 
            // pass your own prop to it else return the child
            n++;
            let inputRef = name + n;
            
            console.info(inputRef, textInputStyle, child, self.state);

            let inputHandler = self.nextInput, returnType = 'next';
            if (self.props.children.length == n) {
                inputHandler = self.props.onFinish;
                returnType = 'done';
            }

            let value = '';
            if (typeof self.state.textInputs[inputRef] != 'undefined') {
                value = self.state.textInputs[inputRef];
            }

            let newChild = child;
            if (child.type === BeInput) {
                console.info('isBeInput', textInputStyle, placeholderTextColor, selectionColor);
                newChild = React.cloneElement(child, { 
                    ref: inputRef,
                    style: textInputStyle,
                    placeholderTextColor: placeholderTextColor,
                    selectionColor: selectionColor,

                    onChangeText: (text) => self.updateText(inputRef, text),
                    value: value,
                    returnKeyType: returnType,
                    onSubmitEditing: self.nextInput,
                    onFocus: () => self.setState({ currentInput: n + '' })
                })
            }

            return newChild
            
        })
    }

    render() {

        // let {  } = this.props;

        return (
            <View style={styles.formContainer}>

                {this.getTransformedChildren()}
                
            </View>
        );
    }

}