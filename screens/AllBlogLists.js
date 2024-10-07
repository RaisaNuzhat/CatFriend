import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View,TouchableOpacity ,ImageBackground,Modal} from 'react-native';
import BlogListItem from '../component/BlogsListItem';
import { collection, query,getDocs, orderBy, limit, startAfter, endBefore, limitToLast } from 'firebase/firestore';
import { db } from '../firebase';
import { useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const BlogList = ({navigation}) => {

  
  const isFocused = useIsFocused();//Detects if the screen is currently in focus, triggering data reload when the user navigates back

  
  const blogsRef = collection(db, 'blogs');

  const [blogsList, setblogsList] = useState([])
  const [lastBlogRef, setlastBlogRef] = useState(null) // Keeps track of the last loaded blog to handle pagination
  const [lastPrevBlogRef, setlastPrevBlogRef] = useState(null) //
  const [endOfAllBlogs, setendOfAllBlogs] = useState(false) //racks the reference of the first blog in the current view to enable loading previous blogs.
  const [loading, setloading] = useState(false)
  const [firstBlogReached, setfirstBlogReached] = useState(true) //Boolean to indicate if the first page of blogs is displayed.
  const [reportVisible, setReportVisible] = useState(false);
  const [userPercentageData, setUserPercentageData] = useState([]);
  const [postsLikesPercentage, setPostsLikesPercentage] = useState({});
  const FetchFewBlogs = async () => {
    try {
      setloading(true)
      setfirstBlogReached(false)
      let blogQuery = query(blogsRef, orderBy('blogRef'), limit(4));
      if (lastBlogRef) {
        blogQuery = query(blogQuery, startAfter(lastBlogRef));
      }

      const querySnapshot = await getDocs(blogQuery);

      if(querySnapshot.size<1){
        setendOfAllBlogs(true); //no more blogs to load,disable the "Next" button in the UI.
      }
      else{
        const newBlogs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setblogsList(newBlogs)
        setlastPrevBlogRef(newBlogs[0].blogRef) //Updates the state with the reference of the first blog in the newly fetched set, enabling backward pagination.
        setlastBlogRef(newBlogs[newBlogs.length-1].blogRef)
      }
      setloading(false)
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };
  
  const generateReport = () => {
    const totalBlogs = blogsList.length;
    const userContributions = {};

    blogsList.forEach(blog => {
      userContributions[blog.username] = (userContributions[blog.username] || 0) + 1;
    });

    const userPercentage = Object.entries(userContributions).map(([user, count]) => ({
      user,
      percentage: ((count / totalBlogs) * 100).toFixed(2),
    }));

    const totalLikes = blogsList.reduce((sum, blog) => sum + blog.likes.length, 0);
    const totalComments = blogsList.reduce((sum, blog) => sum + blog.comments.length, 0);
    const postsLikesPercentage = {
      postsPercentage: ((totalBlogs / (totalLikes + totalBlogs)) * 100).toFixed(2),
      likesPercentage: ((totalLikes / (totalLikes + totalBlogs)) * 100).toFixed(2),
    };

    setUserPercentageData(userPercentage);
    setPostsLikesPercentage(postsLikesPercentage);
    setReportVisible(true);
  };
  const generatePDF = async () => {
    const html = `
      <html>
        <head>
          <title>Blog Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            .card { background: #f0f0f0; border-radius: 8px; padding: 10px; margin: 10px 0; }
            .card-title { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Blog Report</h1>
          <div>
            <div class="card">
              <div class="card-title">User Contribution (%)</div>
              ${userPercentageData.map(user => `<div>${user.user}: ${user.percentage}%</div>`).join('')}
            </div>
            <div class="card">
              <div class="card-title">Posts and Likes (%)</div>
              <div>Posts: ${postsLikesPercentage.postsPercentage}%</div>
              <div>Likes: ${postsLikesPercentage.likesPercentage}%</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const FetchPrevTwoBlogs = async () => { //view older blog posts in reverse order
    try {
      setloading(true);
      setendOfAllBlogs(false) // allow further navigation when going backward
      
      let blogQuery = query(blogsRef, orderBy('blogRef'), limitToLast(4));

      if (lastBlogRef) { //the last post of the current set).
        blogQuery = query(blogQuery, endBefore(lastPrevBlogRef));
      }
  
      const querySnapshot = await getDocs(blogQuery);
  
      if (querySnapshot.size < 1) {
        setfirstBlogReached(true)
      } 
      else {
        const newBlogs = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setblogsList(newBlogs);
        setlastBlogRef(newBlogs[newBlogs.length-1].blogRef)
        setlastPrevBlogRef(newBlogs[0].blogRef);
      }
      setloading(false);
    } catch (error) {
      console.error('Error fetching previous blogs:', error);
    }
  };

  const getPrevFetchedBlogsReloaded =  async ()=>{
    try {
      setloading(true)
      const blogsRef = collection(db, 'blogs');
      let blogQuery = query(blogsRef, orderBy('blogRef'), limit(blogsList.length));

      const querySnapshot = await getDocs(blogQuery);

      if(querySnapshot.size<1){
        setendOfAllBlogs(true);
      }
      else{
        const newBlogs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setblogsList([...newBlogs])
        setlastBlogRef(newBlogs[newBlogs.length-1].blogRef)
        setlastPrevBlogRef(newBlogs[0])
      }
      setloading(false)
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }

  useEffect(() => {
    if(isFocused && blogsList.length>0){
      ///
      getPrevFetchedBlogsReloaded()
    }
    else if(blogsList.length==0) FetchFewBlogs()
  }, [isFocused])

  return (
    <ImageBackground source={require('../assets/backgr.jpeg')} style={styles.backgroundImage}>
    <ScrollView showsVerticalScrollIndicator={false} style={{paddingTop:10,paddingHorizontal:10, flex: 1,paddingBottom:50}}>
      
      <Text style={styles.HeaderTitle}>Blogs</Text>
      {
        loading && <ActivityIndicator size={40} style={{height:350}} color={"#e7eaf6"}/>
      }
      {!loading && blogsList.length>0 &&  blogsList.map((item) => (
        <BlogListItem
          navigation={navigation}
          key={item.id}
          blogRef={item.blogRef}
          profilePic={item.profilePicUrl}
          userName={item.username}
          title={item.title}
          likeCount={item.likes.length}
          dislikeCount={item.dislikes.length}
          commentsCount={item.comments.length}
          date={item.date}
          
        />
      ))}
      {/* {endOfAllBlogs==true?
        <Text style={{textAlign:'center',fontSize:15,color:'red',fontWeight:'bold'}}>End of all Blogs :'(</Text>:
        <TouchableOpacity style={styles.buttonContainer} onPress={FetchFewBlogs}>
          <Feather name="chevron-down" size={24} color="white" />
          <Text style={styles.buttonText}>Load More</Text>
        </TouchableOpacity>
      } */}
        <TouchableOpacity style={styles.reportButton} onPress={generateReport}>
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>
      <View style={{flex:1,justifyContent:'space-between',height:'auto',alignItems:'center',paddingBottom:50,paddingTop:20,flexDirection:'row'}}>
        <TouchableOpacity disabled={firstBlogReached==true?true:false} style={[styles.buttonContainer,{borderTopRightRadius:0,borderBottomRightRadius:0}]} onPress={FetchPrevTwoBlogs}>
        <Text style={styles.buttonText}>Previous&nbsp;</Text>
            <AntDesign name="doubleleft" size={18} color="white" />
           
                     </TouchableOpacity>
          <TouchableOpacity disabled={endOfAllBlogs} style={[styles.buttonContainer,{borderTopLeftRadius:0,borderBottomLeftRadius:0}]} onPress={FetchFewBlogs}>
            <Text style={styles.buttonText}>Next&nbsp;</Text>
            <AntDesign name="doubleright" size={18} color="white" />
          </TouchableOpacity>

          <Modal visible={reportVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report</Text>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>User Contribution (%)</Text>
                {userPercentageData.map((user, index) => (
                  <Text key={index} style={styles.cardContent}>
                    {user.user}: {user.percentage}%
                  </Text>
                ))}
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Posts and Likes (%)</Text>
                <Text style={styles.cardContent}>Posts: {postsLikesPercentage.postsPercentage}%</Text>
                <Text style={styles.cardContent}>Likes: {postsLikesPercentage.likesPercentage}%</Text>
              </View>
              <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
                <Text style={styles.buttonText}>Download PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setReportVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    paddingBottom:50,
    
  },
  HeaderTitle:{
    color:'#38598b',
    fontSize:30,
    fontWeight:'bold',
    marginBottom:15
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
},
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38598b',
    padding: 10,
    
    borderRadius: 16,
    width: 80,
    height:80,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  reportButton: {
    backgroundColor: '#38598b',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 14,
    marginBottom: 3,
  },
  pdfButton: {
    backgroundColor: '#38598b',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
})

export default BlogList;