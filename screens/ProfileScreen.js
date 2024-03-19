
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert,ImageBackground } from 'react-native';
import { collection, where, query, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';  
import { FontAwesome } from '@expo/vector-icons';
import { db, auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [newImageUri, setnewImageUri] = useState(null)
  const [imageUri, setImageUri] = useState(null);
  
  const storageUrl = 'catfriend-b09f1.appspot.com';


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
    if (!result.canceled) {
      try {
        setnewImageUri(result.assets[0].uri);
        setImageUri(result.assets[0].uri)

        const fileName = `profileImages/${userData.userRef}.jpg`;

        try {
          const response = await fetch(
            'https://firebasestorage.googleapis.com/v0/b/'+storageUrl+'/o?name='+fileName,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'image/jpeg' || 'image/png' || 'image/jpg',
              },
              body: await fetch(result.assets[0].uri).then((response) => response.blob()),
            }
          );
          if (response.ok) {
            try {
              const temp = userData
              temp.userProfilePic = fileName
              const userData2 = await AsyncStorage.getItem('userData');
              if(userData2){
                const user = JSON.stringify(temp);
                await AsyncStorage.setItem('userData',user)
              }
              setUserData(temp)
              await updateDoc( doc(db, 'users', userData.userRef), {dp_url:fileName});
            } catch (error) {
              console.error('Error updating profile picture:', error);
              alert('Something went wrong')
            }
            alert('Profile Information Updated')
  
          } 
          else {
            console.error('Error uploading image:', response.statusText);
          }
         } 
         catch (error) {
          console.error('Error uploading image 2:', error);
        }
        
      } catch (error) {
        console.log('Error uploading image 3:', error);
        Alert.alert('Upload Failed', 'Failed to upload image. Please try again later.');
      }
    }
  };
  const getImageUrlToShow = (image)=>{
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageUrl}/o/${encodeURIComponent(image)}?alt=media`;
    return imageUrl
  }

  const preFetchDP = (userProfilePic)=>{
    const imageRef = getImageUrlToShow(userProfilePic)
    setImageUri(imageRef)
    setnewImageUri(imageRef)
  }


  
  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if(userData){
        const user = JSON.parse(userData);
        setUserData(user)
        preFetchDP(user.userProfilePic)
        
      }
      else{
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const { userName, user_id, email, dp_url,birthday } = userData;
            const loggedUserInfo = {
                userRef: user_id,
                userEmail: email,
                userName: userName,
                userProfilePic: dp_url,
                birthday
            };
            setUserData(loggedUserInfo)
            preFetchDP(dp_url)
          }
        );
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    if(userData) preFetchDP(userData.userProfilePic)
  }, [userData])
  
  
  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.backgroundImage}>
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {userData && (
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image source={{ uri: imageUri }} style={styles.image} />
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
              value={userData.userEmail}
              editable={false}
            />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Date of Birth:</Text>
            <TextInput
              style={styles.textInput}
              value={userData.birthday}
              editable={false}
            />
          </View>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#38598b',
  },
  profileContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputBox: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#38598b',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color:'#38598b',
  
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 75,
    marginBottom: 20,
  },
});

export default ProfileScreen;