import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ReactNode } from 'react';
import VoiceService from '../services/VoiceService';
import type { VoiceState } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  VoiceDiary: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'VoiceDiary'>;

const VoiceDiaryScreen: React.FC<Props> = ({ navigation }): ReactNode => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isRecording: false,
    error: null,
    results: [],
  });
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkPremiumStatus();
    return () => {
      cleanup();
    };
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const voiceService = VoiceService.getInstance();
      const premium = await voiceService.isPremiumUser();
      setIsPremium(premium);
      if (premium) {
        await setupVoice();
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupVoice = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      });

      if (permission) {
        const result = await request(permission);
        if (result !== RESULTS.GRANTED) {
          setVoiceState(prev => ({ ...prev, error: 'Microphone permission denied' }));
          return;
        }
      }
    } catch (error) {
      console.error('Error setting up voice:', error);
      setVoiceState(prev => ({ ...prev, error: 'Failed to setup voice recording' }));
    }
  };

  const cleanup = async () => {
    try {
      const voiceService = VoiceService.getInstance();
      await voiceService.destroy();
    } catch (error) {
      console.error('Error cleaning up:', error);
    }
  };

  const startRecording = async () => {
    try {
      const voiceService = VoiceService.getInstance();
      await voiceService.startRecording();
      setVoiceState(prev => ({
        ...prev,
        isRecording: true,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to start recording';
      Alert.alert('Error', errorMessage);
      setVoiceState(prev => ({
        ...prev,
        error: errorMessage,
      }));
    }
  };

  const stopRecording = async () => {
    try {
      const voiceService = VoiceService.getInstance();
      await voiceService.stopRecording();
      setVoiceState(prev => ({
        ...prev,
        isRecording: false,
      }));
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Premium Feature',
      'Would you like to upgrade to premium to use voice features?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Upgrade',
          onPress: async () => {
            // Simulating upgrade for testing
            await AsyncStorage.setItem('isPremiumUser', 'true');
            await checkPremiumStatus();
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isPremium) {
    return (
      <View style={styles.container}>
        <Text style={styles.premiumText}>
          Voice diary is a premium feature that allows you to create diary entries by simply talking.
        </Text>
        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
          <Text style={styles.buttonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Diary</Text>
      <TouchableOpacity
        style={[styles.button, voiceState.isRecording && styles.buttonRecording]}
        onPress={voiceState.isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {voiceState.isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      {voiceState.error && (
        <Text style={styles.errorText}>{voiceState.error}</Text>
      )}
      {voiceState.results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Your diary entry:</Text>
          <Text style={styles.resultsText}>{voiceState.results[0]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
  },
  buttonRecording: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 10,
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: '100%',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultsText: {
    fontSize: 16,
    lineHeight: 24,
  },
  premiumText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  upgradeButton: {
    backgroundColor: '#FFB100',
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
  },
});

export default VoiceDiaryScreen;
