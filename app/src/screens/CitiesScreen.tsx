import React, { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, FlatList, Alert, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWeatherStore } from '@/src/store/weatherStore';
import type { City } from '@/src/types/weather';
import { CityListItem } from '@/src/components/list/CityListItem';
import { CityListHeader } from '@/src/components/list/CityListHeader';
import { CityListEmpty } from '@/src/components/list/CityListEmpty';
import { useWeatherQuery } from '@/src/hooks/use-weather-query';
import { isDaytime } from '@/src/utils/timeUtils';
import { WeatherCondition } from '@/src/types/weather';
import {
  DarkThemeColors,
  LightThemeColors,
  getWeatherBackgroundColors,
} from '@/src/theme/colors';
import { CitySearch } from '../components/list/CitySearch';

export const CitiesScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;
  const isDarkTheme = colorScheme === 'dark';
  const router = useRouter();
  
  const [isSearching, setIsSearching] = useState(false);

  const cities = useWeatherStore((state) => state.cities);
  const currentCity = useWeatherStore((state) => state.currentCity);
  const removeCity = useWeatherStore((state) => state.removeCity);
  const setCurrentCity = useWeatherStore((state) => state.setCurrentCity);

  // Получаем погоду для текущего города для градиента фона
  const { data: currentWeather } = useWeatherQuery(currentCity);

  // Определяем цвета фона как в HomeScreen
  const { weatherColors, backgroundColor } = useMemo(() => {
    if (!currentWeather) {
      return {
        weatherColors: null,
        backgroundColor: colors.background,
      };
    }

    const dayTime = isDaytime(currentWeather.timezone);
    const condition = currentWeather.current.condition;
    const bgColors = getWeatherBackgroundColors(
      condition,
      dayTime,
      isDarkTheme
    );

    return {
      weatherColors: bgColors,
      backgroundColor: bgColors?.base || colors.background,
    };
  }, [currentWeather, isDarkTheme, colors.background]);

  // Для снежной погоды используем вертикальный градиент
  const isSnow = currentWeather?.current.condition === WeatherCondition.Snow;
  const gradientStart =
    isSnow && isDaytime(currentWeather?.timezone || '') && !isDarkTheme
      ? { x: 0, y: 0 }
      : { x: 0, y: 0 };
  const gradientEnd =
    isSnow && isDaytime(currentWeather?.timezone || '') && !isDarkTheme
      ? { x: 0, y: 1 }
      : { x: 1, y: 1 };

  const handleCityPress = async (city: City) => {
    await setCurrentCity(city);
    router.push('/(tabs)')
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
        backgroundColor={backgroundColor}
        isDarkTheme={isDarkTheme}
      />
    );
  };

  // Если идет поиск, показываем компонент поиска
  if (isSearching) {
    return (
      <View style={styles.container}>
        {weatherColors ? (
          <LinearGradient
            colors={[
              weatherColors.gradientStart,
              weatherColors.gradientEnd,
              backgroundColor,
            ]}
            start={gradientStart}
            end={gradientEnd}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />
        )}
        <CitySearch onClose={handleCloseSearch}/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weatherColors ? (
        <LinearGradient
          colors={[
            weatherColors.gradientStart,
            weatherColors.gradientEnd,
            backgroundColor,
          ]}
          start={gradientStart}
          end={gradientEnd}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />
      )}
      <FlatList
        data={cities}
        renderItem={renderCityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <CityListHeader 
            citiesCount={cities.length}
            onAddCity={() => setIsSearching(true)}
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
    position: 'relative',
    paddingTop: 16,
  },
  listContent: {
    padding: 16,
  },
});
