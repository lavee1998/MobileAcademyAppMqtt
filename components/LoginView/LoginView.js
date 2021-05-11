import React from "react";

import { SafeAreaView } from "react-native";
import { Card, Title, Button, TextInput, View } from "react-native-paper";
import MapView, { AnimatedRegion } from "react-native-maps";
import DropDown from "react-native-paper-dropdown";
import { ScrollView, Image } from "react-native";

const LoginView = ({ navigation }) => {
  const [text, onChangeText] = React.useState("");
  const [number, onChangeNumber] = React.useState("");

  console.log(navigation);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Title>Login with your account</Title>
      <TextInput
        style={{ margin: "auto", width: "90%" }}
        onChangeText={onChangeText}
        placeholder="UserName"
        value={text}
      />
      <TextInput
        style={{ margin: "auto", width: "90%" }}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="Password"
      />
      <Button
        icon="login"
        mode="contained"
        style={{ margin: 8, width: "90%" }}
        onPress={() => navigation.navigate("App")}
      >
        Login
      </Button>
    </SafeAreaView>
  );
};

export default LoginView;
