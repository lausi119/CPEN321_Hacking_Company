import React from 'react';
import { View,ScrollView, StyleSheet, Text, ListView,
  TouchableOpacity} from 'react-native';
import FriendListScreen from './FriendListScreen';
import FriendOptionsScreen from './FriendOptionsScreen';
import { ExpoLinksView } from '@expo/samples';

export default class FriendTab extends React.Component {

  static navigationOptions = {
    title: 'Friends',
  };
  selectedFriend = {};
  chooseFriend(item){
    this.selectedFriend = item;
    this.state.screen = 2;
  }
  state = {
    screen: 1, //1: FriendList, 2: FriendOptions
    friendsOnline: [
      {
        id: 0,
        name: "Harsh",
        distance: 5,
      },
      {
        id: 1,
        name: "Laurenz",
        distance: 15,
      },
      {
        id: 3,
        name: "Joe",
        distance: 15,
      },
      {
        id: 4,
        name: "Sally",
        distance: 15,
      },
      {
        id: 5,
        name: "Chris",
        distance: 15,
      },
      {
        id: 6,
        name: "Susan",
        distance: 15,
      },
      {
        id: 7,
        name: "Peter",
        distance: 15,
      },
    ],
    friendsBusy: [
      {
        id: 2,
        name: "Matt",
        distance: 2,
      },
    ]
  }

  render() {
    if(this.state.screen == 1){
      return (
      <ScrollView style={styles.container}>
      {/* Go ahead and delete ExpoLinksView and replace it with your
          * content, we just wanted to provide you with some helpful links */}
      <Text style={styles.h2}>Available Nearby</Text>
      <View>
          {
            this.state.friendsOnline.map((item,index) => (
              <TouchableOpacity
              key={item.id}
              style={styles.friend}
              onPress={this.chooseFriend(item)}>
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
              onPress={this.chooseFriend(item)}>
              <Text style={styles.text}>
                  {item.name}
              </Text>
              </TouchableOpacity>
          ))
          }
      </View>
      </ScrollView>);
    }
    else{
      return <FriendOptionsScreen
        friend={this.selectedFriend}
      />;
    }
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 26,
    color: '#4f603c'
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  h2: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    marginBottom: 7,
    fontSize: 26,
    backgroundColor: "#fff",
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
});
