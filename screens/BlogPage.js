import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ImageBackground, Image, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      setCameraPermission(cameraStatus);
      setGalleryPermission(galleryStatus);

      if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
        alert('Permission to access camera roll is required!');
      }
    })();
  }, []);

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
      setShowPostOptions(true);
    }
  };

  const handlePost = () => {
    if (!caption || !selectedImage) {
      alert('Please enter a caption and select an image.');
      return;
    }

    const newPost = {
      id: posts.length + 1,
      username: 'Your Username',
      dp: 'https://via.placeholder.com/50',
      caption: caption,
      image: selectedImage,
      likes: 0,
      comments: []
    };

    setPosts([...posts, newPost]);
    setCaption('');
    setSelectedImage(null);
    setShowPostOptions(false);
  };

  const handleLike = (postId) => {
    // Implement like functionality here
  };

  const handleComment = (postId) => {
    // Implement comment functionality here
  };

  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView style={styles.feed}>
          <View style={styles.createPostContainer}>
            <Text style={styles.createPostText}>Create A Post....</Text>
            <TouchableOpacity style={styles.plusIcon} onPress={() => setShowPostOptions(true)}>
              <FontAwesome name="plus-square-o" size={30} color="black" />
            </TouchableOpacity>
          </View>
          {posts.map(post => (
            <View key={post.id} style={styles.post}>
              <View style={styles.userInfo}>
                <Image source={{ uri: post.dp }} style={styles.userDp} />
                <Text style={styles.username}>{post.username}</Text>
              </View>
              <Image source={{ uri: post.image }} style={styles.postImage} />
              <Text style={styles.postCaption}>{post.caption}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => handleLike(post.id)}>
                  <FontAwesome name="heart-o" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleComment(post.id)}>
                  <FontAwesome name="comment-o" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={styles.likesText}>Likes: {post.likes}</Text>
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
              {selectedImage && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  likesText: {
    paddingHorizontal: 10,
    paddingBottom: 5,
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


