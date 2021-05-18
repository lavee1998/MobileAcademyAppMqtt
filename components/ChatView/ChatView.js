import { GiftedChat } from "react-native-gifted-chat";
import React, { useState, useCallback, useEffect } from "react";
import MqttService from "../../src/core/services/MqttService";
import { connect } from "react-redux";

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
    let id = uuidv4()
    setUserId(id)
  }, []);

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const onSend = useCallback((messageJSON = []) => {
    let message = JSON.stringify(messageJSON);
    // MqttService.publishMessage("WORLDCHAT", messageString);
    fetch(`https://mabmqttproxy.herokuapp.com/chat/?message=${message}`);

  }, []);

  useEffect(() => {
    console.log("Messages changed");
  }, [messages]);

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
