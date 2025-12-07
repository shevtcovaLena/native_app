import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, useColorScheme } from 'react-native';
import { useWeatherStore } from '@/src/store/weatherStore';
import type { City } from '@/src/types/weather';
import { CityListItem } from '@/src/components/list/CityListItem';
import { CityListHeader } from '@/src/components/list/CityListHeader';
import { CityListEmpty } from '@/src/components/list/CityListEmpty';

import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';
import { CitySearch } from '../components/list/CitySearch';

export const CitiesScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;
  
  const [isSearching, setIsSearching] = useState(false); // ← Добавить состояние

  const cities = useWeatherStore((state) => state.cities);
  const currentCity = useWeatherStore((state) => state.currentCity);
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

  const handleCloseSearch = () => setIsSearching(false)

  const renderCityItem = ({ item }: { item: City }) => {
    const isSelected = currentCity?.id === item.id;
    const isCurrentLocation = item.id === 'current-location';

    return (
      <CityListItem
        city={item}
        isSelected={isSelected}
        isCurrentLocation={isCurrentLocation}
        onPress={handleCityPress}
        onDelete={handleDeleteCity}
      />
    );
  };

  // Если идет поиск, показываем компонент поиска
  if (isSearching) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CitySearch onClose={handleCloseSearch}/>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cities}
        renderItem={renderCityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <CityListHeader 
            citiesCount={cities.length}
            onAddCity={() => setIsSearching(true)} // ← Добавить обработчик
          />
        }
        ListEmptyComponent={<CityListEmpty />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  listContent: {
    padding: 16,
  },
});
