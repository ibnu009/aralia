import React, { Component } from 'react';
import { connect } from 'remx';
import { store as ServiceStore } from '../../remx/Service/store';
import { store as UserStore } from '../../remx/User/store';
import * as UserAction from '../../remx/User/actions';
import { handleBack } from 'aralia/AppConfig';
import {
  Container,
  Content,
  Body,
  Text,
  Left,
  ListItem,
  Icon,
  Button,
  Right,
} from 'native-base';

import {
  ImageBackground,
  Dimensions
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity, Alert } from 'react-native';

const {width, height} = Dimensions.get('screen');

class TabSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    UserAction.checkSession();
  }

  featureCheck = target => {
    const { featureData } = this.props;
    if (featureData[target] == 'true') {
      this.props.navigation.push(target);
    } else {
      Alert.alert('Info', `Fitur belum dapat digunakan`, [{ text: 'Close' }]);
    }
  };

  logout = () => {
    Alert.alert(
      `Aralia`,
      'Apakah Anda ingin keluar Aplikasi?',
      [
        {
          text: 'Tidak',
        },
        {
          text: 'Ya',
          onPress: () => {
            AsyncStorage.clear();
            this.props.navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });            
            this.props.navigation.navigate('Login');

          },
        },
      ],
      {
        cancelable: false,
      },
    );
  }

  render() {
    return (
      <Container>
        <Content>
        <ImageBackground
            source={require('assets/bg-login.png')} style={{width:height,height:height}}>
          {/* <ListItem icon style={{backgroundColor: '#ddd', marginLeft: 0, paddingLeft: 18}}>
            <TouchableOpacity style={{flexDirection: 'row'}}>
              <Left>
                <Button success>
                  <Icon active name='ios-person' />
                </Button>
              </Left>
              <Body>
                <Text>Ubah Profil</Text>
              </Body>
              <Right>
                <Icon active name='ios-arrow-forward' />
              </Right>
            </TouchableOpacity>
          </ListItem> */}
          <ListItem icon style={{ marginTop:10, backgroundColor:'#587058', borderRadius:50, width: width*1, height:height * 0.08, backgroundColor: '#ccc', marginLeft: 0, paddingLeft: 18 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => this.featureCheck('ChangePassword')}>
              <Left>
                <Button success>
                  <Icon active name="ios-unlock" />
                </Button>
              </Left>
              <Body>
                <Text>Ubah Katasandi</Text>
              </Body>
              <Right>
                <Icon active name="ios-arrow-forward" />
              </Right>
            </TouchableOpacity>
          </ListItem>
          {/* <ListItem icon style={{backgroundColor: '#ddd', marginLeft: 0, paddingLeft: 18}}>
            <TouchableOpacity style={{flexDirection: 'row'}}>
              <Left>
                <Button success>
                  <Icon active name='ios-refresh' />
                </Button>
              </Left>
              <Body>
                <Text>Atur Ulang Aplikasi</Text>
              </Body>
              <Right>
                <Icon active name='ios-arrow-forward' />
              </Right>
            </TouchableOpacity>
          </ListItem> */}
          <ListItem icon style={{  marginTop:10, backgroundColor:'#587058', borderRadius:50, width: width*1, height:height * 0.08, backgroundColor: '#ccc', marginLeft: 0, paddingLeft: 18 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => this.logout()}>
              <Left>
                <Button style={{ backgroundColor: '#438A5E' }}>
                  <Icon active name="log-out" />
                </Button>
              </Left>
              <Body>
                <Text>Logout</Text>
              </Body>
            </TouchableOpacity>
          </ListItem>
          </ImageBackground>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps() {
  return {
    featureData: ServiceStore.getFeatureData(),
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(TabSettings);
