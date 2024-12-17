import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../UserService';
import type { User } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should check premium status correctly', async () => {
    const mockUser: User = {
      id: '1',
      isPremium: true
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

    const service = UserService.getInstance();
    const isPremium = await service.isPremiumUser();

    expect(isPremium).toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@diary_app_user');
  });

  it('should handle non-premium users', async () => {
    const mockUser: User = {
      id: '1',
      isPremium: false
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

    const service = UserService.getInstance();
    const isPremium = await service.isPremiumUser();

    expect(isPremium).toBe(false);
  });

  it('should handle missing user data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const service = UserService.getInstance();
    const isPremium = await service.isPremiumUser();

    expect(isPremium).toBe(false);
  });
});
