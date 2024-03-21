import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView ,ImageBackground} from 'react-native';
import moment from 'moment';
import { collection, addDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Writeblog = ({navigation}) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setuser] = useState({})

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const { userName, user_id, email, dp_url, birthday } = userData;
          const loggedUserInfo = {
            userRef: user_id,
            email: email,
            userName: userName,
            userProfilePic: dp_url,
            birthday: birthday
          }
          setuser(loggedUserInfo);
        });
      } catch (e) {
        console.log(e);
      }
    }
    fetchUserData();
  }, []);

  const postABlog = async () => {
    if (title.trim().length > 0 && content.trim().length > 0) {
      const { userRef, userProfilePic, userName } = user;

      setTitle(title.trim());
      setContent(content.trim());
      const date = moment();
      const formattedDate = date.format('hh:mm:ss DD MMMM, YYYY');

      const blogData = {
        comments: [],
        likes: [],
        dislikes: [],
        userRef: userRef,
        username: userName,
        profilePicUrl: userProfilePic,
        title: title,
        date: formattedDate,
        description: content
      }
      try {
        const blogsRef = collection(db, 'blogs');
        const { id } = await addDoc(blogsRef, blogData);
        updateDoc(doc(db, 'blogs', id), {
          blogRef: id
        });
        alert("Your Post has been published!");
        setTitle('');
        setContent('');
        navigation.navigate('BlogList');
      } catch (error) {
        alert("Something Went Wrong! :(");
        console.error('Error adding post:', error);
      }
    } else if (title.trim().length < 1) {
      alert('Please write a title first');
    } else {
      alert('Please write something minimum for your post content');
    }
  }

  return (
    <ImageBackground source={require('../assets/backgr.jpeg')} style={styles.backgroundImage}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Write a Post</Text>
      <TextInput
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
        placeholder='Title of the post..'
      />
      <TextInput
        value={content}
        onChangeText={(text) => setContent(text)}
        style={[styles.input, styles.contentInput]}
        multiline={true}
        placeholder='Write your post here...'
      />
      <TouchableOpacity onPress={postABlog} style={styles.postButton}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    paddingBottom: 50,
    
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
},
  title: {
    color: '#38598b',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop:15,
    textAlign:'center'
  },
  input: {
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#e7eaf6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top' // To make content input multiline
  },
  postButton: {
    backgroundColor: '#38598b',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 30,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Writeblog;