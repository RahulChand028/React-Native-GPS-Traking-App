import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import star from '../starstyle'

export default class Option extends React.Component {

  constructor(props) {
     super(props);
  }

  render() {

    return (

       <View style = {[star.topInfoWrapper,{flex:1}]}>
          <Text style={star.topValue}> : </Text>

       </View>

    )
  }
}
