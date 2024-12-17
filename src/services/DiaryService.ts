import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry, User } from '../types';

class DiaryService {
  private static instance: DiaryService;
  private baseUrl: string;

  private constructor() {
    // TODO: Replace with actual backend URL in step 009
    this.baseUrl = 'http://localhost:8000';
  }

  public static getInstance(): DiaryService {
    if (!DiaryService.instance) {
      DiaryService.instance = new DiaryService();
    }
    return DiaryService.instance;
  }

  async createDiaryEntry(content: string): Promise<DiaryEntry> {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseUrl}/diary/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create diary entry');
      }

      const data = await response.json();
      return {
        id: data.id,
        content: data.content,
        enhanced_content: data.enhanced_content,
        created_at: data.created_at,
        context: data.context,
        user_id: userId,
      };
    } catch (error) {
      console.error('Error creating diary entry:', error);
      throw error;
    }
  }

  async getPreviousEntries(limit: number = 5): Promise<DiaryEntry[]> {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(
        `${this.baseUrl}/diary/user/${userId}?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch diary entries');
      }

      const entries = await response.json();
      return entries.map((entry: DiaryEntry) => ({
        id: entry.id,
        content: entry.content,
        enhanced_content: entry.enhanced_content,
        created_at: entry.created_at,
        context: entry.context,
        user_id: userId,
      }));
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      throw error;
    }
  }

  async isPremiumUser(): Promise<boolean> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) {
        return false;
      }
      const user: User = JSON.parse(userJson);
      return user.isPremium;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }
}

export default DiaryService;
