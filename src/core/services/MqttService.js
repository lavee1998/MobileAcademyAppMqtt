import { Alert } from "react-native";

import init from "../libraries/mqtt";

init();

class MqttService {
  static instance = null;

  static getInstance() {
    if (!MqttService.instance) {
      MqttService.instance = new MqttService();
    }

    return MqttService.instance;
  }

  constructor() {
    const clientId = "SomeId";

    this.client = new Paho.MQTT.Client(
      "mab.inf.elte.hu",
      443,
      "/mqttservice",
      "tm_user1"
    );

    this.client.onMessageArrived = this.onMessageArrived;

    this.callbacks = {};

    this.onSuccessHandler = undefined;

    this.onConnectionLostHandler = undefined;

    this.isConnected = false;
  }

  connectClient = (
    onSuccessHandler,
    onConnectionLostHandler,
    userName,
    password
  ) => {
    this.onSuccessHandler = onSuccessHandler;

    this.onConnectionLostHandler = onConnectionLostHandler;

    this.client.onConnectionLost = () => {
      this.isConnected = false;

      onConnectionLostHandler();
    };

    if(this.isConnected) {
      this.client.disconnect()
    }

    this.client.connect({
      //timeout: 20,
      userName: userName, //"tm_user2",
      password: password, //"123",
      useSSL: true,

      onSuccess: () => {
        this.isConnected = true;
        onSuccessHandler();
      },
      onFailure: this.onFailure,
      reconnect: true,
      keepAliveInterval: 20,
      cleanSession: true,
    });
  };

  onFailure = ({ errorMessage }) => {
    console.info(errorMessage);

    this.isConnected = false;

    Alert.alert(
      "Could not connect to MQTT",

      [
        {
          text: "TRY AGAIN",
          onPress: () =>
            this.connectClient(
              this.onSuccessHandler,
              this.onConnectionLostHandler
            ),
        },
      ],

      {
        cancelable: false,
      }
    );
  };

  onMessageArrived = (message) => {
    const { payloadString, topic } = message;

    this.callbacks[topic](payloadString);
  };

  publishMessage = (topic, message) => {
    if (!this.isConnected) {
      console.info("not connected");

      return;
    }

    this.client.publish(topic, message);
  };

  subscribe = (topic, callback) => {
    if (!this.isConnected) {
      console.info("not connected");

      return;
    }

    this.callbacks[topic] = callback;

    this.client.subscribe(topic);
  };

  unsubscribe = (topic) => {
    if (!this.isConnected) {
      console.info("not connected");

      return;
    }

    delete this.callbacks[topic];

    this.client.unsubscribe(topic);
  };
}

export default MqttService.getInstance();
