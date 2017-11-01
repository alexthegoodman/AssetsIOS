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
        //this.updateCurrentInput = this.updateCurrentInput.bind(this);
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
        if (typeof this.refs[this.props.name + prevInput] != 'undefined') {
            this.refs[this.props.name + prevInput].focus();
        }
    }
    nextInput() {
        let nextInput = parseInt(this.state.currentInput) + 1;
        //console.info('nextInpiut', this.state.currentInput, this.refs[this.props.name + nextInput])
        if (typeof this.refs[this.props.name + nextInput] != 'undefined') {
            this.refs[this.props.name + nextInput].focus();
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

    updateCurrentInput(input) {

        console.info('setInput', input);

        this.setState({ currentInput: input + '' });

    }

    // apply global properties certain children
    getTransformedChildren() {
        
        let self = this;
        let { name, enableNextButton, enableDoneButton } = self.props;
        let n = 0;

        // enableNextButton
        // enableDoneButton
        // onFinish

        return React.Children.map(self.props.children, child => {
            // if child is of type ProductsDetail, clone it so you can 
            // pass your own prop to it else return the child
            n++;
            let inputRef = name + n;
            
            //console.info(inputRef, child, self.state);

            let inputHandler, returnType;
            if (enableNextButton) {
                inputHandler = self.nextInput;
                returnType = 'next';
            }
            if (enableDoneButton && self.props.children.length == n) {
                inputHandler = self.props.onFinish;
                returnType = 'done';
            }

            let value = '';
            if (typeof self.state.textInputs[inputRef] != 'undefined') {
                value = self.state.textInputs[inputRef];
            }

            let newChild = child;
            if (child.type === BeInput) {
                
                // do not overwrite Input-specific props
                let globalInputProps = { ref: inputRef, inputName: inputRef + 'Child' };
                if (typeof child.props.placeholderTextColor == 'undefined') {
                    globalInputProps.placeholderTextColor = self.props.placeholderTextColor;
                }
                if (typeof child.props.selectionColor == 'undefined') {
                    globalInputProps.selectionColor = self.props.selectionColor;
                }
                if (typeof child.props.autoCapitalize == 'undefined') {
                    globalInputProps.autoCapitalize = self.props.autoCapitalize;
                }
                if (typeof child.props.autoCorrect == 'undefined') {
                    globalInputProps.autoCorrect = self.props.autoCorrect;
                }
                if (typeof child.props.returnKeyType == 'undefined') {
                    globalInputProps.returnKeyType = returnType;
                }
                if (typeof child.props.onSubmitEditing == 'undefined') {
                    globalInputProps.onSubmitEditing = inputHandler;
                }

                // add correct mgmt ctrls
                if (true) {
                    globalInputProps.value = value;
                    globalInputProps.onChangeText = (text) => self.updateText(inputRef, text);
                    globalInputProps.onFocus = self.updateCurrentInput.bind(self, n);
                }

                //console.info('isBeInput', globalInputProps, child.props, n);

                newChild = React.cloneElement(child, globalInputProps);
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