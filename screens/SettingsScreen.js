import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, Button, Modal, FlatList, ScrollView, Alert } from 'react-native';
import { db } from '../firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showDistrictInput, setShowDistrictInput] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const [countries, setCountries] = useState(['USA', 'UK', 'Canada', 'Bangladesh']); // Updated countries
const [districts, setDistricts] = useState({
  'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'San Francisco'],
  'UK': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'],
  'Bangladesh': [
    'Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Barisal', 'Sylhet', 'Rangpur',
    
    'Mymensingh', 'Comilla', 'Jessore', 'Narayanganj', 'Bogra', 'Dinajpur', 'Tangail',
    'Faridpur', 'Jamalpur', 'Natore', 'Pabna', 'Saidpur', 'Naogaon', 'Kushtia', 'CoxsBazar',
    'Tongi', 'Brahmanbaria', 'Feni', 'Sirajganj', 'Gazipur', 'Noakhali', 'Maulvi Bazar', 'Bagerhat',
    'Sherpur', 'Joypurhat', 'Chandpur', 'Meherpur', 'Thakurgaon', 'Magura', 'Bhola', 'Manikganj',
    'Chapainawabganj', 'Patuakhali', 'Pirojpur', 'Kishoreganj', 'Jhenaidah', 'Shariatpur', 'Lakshmipur',
    'Khagrachari', 'Netrokona', 'Sunamganj', 'Panchagarh', 'Bandarban', 'Satkhira', 'Narsingdi',
    'Narail', 'Gopalganj', 'Nilphamari', 'Habiganj', 'Madaripur', 'Rangamati', 'Shariatpur'
  ]
});

  const [feedbackValues, setFeedbackValues] = useState({
    country: '',
    district: '',
    feedback: ''
  });
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData'); 
      navigation.replace('LogIn'); 
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const handleEmailSubmit = async () => {
  
    setSelectedCountry('');
    setSelectedDistrict('');
    setFeedbackValues({
      country: '',
      district: '',
      feedback: ''
    });
    setShowDistrictInput(false);
    setShowFeedbackInput(false);
    setModalVisible(false);
    setShowFeedbackForm(true);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowDistrictInput(true);
    setFeedbackValues({ ...feedbackValues, country });
    setModalVisible(false);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setShowFeedbackInput(true);
    setFeedbackValues({ ...feedbackValues, district });
    setModalVisible(false);
  };

  const handleFeedbackSubmit = () => {
    // Handle feedback submission
    console.log('Feedback submitted:', feedbackValues);
    // Show success alert
    Alert.alert('Success', 'Feedback submitted successfully.');
    // Reset form state
    setFeedbackValues({
      country: '',
      district: '',
      feedback: ''
    });
    setShowFeedbackForm(false);
  };

  const renderFeedbackForm = () => {
    return (
      <View>
        <Text style={styles.label}>Country</Text>
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownText}>{selectedCountry || 'Select a country'}</Text>
            <Icon name="angle-down" size={20} color="#000" style={styles.dropdownIcon} />
          </View>
        </TouchableOpacity>
        {showDistrictInput && (
          <View>
            <Text style={styles.label}>District</Text>
            <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownText}>{selectedDistrict || 'Select a district'}</Text>
                <Icon name="angle-down" size={20} color="#000" style={styles.dropdownIcon} />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {showFeedbackInput && (
          <View>
            <Text style={styles.label}>Feedback</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your feedback"
              onChangeText={(text) => setFeedbackValues({ ...feedbackValues, feedback: text })}
              value={feedbackValues.feedback}
              multiline
            />
            <Button title="Submit Feedback" onPress={handleFeedbackSubmit} />
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground source={require('../assets/background.jpeg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
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
              {renderFeedbackForm()}
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
                  data={selectedCountry ? districts[selectedCountry] : countries}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalOption}
                      onPress={selectedCountry ? () => handleDistrictSelect(item) : () => handleCountrySelect(item)}
                    >
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
    color: '#007bff', 
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
