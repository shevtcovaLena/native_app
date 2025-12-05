import { create } from 'zustand';

import type { City, WeatherData } from '@/src/types/weather';
import { weatherAPI } from '@/src/services/weatherAPI';
import { appStorage } from '@/src/utils/storage';

interface WeatherStoreState {
  cities: City[];
  currentCity: City | null;
  currentWeather: WeatherData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface WeatherStoreActions {
  addCity: (city: City) => Promise<void>;
  removeCity: (cityId: string) => Promise<void>;
  setCurrentCity: (city: City | null) => Promise<void>;
  fetchWeather: (latitude: number, longitude: number) => Promise<void>;
  initializeStore: () => Promise<void>;
}

type WeatherStore = WeatherStoreState & WeatherStoreActions;

const orderCities = (cities: City[]): City[] => {
  const seen = new Set<string>();
  const ordered: City[] = [];

  const currentLocation = cities.find((c) => c.id === "current-location");
  if (currentLocation) {
    ordered.push(currentLocation);
    seen.add(currentLocation.id);
  }

  for (const city of cities) {
    if (!seen.has(city.id)) {
      ordered.push(city);
      seen.add(city.id);
    }
  }

  return ordered;
};

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  cities: [],
  currentCity: null,
  currentWeather: null,
  loading: false,
  error: null,
  initialized: false,

  addCity: async (city: City) => {
    const state = get();
    // Проверяем, нет ли уже такого города
    const cityExists = state.cities.some((c) => c.id === city.id);
    if (cityExists) {
      return;
    }

    const newCities = orderCities([...state.cities, city]);
    set({ cities: newCities });
    // Сохраняем в хранилище (асинхронно)
    await appStorage.saveCities(newCities);
  },

  removeCity: async (cityId: string) => {
    const state = get();
    const newCities = orderCities(state.cities.filter((city) => city.id !== cityId));
    set({ cities: newCities });
    // Сохраняем в хранилище (асинхронно)
    await appStorage.saveCities(newCities);

    // Если удалили текущий город, сбрасываем его
    if (state.currentCity?.id === cityId) {
      const nextCity = newCities.length > 0 ? newCities[0] : null;
      set({ currentCity: nextCity });
      await appStorage.saveCurrentCity(nextCity);
    }
  },

  setCurrentCity: async (city: City | null) => {
    set({ currentCity: city });
    // Сохраняем в хранилище (асинхронно)
    await appStorage.saveCurrentCity(city);
  },

  fetchWeather: async (latitude: number, longitude: number) => {
    set({ loading: true, error: null });

    try {
      const data = await weatherAPI.getWeatherForecast(latitude, longitude);
      set({ currentWeather: data, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить данные о погоде';
      set({ error: message, loading: false });
    }
  },

  initializeStore: async () => {
    if (get().initialized) {
      return;
    }

    // Загружаем города из хранилища (асинхронно)
    const savedCities = await appStorage.loadCities();
    const savedCurrentCity = await appStorage.loadCurrentCity();

    set({
      cities: orderCities(savedCities),
      currentCity: savedCurrentCity,
      initialized: true,
    });
  },
}));
