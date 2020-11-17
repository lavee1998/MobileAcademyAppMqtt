import { StatusBar } from 'expo-status-bar';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, useEffect}  from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";
import MqttService from "./src/core/services/MqttService";
import OfflineNotification from "./src/core/components/OfflineNotification";


const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const App = () => {
  const [isConnected, setIsConnected] = React.useState(false)
  const [message, setMessage] = React.useState("")

  useEffect(() => {
    MqttService.connectClient(
      mqttSuccessHandler,
      mqttConnectionLostHandler
    );  }, [])

 

  const onWORLD = message => {
    setMessage(message)
  };

  const mqttSuccessHandler = () => {
    console.info("connected to mqtt");
    MqttService.subscribe("WORLD", onWORLD);

    setIsConnected(true)
  };

  const mqttConnectionLostHandler = () => {
    setIsConnected(false)
  };
  const onPublish = () => {
    MqttService.publishMessage("WORLD", "Hello from the app");
  }

    return (
      <View style={styles.container}>
        {!isConnected && <OfflineNotification />}
        <Text style={styles.welcome}>You received message: {message}</Text>
        <Button
          onPress={onPublish}
          title="Publish"
          color="#841584"
        />
      </View>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

export default App

