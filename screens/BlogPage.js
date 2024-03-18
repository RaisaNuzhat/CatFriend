import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ImageBackground, Image, Modal, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, where, query, getDocs, updateDoc, doc } from 'firebase/firestore';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [newImageUri, setNewImageUri] = useState(null);
  const [userData, setUserData] = useState(null);
  const storageUrl = 'catfriend-b09f1.appspot.com';

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      }
    })();
  }, []);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      try {
        const fileName = `blogImages/${userData.userRef}.jpg`;

        const response = await fetch(
          `https://firebasestorage.googleapis.com/v0/b/${storageUrl}/o?name=${fileName}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'image/jpeg',
            },
            body: await fetch(result.uri).then((response) => response.blob()),
          }
        );
        if (response.ok) {
          setNewImageUri(result.uri);

          const temp = { ...userData, userProfilePic: fileName };
          await AsyncStorage.setItem('userData', JSON.stringify(temp));
          setUserData(temp);
          await updateDoc(doc(db, 'users', userData.userRef), { dp_url: fileName });
          Alert.alert('Profile Information Updated', 'Profile picture updated successfully.');
        } else {
          console.error('Error uploading image:', response.statusText);
          Alert.alert('Upload Failed', 'Failed to upload image. Please try again later.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Upload Failed', 'Failed to upload image. Please try again later.');
      }
    }
  };

  const getImageUrlToShow = (image) => {
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageUrl}/o/${encodeURIComponent(image)}?alt=media`;
    return imageUrl;
  };

  const preFetchDP = async (userProfilePic) => {
    const imageRef = getImageUrlToShow(userProfilePic);
    setNewImageUri(imageRef);
  };

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setUserData(user);
        await preFetchDP(user.userProfilePic);
      } else {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const { userName, user_id, email, dp_url, birthday } = userData;
            const loggedUserInfo = {
                userRef: user_id,
                userEmail: email,
                userName: userName,
                userProfilePic: dp_url,
                birthday
            };
            setUserData(loggedUserInfo);
            preFetchDP(dp_url);
          }
        );
      }
    };
    getUser();
  }, []);

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setNewImageUri(result.uri);
      setShowPostOptions(true);
    }
  };

  const handlePost = async () => {
    if (!caption || !newImageUri) {
      Alert.alert('Incomplete Post', 'Please enter a caption and select an image.');
      return;
    }

    const fileName = `posts/${userData.userRef}/${Date.now()}.jpg`;

    try {
      const response = await fetch(
        `https://firebasestorage.googleapis.com/v0/b/${storageUrl}/o?name=${fileName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: await fetch(newImageUri).then((response) => response.blob()),
        }
      );
      if (response.ok) {
        const newPost = {
          username: userData.userName,
          dp: getImageUrlToShow(userData.userProfilePic),
          caption: caption,
          image: fileName,
          likes: 0,
          comments: []
        };
        setPosts([newPost, ...posts]);
        setCaption('');
        setNewImageUri(null);
        setShowPostOptions(false);
      } else {
        Alert.alert('Upload Failed', 'Failed to upload image. Please try again later.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Failed', 'Failed to upload image. Please try again later.');
    }
  };

  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView style={styles.feed}>
          <View style={styles.createPostContainer}>
            <Text style={styles.createPostText}>Create A Post....</Text>
            <TouchableOpacity style={styles.plusIcon} onPress={handleImagePick}>
              <FontAwesome name="plus-square-o" size={30} color="black" />
            </TouchableOpacity>
          </View>
          {posts.map((post, index) => (
            <View key={index} style={styles.post}>
              <View style={styles.userInfo}>
                <Image source={{ uri: post.dp }} style={styles.userDp} />
                <Text style={styles.username}>{post.username}</Text>
              </View>
              <Image source={{ uri: getImageUrlToShow(post.image) }} style={styles.postImage} />
              <Text style={styles.postCaption}>{post.caption}</Text>
            </View>
          ))}
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPostOptions}
          onRequestClose={() => setShowPostOptions(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowPostOptions(false)}>
                <FontAwesome name="close" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectImageButton} onPress={pickImageFromGallery}>
                <Text style={styles.selectImageText}>Select Image</Text>
              </TouchableOpacity>
              {newImageUri && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: newImageUri }} style={styles.selectedImage} />
                  <TextInput
                    style={styles.captionInput}
                    placeholder="Write a caption..."
                    value={caption}
                    onChangeText={setCaption}
                  />
                  <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                    <Text style={styles.postButtonText}>Post</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
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
    padding: 10,
  },
  feed: {
    flex: 1,
  },
  createPostContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  createPostText: {
    fontSize: 24,
    fontWeight: '400',
    color: 'grey',
  },
  post: {
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postCaption: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  plusIcon: {
    marginRight: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  selectImageButton: {
    backgroundColor: '#38598b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectImageText: {
    color: '#fff',
    textAlign: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#38598b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  postButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  userDp: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BlogPage;
