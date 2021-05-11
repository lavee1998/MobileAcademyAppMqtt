import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Provider as PaperProvider,
  Appbar,
  DefaultTheme,
  BottomNavigation,
} from "react-native-paper";
import reducer from "./reducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import AppMqtt from "./AppMqtt";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "darkcyan",
    accent: "white",
  },
};

const store = createStore(reducer);

export default AppProvider = ({ navigation, route }) => {
  console.log(route, route.params, "appprovider");
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppMqtt
          username={route.params.username}
          password={route.params.password}
        />
      </PaperProvider>
    </Provider>
  );
};
