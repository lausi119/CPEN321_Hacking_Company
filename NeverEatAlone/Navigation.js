import {createStackNavigator} from 'react-navigation';

const AppStack = createStackNavigator(
    {
        Friends: FriendsScreen, 
        FriendOptions: FriendOptionsScreen
    });
const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
    });

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: "Auth"
  }
);