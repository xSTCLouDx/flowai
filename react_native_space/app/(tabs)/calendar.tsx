import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useFocusEffect } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../utils/theme';
import { calendarService } from '../../services/calendar';
import { CalendarEvent, Task } from '../../types';
import { formatTime } from '../../utils/helpers';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await calendarService.getEvents();
      setEvents(response?.events ?? []);
      setTasks(response?.tasks ?? []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDateEvents = events?.filter((e) => 
    e?.startDate?.startsWith(selectedDate)
  ) ?? [];

  const selectedDateTasks = tasks?.filter((t) => 
    t?.dueDate?.startsWith(selectedDate)
  ) ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendário</Text>
      </View>

      <ScrollView>
        <RNCalendar
          current={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: colors.primary },
          }}
          theme={{
            calendarBackground: colors.dark.elevated,
            dayTextColor: colors.dark.text,
            monthTextColor: colors.dark.text,
            textDisabledColor: colors.dark.textTertiary,
            selectedDayBackgroundColor: colors.primary,
            todayTextColor: colors.primary,
            arrowColor: colors.primary,
          }}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Eventos de {new Date(selectedDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
          </Text>

          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
          ) : (
            <>
              {selectedDateEvents?.map((event) => (
                <View key={event?.id} style={styles.eventCard}>
                  <View style={[styles.eventIndicator, { backgroundColor: colors.purple }]} />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event?.title}</Text>
                    <Text style={styles.eventTime}>{formatTime(event?.startDate)}</Text>
                  </View>
                  <Ionicons name="calendar" size={20} color={colors.purple} />
                </View>
              ))}

              {selectedDateTasks?.map((task) => (
                <View key={task?.id} style={styles.eventCard}>
                  <View style={[styles.eventIndicator, { backgroundColor: colors.primary }]} />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{task?.title}</Text>
                    <Text style={styles.eventTime}>{formatTime(task?.dueDate)}</Text>
                  </View>
                  <Ionicons name="checkbox" size={20} color={colors.primary} />
                </View>
              ))}

              {selectedDateEvents?.length === 0 && selectedDateTasks?.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="calendar-outline" size={48} color={colors.dark.textTertiary} />
                  <Text style={styles.emptyText}>Nenhum evento para este dia</Text>
                </View>
              )}
            </>
          )}
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
  section: {
    padding: spacing.base,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.dark.text,
    marginBottom: spacing.md,
    textTransform: 'capitalize',
  },
  loader: {
    marginTop: spacing.lg,
  },
  eventCard: {
    backgroundColor: colors.dark.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  eventIndicator: {
    width: 4,
    height: '100%',
    borderRadius: borderRadius.sm,
    position: 'absolute',
    left: 0,
  },
  eventContent: {
    flex: 1,
    marginLeft: spacing.md,
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
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.dark.textSecondary,
  },
});
