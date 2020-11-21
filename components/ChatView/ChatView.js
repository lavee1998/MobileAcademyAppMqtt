import { GiftedChat } from "react-native-gifted-chat";
import React, { useState, useCallback, useEffect } from "react";
import MqttService from "../../src/core/services/MqttService";
import { View, Alert } from 'react-native';

import {Button,
    Paragraph,
    Dialog,
    Portal,
    Provider,
    TextInput,
} from 'react-native-paper'
import OfflineNotification from "../../src/core/components/OfflineNotification";

const ChatView = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = React.useState(false);

  const [userName, setUserName] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(true);


  useEffect(() => {
    MqttService.connectClient(mqttSuccessHandler, mqttConnectionLostHandler);

    setMessages([
      {
        _id: 1,
        text: "Hello Eszter",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

 

  const mqttSuccessHandler = () => {
    console.info("connected to mqtt WORLDCHAT topic");
    MqttService.subscribe("WORLDCHAT", onWORLD);

    setIsConnected(true);
  };

  const mqttConnectionLostHandler = () => {
    setIsConnected(false);
  };

  const onWORLD = (messageFromWorldChat) => {
    let messageJSON = JSON.parse(messageFromWorldChat);

    setMessages((previousMessages) =>
    GiftedChat.append(previousMessages, messageJSON)
  );

    //setMessage(message);
  };
 

  const onSend = useCallback((messages = []) => {

    let message = JSON.stringify(messages);
    MqttService.publishMessage("WORLDCHAT", message);

   
  }, []);

  return (
      <React.Fragment>
          <Portal>
                  <Dialog
    visible={isDialogVisible}
    >
    <Dialog.Title>Add your name</Dialog.Title>
    <Dialog.Content>
      <TextInput
        value={userName}
        placeholder = "your name..."
        onChangeText={input => setUserName(input)}
      />
     
    
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={() => setIsDialogVisible(false)}>Done</Button>
    </Dialog.Actions>
  </Dialog>
          </Portal>
      

    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
        name: userName,
      }}
    />
      </React.Fragment>
    
  );
};

export default ChatView;
