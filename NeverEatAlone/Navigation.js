import {createStackNavigator} from "react-navigation";
import {LoginScreen} from "./screens/LoginScreen.js";

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
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: "Auth"
  }
);