import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import CalTab from "../screens/CalTab";
import FriendTab from "../screens/FriendTab";
import SettingsTab from "../screens/SettingsTab";
import InvitesTab from "../screens/InvitesTab";


const FriendsStack = createStackNavigator({
  Links: FriendTab,
});

FriendsStack.navigationOptions = {
  tabBarLabel: "Friends",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
    id="friend-tab-button"
      focused={focused}
      name={Platform.OS === "ios" 
      ? `ios-people` 
      : "md-people"}

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
      id="cal-tab-button"
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-calendar`
          : "md-calendar"
      }
    />
  ),
};

const InvitesStack = createStackNavigator({
  Invites: InvitesTab,
});

InvitesStack.navigationOptions = {
  tabBarLabel: "Invites",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      id="invites-tab-button"
      focused={focused}
      name={Platform.OS === "ios"
      ? `ios-notifications` 
      : "md-notifications"}
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
      id="settings-tab-button"
      focused={focused}
      name={Platform.OS === "ios"
      ? `ios-settings` 
      : "md-settings"}
    />
  ),
};



const tabNav = createBottomTabNavigator(
  {
  FriendsStack,
  CalStack,
  InvitesStack,
  SettingsStack,
});

export default tabNav;