import React from 'react';
import App from '../App';


jest.mock('../screens/LoginScreen');

test('login flow', () => {
	require('../screens/LoginScreen');
});