import React from 'react';
import { View,ScrollView, StyleSheet, Text, ListView,
  TouchableOpacity} from 'react-native';
    
export default class FriendListScreen extends React.Component {

    constructor(props) {
        super(props);
        this.selectFriend = props.selectFriend;

        this.state = props.state;
      }

    render(){
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
                onPress={this.selectFriend(item)}>
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
                onPress={this.selectFriend(item)}>
                <Text style={styles.text}>
                    {item.name}
                </Text>
                </TouchableOpacity>
            ))
            }
        </View>
        </ScrollView>);
    }
}
const styles = StyleSheet.create({
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
    text: {
      fontSize: 26,
      color: '#4f603c'
    },
    container: {
      flex: 1,
      paddingTop: 15,
      backgroundColor: '#fff',
    },
});