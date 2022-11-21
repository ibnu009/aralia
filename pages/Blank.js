import React, { Component } from "react";
// import { PermissionsAndroid } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import * as UserAction from "../remx/User/actions";

export default class Blank extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    AsyncStorage.getItem("nip", (err, result) => {
      let name = 'Login'
      if (!result) {
        name = 'Login'
      } else {
        UserAction.getUserDetail(result);
        name = 'Home'
      }

      this.props.navigation.reset({
        index: 0,
        routes: [{ name: name }],
      });
    });
  }

  render() {
    return <></>;
  }
}
