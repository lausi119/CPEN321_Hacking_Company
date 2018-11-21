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
import InvitesTab from '../screens/InvitesTab';
import MainTabNavigator from '../navigation/MainTabNavigator';
import SettingsTab from '../screens/SettingsTab';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import {shallow, mount, render} from 'enzyme';
import * as enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

enzyme.configure( {adapter: new Adapter() } );

function simulateClick(component, index){
	var parent = component.parent().dive();
	var cmp;
	if(index){
		console.log('index', index);
		cmp = parent.children().at(index);
	}
	else{
		cmp = parent.find('#' + component.prop('id'));
	}
	try{
		/*console.log('success-start');
		console.log(component.debug());
		
		console.log(parent.debug());
		console.log(cmp.debug());
		console.log(component.prop('id'));
		console.log('success-end');*/
	}catch(err){
		(cmp.prop('onPress'))();
		console.log('fail-start');
		console.log(component.debug());
		
		console.log(parent.children());
		console.log(cmp.debug());
		console.log(component.prop('id'));
		console.log('fail-end');
	}
}

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
	simulateClick(component.find("#login-button"));
	
    const landing = shallow(<FriendTab/>);
    expect(component).toMatchSnapshot();
  });
  
  it('navigates to FriendTab', async () => {
	  var friendsOnline = [
	  {
		  "id": "102819017380267",
		  "name": "Steve Jobs",
	  },
	  {
		  "id": "101596347503975",
		  "name": "Mark Zuck",
	  },
	  ];
	  var friendsBusy = [
	  {
		  "id": "100030219080466",
		  "name": "Elon Musk",
	  },
	  ];
	const component = shallow(<FriendTab/>);
	friendsOnline.forEach((item) => {
		expect(component.containsMatchingElement(
			<TouchableOpacity key={item.id}>
			<Text>{item.name}</Text>
			</TouchableOpacity>
		)).toBeTruthy();
	});
	friendsBusy.forEach((item) => {
		expect(component.containsMatchingElement(
			<TouchableOpacity key={item.id}>
			<Text>{item.name}</Text>
			</TouchableOpacity>
		)).toBeTruthy();
	});
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
		
  });
  
  it('creates a Calendar event', async () => {
	const screen1 = shallow(<CalTab />);
	simulateClick(screen1.find("#sync-cal"));
	simulateClick(screen1.find("#add-event"));
	
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
	
	simulateClick(screen2.find("#time-pick-start"));
	simulateClick(screen2.find("#time-pick-end"));
	simulateClick(screen2.find("#save-event"));
  });
  
  it('navigates to InvitesTab', async () => {
	var component = shallow(<InvitesTab />);
	expect(component.containsMatchingElement(
        <TouchableOpacity>
          <Icon name="ios-trash"
          />
        </TouchableOpacity>)).toBeTruthy();
	var invites = component.find("#invite-list");
	var ad = true;
	for(var i = 0; i < invites.children().length; i++){
		component = shallow(<InvitesTab screen={2}/>);
		simulateClick((invites.children().at(i)), i);
		if(ad){
			simulateClick(component.find("#decline"));
		}
		else{
			simulateClick(component.find("#accept"));
		}
		ad = !ad;
	}
  });
	
  it('navigates to SettingsTab and logs out', async () => {
	var settings = shallow(<SettingsTab />);
	
	simulateClick(settings.find("#logout-button"));
	
	const login = shallow(<LoginScreen />);
	
    expect(login).toMatchSnapshot();
  });
  it('logs in, navigates to SettingsTab, deletes account', async () => {
	var login = shallow(<LoginScreen />);
	simulateClick(login.find("#login-button"));
	const component = shallow(<SettingsTab />);
	expect(component).toMatchSnapshot();
	
	simulateClick(component.find('#delete-button'));
  });
});
