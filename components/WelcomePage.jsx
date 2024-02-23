import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler"; //  TouchableOpacity button to Explore Later...

const WelcomePage = ({ onStartAR, onFakeAR }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome Team-Six...</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require("../_media_/review-ar-04.png")}
          style={styles.logoImage}
        />
      </View>
      <Button
        title="Start with Google-API!"
        onPress={onStartAR}
        color="black"
      />
      {/* Find a way to style buttons */}
      <Button title="Start ReviewAR Demo" onPress={onFakeAR} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    top: 20,
    left: 20,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    flexBasis: 100,
  },
  logoImage: {
    flex: 1,
    width: 300,
    height: 300,
    resizeMode: 'contain'
  },
});

export default WelcomePage;
