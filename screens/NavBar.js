import React ,{useState} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SettingsScreen from './SettingsScreen'; // Assuming this is your existing SettingsScreen component
import BlogPage from './BlogPage'; // Importing the BlogPage component
import ProfileScreen from './ProfileScreen'; // Assuming this is your existing ProfileScreen component
import AboutUs from './AboutUs'; // Assuming this is your existing AboutUs component

const Tab = createBottomTabNavigator();

const NavBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'BlogPage') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'AboutUs') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#38598b',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: '#ffffff', borderTopWidth: 0 },
      })}
    >
      <Tab.Screen name="BlogPage" component={BlogPage} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="AboutUs" component={AboutUs} />
    </Tab.Navigator>
  );
};

export default NavBar;
