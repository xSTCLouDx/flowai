import { format, parseISO, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString: string | null | undefined, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), formatStr, { locale: ptBR });
  } catch {
    return '';
  }
};

export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'HH:mm', { locale: ptBR });
  } catch {
    return '';
  }
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return `Hoje às ${format(date, 'HH:mm')}`;
    }
    if (isTomorrow(date)) {
      return `Amanhã às ${format(date, 'HH:mm')}`;
    }
    return format(date, "dd/MM 'às' HH:mm", { locale: ptBR });
  } catch {
    return '';
  }
};

export const getRelativeDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    if (isPast(date)) return 'Atrasado';
    
    const daysUntil = differenceInDays(date, new Date());
    if (daysUntil === 1) return 'Amanhã';
    if (daysUntil < 7) return `Em ${daysUntil} dias`;
    
    return formatDate(dateString, 'dd/MM');
  } catch {
    return '';
  }
};

export const truncate = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const getPriorityColor = (priority: string): string => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return '#EF4444';
    case 'medium':
      return '#F59E0B';
    case 'low':
      return '#3B82F6';
    default:
      return '#6B7280';
  }
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
