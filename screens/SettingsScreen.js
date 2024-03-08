import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ImageBackground, TextInput, Button, Modal, FlatList, ScrollView, Alert } from 'react-native';
import { auth, db } from '../firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackFields, setFeedbackFields] = useState([
    { label: 'Overall Experience', value: 'experience' },
    { label: 'Bugs/Issues Encountered', value: 'bugs', options: ['Bug', 'Issue', 'Crash', 'Other'] },
    { label: 'Feature Requests', value: 'features' },
  ]);
  const [feedbackValues, setFeedbackValues] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const bugOptions = ['Bug', 'Issue', 'Crash', 'Other'];

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.replace('LogIn');
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  };



 



const handleEmailSubmit = async () => {
  // Simple email validation
  if (!validateEmail(userEmail)) {
    Alert.alert('Invalid Email', 'Please enter a valid email address.');
    return;
  }
  
  try {
    // Check if the email exists in the "users" collection
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // If no document with the provided email exists in the "users" collection
      Alert.alert('Invalid Email', 'Please provide a registered email address.');
      return;
    }

    setShowFeedbackForm(true);
  } catch (error) {
    console.error('Error during email submission:', error);
    Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
  }
};

  

  
  

  const handleFeedbackSubmit = () => {
    // Handle feedback submission
    console.log('Feedback submitted:', feedbackValues);
    // Show success alert
    Alert.alert('Success', 'Feedback submitted successfully.');
    // Reset form state
    setFeedbackValues({});
    setShowFeedbackForm(false);
  };

  const handleInputChange = (fieldName, text) => {
    setFeedbackValues({ ...feedbackValues, [fieldName]: text });
  };

  const handleOptionSelect = (value) => {
    setFeedbackValues({ ...feedbackValues, bugs: value }); // Update feedback value with selected option
    setModalVisible(false);
  };

  const renderFeedbackFields = () => {
    return feedbackFields.map((field, index) => (
      <View key={index}>
        <Text style={styles.label}>{field.label}</Text>
        {field.value !== 'bugs' ? (
          <TextInput
            style={styles.input}
            placeholder={`Enter ${field.label}`}
            onChangeText={(text) => handleInputChange(field.value, text)}
            value={feedbackValues[field.value] || ''}
          />
        ) : (
          <View>
            <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownText}>{feedbackValues[field.value] || 'Select an option'}</Text>
                <Icon name="angle-down" size={20} color="#000" style={styles.dropdownIcon} />
              </View>
            </TouchableOpacity>
            {feedbackValues.bugs && (
              <View>
                <Text style={styles.label}>Additional Details:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter additional details"
                  onChangeText={(text) => handleInputChange('bugDetails', text)}
                  value={feedbackValues['bugDetails'] || ''}
                />
              </View>
            )}
          </View>
        )}
      </View>
    ));
  };

  const validateEmail = (email) => {
    // Very basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch /* Add functionality to handle notifications */ />
          </View>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Text style={styles.settingAction} /* Add functionality to handle password change */>Change</Text>
          </View>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <Text style={styles.settingLabel}>Logout</Text>
            <Text style={styles.settingAction}>Logout</Text>
          </TouchableOpacity>
          {!showFeedbackForm ? (
            <View>
              <Text style={styles.sectionTitle}>Provide Email for Feedback</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                onChangeText={setUserEmail}
                value={userEmail}
              />
              <Button title="Submit Email" onPress={handleEmailSubmit} />
            </View>
          ) : (
            <View>
              <Text style={styles.sectionTitle}>Feedback Form</Text>
              {renderFeedbackFields()}
              <Button title="Submit Feedback" onPress={handleFeedbackSubmit} />
            </View>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <FlatList
                  data={bugOptions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.modalOption} onPress={() => handleOptionSelect(item)}>
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingAction: {
    color: '#007bff', // Link color
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownIcon: {
    marginLeft: 10,
  },
});

export default SettingsScreen;
