import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../utils/theme';
import { useAuthStore } from '../../stores/authStore';
import { usePreferencesStore } from '../../stores/preferencesStore';
import { useEffect } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { preferences, fetchPreferences, updatePreferences } = usePreferencesStore();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/welcome');
          },
        },
      ]
    );
  };

  const handleToggleDarkMode = async (value: boolean) => {
    try {
      await updatePreferences({ darkMode: value });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar as preferências');
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    try {
      await updatePreferences({ notificationsEnabled: value });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar as preferências');
    }
  };

  const handleToggleAISuggestions = async (value: boolean) => {
    try {
      await updatePreferences({ aiSuggestPriority: value });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar as preferências');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={64} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade de editar perfil em breve')}
          >
            <Ionicons name="person-outline" size={24} color={colors.dark.text} />
            <Text style={styles.menuText}>Editar Perfil</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.dark.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Premium Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          
          <TouchableOpacity
            style={styles.premiumCard}
            onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade Premium em breve')}
          >
            <View style={styles.premiumHeader}>
              <Ionicons name="star" size={24} color={colors.warning} />
              <Text style={styles.premiumTitle}>FlowAI Premium</Text>
            </View>
            <Text style={styles.premiumSubtitle}>
              {user?.isPremium ? 'Você é Premium!' : 'Desbloqueie recursos avançados'}
            </Text>
            {!user?.isPremium && (
              <View style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Fazer Upgrade</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          
          <View style={styles.menuItem}>
            <Ionicons name="moon-outline" size={24} color={colors.dark.text} />
            <Text style={styles.menuText}>Modo Escuro</Text>
            <Switch
              value={preferences?.darkMode ?? true}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: colors.dark.textTertiary, true: colors.primary }}
            />
          </View>

          <View style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color={colors.dark.text} />
            <Text style={styles.menuText}>Notificações</Text>
            <Switch
              value={preferences?.notificationsEnabled ?? true}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.dark.textTertiary, true: colors.primary }}
            />
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Em desenvolvimento', 'Seleção de idioma em breve')}
          >
            <Ionicons name="language-outline" size={24} color={colors.dark.text} />
            <Text style={styles.menuText}>Idioma</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuValue}>Português (BR)</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.dark.textTertiary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* AI Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inteligência Artificial</Text>
          
          <View style={styles.menuItem}>
            <Ionicons name="sparkles-outline" size={24} color={colors.dark.text} />
            <Text style={styles.menuText}>Sugestões de IA</Text>
            <Switch
              value={preferences?.aiSuggestPriority ?? true}
              onValueChange={handleToggleAISuggestions}
              trackColor={{ false: colors.dark.textTertiary, true: colors.primary }}
            />
          </View>
        </View>

        {/* Other Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outros</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Em desenvolvimento', 'Análise de produtividade em breve')}
          >
            <Ionicons name="bar-chart-outline" size={24} color={colors.dark.text} />
            <Text style={styles.menuText}>Análise de Produtividade</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.dark.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('FlowAI', 'Versão 1.0.0')}
          >
            <Ionicons name="information-circle-outline" size={24} color={colors.dark.text} />
            <Text style={styles.menuText}>Sobre</Text>
            <Text style={styles.menuValue}>v1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
            <Text style={[styles.menuText, styles.logoutText]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    padding: spacing.base,
  },
  title: {
    ...typography.display,
    color: colors.dark.text,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.dark.textTertiary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  profileCard: {
    backgroundColor: colors.dark.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarContainer: {
    borderRadius: borderRadius.full,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.subheading,
    color: colors.dark.text,
  },
  profileEmail: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    marginTop: spacing.xs,
  },
  menuItem: {
    backgroundColor: colors.dark.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  menuText: {
    ...typography.bodyMedium,
    color: colors.dark.text,
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuValue: {
    ...typography.body,
    color: colors.dark.textSecondary,
  },
  premiumCard: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  premiumTitle: {
    ...typography.subheading,
    color: colors.dark.text,
  },
  premiumSubtitle: {
    ...typography.body,
    color: colors.dark.textSecondary,
    marginBottom: spacing.md,
  },
  upgradeButton: {
    backgroundColor: colors.warning,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  upgradeButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
  },
  logoutItem: {
    marginTop: spacing.md,
  },
  logoutText: {
    color: colors.error,
  },
});
