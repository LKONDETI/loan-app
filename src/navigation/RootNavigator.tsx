import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import LoanApplicationScreen from '../screens/LoanApplicationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoansListScreen from '../screens/LoansListScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Stack */}
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>

        {/* Main App Stack */}
        <Stack.Group>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="LoanApplication" component={LoanApplicationScreen} />
          <Stack.Screen name="LoanDetails" component={LoanApplicationScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
