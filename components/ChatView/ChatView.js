import { GiftedChat } from "react-native-gifted-chat";
import React, { useState, useCallback, useEffect } from "react";
import MqttService from "../../src/core/services/MqttService";
import { View, Alert } from "react-native";
import { connect } from 'react-redux'


import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  TextInput,
} from "react-native-paper";
import OfflineNotification from "../../src/core/components/OfflineNotification";

const ChatView = ({ messages }) => {
   const [componentMessages, setComponentMessages] = useState(messages);
  //const [isConnected, setIsConnected] = React.useState(false);

  const [userName, setUserName] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(true);

  /*useEffect(() => {
   // MqttService.connectClient(mqttSuccessHandler, mqttConnectionLostHandler);

    setMessages([
      {
        _id: 1,
        text: "Hello User",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);*/

  useEffect(() => {
    let length = messages.length;
    console.log("Változott" + messages[length-1]);

    setComponentMessages((previousMessages) =>
    GiftedChat.append(previousMessages, messages[length-1]));
   // setComponentMessages(messages)
   // useState();
    //GiftedChat.append(previousMessages, messageJSON);
  }, [messages]);

  /* const mqttSuccessHandler = () => {
    console.info("connected to mqtt WORLDCHAT topic");
    MqttService.subscribe("WORLDCHAT", onWORLD);

    setIsConnected(true);
  };*/

  /* const mqttConnectionLostHandler = () => {
    setIsConnected(false);
  };*/

  /*const onWORLD = (messageFromWorldChat) => {
    let messageJSON = JSON.parse(messageFromWorldChat);

    setMessages((previousMessages) =>
    GiftedChat.append(previousMessages, messageJSON)
  );

    //setMessage(message);
  };*/

  const onSend = useCallback((messageJSON = []) => {
    let messageString = JSON.stringify(messageJSON);
    MqttService.publishMessage("WORLDCHAT", messageString);
  }, []);

  return (
    <React.Fragment>
      <Portal>
        <Dialog visible={isDialogVisible}>
          <Dialog.Title>Add your name</Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={userName}
              placeholder="your name..."
              onChangeText={(input) => setUserName(input)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <GiftedChat
        messages={componentMessages}
        onSend={(message) => onSend(message)}
        user={{
          _id: 1,
          name: userName,
        }}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state /*, ownProps*/) => ({
  messages: state.messages,
  //nextPage: state.stats.nextPage,
});

export default connect(mapStateToProps)(ChatView);
