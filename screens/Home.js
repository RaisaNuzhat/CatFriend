import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image } from 'react-native';
import { gsap } from 'gsap-rn';

const Home = ({ navigation }) => {
  const viewRef = useRef(null);

  useEffect(() => {
    const view = viewRef.current;
    gsap.to(view, { duration: 1, transform: { rotate: 360, scale: 1 } });
  }, [])

  const handleLogin = () => {
    navigation.navigate('LogIn');
  };

  return (
    <ImageBackground
      source={require('../assets/loginsignupbg.jpeg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          ref={viewRef}
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
        <Text style={styles.title}>Welcome to Catfriend!</Text>

        <Text style={styles.description}>
          Explore the amazing world of cats and identify different cat species with our app.
        </Text>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Explore!</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#113f67',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#38598b',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#a2a8d3',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  logo:{
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default Home;
