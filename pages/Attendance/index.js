import { connect } from 'remx';
import React, { Component } from 'react';
import HeaderLayout from '../HeaderLayout';
import { store as UserStore } from '../../remx/User/store';
import * as UserAction from '../../remx/User/actions';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import CardListItem from '../CardListItem';
import style from '../../styles';
import { Container, Card, CardItem, Left, Right, Icon, Toast } from 'native-base';
import {
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import { REST_URL, HEADERS_CONFIG } from 'aralia/AppConfig';

const items = [
  {
    image: require('assets/menu/attendance2.png'),
    title: 'Daftar Kehadiran',
    route: 'AttendanceList',
  },
  {
    image: require('assets/menu/check-in.png'),
    title: 'Presensi',
    route: 'CheckInOut',
  },
  /* {
    image: require('assets/menu/overtime.png'),
    title: 'Permohonan Lembur',
    route: 'Overtime',
  }, */
  // {
  //   image: require('assets/menu/attendance2.png'),
  //   title: 'Dispensasi Absensi',
  //   route: 'Dispensation',
  // },
];

class Attendace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: '',
      showLoading: false,
    };
  }

  componentDidMount() {
    if ( '' != UserStore.getUserData()){
      var userData = UserStore.getUserData();
      this.setState({ nip: userData['employee_id'], id_employee : userData['id_employee'] })
    }

    UserAction.checkSession()
  }

  doClearFaces = () => {
    this.setState({ showLoading: true });
    AsyncStorage.getItem('totalTraining', (err, res) => {
      if (res == '1') {
        this.setState({ showLoading: false });
        setTimeout(() => {
          Alert.alert('Info', `Data wajah sudah terhapus!`);
        }, 100);
        return false;
      } else {

        var configData = UserStore.getConfigData();
        var urlFacerecognize = configData["facerecognize"];
        var urlKey = configData["key"];
        
        const formData = new FormData();
        formData.append('key', urlKey);
        formData.append('user_id', this.state.nip);

        // do login process
        fetch(`${urlFacerecognize}/api/v1/face_recognize/clear_model`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            ...HEADERS_CONFIG.headers,
          },
          body: formData,
        })
          .then(response => response.json())
          .then(res => {
            this.setState({ showLoading: false });
            if (res.status == "ok") {
              AsyncStorage.setItem('totalTraining', '1').then(() => {
                Alert.alert('Info', 'Data model wajah telah terhapus');
              });
            } else {
              Alert.alert('Info', 'Server terjadi gangguan, coba ulangi sekali lagi');
            }
          })
          .catch(err => {
            this.setState({ showLoading: false });
            Toast.show({
              text: `Error: ${err}`,
              type: 'danger'
            })
          });
      }
    });
  }

  clearFaces = () => {
    Alert.alert(
      `Peringatan`,
      'Apakah ingin menghapus data model wajah anda?',
      [
        {
          text: 'Tidak',
        },
        {
          text: 'Ya',
          onPress: () => {
            this.doClearFaces() 
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  }

  registerFace = () => {
    AsyncStorage.getItem('totalTraining').then(result => {
      if (result > 3) {
        Alert.alert('Info', 'Anda sudah pernah mendaftarkan wajah', [
          { text: 'OK' },
        ]);
      } else {
        this.props.navigation.push('FaceRegister');
      }
    });
  }

  render() {

    return (
      <Container style={{backgroundColor:'rgba(0, 0, 0, 0.25)'}}>
                <ImageBackground
          resizeMode={'stretch'} // or cover
          style={{flex: 1}} // must be passed from the parent, the number may vary depending upon your screen size
          source={require('assets/bg-login.png')}
        >
        <HeaderLayout  navigation={this.props.navigation} title="Kehadiran" />
        <View >
          <Spinner
            visible={this.state.showLoading}
            overlayColor="rgba(0, 0, 0, 0.25)"
            size="large"
          />
          <FlatList
            data={items}
            renderItem={item => <CardListItem item={item} navigation={this.props.navigation} />}
            keyExtractor={(item, index) => `q${index}`}
            showsVerticalScrollIndicator={false}
          />
          
          <Card style={style.cardListItem,{backgroundColor:"transparent",margin:0, borderRadius:50}}>
           
           <CardItem style={{backgroundColor:'#587058', borderRadius:50}}>
              <TouchableOpacity
                style={{ flexDirection: 'row',}}
                onPress={() => this.registerFace()}>
                <Image
                  source={require('assets/menu/facerecog.png')}
                  style={style.cardListImageItem}
                />
                <Left>
                  <Text style={style.cardTextTitle}> Pendaftaran wajah</Text>
                </Left>
                <Right>
                  <Icon active name="ios-arrow-forward" />
                </Right>
              </TouchableOpacity>
            </CardItem>
          </Card>

          <Card style={style.cardListItem,{backgroundColor:"transparent",margin:0, borderRadius:50}}>
            <CardItem style={{backgroundColor:'#587058', borderRadius:50}}>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => this.clearFaces()}>
                <Image
                  source={require('assets/menu/clear-face.png')}
                  style={style.cardListImageItem}
                />
                <Left>
                  <Text style={style.cardTextTitle}> Hapus data wajah</Text>
                </Left>
                <Right>
                  <Icon active name="ios-arrow-forward" />
                </Right>
              </TouchableOpacity>
            </CardItem>
          </Card>
        </View>
        </ImageBackground>
      </Container>
    );
  }
}

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(Attendace);
