import AsyncStorage from '@react-native-async-storage/async-storage';

import type { City } from '@/src/types/weather';

const STORAGE_KEYS = {
  CITIES: 'cities',
  CURRENT_CITY: 'current_city',
} as const;

/**
 * Storage utility для работы с AsyncStorage
 * AsyncStorage - стандартное решение для React Native, работает на всех платформах
 * Все операции асинхронные, поэтому методы возвращают Promise
 */
export const appStorage = {
  /**
   * Сохранить список городов
   */
  saveCities: async (cities: City[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(cities));
    } catch (error) {
      console.error('Ошибка сохранения городов:', error);
    }
  },

  /**
   * Загрузить список городов
   */
  loadCities: async (): Promise<City[]> => {
    try {
      const citiesJson = await AsyncStorage.getItem(STORAGE_KEYS.CITIES);
      if (!citiesJson) {
        return [];
      }
      return JSON.parse(citiesJson) as City[];
    } catch (error) {
      console.error('Ошибка загрузки городов:', error);
      return [];
    }
  },

  /**
   * Сохранить текущий выбранный город
   */
  saveCurrentCity: async (city: City | null): Promise<void> => {
    try {
      if (city) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_CITY, JSON.stringify(city));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_CITY);
      }
    } catch (error) {
      console.error('Ошибка сохранения текущего города:', error);
    }
  },

  /**
   * Загрузить текущий выбранный город
   */
  loadCurrentCity: async (): Promise<City | null> => {
    try {
      const cityJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_CITY);
      if (!cityJson) {
        return null;
      }
      return JSON.parse(cityJson) as City;
    } catch (error) {
      console.error('Ошибка загрузки текущего города:', error);
      return null;
    }
  },

  /**
   * Очистить все данные
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.CITIES, STORAGE_KEYS.CURRENT_CITY]);
    } catch (error) {
      console.error('Ошибка очистки хранилища:', error);
    }
  },
};
