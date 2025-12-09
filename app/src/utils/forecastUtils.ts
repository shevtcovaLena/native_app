/**
 * Утилиты для форматирования данных прогноза погоды
 */

/**
 * Форматирует время для почасового прогноза
 * @param timeString - строка времени в формате ISO
 * @param timezone - часовой пояс
 * @returns отформатированное время "HH:MM"
 */
export const formatHourlyTime = (timeString: string, timezone?: string): string => {
  try {
    const date = new Date(timeString);
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formatter.format(date);
  } catch {
    return '';
  }
};

/**
 * Форматирует дату для дневного прогноза
 * @param dateString - строка даты
 * @param timezone - часовой пояс
 * @returns отформатированная дата "день недели, число"
 */
export const formatDailyDate = (dateString: string, timezone?: string): string => {
  try {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      weekday: 'short',
      day: 'numeric',
    });
    return formatter.format(date);
  } catch {
    return '';
  }
};

/**
 * Проверяет, является ли время сегодняшним
 * @param timeString - строка времени
 * @param timezone - часовой пояс
 * @returns true если время сегодняшнее
 */
export const isToday = (timeString: string, timezone?: string): boolean => {
  try {
    const date = new Date(timeString);
    const now = new Date();
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    const dateStr = dateFormatter.format(date);
    const nowStr = dateFormatter.format(now);
    
    return dateStr === nowStr;
  } catch {
    return false;
  }
};

