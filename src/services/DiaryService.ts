import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DiaryEntry {
  content: string;
  enhancedContent?: string;
  timestamp: number;
  userId: string;
}

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
        content: data.content,
        enhancedContent: data.enhanced_content,
        timestamp: Date.now(),
        userId,
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

      const data = await response.json();
      return data.entries.map((entry: any) => ({
        content: entry.content,
        enhancedContent: entry.enhanced_content,
        timestamp: new Date(entry.created_at).getTime(),
        userId,
      }));
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      throw error;
    }
  }
}

export default DiaryService;
