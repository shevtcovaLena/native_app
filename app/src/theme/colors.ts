// Базовая палитра и light/dark темы для приложения погоды
// Можно расширять по мере добавления новых экранов

import { WeatherCondition } from "@/src/types/weather";

export const Palette = {
  // Базовые оттенки
  blue: {
    400: "#60a5fa",
  },
  slate: {
    900: "#0f172a",
    400: "#9ca3af",
    100: "#e5e7eb",
    50: "#f9fafb",
  },
  orange: {
    400: "#f97316",
  },
} as const;

export const LightThemeColors = {
  /** Цвет текста по умолчанию */
  textPrimary: "#11181C",
  /** Вторичный текст (подзаголовки, описания) */
  textSecondary: "#687076",
  /** Цвет фона экрана */
  background: "#ffffff",
  /** Цвет фона карточек / секций */
  surface: "#f3f4f6",
  /** Основной акцент (кнопки, ссылки, индикаторы) */
  accent: Palette.blue[400],
  /** Цвет ошибки / предупреждений */
  error: Palette.orange[400],
  /** Цвет границ карточек и разделителей */
  border: "#e5e7eb"
} as const;

export const DarkThemeColors = {
  textPrimary: Palette.slate[50],
  textSecondary: Palette.slate[400],
  background: Palette.slate[900],
  surface: "#020617",
  accent: Palette.blue[400],
  error: Palette.orange[400],
  border: "#1e293b",
} as const;

export type AppTheme = {
  colors: typeof LightThemeColors | typeof DarkThemeColors;
};

export const LightTheme: AppTheme = {
  colors: LightThemeColors,
};

export const DarkTheme: AppTheme = {
  colors: DarkThemeColors,
};

/**
 * Цвета для погодных условий
 */
export const WeatherColors = {
  // Солнечная погода (Clear)
  sunny: {
    day: {
      gradientStart: "rgba(255, 200, 100, 0.4)", // Желто-оранжевый с прозрачностью
      gradientEnd: "rgba(255, 150, 50, 0.2)",
      base: "#fff8e1", // Светло-желтый оттенок
    },
    night: {
      gradientStart: "rgba(30, 30, 60, 0.8)", // Темно-синий для ночи
      gradientEnd: "rgba(10, 10, 30, 0.9)",
      base: "#1a1a2e",
    },
  },
  // Облачная погода (Cloudy, PartlyCloudy)
  cloudy: {
    day: {
      gradientStart: "rgba(200, 220, 255, 0.3)", // Небесный оттенок
      gradientEnd: "rgba(255, 200, 100, 0.15)", // Легкий желтый в углу
      base: "#f0f4f8",
    },
    night: {
      gradientStart: "rgba(40, 40, 70, 0.8)",
      gradientEnd: "rgba(20, 20, 40, 0.9)",
      base: "#252540",
    },
  },
  // Дождь (Rain, Drizzle, Showers)
  rain: {
    day: {
      gradientStart: "rgba(150, 180, 220, 0.4)",
      gradientEnd: "rgba(100, 130, 180, 0.3)",
      base: "#e3f2fd",
    },
    night: {
      gradientStart: "rgba(30, 40, 60, 0.8)",
      gradientEnd: "rgba(15, 20, 35, 0.9)",
      base: "#1e2838",
    },
  },
  // Снег (Snow)
  snow: {
    day: {
      gradientStart: "rgba(255, 255, 255, 0.9)", // Белый для верхней половины
      gradientEnd: "rgba(220, 240, 255, 0.5)",
      base: "#f5f9ff",
    },
    night: {
      gradientStart: "rgba(50, 60, 80, 0.8)",
      gradientEnd: "rgba(30, 35, 50, 0.9)",
      base: "#323640",
    },
  },
  // Гроза (Thunderstorm)
  storm: {
    day: {
      gradientStart: "rgba(80, 80, 100, 0.5)",
      gradientEnd: "rgba(60, 60, 80, 0.4)",
      base: "#e8e8f0",
    },
    night: {
      gradientStart: "rgba(20, 20, 40, 0.9)",
      gradientEnd: "rgba(10, 10, 25, 0.95)",
      base: "#0a0a1a",
    },
  },
  // Туман (Fog)
  fog: {
    day: {
      gradientStart: "rgba(200, 200, 210, 0.4)",
      gradientEnd: "rgba(180, 180, 190, 0.3)",
      base: "#f5f5f5",
    },
    night: {
      gradientStart: "rgba(40, 40, 50, 0.8)",
      gradientEnd: "rgba(25, 25, 35, 0.9)",
      base: "#282830",
    },
  },
} as const;

/**
 * Интерфейс для градиентных цветов фона
 */
export interface WeatherBackgroundColors {
  gradientStart: string;
  gradientEnd: string;
  base: string;
}

/**
 * Получить цвета фона в зависимости от погодного условия и времени суток
 * @param condition - погодное условие
 * @param isDaytime - true если день, false если ночь
 * @param isDarkTheme - true если темная тема системы
 * @returns объект с цветами для градиента
 */
export const getWeatherBackgroundColors = (
  condition: WeatherCondition,
  isDaytime: boolean,
  isDarkTheme: boolean
): WeatherBackgroundColors => {
  const timeKey = isDaytime ? "day" : "night";
  
  // Если темная тема системы, используем более темные оттенки даже днем
  const effectiveTimeKey = isDarkTheme && !isDaytime ? "night" : timeKey;

  switch (condition) {
    case WeatherCondition.Clear:
      return WeatherColors.sunny[effectiveTimeKey];
    case WeatherCondition.Cloudy:
    case WeatherCondition.PartlyCloudy:
      return WeatherColors.cloudy[effectiveTimeKey];
    case WeatherCondition.Rain:
    case WeatherCondition.Drizzle:
    case WeatherCondition.Showers:
      return WeatherColors.rain[effectiveTimeKey];
    case WeatherCondition.Snow:
      return WeatherColors.snow[effectiveTimeKey];
    case WeatherCondition.Thunderstorm:
      return WeatherColors.storm[effectiveTimeKey];
    case WeatherCondition.Fog:
      return WeatherColors.fog[effectiveTimeKey];
    default:
      // По умолчанию возвращаем облачную погоду
      return WeatherColors.cloudy[effectiveTimeKey];
  }
};

