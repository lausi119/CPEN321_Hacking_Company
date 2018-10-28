import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View, Platform
  } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  }
});

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  async login(){
    //this.props.navigation.navigate("App");
    const { type, token } = await 
    Expo.Facebook.logInWithReadPermissionsAsync("305115093422180", {
      permissions: ["public_profile","email","user_friends"],
    });
    if (type === "success") {
      global.accessToken = token;
      global.loggedIn = true;
      global.startRefresh();
      this.props.navigation.navigate("App");
    }
  }

  render() {
    return (
        <View style={styles.container}>
        <View style={styles.loginButton}>
           <Text>LOGIN</Text>
          <TouchableOpacity>
          <Icon
           onPress={() => this.login()}
           name={Platform.OS === "ios"
            ? "ios-log-in"
            : "md-log-in"}
            size={50}
            />
          </TouchableOpacity>
          </View>
        </View>
    );
  }
}