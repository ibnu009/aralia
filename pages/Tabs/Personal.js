import React, {Component} from 'react';
import {connect} from 'remx';
import HeaderLayout from '../HeaderLayout';
import {store} from '../../remx/Service/store';
import * as UserAction from '../../remx/User/actions';
import {store as UserStore} from '../../remx/User/store';
import styles from '../../styles';
import {
  Container,
  Content,
  Text,
  Card,
  ListItem,
  List,
  Item,
  Label,
  View,
  Icon,
  Left,
} from 'native-base';

import {
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const TabPersonal = () =>  {

  header = () => {
    if (this.props.route) {
      return (
        <HeaderLayout title="Info Pegawai" navigation={this.props.navigation} />
      );
    }
  };

  doEdit = () => {
    let {user} = this.props;
    this.props.navigation.navigate('ChangeProfile', {data: user});
  };

  render() {
    let {user} = this.props;
    if (this.props.route) user = this.props.route.params.data;

    return (
      <Container>
        {this.header()}
        <Content bouncesZoom={true} showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={require('assets/bg-login.png')}
            style={[styles.wallImageWrapper, {width: '100%', height: 100}]}
          />

          <Card transparent style={{alignItems: 'center', bottom: 50}}>
            <Image
              source={
                user.foto ? {uri: user.url_foto} : require('assets/default.png')
              }
              style={[
                styles.displayPicture,
                {width: 100, height: 100, borderRadius: 50},
              ]}
            />
            <Text
              style={[
                styles.userBoxName,
                styles.buttonSuccess,
                {textAlign: 'center'},
              ]}>
              {user.employee_name ?? 'Loading...'}
            </Text>
            <Text
              note
              style={{
                color: '#000',
                top: 15,
                fontSize: 14,
                fontWeight: 'bold',
                textAlign: 'center',
                paddingBottom: 30,
              }}>
              {user.employee_id ?? 'Loading...'}
            </Text>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.doEdit()}>
                <Image
                  source={require('assets/edit.png')}
                  style={styles.imageInputLabel}
                />
              </TouchableOpacity>
            </View>
            {/* <Text note style={{color: '#000', top:15, fontSize:14, fontWeight: '100', textAlign:'center'}}>{user.jabatan} {(user.jns_kantor && user.jns_kantor.trim() == '1')?user.nm_unit_es3:user.nm_kantor} {user.nm_pangkat}</Text> */}
          </Card>

          <List>
            <Item style={{flexDirection: 'column', padding: 10}}>
              <Card transparent style={{width: '100%', flexDirection: 'row'}}>
                <Image
                  source={require('assets/user.png')}
                  style={styles.imageInputLabel}
                />
                <Label
                  style={[
                    styles.textInputLabel,
                    {width: '100%', fontWeight: 'bold', fontSize: 13},
                  ]}>
                  No.Ktp
                </Label>
              </Card>
              <Text style={{width: '100%', left: 25, fontSize: 13}}>
                {no_ktp ?? '-'}
              </Text>
            </Item>
            <Item style={{flexDirection: 'column', padding: 10}}>
              <Card transparent style={{width: '100%', flexDirection: 'row'}}>
                <Image
                  source={require('assets/email.png')}
                  style={styles.imageInputLabel}
                />
                <Label
                  style={[
                    styles.textInputLabel,
                    {width: '100%', fontWeight: 'bold', fontSize: 13},
                  ]}>
                  Email
                </Label>
              </Card>
              <Text style={{width: '100%', left: 25, fontSize: 13}}>
                {user.email ?? '-'}
              </Text>
            </Item>
            <Item style={{flexDirection: 'column', padding: 10}}>
              <Card transparent style={{width: '100%', flexDirection: 'row'}}>
                <Image
                  source={require('assets/phone.png')}
                  style={styles.imageInputLabel}
                />
                <Label
                  style={[
                    styles.textInputLabel,
                    {width: '100%', fontWeight: 'bold', fontSize: 13},
                  ]}>
                  Phone
                </Label>
              </Card>
              <Text style={{width: '100%', left: 25, fontSize: 13}}>
                {user.phone ?? '-'}
              </Text>
            </Item>
            <Item style={{flexDirection: 'column', padding: 10}}>
              <Card transparent style={{width: '100%', flexDirection: 'row'}}>
                <Image
                  source={require('assets/department.png')}
                  style={styles.imageInputLabel}
                />
                <Label
                  style={[
                    styles.textInputLabel,
                    {width: '100%', fontWeight: 'bold', fontSize: 13},
                  ]}>
                  Jabatan
                </Label>
              </Card>
              <Text style={{width: '100%', left: 25, fontSize: 13}}>
                {user.jabatan ?? '-'}
              </Text>
            </Item>
            <Item style={{flexDirection: 'column', padding: 10}}>
              <Card transparent style={{width: '100%', flexDirection: 'row'}}>
                <Image
                  source={require('assets/office-block.png')}
                  style={styles.imageInputLabel}
                />
                <Label
                  style={[
                    styles.textInputLabel,
                    {width: '100%', fontWeight: 'bold', fontSize: 13},
                  ]}>
                  Kantor
                </Label>
              </Card>
              <Text style={{width: '100%', left: 25, fontSize: 13}}>
                {user.nm_kantor ?? '-'}
              </Text>
            </Item>
          </List>
        </Content>
      </Container>
    );
  }
}

const style = StyleSheet.create({
  btnLogout: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
});

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(TabPersonal);
