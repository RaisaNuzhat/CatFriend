
// SignUpScreen.js
// SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    console.log(`Email: ${email}, Birthdate: ${birthdate}, First Name: ${firstName}, Last Name: ${lastName}, Password: ${password}, Confirm Password: ${confirmPassword}`);

    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../assets/bg.jpeg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.formContainer}>
          {/* Removed full name input field */}
          
          <TextInput
            style={styles.input}
            placeholder="Enter your Email"
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your Birthdate"
            onChangeText={(text) => setBirthdate(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your First Name"
            onChangeText={(text) => setFirstName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your Last Name"
            onChangeText={(text) => setLastName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Set Your Password"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Your Password"
            secureTextEntry
            onChangeText={(text) => setConfirmPassword(text)}
          />

          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#e7eaf6',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: '80%',
    marginBottom: 16,
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  signupButton: {
    backgroundColor: '#38598b',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  loginContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#38598b',
  },
  loginLink: {
    color: '#FF004D',
    textDecorationLine: 'none',
    fontSize: 16,
  },
});

export default SignUpScreen;

