import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AppProvider from "./AppProvider";
import Login from "./components/LoginView";
import { NavigationContainer } from "@react-navigation/native";
import { Button, View, Text } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="App" component={AppProvider} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
