/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, useEffect, useRef } from "react";
import { Platform, StyleSheet, Text, View, Alert } from "react-native";
import MqttService from "../../src/core/services/MqttService";
import OfflineNotification from "../../src/core/components/OfflineNotification";

import { connect, useDispatch } from "react-redux";

import { SafeAreaView } from "react-native";
import { Card, Title, Button, TextInput } from "react-native-paper";
import MapView, { AnimatedRegion } from "react-native-maps";
import DropDown from "react-native-paper-dropdown";
import { ScrollView, Image } from "react-native";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu",
});

const AddViewMqtt = ({ markers, addMarker }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [currentRegion, setCurrentRegion] = React.useState(null);
  const [showDropDown, setShowDropDown] = React.useState(false);
  const [action, setAction] = React.useState();
  const [marker, setMarker] = React.useState();

  const isFirstRender = useRef(true);

 


  const actionList = [
    { value: 0, label: "Traffipax" },
    { value: 1, label: "Accident" },
    { value: 2, label: "Construction" },
  ];

  useEffect(() => {
    console.log("type: " + action);

    getCurrentLocation().then((position) => {
      if (position) {
        setCurrentRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0001,
          longitudeDelta: 0.0001,
        });
      }
    });
    MqttService.connectClient(mqttSuccessHandler, mqttConnectionLostHandler);
    isFirstRender.current = false;
  }, []);
/*
  useEffect(() => {
    if (!isFirstRender.current) {
      console.log("message: " + message);
      Alert.alert(message);
    }
  }, [message]);*/

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (e) => reject(e)
      );
    });
  };

  const onWORLD = (messageFromWorld) => {
    let messageJSON = JSON.parse(messageFromWorld);
    addMarker(messageJSON.type, 9, messageJSON.latitude, messageJSON.longitude);
    console.log(
      "type: " +
        messageJSON.type +
        " lat: " +
        messageJSON.latitude +
        " long: " +
        messageJSON.longitude
    );
    setMessage(messageFromWorld);

    //setMessage(message);
  };

  const mqttSuccessHandler = () => {
    console.info("connected to mqtt");
    MqttService.subscribe("WORLD", onWORLD);

    setIsConnected(true);
  };

  const mqttConnectionLostHandler = () => {
    setIsConnected(false);
  };
  const onPublish = () => {
    console.log("action: " + action);
    let newMarker = {
      latitude: marker.latitude,
      longitude: marker.longitude,
      type: action,
    };
    let message = JSON.stringify(newMarker);
    MqttService.publishMessage("WORLD", message);
  };

  return (
    <ScrollView>
      <View>
        <Card>
          <Card.Title title="Send new perception" />
          <Card.Content>
            <Title>1. Choose the type(test)</Title>

            <DropDown
              label={"Type of action"}
              mode={"outlined"}
              value={action}
              setValue={setAction}
              list={actionList}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              inputProps={{
                right: <TextInput.Icon name={"menu-down"} />,
              }}
            />
            <Title>2. Choose the location</Title>
            <View>
              <MapView
                style={{ width: "100%", height: 400, alignContent: "center" }}
                loadingEnabled={true}
                zoomEnabled={true}
                defaultRegion={currentRegion}
                onPress={(e) => setMarker(e.nativeEvent.coordinate)}
              >
                {marker && <MapView.Marker coordinate={marker} />}
                {markers.map((marker, i) => {
                  var markerSource = "";
                  switch (marker.type) {
                    case 0:
                      markerSource = require("../../images/tc_logo.png");
                      break;
                    case 1:
                      markerSource = require("../../images/traffic_accident.png");
                      break;
                    case 2:
                      markerSource = require("../../images/construction_logo.png");
                      break;
                    default:
                      markerSource = require("../../images/tc_logo.png");
                  }
                  return (
                    <MapView.Marker key={i} coordinate={marker}>
                      <Image
                        source={markerSource}
                        style={{ height: 50, width: 55 }}
                      />
                    </MapView.Marker>
                  );
                })}
              </MapView>
            </View>
          </Card.Content>
          <Card.Actions>
            <View>
              {!isConnected && <OfflineNotification />}

              <Button
                style={{ textAlign: "center", alignContent: "center" }}
                onPress={onPublish}
                title="Publish"
                color="#841584"
              >
                Publish
              </Button>
            </View>
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

const mapStateToProps = (state /*, ownProps*/) => ({
  markers: state.markers,
  //nextPage: state.stats.nextPage,
});

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    addMarker: (type, id, latitude, longitude) =>
      dispatch({
        type: "ADD_MARKER",
        payload: {
          type: type,
          id: id,
          latitude: latitude,
          longitude: longitude,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddViewMqtt);
