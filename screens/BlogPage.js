// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ImageBackground } from 'react-native';
// import { FontAwesome5 } from '@expo/vector-icons';
// import { WebView } from 'react-native-webview'; // Import WebView from react-native-webview

// // Sample data for posts
// const postsData = [
//   { id: 1, author: 'Raisa Nuzhat', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', likes: 5, dislikes: 2, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
//   { id: 2, author: 'Ratri Barua', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', likes: 10, dislikes: 3, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
//   // Add more posts as needed
// ];

// const BlogPage = ({ navigation }) => {
//   const [posts, setPosts] = useState(postsData);
//   const [textValue, setTextValue] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [videoUrl, setVideoUrl] = useState('');

//   const handleLike = (postId) => {
//     setPosts(prevPosts =>
//       prevPosts.map(post =>
//         post.id === postId ? { ...post, likes: post.likes + 1 } : post
//       )
//     );
//   };

//   const handleDislike = (postId) => {
//     setPosts(prevPosts =>
//       prevPosts.map(post =>
//         post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
//       )
//     );
//   };

//   const handlePost = () => {
//     const newPost = {
//       id: posts.length + 1,
//       author: 'Current User', // Replace with actual user data
//       content: textValue,
//       likes: 0,
//       dislikes: 0,
//       videoUrl: videoUrl // Add videoUrl property to the new post object
//     };

//     setPosts(prevPosts => [...prevPosts, newPost]);
//     setTextValue('');
//     setVideoUrl(''); // Clear videoUrl after posting
//   };

//   return (
//     <ImageBackground source={require('../assets/background.jpeg')} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         <View style={styles.navbar}>
//           <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
//             <Text style={styles.navbarText}>Profile</Text>
//           </TouchableOpacity>
//         </View>
//         <ScrollView style={styles.content}>
//           {/* Add post form */}
//           <View style={styles.postForm}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Write something..."
//               onChangeText={setTextValue}
//               value={textValue}
//               multiline={true}
//             />
//             <TextInput
//               style={styles.textInput}
//               placeholder="Paste image URL here..."
//               onChangeText={setImageUrl}
//               value={imageUrl}
//             />
//             <TextInput
//               style={styles.textInput}
//               placeholder="Paste YouTube video URL here..."
//               onChangeText={setVideoUrl}
//               value={videoUrl}
//             />
//             <TouchableOpacity style={styles.postButton} onPress={handlePost}>
//               <Text style={styles.postButtonText}>Post</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Display posts */}
//           {posts.map(post => (
//             <View key={post.id} style={styles.postContainer}>
//               <Text style={styles.postAuthor}>{post.author}</Text>
//               <Text style={styles.postContent}>{post.content}</Text>
//               <WebView
//                 style={styles.videoContainer}
//                 javaScriptEnabled={true}
//                 domStorageEnabled={true}
//                 source={{ uri: post.videoUrl }} // Embed YouTube video using WebView
//               />
//               <View style={styles.actionsContainer}>
//                 <TouchableOpacity onPress={() => handleLike(post.id)}>
//                   <FontAwesome5 name="thumbs-up" size={20} color="green" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => handleDislike(post.id)}>
//                   <FontAwesome5 name="thumbs-down" size={20} color="red" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => { /* Add functionality for commenting */ }}>
//                   <FontAwesome5 name="comment" size={20} color="blue" />
//                 </TouchableOpacity>
//               </View>
//               <View style={styles.likesContainer}>
//                 <Text style={styles.likesText}>Likes: {post.likes}</Text>
//                 <Text style={styles.dislikesText}>Dislikes: {post.dislikes}</Text>
//               </View>
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//   },
//   navbar: {
//     marginTop: 30,
//     backgroundColor: '#38598b',
//     padding: 20,
//     alignItems: 'center',
//   },
//   navbarText: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   content: {
//     flex: 1,
//     padding: 10,
//   },
//   postForm: {
//     marginBottom: 20,
//     marginTop: 15,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
//   postButton: {
//     backgroundColor: '#38598b',
//     paddingVertical: 12,
//     borderRadius: 5,
//   },
//   postButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
//   postContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
//   postAuthor: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   postContent: {
//     marginBottom: 10,
//   },
//   videoContainer: {
//     height: 200, // Adjust height as needed
//     marginBottom: 10,
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   likesContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   likesText: {
//     color: 'green',
//   },
//   dislikesText: {
//     color: 'red',
//   },
// });

// export default BlogPage;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ImageBackground,FlatList} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WebView } from 'react-native-webview'; // Import WebView from react-native-webview
import { Ionicons } from '@expo/vector-icons';
import NavBar from './NavBar'

// Sample data for posts
const postsData = [
  { id: 1, author: 'Raisa Nuzhat', content: 'Hello guys check out this funny video!', likes: 5, dislikes: 2, videoUrl: 'https://www.youtube.com/watch?v=13QkrOtFeUQ' },
  { id: 2, author: 'Ratri Barua', content: 'Hello guys check out this funny video!', likes: 10, dislikes: 3, videoUrl: 'https://www.youtube.com/watch?v=13QkrOtFeUQ' },
  // Add more posts as needed
];

const BlogPage = ({ navigation }) => {
  const [posts, setPosts] = useState(postsData);
  const [textValue, setTextValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  const handlePost = () => {
    const newPost = {
      id: posts.length + 1,
      author: 'Current User', // Replace with actual user data
      content: textValue,
      likes: 0,
      dislikes: 0,
      videoUrl: videoUrl // Add videoUrl property to the new post object
    };

    setPosts(prevPosts => [...prevPosts, newPost]);
    setTextValue('');
    setVideoUrl(''); // Clear videoUrl after posting
  };

  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Add post form */}
          <View style={styles.postForm}>
            <TextInput
              style={styles.textInput}
              placeholder="Write something..."
              onChangeText={setTextValue}
              value={textValue}
              multiline={true}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Paste image URL here..."
              onChangeText={setImageUrl}
              value={imageUrl}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Paste YouTube video URL here..."
              onChangeText={setVideoUrl}
              value={videoUrl}
            />
            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          {/* Display posts */}
          {posts.map(post => (
            <View key={post.id} style={styles.postContainer}>
              <Text style={styles.postAuthor}>{post.author}</Text>
              <Text style={styles.postContent}>{post.content}</Text>
              <WebView
                style={styles.videoContainer}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: post.videoUrl }} // Embed YouTube video using WebView
              />
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => handleLike(post.id)}>
                  <FontAwesome5 name="thumbs-up" size={20} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDislike(post.id)}>
                  <FontAwesome5 name="thumbs-down" size={20} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { /* Add functionality for commenting */ }}>
                  <FontAwesome5 name="comment" size={20} color="blue" />
                </TouchableOpacity>
              </View>
              <View style={styles.likesContainer}>
                <Text style={styles.likesText}>Likes: {post.likes}</Text>
                <Text style={styles.dislikesText}>Dislikes: {post.dislikes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  postForm: {
    marginBottom: 20,
    marginTop: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#38598b',
    paddingVertical: 12,
    borderRadius: 5,
  },
  postButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  postContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  postAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContent: {
    marginBottom: 10,
  },
  videoContainer: {
    height: 200, // Adjust height as needed
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  likesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likesText: {
    color: 'green',
  },
  dislikesText: {
    color: 'red',
  },
});

export default BlogPage;
