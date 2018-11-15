import React from "react";
import{
  Image,
  ScrollView,StyleSheet,
  Text,TouchableOpacity,
  View, Button,
  Platform, ActivityIndicator
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
  "inviteBox": {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#ccc",
    height: 40,
    backgroundColor: "#aaa",
  },
});

export default class InvitesTab extends React.Component {
  navigation = {}
  constructor(props){
    super(props);
    this.state = {
        invites: [
            {
                key: 0,
                friendId: "100",
                friendName: "Harsh Arora",
                venueName: "McDonalds",
                coords: {
                    "lat": 49.274540,
                    "long": -123.250165
                },
                "Message": "Hey Matt wanna meet up and work at McD's?"
            },
            {
                key: 1,
                friendId: "100",
                coords: {
                    "lat": 49.266391,
                    "long": -123.245188
                },
                friendName: "Laurenz Schmielau",
                venueName: "Pacific Poke",
                "Message": ""
            }
        ],
        finishedLoading: true,
      };
  }
  static navigationOptions = {
    header: null,
  };
  truncDistance(distance){
      if(distance < 1){
          return "less than 1 km";
      }
      else{
          distance = Math.round(distance);
          return `${distance} km`;
      }
  }
  locationDifference(loc1,loc2){
    if(!loc1){
        return 0;
    }
    var x = Math.abs(loc1.lat-loc2.lat);
    var y = Math.abs(loc1.long-loc2.long);
    y *= 111.320*Math.cos((loc2.lat+loc1.lat)/2);
    x *= 110.574;
    return Math.sqrt(x*x+y*y);
  }

  renderInvite(item){
    return (
        <View key={item.key} style={styles.inviteBox}>
            <View>
                <Text>{item.friendName}</Text>
            </View>
            <View>
                <Text>{item.venueName}</Text>
                <Text>{this.truncDistance(this.locationDifference(global.userInfo.location, item.coords))}</Text>
            </View>
        </View>
    )
  }

  render() {
    return <View style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.headline}
            >Invites</Text>
        </View>
        <View style={styles.container}>
            <ScrollView>
            {
                this.state.invites.map((item,index) => (
                this.renderInvite(item)
            ))
            }
            </ScrollView>
        </View>
        </View>;
  }
}