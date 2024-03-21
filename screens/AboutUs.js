import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ImageBackground, TouchableOpacity, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase';
import { collection, doc, serverTimestamp, setDoc, getDocs, query, orderBy, limit, aggregate, addDoc, where, updateDoc } from 'firebase/firestore';
import 'firebase/auth';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';

const AboutUs = () => {
  const [user, setuser] = useState({})
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [totalRatingUsers, setTotalRatingUsers] = useState(0);
  const [userLocation, setUserLocation] = useState(null); 
  const [userAlreadyReviewed, setuserAlreadyReviewed] = useState(false)
  const [userReviewDoc, setuserReviewDoc] = useState('')
 
  useEffect(() => {
    // Function to start watching for user's location updates
    const watchUserLocation = async () => {
      try {
        // Request permission to access the device's location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        // Start watching for location updates
        Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 5000 }, (location) => {
          setUserLocation(location.coords);
        });
      } catch (error) {
        console.error('Error watching user location:', error);
      }
    };

    // Call the function to start watching for user's location when component mounts
    watchUserLocation();

    // Clean up watcher when component unmounts
    return () => {
      Location.stopLocationUpdatesAsync();
    };
  }, []);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchReviews(); 
      }
    });

    return unsubscribe;
  }, []);

  
  const fetchReviews = async () => {
    try {
      
      const reviewsSnapshot = await getDocs(query(collection(db, 'reviews'), orderBy('timestamp', 'desc')));

      const reviewsData = reviewsSnapshot.docs.map(doc => {
        const newDoc = doc.data()
        newDoc.id = doc.id
        return newDoc
      });
      
      let totalRatings = 0;
      reviewsData.forEach((item) => {
        totalRatings += item.rating;
        if(item.userId==user.userRef){
          setuserAlreadyReviewed(true)
          setRating(item.rating)
          setReviewText(item.reviewText)
          setuserReviewDoc(item.id)
        }
      });
      const averageRating = reviewsData.length > 0 ?( totalRatings / reviewsData.length) : 0;

      
      setReviews(reviewsData);
      setTotalRatings(totalRatings);
      setAverageRating(averageRating);
      setTotalRatingUsers(reviewsData.length)
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };


  const handleRating = (value) => {
    const newRating = value === rating ? 0 : value;
    setRating(newRating);
  };



  const reviewedStar = (star)=>{
    const starTag = []
    for(let i=0;i<star;i++){
      starTag.push(i+1)
    }
    return starTag

  }

  const openLink = (url) => {
    Linking.openURL(url);
  };




  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if(userData){
        const user = JSON.parse(userData);
        setuser(user)
      }
      else{
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const { userName, user_id, email, dp_url } = userData;
            const loggedUserInfo = {
                userRef: user_id,
                userEmail: email,
                userName: userName,
                userProfilePic: dp_url
            };
            setuser(loggedUserInfo)
          }
        );
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [user])
  


  const submitReview = async () => {
    try {
      const review = {
        userId: user.userRef,
        userName: user.userName,
        rating: rating,
        reviewText,
        timestamp: new Date(),
      };
      const reviewColRef = collection(db,'reviews')
      if(!userAlreadyReviewed){
        const docRef = await addDoc(reviewColRef,review);
        Alert.alert('Thank you for your review and rating!');
      }
      else{
        const updatedDoc = await updateDoc(doc(db,'reviews',userReviewDoc), review)
        Alert.alert("Thank you. Your Review has been updated!")
      }
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review and rating:', error);
      Alert.alert('Error submitting review and rating. Please try again later.');
    }
  };


  return (
    <ImageBackground source={require('../assets/backgr.jpeg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.heading}>About Us</Text> */}
        <Text style={styles.text}>
          Welcome to our app! This app is designed to help users connect and share their experiences.
          Feel free to explore different cat breeds and interact with other users' content.
        </Text>
         {/* Display Location on Map */}
         <View style={styles.mapContainer}>
      <Text style={styles.subHeading}>Location</Text>
      {userLocation && (
        <MapView
          style={styles.map}
          region={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Current Location"
          />
        </MapView>
      )}
    </View>
            
        <Text style={styles.text}>
          Our head office is located in Chittagong, Bangladesh. It is a vibrant city with rich cultural heritage and scenic beauty.
          Feel free to visit us and learn more about our operations!
        </Text>
        <Text style={styles.subHeading}>Rate Us</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity key={value} onPress={() => handleRating(value)}>
              <FontAwesome
                name={value <= rating ? 'star' : 'star-o'}
                size={30}
                color={value <= rating ? '#FFD700' : '#ccc'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Button title={(userAlreadyReviewed ?"Update " : "Submit ") + "Submit Review"} onPress={submitReview} />
        <Text style={styles.subHeading}>User's Guide</Text>
        <WebView
          style={styles.video}
          javaScrptEnabled={true}
          
          source={{ uri: 'https://www.youtube.com/embed/DLzsyvUXrss' }} 
        />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color:'#38598b',
    textAlign:'center',
    marginTop:30,
    marginBottom:30,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign:'center',
    color:'#38598b',
  },
  mapContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    height: 200,
    borderRadius: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems:'center',
    justifyContent:'center',
  },
  video: {
    height: 200,
    width: Dimensions.get('window').width - 40,
  },
});

export default AboutUs;
