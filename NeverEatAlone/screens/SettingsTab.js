import React from "react";
import{
  Image,
  ScrollView,StyleSheet,
  Text,TouchableOpacity,
  View, Button,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const styles = StyleSheet.create({
  icon: {
    marginLeft: 10,
    marginTop: 5,
  },
  text: {
    paddingLeft: 10,
    paddingTop: 10,
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
  listItemA:{
    flex: 1,
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "black",
    backgroundColor: "#cccccc",
    height: 35,
    paddingLeft: 10
  },
  listItemB:{
    flex: 1,
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "black",
    backgroundColor: "#eeeeee",
    height: 35,
    paddingLeft: 10
  }
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
    global.stopRefresh();
    global.loggedIn = false;
    this.props.navigation.navigate("Auth");
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
          <View style={styles.listItemA}>
          <Text>{global.id}</Text>
          </View>
          <TouchableOpacity style={styles.listItemB}
            onPress={this.logout.bind(this)}>
            <Text style={styles.text}
            >LOGOUT</Text>
            <Icon style={styles.icon}
            name={Platform.OS === "ios"
            ? "ios-log-out"
            : "md-log-out"}
              size={25}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>;
  }
}