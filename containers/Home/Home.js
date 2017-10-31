import React, { Component, PropTypes }  from 'react';
import { connect }                      from 'react-redux';
import { bindActionCreators }           from 'redux';
import * as userActions                 from '../../redux/modules/user';
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
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Dimensions,
    TextInput,
    StatusBar
} from 'react-native';

let { width, height } = Dimensions.get('window');

const client                        = new ApiClient();
const styles                        = require('../../css/style.js');
const DeviceInfo                    = require('react-native-device-info');
const JefNode                       = require('json-easy-filter').JefNode;
const deepcopy                      = require("deepcopy");
const { BlurView, VibrancyView }    = require('react-native-blur');

import BeForm               from '../../beyondtoolbox/BeForm/BeForm';
import BeInput              from '../../beyondtoolbox/BeInput/BeInput';

@connect(
    ( state ) => ({
        userHash: state.user.userHash,
        userData: state.user.userData
    }),
    ( dispatch ) => bindActionCreators(Object.assign({}, userActions, routerActions), dispatch)
)

export default class Home extends Component {

    constructor() {

        super();

        this.attemptLogin   = this.attemptLogin.bind(this);

        this.state = {
            loggingIn: false,
            submitSuccess: false,
            submitFailure: false,
            validating: false,
        }

    }

    componentDidMount() {

        let self = this;

    }

    attemptLogin() {

        let self = this;
        let textInputs = this.refs['loginForm'].state.textInputs;

        //console.info('attemp login', textInputs)

        // textInputs['loginForm1']
        if (textInputs['loginForm1'] && textInputs['loginForm2']) {

            self.setState({
                loggingIn: true
            });

            let loginInfo = {
                email:      textInputs['loginForm1'],
                pass:       textInputs['loginForm2'],
                hasHash:    false
            }

            client.get('/login', loginInfo, 'POST').then(
                (data) => {

                    console.log('/login', loginInfo, data);

                    if (typeof data['LoginAttempt'] != 'undefined' &&
                        data['LoginAttempt'] == 'success') {
                        
                        self.setState({
                            loggingIn: false
                        });

                        let userHash = data['UserHash'];

                        AsyncStorage.setItem('userHash', userHash + '', (err, userRes) => {
                            self.props.fetchUserSuccessAction(userHash);
                            self.props.push('/browse/');
                        });

                    } else {

                        self.setState({
                            loggingIn: false
                        });

                        alert(data['Alert']);

                    }
                    
                }
            ).catch((err) => {
                console.error(err);
            });
        } else {
            alert('Please enter your email and password.');
        }

    }

    render() {

        // let { } = this.props;

        let buttonText = 'Log In';

        if (this.state.loggingIn) {
            buttonText = 'Logging in...';
        }

        return (
            <View style={styles.homeBody}>
                <StatusBar barStyle="light-content" />
                <Image style={[styles.bodyLeftBackground, { width: width, height: height }]} resizeMode="cover" source={require('../../img/backs/demo.jpg')}></Image>
                <BlurView blurType="dark" blurAmount={10} style={[styles.bodyLeftBlur, { width: width, height: height }]} />
                
                <View style={[styles.bodyTop, { width: width, height: 350 }]}>
                    <View style={styles.loginForm}>
                        <Text style={styles.formHeadline}>Assets</Text>
                        <Text style={styles.formDescription}>Create your account online or access your projects by logging in below.</Text>

                        <BeForm
                            ref="loginForm"
                            name="loginForm"
                            placeholderTextColor="#9B9B9B"
                            selectionColor="#e25147"
                            autoCapitalize="none"
                            autoCorrect={false}
                            enableNextButton={true}
                            enableDoneButton={true}
                            onFinish={this.attemptLogin}
                        >
                            <BeInput 
                                placeholder="Email"
                                keyboardType="email-address"
                            />
                            <BeInput 
                                placeholder="Password"
                                secureTextEntry={true}
                            />
                        </BeForm>


                        {/*<TextInput
                            ref="login1"
                            style={styles.textInput}
                            onChangeText={this.updateEmail}
                            value={this.state.email}
                            placeholder="Email"
                            placeholderTextColor="#9B9B9B"
                            autoCapitalize="none"
                            autoCorrect={false}
                            selectionColor="#e25147"
                            keyboardType="email-address"
                            returnKeyType="next"
                            onSubmitEditing={this.nextInput}
                            onFocus={() => this.setState({ currentInput: '1' })}
                        />
                        <View style={styles.inputBorder}></View>
                        <TextInput
                            ref="login2"
                            style={styles.textInput}
                            onChangeText={this.updatePassword}
                            value={this.state.password}
                            secureTextEntry={true}
                            placeholder="Password"
                            placeholderTextColor="#9B9B9B"
                            autoCapitalize="none"
                            autoCorrect={false}
                            selectionColor="#e25147"
                            returnKeyType="done"
                            onSubmitEditing={this.attemptLogin}
                            onFocus={() => this.setState({ currentInput: '2' })}
                        />*/}
                        <TouchableOpacity activeOpacity={1} underlayColor="#F2F2F2"  
                                style={styles.loginBtn} onPress={ this.attemptLogin }>
                            <View style={styles.loginBtnContain} shadowColor="#000000" shadowOffset={{width: 0, height: 0}} shadowOpacity={0.1} shadowRadius={8}><Text style={styles.loginBtnText}>{buttonText}</Text></View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.infoHeadline}>Mobile Collaboration</Text>
                    <Text style={styles.infoPoint}>Browse projects and rank concepts wherever you are</Text>
                    <Text style={[styles.infoPoint, { marginBottom: 0 }]}>Manage your team and keep up with your clients</Text>
                </View>
            </View>
        );
    }

}
