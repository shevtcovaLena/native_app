/**
 * Утилиты для работы со временем суток
 */

/**
 * Определяет, является ли текущее время днем или ночью
 * @param timezone - часовой пояс (например, "Europe/Moscow")
 * @returns true если день, false если ночь
 */
export const isDaytime = (timezone?: string): boolean => {
  const now = new Date();
  
  let hours: number;
  
  if (timezone) {
    try {
      // Используем Intl.DateTimeFormat для более надежной работы на всех платформах
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false,
      });
      
      const parts = formatter.formatToParts(now);
      const hourPart = parts.find(part => part.type === 'hour');
      hours = hourPart ? parseInt(hourPart.value, 10) : now.getUTCHours();
      
      // Проверяем валидность
      if (isNaN(hours) || hours < 0 || hours > 23) {
        // Fallback: используем UTC время
        hours = now.getUTCHours();
      }
    } catch {
      // Если timezone невалидный, используем локальное время устройства
      hours = now.getHours();
    }
  } else {
    hours = now.getHours();
  }
  
  // Считаем днем с 6:00 до 20:00
  return hours >= 6 && hours < 20;
};

/**
 * Получить текущее время в указанном часовом поясе
 * @param timezone - часовой пояс
 * @returns объект Date с локальным временем (приблизительно)
 */
export const getLocalTime = (timezone?: string): Date => {
  if (!timezone) {
    return new Date();
  }

  try {
    const now = new Date();
    // Используем более надежный способ через форматирование
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => {
      const part = parts.find(p => p.type === type);
      return part ? part.value : '';
    };
    
    const year = parseInt(getPart('year'), 10);
    const month = parseInt(getPart('month'), 10) - 1; // месяцы в JS начинаются с 0
    const day = parseInt(getPart('day'), 10);
    const hour = parseInt(getPart('hour'), 10);
    const minute = parseInt(getPart('minute'), 10);
    const second = parseInt(getPart('second'), 10);
    
    return new Date(year, month, day, hour, minute, second);
  } catch {
    return new Date();
  }
};

/**
 * Форматирует время в указанном часовом поясе
 * @param timezone - часовой пояс
 * @returns строка с временем в формате "HH:MM"
 */
export const formatLocalTime = (timezone?: string): string => {
  if (!timezone) {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formatter.format(now);
  } catch {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
};
