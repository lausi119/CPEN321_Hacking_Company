import React from "react";
import{
  Alert, Image,
  ScrollView,StyleSheet,
  Text,TouchableOpacity,
  View, Button,
  Platform, ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {API} from "react-native-dotenv";

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
        finishedLoading: true,
      };
      
      if(props.screen){
          this.state.screen = props.screen;
      }
      var updateInvites = function(){
        this.forceUpdate();
      }.bind(this);

      this.invitesListener = global.observer.subscribe('invites', updateInvites);
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
    if(isNaN(distance) || distance < 0){
        return "";
    }
    else if(distance < 1){
        distance = Math.round(1000*distance);
        return `${distance} meters away`;
    }
    else{
        distance = Math.round(distance);
        return `${distance} km away`;
    }
  }
  locationDifference(loc2){
    if(!global.userInfo || !loc2){
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
            global.userInfo.invites = [];
            newState.selectedInvite = {};
            return {newState};
        });
    };
    var len = global.userInfo.invites.length;
    Alert.alert(
        title=`Clear all ${len} invite${len != 1 ? "s" : ""}?`,
        message="",
        buttons=[
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: clear.bind(this)},
        ],
        options={cancelable: false}
    );
  }

  accept(){
    for(var i = 0; i < global.userInfo.invites.length; i++){
        if(this.state.selectedInvite.key == global.userInfo.invites[i].key){
            if(global.userInfo.invites[i].accpepted){
                this.resetScreen();
                return;
            }
            global.userInfo.invites[i].accepted = true;
            break;
        }
    }
    this.resetScreen();

    var body =  JSON.stringify({
        id1: global.userInfo.id,
        id2: this.state.selectedInvite.id,
        data: {
          response: true,
          accept: true,
          id: global.userInfo.id,
          friendName: global.userInfo.name,
        }
    });
    fetch(API + `sendInvite`,
    {
      method:"POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    })
    .then((response) => {return response.json();})
    .then((responseData) => {
    })
    .catch((err) =>{
      alert('get calendar error');
      alert(err);
    });
  }

  decline(){
    var body =  JSON.stringify({
        id1: global.userInfo.id,
        id2: this.state.selectedInvite.id,
        data: {
          response: true,
          accept: false,
          id: global.userInfo.id,
          friendName: global.userInfo.name,
        }
    });
    fetch(API + `sendInvite`,
    {
      method:"POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    })
    .then((response) => {return response.json();})
    .then((responseData) => {
    })
    .catch((err) =>{
      alert('get calendar error');
      alert(err);
    });

    for(var i = 0; i < global.userInfo.invites.length; i++){
        if(this.state.selectedInvite.key == global.userInfo.invites[i].key){
            global.userInfo.invites.splice(i,1);
            break;
        }
    }
    this.resetScreen();
  }

  renderMessage(msg){
    if(msg && msg.trim().length != 0){
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

  componentWillUnmount(){
      this.invitesListener.unsubscribe();
  }

  renderInvite(item){
    return (
        <TouchableOpacity onPress={() => this.selectInvite(item)} key={item.key} style={styles.inviteBox}>
            <View style={{paddingLeft:15,paddingRight:15}}>
                {item.venueImage.length > 0
                    ?<Image source={{uri: item.venueImage}}
                        style={{width: 50, height: 50, marginRight: 12}}/>
                    :<Icon name={Platform.OS === "ios" ?
                        "ios-person" : "md-person"} size={50}/>
                }
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
                    global.userInfo.invites.map((item,index) => (
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
                {this.state.selectedInvite.venueName
                ?<View style={styles.infoBox}>
                    <View>
                        <Text style={{padding: 8,fontSize:12}}>wants to meet at</Text>
                        <Text style={styles.text}>{this.state.selectedInvite.venueName}</Text>
                        <Text style={styles.text}>{this.truncDistance(this.locationDifference(this.state.selectedInvite.coords))}</Text>
                    </View>
                    <View>
                        <Image source={{uri: this.state.selectedInvite.venueImage}}
                        style={{width: 80, height: 80, marginRight: 12}}/>
                    </View>
                </View>
                :<View/>
                }
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