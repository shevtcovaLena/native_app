import { useEffect, useState } from "react";
import * as Location from "expo-location";

import { useWeatherStore } from "@/src/store/weatherStore";
import type { City } from "@/src/types/weather";

const DEFAULT_CITY: City = {
  id: "default",
  name: "Москва",
  latitude: 55.75222,
  longitude: 37.61556,
  country: "Russia",
  timezone: "Europe/Moscow",
};

/**
 * Инициализация списка городов: загружает сохраненные города из памяти,
 * если их нет - пытается получить текущую локацию или добавляет дефолтный город
 */
export const useInitializeDefaultCity = (): { initializing: boolean } => {
  const [initializing, setInitializing] = useState(true);

  const cities = useWeatherStore((state) => state.cities);
  const initialized = useWeatherStore((state) => state.initialized);
  const initializeStore = useWeatherStore((state) => state.initializeStore);
  const addCity = useWeatherStore((state) => state.addCity);
  const setCurrentCity = useWeatherStore((state) => state.setCurrentCity);
  const fetchWeather = useWeatherStore((state) => state.fetchWeather);

  useEffect(() => {
    // Если уже инициализировали - выходим
    if (initialized) {
      setInitializing(false);
      return;
    }

    const run = async () => {
      console.log('🔄 Начало инициализации приложения');
      setInitializing(true);

      // ШАГ 1: Загружаем сохраненные данные из AsyncStorage
      await initializeStore();
      
      // ШАГ 2: Проверяем что загрузилось
      const currentCities = useWeatherStore.getState().cities;
      const currentCity = useWeatherStore.getState().currentCity;
      
      console.log('📦 Загружено городов из памяти:', currentCities.length);

      // ШАГ 3: Если есть сохраненные города - загружаем погоду для текущего
      if (currentCities.length > 0 && currentCity) {
        console.log('✅ Используем сохраненные города');
        await fetchWeather(currentCity.latitude, currentCity.longitude);
        setInitializing(false);
        return;
      }

      // ШАГ 4: Если нет сохраненных - добавляем первый город
      console.log('🆕 Нет сохраненных городов, добавляем первый');
      let city: City = DEFAULT_CITY;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const { latitude, longitude } = location.coords;
          const geocode = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          const cityName = geocode[0]?.city || geocode[0]?.region || DEFAULT_CITY.name;

          city = {
            id: "current-location",
            name: cityName,
            latitude,
            longitude,
            country: geocode[0]?.country ?? undefined,
            timezone: geocode[0]?.timezone ?? undefined,
          };
          
          console.log('📍 Получена геолокация:', cityName);
        }
      } catch (error) {
        console.warn("⚠️ Не удалось получить геолокацию, используем дефолтный город", error);
      }

      await addCity(city);
      await setCurrentCity(city);
      await fetchWeather(city.latitude, city.longitude);
      setInitializing(false);
      
      console.log('✅ Инициализация завершена');
    };

    void run();
  }, [initialized]); // ← Зависимость только от initialized

  return { initializing };
};
