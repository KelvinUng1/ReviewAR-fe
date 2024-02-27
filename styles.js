import { StyleSheet } from "react-native";

const LemonMilkRegular = require('./assets/fonts/lemonmilk/LEMONMILK-Regular.otf');

const styles = StyleSheet.create({
/////////////DEFAULT VIRO STYLING/////////////////
    helloWorldTextStyle: {
        fontStyle: "bold",
        fontSize: 20,
        color: "#000",
        textAlign: "center",
    },
//////////WELCOME PAGE STYLING//////////////
backgroundImage: {
  flex: 1,
  resizeMode:"cover",
},

container: {
  flex: 1,
  justifyContent: "top",
  alignItems: "center",
  marginTop: 160,
},

logo: {
  marginBottom: 80,
},
appName: {
  color: '#FFFFFF',
  fontSize: 40,
  fontWeight: 'bold',
  marginBottom: 15,
},
subtitle: {
  color: 'white',
  fontSize: 18,
  marginBottom: 50,
},
arIcon: {
  width: 75,
  height: 75,
  marginTop: 25,
},
button: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 3,
  paddingHorizontal: 5,
  borderRadius: 2,
  elevation: 3,
  backgroundColor: "#a5d8ff"
  
},
text: {
  fontSize: 16,
  lineHeight: 21,
  fontWeight: 'bold',
  letterSpacing: 0.25,
  color: 'black',
  textAlign:"center"
},
buttonGroupContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between', 
  width: '80%', 
  marginTop: 30, 
},
buttonGroup: {
  flex: 1,
  alignItems: 'center', 
},
//ring
ring: {
  position: 'absolute', // Make the ring absolute positioned
  width: 400,
  height: 400,
  borderRadius: 200,
  backgroundColor: '#a3adf2',
  borderWidth: 1,
  borderColor: '#7789ea',
  opacity: 1,
},

///////////////SWITCH USER PAGE STYLING///////////

    switchUserPageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchUserPageHeader: {
      position: 'absolute',
      top: 20,
      left: 20,
    },
    switchUserPageContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    switchUserPageText: {
      textAlign: 'center',
      fontSize: 20,
      lineHeight: 22,
      marginBottom: 150,
      padding: 10,
      color: 'white',
      fontSize: 15,
      fontFamily: 'LemonMilkRegular',
    },
    userListContainer: {
      width: '90%',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 0,
      padding: 10,
      marginTop: 20,
      height: 100,
    },
    userListScrollContainer: {
      alignItems: 'center',
    },
    userCard: {
      borderWidth: 2,
      borderColor: 'rgba(84, 95, 178, 0)',
      backgroundColor: '#a3adf2',
      marginLeft: 10,
      marginRight: 10,
      height: 50
    },
    userCardText: {
      textAlign: 'center',
      fontFamily: 'LemonMilkRegular',
      fontWeight: 'bold',
      fontSize: 20,
      color: 'white',
      padding: 5
    },


////////////AR ELEMENTS STYLING///////////////////
venueInfoAndReviewsContainer: {
  height: 4,
  width: 6,
  backgroundColor: "rgba(0, 0, 0, 0.7)", // Making background slightly transparent for AR feel
  flexDirection: "column", // Ensure content is laid out vertically
  justifyContent: "flex-start", // Align items to the top
  alignItems: "center", // Center items horizontally
  padding: 0.1, // Adjust padding as necessary
},
displayedVenueTitleBar: {
  width: 6,
  backgroundColor: "rgba(165, 216, 255, 1)", // Navy background for the title
  padding: 0.1, // Adjust padding for the title
  marginBottom: 0.1, // Space below the title bar
},

displayedVenueTitleBarText: {
  height: 0.5,
  color: "navy",
  fontSize: 30, // Adjust font size for readability in AR
  fontWeight: "bold",
  textAlign: "center",
},

//////////////////
displayedReviewAvgRatingVisual: {
  flex: 0.3,
  opacity: 1,
  width: 6,
  flexDirection: "row",
  backgroundColor: "#7789ea",
},
avg1Star: {
  flex: 0.2,
  backgroundColor: "#545fb2",
  opacity: 1,
  width: 1.2,
},
avg2Star: {
  flex: 0.2,
  backgroundColor: "#545fb2",
  opacity: 1,
  width: 1.2,
},
avg3Star: {
  flex: 0.2,
  backgroundColor: "#545fb2",
  opacity: 1,
  width: 1.2,
},
avg4Star: {
  flex: 0.2,
  backgroundColor: "#545fb2",
  opacity: 1,
  width: 1.2,
},
avg5Star: {
  flex: 0.2,
  backgroundColor: "rgb(0, 128, 0)",
  opacity: 1,
  width: 1.2,
},

////////////////////////////
displayedVenueAvgRatingBar: {
    flex: 0.20,
width: 6,
backgroundColor: "#a3adf2",
padding: 0.2, // Add padding for spacing
paddingTop:0,
},

////////////////////////////
displayedVenueAvgRatingBarText: {
  color: "black",
  textAlign: "center",
  fontSize: 17,
  flex: 0.5,
  width: 6,
  backgroundColor: "navy",
  padding: 0.1, // Add padding for spacing
  marginBottom: 0.1, // Space below each review section
  
},
displayedReviewBody: {
  flex: 2,
  width: 6,
  backgroundColor: "#7789ea",
  padding: 0.1, // Add padding for spacing
  marginBottom: 0.1, // Space below each review section
},
displayedReviewBodyText: {
  height: 2,
  color: "black",
  fontSize: 15, // Adjust font size for readability
  textAlign: "left",
},

//BUTTON BAR --
buttonBar: {
  flexDirection: "row",
  justifyContent: 'space-between', // Distribute buttons evenly
  alignItems: "center",
  width: 6,
  flex: 0.75,
  backgroundColor: "#a3adf2", // Consistent with container style
  padding: 0.1, // Padding for spacing
},

//ADD REVIEW BUTTON
addReviewButton: {
  
  height: 0.5,
  width: 1.8,
  backgroundColor: "#545fb2",
},
addReviewButtonText: {
  flex: 1,
  color: "white",
  fontSize: 25,
  fontWeight: "bold",
  textAlign: "center",
},
//BLANK BUTTON _ANOTHER
anotherOneButton: {
  flex: 1,
  height: 0.5,
  width: 1.8,
  backgroundColor: "#545fb2",

},
anotherOneButtonText: {
  color: "white",
  fontSize: 25,
  fontWeight: "bold",
  textAlign: "center",
},

//BACK TO TOP BUTTON
mostRecentReviewButton: {
  height: 0.5,
  width: 1.8,
  backgroundColor: "#545fb2",

},
mostRecentReviewButtonText: {
  flex: 1,
  color: "white",
  fontSize: 25,
  fontWeight: "bold",
  textAlign: "center",
},
//NEXTT BUTTON
displayedNextReviewButton: {

  color: "Blue",
  height: 0.5,
  width: 1.8,
  backgroundColor: "#545fb2",
  fontSize: 25,
},
displayedReviewNextButtonText: {
  color: "white",
  flex: 1,
  fontSize: 25,
  fontWeight: "bold",
  textAlign: "center",
},
});

module.exports = styles;