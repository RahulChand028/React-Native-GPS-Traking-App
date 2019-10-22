import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import star from '../starstyle'

export default class RunInfo extends React.Component {

  constructor(props) {
     super(props);
  }

  render() {

    return (

       <View style = {[star.topInfoWrapper,{flex:6}]}>

          <Text style = {star.topValue} onPress = {this.props.stopAndSave}>   {this.props.value}    </Text>

       </View>

    )
  }
}
