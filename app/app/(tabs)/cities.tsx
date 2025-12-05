import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { useWeatherStore } from '@/src/store/weatherStore';
import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';
import type { City } from '@/src/types/weather';

const DEFAULT_LAT = 55.75222;
const DEFAULT_LON = 37.61556;
const DEFAULT_CITY_NAME = 'Москва';

export default function CitiesScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;
  const [locationLoading, setLocationLoading] = useState(false);

  const cities = useWeatherStore((state) => state.cities);
  const currentCity = useWeatherStore((state) => state.currentCity);
  const loading = useWeatherStore((state) => state.loading);
  const addCity = useWeatherStore((state) => state.addCity);
  const removeCity = useWeatherStore((state) => state.removeCity);
  const setCurrentCity = useWeatherStore((state) => state.setCurrentCity);
  const fetchWeather = useWeatherStore((state) => state.fetchWeather);

  const handleCityPress = async (city: City) => {
    await setCurrentCity(city);
    await fetchWeather(city.latitude, city.longitude);
  };

  const handleDeleteCity = (cityId: string, cityName: string) => {
    Alert.alert(
      'Удалить город',
      `Вы уверены, что хотите удалить ${cityName}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await removeCity(cityId);
            // Если удалили текущий город, выбираем первый из списка
            if (currentCity?.id === cityId && cities.length > 1) {
              const newCurrentCity = cities.find((c) => c.id !== cityId);
              if (newCurrentCity) {
                await setCurrentCity(newCurrentCity);
                await fetchWeather(newCurrentCity.latitude, newCurrentCity.longitude);
              }
            }
          },
        },
      ]
    );
  };

  const renderCityItem = ({ item }: { item: City }) => {
    const isSelected = currentCity?.id === item.id;
    const isCurrentLocation = item.id === 'current-location';

    return (
      <TouchableOpacity
        style={[
          styles.cityItem,
          {
            backgroundColor: isSelected ? colors.accent + '20' : colors.surface,
            borderColor: isSelected ? colors.accent : 'transparent',
          },
        ]}
        onPress={() => handleCityPress(item)}>
        <View style={styles.cityInfo}>
          {isCurrentLocation && (
            <MaterialIcons name="my-location" size={20} color={colors.accent} style={styles.locationIcon} />
          )}
          <View style={styles.cityTextContainer}>
            <Text style={[styles.cityName, { color: colors.textPrimary }]}>{item.name}</Text>
            {item.country && (
              <Text style={[styles.cityCountry, { color: colors.textSecondary }]}>{item.country}</Text>
            )}
          </View>
        </View>
        {isSelected && (
          <MaterialIcons name="check-circle" size={24} color={colors.accent} />
        )}
        {!isCurrentLocation && (
          <TouchableOpacity
            onPress={() => handleDeleteCity(item.id, item.name)}
            style={styles.deleteButton}>
            <MaterialIcons name="delete-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (locationLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Инициализация...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Мои города</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {cities.length} {cities.length === 1 ? 'город' : cities.length < 5 ? 'города' : 'городов'}
        </Text>
      </View>

      <FlatList
        data={cities}
        renderItem={renderCityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="location-off" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Нет сохраненных городов
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    marginRight: 12,
  },
  cityTextContainer: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cityCountry: {
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

