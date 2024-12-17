import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DiaryService, { DiaryEntry } from '../services/DiaryService';

const DiaryEntryScreen: React.FC = () => {
  const [entry, setEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousEntries, setPreviousEntries] = useState<DiaryEntry[]>([]);
  const navigation = useNavigation();
  const diaryService = DiaryService.getInstance();

  useEffect(() => {
    loadPreviousEntries();
  }, []);

  const loadPreviousEntries = async () => {
    try {
      const entries = await diaryService.getPreviousEntries(5);
      setPreviousEntries(entries);
    } catch (error) {
      console.error('Error loading previous entries:', error);
      Alert.alert('Error', 'Failed to load previous entries');
    }
  };

  const handleSubmit = async () => {
    if (!entry.trim()) return;

    setIsSubmitting(true);
    try {
      const newEntry = await diaryService.createDiaryEntry(entry);
      setPreviousEntries([newEntry, ...previousEntries].slice(0, 5));
      setEntry('');
      Alert.alert('Success', 'Diary entry created successfully');
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to create diary entry');
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
                <Text style={styles.entryContent}>{prevEntry.enhancedContent || prevEntry.content}</Text>
                <Text style={styles.timestamp}>
                  {new Date(prevEntry.timestamp).toLocaleDateString()}
                </Text>
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
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  entryContent: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});

export default DiaryEntryScreen;
