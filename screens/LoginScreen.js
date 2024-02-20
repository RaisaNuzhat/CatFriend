
// LoginScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

// const LoginScreen = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
   
//     navigation.navigate('SignUp');
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/bg.jpeg')} 
//       style={styles.backgroundImage}
//     >
//       <View style={styles.container}>
//         <Text style={styles.title}>Login</Text>

//         <View style={styles.formContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Login with Username"
//             onChangeText={(text) => setUsername(text)}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Enter Password"
//             secureTextEntry
//             onChangeText={(text) => setPassword(text)}
//           />

//           <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.signupContainer}>
//           <Text style={styles.signupText}>Don't have an account? </Text>
//           <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//             <Text style={styles.signupLink}>Sign up</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
     
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 16,
//     color: '#fff',
//   },
//   formContainer: {
//     backgroundColor: '#e7eaf6', 
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//     elevation: 8,
//     width: '80%',
//     marginBottom: 16,
//   },
//   input: {
//     height: 60,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingLeft: 8,
//     backgroundColor: 'white',
//     borderRadius: 12,
//   },
//   loginButton: {
//     backgroundColor: '#38598b',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//   },
//   signupContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   signupText: {
//     fontSize: 16,
//     color: '#38598b',
//   },
//   signupLink: {
//     color: '#FF004D',
//     textDecorationLine: 'none',
//     fontSize: 16,
//   },
// });

// export default LoginScreen;

// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
// import auth from '@react-native-firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erroMessage, seterroMessage] = useState('')

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(username,password)
      .then(() => {
        // Navigate to the home screen or any other screen
        console.log('User logged in successfully!');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          console.log('Invalid email address format.');
        }

        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          console.log('Invalid email address or password.');
        }

        console.error(error);
      });
  };

  const loginUser = async ()=>{

    try {
      const { user } =await signInWithEmailAndPassword(auth,username, password)

      if(user.emailVerified){
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", email));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
              const userData = doc.data();
              const {userName,user_id,email,dp_url}=userData
              const loggedUserInfo = {
                  userRef:user_id,
                  userEmail:email,
                  userName:userName,
                  userProfilePic:dp_url
              }
              setwelcomeUserName(userName)
              if(isRememberMeChecked==true){
                  const loggedUserInfoString = JSON.stringify(loggedUserInfo);
                  AsyncStorage.setItem('userData', loggedUserInfoString)
                  .then(() => {
                      console.log('Data stored successfully!');
                  })
                  .catch((error) => {
                      console.log('Error storing data:', error);
                  });
              }
              update_user_info(loggedUserInfo)
              setEmail('')
              setPassword('')
              setloading(false)
              setloggedInStatus(true)
          });
          }
          else{
              alert("Please verify your email first.")
          }
          //setloading(false)
  } 
  catch (e) {
      if(e.code==='auth/wrong-password') seterroMessage("Wrong Password")
      if(e.code==='auth/user-not-found') seterroMessage('No account matches this email')
      seterroMessage(e.code)
      console.log(e)
      
      // setloading(false)
  }



  }

  return (
    <ImageBackground
      source={require('../assets/bg.jpeg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Login with Email"
            onChangeText={(text) => setUsername(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          {erroMessage.length>0 && <Text  style={styles.errorMessage}>Ekta wrong error</Text>}
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  errorMessage:{
    color:'red'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#e7eaf6', 
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: '80%',
    marginBottom: 16,
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  loginButton: {
    backgroundColor: '#38598b',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#38598b',
  },
  signupLink: {
    color: '#FF004D',
    textDecorationLine: 'none',
    fontSize: 16,
  },
});

export default LoginScreen;
