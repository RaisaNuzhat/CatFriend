import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Home from './screens/Home';
import SignUpScreen from './screens/SignupScreen';
import BlogPage from './screens/BlogPage';
import NavBar from './screens/NavBar';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import AboutUs from './screens/AboutUs';
import BlogList from './screens/AllBlogLists';
import BlogListItem from './component/BlogsListItem';
import Writeblog from './screens/Writeblog';
import BlogUI from './screens/ABlog';
import SplashScreen from './screens/SplashScreen';
import DetectionPage from './screens/DetectionPage'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="LogIn" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NavBar" component={NavBar} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BlogPage" component={BlogPage} options={{ headerShown: false }} />
        <Stack.Screen name="BlogList" component={BlogList} options={{ headerShown: false }} />
        <Stack.Screen name="BlogListItem" component={BlogListItem} options={{ headerShown: false }} />
        <Stack.Screen name="BlogUI" component={BlogUI} options={{ headerShown: false }} />
        <Stack.Screen name="Detection" component={DetectionPage} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AboutUs" component={AboutUs} options={{ headerShown: false }} />
        <Stack.Screen name="WriteBlog" component={Writeblog} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
