import { GiftedChat } from "react-native-gifted-chat";
import React, { useState, useCallback, useEffect } from "react";
import MqttService from "../../src/core/services/MqttService";
import { View, Alert } from "react-native";
import { connect } from "react-redux";
import UUIDGenerator from "react-native-uuid-generator";

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
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState();
  const [isDialogVisible, setIsDialogVisible] = useState(true);

  useEffect(() => {
    UUIDGenerator.getRandomUUID().then((uuid) => {
        setUserId(uuid);
    });
  }, []);

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
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: userId,
          name: userName,
        }}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state /*, ownProps*/) => ({
  messages: state.messages,
});

export default connect(mapStateToProps)(ChatView);
