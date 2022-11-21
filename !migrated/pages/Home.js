import {View, Text, Image, BackHandler, ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
import styles from '../styles';
import {store as UserStore} from '../remx/User/store';

const Home = () => {
  const {username, employee_name, url_foto} = UserStore.getUserData();

  useEffect(() => {
    setTimeout(() => {
      var userData = UserStore.getUserData();
      // console.log(userData);
    }, 5000);
  });

  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/bg-login.png')}
          resizeMode="cover"
          style={{height: 680}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{marginTop: 150}}>
              <Image source={{uri: url_foto}} style={{width: 50, height: 50}} />
              <Text style={styles.textLabel}>{username}</Text>
              <Text style={styles.textLabel}>{employee_name}</Text>
            </View>
            <View style={{marginTop: 100}}>
              <Image source={require('../assets/menu/fingerlogo.png')} />
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export default Home;
