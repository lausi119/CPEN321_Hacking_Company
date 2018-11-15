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
  constructor(props){
    super(props);
    this.loggingIn = false;
  }
  static navigationOptions = {
    header: null,
  };

  async login(){
    global.userInfo = {
      'accessToken': '',
      'friends': [],
    };
    // Uncomment this line only when testing app without login. Comment everything below out if you do
    //this.props.navigation.navigate("App");
    const { type, token } = await 
    Expo.Facebook.logInWithReadPermissionsAsync("305115093422180", {
      permissions: ["public_profile","email","user_friends"],
    });
    if (type === "success") {
      global.userInfo = {
        'accessToken': token,
      };
      global.loggedIn = true;
      global.startRefresh();
      this.loggingIn = true;
      this.props.navigation.navigate("App");
      this.loggingIn = false;
    }
  } 

  render() {
    if(this.loggingIn){
      return <View style={styles.loading}>
        <ActivityIndicator
          color="#000"
          size="large"
      />
      </View>;
    }
    else {
      return (
        <View style={styles.container}>
        <View style={styles.loginButton}>
           <Text>LOGIN</Text>
          <TouchableOpacity
           id="login-button"
           onPress={() => this.login()}>
          <Icon
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
}