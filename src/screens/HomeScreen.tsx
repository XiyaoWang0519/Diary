import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {ReactNode} from 'react';
import UserService from '../services/UserService';

type RootStackParamList = {
  Home: undefined;
  VoiceDiary: undefined;
  DiaryEntry: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({navigation}): ReactNode => {
  const [isPremium, setIsPremium] = useState<boolean>(false);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const userService = UserService.getInstance();
    const premium = await userService.isPremiumUser();
    setIsPremium(premium);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DiaryApp</Text>
      <Text style={styles.subtitle}>Your Personal AI-Powered Diary</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('DiaryEntry')}
        >
          <Text style={styles.buttonText}>Write New Diary Entry</Text>
          <Text style={styles.buttonSubtext}>
            Transform simple thoughts into beautiful diary entries
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, !isPremium && styles.premiumButton]}
          onPress={() => navigation.navigate('VoiceDiary')}
          disabled={!isPremium}
        >
          <Text style={styles.buttonText}>Voice Diary</Text>
          <Text style={styles.buttonSubtext}>
            {isPremium
              ? 'Create diary entries using your voice'
              : 'Upgrade to Premium to unlock voice diary'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.memoryFeature}>
        🧠 Your diary gets smarter with every entry, creating more personalized content
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  premiumButton: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  memoryFeature: {
    marginTop: 40,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
