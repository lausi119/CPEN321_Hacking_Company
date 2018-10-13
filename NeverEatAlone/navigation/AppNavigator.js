import React from 'react';
import { createSwitchNavigator,
createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import CalScreen from '../screens/CalScreen';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LinksScreen from '../screens/LinksScreen';

const AppStack = createStackNavigator(
  {
      Main: MainTabNavigator, 
  });
const AuthStack = createStackNavigator(
  {
      Login: LoginScreen,
  });

export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  
});
/*export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: "Auth"
  }
);*/