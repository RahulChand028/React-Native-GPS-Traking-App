import { StyleSheet } from 'react-native';

export default StyleSheet.create ({

	runInfoWrapper : {

		backgroundColor : 'rgba(255,255,255,0.75)',

		borderStyle:'solid',

		borderLeftWidth: 1,

		paddingVertical: 15,

		borderColor: '#c3cbd8'

	} ,
	topInfoWrapper : {

		backgroundColor : 'rgba(46, 204, 113,0.75)',

		borderStyle:'solid',

		borderLeftWidth: 1,

		paddingVertical: 15,

		borderColor: '#fff'

	} ,

	trackWrapper : {

		backgroundColor : 'rgba(140, 122, 230,0.80)',

		borderStyle:'solid',

		borderLeftWidth: 1,

		paddingVertical: 15,

		borderColor: '#c3cbd8'

	},

	runInfoTitle : {

	   textAlign : 'center',

       fontWeight : '700',

	   color : '#666',

	   fontSize : 17,

	} ,

	runInfoValue : {

	   textAlign : 'center',

       fontWeight : '200',

       color : '#666' ,

       paddingVertical: 0,

	   fontSize : 20,

	   marginTop: 3,

	},

	topValue : {

		fontSize:22,

		textAlign:'center',

		fontWeight :'700',

    paddingVertical: 6,

		color:'#fff'
	}

})
