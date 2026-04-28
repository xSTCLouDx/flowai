import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../utils/theme';
import { useTasksStore } from '../../stores/tasksStore';
import { formatDateTime, getPriorityColor } from '../../utils/helpers';
import { Task } from '../../types';

export default function TasksScreen() {
  const { tasks, isLoading, fetchTasks, completeTask, deleteTask } = useTasksStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [filter])
  );

  const loadTasks = async () => {
    try {
      await fetchTasks({
        status: filter === 'all' ? undefined : filter,
      });
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    try {
      await completeTask(task?.id);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível completar a tarefa');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    Alert.alert(
      'Deletar Tarefa',
      `Tem certeza que deseja deletar "${task?.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task?.id);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a tarefa');
            }
          },
        },
      ]
    );
  };

  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch = task?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? true;
    return matchesSearch;
  }) ?? [];

  const renderTask = ({ item: task }: { item: Task }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          task?.status === 'completed' && styles.checkboxCompleted,
        ]}
        onPress={() => handleCompleteTask(task)}
      >
        {task?.status === 'completed' && (
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        )}
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            task?.status === 'completed' && styles.taskTitleCompleted,
          ]}
          numberOfLines={2}
        >
          {task?.title}
        </Text>
        {task?.dueDate && (
          <Text style={styles.taskSubtitle}>{formatDateTime(task.dueDate)}</Text>
        )}
        {task?.category && (
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{task.category}</Text>
          </View>
        )}
      </View>

      <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task?.priority) }]} />

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(task)}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Tarefas</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.dark.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tarefas..."
          placeholderTextColor={colors.dark.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.dark.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'pending' && styles.filterChipActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
            Pendentes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'completed' && styles.filterChipActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            Concluídas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item?.id ?? ''}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="checkbox-outline" size={64} color={colors.dark.textTertiary} />
              <Text style={styles.emptyText}>Nenhuma tarefa encontrada</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade de adicionar tarefa em breve')}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.elevated,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.dark.text,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.dark.elevated,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.dark.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl * 2,
  },
  taskCard: {
    backgroundColor: colors.dark.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.dark.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    ...typography.bodyMedium,
    color: colors.dark.text,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.dark.textSecondary,
  },
  taskSubtitle: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    marginTop: spacing.xs,
  },
  categoryTag: {
    backgroundColor: 'rgba(59,130,246,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  categoryText: {
    ...typography.caption,
    color: colors.primary,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.base,
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
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
