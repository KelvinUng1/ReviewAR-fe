# ReviewAR
An mobile application that uses AR technology to display reviews for related nearby venues using your location data.

Repository available for iOS and Android

Example:
-
[![Short animation of ReviewAR opening scene](https://s9.gifyu.com/images/SFt5P.gif)](https://gifyu.com/image/SFt5P)
[![Short animation of a user accessing the user select page and selecting a user](https://s9.gifyu.com/images/SFtDq.gif)](https://gifyu.com/image/SFtDq)
[![Short animation showing an example of a piece of the app's functionality (specifically a screen recording of a user walking up to a location with the loading animation showing and a review popping up in AR view when in the vicinity)](https://s9.gifyu.com/images/SFttp.gif)](https://gifyu.com/image/SFttp)
[![Short animation of user adding a review by selecting a button from the AR camera scene and entering the required information](https://s9.gifyu.com/images/SFtoQ.gif)](https://gifyu.com/image/SFtoQ)

## Tech Stack
* React Native - Cross-Platform Mobile Development
* ViroAR - Cross-Platform AR Development
* Google Maps API - Geolocation Features

## Getting Started

## Step 1: Install Dependencies

```
npm install
```

### iOS Only

```
cd ios
pod install
cd ..
```
> **Note**: On Xcode, Signing and Certificates should be individual to your machine, i.e., Team: 'Your Personal Team', Bundle Identifier: 'Unique Bundle Identifier'

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
npm start
```

## Step 3: Start your Application

> **Warning**: Due to limitations of the Apple Simulator and the Android Emulator, you must run your project on a physical device.

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

```bash
# iOS
npx react-native run-ios
# Android
npx react-native run-android
```
> **Note**: Run npx react-native doctor to ensure you have all the required software needed to bundle the app

If everything is set up _correctly_, you should see your new app running on you device. 

An ugly AR app with a dragon hiding inside
