import React from "react";
import { View,ScrollView, StyleSheet, Text, ListView,
  TouchableOpacity,
  ActivityIndicator} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ExpoLinksView } from "@expo/samples";
import { Platform } from "react-native";


const styles = StyleSheet.create({
  text: {
    fontSize: 26,
    color: "#4f603c",
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  headline:{
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    bottom: 0,
    padding: 10,
    fontWeight: "bold"
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    height: 50,
    backgroundColor: "#fff"
  },
  green: {
    backgroundColor: "green",
  },
  red: {
    backgroundColor: "red",
  },
  h2: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    marginBottom: 7,
    fontSize: 26,
    backgroundColor: "#fff",
  },
  circle: {
    marginTop: 17,
    marginRight: 25,
    width: 15,
    height: 15,
    borderRadius: 14,
  },
  friend: {
    borderRadius: 14,
    borderColor: "#000",
    borderWidth: 0.5,
    paddingLeft: 8,
    marginLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  menuOption: {
    flexDirection: "row",
    borderRadius: 14,
    borderColor: "#000",
    borderWidth: 0.5,
    paddingLeft: 8,
    marginLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
  },
  icon: {
    padding: 4,
    fontSize: 36,
    color: "#4f603c"
  },
});

export default class FriendTab extends React.Component {

  constructor(props){
    super(props);
    this.refreshFriends(true);
    setInterval(this.refreshFriends.bind(this), 60000);
    this.state = {
      /*
      1: FriendList
      2: Venue type options
      3: Venue select
      */
      screen: 1, 
      friendsOnline:[],
      friendsBusy:[],
      finishedLoading: true,
      title: "Friends",
      selectedFriend: {
      },
    };
  }
  parseFriends(data){
    for(var i = 0; i < data.length; i++){
      var friend = data[i];
      var n = friend.name.indexOf(" ");
      if(n > 0){
      data[i]["firstName"] = friend.name.substring(0,n);
      }
      else{
        data[i]["firstName"] = friend.name;
      }
    }
    return data;
  }
  locationDifference(loc1,loc2){
    return Math.sqrt(Math.abs(loc1.lat-loc2.lat),
      Math.abs(loc1.long-loc2.long));
  }
  getHashedId(myId){
    fetch("https://nevereatalone321.herokuapp.com/idHash", 
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "id": myId,
        }),
      })
        .then((response) => {return response.json();})
        .then((responseData) => {
          global.id = responseData.id;
        }).catch((error) => {
          alert(error);
        });
  }
  async refreshFriends(first=false){
    if(global.accessToken){
      fetch(`https://graph.facebook.com/me?fields=id,name,friends&access_token=${global.accessToken}`, 
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {return response.json();})
        .then((responseData) => {
          global.name = responseData.name;
          this.getHashedId(responseData.id);
          
          global.email = responseData.email;
          this.setState((previousState)  => {
            var newState = previousState;
            newState.friendsOnline = this.parseFriends(responseData.friends.data);
            return {newState};
          });
        }).catch((error) => {
          alert(error);
        });

        //Poll server for friends" location
        /*fetch(`https://nevereatalone321.herokuapp.com/friendslocation`, 
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then(response => {return response.json();})
          .then((responseData) => {
            this.setState(previousState  => {
              newState = this.state;
              for(var i = 0; i < responseData.friends.length; i++){
                for(var j = 0; j < newState.friendsOnline.length; j++){
                  if(newState.friendsOnline[j].id == responseData.friends[i].id){
                    newState.friendsOnline[j].distance = this.locationDifference(responseData.friends[i].location, global.location);
                  }
                }
              }
              return {newState};
            });
          }).catch((error) => {
            alert(error);
          });*/
    }
  }
  static navigationOptions = {
    header: null,
  };
  chooseVenueType(type){
    //yelp.api.call??
    this.setState((previousState) => {
      var newState = previousState;
      newState.screen = 3;
      newState.finishedLoading = false;
      return {newState};
    });
  }
  chooseFriend(item, online){
    item["online"] = online;
    this.setState((previousState) => {
      var newState = previousState;
      newState.screen = 2;
      newState.selectedFriend = item;
      return {newState};
    });
  }
  reset(){
    this.setState((previousState) => {
      var newState = previousState;
      newState.screen = 1;
      newState.selectedFriend = {};
      return {newState};
    });
  }

  waiting(){
    if(this.state.finishedLoading){
      return <ActivityIndicator
        size="large"
        color="#000"
      />;
    }
  }

  render() {
    //CHOOSE TYPE OF VENUE/MESSAGE
    if(this.state.screen === 2){
      return (<View style={styles.container}>
      <View style={styles.header}>
      <Icon 
        onPress={this.reset.bind(this)}
        style={styles.icon}
        name = {Platform.OS === "ios"
          ? "ios-arrow-dropleft"
          : "md-arrow-dropleft"}
      />
        <Text style={styles.headline}
        >{this.state.selectedFriend.firstName}</Text>
        <View style={[
          this.state.selectedFriend.online ?
          styles.green: styles.red,
          styles.circle]}/>
      </View>
        <View>
        <TouchableOpacity style={styles.menuOption}
        onPress={() => this.chooseVenueType("Restaurant")}>
        <Icon name={Platform.OS === "ios"
        ? "ios-restaurant"
        : "md-restaurant"}
        size={40}/>
        <Text style={styles.text}>
          Restaurants
        </Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuOption}
        onPress={() => this.chooseVenueType("Cafe")}>
        <Icon name={Platform.OS === "ios"
        ? "ios-cafe"
        : "md-cafe"}
        size={40}/>
        <Text style={styles.text}>
          Cafes
        </Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuOption}
        onPress={() => this.chooseVenueType("Bar")}
        ><Icon name={Platform.OS === "ios"
        ? "ios-wine"
        : "md-wine"}
        size={40}/>
        <Text style={styles.text}>
          Bars
        </Text></TouchableOpacity>
        </View>
      </View>);
    }
    //CHOOSE VENUE
    else if(this.state.screen === 3){
      return (
        <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            onPress={() => this.chooseFriend(this.state.selectedFriend,this.state.selectedFriend.online)}
            style={styles.icon}
            name = {Platform.OS === "ios"
              ? "ios-arrow-dropleft"
              : "md-arrow-dropleft"}
          />
        <Text style={styles.headline}
        >{this.state.selectedFriend.firstName}</Text>
        <View style={[
          this.state.selectedFriend.online ?
          styles.green: styles.red,
          styles.circle]}/>
      </View>
        <View style={styles.container}>
        {this.waiting()}
        </View>
        </View>
      );
    }
    //FRIEND LIST
    else {
      return (
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headline}
        >Friends</Text>
      </View>
      <ScrollView style={styles.container}>
      <Text style={styles.h2}>{this.state.selectedFriend.id}</Text>
      {/* Go ahead and delete ExpoLinksView and replace it with your
          * content, we just wanted to provide you with some helpful links */}
      <Text style={styles.h2}>Available Nearby</Text>
      <View>
          {
            this.state.friendsOnline.map((item,index) => (
              <TouchableOpacity
              key={item.id}
              style={styles.friend}
              onPress={() => this.chooseFriend(item,true)}>
              <Text style={styles.text}>
                  {item.name}
              </Text>
              </TouchableOpacity>
          ))
          }
      </View>
      <Text style={styles.h2}>Busy Nearby</Text>
      <View>
          {
            this.state.friendsBusy.map((item,index) => (
              <TouchableOpacity
              key={item.id}
              style={styles.friend}
              onPress={() => this.chooseFriend(item,false)}>
              <Text style={styles.text}>
                  {item.name}
              </Text>
              </TouchableOpacity>
          ))
          }
      </View>
      </ScrollView>
      </View>);
    }
  }
}