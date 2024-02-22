import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';

const AboutUs = () => {
  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>About Us</Text>
        <Text style={styles.text}>
          Welcome to our app! This app is designed to help users connect and share their experiences.
          Feel free to explore and interact with other users' content.
        </Text>
        <Text style={styles.subHeading}>Location</Text>
        <View style={styles.mapContainer}>
          <WebView
            style={{ height: 200, width: Dimensions.get('window').width - 40 }}
            source={{
              html: `
                <html>
                  <body style="margin:0;padding:0;">
                    <iframe
                      width="100%"
                      height="100%"
                      frameborder="0"
                      style="border:0;"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29201.80007099392!2d91.81651237142986!3d22.325011536848198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acdc45f1a1f02f%3A0x89456c9217a1041c!2sChittagong%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1644910244394!5m2!1sen!2sus"
                      allowfullscreen>
                    </iframe>
                  </body>
                </html>
              `
            }}
          />
        </View>
        <Text style={styles.text}>
          Our head office is located in Chittagong, Bangladesh. It is a vibrant city with rich cultural heritage and scenic beauty.
          Feel free to visit us and learn more about our operations!
        </Text>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  mapContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default AboutUs;
