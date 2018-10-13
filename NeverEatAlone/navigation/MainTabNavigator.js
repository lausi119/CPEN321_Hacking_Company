import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import CalScreen from '../screens/CalScreen';
import FriendTab from '../screens/FriendTab';
import SettingsScreen from '../screens/SettingsScreen';
import LinksScreen from '../screens/LinksScreen';

const FriendsStack = createStackNavigator({
  Links: FriendTab,
});

FriendsStack.navigationOptions = {
  tabBarLabel: 'Friends',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-people${focused ? '' : '-outline'}` : 'md-people'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

const CalStack = createStackNavigator({
  Cal: CalScreen,
});

CalStack.navigationOptions = {
  tabBarLabel: 'Calendar',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-calendar${focused ? '' : '-outline'}`
          : 'md-calendar'
      }
    />
  ),
};
const LinksStack = createStackNavigator({
  Cal: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-link${focused ? '' : '-outline'}`
          : 'md-link'
      }
    />
  ),
};


SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-settings${focused ? '' : '-outline'}` : 'md-settings'}
    />
  ),
};

export default createBottomTabNavigator({
  FriendsStack,
  CalStack,
  SettingsStack,
  LinksStack,
});
