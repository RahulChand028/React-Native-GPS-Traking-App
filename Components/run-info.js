import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import star from '../starstyle'

export default class RunInfo extends React.Component {

  constructor(props) {
     super(props);
  }

  render() {

    return (

       <View style = {[star.runInfoWrapper,{flex:1}]}>

          <Text style = {star.runInfoTitle}>    {this.props.title}    </Text>
          <Text style = {star.runInfoValue}>    {this.props.value}   </Text>

       </View>

    )
  }
}
