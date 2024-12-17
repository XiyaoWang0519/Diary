import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

class UserService {
  private static instance: UserService;
  private static readonly USER_KEY = '@diary_app_user';

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(UserService.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  public async isPremiumUser(): Promise<boolean> {
    const user = await this.getUser();
    return user?.isPremium || false;
  }

  // For development/testing purposes
  public async setUserPremiumStatus(isPremium: boolean): Promise<void> {
    try {
      const user: User = {
        id: '1', // Placeholder ID
        isPremium
      };
      await AsyncStorage.setItem(UserService.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user premium status:', error);
    }
  }
}

export default UserService;
