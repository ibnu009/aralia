/**
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import {AppRegistry, StatusBar} from 'react-native';
import {name as appName} from './app.json';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import * as route from './routes';
import {NativeBaseProvider} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './pages/Home';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Personal from './pages/Tabs/Personal';
import Blank from './pages/Blank';
import SettingScreen from './pages/Tabs/Settings';

const Stack = createStackNavigator();
const config = {
  animation: 'timing',
  config: {
    duration: 250,
    useNativeDriver: true,
  },
};

const options = {
  transitionSpec: {
    open: config,
    close: config,
  },
};

function MainApp() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'edit' : 'pencil-square-o';
          } else if (route.name === 'Blank') {
            iconName = focused ? 'ios-list' : 'ios-list-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-list' : 'ios-list-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-list' : 'ios-list-outline';
          }

          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Blank" component={Blank} />
      <Tab.Screen name="Personal" component={Personal} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{headerShown: false}}>
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="NotFound"
            component={route.NotFound}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Blank"
            component={route.Blank}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="ChangeProfile"
            component={route.ChangeProfile}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="MainApp"
            component={MainApp}
          />
          {/* <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Login"
            component={route.Login}
          /> */}
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Login"
            component={route.Login}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="LostPassword"
            component={route.LostPassword}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="Home"
            component={route.Home}
          />
          <Stack.Screen
            options={TransitionPresets.SlideFromRightIOS}
            name="FaceRegister"
            component={route.FaceRegister}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
