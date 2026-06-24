import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';
const AUTH_TOKEN_KEY = '@auth_token';
const AUTH_USER_KEY = '@auth_user';

export interface StorageUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'admin';
  is_active?: boolean;
  addresses?: any[];
}

export const StorageService = {
  async getOnboardingCompleted(): Promise<boolean> {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return value === 'true';
  },

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, completed ? 'true' : 'false');
  },

  async getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },

  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  async getAuthUser(): Promise<StorageUser | null> {
    const value = await AsyncStorage.getItem(AUTH_USER_KEY);
    return value ? JSON.parse(value) : null;
  },

  async setAuthUser(user: StorageUser): Promise<void> {
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};
