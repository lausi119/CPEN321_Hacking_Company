import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Geolocation from 'react-native-geolocation-service';


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    hasLocationPermission: false,
    refreshInterval: null,
  };
  getPosition(){
    Geolocation.getCurrentPosition(
      (position) => {
        global.location = {
          "lat": position.coords.latitude,
          "long": position.coords.longitude,
        }
      },
      (error) => {
        console.log(error.message);
      },
      { enableHighAccuracy: true, 
        timeout: 15000, maximumAge: 10000}
    );
  }
  uploadPosition(){

  }
  refreshAll(){
    this.getPosition();
    this.uploadPosition();
  }
  startRefresh() {
    this.refreshAll();
    this.state.refreshInterval = 
      setInterval(this.refreshAll.bind(this),60*1000);
  };
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
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
    global.location = "null";
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
