import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import _ from 'lodash';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreens from './src/screens/HomeScreens';

// ignore timer warning due to firebase real-time database
YellowBox.ignoreWarnings([ 'Setting a timer' ]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default createAppContainer(
  createSwitchNavigator(
    {
      Home: HomeScreens,
      Signup: SignupScreen
    },
    {
      initialRouteName: 'Signup'
    }
  )
);
