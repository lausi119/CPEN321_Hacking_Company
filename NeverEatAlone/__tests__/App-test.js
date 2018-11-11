import 'react-native';
import React from 'react';
import App from '../App';
import LoginScreen from '../screens/LoginScreen';
import FriendTab from '../screens/FriendTab';
import SettingsTab from '../screens/SettingsTab';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import {shallow} from 'enzyme';
import * as enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

enzyme.configure( {adapter: new Adapter() } );

describe('App snapshot', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    //NavigationTestUtils.resetInternalState();
  });

  it('renders the login screen', async () => {
    const component = shallow(<LoginScreen/>);
    expect(component).toMatchSnapshot();
  });
  
  it('logs in with test user', async () => {
    const component = shallow(<LoginScreen/>);
	var btn = component.find('#login-button');
	btn.simulate('click');
    const landing = shallow(<FriendTab/>);
    expect(component).toMatchSnapshot();
  });
});
