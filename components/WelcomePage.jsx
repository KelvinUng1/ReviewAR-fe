import React from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";

const WelcomePage = ({ onStartAR }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>GeoReview</Text>
      <Text style={styles.subtitle}>Discover Places Near You</Text>
      <Text style={styles.subtitle}>Welcome, Wanderlust_123!</Text>
      <TouchableOpacity onPress={onStartAR}>
        <Image source={require('../components/res/augmented-reality.png')} style={styles.arIcon} />
      </TouchableOpacity>

      <Pressable style={styles.button} onPress={onStartAR}>
      <Text style={styles.text}>START</Text>
     
     </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E3B4E",
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    color: '#8F9BB3',
    fontSize: 18,
    marginBottom: 15,
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
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'green',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default WelcomePage;