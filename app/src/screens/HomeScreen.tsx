import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from "react-native";

import { useWeatherStore } from "@/src/store/weatherStore";
import { LottieLoader } from "@/src/components/weather/LottieLoader";
import { getWeatherAnimation, getWeatherLabel } from "../utils/weatherCodeMapper";
import { DarkThemeColors, LightThemeColors } from "../theme/colors";

export const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DarkThemeColors : LightThemeColors;

  const currentCity = useWeatherStore((state) => state.currentCity);
  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const loading = useWeatherStore((state) => state.loading);
  const error = useWeatherStore((state) => state.error);
  const fetchWeather = useWeatherStore((state) => state.fetchWeather);

  useEffect(() => {
    // Если есть текущий город, загружаем для него погоду
    if (currentCity) {
      void fetchWeather(currentCity.latitude, currentCity.longitude);
    }
  }, [currentCity, fetchWeather]);

  const isLoading = loading;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Загрузка погоды...
          </Text>
        </View>
      )}

      {error && !isLoading && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

      {!isLoading && !error && currentWeather && (
        <View style={styles.content}>
          <LottieLoader
            message={getWeatherLabel(currentWeather.current.conditionCode)}
            size={200}
            source={getWeatherAnimation(currentWeather.current.condition)}
          />
          <Text style={[styles.city, { color: colors.textPrimary }]}>
            {currentCity?.name || "Загрузка..."}
          </Text>
          <Text style={[styles.temperature, { color: colors.textPrimary }]}>
            {Math.round(currentWeather.current.temperature)}°C
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Влажность: {currentWeather.current.humidity}%
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ветер: {Math.round(currentWeather.current.windSpeed)} м/с
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  content: {
    alignItems: "center",
  },
  city: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  temperature: {
    fontSize: 56,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 2,
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
