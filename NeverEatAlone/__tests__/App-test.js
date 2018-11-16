import 'react-native';
import React from 'react';
import App from '../App';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View, Platform
  } from "react-native";
import { Agenda } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";
import LoginScreen from '../screens/LoginScreen';
import FriendTab from '../screens/FriendTab';
import CalTab from '../screens/CalTab';
import MainTabNavigator from '../navigation/MainTabNavigator';
import SettingsTab from '../screens/SettingsTab';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import {shallow, mount, render} from 'enzyme';
import * as enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
//import Adapter from 'enzyme-adapter-react-15';
//import Adapter from 'enzyme-adapter-react-16.3';

enzyme.configure( {adapter: new Adapter() } );

describe('App snapshot', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    //NavigationTestUtils.resetInternalState();
  });

  it('renders the login screen', async () => {
    const component = shallow(<LoginScreen/>);
    expect(component).toMatchSnapshot();
	
	expect(component.containsMatchingElement(
		<Icon name="ios-log-in" size={50}/>)
	).toBeTruthy();
	expect(component.containsMatchingElement(
		<Text>LOGIN</Text>)
	).toBeTruthy();
  });
  
  it('logs in with test user', async () => {
    var component = shallow(<LoginScreen/>);
	var btn = component.find('#login-button');
	
	btn.simulate('click');
    const landing = shallow(<FriendTab/>);
    expect(component).toMatchSnapshot();
  });
  
  it('navigates to FriendTab', async () => {
	  var friendsOnline = [
	  {
		  "id": "101",
		  "name": "Friend 1",
	  },
	  {
		  "id": "102",
		  "name": "Friend 2",
	  },
	  ];
	  var friendsBusy = [
	  {
		  "id": "103",
		  "name": "Friend 3",
	  },
	  {
		  "id": "104",
		  "name": "Friend 4",
	  },
	  ];
	const component = shallow(<FriendTab skipLoading/>);// friendsOnline={friendsOnline} friendsBusy={friendsBusy} />);
	console.log(component.debug());
    expect(component).toMatchSnapshot();
  });
  
  it('navigates to CalTab', async () => {
	const screen1 = shallow(<CalTab />);
	expect(screen1.containsMatchingElement(
        <TouchableOpacity>
          <Icon name="ios-cloud-upload"
            size={30}
          />
        </TouchableOpacity>)).toBeTruthy();
	expect(screen1.containsMatchingElement(
        <Agenda/>)).toBeTruthy();
	expect(screen1.containsMatchingElement(
        <TouchableOpacity>
          <Icon name="ios-add-circle-outline"
            size={30}
          />
        </TouchableOpacity>)).toBeTruthy();
	screen1.find("#add-event").simulate("click");
	
	var now = new Date();
	var later = new Date(now);
	now.setMinutes(0);
	later.setMinutes(0);
	later.setHours(later.getHours()+1);
	var editingEvent = {
		"title": "New event",
		"start": now,
		"end": later,
	};
	const screen2 = shallow(<CalTab screen={2} editingEvent={editingEvent}/>);
	expect(screen2.containsMatchingElement(
		<TouchableOpacity>
		  <Icon name="ios-arrow-dropleft" size={30}/>
		</TouchableOpacity>)).toBeTruthy();
	
	screen2.find("#save-event").simulate("click");
	
	expect(screen1.containsMatchingElement(
        <TouchableOpacity>
          <Icon name="ios-cloud-upload"
            size={30}
          />
        </TouchableOpacity>)).toBeTruthy();
	expect(screen1.containsMatchingElement(
        <Agenda/>)).toBeTruthy();
	expect(screen1.containsMatchingElement(
        <TouchableOpacity>
          <Icon name="ios-add-circle-outline"
            size={30}
          />
        </TouchableOpacity>)).toBeTruthy();
	
	});
	
  it('navigates to SettingsTab and logs out', async () => {
	const component = shallow(<SettingsTab />);
    expect(component).toMatchSnapshot();
	
	component.find("#logout-button").simulate("click");
	
	const login = shallow(<LoginScreen />);
    expect(login).toMatchSnapshot();
  });
});
