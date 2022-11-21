import React, {Component} from 'react';
import {store as UserStore} from '../remx/User/store';
import {connect} from 'remx';
import HeaderLayout from '../pages/HeaderLayout';
import {REST_URL, HEADERS_CONFIG} from 'aralia/AppConfig';
import * as UserAction from '../remx/User/actions'
import styles from "../styles";
const RNFS = require('react-native-fs');

import {
  Container,
  Content,
  Text,
  Card,
  CardItem,
  Body,
  Item,
  Label,
  Form,
  Input,
  Footer,
  FooterTab,
  Button,
} from 'native-base';

import {
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';

const stylesButton = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ecf0f1',
    width: '100%',
    paddingTop: '5%',
  },
  itemContainer: {
    backgroundColor: '#fff',
    margin: '5%',
    marginTop: 0,
    borderRadius: 5,
    width: '90%',
  },
  itemHeaderContainer: {
    padding: 15,
    borderColor: '#E4E2E9',
    borderBottomWidth: 1,
  },
  itemHeaderText: {
    //  height:'auto',
    color: '#333',
    fontSize: 23,
    fontWeight: '800',
  },
  itemButtonContainer: {
    padding: 13,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  itemButtonText: { fontSize: 12, color: '#fff', fontWeight: '800' },
  itemCreateButton: {
    backgroundColor: 'green',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

class ChangeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      no_ktp: '',
      email: '',
      phone: '',
      filePath: '',
      fileData: '',
      fileUri: '',
      isLoading: true,
      showLoading: false,
    };
  }

  componentDidMount() {
    let data = this.props.route.params.data;
    this.setState({
      no_ktp : data.no_ktp,
      email : data.email,
      phone : data.phone,
      id_employee : data.id_employee,
      url_foto : data.url_foto,
    })

    console.log(`${RNFS.PicturesDirectoryPath}`);
  }

  submitForm = () => {

    var photo = {
      uri: this.state.filePath.uri,
      type: this.state.filePath.type,
      name: this.state.filePath.fileName,
    };

    console.log(JSON.stringify(photo));

    var form = new FormData();
    form.append("no_ktp", this.state.no_ktp);
    form.append("email", this.state.email);
    form.append("phone", this.state.phone);

    if(this.state.filePath != '') {
      form.append("image", photo);
    }
    form.append("id_employee", this.state.id_employee);

    let uri = `${REST_URL}/profile/update`;
    this.setState({showLoading: true});

		// do login process
		fetch(uri, {
      body: form,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
		}).then(response => response.json())
		.then(res => {
      this.setState({showLoading: false});
      Alert.alert(
        'Info',
        //'Reset password user berhasil. \nSilahkan periksa pesan masuk pada email anda, atau periksa pada kolom spam.',
        res.message,
        [
          {text: 'OK', onPress: () => this.props.navigation.goBack(null)},
        ],
        {cancelable: false},
      );

      // update state profile
      UserAction.getUserDetail(this.state.id_employee);
    }).catch(err => {
      this.setState({showLoading: false});
      Toast.show(`Error : ${err}`, Toast.SHORT);
      this.props.navigation.goBack(null);
    });
  };

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      width: 400,
      height: 200,
      quality: 0.5,
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri
        });
      }
    });

  }

  lauchImageGallery = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: `images`,
      },
      width: 400,
      height: 200,
      quality: 0.5,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri
        });
      }
    });
  }

  render() {
    return (
      <Container>
        <HeaderLayout
          navigation={this.props.navigation}
          title="Ubah Profile"
        />

        <Spinner
          visible={this.state.showLoading}
          color={styles.statusbarAccent.backgroundColor}
          size="large"
        />

        <Content>
          <Form >
            <Item stackedLabel>
              <Label>No. KTP</Label>
              <Input
                value={this.state.no_ktp}
                onChangeText={val => this.setState({no_ktp: val})}
              />
            </Item>
            <Item stackedLabel>
              <Label>E-mail</Label>
              <Input
                value={this.state.email}
                onChangeText={val => this.setState({email: val})}
              />
            </Item>
            <Item stackedLabel>
              <Label>Phone</Label>
              <Input
                value={this.state.phone}
                onChangeText={val => this.setState({phone: val})}
              />
            </Item>
            <Item stackedLabel>
              <Label>Foto Pengguna</Label>
              <Image source={this.state.url_foto ? { uri : (this.state.fileUri ? this.state.fileUri : this.state.url_foto) } : require('assets/default.png') } style={{ marginTop: 20, borderRadius:10, width:100, height:100}} />
              <View style={stylesButton.itemButtonContainer}>
              <TouchableHighlight
                underlayColor="#ccc"
                onPress={this.lauchImageGallery}
                style={[stylesButton.itemCreateButton, { marginRight: 10 }]}>
                <View
                  style={{
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                  }}>
                  <Text style={stylesButton.itemButtonText}>Pilih Galeri</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#ccc"
                onPress={this.launchCamera}
                style={stylesButton.itemCreateButton}>
                <View
                  style={{
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                  }}>
                  <Text style={stylesButton.itemButtonText}>Pakai Kamera</Text>
                </View>
              </TouchableHighlight>
            </View>
            </Item>
          </Form>
        </Content>

        <Footer style={{backgroundColor:'transparent'}} >
          <FooterTab style={{backgroundColor:'transparent'}} >
            <Button
              full
              style={{backgroundColor: '#0d8a43', borderRadius:50}}
              onPress={this.submitForm}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                Submit
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

function mapStateToProps() {
  return {
    user: UserStore.getUserData(),
  };
}

export default connect(mapStateToProps)(ChangeProfile);
