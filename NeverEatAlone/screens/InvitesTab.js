import React from "react";
import{
  Alert,
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
  infoBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 2,
      borderColor: "#356DA1"
  },
  rApostrophe: {
    paddingLeft: 15,
    fontSize: 40,
    color: "#013567",
    textAlign: "right"
  },
  lApostrophe: {
    paddingLeft: 15,
    fontSize: 40,
    color: "#013567",
    textAlign: "left"
  },
  text: {
    padding: 10,
    fontSize: 20,
  },
  messageContainer: {
      borderRadius: 20,
      borderWidth: 5,
      borderColor: "#013567",
    marginLeft: 10,
    marginRight: 10,
  },
  message: {
    padding: 15,
    fontSize: 15,
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
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 36,
    color: "#34526E",
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
            {
                key: 0,
                friendId: "100",
                friendName: "Harsh Arora",
                venueName: "McDonalds",
                coords: {
                    "lat": 49.268429,
                    "long": -123.168485
                },
                "message": `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `
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
            }
        ],
        finishedLoading: true,
      };
      if(props.screen){
          this.state.screen = props.screen;
      }
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
      if(distance < 0){
          return "";
      }
      else if(distance < 1){
          return "less than 1 km";
      }
      else{
          distance = Math.round(distance);
          return `${distance} km`;
      }
  }
  locationDifference(loc2){
    if(!global.userInfo){
        return -1;
    }
    var loc1 = global.userInfo.location;
    if(!loc1){
        return -1;
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

  clearAll(){
    var clear = () => {
        this.setState((previousState) => {
            var newState = previousState;
            newState.invites = [];
            newState.selectedInvite = {};
            return {newState};
        });
    };
    Alert.alert(
        title='Clear all invites?',
        message="",
        buttons=[
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: clear.bind(this)},
        ],
        options={cancelable: false}
    );
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

  renderMessage(msg){
    if(!msg || msg.trim().length != 0){
        return <View style={styles.infoBox}>
                    <View>
                        <Text style={styles.lApostrophe}>&ldquo;</Text>
                        <View style={styles.messageContainer}>
                            <Text style={styles.message}>{msg}</Text>
                        </View>
                        <Text style={styles.rApostrophe}>&rdquo;</Text>
                    </View>
                </View>;
    }
    else{
        return <View/>;
    }
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
                    <Text style={{color:"#006C8D",paddingRight:15}}>{this.truncDistance(this.locationDifference(item.coords))}</Text>
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
                <Text>{"\t"}</Text>
                <Text style={styles.headline}
                >Invites</Text>
                <TouchableOpacity
                    id="clear-all"
                    style={{flexDirection:"row"}}
                    onPress={this.clearAll.bind(this)}>
                    <Icon style={styles.icon}
                        name={Platform.OS === "ios"
                    ? "ios-trash"
                    : "md-trash"}/>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <ScrollView id="invite-list">
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
                <Icon id="back-button"
                    onPress={this.resetScreen.bind(this)}
                    style={styles.icon}
                    name = {Platform.OS === "ios"
                    ? "ios-arrow-dropleft"
                    : "md-arrow-dropleft"}
                />
                <Text style={styles.headline}>{this.state.selectedInvite.friendName}</Text>
                <Text>{"\t\t"}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.infoBox}/>
                <View style={styles.infoBox}>
                    <View>
                        <Text style={{padding: 8,fontSize:12}}>wants to meet at</Text>
                        <Text style={styles.text}>{this.state.selectedInvite.venueName}</Text>
                    </View>
                    <Text style={styles.text}>{this.truncDistance(this.locationDifference(this.state.selectedInvite.coords))}</Text>
                </View>
                {this.renderMessage(this.state.selectedInvite.message)}
                <View style={{margin:20,flexDirection:"row",justifyContent:"space-around"}}>
                <TouchableOpacity id="accept" onPress={this.accept.bind(this)} style={styles.acceptButton}>
                    <Text style={{padding:10,color:"#035C76"}}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity id="decline" onPress={this.decline.bind(this)} style={styles.declineButton}>
                    <Text style={{padding:10,color:"#9B0000"}}>Decline</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    }
  }
}