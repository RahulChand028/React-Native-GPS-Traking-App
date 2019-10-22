import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import star from '../starstyle'

export default class RunInfo extends React.Component {

  constructor(props) {
     super(props);
  }

  render() {

    return (

       <View style = {[star.trackWrapper,{flex:6,backgroundColor:this.props.st}]}>

          <Text style = {star.topValue} onPress = {this.props.trackBack}>   {this.props.value}    </Text>


       </View>

    )
  }
}
