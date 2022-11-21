import React, { Component } from 'react'
import DeviceInfo from 'react-native-device-info'
import styles from '../styles'
import * as UserAction from '../remx/User/actions'
import {encode} from 'base-64';
import md5 from 'md5'
import Spinner from 'react-native-loading-spinner-overlay'
import AsyncStorage from '@react-native-community/async-storage'
import Toast from 'react-native-simple-toast';
import packageJson from '../package.json';
import { store } from '../remx/User/store';

import {
	StyleSheet,
	View,
	StatusBar,
	Switch,
	ImageBackground,
	Image,
	Keyboard,
	Dimensions,
	BackHandler,
} from 'react-native'

import {
	Button,
	Text,
	Item,
	Input,
	Card,
	Icon,
} from 'native-base'
import { REST_URL, handleBack, HEADERS_CONFIG } from 'aralia/AppConfig';

export default class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: '',
			showLoading: false,
			showPassword : true,
		}
		this.toggleSwitch = this.toggleSwitch.bind(this);
	}

	componentDidMount() {
		// AsyncStorage.setItem('nip', 'P81190');
		this.backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBack,
		);

		this.props.navigation.addListener('willBlur', () =>
			this.backHandler.remove(),
		);
	}

	toggleSwitch() {
		this.setState({ showPassword: !this.state.showPassword });
	}

	storeQuesioner = async (value) => {
		try {
		  await AsyncStorage.setItem('@quesioner_count', value)
		} catch (e) {
		  console.log(e);
		}
	  }

	render() {

		return (
			<ImageBackground
				source={require('assets/bg-login.png')}
				style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height }} >
				
				<Text style={{ textAlign: 'right', paddingRight:2, fontSize: 10, fontWeight: '100', color: '#fff' }}>ver. {packageJson.version}</Text>

				<View style={style.container}>
					<StatusBar
						backgroundColor={styles.statusbarAccent.backgroundColor}
						barStyle="light-content" />

					<Spinner
						visible={this.state.showLoading}
						color={styles.statusbarAccent.backgroundColor}
						size='large' />

					<Image
						source={require('assets/logo.png')}
						style={style.logo} />

					<Card transparent style={style.loginBox}>

						<Item
							regular
							style={style.textInput}>
							<Icon active name='user' type="AntDesign" />
							<Input
								placeholder="User ID"
								onChangeText={(text) => this.setState({ username: text })} />
						</Item>

						<Item
							regular
							style={style.textInput}>
							<Icon active name='lock' type="AntDesign" />
							<Input
								placeholder="Password"
								secureTextEntry={this.state.showPassword}
								onChangeText={(password) => this.setState({ password })} />
						</Item>
						<Item
							regular
							style={style.securePassword}>
								<Switch
									onValueChange={this.toggleSwitch}
									value={!this.state.showPassword}
								/>
								<Text style={style.labelShowPassword}>Show password</Text>
						</Item>
 
						
						<View style={{ display: 'flex', width: '90%' }}>
							{/* <LinearGradient colors={['rgba(242,209,101,1)', 'rgba(196,141,39,1)']}> */}

							<Button
								success
								block
								style={styles.buttonPrimary, {borderRadius: 10}/* {backgroundColor: '#FF0000'} */}
								onPress={() => this.doLogin()}>
								<Text>Login</Text>
							</Button>

							{/* </LinearGradient> */}
						</View>
						<View style={{ paddingLeft: 3, marginTop:20, display: 'flex', width: '90%' }}>
							<Text style={{color: 'white', fontWeight:'bold', fontSize:12}} onPress={() => this.doLostPassword() }>
							Lupa Password Anda ?</Text>
						</View>

					</Card>

		

				</View>
			</ImageBackground>
		);
	}

	doLogin() {
		// do nothing when username and password is empty
		if (this.state.username == '' && this.state.password == '') return false;

		const LOGIN_URL = `${REST_URL}/login`;
		Keyboard.dismiss();

		this.setState({ showLoading: true });
		const formData = new FormData();
		formData.append('username', this.state.username);
		formData.append('password', this.state.password);
		formData.append('imei', DeviceInfo.getUniqueId());

		// do login process
		fetch(LOGIN_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
				...HEADERS_CONFIG.headers,
			},
			body: formData,
		}).then(response => response.json())
		.then(res => {
			this.setState({ showLoading: false });
			if (res.status == "error") {
				this.setState({ password: '' });
				Toast.show(res.message, Toast.LONG);
				store.setConfigData({});
			} else if (res.status == "success") {
				// set config API
				store.setConfigData(res.mobileapi);
				AsyncStorage.setItem('pw', res.values.password).then(() => {
					AsyncStorage.setItem('eid', res.values.id_employee).then(() => {});
					AsyncStorage.setItem('nip', res.values.employee_id).then(() => {
						// get user detail, store to remx
						UserAction.getUserDetail(res.values.id_employee);
						UserAction.setQuesionerData(res.values.check_quesioner, res.values.is_quesioner);
						// ServiceAction.getMyRequest(userNip);
						// ServiceAction.getTodoList(userNip);

						// test survey
						// this.props.navigation.navigate('HealthSurvey');
						
						if(res.values.is_office_update == '1') {
							this.props.navigation.navigate('OfficeUpdate');
						// }else if((res.values.is_office_update == '0') && (res.values.is_quesioner == '1') && (res.values.check_quesioner < 1)) {
						// 	this.props.navigation.navigate('HealthSurvey');
						} else {
							this.props.navigation.navigate('Home');
						}
					});
				});
			}
		})
		.catch(err => {
			store.setConfigData({});
			this.setState({ showLoading: false });
			Toast.show(`Error when doing login :\n ${err}`, Toast.SHORT);
		});
	}

	doLostPassword() {
		this.props.navigation.navigate('LostPassword');
	}
}

const style = StyleSheet.create({
	logo: {
		aspectRatio: 2, 
		resizeMode: 'contain',
		marginBottom: 30,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	labelShowPassword: {
		fontSize:11,
	},
	textInput: {
		width: '90%',
		// borderWidth: 1,
		// borderColor: '#ccc',
		borderRadius: 10,
		paddingLeft: 10,
		marginBottom: 10,
		// color: '#fff',
		backgroundColor: '#fff',
	},

	securePassword: {
		width: '100%',
		// borderWidth: 1, 
		// borderColor: '#ccc',
		borderRadius: 10,
		marginBottom: 10,
		paddingLeft: 15,
		borderColor: 'rgba(255, 99, 71, 0)',
		// color: '#fff',
	},

	loginBox: {
		width: '90%',
		alignContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(207,207,207,0.4)',
		paddingTop: 20,
		paddingBottom: 20,
		borderRadius: 10,
	}
})
