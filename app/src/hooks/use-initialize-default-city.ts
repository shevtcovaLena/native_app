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
 * Инициализация списка городов: пытаемся получить текущую локацию,
 * иначе добавляем дефолтный город. Всегда ставит текущую локацию первой.
 */
export const useInitializeDefaultCity = (): { initializing: boolean } => {
  const [initializing, setInitializing] = useState(false);

  const cities = useWeatherStore((state) => state.cities);
  const addCity = useWeatherStore((state) => state.addCity);
  const setCurrentCity = useWeatherStore((state) => state.setCurrentCity);
  const fetchWeather = useWeatherStore((state) => state.fetchWeather);

  useEffect(() => {
    if (cities.length > 0) {
      return;
    }

    const run = async () => {
      setInitializing(true);
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
        }
      } catch (error) {
        console.warn("Не удалось получить геолокацию, используем дефолтный город", error);
      }

      await addCity(city);
      await setCurrentCity(city);
      await fetchWeather(city.latitude, city.longitude);
      setInitializing(false);
    };

    void run();
  }, [cities.length, addCity, fetchWeather, setCurrentCity]);

  return { initializing };
};


