import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import LoansListScreen from './LoansListScreen';

const Tab = createBottomTabNavigator();

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1FA29C',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'HomeTab') {
            iconName = 'home-outline';
          } else if (route.name === 'LoansTab') {
            iconName = 'document-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="LoansTab"
        component={LoansListScreen}
        options={{
          tabBarLabel: 'My Loans',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
