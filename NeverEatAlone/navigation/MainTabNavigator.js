import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import CalTab from "../screens/CalTab";
import FriendTab from "../screens/FriendTab";
import SettingsTab from "../screens/SettingsTab";
import LinksTab from "../screens/LinksTab";


const FriendsStack = createStackNavigator({
  Links: FriendTab,
});

FriendsStack.navigationOptions = {
  tabBarLabel: "Friends",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? `ios-people${focused ? "" : "-outline"}` : "md-people"}

    />
  ),
};

const CalStack = createStackNavigator({
  Cal: CalTab,
});

CalStack.navigationOptions = {
  tabBarLabel: "Calendar",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-calendar${focused ? "" : "-outline"}`
          : "md-calendar"
      }
    />
  ),
};
const LinksStack = createStackNavigator({
  Links: LinksTab,
});

LinksStack.navigationOptions = {
  tabBarLabel: "Links",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-link${focused ? "" : "-outline"}`
          : "md-link"
      }
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsTab,
});

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? `ios-settings${focused ? "" : "-outline"}` : "md-settings"}
    />
  ),
};



const tabNav = createBottomTabNavigator(
  {
  FriendsStack,
  CalStack,
  SettingsStack,
  LinksStack,
});

export default tabNav;