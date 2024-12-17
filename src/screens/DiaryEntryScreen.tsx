import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DiaryEntryScreen: React.FC = () => {
  const [entry, setEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousEntries, setPreviousEntries] = useState<string[]>([]);
  const navigation = useNavigation();

  React.useEffect(() => {
    loadPreviousEntries();
  }, []);

  const loadPreviousEntries = async () => {
    try {
      const entries = await AsyncStorage.getItem('previousEntries');
      if (entries) {
        setPreviousEntries(JSON.parse(entries));
      }
    } catch (error) {
      console.error('Error loading previous entries:', error);
    }
  };

  const handleSubmit = async () => {
    if (!entry.trim()) return;

    setIsSubmitting(true);
    try {
      // Store the entry locally for memory feature
      const updatedEntries = [entry, ...previousEntries].slice(0, 5);
      await AsyncStorage.setItem('previousEntries', JSON.stringify(updatedEntries));
      setPreviousEntries(updatedEntries);

      // Clear the input
      setEntry('');

      // TODO: Send to backend for processing in step 008
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToVoiceDiary = () => {
    navigation.navigate('VoiceDiary' as never);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write your thoughts..."
          value={entry}
          onChangeText={setEntry}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Diary Entry</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.voiceButton}
          onPress={navigateToVoiceDiary}
        >
          <Text style={styles.buttonText}>Try Voice Diary (Premium)</Text>
        </TouchableOpacity>

        {previousEntries.length > 0 && (
          <View style={styles.previousEntriesContainer}>
            <Text style={styles.sectionTitle}>Previous Entries</Text>
            {previousEntries.map((prevEntry, index) => (
              <View key={index} style={styles.previousEntry}>
                <Text numberOfLines={2}>{prevEntry}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    height: 150,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  voiceButton: {
    backgroundColor: '#5856D6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previousEntriesContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  previousEntry: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default DiaryEntryScreen;
