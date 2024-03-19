import moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// import { useSelector } from 'react-redux';
import { auth, db } from '../firebase';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
const BlogPage = ({navigation}) => {
  const editorRef = useRef(null);


  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setuser] = useState({})

  const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>


  const postABlog = async ()=>{
    
    if(title.trim().length>0 && content.trim().length>0){
        const {userRef,userProfilePic,userName} = user

        setTitle(title.trim())
        setContent(content.trim())
        const date = moment();
        const formattedDate = date.format('hh:mm:ss DD MMMM, YYYY');

        const blogData = {
            comments:[],
            likes:[],
            dislikes:[],
            userRef:userRef,
            username:userName,
            profilePicUrl:userProfilePic,
            title:title,
            date:formattedDate,
            description:content
        }
        try {
            const blogsRef = collection(db, 'blogs');
            const {id} = await addDoc(blogsRef, blogData);
            updateDoc(doc(db,'blogs',id),{
                blogRef:id
            })
            alert("Your Blog has been published!")
            setTitle('')
            setContent('')
             navigation.navigate('BlogList')
          } 
          catch (error) {
            alert("Something Went Wrong! :(")
            console.error('Error adding blog:', error);
          }
    }
    else if(title.trim().length<1){
        alert('Please write a title first')
    }
    else{
        alert('Please write something minimum for your blog content')
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const {userName,user_id,email,dp_url,birthday}=userData
            const loggedUserInfo = {
                userRef:user_id,
                email:email,
                userName:userName,
                userProfilePic:dp_url,
                birthday:birthday
            }
            setuser(loggedUserInfo)
          })
      }
      catch(e){
        console.log(e)
      }
      
    }
    fetchUserData()
  }, []);



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>What's on your mind?</Text>
      <TextInput value={title} onChangeText={(text)=>setTitle(text)} style={styles.input} placeholder='Title of the blog..'/>
      <View style={styles.editorContainer}>
        <RichToolbar
            editor={editorRef}
            actions={[ actions.setBold, actions.setItalic, actions.setUnderline,
              actions.setStrikethrough, actions.heading1,actions.insertLink, actions.insertBulletsList,
              actions.insertOrderedList,actions.code,actions.blockquote,actions.alignLeft,actions.alignCenter,actions.alignRight,actions.setSuperscript, actions.setSubscript, 
              actions.removeFormat,actions.undo,actions.redo ]}
            iconMap={{ [actions.heading1]: handleHead }}
            selectedIconTint="#000"
            disabledIconTint="#bfbfbf"
            // style={{marginBottom:10}}
        />
        <RichEditor
            useContainer={false}
            value={content}
            ref={editorRef}
            style={[styles.editor]}
            placeholder='Write your blog here..'
            onChange={ descriptionText => {
                setContent(descriptionText);
            }}
        />
        </View>

      
      <TouchableOpacity onPress={postABlog} style={styles.postButton}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    paddingBottom:50,
    backgroundColor:'#fff'
  },
  title: {
    color:'#e80505',
    fontSize:30,
    fontWeight:'bold',
    marginBottom:15
  },
  input: {
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor:'white',
    borderRadius:8,
    borderWidth:1,
    borderColor:'#e80505'
  },
  editorContainer:{
    borderRadius:10,
    overflow:'hidden',
    borderWidth:1,
    borderColor:'#e80505'
  },
  editor: {
    minHeight:350,
  },
  postButton: {
    backgroundColor: '#e80505',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical:30,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default BlogPage;
