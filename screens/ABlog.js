import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Dimensions,ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { doc, getDoc, arrayUnion, updateDoc, arrayRemove, collection, where, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import HTML from 'react-native-render-html';    
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { RichEditor } from 'react-native-pell-rich-editor';

const BlogUI = ({ navigation, route }) => {

  const editorRef = useRef(null);
  
  const blogDoc = doc(db,'blogs',route.params.blogRef);

  const [blogData, setBlogData] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setcommentInput] = useState('')
  const [likes, setlikes] = useState([])
  const [dislikes, setdislikes] = useState([])
  const [user, setuser] = useState({})
  const [userRef, setuserRef] = useState('')



  const contentWidth = Dimensions.get('window').width;
  
  const fetchBlogData = async () => {
      try {
          const blogDoc = await getDoc(doc(db, 'blogs', route.params.blogRef));
          const TempBlogData = blogDoc.data()
          setBlogData(TempBlogData);
          setComments(TempBlogData.comments);
          setlikes(TempBlogData.likes)
          setdislikes(TempBlogData.dislikes)
      } catch (error) {
          console.error('Error fetching blog data:', error);
      }
  };

  const getImageUrlToShow = (image)=>{
      const storageUrl = 'catfriend-b09f1.appspot.com';
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${storageUrl}/o/${encodeURIComponent(image)}?alt=media`;
      return imageUrl

  }

  const AddANewComment = async ()=>{
    const date = moment();
    const formattedDate = date.format('hh:mm:ss DD MMMM, YYYY');

    const newCommentInfo = {
      "commentText":commentInput,
      "userProfilePic":user.userProfilePic,
      "userRef":userRef,
      "username":user.userName,
      "date": formattedDate
    }
    try {
      await updateDoc(blogDoc, {
        comments: [...comments,newCommentInfo]
      });
      setComments([...comments,newCommentInfo])
      setcommentInput('')
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }

  const removeLike = async ()=>{
    try {
      await updateDoc(blogDoc, {
        likes:arrayRemove(userRef)
      });
      const tempLikes = likes.filter(item=>item!=userRef)
      setlikes(tempLikes)
      
    } catch (error) {
      console.error('Error removing likes:', error);
    }
  }

  const addLike = async()=>{
    try {
      await updateDoc(blogDoc, {
        likes:arrayUnion(userRef)
      })
      setlikes([...likes,userRef])
    } 
    catch (error) {
      console.error('Error adding likes:', error);
    }
  }

  const removeDislike = async()=>{
    try {
      await updateDoc(blogDoc, {
        dislikes:arrayRemove(userRef)
      });
      const tempDislikes = dislikes.filter(item=>item!=userRef)
      setdislikes(tempDislikes)
      
    } catch (error) {
      console.error('Error removing dislikes:', error);
    }
  }

  const addDislike =  async()=>{
    try {
      await updateDoc(blogDoc, {
        dislikes:arrayUnion(userRef)
      })
      setdislikes([...dislikes,userRef])
    } 
    catch (error) {
      console.error('Error adding dislikes:', error);
    }
  }

  const newLikeOrRemoveLike = ()=>{
    if(likes.includes(userRef)==true){  ///Remove the Like
      removeLike()
    }
    else{ ///new Like + remove dislike
      addLike()
      removeDislike()
    }
  }

  const newDislikeOrRemoveDislike = ()=>{
    if(dislikes.includes(userRef)==true){
      removeDislike()
    }
    else{
      addDislike()
      removeLike()
    }
  }
  
  useEffect(() => {
      fetchBlogData();
  }, [route.params.blogRef]);
    

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
            setuserRef(user_id)
          })
      }
      catch(e){
        console.log(e)
      }
      
    }
    fetchUserData()
  }, []);

  const renderComment = (comment) => {
    return (
      <View key={comment.date} style={styles.commentContainer}>
        <Image source={{ uri: getImageUrlToShow(comment.userProfilePic)}} style={styles.commentAuthorImage} />
        <View style={styles.commentContent}>
          <Text style={styles.commentAuthor}>{comment.username}
          </Text>
          <Text style={{fontSize:10,color:'gray',fontWeight:'bold',marginTop:-3,padding:0}}>{comment.date.slice(0,5)+' '+comment.date.slice(8)}</Text>
          
          <Text style={styles.commentText}>{comment.commentText}</Text>
        </View>
      </View>
    );
  };

  
    const [editorHeight, setEditorHeight] = useState(0);

  if (!blogData) {
    return <View style={{height:500,display:'flex',justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator color={"#e80505"} size={50} />
            <Text style={{textAlign:'center',verticalAlign:'middle',color:'#e80505'}}>Loading blog...</Text>
          </View>;
  }

  return (
    <ScrollView style={styles.container}  showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={{ uri: getImageUrlToShow(blogData.profilePicUrl) }} style={styles.authorImage} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{blogData.username}</Text>
          <Text style={styles.date}>{blogData.date.slice(0,5)+' '+blogData.date.slice(8)}</Text>
        </View>
      </View>
      
      <View style={styles.blogContent}>
        <Text style={styles.title}>{blogData.title}</Text>
        <View disabled={true} style={styles.richtexteditorContainer}>
          <RichEditor 
              useContainer={true}
              ref={editorRef}
              disabled={true}
              style={{flex: 1,backgroundColor:'transparent',borderRadius:8}}
              placeholder="Write your cool content here :)"
              initialContentHTML={blogData.description}
              onHeightChange={(height) => setEditorHeight(height)}
            />
        </View>
        
        {/* <HTML source={{ html: blogData.description }} tagsStyles={{body:{minHeight:250},a:{textDecorationLine:'none',fontWeight:'600'}}} contentWidth={contentWidth}/> */}
      </View>
      
      {/* <HRline/> */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={newLikeOrRemoveLike} style={[styles.likeDislikeCommentBtn]}>
          {
            likes.includes(userRef)==true?
              <AntDesign name="like1" size={20} color="blue" />:
              <Feather name="thumbs-up" size={20} color="green" />
          }
          <Text style={styles.likeDislikeCount}>({likes.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={newDislikeOrRemoveDislike} style={[styles.likeDislikeCommentBtn]}>
          {
            dislikes.includes(userRef)==true?
            <AntDesign name="dislike1" size={20} color="#db190b" />:
            <Feather name="thumbs-down" size={20} color="red" />
          }
          <Text style={styles.likeDislikeCount}>({dislikes.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.likeDislikeCommentBtn]}>
          <Feather name="message-circle" size={20} color="black" />
          <Text style={styles.likeDislikeCount}>({comments.length})</Text>
        </TouchableOpacity>
      </View>
      {/* <HRline/> */}
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsHeading}>Comments</Text>
        {comments.map((comment) => renderComment(comment))}
      </View>
      <View style={styles.commentBox}>
        <Image source={{ uri: getImageUrlToShow(user.userProfilePic) }} style={styles.commentBoxImage} />
        <TextInput style={styles.commentInput} multiline={true} value={commentInput} onChangeText={(text)=>setcommentInput(text)} placeholder="Add a comment..." />
        <TouchableOpacity style={styles.commentSubmitButton} disabled={commentInput.trim().length==0} onPress={AddANewComment}>
          <Ionicons name="send" size={24} color="#e80505" />
        </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };
  
export default BlogUI;
  
  const styles = {
    container: {
      flex: 1,
      margin:'auto',
      padding: 8,
      paddingBottom:50,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical:10,
      marginTop:40,
    },
    authorImage: {
      width: 60,
      height: 60,
      borderRadius: 20,
      margin: 8,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    date: {
      fontSize: 12,
      color: 'gray',
    },
    blogContent: {
      marginBottom: 16,
      width:'100%',
      backgroundColor:'#e7eaf6',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
      color:'#38598b',
      textAlign: 'center',
      borderWidth:1,
      paddingVertical:6,
      
      borderColor:'transparent',
     
      backgroundColor:'#e7eaf6',
      paddingHorizontal:5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    richtexteditorContainer:{
      height:'auto',
      minHeight:350,
      borderRadius:5,
      overflow:'hidden',
      backgroundColor:'#e7eaf6',
      borderWidth:1,
      borderColor:'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical:8,
      justifyContent:'space-evenly',
    },
    likeDislikeCommentBtn:{
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth:1,
      width:'30%',
      justifyContent:'center',
      paddingVertical:5,
      borderRadius:20,
      backgroundColor:'#e7eaf6',
      borderColor:'#38598b',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    likeDislikeCount: {
      marginLeft: 4,
      fontWeight:'bold',
      color:'#38598b'
    },
    commentsContainer: {
      margin: 'auto',
      minHeight:150
    },
    commentsHeading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color:'#38598b'
    },
    commentContainer: {
      flexDirection: 'row',
      marginVertical: 4,
    },
    commentAuthorImage: {
      width: 35,
      height: 35,
      borderRadius: 17.5,
      marginRight: 8,
      marginTop:4
    },
    commentContent: {
      flex: 1,
    },
    commentAuthor: {
        color:'#38598b',
        fontSize: 13,
        fontWeight: 'bold',
    },
    commentText: {
      fontSize: 14,
      color: '#38598b',
    },
    commentBox: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: 'lightgray',
      paddingTop: 8,
      paddingBottom:60,
    },
    commentBoxImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    commentInput: {
      flex: 1,
      minHeight: 40,
      maxHeight:100,
      borderWidth: 1,
      borderColor: '#38598b',
      borderRadius: 20,
      padding: 8,
      marginLeft: 8,
      overflow:'hidden',
      paddingRight:40
    },
    commentSubmitButton: {
      padding: 8,
      color:'#38598b',
      textAlign:'center',
      borderRadius: 4,
      position:'absolute',
      right:0.5,
      top:10,
      overflow:'hidden',
      borderRadius:15,
      height:'95%',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
    },
    commentSubmitButtonText: {
      alignSelf:'center',
      color: 'white',
      fontWeight: 'bold',
    },
  };
  