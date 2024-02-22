import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';

const ProfileScreen = () => {
  // Placeholder data for profile information
  const userName = "Raisa Nuzhat";
  const profileImageUrl = require('../assets/dp.jpg'); // Replace with actual profile image URL
  const bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  const location = "Chittagong, Bangladesh";
  const contactInfo = "raisa.csecu@gmail.com";

  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={profileImageUrl} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.profileDetails}>
        <Text style={styles.bio}>{bio}</Text>
        <Text style={styles.profileDetail}>Location: {location}</Text>
        <Text style={styles.profileDetail}>Contact: {contactInfo}</Text>
        {/* Add more profile information here */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    // justifyContent: 'center',
    paddingTop:10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign:'center',
  },
  editProfileButton: {
    backgroundColor: '#38598b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center',
    margin: 5,
  },
  profileDetails: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  bio: {
    fontSize: 18,
    marginBottom: 10,
    color:'black',
  },
  profileDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ProfileScreen;
