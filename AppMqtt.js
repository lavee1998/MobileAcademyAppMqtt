import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Provider as PaperProvider,
  Appbar,
  DefaultTheme,
  BottomNavigation,
} from "react-native-paper";
import MainMapView from "./components/MainMapView";
import AddView from "./components/AddView";
import ChatView from "./components/ChatView";
import reducer from "./reducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { connect } from "react-redux";

import MqttService from "./src/core/services/MqttService";
import OfflineNotification from "./src/core/components/OfflineNotification";

const Map = () => <MainMapView />;
const Add = () => <AddView />;
const Chat = () => <ChatView />;

const AppMqtt = ({ addMarker, addMessage, removeMarker }) => {
  const _goBack = () => console.log("Went back");
  const [isConnected, setIsConnected] = React.useState(false);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "map", title: "Map", icon: "map" },
    { key: "add", title: "Add", icon: "plus" },
    { key: "chat", title: "Chat", icon: "chat" },
  ]);

  useEffect(() => {
    MqttService.connectClient(mqttSuccessHandler, mqttConnectionLostHandler);
  }, []);

  const mqttSuccessHandler = () => {
    console.info("connected to mqtt");
    MqttService.subscribe("WORLD", onWORLD);
    MqttService.subscribe("WORLDCHAT", onWORLDCHAT);
    MqttService.subscribe("ApproveWORLD", onApproveWORLD);

    setIsConnected(true);
  };

  const onWORLD = (messageFromWorld) => {
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
    console.log(messageJSON)
    setMessage(messageFromWorld);
  };

  const onWORLDCHAT = (messageFromWorldChat) => {
    let messageJSON = JSON.parse(messageFromWorldChat);

    console.log("ONWORLDCHAT TEST")
    console.log(messageJSON);
    addMessage(messageJSON);

    /* setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messageJSON)
    );*/
  };

  const onApproveWORLD = (messageFromWorld) => {

    let messageJSON = JSON.parse(messageFromWorld);
    removeMarker(messageJSON)

    console.log("szia")


    let newMarker = {
        address: messageJSON.address,
        latitude: messageJSON.latitude,
        longitude: messageJSON.longitude,
        type: messageJSON.type,
        approveCount: messageJSON.approveCount + 1
      };
    
    addMarker(newMarker);

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
    //setMessage(messageFromWorld);
  };

  const mqttConnectionLostHandler = () => {
    setIsConnected(false);
  };

  const renderScene = BottomNavigation.SceneMap({
    add: Add,
    map: Map,
    chat: Chat,
  });

  return (
    <React.Fragment>
      <Appbar.Header>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Mobil Academy" subtitle="helló Levi" />
      </Appbar.Header>

      {!isConnected && <OfflineNotification />}
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state /*, ownProps*/) => ({
  markers: state.markers,
  messages: state.messages,
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
    addMessage: (message) =>
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          id: message[0]._id,
          text: message[0].text,
          createdAt: message[0].createdAt,
          user: {
            _id: message[0].user._id,
            name: message[0].user.name,
            
          },
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
          approveCount: marker.approveCount
      },
    }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppMqtt);