import React from "react";
import { View,ScrollView, StyleSheet, Text, ListView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ExpoLinksView } from "@expo/samples";
import { Platform } from "react-native";
import ReactObserver from 'react-event-observer';
import { API } from 'react-native-dotenv';

const styles = StyleSheet.create({
  loading: {
    zIndex: 6,
    justifyContent: "center",
    position: "absolute",
    flex: 1,
    top: 0,
    bottom: 0,
    right:0 ,
    left: 0,
    opacity: 0.7,
    backgroundColor: "#b2b2b2"
  },
  button: {
    width: 75,
    borderWidth: 2,
    backgroundColor: "#084A89",
    borderColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
  textBox: {
    height: 140,
    padding: 5,
    margin: 5,
  },
  text: {
    fontSize: 26,
    color: "#000",
    paddingLeft: 10,
  },
  text2: {
    fontSize: 14,
    color: "#0E77DB",
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "#1BAEF5",
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
  h2Container: {
    borderBottomWidth: 2,
    marginBottom: 8,
    minHeight: 50,
    borderColor: "#fff",
    backgroundColor: "#0E77DB",
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
  },
  h2: {
    flex: 1,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 15,
    fontSize: 20,
    color: "#fff",
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
    borderColor: "#1BAEF5",
    borderWidth: 0.5,
    paddingLeft: 8,
    marginLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    flexDirection: "column",
    justifyContent: "space-between"
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
  messageContainer: {
    marginTop: 20,
    borderWidth: 3,
    borderRadius: 12,
    borderColor: "#084A89",
    marginLeft: 10,
    marginRight: 10,
  },
});

export default class FriendTab extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      /*
      1: FriendList
      2: Venue type options
      3: Venue select
      */
      screen: 1, 
      friends:[],
      venues: [],
      loading: true,
      finishedLoading: true,
      title: "Friends",
      message: "",
      selectedFriend: {
      },
    };
    var updateFriends = function(data){
      this.setState((previousState) => {
        var newState = previousState;
        newState.friends = data;
        return {newState};
      });
    }.bind(this);
    var finishLocation = function(){
      this.setState((previousState) => {
        var newState = previousState;
        newState.loading = false;
        return {newState};
      });
    }.bind(this);
    var updateStatuses = function(data){ 
      this.setState((previousState) => {
        var newState = previousState;
        for(var i = 0; i < data.length; i++){
          for(var j = 0; j < newState.friends.length; j++){
            if(data[i].id == newState.friends[j].id){
              newState.friends[j].status = data[i].status;
              break;
            }
          }
        }
        return {newState};
      });
    }.bind(this);
    var updateDistances = function(data){
      this.setState((previousState) => {
        var newState = previousState;
        for(var i = 0; i < data.length; i++){
          for(var j = 0; j < newState.friends.length; j++){
            if(data[i].id === newState.friends[j].id){
              newState.friends[j].distance = data[i].distance;
              break;
            }
          }
        }
        return {newState};
      });
    }.bind(this);
    this.listenerFriends = global.observer.subscribe('updateFriends',updateFriends);
    this.listenerDistances = global.observer.subscribe('updateDistances',updateDistances);
    this.listenerLocation = global.observer.subscribe('finishLocation',finishLocation);
    this.listenerStatuses = global.observer.subscribe('updateStatuses',updateStatuses);
  }
  locationDifference(loc1,loc2){
    return Math.sqrt(Math.abs(loc1.lat-loc2.lat),
      Math.abs(loc1.long-loc2.long));
  }
  static navigationOptions = {
    header: null,
  };

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

changeMessage(text){
  this.setState((previousState) => {
    var newState = previousState;
    newState.message = text;
    return {newState};
  })
}
  
  chooseVenueType(type){
    var radius = 1000*global.userInfo.radius;
    var url = API + `yelp?latitude=${global.userInfo.location.lat}&longitude=${global.userInfo.location.long}&radius=${radius}&term=${type}`;

    fetch(url, 
    {
      method: "GET",
    }
    ).then((response) => {return response.text()})
    .then((responseData) => {
      //alert((responseData)); 

    })
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
  resetScreen(){
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

  componentWillUnmount(){
    this.listenerDistances.unsubscribe();
    this.listenerFriends.unsubscribe();
    this.listenerLocation.unsubscribe();
    this.listenerStatuses.unsubscribe();
  }

  render() {
    //CHOOSE TYPE OF VENUE/MESSAGE
    if(this.state.screen === 2){
      return (<View style={styles.container}>
      <View style={styles.header}>
      <Icon 
        onPress={this.resetScreen.bind(this)}
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
        <Text style={styles.text2}>CHOOSE A VENUE</Text>
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
        <View style={styles.messageContainer}>
          <TextInput multiline maxLength={160}
            style={styles.textBox} placeholder="message..."
            onChangeText={(text) => this.changeMessage(text)}
            value={this.state.message}/>
        </View>
        <View>
            <Text style={styles.text2}>OR, JUST SEND MESSAGE</Text>
        </View>
        <View style={{alignItems:"center",justifyContent:"center"}}>
          <TouchableOpacity style={styles.button}>
            <Icon size={40} color="#fff"
            name={Platform.OS === "ios" 
            ? "ios-send"
            : "md-send"}/>
          </TouchableOpacity>
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
      {this.state.loading ? <View style={styles.loading}>
          <ActivityIndicator
            color="black"
            size="large"
        />
        </View>
        : <View/>}
      <View style={styles.header}>
        <Text style={styles.headline}
        >Friends</Text>
      </View>
      <ScrollView style={styles.container}>
      
      <View style={styles.h2Container}>
        <Text style={styles.h2}>AVAILABLE NEARBY</Text>
      </View>
      <View>
          {
            this.state.friends.filter((item) => !!item.status)
             .map((item,index) => (
              
              <TouchableOpacity
              style={{flexDirection:"row"}}
              key={item.id}
              style={styles.friend}
              onPress={() => this.chooseFriend(item,true)}>
              <View style={{flexDirection:"row",justifyContent:"space-between"}}>
              <Text style={styles.text}>
                  {item.name}
              </Text>
              <Text style={{margin:5}}>{this.truncDistance(item.distance)}</Text>
              </View>
              {/*<Text style={{margin:5}}>Free until {item.nextScheduleChange}</Text>*/}
              </TouchableOpacity>
              
          ))
          }
      </View>
      <View style={styles.h2Container}>
        <Text style={styles.h2}>BUSY NEARBY</Text>
      </View>
      <View>
          {
            this.state.friends.filter((item) => !item.status)
              .map((item,index) => (
              <TouchableOpacity
              style={{flexDirection:"row"}}
              key={item.id}
              style={styles.friend}
              onPress={() => this.chooseFriend(item,false)}>
              <View style={{flexDirection:"row",justifyContent:"space-between"}}>
              <Text style={styles.text}>
                  {item.name}
              </Text>
              <Text style={{margin:5}}>{this.truncDistance(item.distance)}</Text>
              </View>
              {/*<Text style={{margin:5}}>Busy until {item.nextScheduleChange}</Text>*/}
              </TouchableOpacity>
          ))
          }
      </View>
      </ScrollView>
      </View>);
    }
  }
}