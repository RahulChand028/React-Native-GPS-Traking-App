import React, { Component } from 'react';
import { View, Text , StyleSheet, NetInfo , Image , TouchableOpacity , TextInput , Switch ,AsyncStorage,Vibration } from 'react-native';
import MapView , {Polyline} from 'react-native-maps';
//import { Font } from 'expo';

import haversine from 'haversine';
import RunInfo from  './Components/run-info';
import Top from  './Components/top';
import Trackback from './Components/trackback'
import star from './starstyle'


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 0,
      longitude: 0,
      speed:0,
      distance:0,
      heading:null,
      connected:null,
      error: null,
      fontLoaded: false,
      Home : false,
      frontScreenDisplay : true,
      heading_direction : "-",
      creator:null,
      prompt:false,
      linecoordination:[],
      bgcolor:'#00a8ff',
      homeTop:0,
      head_direction:null,
      stroke_color : '#000',
      interval : null,
      title:'Track Back',
      tracking: false,
      tkcolor : '#9b59b6',
      vibration : false,
      vibration_state : true,
      optionList: false,
      optionPrompt : false,
      recording : false
    };
  }

  startApp() {
    this.setState({ frontScreenDisplay : false,
                    Home: true,
                    bgcolor :'rgb(218, 226, 239)',
                    interval : true
                  })

    setInterval(this.start_location.bind(this),4000)

  }

  componentDidMount() {

    let last_latitude_get = null
    let last_longitude_get = null

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => console.log("gps error"),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );


    NetInfo.getConnectionInfo().then((connectionInfo) => {
      if(connectionInfo.effectiveType == "unknown") {
         this.setState({connected:0})
      } else {
         this.setState({connected:1})
      }
    });
    that = this
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange.bind(that)
    );

  }

  handleFirstConnectivityChange(connectionInfo) {

    if(connectionInfo.effectiveType == "unknown") {
       this.setState({connected:0})
    } else {
       this.setState({connected:1})
    }

  }

  start_location() {


    let track = null
    let prev_latitude = this.state.latitude
    let prev_longitude = this.state.longitude
    let distance = 0
    let actual_distance = 0
    let dataTrack = ""
    let tempArray = []

    this.watchId = navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed,
          heading: position.coords.heading,
          error: null,
        });
        if(this.state.interval) {
          if(prev_latitude == 0) {

            prev_latitude = this.state.latitude;
            prev_longitude = this.state.longitude;

           } else {

             distance = haversine({latitude:this.state.latitude,longitude:this.state.longitude}, {latitude:prev_latitude,longitude:prev_longitude},{unit:'meter'});
             if(this.state.speed > 0) {
               this.setState({distance:this.state.distance+distance})
             }
          }

        if(this.state.recording) {
          this.setState({
            linecoordination : this.state.linecoordination.concat([{latitude:this.state.latitude,longitude:this.state.longitude}])
          })
        }

      }

        let x = this.state.heading;

                if((x >= 0 && x <= 23) || (x > 338 && x <= 360))
                    this.setState({heading_direction: 'N'})
                else if( x > 23  && x <= 65)
                    this.setState({heading_direction: 'NE'})
                else if( x > 65  && x <= 110)
                    this.setState({heading_direction: 'E'})
                else if( x > 110 && x <= 155)
                    this.setState({heading_direction: 'SE'})
                else if( x > 155 && x <= 203)
                   this.setState({heading_direction: 'S'})
                else if( x > 203  && x <= 248)
                   this.setState({heading_direction: 'SW'})
                else if( x > 348 && x <= 293)
                   this.setState({heading_direction: 'W'})
                else if( x > 293  && x <= 338)
                   this.setState({heading_direction: 'NW'})


      },
      (error) => console.log("found erorr : "+error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0, distanceFilter: 1},
    );
    let duri = 0
    let ok = 0



    if(this.state.tracking && this.state.linecoordination.length > 0) {

     for(let i =0;this.state.linecoordination.length-1;i++) {

        duri = haversine({latitude:this.state.latitude,longitude:this.state.longitude}, this.state.linecoordination[i],{unit:'meter'});
        if(duri <= 6.5) {
            ok = 1
            break
        } else if(i == this.state.linecoordination.length-1) {
            break
        }

      }
      if(ok == 0) {
        this.setState({
          title:'You are on wrong Way',
          tkcolor:'#e74c3c'
        })
        if(!this.state.vibration && this.state.vibration_state) {

           //Vibration.vibrate([1000], true)
           this.setState({
             vibration : true
           })
        }

      } else {
        this.setState({
          title:'You are on right Way',
          tkcolor:'#3498db'
        })
        if(this.state.vibration) {
          this.setState({
            vibration : false
          })
          //Vibration.cancel()
        }
      }

    } else if(this.state.tracking && this.state.linecoordination.length == 0) {
      this.setState({
        homeTop:0,
        tracking:false,
        recording : false,
        distance : 0
      })
    }

  }

  createdBy() {
     this.setState({
         frontScreenDisplay:false,
         creator:true
     })
  }

  createdByBack() {
    this.setState({
      frontScreenDisplay:true,
      creator:false
    })
  }

  savePrompt() {
    this.setState({
      prompt: !this.state.prompt
    })
  }

  saveState() {
      this.setState({
        homeTop : 2,
        prompt: !this.state.prompt,
        stroke_color : '#55efc4',
        recording : false
      })
  }

  trackBack() {
    this.setState({
      title:'Tracking',
      tkcolor:'#3498db',
      tracking:true,
    })
  }

  vibrationChange() {

        this.setState({
          vibration_state: !this.state.vibration_state
        })

  }


  stopTracking() {
    this.setState({
      distance:0,
      tracking : false,
      recording:false,
      homeTop:0,
      optionPrompt:!this.state.optionPrompt,
      linecoordination:[],
      stroke_color : '#34495e',
      title:'Track Back',
      tkcolor: 'rgba(155, 89, 182,0.75)'
    })
  }
  startRecording() {
    this.setState({
      recording : true,
      homeTop:1,
      distance:0,
      interval: true
    })
  }

  render() {

    let firstScreen = null
    let homeScreen = null
    let homeTop = null
    let map = null
    let savePrompt = null
    let creators = null
    let search_coordinate = null
    let createdBy = null
    let trackBack = null
    let optionPrompt = null
    let stop_tracking_option = null


    if(this.state.frontScreenDisplay) {
        firstScreen = (<View style={{ flexGrow: 1, alignItems: 'center',marginTop:60}}>
                             <Image source={require('./img/point.png')} style={{width: 200, height: 200}} />
                             <Text style={{fontWeight:'bold', fontSize: 40, marginTop:40,color:'#fff'}}>
                                        Take Me Back
                              </Text>
                             <TouchableOpacity onPress = {this.startApp.bind(this)} >
                                <Text style={styles.btn}> Start Mapping</Text>
                             </TouchableOpacity>
                             <Text style={{color:'rgba(189, 195, 199,1.0)',padding:10,fontSize:15,marginTop:40}} onPress = {this.createdBy.bind(this)}>Created By : </Text>
                       </View>)
    }

    if(this.state.creator) {
        creators = (<View style={{ flexGrow: 1, alignItems: 'center',marginTop:60}}>
              <Text style={{fontSize:18,color:'#fff',padding:5}}>Keerti Vishwakarma</Text>
              <Text style={{fontSize:18,color:'#fff',padding:5}}>k1996eerti@gmail.com</Text>
              <Text style={{fontSize:18,color:'#fff',padding:5}}>Madhu Rana</Text>
              <Text style={{fontSize:18,color:'#fff',padding:5}}>madhurana533@gmail.com</Text>
              <Text style={{fontSize:18,color:'#fff',padding:5}}>Monika Singh</Text>
              <Text style={{fontSize:18,color:'#fff',padding:5}}>email-monika.tech97@gmail.com</Text>
              <Text style={{fontSize:18,color:'#fff',padding:5}}>Abhilasha Singh</Text>
              <Text style={{fontSize:18,color:'#fff',padding:5}}>abhilashasingh0545@gmail.com</Text>
              <Text style={[styles.btn,{backgroundColor:'rgba(46, 204, 113,1.0)'}]} onPress={this.createdByBack.bind(this)}>Back</Text>
        </View>)
    }



    if(this.state.prompt) {
      savePrompt = (
             <View style={styles.prompt}>
                  <View style={styles.promptBody}>
                    <Text style={styles.promptText}>Do You Want To Stop Recording and Save Path </Text>

                    <View style={styles.promptOption}>
                         <Text style={[styles.promptText,{flex:1,paddingTop:20}]} onPress = {this.savePrompt.bind(this)}>cancel</Text>
                         <Text style={[styles.promptText,{flex:1,paddingTop:20}]} onPress = {this.saveState.bind(this)}>Save</Text>
                    </View>
                  </View>
             </View>
      )
    }

    if(this.state.Home && this.state.latitude != 0) {
            homeScreen = (
                 <View style={styles.infoWrapper}>
                    <RunInfo title="Distance" value={this.state.distance.toFixed(2)}/>
                    <RunInfo title="Speed" value={this.state.speed.toFixed(1) + " km/h"}/>
                    <RunInfo title="Direction" value={this.state.heading_direction}/>
                 </View>

            )
        if(this.state.homeTop == 0) {
            homeTop = (
              <View style={styles.infoWrapperTop}>

                <View style = {[star.topInfoWrapper,{flex:6,backgroundColor:'rgba(26, 188, 156,0.90)'}]}>

                   <Text style = {star.topValue} onPress = {this.startRecording.bind(this)}>   Start  </Text>

                </View>
                <View style = {[star.topInfoWrapper,{flex:1,backgroundColor:'rgba(26, 188, 156,0.90)'}]}>
                   <Text style={star.topValue} onPress = {() => {this.setState({optionPrompt:!optionPrompt})}}> : </Text>
                </View>
              </View>
            )
        } else if(this.state.homeTop == 1) {
            homeTop = (
                   <View style={styles.infoWrapperTop}>

                   <View style = {[star.topInfoWrapper,{flex:6}]}>

                      <Text style = {star.topValue} onPress = {this.savePrompt.bind(this)}>   Stop and Save   </Text>

                   </View>
                   <View style = {[star.topInfoWrapper,{flex:1}]}>
                      <Text style={star.topValue} onPress = {() => {this.setState({optionPrompt:!optionPrompt})}}> : </Text>
                   </View>
                   </View>
            )
        } else if(this.state.homeTop == 2) {
             trackBack = (
                 <View style={styles.infoWrapperTop}>
                      <Trackback value={this.state.title} st = {this.state.tkcolor} trackBack={this.trackBack.bind(this)}/>
                      <View style = {[star.topInfoWrapper,{flex:1,backgroundColor:this.state.tkcolor}]}>
                          <Text style={star.topValue} onPress = {() => {this.setState({optionPrompt:!optionPrompt})}}> : </Text>
                      </View>
                 </View>
          )
        }

    }

    if(this.state.connected && this.state.Home && this.state.latitude != 0) {
         map = (<MapView style={styles.map} initialRegion = {{
                    longitude : this.state.longitude,
                    latitude  : this.state.latitude,
                    latitudeDelta:0.02,
                    longitudeDelta:0.02
                 }}
                    //onRegionChange={(region)=>this.addMarker(region)}
                    showsUserLocation followsUserLocation

                >
                <Polyline coordinates={this.state.linecoordination} strokeWidth={6} strokeColor = {this.state.stroke_color} />

                </MapView>)
    } else if(this.state.Home && this.state.latitude != 0) {

        map = (<View>

                 <Text style = {styles.connectionBanner}>No Internet Connection </Text>

              </View>)
    } else if(this.state.latitude == 0 && this.state.Home) {

        search_coordinate = (
                <View style={{flex:1,alignItems: 'center', justifyContent: 'center'}}>
                   <Image source={require('./img/loading.gif')} style={{width: 150, height: 150}} />
                   <Text style={{fontSize:25,fontWeight:'bold',marginTop:30}}> Searching for Coordinate </Text>
                </View>
        )
    }
    if(this.state.homeTop == 2) {
      stop_tracking_option = (<View style={{flexDirection:'row'}}>
        <Text style={[styles.promptText,{paddingRight:82,paddingBottom:20}]} onPress = {this.stopTracking.bind(this)}> Stop Tracking </Text>
      </View>)
    }
    if(this.state.optionPrompt) {
      optionPrompt = (
             <View style={styles.prompt}>
                  <View style={[styles.promptBody,{backgroundColor:'rgba(230, 126, 34,0.75)'}]}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={[styles.promptText,{paddingRight:60,paddingBottom:20}]} > Vibration </Text>
                      <Switch onTintColor='rgba(52, 152, 219,1.0)' onValueChange = {this.vibrationChange.bind(this)} value = {this.state.vibration_state}/>
                    </View>
                    { stop_tracking_option }
                    <Text style={[styles.promptText,{paddingTop:10}]} onPress={()=>{this.setState({optionPrompt:false})}}> Cancel </Text>
                  </View>
             </View>
      )
    }


    return (
      <View style = {[{flexGrow: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:this.state.bgcolor}]}>
        { firstScreen }
        { createdBy }
        { map }
        { homeTop }
        { savePrompt }
        { optionPrompt }
        { homeScreen }
        { trackBack }
        { search_coordinate }
        { creators }
      </View>
    );
  }
}



