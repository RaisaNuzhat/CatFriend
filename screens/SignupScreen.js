import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebase';
import { Timestamp, addDoc, collection, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { FontAwesome } from '@expo/vector-icons';
import { gsap } from 'gsap-rn';

export default function SignUpScreen({ navigation }) {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [userNameErrorMessage, setUserNameErrorMessage] = useState(['', ''])
  const [birthDate, setBirthDate] = useState(moment(new Date()).format('DD/MM/YYYY'))
  const [birthDateModalStatus, setBirthDateModalStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const viewRef = useRef(null);

  const userNameMessages = [
    ["This is a unique Username", 'green'],
    ["The Username has already been taken.", 'red'],
    ['', '']
  ]

  const setAllNone = () => {
    setErrorMessage('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setUserName('')
    setBirthDate('')
    setUserNameErrorMessage(['', ''])
  }

  useEffect(() => {
    const checkUniqueUserName = async () => {
      if (userName !== '') {
        try {
          const userRef = collection(db, "users")
          const q = query(userRef, where('userName', '==', userName))
          const querySnapshot = await getDocs(q);
          if (querySnapshot.size == 0) setUserNameErrorMessage(userNameMessages[0])
          else setUserNameErrorMessage(userNameMessages[1])
        } catch (e) {
          console.log(e)
        }
      } else setUserNameErrorMessage(userNameMessages[2])
    };
    checkUniqueUserName()

  }, [userName])

  const doFireBaseUpdate = async () => {
    const usersRef = collection(db, 'users');
    try {

      const docRef = await addDoc(usersRef, {
        "userName": userName,
        "email": email,
        "dp_url": "images/avatar.png",
        "joiningDate": Timestamp.fromDate(new Date()),
        'birthday': birthDate,
        "user_id": ''
      });

      updateDoc(doc(db, "users", docRef.id), { "user_id": docRef.id })
    } catch (e) {
      console.log(e)
    }
  }

  const registerWithEmail = async () => {
    try {
      setLoading(true)
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      try {
        await sendEmailVerification(user)
        console.log('Email verification link sent successfully')
      } catch (e) {
        alert("Something went wrong")
        console.log(e)
      }
      setAllNone()
      doFireBaseUpdate()
      setLoading(false)
      alert("Account Created! Please check your email and verify yourself.")
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') setErrorMessage("Email has already been used")
      else if (e.code === 'auth/weak-password') setErrorMessage("Please provide a strong password")
      else if (e.code === 'auth/invalid-email') setErrorMessage("Please provide a valid email")
      alert(e.code)
      setLoading(false)
    }
  }

  const onSignUpPress = async () => {
    if (email.length === 0 || password.length === 0 || userName.length === 0) {
      setErrorMessage("Please provide all the necessary information");
    } else if (email.length > 0 && password.length > 0 && confirmPassword.length > 0 && userName.length > 0) {
      if (password === confirmPassword ) registerWithEmail();
      else if (password !== confirmPassword) setErrorMessage("Passwords do not match");
      //else setErrorMessage("Please provide a valid username");
    } else {
      setErrorMessage("Something is missing!");
    }
  };

  useEffect(() => {
    const view = viewRef.current;
    gsap.to(view, { duration: 1, transform: { rotate: 360, scale: 1 } });
  }, [])

  return (
    <ImageBackground
      source={require('../assets/bg.jpeg')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Image
            ref={viewRef}
            style={styles.logo}
            source={require('../assets/logo.png')}
          />
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            placeholder='User Name'
            onChangeText={(text) => setUserName(text)}
            value={userName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          {userNameErrorMessage[0].length > 0 && userName.length > 0 && <Text style={{ color: userNameErrorMessage[1], paddingLeft: 20, fontSize: 13 }}>*{userNameErrorMessage[0]}*</Text>}
          <TextInput
            style={styles.input}
            placeholder='E-mail'
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => { setEmail(text); setErrorMessage(''); }}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder='Password'
            onChangeText={(text) => { setPassword(text); setErrorMessage('') }}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder='Confirm password'
            onChangeText={(text) => { setConfirmPassword(text); setErrorMessage(''); }}
            value={confirmPassword}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.birthdayPicker}
            onPress={() => setBirthDateModalStatus(true)}>
            <Text style={{ marginTop: 10, fontWeight: '300', color: '#353635', fontSize: 16 }}>
              <FontAwesome name="birthday-cake" size={22} color="#e80505" /> &nbsp; &nbsp;
              {birthDate}
            </Text>
          </TouchableOpacity>
          {birthDateModalStatus && <DateTimePicker
          testID="dateTimePicker"
          value={moment(birthDate, 'DD/MM/YYYY').toDate()}
          mode="date"

          onChange={(e, date) => {
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();

            const formattedDate = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year.toString()}`;

            setBirthDate(formattedDate)
            setBirthDateModalStatus(false);
          }}
        />}
          {errorMessage.length > 0 && <Text style={{ color: 'red', textAlign: 'center' }}>*{errorMessage}*</Text>}
          <TouchableOpacity
            disabled={password.length == 0 || email.length == 0}
            style={styles.button}
            onPress={() => onSignUpPress()}>
            <Text style={styles.buttonTitle}>
              {loading ? <ActivityIndicator size={20} color={"#fff"} /> : "Sign up"}
            </Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>Already have an account? <Text onPress={() => {
              setAllNone()
              navigation.navigate('LogIn')
            }} style={styles.footerLink}>Log In</Text></Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    
    // justifyContent: 'center',
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
    marginBottom: 10,
  },
  logo: {
    alignSelf: 'center',
    height: 120,
    width: 120,
    marginBottom: 8,
    marginTop: 15
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#38598b',
    fontWeight: 'bold',
    textAlign: 'center',
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
  birthdayPicker: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    color: 'blue',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 16
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
    fontSize: 18,
  },
  footerView: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#38598b',
  },
  footerLink: {
    color: '#FF004D',
    fontWeight: 'bold',
    fontSize: 16,
  },
});





// import React, { useRef, useState } from 'react'
// import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import {createUserWithEmailAndPassword, sendEmailVerification  } from 'firebase/auth';
// import { auth, db } from '../firebase';
// import { Timestamp, addDoc, collection, doc, updateDoc,query, where,getDocs } from 'firebase/firestore';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import moment from 'moment';
// import { FontAwesome } from '@expo/vector-icons';
// import { useEffect } from 'react';
// import {gsap, Back} from 'gsap-rn';



// export default function SignUpScreen({navigation}) {

//     const [userName, setUserName]= useState('')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [confirmPassword, setconfirmPassword] = useState('')
//     const [errorMessage, seterrorMessage] = useState('')
//     const [userNameErrorMessage, setuserNameErrorMessage] = useState(['',''])
//     const [birthDate, setbirthDate] = useState(moment(new Date()).format('DD/MM/YYYY'))
//     const [birthDateModalStatus, setbirthDateModalStatus] = useState(false)
//     const [loading, setloading] = useState(false)

//     const viewRef = useRef(null);


//     const userNameMessages = [
//         ["This is a unique Username",'green'],
//         ["The Username has already been taken.",'red'],
//         ['','']
//     ]

//     const setAllNone = ()=>{
//         seterrorMessage('')
//         setEmail('')
//         setPassword('')
//         setconfirmPassword('')
//         setUserName('')
//         setbirthDate('')
//         setuserNameErrorMessage(['',''])
//     }

//     useEffect(() => {
//         const checkUniqueUserName = async ()=>{
//             if(userName!=''){    
//                 try{
//                     const userRef = collection(db, "users")
//                     const q = query(userRef,where('userName', '==', userName))
//                     const querySnapshot = await getDocs(q);
//                     if(querySnapshot.size==0) setuserNameErrorMessage(userNameMessages[0])
//                     else setuserNameErrorMessage(userNameMessages[1])
//                 }
//                 catch(e){
//                     console.log(e)
//                 }
//             }
//             else setuserNameErrorMessage(userNameMessages[2])
//         }
//         checkUniqueUserName()
        
//     }, [userName])
    

//     const doFireBaseUpdate = async ()=>{
//         const usersRef = collection(db,'users')
//         try{

//             const docRef = await addDoc(usersRef,{
//                 "userName":userName,
//                 "email":email,
//                 "dp_url":"images/avatar.png",
//                 "joiningDate": Timestamp.fromDate(new Date()),
//                 'birthday':birthDate,
//                 "user_id":''
//             });
            
//             updateDoc(doc(db,"users",docRef.id),{"user_id":docRef.id})
//         }
//         catch(e){
//             console.log(e)
//         }
//     }
    

//     const registerWithEmail = async () => {
//         try {
//             setloading(true)
//             const {user} = await createUserWithEmailAndPassword(auth,email, password)
//             try {
//                 await sendEmailVerification(user);
//                 console.log('Email verification link sent successfully');
//             }
//             catch(e){
//                 alert("Something went wrong")
//                 console.log(e)
//             }
//             setAllNone()
//             doFireBaseUpdate()
//             setloading(false)
//             alert("Account Created! Please check your email and verify yourself.");
//         }
//         catch(e){
//             if(e.code==='auth/email-already-in-use') seterrorMessage("Email has already been used")
//             else if(e.code==='auth/weak-password') seterrorMessage("Please provide a strong password")
//             else if(e.code === 'auth/invalid-email') seterrorMessage("Please provide a valid email")
//             alert(e.code)
//             setloading(false)
//         }
//     }

//     const onSingUpPress = async ()=>{
//         if(email.length==0 || password.length == 0 || userName.length == 0){
//             seterrorMessage("Please provide all the necessarry informations")
//         }
//         else if(email.length>0 && password.length>0 && confirmPassword.length>0 && userName.length>0) {
//             if(password===confirmPassword && userNameErrorMessage[1]=='green') registerWithEmail()
//             else if(password!==confirmPassword) seterrorMessage("Passwords do not match")
//             else seterrorMessage("Please provide a valid username")
//         }
//         else{
//             seterrorMessage("Something is missing!")
//         }
//     }

//     useEffect(() => {
//         const view = viewRef.current;
//         gsap.to(view, {duration:1, transform:{rotate:360, scale:1}, 	ease:Back.easeInOut});
//     }, [])

//     return (
//         <View style={styles.container}>
//             <ScrollView style={{backgroundColor:'#fff',height:'100%'}} showsVerticalScrollIndicator={false}>
//                 <Image
//                     ref={viewRef}
//                     style={styles.logo}
//                     source={require('../assets/logo.png')}
//                 />
//                     <TextInput
//                         style={styles.input}
//                         placeholderTextColor="#aaaaaa"
//                         placeholder='User Name'
//                         onChangeText={(text) => {
//                             setUserName(text); 
//                         }}
//                         value={userName}
//                         underlineColorAndroid="transparent"
//                         autoCapitalize="none"
//                     />
//                     {userNameErrorMessage[0].length>0 && userName.length>0 && <Text style={{color:userNameErrorMessage[1],paddingLeft:20,fontSize:13}}>{userNameErrorMessage[0]}</Text>}
//                     <TextInput
//                         style={styles.input}
//                         placeholder='E-mail'
//                         placeholderTextColor="#aaaaaa"
//                         onChangeText={(text) => {setEmail(text);  seterrorMessage('');}}
//                         value={email}
//                         underlineColorAndroid="transparent"
//                         autoCapitalize="none"
//                     />
//                     <TextInput
//                         style={styles.input}
//                         placeholderTextColor="#aaaaaa"
//                         secureTextEntry
//                         placeholder='Password'
//                         onChangeText={(text) => {setPassword(text); seterrorMessage('')}}
//                         value={password}
//                         underlineColorAndroid="transparent"
//                         autoCapitalize="none"
//                     />
//                     <TextInput
//                         style={styles.input}
//                         placeholderTextColor="#aaaaaa"
//                         secureTextEntry
//                         placeholder='Confirm password'
//                         onChangeText={(text) => {setconfirmPassword(text);   seterrorMessage('');}}
//                         value={confirmPassword}
//                         underlineColorAndroid="transparent"
//                         autoCapitalize="none"
//                     />
//                     <TouchableOpacity
//                         style={styles.birthdayPicker}
//                         onPress={() => setbirthDateModalStatus(true)}>
//                         <Text style={{marginTop:10,fontWeight:'300',color:'#353635',fontSize:16}}>
//                             <FontAwesome name="birthday-cake" size={22} color="#e80505" /> &nbsp; &nbsp;
//                             {birthDate}
//                         </Text>
//                     </TouchableOpacity>
//                     {birthDateModalStatus && <DateTimePicker
//                         testID="dateTimePicker"
//                         value={moment(birthDate,'DD/MM/YYYY').toDate()}
//                         mode="date"
//                         onChange={(e,date)=>{
//                             const inputMoment = moment.utc(date).isValid() ?
//                             moment.utc(date) : moment.utc();
//                             const formattedDate = inputMoment.format('DD/MM/YYYY');
//                             setbirthDate(formattedDate)
//                             // console.log(formattedDate)
//                             setbirthDateModalStatus(false)
//                         }}
//                     />}
//                     {errorMessage.length>0 && <Text style={{color:'red',textAlign:'center'}}>{errorMessage}</Text>}
//                     <TouchableOpacity
//                         disabled={password.length==0 || email.length==0}
//                         style={styles.button}
//                         onPress={() => onSingUpPress()}>
//                         <Text style={styles.buttonTitle}>
//                             {loading? <ActivityIndicator size={20} color={"#fff"}/>: "Sign up"}
//                         </Text>
//                     </TouchableOpacity>
//                     <View style={styles.footerView}>
//                         <Text style={styles.footerText}>Already have an account? <Text onPress={()=>{
//                             setAllNone()
//                             navigation.navigate('LogIn')
//                             }} style={styles.footerLink}>Log In</Text></Text>
//                     </View>
//             </ScrollView>
//         </View>
//     )
// }


// const styles = StyleSheet.create({
//     container: {
//         backgroundColor:'#fff'
//     },
//     title: {
//         fontSize:22,
//         fontWeight:'600',
//         fontStyle:'italic',
//         marginBottom:20
//     },
//     logo: {
//         alignSelf:'center',
//         // color:"#0274ed",
//         height:150,
//         width:150,
//         marginBottom:20,
//         marginTop:30
//     },
//     input: {
//         height: 48,
//         borderRadius: 5,
//         overflow: 'hidden',
//         backgroundColor: '#f0f0f0',
//         color:'#5591ad',
//         marginTop: 10,
//         marginBottom: 10,
//         marginLeft: 15,
//         marginRight: 15,
//         paddingLeft: 16
//     },
//     birthdayPicker:{
//         height: 48,
//         borderRadius: 5,
//         overflow: 'hidden',
//         backgroundColor: '#f0f0f0',
//         color:'blue',
//         marginTop: 10,
//         marginBottom: 10,
//         marginLeft: 15,
//         marginRight: 15,
//         paddingLeft: 16
//     },
//     button: {
//         backgroundColor: '#e80505',
//         marginLeft: 30,
//         marginRight: 30,
//         marginTop: 20,
//         height: 48,
//         borderRadius: 5,
//         alignItems: "center",
//         justifyContent: 'center'
//     },
//     buttonTitle: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: "bold"
//     },
//     footerView: {
//         flex: 1,
//         alignItems: "center",
//         marginTop: 20,
//         paddingBottom:50,
//     },
//     footerText: {
//         fontSize: 16,
//         color: '#2e2e2d'
//     },
//     footerLink: {
//         color: "#e80505",
//         fontWeight: "bold",
//         fontSize: 16
//     }
// })