import React from "react";
import {
    Image, ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View, Platform
  } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {FB_APP_ID} from "react-native-dotenv";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#3b5999",
    borderRadius: 4,
  },
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
    // Uncomment this line only when testing app without login.
    // Comment everything below out if you do
    //this.props.navigation.navigate("App");
    const { type, token } = await 
    Expo.Facebook.logInWithReadPermissionsAsync(FB_APP_ID, {
      permissions: ["public_profile","email","user_friends"],
    });
    if (type === "success") {
      global.userInfo = {
        'accessToken': token,
        'radius': 15,
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
      return <View>
        <ActivityIndicator
          color="#000"
          size="large"
      />
      </View>;
    }
    else {
      return (
        <View style={styles.container}>
        <Image style={{marginBottom: 100}}
          source={require('../logo.png')}/>
        <TouchableOpacity style={styles.loginButton}
          id="login-button"
          onPress={this.login.bind(this)}>>
          <Image style={{margin: 8}}source={require('../fb.jpg')}/>
          <Text style={{ margin: 8,color:"white"}}>LOGIN THROUGH FACEBOOK</Text>
        </TouchableOpacity>
        </View>
      );
    }
  }
}