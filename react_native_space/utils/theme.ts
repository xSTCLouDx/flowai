import { Platform } from 'react-native';

export const colors = {
  // Primary colors
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  purple: '#8B5CF6',
  purpleDark: '#7C3AED',
  
  // Semantic colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Dark theme
  dark: {
    background: '#0A0A0A',
    surface: '#111111',
    elevated: '#1A1A1A',
    border: 'rgba(255,255,255,0.1)',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
  },
  
  // Light theme
  light: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    elevated: '#FFFFFF',
    border: '#E5E7EB',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
  },
  
  // Priority colors
  priority: {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#3B82F6',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  display: {
    fontSize: 32,
    fontFamily: Platform.select({
      ios: 'Poppins-Bold',
      android: 'Poppins-Bold',
      default: 'Poppins-Bold, System, Arial, sans-serif',
    }),
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  heading: {
    fontSize: 22,
    fontFamily: Platform.select({
      ios: 'Poppins-SemiBold',
      android: 'Poppins-SemiBold',
      default: 'Poppins-SemiBold, System, Arial, sans-serif',
    }),
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  subheading: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'Poppins-Medium',
      android: 'Poppins-Medium',
      default: 'Poppins-Medium, System, Arial, sans-serif',
    }),
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'Inter-Regular',
      default: 'Inter-Regular, System, Arial, sans-serif',
    }),
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Inter-Medium',
      android: 'Inter-Medium',
      default: 'Inter-Medium, System, Arial, sans-serif',
    }),
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      android: 'Inter-Regular',
      default: 'Inter-Regular, System, Arial, sans-serif',
    }),
    fontWeight: '400' as const,
    lineHeight: 18,
  },
};

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
};
