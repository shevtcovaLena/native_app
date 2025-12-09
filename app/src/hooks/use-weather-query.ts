import { useQuery } from '@tanstack/react-query';
import type { City, WeatherData } from '@/src/types/weather';
import { weatherAPI } from '@/src/services/weatherAPI';

/**
 * Query key factory для погодных запросов
 */
export const weatherQueryKeys = {
  all: ['weather'] as const,
  city: (cityId: string | null) => ['weather', cityId] as const,
};

/**
 * Кастомный хук для загрузки погоды через TanStack Query
 * @param city - текущий город или null
 * @returns результат запроса с данными о погоде
 */
export const useWeatherQuery = (city: City | null) => {
  return useQuery<WeatherData, Error>({
    queryKey: weatherQueryKeys.city(city?.id || null),
    queryFn: async ({ signal }) => {
      // Этот код выполнится только если enabled: true (т.е. city !== null)
      // Но на всякий случай проверяем
      if (!city) {
        throw new Error('Город не выбран');
      }
      return weatherAPI.getWeatherForecast(city.latitude, city.longitude, signal);
    },
    enabled: !!city, // Запрос выполняется только если город выбран
    staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут - кэш хранится 10 минут после последнего использования
    retry: 2, // Повторить запрос 2 раза при ошибке
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Экспоненциальная задержка
  });
};

