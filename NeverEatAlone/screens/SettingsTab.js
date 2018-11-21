import React from "react";
import{
  Image,
  ScrollView,StyleSheet,
  Text,TouchableOpacity,
  View, Button,
  Platform, Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API } from 'react-native-dotenv';

const styles = StyleSheet.create({
  icon: {
    marginLeft: 10,
    marginTop: 5,
  },
  text: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 25,
    color: "#000",
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    height: 50,
    backgroundColor: "#fff"
  },
  headline:{
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    bottom: 0,
    padding: 10,
    fontWeight: "bold"
  },
  listItem:{
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#356DA1",
    backgroundColor: "#fff",
    height: 55,
    paddingLeft: 10
  },
});

export default class SettingsTab extends React.Component {
  navigation = {}
  constructor(props){
    super(props);
    this.navigation = props.navigation;
  }
  static navigationOptions = {
    header: null,
  };

  logout(){
    global.userInfo = null,
    global.finishedLoading = false;
    global.stopRefresh();
    global.loggedIn = false;
    this.props.navigation.navigate("Auth");
  }

  deleteAccount(){
    var del = () => {
      fetch(API + "deleteAccount", {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "id": global.userInfo.id,
        }),
      }
      ).then((response) => {
        alert(response.text());
        (this.logout.bind(this))();
      })
      .catch((err) => {
        alert("Account could not be deleted: " + err);
      });
    };
    Alert.alert(
      title='Delete your account from NeverEatAlone?',
      message="You can always log back in to reinstate your account",
      buttons=[
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: del.bind(this)},
      ],
      options={cancelable: false}
  );
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headline}
        >Settings</Text>
      </View>
      <View style={styles.container}>
        <ScrollView>
          <TouchableOpacity id="logout-button"
            style={styles.listItem}
            onPress={this.logout.bind(this)}>
            <Text style={styles.text}
            >Logout</Text> 
            <Icon style={styles.icon}
            name={Platform.OS === "ios"
            ? "ios-log-out"
            : "md-log-out"}
              size={35}
            />
          </TouchableOpacity>
          <TouchableOpacity id="delete-button" style={styles.listItem}
            onPress={this.deleteAccount.bind(this)}>
          <Text style={styles.text} color="red">Delete account</Text>
          <Icon style={styles.icon}
            color="red"
            name={Platform.OS === "ios"
            ? "ios-trash"
            : "md-trash"}
              size={35}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>;
  }
}