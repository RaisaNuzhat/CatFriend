import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SettingsScreen = () => {
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
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Logout</Text>
        <Text style={styles.settingAction} /* Add functionality to handle logout */>Logout</Text>
      </View>
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
