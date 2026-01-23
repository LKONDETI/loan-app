import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  const handleRoleSelect = (type: 'User' | 'Client') => {
    navigation.navigate('Login', { type });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Decorative Circle */}
      <View style={styles.circle} />

      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appNameText}>Loan App</Text>
          <Text style={styles.subtitle}>Choose your role to continue</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleRoleSelect('User')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>👤</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.roleTitle}>User</Text>
              <Text style={styles.roleDescription}>
                Access your personal loan dashboard
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleRoleSelect('Client')}
          >
            <View style={[styles.iconContainer, styles.clientIcon]}>
              <Text style={styles.icon}>💼</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.roleTitle}>Client</Text>
              <Text style={styles.roleDescription}>
                Manage your business profile
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  circle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(31, 162, 156, 0.1)',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 48,
  },
  welcomeText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 8,
  },
  appNameText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1B2B5C',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F6F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  clientIcon: {
    backgroundColor: '#EEF0F6',
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 13,
    color: '#888',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
});
