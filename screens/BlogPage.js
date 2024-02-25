import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ImageBackground, Image, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from @expo/vector-icons for icons

const BlogPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'User1',
      dp: 'https://via.placeholder.com/50', // DP stands for display picture
      caption: 'Beautiful sunset view!',
      image: 'https://via.placeholder.com/300',
      likes: 10,
      comments: ['Amazing!', 'Love it!']
    },
    {
      id: 2,
      username: 'User2',
      dp: 'https://via.placeholder.com/50',
      caption: 'Exploring the wilderness!',
      image: 'https://via.placeholder.com/300',
      likes: 20,
      comments: ['Wow!', 'Incredible!']
    }
  ]);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPostOptions, setShowPostOptions] = useState(false);

  const handlePost = () => {
    if (!caption || !selectedImage) {
      alert('Please enter a caption and select an image.');
      return;
    }

    const newPost = {
      id: posts.length + 1,
      username: 'Current User', // Replace with actual user data
      dp: 'https://via.placeholder.com/50', // Replace with actual user's display picture
      caption: caption,
      image: selectedImage,
      likes: 0,
      comments: []
    };

    setPosts([...posts, newPost]);
    setCaption('');
    setSelectedImage(null);
    setShowPostOptions(false); // Hide post options after posting
  };

  const handleImageSelect = () => {
    // Here, you would implement image selection logic using a library like Expo ImagePicker
    // For simplicity, we'll just set a placeholder image URL
    setSelectedImage('https://via.placeholder.com/300');
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
                <TouchableOpacity onPress={() => { /* Add functionality for liking */ }}>
                  <FontAwesome name="heart-o" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { /* Add functionality for commenting */ }}>
                  <FontAwesome name="comment-o" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={styles.likesText}>Likes: {post.likes}</Text>
              <View>
                {post.comments.map((comment, index) => (
                  <Text key={index} style={styles.commentText}>{comment}</Text>
                ))}
              </View>
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
              <TouchableOpacity style={styles.selectImageButton} onPress={handleImageSelect}>
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
    marginTop:20,
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
    gap:20,
    fontSize:20,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  likesText: {
    paddingHorizontal: 10,
    paddingBottom: 5,

  },
  commentText: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    fontStyle: 'italic',
    fontSize:14,
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
