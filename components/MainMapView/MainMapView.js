import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import { connect } from "react-redux";
import { List, IconButton, Colors } from "react-native-paper";
import MqttService from "../../src/core/services/MqttService";

const MainMapView = ({ markers, addMarker }) => {
  // const [isConnected, setIsConnected] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const [currentRegion, setCurrentRegion] = React.useState(null);

  useEffect(() => {
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
    // MqttService.connectClient(mqttSuccessHandler, mqttConnectionLostHandler);
  }, []);

  useEffect(() => {
    console.log("szia5");
  }, [markers]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (e) => reject(e)
      );
    });
  };

  const approve = (eventMarker) => {
    //  removeMarker(event)

    if (eventMarker.isApproved === false) {
      let messageJSON = {
        address: eventMarker.address,
        latitude: eventMarker.latitude,
        longitude: eventMarker.longitude,
        type: eventMarker.type,
        approveCount: eventMarker.approveCount + 1,
        disApproveCount: eventMarker.disApproveCount,
        isApproved: true,
      };
      let message = JSON.stringify(messageJSON);
      MqttService.publishMessage("ApproveWORLD", message);
    }
  };

  const disApprove = (eventMarker) => {
    //  removeMarker(event)
    console.log("próba");

    if (eventMarker.isApproved === false) {
      let messageJSON = {
        address: eventMarker.address,
        latitude: eventMarker.latitude,
        longitude: eventMarker.longitude,
        type: eventMarker.type,
        approveCount: eventMarker.approveCount,
        disApproveCount: eventMarker.disApproveCount + 1,
        isApproved: true,
      };

      let message = JSON.stringify(messageJSON);
      MqttService.publishMessage("ApproveWORLD", message);
    }
  };

  //----------------------------------- MQTT ----------------------------------------
  /*const mqttConnectionLostHandler = () => {
    setIsConnected(false);
  };*/
  /*
  const mqttSuccessHandler = () => {
    console.info("connected to mqtt");
    MqttService.subscribe("WORLD", onWORLD);
    MqttService.subscribe("ApproveWORLD", onApproveWORLD);

    setIsConnected(true);
  };*/

  /*const onWORLD = (messageFromWorld) => {
    let messageJSON = JSON.parse(messageFromWorld);
    addMarker(messageJSON);
    console.log(
      "type: " +
        messageJSON.type +
        " lat: " +
        messageJSON.latitude +
        " long: " +
        messageJSON.longitude
    );
    setMessage(messageFromWorld);
    console.log(message);
  };
*/
  const onApproveWORLD = (messageFromWorld) => {
    let messageJSON = JSON.parse(messageFromWorld);
    addMarker(messageJSON);
    console.log(
      "type: " +
        messageJSON.type +
        " lat: " +
        messageJSON.latitude +
        " long: " +
        messageJSON.longitude +
        " count: " +
        messageJSON.approveCount
    );
    setMessage(messageFromWorld);
  };

  return (
    <View>
      <View style={styles.list}>
        <ScrollView>
          <List.Section>
            {markers.map((marker, i) => {
              var iconSource = "";
              switch (marker.type) {
                case 0:
                  iconSource = "shield-check";
                  break;
                case 1:
                  iconSource = "alert";
                  break;
                case 2:
                  iconSource = "wrench";
                  break;
                default:
                  iconSource = "equal";
              }
              if (marker.disApproveCount < 8) {
                return (
                  <List.Item
                    key={i}
                    title={marker.address}
                    description={`Approved by ${marker.approveCount} people. DisApproved by ${marker.disApproveCount} people`}
                    left={(props) => <List.Icon {...props} icon={iconSource} />}
                    right={() => (
                      <React.Fragment>
                        <IconButton
                          icon="thumb-up"
                          color={Colors.greenA400}
                          disabled={marker.isApproved}
                          size={20}
                          onPress={() => approve(marker)}
                        />
                        <IconButton
                          icon="thumb-down"
                          color={Colors.redA200}
                          disabled={marker.isApproved}
                          size={20}
                          onPress={() => disApprove(marker)}
                        />
                      </React.Fragment>
                    )}
                  />
                );
              }
            })}
          </List.Section>
        </ScrollView>
      </View>
      <MapView
        style={styles.map}
        loadingEnabled={true}
        zoomEnabled={true}
        defaultRegion={currentRegion}
      >
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
              <Image source={markerSource} style={{ height: 50, width: 55 }} />
            </MapView.Marker>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get("window").height * 0.7,
  },
  list: {
    height: Dimensions.get("window").height * 0.3,
    borderBottomWidth: 12,
    borderBottomColor: "darkcyan",
  },
});

const mapStateToProps = (state /*, ownProps*/) => ({
  markers: state.markers,
  //nextPage: state.stats.nextPage,
});

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    addMarker: (marker) =>
      dispatch({
        type: "ADD_MARKER",
        payload: {
          address: marker.address,
          type: marker.type,
          latitude: marker.latitude,
          longitude: marker.longitude,
          approveCount: marker.approveCount,
        },
      }),

    removeMarker: (marker) =>
      dispatch({
        type: "REMOVE_MARKER",
        payload: {
          address: marker.address,
          type: marker.type,
          latitude: marker.latitude,
          longitude: marker.longitude,
          approveCount: marker.approveCount,
        },
      }),
    approveMarker: (marker) =>
      dispatch({
        type: "APPROVE_MARKER",
        payload: {
          address: marker.address,
          type: marker.type,
          latitude: marker.latitude,
          longitude: marker.longitude,
          approveCount: marker.approveCount,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMapView);
