import React, { useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Dimensions,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { useWeatherStore } from "@/src/store/weatherStore";
import { LottieLoader } from "@/src/components/weather/LottieLoader";
import {
  getWeatherAnimation,
  getWeatherLabel,
} from "../utils/weatherCodeMapper";
import {
  DarkThemeColors,
  LightThemeColors,
  getWeatherBackgroundColors,
} from "../theme/colors";
import { isDaytime } from "../utils/timeUtils";
import { WeatherCondition } from "../types/weather";
import { useWeatherQuery } from "../hooks/use-weather-query";
import { useCurrentTime } from "../hooks/useCurrentTime";
import { HourlyForecast } from "../components/weather/HourlyForecast";
import { DailyForecast } from "../components/weather/DailyForecast";
import { WeatherDetails } from "../components/weather/WeatherDetails";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DarkThemeColors : LightThemeColors;
  const isDarkTheme = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const currentCity = useWeatherStore((state) => state.currentCity);

  // Используем TanStack Query для загрузки погоды
  const {
    data: currentWeather,
    isLoading,
    error: queryError,
  } = useWeatherQuery(currentCity);

  // Преобразуем ошибку в строку для совместимости с UI
  const error = queryError?.message || null;

  // Получаем текущее время в часовом поясе города
  const { formattedTime, formattedDate } = useCurrentTime({
    timezone: currentWeather?.timezone || currentCity?.timezone,
    locale: "ru-RU",
  });

  // Определяем время суток и цвета фона
  const { isDay, weatherColors, animationSource } = useMemo(() => {
    if (!currentWeather) {
      return {
        isDay: true,
        weatherColors: null,
        animationSource: null,
      };
    }

    const dayTime = isDaytime(currentWeather.timezone);
    const condition = currentWeather.current.condition;
    const bgColors = getWeatherBackgroundColors(
      condition,
      dayTime,
      isDarkTheme
    );
    const animation = getWeatherAnimation(condition, dayTime);

    return {
      isDay: dayTime,
      weatherColors: bgColors,
      animationSource: animation,
    };
  }, [currentWeather, isDarkTheme]);

  const backgroundColor = weatherColors?.base || colors.background;

  const textColor =
    !isDay && !isDarkTheme ? DarkThemeColors.textPrimary : colors.textPrimary;

  const subtitleColor =
    !isDay && !isDarkTheme
      ? DarkThemeColors.textSecondary
      : colors.textSecondary;

  // Для снежной погоды используем вертикальный градиент (белый сверху)
  const isSnow = currentWeather?.current.condition === WeatherCondition.Snow;
  const gradientStart =
    isSnow && isDay && !isDarkTheme ? { x: 0, y: 0 } : { x: 0, y: 0 };
  const gradientEnd =
    isSnow && isDay && !isDarkTheme ? { x: 0, y: 1 } : { x: 1, y: 1 };

  // Отслеживание скролла для sticky названия города
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickyCity, setShowStickyCity] = useState(false);

  // Цвет для sticky названия города (полупрозрачный фон поверх градиента)
  const stickyHeaderBg =  weatherColors?.gradientStart || colors.background;

  // Обработчик скролла
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Показываем sticky название когда скроллим вниз от начала основного блока
        // Примерно когда скролл больше 100px
        setShowStickyCity(offsetY > 100);
      },
    }
  );

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

      {/* Sticky название города - появляется при скролле */}
      {currentCity && showStickyCity && (
        <Animated.View
          style={[
            styles.stickyCityHeader,
            {
              backgroundColor: stickyHeaderBg,
              borderBottomColor: subtitleColor + "20",
              paddingTop: insets.top + 8,
            },
          ]}
        >
          <Text style={[styles.stickyCityName, { color: textColor }]}>
            {currentCity.name}
          </Text>
        </Animated.View>
      )}

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {isLoading && (
          <LoadingState message="Загрузка погоды..." minHeight={SCREEN_HEIGHT} />
        )}

        {error && !isLoading && (
          <ErrorState message={error} minHeight={SCREEN_HEIGHT} />
        )}

        {!isLoading && !error && currentWeather && animationSource && (
          <>
            {/* Основной блок с текущей погодой */}
            <View
              style={[
                styles.mainContent,
                {
                  minHeight: SCREEN_HEIGHT - 50,
                  paddingTop: insets.top + 20,
                },
              ]}
            >
              <Text style={[styles.city, { color: textColor }]}>
                {currentCity?.name || "Загрузка..."}
              </Text>
              {/* Время и дата */}
              <Text style={[styles.currentTime, { color: textColor }]}>
                {formattedTime}
              </Text>
              <Text style={[styles.currentDate, { color: `${textColor}99` }]}>
                {formattedDate}
              </Text>

              <LottieLoader
                message={getWeatherLabel(currentWeather.current.conditionCode)}
                size={200}
                source={animationSource}
              />
              <Text style={[styles.temperature, { color: textColor }]}>
                {Math.round(currentWeather.current.temperature)}°C
              </Text>
              <Text style={[styles.subtitle, { color: `${textColor}99` }]}>
                Влажность: {currentWeather.current.humidity}%, Ветер:{" "}
                {Math.round(currentWeather.current.windSpeed)} м/с
              </Text>
            </View>

            {/* Детальная информация о погоде */}
            <View style={styles.detailsSection}>
              <HourlyForecast
                hourly={currentWeather.hourly}
                timezone={currentWeather.timezone}
                textColor={textColor}
                subtitleColor={subtitleColor}
                backgroundColor={backgroundColor + "80"}
              />

              <DailyForecast
                daily={currentWeather.daily}
                timezone={currentWeather.timezone}
                textColor={textColor}
                subtitleColor={subtitleColor}
                backgroundColor={backgroundColor + "80"}
              />

              <WeatherDetails
                current={currentWeather.current}
                textColor={textColor}
                subtitleColor={subtitleColor}
                backgroundColor={backgroundColor + "80"}
                isDarkTheme={isDarkTheme}
              />
            </View>
          </>
        )}

        {/* Показываем время даже если нет погоды, но есть город */}
        {!isLoading && !error && !currentWeather && currentCity && (
          <View style={[styles.mainContent, { minHeight: SCREEN_HEIGHT }]}>
            <Text style={[styles.city, { color: colors.textPrimary }]}>
              {currentCity.name}
            </Text>
            <Text style={[styles.currentTime, { color: colors.textPrimary }]}>
              {formattedTime}
            </Text>
            <Text style={[styles.currentDate, { color: colors.textSecondary }]}>
              {formattedDate}
            </Text>
            <LoadingState message="Загрузка погоды..." />
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  stickyCityHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  stickyCityName: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  mainContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  currentTime: {
    fontSize: 56,
    fontWeight: "200",
    letterSpacing: 2,
    marginBottom: 4,
  },
  currentDate: {
    fontSize: 16,
    textTransform: "capitalize",
    marginBottom: 24,
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
  detailsSection: {
    paddingTop: 16,
  },
});
