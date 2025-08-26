import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './UserProvider';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';
import ComponentC from './ComponentC';

const Stack = createNativeStackNavigator();

const Routages= () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ComponentA">
          <Stack.Screen name="ComponentA" component={ComponentA} />
          <Stack.Screen name="ComponentB" component={ComponentB} />
          <Stack.Screen name="ComponentC" component={ComponentC} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default Routages;