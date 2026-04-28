import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, typography, spacing, borderRadius, shadows } from '../../utils/theme';
import { useAuthStore } from '../../stores/authStore';
import { dashboardService } from '../../services/dashboard';
import { DashboardData } from '../../types';
import { formatDateTime, getPriorityColor } from '../../utils/helpers';
import { useCallback } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboard = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      
      const dashboardData = await dashboardService.getDashboard();
      setData(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const onRefresh = () => {
    loadDashboard(true);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')?.[0] ?? 'Usuário'}</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Ionicons name="person-circle" size={48} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data?.todayStats?.completedToday ?? 0}/{data?.todayStats?.totalToday ?? 0}</Text>
            <Text style={styles.statLabel}>Tarefas Hoje</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={colors.warning} />
            <Text style={styles.statValue}>{data?.todayStats?.habitStreak ?? 0}</Text>
            <Text style={styles.statLabel}>Dias de Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round((data?.todayStats?.weeklyCompletionRate ?? 0) * 100)}%</Text>
            <Text style={styles.statLabel}>Taxa Semanal</Text>
          </View>
        </ScrollView>

        {/* AI Insight */}
        {data?.latestInsight && (
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
              <Text style={styles.insightTitle}>Insight de IA</Text>
            </View>
            <Text style={styles.insightText}>{data.latestInsight.content}</Text>
          </View>
        )}

        {/* Priority Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Prioridades do Dia</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
              <Text style={styles.sectionLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {data?.priorityTasks && data.priorityTasks.length > 0 ? (
            data.priorityTasks.map((task) => (
              <TouchableOpacity key={task?.id} style={styles.taskCard}>
                <View style={[styles.taskPriority, { backgroundColor: getPriorityColor(task?.priority) }]} />
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle} numberOfLines={1}>{task?.title}</Text>
                  {task?.dueDate && (
                    <Text style={styles.taskSubtitle}>{formatDateTime(task.dueDate)}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.dark.textTertiary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={48} color={colors.dark.textTertiary} />
              <Text style={styles.emptyText}>Nenhuma tarefa prioritária</Text>
            </View>
          )}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')}>
              <Text style={styles.sectionLink}>Ver calendário</Text>
            </TouchableOpacity>
          </View>
          {data?.upcomingEvents && data.upcomingEvents.length > 0 ? (
            data.upcomingEvents.slice(0, 3).map((event) => (
              <View key={event?.id} style={styles.eventCard}>
                <View style={[styles.eventIndicator, { backgroundColor: colors.purple }]} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={1}>{event?.title}</Text>
                  <Text style={styles.eventTime}>{formatDateTime(event?.startDate)}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.dark.textTertiary} />
              <Text style={styles.emptyText}>Nenhum evento próximo</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/tasks')}
      >
        <LinearGradient colors={[colors.primary, colors.purple]} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.heading,
    color: colors.dark.text,
  },
  date: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    textTransform: 'capitalize',
  },
  avatar: {
    borderRadius: borderRadius.full,
  },
  statsContainer: {
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginRight: spacing.md,
    minWidth: 120,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    ...typography.heading,
    color: colors.dark.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.dark.textSecondary,
  },
  insightCard: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  insightTitle: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  insightText: {
    ...typography.body,
    color: colors.dark.text,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.dark.text,
  },
  sectionLink: {
    ...typography.body,
    color: colors.primary,
  },
  taskCard: {
    backgroundColor: colors.dark.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  taskPriority: {
    width: 4,
    height: '100%',
    borderRadius: borderRadius.sm,
    position: 'absolute',
    left: 0,
  },
  taskContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  taskTitle: {
    ...typography.bodyMedium,
    color: colors.dark.text,
  },
  taskSubtitle: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    marginTop: spacing.xs,
  },
  eventCard: {
    backgroundColor: colors.dark.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    gap: spacing.md,
  },
  eventIndicator: {
    width: 4,
    borderRadius: borderRadius.sm,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    ...typography.bodyMedium,
    color: colors.dark.text,
  },
  eventTime: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.dark.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: spacing.base,
    bottom: spacing.xxl,
    borderRadius: borderRadius.full,
    ...shadows.lg,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
