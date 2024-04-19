import React ,{useState} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SettingsScreen from './SettingsScreen'; 
import BlogPage from './BlogPage'; 
import ProfileScreen from './ProfileScreen'; 
import AboutUs from './AboutUs'; 
import BlogUI from './ABlog';
import Writeblog from './Writeblog';
import BlogListItem from '../component/BlogsListItem';
import BlogList from './AllBlogLists';
import DetectionPage from './DetectionPage';
const Tab = createBottomTabNavigator();

const NavBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'WriteBlog') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }
           else if (route.name== 'BlogList') {
            iconName = focused ? 'list' : 'list-outline';
          }
          else if (route.name === 'Detection') {
            iconName = focused ? 'scan-circle' : 'scan-circle-outline';
          }
          
          else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } 
          else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
           else if (route.name === 'AboutUs') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#38598b',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: '#ffffff', borderTopWidth: 0 },
      })}
    >
      <Tab.Screen name="WriteBlog" component={Writeblog} />
      <Tab.Screen name="BlogList" component={BlogList} />
      <Tab.Screen name="Detection" component={DetectionPage} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="AboutUs" component={AboutUs} />
      
    </Tab.Navigator>
  );
};

export default NavBar;