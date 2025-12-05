import axios, { isAxiosError } from 'axios';

import type { WeatherData } from '@/src/types/weather';
import { getWeatherCondition } from '@/src/utils/weatherCodeMapper';

const BASE_URL = 'https://api.open-meteo.com/v1';

export const weatherAPI = {
  async getWeatherForecast(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const params = {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        hourly: 'temperature_2m,precipitation_probability,weather_code',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
        timezone: 'auto',
        forecast_days: 7,
      };

      const response = await axios.get(`${BASE_URL}/forecast`, { params });
      const data = response.data;

      const currentCode = data.current.weather_code as number;

      const weatherData: WeatherData = {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        current: {
          time: data.current.time,
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          conditionCode: currentCode,
          condition: getWeatherCondition(currentCode),
        },
        hourly: data.hourly.time.map((time: string, index: number) => {
          const code = data.hourly.weather_code[index] as number;

          return {
            time,
            temperature: data.hourly.temperature_2m[index],
            precipitationProbability: data.hourly.precipitation_probability[index],
            conditionCode: code,
          };
        }),
        daily: data.daily.time.map((date: string, index: number) => {
          const code = data.daily.weather_code[index] as number;

          return {
            date,
            minTemperature: data.daily.temperature_2m_min[index],
            maxTemperature: data.daily.temperature_2m_max[index],
            precipitationSum: data.daily.precipitation_sum[index],
            conditionCode: code,
            condition: getWeatherCondition(code),
          };
        }),
      };

      return weatherData;
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          console.error('Invalid coordinates or parameters:', error.response?.data);
          throw new Error('Неверные координаты или параметры запроса');
        }

        if (status === 429) {
          console.error('Rate limit exceeded');
          throw new Error('Превышен лимит запросов. Попробуйте позже.');
        }

        console.error('API Error:', error.response?.data);
        throw new Error(error.response?.data?.reason || 'Не удалось загрузить данные о погоде');
      }

      if (error instanceof Error) {
        console.error('Network error:', error.message);
        throw new Error('Ошибка сети. Проверьте подключение к интернету.');
      }

      throw error;
    }
  },
};


