import { useEffect, useState, useMemo, useRef } from 'react';

interface UseCurrentTimeOptions {
  timezone?: string;
  locale?: string;
}

interface UseCurrentTimeReturn {
  formattedTime: string;
  formattedDate: string;
  rawTime: Date;
}

/**
 * Кастомный хук для получения текущего времени с синхронизацией по началу минуты
 * @param options - опции с timezone и locale
 * @returns объект с отформатированным временем, датой и сырым временем
 */
export const useCurrentTime = ({
  timezone,
  locale = 'ru-RU',
}: UseCurrentTimeOptions = {}): UseCurrentTimeReturn => {
  const [rawTime, setRawTime] = useState(() => new Date());

  // Мемоизируем форматтеры, чтобы не пересоздавать при каждом рендере
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    [locale, timezone]
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        weekday: 'short',
        day: 'numeric',
        month: 'long',
      }),
    [locale, timezone]
  );

  // Форматируем время и дату
  const formattedTime = useMemo(
    () => timeFormatter.format(rawTime),
    [timeFormatter, rawTime]
  );

  const formattedDate = useMemo(
    () => dateFormatter.format(rawTime),
    [dateFormatter, rawTime]
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setRawTime(new Date());
    };

    // Обновляем время сразу при монтировании
    updateTime();

    // Вычисляем время до начала следующей минуты
    const now = new Date();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    const msUntilNextMinute = (60 - seconds) * 1000 - milliseconds;

    // Устанавливаем таймаут до начала следующей минуты
    timeoutRef.current = setTimeout(() => {
      updateTime(); // Обновляем время в начале следующей минуты

      // После первого обновления ставим интервал на каждую минуту
      intervalRef.current = setInterval(updateTime, 60000);
    }, msUntilNextMinute);

    // Cleanup функция
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timezone]); // Пересоздаем таймеры при смене timezone

  return {
    formattedTime,
    formattedDate,
    rawTime,
  };
};

