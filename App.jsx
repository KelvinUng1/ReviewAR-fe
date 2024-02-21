import 'react-native-gesture-handler'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import WelcomePage from "./components/WelcomePage";
import CommentPage from './components/CommentPage';
import ARSceneWithLocation from "./components/ARScene";

import { ViroARSceneNavigator } from "@viro-community/react-viro";
import MapView, { Marker, Circle } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

import {Platform } from 'react-native'
const Stack = createStackNavigator()

// Main App component
const App = () => {
  const [position, setPosition] = useState(null);
  const [showARView, setShowARView] = useState(false);

  const handleStartAR = () => {
    setShowARView(true);
  };

  // Get device's current position
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setPosition(position.coords);
      },
      (error) => {
        console.error("Error getting current position:", error);
      }
    );
  }, []);

  // Render MapView and ARSceneNavigator
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerTitle: "AR camera",
        headerShown: false,
        gestureEnabled: true,
      }}
      >

      <Stack.Screen name="Home">
          {(props) => (
      <View style={styles.container}>
      {!showARView && <WelcomePage onStartAR={handleStartAR} />}
      {showARView && (
       
          <ViroARSceneNavigator
            autofocus={true}
            initialScene={{ scene: ARSceneWithLocation }}
            style={{ flex: 1 }}
          />
      )}

      {position && showARView && (
        <MapView
          style={styles.map}
          minZoomLevel={13}
          initialRegion={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Circle
            center={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
            radius={500} 
            fillColor="rgba(255, 0, 0, 0.2)"
            strokeColor="rgba(255, 0, 0, 0.5)"
          />
          <Marker
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          />
        </MapView>
      )}
    </View>
    )}
    </Stack.Screen>
   
    <Stack.Screen 
    name="CommentPage" 
    component={CommentPage}
    options={{
      ...Platform.select({
        ios: {
          headerShown: true,
          headerTitle: "Add a review",
          gestureEnabled: true,
        },
        android: {
          headerShown: false, 
          gestureEnabled: true,
        }
      })
    }} />

    </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: 150,
    width: 150,
    position: "absolute",
  },

  helloWorldTextStyle: {
    fontStyle: "bold",
    fontSize: 11,
    color: "#fff",
    textAlign: "center",
    zIndex: 2,
  },
});

// Export App component
export default App;
