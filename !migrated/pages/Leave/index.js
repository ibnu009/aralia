import React, { Component } from 'react'
import style from '../../styles'
import HeaderLayout from './../HeaderLayout'

import {
  TouchableOpacity,
  Image,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import {
  Content,
  Container,
  Card,
  CardItem,
  Left,
  Right,
  Icon,
  Text,
 } from 'native-base'

export default class Leave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nip: ''
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('nip').then((result) => {
			this.setState({nip: result})
    })
	}

  render() {
    return (
      <Container>
        <HeaderLayout title='Cuti' navigation={this.props.navigation} />
        <Content>

          {/* <Card style={style.cardListItem}>
            <CardItem style={{backgroundColor: '#ddd'}}>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> this.props.navigation.navigate('LeaveBalance')}>
                <Image source={require('assets/menu/leave.png')} style={{width:50,height:50}} />
                <Left>
                  <Text style={style.cardTextTitle}>Leave Balance</Text>
                </Left>
                <Right>
                  <Icon active name='ios-arrow-forward' />
                </Right>
              </TouchableOpacity>
            </CardItem>
          </Card> */}

          <Card style={style.cardListItem}>
            <CardItem>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('LeaveRequest')}>
                <Image source={require('assets/menu/leave-request.png')} style={{width:50,height:50}} />
                <Left>
                  <Text style={style.cardTextTitle}>Permohonan Cuti</Text>
                </Left>
                <Right>
                  <Icon active name='ios-arrow-forward' />
                </Right>
              </TouchableOpacity>
            </CardItem>
          </Card>

        </Content>
      </Container>
    )
  }
}
