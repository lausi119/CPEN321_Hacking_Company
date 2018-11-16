import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import Geolocation from "react-native-geolocation-service";
import ReactObserver from 'react-event-observer';
global.observer = ReactObserver();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default class App extends React.Component {
  constructor(props){
    super(props);
    global.finishedLoading = false;
  }
  state = {
    isLoadingComplete: false,
    hasLocationPermission: false,
    refreshInterval: null,
  };
  
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
          global.userInfo['id'] = responseData.id;
        }).catch((error) => {
          alert(error);
        });
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
  addUpdateUser(data){
    var id = data.id;
    var name = data.name;
    var email = data.email;
    var coords = data.location;
    var friendIds = data.friends.map((friend) => {
      return friend.id;
    }); 
    var body = JSON.stringify({
      "user": {
        "id": id,
        "name": name,
        "email": email,
        "coordinates": coords,
        "friends": friendIds,
      }
    });
    fetch("https://nevereatalone321.herokuapp.com/addUser", 
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: body,
      })
        .then((response) => {return response.text();})
        .then((responseData) => {
          //alert(responseData);
        }).catch((error) => {
          alert(error);
      });
      return 0;
  }
  uploadPosition(){
    if(!global.userInfo.id || !global.userInfo.location || !global.userInfo.location.lat){
      return;
    }
    var body = JSON.stringify({
      id: global.userInfo.id,
      location: global.userInfo.location,
    });
    alert(body);
    fetch(`https://nevereatalone321.herokuapp.com/updateLocation`, 
    {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then(response => {return response.text();})
      .then((responseData) => {
        alert(responseData);
      }).catch((error) => {
        alert(error);
      });

  }
  getPosition(data,callback){
    Geolocation.getCurrentPosition(
      (position) => {
        if(!global.userInfo){
          return;
        }
        var location = {
          "lat": position.coords.latitude,
          "long": position.coords.longitude,
        };
        global.userInfo['location'] = location;
        //uploadPosition(data.id,location);
        data['location'] = location;
        global.finishedLoading = true;
        callback(data);
      },
      (error) => {
        var location = {
          "lat": "",
          "long": ""
        };
        data['location'] = location;
        global.userInfo['location'] = location;
        callback(data);
        global.finishedLoading = true;
        //console.log(error.message);
      },
      { enableHighAccuracy: true, 
        timeout: 15000, maximumAge: 10000}
    );
  }
  
  refreshFriends(){
    
    if(global.userInfo.accessToken){
      fetch(`https://graph.facebook.com/me?fields=id,name,friends,picture&access_token=${global.userInfo.accessToken}`, 
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {return response.json();})
        .then((responseData) => {
          global.userInfo['id'] = responseData.id;
          global.userInfo['name'] = responseData.name;
          //this.getHashedId(responseData.id);
          global.userInfo['photoUrl'] = responseData.picture.data.url;
              
          global.userInfo['email'] = responseData.email;
          var friends = this.parseFriends(responseData.friends.data);
          global.userInfo['friends'] = friends;
          global.observer.publish('updateFriends', friends);

          var data = {
            id: responseData.id,
            name: responseData.name,
            email: responseData.email,
            friends: friends,
          };
          this.getPosition(data,this.addUpdateUser.bind(this));
        }).catch((error) => {
          alert(error);
        });
    }
    return 0;
  }
  refreshAll(){
    var refreshFriends = this.refreshFriends.bind(this);
    refreshFriends();
    return 0;
  }
  startRefresh() {
    var refreshAll = this.refreshAll.bind(this);
    refreshAll();
    this.state.refreshInterval = 
      setInterval(refreshAll,60*1000);
  }
  stopRefresh() {
    clearInterval(this.state.refreshInterval);
  }
  componentDidMount(){
    global.startRefresh = this.startRefresh.bind(this);
    global.stopRefresh = this.stopRefresh.bind(this);
  }
  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/images/robot-dev.png"),
        require("./assets/images/robot-prod.png"),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
      }),
    ]);
  };

  _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    //console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
