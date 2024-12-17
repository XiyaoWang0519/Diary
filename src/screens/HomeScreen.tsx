import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {ReactNode} from 'react';
import UserService from '../services/UserService';

type RootStackParamList = {
  Home: undefined;
  VoiceDiary: undefined;
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
      <Text style={styles.text}>Welcome to DiaryApp</Text>
      {isPremium && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('VoiceDiary')}
        >
          <Text style={styles.buttonText}>Create Voice Diary</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
