import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { colors, typography, spacing, borderRadius } from '../../utils/theme';
import { authService } from '../../services/auth';
import { setToken } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const router = useRouter();
  const { loadUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'flowai',
    path: 'auth/callback',
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const authUrl = authService.getGoogleAuthUrl(redirectUri);
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result?.type === 'success' && result?.url) {
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        
        if (token) {
          await setToken(token);
          await loadUser();
          router.replace('/(tabs)/home');
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.purple]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="checkmark-circle" size={80} color="#FFFFFF" />
          <Text style={styles.title}>FlowAI</Text>
          <Text style={styles.tagline}>Sua produtividade potencializada por IA</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Entrar com Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Ionicons name="logo-google" size={20} color="#FFFFFF" />
            <Text style={styles.secondaryButtonText}>
              {isLoading ? 'Carregando...' : 'Entrar com Google'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text style={styles.linkText}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.xl,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    ...typography.display,
    color: '#FFFFFF',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: spacing.base,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
  },
  linkText: {
    ...typography.body,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
