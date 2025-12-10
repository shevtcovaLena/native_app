// src/utils/weatherCodeMapper.ts
import { MaterialIcons } from "@expo/vector-icons";
import { WeatherCondition } from "@/src/types/weather";

/**
 * Маппинг WMO Weather Codes в WeatherCondition enum
 */
export const getWeatherCondition = (code: number): WeatherCondition => {
  if (code === 0) return WeatherCondition.Clear;
  if (code >= 1 && code <= 3) return WeatherCondition.PartlyCloudy;
  if (code === 45 || code === 48) return WeatherCondition.Fog;
  if (code >= 51 && code <= 55) return WeatherCondition.Drizzle;
  if (code >= 61 && code <= 65) return WeatherCondition.Rain;
  if (code >= 71 && code <= 77) return WeatherCondition.Snow;
  if (code >= 80 && code <= 82) return WeatherCondition.Showers;
  if (code >= 95 && code <= 99) return WeatherCondition.Thunderstorm;

  // Fallback на partly cloudy для неизвестных кодов
  return WeatherCondition.PartlyCloudy;
};

/**
 * Русские названия погодных условий
 */
export const weatherConditionLabelsRU: Record<WeatherCondition, string> = {
  [WeatherCondition.Clear]: "Ясно",
  [WeatherCondition.PartlyCloudy]: "Переменная облачность",
  [WeatherCondition.Cloudy]: "Облачно",
  [WeatherCondition.Fog]: "Туман",
  [WeatherCondition.Drizzle]: "Морось",
  [WeatherCondition.Rain]: "Дождь",
  [WeatherCondition.Snow]: "Снег",
  [WeatherCondition.Showers]: "Ливень",
  [WeatherCondition.Thunderstorm]: "Гроза",
};

/**
 * Английские названия погодных условий
 */
export const weatherConditionLabelsEN: Record<WeatherCondition, string> = {
  [WeatherCondition.Clear]: "Clear sky",
  [WeatherCondition.PartlyCloudy]: "Partly cloudy",
  [WeatherCondition.Cloudy]: "Cloudy",
  [WeatherCondition.Fog]: "Fog",
  [WeatherCondition.Drizzle]: "Drizzle",
  [WeatherCondition.Rain]: "Rain",
  [WeatherCondition.Snow]: "Snow",
  [WeatherCondition.Showers]: "Rain showers",
  [WeatherCondition.Thunderstorm]: "Thunderstorm",
};

/**
 * Получить русское название по коду WMO
 */
export const getWeatherLabel = (
  code: number,
  language: "ru" | "en" = "ru"
): string => {
  const condition = getWeatherCondition(code);
  const labels =
    language === "ru" ? weatherConditionLabelsRU : weatherConditionLabelsEN;

  return labels[condition];
};

/**
 * Получить анимацию погоды с учетом времени суток
 * @param condition - погодное условие
 * @param isDaytime - true если день, false если ночь
 */
export const getWeatherAnimation = (
  condition: WeatherCondition,
  isDaytime: boolean = true
): string => {
  // Для Clear и Cloudy есть ночные версии
  if (!isDaytime) {
    if (condition === WeatherCondition.Clear) {
      return require("@/src/assets/animation/Weather-night.json");
    }
    if (condition === WeatherCondition.PartlyCloudy) {
      return require("@/src/assets/animation/Weather-cloudy(night).json");
    }
    if (condition === WeatherCondition.Rain || condition === WeatherCondition.Drizzle) {
      return require("@/src/assets/animation/Weather-rainy(night).json");
    }
  }
  
  const animationMap = {
    [WeatherCondition.Clear]: require("@/src/assets/animation/Weather-sunny.json"),
    [WeatherCondition.PartlyCloudy]: require("@/src/assets/animation/Weather-partly-cloudy.json"),
    [WeatherCondition.Cloudy]: require("@/src/assets/animation/Weather-cloudy.json"),
    [WeatherCondition.Fog]: require("@/src/assets/animation/Weather-foggy.json"),
    [WeatherCondition.Drizzle]: require("@/src/assets/animation/Weather-rain.json"),
    [WeatherCondition.Rain]: require("@/src/assets/animation/Weather-rain.json"),
    [WeatherCondition.Snow]: require("@/src/assets/animation/Weather-snow.json"),
    [WeatherCondition.Showers]: require("@/src/assets/animation/Weather-storm.json"),
    [WeatherCondition.Thunderstorm]: require("@/src/assets/animation/Weather-storm.json"),
  } as const;

  return animationMap[condition];
};

export type AnimationType = ReturnType<typeof getWeatherAnimation>;

/**
 * Получить иконку погоды по условию
 * @param condition - погодное условие
 * @returns название иконки из MaterialIcons
 */
export const getWeatherIcon = (condition: WeatherCondition): keyof typeof MaterialIcons.glyphMap => {
  const iconMap: Record<WeatherCondition, keyof typeof MaterialIcons.glyphMap> = {
    [WeatherCondition.Clear]: 'wb-sunny',
    [WeatherCondition.PartlyCloudy]: 'wb-cloudy',
    [WeatherCondition.Cloudy]: 'cloud',
    [WeatherCondition.Fog]: 'blur-on',
    [WeatherCondition.Drizzle]: 'grain',
    [WeatherCondition.Rain]: 'grain',
    [WeatherCondition.Snow]: 'ac-unit',
    [WeatherCondition.Showers]: 'grain',
    [WeatherCondition.Thunderstorm]: 'thunderstorm',
  };

  return iconMap[condition] || 'wb-cloudy';
};