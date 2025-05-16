import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from '../app/onboarding/SignUp';
import VerifyCode from '../app/onboarding/VerifyCode';
import WeatherScreen from '../app';

const Stack = createStackNavigator();

const AppNavigator = () => {
  console.log('Rendering AppNavigator');
  return (
    <Stack.Navigator initialRouteName="WeatherScreen">
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="VerifyCode" component={VerifyCode} options={{ headerShown: false }} />
      <Stack.Screen name="WeatherScreen" component={WeatherScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;