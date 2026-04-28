import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../utils/theme';
import { useHabitsStore } from '../../stores/habitsStore';
import { Habit } from '../../types';

export default function HabitsScreen() {
  const { habits, maxFreeHabits, isPremium, isLoading, fetchHabits, completeHabit, deleteHabit } = useHabitsStore();

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const loadHabits = async () => {
    try {
      await fetchHabits();
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const handleToggleHabit = async (habit: Habit) => {
    try {
      if (habit?.completedToday) {
        // Uncomplete
        Alert.alert('Funcionalidade em desenvolvimento', 'Desmarcar hábito será implementado em breve');
      } else {
        await completeHabit(habit?.id);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar o hábito');
    }
  };

  const handleDeleteHabit = (habit: Habit) => {
    Alert.alert(
      'Deletar Hábito',
      `Tem certeza que deseja deletar "${habit?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(habit?.id);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar o hábito');
            }
          },
        },
      ]
    );
  };

  const handleAddHabit = () => {
    const habitCount = habits?.length ?? 0;
    if (!isPremium && habitCount >= maxFreeHabits) {
      Alert.alert(
        'Limite atingido',
        `Você atingiu o limite de ${maxFreeHabits} hábitos gratuitos. Faça upgrade para Premium para adicionar mais.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ver Premium', onPress: () => Alert.alert('Em desenvolvimento') },
        ]
      );
    } else {
      Alert.alert('Em desenvolvimento', 'Funcionalidade de adicionar hábito em breve');
    }
  };

  const renderHabit = ({ item: habit }: { item: Habit }) => (
    <View style={styles.habitCard}>
      <View style={styles.habitContent}>
        <View style={styles.habitHeader}>
          <Text style={styles.habitName}>{habit?.name}</Text>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={16} color={colors.warning} />
            <Text style={styles.streakText}>{habit?.currentStreak ?? 0}</Text>
          </View>
        </View>
        
        {habit?.description && (
          <Text style={styles.habitDescription} numberOfLines={2}>
            {habit.description}
          </Text>
        )}
        
        <View style={styles.habitFooter}>
          <View style={styles.frequencyBadge}>
            <Text style={styles.frequencyText}>
              {habit?.frequency === 'daily' ? 'Diário' : habit?.frequency === 'weekly' ? 'Semanal' : 'Personalizado'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.habitActions}>
        <TouchableOpacity
          style={[
            styles.habitCheckbox,
            habit?.completedToday && styles.habitCheckboxCompleted,
          ]}
          onPress={() => handleToggleHabit(habit)}
        >
          {habit?.completedToday && (
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteHabit(habit)}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Hábitos</Text>
        <Text style={styles.subtitle}>
          {habits?.length ?? 0}/{isPremium ? '∞' : maxFreeHabits} {isPremium ? '' : 'gratuitos'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={habits ?? []}
          renderItem={renderHabit}
          keyExtractor={(item) => item?.id ?? ''}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="flame-outline" size={64} color={colors.dark.textTertiary} />
              <Text style={styles.emptyText}>Nenhum hábito criado</Text>
              <Text style={styles.emptySubtext}>Comece a rastrear seus hábitos!</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={handleAddHabit}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: spacing.base,
  },
  title: {
    ...typography.display,
    color: colors.dark.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl * 2,
  },
  habitCard: {
    backgroundColor: colors.dark.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
  },
  habitContent: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  habitName: {
    ...typography.subheading,
    color: colors.dark.text,
    flex: 1,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(245,158,11,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  streakText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
  },
  habitDescription: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    marginBottom: spacing.sm,
  },
  habitFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyBadge: {
    backgroundColor: 'rgba(59,130,246,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  frequencyText: {
    ...typography.caption,
    color: colors.primary,
  },
  habitActions: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  habitCheckbox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.dark.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitCheckboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.subheading,
    color: colors.dark.text,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.dark.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: spacing.base,
    bottom: spacing.xxl,
    borderRadius: borderRadius.full,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
