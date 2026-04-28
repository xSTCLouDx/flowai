import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://79e16ed8b.preview.abacusai.app';

// Helper to get/set token based on platform
const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('token');
  }
  return await SecureStore.getItemAsync('token');
};

const setToken = async (token: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem('token', token);
  } else {
    await SecureStore.setItemAsync('token', token);
  }
};

const removeToken = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.removeItem('token');
  } else {
    await SecureStore.deleteItemAsync('token');
  }
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: new URL('/api', API_URL).toString(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  transformRequest: [
    (data) => {
      if (data && typeof data === 'object') {
        return JSON.stringify(data);
      }
      return data;
    },
  ],
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token && config?.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error?.response?.status === 401) {
      // Token expired or invalid - logout
      await removeToken();
      // You could trigger a logout event here
    }
    return Promise.reject(error);
  }
);

export { api, getToken, setToken, removeToken };
