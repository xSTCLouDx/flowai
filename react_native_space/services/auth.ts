import { api, setToken, removeToken } from './api';
import { AuthResponse, LoginRequest, SignupRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const data = response?.data;
    if (data?.token) {
      await setToken(data.token);
    }
    return data;
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/signup', data);
    const responseData = response?.data;
    if (responseData?.token) {
      await setToken(responseData.token);
    }
    return responseData;
  },

  async getMe(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response?.data ?? { user: {} as User };
  },

  async logout(): Promise<void> {
    await removeToken();
  },

  getGoogleAuthUrl(redirectUri: string): string {
    const url = new URL('/auth/google', process.env.EXPO_PUBLIC_API_URL || 'https://79e16ed8b.preview.abacusai.app');
    url.searchParams.set('redirect_uri', redirectUri);
    return url.toString();
  },
};
