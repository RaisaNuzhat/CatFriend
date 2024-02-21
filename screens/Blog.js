// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';

// const BlogPage = () => {
//   const [posts, setPosts] = useState([]);

//   const renderPost = ({ item }) => (
//     <View style={styles.postContainer}>
//       <Image source={{ uri: item.image }} style={styles.postImage} />
//       <Text style={styles.postTitle}>{item.title}</Text>
//       <Text style={styles.postContent}>{item.content}</Text>
//       <View style={styles.actionsContainer}>
//         <TouchableOpacity style={styles.actionButton}>
//           <Text>Like</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionButton}>
//           <Text>Dislike</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionButton}>
//           <Text>Comment</Text>
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.likeCount}>{`${item.likes} Likes`}</Text>
//       <Text style={styles.commentCount}>{`${item.comments.length} Comments`}</Text>
//       <FlatList
//         data={item.comments}
//         renderItem={({ item }) => (
//           <View style={styles.commentContainer}>
//             <Text>{item}</Text>
//           </View>
//         )}
//         keyExtractor={(item, index) => index.toString()}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={posts}
//         renderItem={renderPost}
//         keyExtractor={(item, index) => index.toString()}
//       />
//       <TouchableOpacity style={styles.addButton}>
//         <Text style={styles.addButtonText}>Add Post</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   postContainer: {
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 10,
//   },
//   postImage: {
//     width: '100%',
//     height: 200,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   postTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   postContent: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//   },
//   actionButton: {
//     backgroundColor: '#ddd',
//     padding: 5,
//     borderRadius: 5,
//   },
//   likeCount: {
//     marginBottom: 5,
//   },
//   commentCount: {
//     marginBottom: 5,
//   },
//   commentContainer: {
//     backgroundColor: '#f9f9f9',
//     padding: 5,
//     marginBottom: 5,
//     borderRadius: 5,
//   },
//   addButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#38598b',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 50,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default BlogPage;
