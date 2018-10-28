import React from "react";
import { createSwitchNavigator,
createStackNavigator } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import LoginScreen from "../screens/LoginScreen";

export default createSwitchNavigator({
  Auth: LoginScreen,
  App: MainTabNavigator,
});