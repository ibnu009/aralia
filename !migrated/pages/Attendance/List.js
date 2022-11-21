import React, {Component} from 'react';
import HeaderLayout from '../HeaderLayout';
import {connect} from 'remx';
import {store} from '../../remx/Absensi/store';
import {store as UserStore} from '../../remx/User/store';
import * as actions from '../../remx/Absensi/actions';
import styles from '../../styles';
import {MONTH_ITEMS_OPTION} from '../../AppConfig';
import {
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  FlatList,
  View,
  Platform,
  Alert,
} from 'react-native';

import Moment from 'moment';
import FileViewer from 'react-native-file-viewer';

import {
  Container,
  Item,
  Picker,
  Button,
  Text,
  ListItem,
  Grid,
  Row,
  Col,
  Label,
} from 'native-base';

import {PermissionsAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

class AttendanceList extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      nip: '',
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
    };
  }

  componentDidMount() {
    try {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Folder Permission',
          message: 'Aralia App needs access to your folder ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } catch (err) {
      console.warn(err);
    }

    if ('' != UserStore.getUserData()) {
      var userData = UserStore.getUserData();
      var nip = userData['id_employee'];
      this.setState({nip: nip});
      store.setData([]);
      store.setLoading(true);
      actions.setMonth(this.state.selectedMonth);
      actions.setYear(this.state.selectedYear);
      actions.getAbsensiData(
        nip,
        this.state.selectedYear,
        this.state.selectedMonth,
      );
    }
  }

  submitButton = () => {
    store.setData([]);
    store.setLoading(true);
    actions.setMonth(this.state.selectedMonth);
    actions.setYear(this.state.selectedYear);
    actions.getAbsensiData(
      this.state.nip,
      this.state.selectedYear,
      this.state.selectedMonth,
    );
  };

  fileNameFromUrl = (url) => {
    var matches = url.match(/\/([^\/?#]+)[^\/]*$/);
    if (matches.length > 1) {
      return matches[1];
    }
    return null;
  };

  downloadPDFAttendance = () => {
    const url = `https://aralia.pegadaian.co.id/webservice_api/attendance/download?id_employee=${this.state.nip}&year=${this.state.selectedYear}&month=${this.state.selectedMonth}`;
    //console.log(url)
    let dirs =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DownloadDir
        : RNFetchBlob.fs.dirs.DownloadDir;

    // =================================================================
    // DOWNLOAD DENGAN HTML RESPONSE TO PDF
    // =================================================================
    fetch(url) // Call the fetch function passing the url of the API as a parameter
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        let fileName = Moment().format('d_m_Y_hh_mm_ss');
        let options = {
          html: data,
          fileName: fileName,
          directory: 'Download',
        };

        // try {
        //   let ffile = RNHTMLtoPDF.convert(options);
        //   console.log(ffile.filePath);
        // } catch (e) {
        //   console.log(e);
        // }

        Alert.alert(
          'Info',
          `Apakah anda ingin lihat laporan yang telah di unduh didalam direktori ${dirs}/${fileName}.pdf ?`,
          [
            // {
            //   text: "Ask me later",
            //   onPress: () => console.log("Ask me later pressed")
            // },
            {
              text: 'Tutup',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Lihat File',
              onPress: () => {
                FileViewer.open(`${dirs}/${fileName}.pdf`)
                  .then(() => {
                    // success
                  })
                  .catch((error) => {
                    // error
                  });
              },
            },
          ],
          {cancelable: false},
        );
      });

    // =================================================================
    // DOWNLOAD DENGAN FILE URL http://www.xxxx.com/file.pdf
    // =================================================================
    // let dirs =
    //   Platform.OS == 'ios'
    //     ? RNFetchBlob.fs.dirs.DownloadDir
    //     : RNFetchBlob.fs.dirs.DownloadDir;
    // RNFetchBlob
    // .config({
    //   // add this option that makes response data to be stored as a file,
    //   // this is much more performant.
    //   fileCache : true,
    //   path: dirs + `/${new Date().getTime()}.xls`,
    // })
    // .fetch('GET', url, {
    //   //some headers ..
    // })
    // .then((res) => {
    //   if (Platform.OS === "ios") {
    //     RNFetchBlob.ios.openDocument(resp.data);
    //   }
    //   // Alert.alert('Info', `File anda berada di folder ${res.path()}`);

    //   Alert.alert(
    //     "Info",
    //     "Apakah anda ingin lihat laporan yang telah di unduh?",
    //     [
    //       // {
    //       //   text: "Ask me later",
    //       //   onPress: () => console.log("Ask me later pressed")
    //       // },
    //       {
    //         text: "Tutup",
    //         onPress: () => console.log("Cancel Pressed"),
    //         style: "cancel"
    //       },
    //       {
    //         text: "Lihat File",
    //         onPress: () => {
    //           FileViewer.open(res.path())
    //           .then(() => {
    //             // success
    //           })
    //           .catch(error => {
    //             // error
    //           });
    //         }
    //       }
    //     ],
    //     { cancelable: false }
    //   );
    // })
  };

  generateList(items) {
    const v = items.item;
    var date_in = '';
    var hour_in = '';
    var date_out = '';
    var hour_out = '';

    date_in = Moment(v.date_in).format('D');
    if ('Invalid date' == date_in) date_in = '';

    hour_in = Moment(v.date_in).format('hh:mm:ss');
    if ('Invalid date' == hour_in) hour_in = '';

    date_out = Moment(v.date_out).format('D');
    if ('Invalid date' == date_out) date_out = '';

    hour_out = Moment(v.date_out).format('hh:mm:ss');
    if ('Invalid date' == hour_out) hour_out = '';

    return (
      <Row
        style={{
          backgroundColor:
            v.color != ''
              ? '#' + v.color
              : items.index % 2 == 0
              ? '#DBEDFC'
              : '#fff',
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <Col size={33} style={style.centerCol}>
          <Text>{v.short_date_in}</Text>
        </Col>
        <Col size={33} style={style.centerCol}>
          <Text>{v.time_in}</Text>
        </Col>
        <Col size={33} style={style.centerCol}>
          <Text>{v.short_date_out}</Text>
        </Col>
        <Col size={33} style={style.centerCol}>
          <Text>{v.time_out}</Text>
        </Col>
        <Col size={33} style={style.centerCol}>
          <Text>{v.total_jam}</Text>
        </Col>
      </Row>
    );
  }

  yearOptionItems = () => {
    var arr = [];
    let a = new Date().getFullYear();
    for (let i = a; i > a - 5; i--) {
      arr.push(`${i}`);
    }
    return arr;
  };

  render() {
    const {data} = this.props;

    return (
      <Container style={{backgroundColor: '#f1f1f1'}}>
        <HeaderLayout
          title="Daftar Kehadiran"
          navigation={this.props.navigation}
        />

        <View style={{backgroundColor: '#f1f1f1'}}>
          <Item last>
            <Picker
              note
              mode="dropdown"
              placeholder="Month"
              selectedValue={this.state.selectedMonth}
              onValueChange={(val) => this.setState({selectedMonth: val})}
              style={{width: Dimensions.get('screen').width * (30 / 100)}}>
              {MONTH_ITEMS_OPTION.map((label, i) => (
                <Picker.Item label={label} value={i + 1} key={i} />
              ))}
            </Picker>

            <Picker
              note
              mode="dropdown"
              placeholder="Year"
              selectedValue={this.state.selectedYear}
              onValueChange={(val) => this.setState({selectedYear: val})}
              style={{width: Dimensions.get('screen').width * (30 / 100)}}>
              {this.yearOptionItems().map((label, i) => (
                <Picker.Item label={label} value={label} key={i} />
              ))}
            </Picker>

            <Button
              style={[
                styles.buttonSuccess,
                {
                  height: '100%',
                  borderRadius: 0,
                  width: Dimensions.get('screen').width * (20 / 100),
                  marginRight: 0.3,
                },
              ]}
              onPress={this.submitButton}>
              <Text style={{fontSize: 10}}>Lihat</Text>
            </Button>
            <Button
              style={[
                styles.buttonSuccess,
                {
                  height: '100%',
                  borderRadius: 0,
                  width: Dimensions.get('screen').width * (20 / 100),
                },
              ]}
              onPress={this.downloadPDFAttendance}>
              <Text style={{fontSize: 10}}>Unduh</Text>
            </Button>
          </Item>
          <ListItem itemDivider style={{backgroundColor: '#f1f1f1'}} />

          <Item style={{height: 50}}>
            <Col size={33} style={style.centerCol}>
              <Label style={style.headerLabel}>Tanggal Masuk</Label>
            </Col>
            <Col size={33} style={style.centerCol}>
              <Label style={style.headerLabel}>Jam Masuk</Label>
            </Col>
            <Col size={33} style={style.centerCol}>
              <Label style={style.headerLabel}>Tanggal Keluar</Label>
            </Col>
            <Col size={33} style={style.centerCol}>
              <Label style={style.headerLabel}>Jam Keluar</Label>
            </Col>
            <Col size={33} style={style.centerCol}>
              <Label style={style.headerLabel}>Jam Kerja Efektif</Label>
            </Col>
          </Item>
          {this.props.isLoading && (
            <ActivityIndicator
              size="large"
              style={{height: (60 / 100) * Dimensions.get('screen').height}}
              color={styles.loading.color}
            />
          )}
          <FlatList
            data={data}
            renderItem={(item) => this.generateList(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            initialNumToRender={6}
          />
        </View>
      </Container>
    );
  }
}

const style = StyleSheet.create({
  centerCol: {
    alignItems: 'center',
  },
  headerLabel: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 13,
    textAlign: 'center',
  },
});

function mapStateToProps(ownProps) {
  return {
    data: store.getData(),
    isLoading: store.isLoading(),
    year: store.getYear(),
    month: store.getMonth(),
  };
}

export default connect(mapStateToProps)(AttendanceList);
