import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';
import { useWeatherStore } from '@/src/store/weatherStore';
import type { City } from '@/src/types/weather';
import * as Location from 'expo-location';

const DEFAULT_LAT = 55.75222;
const DEFAULT_LON = 37.61556;
const DEFAULT_CITY_NAME = 'Москва';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DarkThemeColors : LightThemeColors;

  const cities = useWeatherStore((state) => state.cities);
  const currentCity = useWeatherStore((state) => state.currentCity);
  const loading = useWeatherStore((state) => state.loading);
  const addCity = useWeatherStore((state) => state.addCity);
  const setCurrentCity = useWeatherStore((state) => state.setCurrentCity);
  const fetchWeather = useWeatherStore((state) => state.fetchWeather);

  useEffect(() => {
    const initializeDefaultCity = async () => {
      try {
        if (cities.length === 0) {
          let city: City;

          const { status } = await Location.requestForegroundPermissionsAsync();

          if (status === 'granted') {
            try {
              const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
              });

              const { latitude, longitude } = location.coords;
              const geocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
              });

              const cityName = geocode[0]?.city || geocode[0]?.region || DEFAULT_CITY_NAME;

              city = {
                id: 'current-location',
                name: cityName,
                latitude,
                longitude,
                country: geocode[0]?.country ?? undefined,
                timezone: geocode[0]?.timezone ?? undefined,
              };
            } catch (err) {
              console.warn('Ошибка получения локации, используем дефолтную:', err);
              city = {
                id: 'default',
                name: DEFAULT_CITY_NAME,
                latitude: DEFAULT_LAT,
                longitude: DEFAULT_LON,
                country: 'Russia',
                timezone: 'Europe/Moscow',
              };
            }
          } else {
            city = {
              id: 'default',
              name: DEFAULT_CITY_NAME,
              latitude: DEFAULT_LAT,
              longitude: DEFAULT_LON,
              country: 'Russia',
              timezone: 'Europe/Moscow',
            };
          }


          await addCity(city);
          await setCurrentCity(city);
          await fetchWeather(city.latitude, city.longitude);
        }
      } catch (err) {
        console.error('Ошибка инициализации:', err);
      } 
    };

    void initializeDefaultCity();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Погода',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="wb-sunny" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cities"
        options={{
          title: 'Города',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-city" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

