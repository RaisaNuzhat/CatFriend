import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ImageBackground, TextInput, Button, Modal, FlatList } from 'react-native';
import { auth } from '../firebase'; // Assuming you have imported auth from firebase
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackFields, setFeedbackFields] = useState([
    { label: 'Overall Experience', value: 'experience' },
    { label: 'Bugs/Issues Encountered', value: 'bugs' },
    { label: 'Feature Requests', value: 'features' },
  ]);
  const [feedbackValues, setFeedbackValues] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.replace('LogIn');
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  };

  const handleEmailSubmit = () => {
    // Perform validation or checks if needed
    setShowFeedbackForm(true);
  };

  const handleFeedbackSubmit = () => {
    // Handle feedback submission
    console.log('Feedback submitted:', feedbackValues);
  };

  const handleInputChange = (fieldName, text) => {
    setFeedbackValues({ ...feedbackValues, [fieldName]: text });
  };

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
    setModalVisible(false);
  };

  const renderFeedbackFields = () => {
    return feedbackFields.map((field, index) => (
      <View key={index}>
        <Text style={styles.label}>{field.label}</Text>
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text>{feedbackValues[field.value] || 'Select an option'}</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.backgroundImage}>
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
                data={feedbackFields}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalOption} onPress={() => handleOptionSelect(item.value)}>
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
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
    marginBottom: 15,
  },
});

export default SettingsScreen;
