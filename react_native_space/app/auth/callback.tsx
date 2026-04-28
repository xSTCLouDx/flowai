import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing } from '../../utils/theme';
import { setToken } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

export default function CallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { loadUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = params?.token as string | undefined;
      
      if (token) {
        await setToken(token);
        await loadUser();
        router.replace('/(tabs)/home');
      } else {
        router.replace('/auth/welcome');
      }
    };

    handleCallback();
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Autenticando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.base,
  },
  text: {
    ...typography.body,
    color: colors.dark.textSecondary,
  },
});
