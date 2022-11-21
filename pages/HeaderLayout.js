import React from 'react';
import styles from '../styles';
import packageJson from '../package.json';

import { Header, Body, Text, Icon, Left } from 'native-base';

import { Image, TouchableOpacity, Platform } from 'react-native';

export default class HeaderLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header
        transparent
        style={styles.statusbar}
        // hasTabs
        androidStatusBarColor={styles.statusbarAccent.backgroundColor}
        iosBarStyle="light-content">
        {this.props.title ? (
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{
              width: 20,
              left: 5,
              top: Platform.OS == 'android' ? 15 : 7.5,
            }}>
            <Icon active name="ios-arrow-back" style={{ color: '#fff' }} />
          </TouchableOpacity>
        ) : (
            <Left>
              <Image
                source={require('assets/logo.png')}
                style={styles.statusBarImage}
              />
            </Left>
          )}
        <Body style={{ alignItems: 'center' }}>
        <Text style={{ color:"#ffffff", position: "absolute",textAlign: "right", width:"100%", fontSize:10, marginTop: -13 }}>ver. {packageJson.version}</Text>
          <Text style={styles.statusbarTitle}>{this.props.title}</Text>
        </Body>
      </Header>
    );
  }
}
