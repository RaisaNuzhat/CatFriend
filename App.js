import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from '../CatFriend/screens/LoginScreen';
import SignUpScreen from './screens/SignupScreen';
import Home from './screens/Home';
import BlogPage from './screens/BlogPage';
import NavBar from './screens/NavBar';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AboutUs from './screens/AboutUs';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown:false}} /> 
      <Stack.Screen name="LogIn" component={LoginScreen}  options={{headerShown:false}} />
      <Stack.Screen name="NavBar" component={NavBar} options={{headerShown:false}} />
      
      <Stack.Screen name="SignUp" component={SignUpScreen}   options={{headerShown:false}}/>
     
     
      <Stack.Screen name="BlogPage" component={BlogPage} options={{headerShown:false}} />
      
      <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}} /> 
      <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown:false}} /> 
    
      
       
      

        </Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