const styles =  StyleSheet.create({
  infoWrapper: {
      position : 'absolute',
      left:0,
      bottom:0,
      right:0,
      flexDirection : 'row',
      flex:1

  },
  promptOption: {
    flexDirection : 'row',
  },
  optionBody : {
    backgroundColor : 'rgba(52, 152, 219,0.90)',
    borderRadius: 3,
    margin: 20
  },
  infoWrapperTop: {
      position : 'absolute',
      left:0,
      top:0,
      right:0,
      flexDirection : 'row',
      flex:1

  },
  propmt: {
      position : 'absolute',
      flexDirection : 'column',
      flex:1,
  },
  promptBody : {
      backgroundColor : 'rgba(52, 152, 219,0.90)',
      borderRadius:3,
      padding:20,
      margin: 20
  },
  promptText : {
      fontSize: 20,
      borderRadius: 3,
      color:'#fff',
      textAlign:'center',
      fontWeight:'700'
  },
  map : {
    ...StyleSheet.absoluteFillObject
  },
  btn : {
    backgroundColor:'#e67e22',
    padding:10,
    color:'#fff',
    marginTop:80,
    fontSize:19,
    borderRadius:5,
    padding:15,
    paddingLeft:60,
    paddingRight: 60,
    fontWeight: 'bold',

  },
  connectionBanner: {
    backgroundColor: 'rgba(231, 76, 60,0.80)',
    color: '#fff',
    fontSize: 20,
    padding : 9,
    marginTop: -10,
    fontWeight: 'bold'
  }

});
