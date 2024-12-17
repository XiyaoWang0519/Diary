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
import DiaryService from '../services/DiaryService';
import { DiaryEntry } from '../types';

const DiaryEntryScreen: React.FC = () => {
  const [content, setContent] = useState('');
  const [previousEntries, setPreviousEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const navigation = useNavigation();
  const diaryService = DiaryService.getInstance();

  useEffect(() => {
    loadPreviousEntries();
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const premium = await diaryService.isPremiumUser();
    setIsPremium(premium);
  };

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
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const newEntry = await diaryService.createDiaryEntry(content);
      setContent('');
      await loadPreviousEntries(); // Reload entries to include the new one
    } catch (error) {
      console.error('Error submitting diary entry:', error);
      Alert.alert('Error', 'Failed to create diary entry');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToVoiceDiary = () => {
    if (isPremium) {
      navigation.navigate('VoiceDiary' as never);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Write your thoughts..."
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Entry</Text>
          )}
        </TouchableOpacity>
        {isPremium && (
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={navigateToVoiceDiary}
          >
            <Text style={styles.buttonText}>Voice Entry</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.previousEntriesContainer}>
        <Text style={styles.sectionTitle}>Previous Entries</Text>
        {previousEntries.map((entry, index) => (
          <View key={entry.id || index} style={styles.previousEntry}>
            <Text style={styles.entryContent}>{entry.enhanced_content || entry.content}</Text>
            <Text style={styles.timestamp}>{formatDate(entry.created_at)}</Text>
            {entry.context && (
              <Text style={styles.contextText}>
                Entry {entry.context.entry_count} - Memory Context: {entry.context.analysis}
              </Text>
            )}
          </View>
        ))}
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
    paddingHorizontal: 20,
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
    marginBottom: 5,
  },
  contextText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
});
