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
  "column":{
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  "row":{
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "inviteBox": {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#ccc",
    height: 67,
    backgroundColor: "white",
  },
  "acceptButton":{
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#035C76",
  },
  "declineButton": {
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#9B0000",
  },
  icon: {
    padding: 4,
    fontSize: 36,
    color: "#4f603c",
  },
});

export default class InvitesTab extends React.Component {
  navigation = {}
  constructor(props){
    super(props);
    this.state = {
        /** Screen state
         * 1: List of invites
         * 2: Opened invite
         */
        screen: 1,
        selectedInvite: {},
        invites: [
            /*{
                key: 0,
                friendId: "100",
                friendName: "Harsh Arora",
                venueName: "McDonalds",
                coords: {
                    "lat": 49.274540,
                    "long": -123.250165
                },
                "message": "Really long messageReally long messageReally long messageReally long messageReally long messageReally long messageReally long messageReally long message"
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
                "message": "   "
            }*/
        ],
        finishedLoading: true,
      };
  }
  static navigationOptions = {
    header: null,
  };
  truncText(text){
    text = text.trim();
    if(text.length == 0){
        return text;
    }
    if(text.length > 41){
        return '"' + text.substring(0,38) + "..." + '"';
    }
    return '"' + text + '"';
  }
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
        return 50;
    }
    var x = Math.abs(loc1.lat-loc2.lat);
    var y = Math.abs(loc1.long-loc2.long);
    y *= 111.320*Math.cos((loc2.lat+loc1.lat)/2);
    x *= 110.574;
    return Math.sqrt(x*x+y*y);
  }
  
  resetScreen(){
    this.setState((previousState) => {
      var newState = previousState;
      newState.screen = 1;
      return {newState};
    });
  }

  selectInvite(invite){
    this.setState((previousState) => {
      var newState = previousState;
      newState.screen = 2;
      newState.selectedInvite = invite;
      return {newState};
    });
  }

  accept(){
    for(var i = 0; i < this.state.invites.length; i++){
        if(this.state.selectedInvite.key == this.state.invites[i].key){
            this.state.invites[i].accepted = true;
            break;
        }
    }
    this.resetScreen();
  }

  decline(){
    for(var i = 0; i < this.state.invites.length; i++){
        if(this.state.selectedInvite.key == this.state.invites[i].key){
            this.state.invites.splice(i,1);
            break;
        }
    }
    this.resetScreen();
  }

  renderInvite(item){
    return (
        <TouchableOpacity onPress={() => this.selectInvite(item)} key={item.key} style={styles.inviteBox}>
            <View style={{paddingLeft:15,paddingRight:15}}>
                <Icon name="ios-car" size={50}/>
            </View>
            <View style={styles.column}>
                <View style={{flexDirection:"row"}}>
                    <Text style={{color:"#003E50",fontSize:20,alignSelf:"baseline"}}>{item.friendName}</Text>
                    <Icon name={Platform.OS === "ios"
                        ? "ios-checkmark-circle"
                        : "md-checkmark-circle"} color="green" style={item.accepted ? {"display":"flex"}:{"display":"none"}}/>
                </View>
                <View style={styles.row}>
                    <Text style={{color:"#006C8D"}}>{item.venueName}</Text>
                    <Text style={{color:"#006C8D",paddingRight:15}}>{this.truncDistance(this.locationDifference(global.userInfo.location, item.coords))}</Text>
                </View>
                <View>
                    <Text style={{color:"#006C8D",paddingBottom:5}}>{this.truncText(item.message)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
  }

  render() {
    if(this.state.screen == 1){
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
    else{
        return <View style={styles.container}>
            <View style={styles.header}>
                <Icon 
                    onPress={this.resetScreen.bind(this)}
                    style={styles.icon}
                    name = {Platform.OS === "ios"
                    ? "ios-arrow-dropleft"
                    : "md-arrow-dropleft"}
                />
                <Text style={styles.headline}>{this.state.selectedInvite.friendName}</Text>
            </View>
            <View style={styles.container}>
                <Text>{this.state.selectedInvite.venueName}</Text>
                <Text>{this.state.selectedInvite.message}</Text>
                <View style={{margin:20,flexDirection:"row",justifyContent:"space-around"}}>
                <TouchableOpacity onPress={this.accept.bind(this)} style={styles.acceptButton}>
                    <Text style={{padding:10,color:"#035C76"}}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.decline.bind(this)} style={styles.declineButton}>
                    <Text style={{padding:10,color:"#9B0000"}}>Decline</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    }
  }
}