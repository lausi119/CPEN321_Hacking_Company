import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Icon from "react-native-vector-icons/Ionicons";
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class CalTab extends React.Component {
  static navigationOptions = {
    title: "Calendar",
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tabBarInfoContainer}>
          <Touchable
            background={Touchable.Ripple('#ccc', false)}
            onPress={this._handlePressDocs}>
          <Icon size={40}
            color="black"
            name={
             Platform.OS === 'ios'
            ? 'ios-download'
            : 'md-download' 
          }/>
          </Touchable>
          <Touchable
            background={Touchable.Ripple('#ccc', false)}
            onPress={this._handlePressDocs}>
          
          <Icon size={40}
            color="black"
            name={
            Platform.OS === 'ios'
            ? 'ios-create'
            : 'md-create' 
          }/>
          </Touchable>
        </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          
        </ScrollView>
      </View>
    );
  }

  _upload = () => {
    var r;
  };
}

const styles = StyleSheet.create({
  bottomBar:{
    position: "absolute",
    bottom: -40,
    height: 70,
    flex: 1,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#fbfbfb',
  },
  
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
});
