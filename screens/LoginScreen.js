
// //LoginScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleLogin = () => {
//     auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(() => {
//         console.log('User logged in successfully!');
//       })
//       .catch(error => {
//         if (error.code === 'auth/invalid-email') {
//           setErrorMessage('Invalid email address format.');
//         } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//           setErrorMessage('Invalid email address or password.');
//         } else {
//           setErrorMessage(error.message);
//         }
//         console.error(error);
//       });
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
//             placeholder="Email"
//             onChangeText={(text) => setEmail(text)}
//             value={email}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             secureTextEntry
//             onChangeText={(text) => setPassword(text)}
//             value={password}
//           />

//           <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>
//           {errorMessage.length > 0 && <Text style={styles.errorMessage}>{errorMessage}</Text>}
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
//   errorMessage: {
//     color: 'red',
//     marginBottom: 10,
//     textAlign: 'center',
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
//     color: '#38598b',
//     fontWeight: 'bold',
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



import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, ActivityIndicator, Pressable, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Added state to manage password visibility
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
    const [loggedInStatus, setLoggedInStatus] = useState(false);
    const [welcomeUserName, setWelcomeUserName] = useState('');

    const signIn = async () => {
        try {
            setLoading(true);
            setEmail(email.trim());

            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                intermediateSignUp(user);
                navigation.replace('NavBar'); // Navigate to the home screen
            })
            .catch((e) => {
                if (e.code === 'auth/invalid-credential') setErrorMessage("Wrong Password");
                if (e.code === 'auth/user-not-found') setErrorMessage('No account matches this email');
                else console.log(e);
                setLoading(false);
            });
            setLoading(false);
        } catch (e) {
            if (e.code === 'auth/invalid-credential') setErrorMessage("Wrong Password");
            if (e.code === 'auth/user-not-found') setErrorMessage('No account matches this email');
            else console.log(e);
            setLoading(false);
        }
    };

    const intermediateSignUp = async (user) => {
        if (user.emailVerified) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
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
                setWelcomeUserName(userName);
                if (isRememberMeChecked == true) {
                    const loggedUserInfoString = JSON.stringify(loggedUserInfo);
                    AsyncStorage.setItem('userData', loggedUserInfoString)
                        .then(() => {
                            console.log('Data stored successfully!');
                        })
                        .catch((error) => {
                            console.log('Error storing data:', error);
                        });
                }
                setEmail('');
                setPassword('');
                setLoading(false);
                setLoggedInStatus(true);
            });
        } else {
            alert("Please verify your email first.");
        }
    };

    return (
        <ImageBackground source={require('../assets/bg.jpeg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/logo.png')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => { setEmail(text); setErrorMessage(''); }}
                        value={email}
                        autoCapitalize="none"
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholderTextColor="#aaaaaa"
                            secureTextEntry={!showPassword}
                            placeholder='Password'
                            onChangeText={(text) => { setPassword(text); setErrorMessage('') }}
                            value={password}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#aaaaaa" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            style={styles.checkbox}
                            value={isRememberMeChecked}
                            onValueChange={() => setIsRememberMeChecked(!isRememberMeChecked)}
                            color={isRememberMeChecked ? '#e80909' : undefined}
                        />
                        <Text style={styles.checkboxLabel}>Keep me logged in</Text>
                    </View>
                    {errorMessage.length > 0 && <Text style={styles.errorMessage}>*{errorMessage}*</Text>}
                    <TouchableOpacity
                        disabled={password.length == 0 || email.length == 0}
                        style={styles.button}
                        onPress={signIn}>
                        <Text style={styles.buttonTitle}>
                            {loading ? <ActivityIndicator size={18} color={"#fff"} /> : "Log in"}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Don't have an account? <Text onPress={() => {
                            setEmail('');
                            setPassword('');
                            setErrorMessage('')
                            navigation.navigate('SignUp')
                        }} style={styles.footerLink}>Sign up</Text></Text>
                    </View>
                </View>
                <Modal
                    visible={loggedInStatus}
                    animationType="fade"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Ionicons name="md-person" size={64} color="#e80505" />
                            <Text style={styles.welcomeText}>
                                Welcome, <Text style={styles.usernameText}>{welcomeUserName}</Text>
                            </Text>
                            <TouchableOpacity style={styles.cancelButton}
                                onPress={() => {
                                    setLoggedInStatus(false);
                                    navigation.replace('BlogPage');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Enter the Area 51</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
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
          logo: {
            alignSelf: 'center',
            height: 120,
            width: 120,
            marginBottom: 8,
            marginTop: 15
          },
    input: {
        height: 40,
        width: '100%',
        borderColor: '#38598b',
        borderRadius:16,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderWidth: 2,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#38598b',
        marginBottom: 20,
        width: '100%',
        borderRadius:16,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    eyeIcon: {
        padding: 10,
        color:'#38598b',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
      backgroundColor: '#38598b',
      padding: 15,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonTitle: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    footerView: {
        flexDirection: 'row',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: '#38598b',
    },
    footerLink: {
        fontSize: 16,
        color: '#007bff',
        marginLeft: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        marginBottom: 10,
    },
    usernameText: {
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    cancelButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        borderColor: '#38598b',
    },
    checkbox: {
        alignSelf: 'center',
    },
    checkboxLabel: {
        marginLeft: 8,
    },
});


    
