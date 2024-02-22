import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase'; // Assuming you have imported auth from firebase
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.replace('LogIn');
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>General Settings</Text>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch /* Add functionality to handle notifications */ />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch /* Add functionality to toggle dark mode */ />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

export default SettingsScreen;
