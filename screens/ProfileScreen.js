// import React from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';

// const ProfileScreen = () => {
//   // Placeholder data for profile information
//   const userName = "Raisa Nuzhat";
//   const profileImageUrl = require('../assets/dp.jpg'); // Replace with actual profile image URL
//   const bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
//   const location = "Chittagong, Bangladesh";
//   const contactInfo = "raisa.csecu@gmail.com";

//   return (
//     <ImageBackground source={require('../assets/background.jpeg')} style={styles.container}>
//       <View style={styles.profileHeader}>
//         <Image source={profileImageUrl} style={styles.profileImage} />
//         <View style={styles.profileInfo}>
//           <Text style={styles.userName}>{userName}</Text>
//           <TouchableOpacity style={styles.editProfileButton}>
//             <Text style={styles.editProfileButtonText}>Edit Profile</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View style={styles.profileDetails}>
//         <Text style={styles.bio}>{bio}</Text>
//         <Text style={styles.profileDetail}>Location: {location}</Text>
//         <Text style={styles.profileDetail}>Contact: {contactInfo}</Text>
//         {/* Add more profile information here */}
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     resizeMode: 'cover',
//     // justifyContent: 'center',
//     paddingTop:10,
//   },
//   profileHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginRight: 20,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   userName: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     textAlign:'center',
//   },
//   editProfileButton: {
//     backgroundColor: '#38598b',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 5,
//     marginTop: 5,
//   },
//   editProfileButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign:'center',
//     margin: 5,
//   },
//   profileDetails: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//   },
//   bio: {
//     fontSize: 18,
//     marginBottom: 10,
//     color:'black',
//   },
//   profileDetail: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
// });

// export default ProfileScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert,ImageBackground } from 'react-native';
import { collection, where, query, getDocs } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { FontAwesome } from '@expo/vector-icons';
import { db, auth } from '../firebase';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const { userName, user_id, email, dp_url, birthday } = userData;
          const loggedUserData = {
            userRef: user_id,
            email: email,
            userName: userName,
            userProfilePic: dp_url,
            birthday: birthday
          }
          setUserData(loggedUserData);
        })
      }
      catch (e) {
        console.log(e);
      }
    }
    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setUserData({ ...userData, userProfilePic: result.uri });
    }
  };

  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.container}>
     {/* <View style={styles.container}> */}
      <Text style={styles.title}>User Profile</Text>
      {userData && (
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image source={{ uri: userData.userProfilePic }} style={styles.image} />
          </TouchableOpacity>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.textInput}
              value={userData.userName}
              editable={false}
            />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.textInput}
              value={userData.email}
              editable={false}
            />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.label}>BirthDay:</Text>
            <TextInput
              style={styles.textInput}
              value={userData.birthday}
              editable={false}
            />
          </View>
        </View>
      )}
      </ImageBackground>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputBox: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
});
export default ProfileScreen;





